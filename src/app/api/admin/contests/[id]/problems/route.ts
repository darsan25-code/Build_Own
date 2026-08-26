import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { getSessionUser } from '@/server/security/auth';
import { Role } from '@/types';

// Get list of problems in a contest
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === Role.PUBLIC_USER || user.role === Role.STUDENT) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const problems = await db.problem.findMany({
      where: { contestId: params.id },
      include: {
        _count: {
          select: { testCases: true },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({ success: true, problems });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Create new coding problem inside a contest
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === Role.PUBLIC_USER || user.role === Role.STUDENT) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      difficulty,
      tags,
      points,
      statement,
      inputFormat,
      outputFormat,
      constraints,
      timeLimitMs,
      memoryLimitMb,
      starterCode,
      orderIndex,
    } = body;

    if (!title || !statement) {
      return NextResponse.json({ success: false, message: 'Missing required problem fields' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const problem = await db.problem.create({
      data: {
        contestId: params.id,
        title,
        slug,
        orderIndex: parseInt(orderIndex, 10) || 1,
        difficulty: difficulty || 'MEDIUM',
        tags: tags || 'Algorithms',
        points: parseInt(points, 10) || 100,
        statement,
        inputFormat,
        outputFormat,
        constraints,
        timeLimitMs: parseInt(timeLimitMs, 10) || 2000,
        memoryLimitMb: parseInt(memoryLimitMb, 10) || 256,
        starterCode: starterCode || '{}',
        authorId: user.id,
      },
    });

    return NextResponse.json({ success: true, problem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
