import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db/client';
import { getCurrentUser, isChapterAdminOrOfficer } from '@/server/security/auth';
import { logAuditEvent } from '@/server/security/auditLogger';
import { Role } from '@/types';

const createEventSchema = z.object({
  chapterId: z.string().uuid(),
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.string().default('TECHNICAL_TALK'),
  format: z.string().default('ONLINE'),
  visibility: z.string().default('PUBLIC'),
  maxCapacity: z.number().int().positive().default(100),
  isPaid: z.boolean().default(false),
  price: z.number().nonnegative().default(0.0),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  registrationDeadline: z.string().datetime(),
  location: z.string().default('Online'),
  certificateEligible: z.boolean().default(true),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const data = createEventSchema.parse(body);

    // Authorization check: User must be chapter admin/officer for this chapter or platform admin
    const canManage = await isChapterAdminOrOfficer(user.id, data.chapterId);
    if (!canManage) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to create events for this chapter' },
        { status: 403 }
      );
    }

    const chapter = await db.chapter.findUnique({ where: { id: data.chapterId } });
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;

    const event = await db.event.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        type: data.type,
        format: data.format,
        visibility: data.visibility,
        maxCapacity: data.maxCapacity,
        isPaid: data.isPaid,
        price: data.price,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        registrationDeadline: new Date(data.registrationDeadline),
        location: data.location,
        certificateEligible: data.certificateEligible,
        chapterId: data.chapterId,
        institutionId: chapter.institutionId,
        status: 'PUBLISHED',
      },
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: 'ADMIN_CREATE_EVENT',
      resource: 'Event',
      resourceId: event.id,
      details: { title: event.title, chapterId: data.chapterId },
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const canManage = await isChapterAdminOrOfficer(user.id, event.chapterId);
    if (!canManage) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.event.update({
      where: { id: eventId },
      data: { status: 'CANCELLED' },
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: 'ADMIN_CANCEL_EVENT',
      resource: 'Event',
      resourceId: eventId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to cancel event' }, { status: 500 });
  }
}
