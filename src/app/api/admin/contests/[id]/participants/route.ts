import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { getSessionUser } from '@/server/security/auth';
import { Role } from '@/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === Role.PUBLIC_USER || user.role === Role.STUDENT) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const participants = await db.contestParticipant.findMany({
      where: { contestId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            institution: { select: { name: true } },
          },
        },
      },
      orderBy: { registeredAt: 'desc' },
    });

    const suspiciousLogs = await db.contestActivityLog.findMany({
      where: { contestId: params.id },
      orderBy: { timestamp: 'desc' },
      take: 200,
    });

    // Translate activity logs to include user info
    const resolvedLogs = await Promise.all(
      suspiciousLogs.map(async (log: any) => {
        const u = await db.user.findUnique({
          where: { id: log.userId },
          select: { name: true, email: true },
        });
        return {
          ...log,
          userName: u?.name || 'Unknown',
          userEmail: u?.email || 'Unknown',
        };
      })
    );

    return NextResponse.json({
      success: true,
      participants,
      suspiciousLogs: resolvedLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
