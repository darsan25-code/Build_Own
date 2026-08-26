import { NextResponse } from 'next/server';
import { getSessionUser } from '@/server/security/auth';
import { db } from '@/server/db/client';
import { registerForContest } from '@/server/services/contestService';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Please login to register for this contest' }, { status: 401 });
    }

    const contest = await db.contest.findUnique({
      where: { slug: params.slug },
    });

    if (!contest) {
      return NextResponse.json({ success: false, message: 'Contest not found' }, { status: 404 });
    }

    const participant = await registerForContest(user.id, contest.id);

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for contest',
      participant,
    });
  } catch (error: any) {
    console.error('Error registering for contest:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to register' }, { status: 500 });
  }
}
