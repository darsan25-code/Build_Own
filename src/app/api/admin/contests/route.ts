import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { getSessionUser } from '@/server/security/auth';
import { Role } from '@/types';

// Get all contests for administration
export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === Role.PUBLIC_USER || user.role === Role.STUDENT) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 403 });
    }

    const contests = await db.contest.findMany({
      include: {
        chapter: { select: { name: true, code: true } },
        _count: {
          select: {
            problems: true,
            participants: true,
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, contests });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching contests' }, { status: 500 });
  }
}

// Create new contest
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === Role.PUBLIC_USER || user.role === Role.STUDENT) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      rules,
      startTime,
      endTime,
      registrationDeadline,
      durationMinutes,
      prizePool,
      visibility,
      maxParticipants,
      scoring,
      penaltyRules,
      chapterId,
    } = body;

    if (!title || !description || !startTime || !endTime || !registrationDeadline) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 10000);

    const contest = await db.contest.create({
      data: {
        title,
        slug,
        description,
        rules: rules || 'Standard ACM ICPC collegiate contest guidelines apply.',
        status: 'DRAFT',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        registrationDeadline: new Date(registrationDeadline),
        durationMinutes: parseInt(durationMinutes, 10) || 120,
        prizePool: prizePool || '₹25,000 + ACM Official Certificates',
        visibility: visibility || 'PUBLIC',
        maxParticipants: parseInt(maxParticipants, 10) || 100,
        scoring: scoring || 'STANDARD',
        penaltyRules: parseInt(penaltyRules, 10) || 20,
        chapterId: chapterId || null,
        creatorId: user.id,
      },
    });

    return NextResponse.json({ success: true, contest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error creating contest' }, { status: 500 });
  }
}
