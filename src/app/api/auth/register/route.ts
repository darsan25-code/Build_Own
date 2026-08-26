import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db/client';
import { hashPassword, createSession } from '@/server/security/auth';
import { checkRateLimit } from '@/server/security/rateLimiter';
import { logAuditEvent } from '@/server/security/auditLogger';
import { Role } from '@/types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  accountType: z.string().default('Student'),
  institutionCode: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(`register_ip_${ip}`, 5, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = registerSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    // Lookup institution if provided
    let institutionId: string | undefined = undefined;
    if (validated.institutionCode) {
      const inst = await db.institution.findUnique({
        where: { code: validated.institutionCode },
      });
      if (inst) institutionId = inst.id;
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase(),
        passwordHash,
        role: Role.STUDENT,
        accountType: validated.accountType,
        isVerified: true, // For demo seamless flow
        institutionId,
      },
    });

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      institutionId: user.institutionId,
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: 'USER_REGISTERED',
      resource: 'User',
      resourceId: user.id,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
