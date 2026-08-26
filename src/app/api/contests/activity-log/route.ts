import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { getSessionUser } from '@/server/security/auth';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { contestId, type, details } = body;

    if (!contestId || !type) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Persist suspicious activity log
    const log = await db.contestActivityLog.create({
      data: {
        contestId,
        userId: user.id,
        type, // TAB_BLUR, COPY_PASTE
        details: details || '',
      },
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
