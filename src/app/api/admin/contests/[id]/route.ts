import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { getSessionUser } from '@/server/security/auth';
import { Role } from '@/types';

// Fetch details for edit or overview
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === Role.PUBLIC_USER || user.role === Role.STUDENT) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const contest = await db.contest.findUnique({
      where: { id: params.id },
      include: {
        problems: { orderBy: { orderIndex: 'asc' } },
        participants: { include: { user: { select: { name: true, email: true } } } },
        activityLogs: { include: { contest: true }, orderBy: { timestamp: 'desc' } },
      },
    });

    if (!contest) {
      return NextResponse.json({ success: false, message: 'Contest not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, contest });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Modify contest configuration parameters (status, timing, rules, visibility, scoring)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === Role.PUBLIC_USER || user.role === Role.STUDENT) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const updated = await db.contest.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        rules: body.rules,
        status: body.status, // DRAFT, UPCOMING, LIVE, ENDED, CANCELLED
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : undefined,
        durationMinutes: body.durationMinutes ? parseInt(body.durationMinutes, 10) : undefined,
        prizePool: body.prizePool,
        visibility: body.visibility,
        maxParticipants: body.maxParticipants ? parseInt(body.maxParticipants, 10) : undefined,
        scoring: body.scoring,
        penaltyRules: body.penaltyRules ? parseInt(body.penaltyRules, 10) : undefined,
      },
    });

    return NextResponse.json({ success: true, contest: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Delete Contest
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === Role.PUBLIC_USER || user.role === Role.STUDENT) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    await db.contest.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Contest deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
