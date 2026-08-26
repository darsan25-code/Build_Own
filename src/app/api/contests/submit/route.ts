import { NextResponse } from 'next/server';
import { getSessionUser } from '@/server/security/auth';
import { db } from '@/server/db/client';
import { redis } from '@/server/services/redisService';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated. Please sign in to submit.' }, { status: 401 });
    }

    const rateLimitKey = `rate_submit_${user.id}`;
    const limitCheck = await redis.isRateLimited(rateLimitKey, 5, 60); // 5 submissions per minute limit
    if (limitCheck.limited) {
      return NextResponse.json({ success: false, message: 'Too many submissions. Please wait 60 seconds.' }, { status: 429 });
    }

    const body = await request.json();
    const { contestId, problemId, language, code } = body;

    if (!contestId || !problemId || !code) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Source code size validation (limit to 100KB)
    if (code.length > 100 * 1024) {
      return NextResponse.json({ success: false, message: 'Source code exceeds maximum 100KB limit' }, { status: 400 });
    }

    // 2. Fetch contest and validate timing/status
    const contest = await db.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return NextResponse.json({ success: false, message: 'Contest not found' }, { status: 404 });
    }

    const now = new Date();
    if (contest.status !== 'LIVE' || now < new Date(contest.startTime) || now > new Date(contest.endTime)) {
      return NextResponse.json({ success: false, message: 'Submissions are only allowed during a live contest window' }, { status: 403 });
    }

    // 3. Verify user is registered for the contest
    const participant = await db.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId,
          userId: user.id,
        },
      },
    });

    if (!participant || participant.status === 'DISQUALIFIED') {
      return NextResponse.json({ success: false, message: 'You are not registered or have been disqualified from this contest' }, { status: 403 });
    }

    // 4. Create database entry with status QUEUED
    const submission = await db.submission.create({
      data: {
        contestId,
        problemId,
        userId: user.id,
        language,
        sourceCode: code,
        status: 'QUEUED',
        score: 0,
        executionTimeMs: 0,
        memoryUsedMb: 0.0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Submission queued successfully',
        submissionId: submission.id,
        status: submission.status,
        submission,
      },
      { status: 202 }
    );
  } catch (error: any) {
    console.error('Error queuing submission:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to queue submission' }, { status: 500 });
  }
}
