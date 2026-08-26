import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db/client';
import { verifyPassword, createSession } from '@/server/security/auth';
import { checkRateLimit } from '@/server/security/rateLimiter';
import { logAuditEvent } from '@/server/security/auditLogger';
import { Role } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(`login_ip_${ip}`, 10, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 1 minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = loginSchema.parse(body);
    const email = validated.email.toLowerCase();

    const user = await db.user.findUnique({
      where: { email },
    });

    // Check account lockout
    if (user && user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        { error: 'Account is temporarily locked due to multiple failed login attempts. Try again later.' },
        { status: 423 }
      );
    }

    if (!user || !(await verifyPassword(validated.password, user.passwordHash))) {
      if (user) {
        try {
          const newAttempts = user.failedAttempts + 1;
          const lock = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
          await db.user.update({
            where: { id: user.id },
            data: { failedAttempts: newAttempts, lockedUntil: lock },
          });
        } catch (dbErr) {
          console.warn('[LOGIN] Failed to update attempt counter on read-only filesystem:', dbErr);
        }
      }
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Reset failed attempts on clean login (safely handled for read-only environments)
    try {
      await db.user.update({
        where: { id: user.id },
        data: { failedAttempts: 0, lockedUntil: null },
      });
    } catch (dbErr) {
      console.warn('[LOGIN] Failed to reset attempt counter on read-only filesystem:', dbErr);
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      institutionId: user.institutionId,
    });

    try {
      await logAuditEvent({
        actorId: user.id,
        actorEmail: user.email,
        action: 'USER_LOGIN_SUCCESS',
        resource: 'User',
        resourceId: user.id,
        ipAddress: ip,
      });
    } catch (auditErr) {
      console.warn('[LOGIN] Failed to log audit event on read-only filesystem:', auditErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
