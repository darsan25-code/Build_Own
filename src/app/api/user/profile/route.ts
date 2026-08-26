import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/server/security/auth';
import { db } from '@/server/db/client';
import { logAuditEvent } from '@/server/security/auditLogger';

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  department: z.string().optional(),
  yearOfStudy: z.string().optional(),
  studentId: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = profileUpdateSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: data.name ?? user.name,
        department: data.department ?? user.department,
        yearOfStudy: data.yearOfStudy ?? user.yearOfStudy,
        studentId: data.studentId ?? user.studentId,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : user.avatarUrl,
      },
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: 'USER_PROFILE_UPDATE',
      resource: 'User',
      resourceId: user.id,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        department: updatedUser.department,
        yearOfStudy: updatedUser.yearOfStudy,
        studentId: updatedUser.studentId,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Profile update failed' }, { status: 500 });
  }
}
