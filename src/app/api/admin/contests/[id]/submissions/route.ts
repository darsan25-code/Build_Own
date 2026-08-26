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

    const submissions = await db.submission.findMany({
      where: { contestId: params.id },
      include: {
        problem: { select: { title: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { submittedAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, submissions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
