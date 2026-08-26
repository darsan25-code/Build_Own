import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const contest = await db.contest.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    });

    if (!contest) {
      return NextResponse.json({ success: false, message: 'Contest not found' }, { status: 404 });
    }

    const problems = await db.problem.findMany({
      where: { contestId: contest.id },
      select: {
        id: true,
        title: true,
        slug: true,
        orderIndex: true,
        points: true,
      },
      orderBy: { orderIndex: 'asc' },
    });

    const entries = await db.leaderboardEntry.findMany({
      where: { contestId: contest.id },
      orderBy: { rank: 'asc' },
    });

    // Parse problemScores JSON string to object
    const standings = entries.map((e) => ({
      id: e.id,
      userId: e.userId,
      userName: e.userName,
      userEmail: e.userEmail,
      institutionName: e.institutionName,
      rank: e.rank,
      score: e.score,
      totalPenaltyTime: e.totalPenaltyTime,
      problemScores: JSON.parse(e.problemScores || '{}'),
    }));

    return NextResponse.json({
      success: true,
      contest,
      problems,
      standings,
    });
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
