import { NextResponse } from 'next/server';
import { destroySession, getSession } from '@/server/security/auth';
import { logAuditEvent } from '@/server/security/auditLogger';

export async function POST() {
  const session = await getSession();
  if (session) {
    await logAuditEvent({
      actorId: session.userId,
      actorEmail: session.email,
      action: 'USER_LOGOUT',
      resource: 'User',
      resourceId: session.userId,
    });
  }

  await destroySession();
  return NextResponse.json({ success: true });
}
