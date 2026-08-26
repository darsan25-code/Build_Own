import { db } from '../db/client';

/**
 * Lists all contests with status filtering
 */
export async function getContests(statusFilter?: string) {
  const where: any = { visibility: 'PUBLIC' };
  if (statusFilter && statusFilter !== 'ALL') {
    where.status = statusFilter;
  }

  const contests = await db.contest.findMany({
    where,
    include: {
      chapter: {
        select: { id: true, name: true, code: true },
      },
      _count: {
        select: {
          participants: true,
          submissions: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return contests;
}

/**
 * Gets a single contest by its slug with full problem list and participant status
 */
export async function getContestBySlug(slug: string, currentUserId?: string) {
  const contest = await db.contest.findUnique({
    where: { slug },
    include: {
      chapter: {
        select: { id: true, name: true, code: true, logoUrl: true },
      },
      problems: {
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          orderIndex: true,
          difficulty: true,
          tags: true,
          points: true,
          timeLimitMs: true,
          memoryLimitMb: true,
        },
      },
      _count: {
        select: {
          participants: true,
          submissions: true,
        },
      },
    },
  });

  if (!contest) return null;

  let isRegistered = false;
  let participantData = null;

  if (currentUserId) {
    participantData = await db.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId: contest.id,
          userId: currentUserId,
        },
      },
    });
    isRegistered = !!participantData;
  }

  return {
    ...contest,
    problems: contest.problems.map((p: any) => ({
      ...p,
      score: p.points,
    })),
    isRegistered,
    participant: participantData,
  };
}

/**
 * Gets full problem details for the Coding Arena (includes sample testcases & starter codes)
 */
export async function getProblemForArena(contestSlug: string, problemSlug: string, userId?: string) {
  const contest = await db.contest.findUnique({
    where: { slug: contestSlug },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      startTime: true,
      endTime: true,
      durationMinutes: true,
      problems: {
        orderBy: { orderIndex: 'asc' },
        select: { id: true, title: true, slug: true, orderIndex: true, points: true, difficulty: true },
      },
    },
  });

  if (!contest) return null;

  // Enforce Authorization:
  // 1. Before contest starts (or if draft/upcoming): Only admins/officers can access
  // 2. After live: Non-admins must be registered participants
  const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
  const isAdmin = user && (
    user.role === 'PLATFORM_ADMIN' ||
    user.role === 'CHAPTER_ADMIN' ||
    user.role === 'FACULTY_COORDINATOR' ||
    user.role === 'CHAPTER_OFFICER'
  );

  const now = new Date();
  const startTime = new Date(contest.startTime);

  if (contest.status === 'DRAFT' || contest.status === 'UPCOMING' || now < startTime) {
    if (!isAdmin) {
      throw new Error('Contest has not started yet. Only administrators can view questions.');
    }
  }

  if (!isAdmin) {
    const registration = await db.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId: contest.id,
          userId: userId || '',
        },
      },
    });
    if (!registration || registration.status !== 'ACTIVE') {
      throw new Error('Access denied. You must be registered to view contest problems.');
    }
  }

  const problem = await db.problem.findUnique({
    where: {
      contestId_slug: {
        contestId: contest.id,
        slug: problemSlug,
      },
    },
    include: {
      testCases: {
        where: { isHidden: false }, // Only expose sample test cases to frontend
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          inputData: true,
          expectedOutput: true,
          explanation: true,
          orderIndex: true,
        },
      },
    },
  });

  if (!problem) return null;

  // Fetch user's previous submissions for this problem
  let submissions: any[] = [];
  if (userId) {
    submissions = await db.submission.findMany({
      where: {
        contestId: contest.id,
        problemId: problem.id,
        userId: userId,
      },
      select: {
        id: true,
        language: true,
        status: true,
        score: true,
        executionTimeMs: true,
        submittedAt: true,
      },
      orderBy: { submittedAt: 'desc' },
      take: 10,
    });
  }

  // Parse starter codes
  let starterCodeParsed: Record<string, string> = {
    javascript: `// Complete the function below\nfunction solve() {\n  // Read input using readline() or process input\n  const line = readline();\n  console.log(line);\n}\nsolve();`,
    python: `# Complete the solution below\ndef solve():\n    import sys\n    input_data = sys.stdin.read().strip()\n    # Process your logic\n    print(input_data)\n\nif __name__ == '__main__':\n    solve()`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
    java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write solution here\n    }\n}`,
  };

  try {
    if (problem.starterCode && problem.starterCode.startsWith('{')) {
      starterCodeParsed = { ...starterCodeParsed, ...JSON.parse(problem.starterCode) };
    }
  } catch {
    // fallback
  }

  return {
    contest: {
      ...contest,
      problems: contest.problems.map((p: any) => ({
        ...p,
        score: p.points,
      })),
    },
    problem: {
      ...problem,
      score: problem.points,
      starterCode: starterCodeParsed,
    },
    sampleTestCases: problem.testCases,
    userSubmissions: submissions,
  };
}

/**
 * Registers a user for a contest
 */
export async function registerForContest(userId: string, contestId: string) {
  const existing = await db.contestParticipant.findUnique({
    where: {
      contestId_userId: {
        contestId,
        userId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  const participant = await db.contestParticipant.create({
    data: {
      contestId,
      userId,
      status: 'ACTIVE',
    },
    include: {
      contest: { select: { title: true } },
    },
  });

  // Create notification
  await db.notification.create({
    data: {
      userId,
      title: 'Contest Registration Successful',
      message: `You are successfully registered for "${participant.contest.title}". Ready your compiler!`,
      type: 'SUCCESS',
      link: `/contests/${contestId}`,
    },
  });

  return participant;
}
