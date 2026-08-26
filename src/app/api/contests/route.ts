import { NextResponse } from 'next/server';
import { getContests } from '@/server/services/contestService';
import { getSessionUser } from '@/server/security/auth';
import { db } from '@/server/db/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;

    const contests = await getContests(status);
    return NextResponse.json({ success: true, contests });
  } catch (error: any) {
    console.error('Error fetching contests:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch contests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, rules, startTime, endTime, durationMinutes, prizePool, chapterId } = body;

    if (!title || !description || !startTime || !endTime) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

    const contest = await db.contest.create({
      data: {
        title,
        slug,
        description,
        rules: rules || '',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        registrationDeadline: new Date(startTime),
        durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 120,
        prizePool: prizePool || 'Official ACM Certificates & Prizes',
        chapterId: chapterId || undefined,
        creatorId: user.id,
        status: new Date(startTime) <= new Date() && new Date(endTime) >= new Date() ? 'LIVE' : 'UPCOMING',
      },
    });

    return NextResponse.json({ success: true, contest }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating contest:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create contest' }, { status: 500 });
  }
}
