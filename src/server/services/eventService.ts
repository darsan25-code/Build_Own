import { db } from '../db/client';
import { logAuditEvent } from '../security/auditLogger';
import { checkRateLimit } from '../security/rateLimiter';
import { RegistrationStatus } from '@/types';
import { redis } from './redisService';

export async function registerForEvent(userId: string, eventId: string) {
  // 1. Rate limiting
  const rateLimit = await checkRateLimit(`register_${userId}`, 10, 60 * 1000);
  if (!rateLimit.success) {
    throw new Error('Too many registration attempts. Please try again shortly.');
  }

  // 2. Distributed lock to prevent race conditions on capacity across multiple instances
  const lockKey = `lock_event_reg_${eventId}`;
  const lockAcquired = await redis.acquireLock(lockKey, 5000);
  if (!lockAcquired) {
    throw new Error('Server is busy processing event registrations. Please try again.');
  }

  try {
    // 3. Perform transaction-safe registration with atomic capacity enforcement
    const registration = await db.$transaction(async (tx) => {
      // Fetch event with row lock / transaction visibility
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

    if (!event) {
      throw new Error('Event not found.');
    }

    if (event.status !== 'PUBLISHED') {
      throw new Error('This event is currently not accepting registrations.');
    }

    if (new Date() > new Date(event.registrationDeadline)) {
      throw new Error('Registration deadline for this event has passed.');
    }

    // Check existing registration
    const existing = await tx.eventRegistration.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    if (existing) {
      throw new Error('You are already registered for this event.');
    }

    // Check capacity limit
    const currentCount = await tx.eventRegistration.count({
      where: { eventId, status: RegistrationStatus.CONFIRMED },
    });

    let status = RegistrationStatus.CONFIRMED;
    if (currentCount >= event.maxCapacity) {
      status = RegistrationStatus.WAITLISTED;
    }

    // Unique registration code
    const registrationCode = `REG-${event.slug.toUpperCase().substring(0, 10)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create registration
    const createdReg = await tx.eventRegistration.create({
      data: {
        eventId,
        userId,
        registrationCode,
        status,
      },
      include: { event: true, user: true },
    });

    // Update registration count if confirmed
    if (status === RegistrationStatus.CONFIRMED) {
      await tx.event.update({
        where: { id: eventId },
        data: { currentRegistrations: { increment: 1 } },
      });
    }

      return createdReg;
    });

    // Log audit event outside transaction
    await logAuditEvent({
      actorId: userId,
      actorEmail: registration.user.email,
      action: 'EVENT_REGISTRATION',
      resource: 'Event',
      resourceId: eventId,
      details: { registrationCode: registration.registrationCode, status: registration.status },
    });

    return registration;
  } finally {
    await redis.releaseLock(lockKey);
  }
}

export async function cancelRegistration(userId: string, eventId: string) {
  const result = await db.$transaction(async (tx) => {
    const existing = await tx.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    if (!existing) {
      throw new Error('Registration record not found.');
    }

    await tx.eventRegistration.delete({
      where: { id: existing.id },
    });

    if (existing.status === RegistrationStatus.CONFIRMED) {
      await tx.event.update({
        where: { id: eventId },
        data: { currentRegistrations: { decrement: 1 } },
      });
    }

    return { success: true, registrationId: existing.id };
  });

  await logAuditEvent({
    actorId: userId,
    action: 'CANCEL_REGISTRATION',
    resource: 'Event',
    resourceId: eventId,
  });

  return { success: true };
}
