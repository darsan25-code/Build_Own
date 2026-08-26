import { PrismaClient } from '@prisma/client';
import { executeSandboxCode, normalizeOutput } from './sandbox';

const db = new PrismaClient();

async function updateLeaderboard(contestId: string, userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { institution: true },
    });
    if (!user) return;

    // Get best submission scores for each problem in this contest for this user
    const bestSubmissions = await db.submission.groupBy({
      by: ['problemId'],
      where: {
        contestId,
        userId,
        status: 'ACCEPTED',
      },
      _max: {
        score: true,
      },
    });

    const problems = await db.problem.findMany({
      where: { contestId },
    });

    // Sum scores of best submissions
    const totalScore = bestSubmissions.reduce((sum: number, curr: any) => sum + (curr._max.score || 0), 0);

    // Count solved problems (fully accepted)
    const solvedCount = bestSubmissions.length;

    // Calculate penalty time (sum of time taken for first accepted submission per problem)
    let totalPenaltyTime = 0;
    const problemScoresRecord: Record<string, any> = {};

    for (const p of problems) {
      const bestSub = await db.submission.findFirst({
        where: { contestId, problemId: p.id, userId, status: 'ACCEPTED' },
        orderBy: { submittedAt: 'asc' },
      });

      if (bestSub) {
        // Count wrong submissions before the accepted one
        const wrongSubmissionsCount = await db.submission.count({
          where: {
            contestId,
            problemId: p.id,
            userId,
            submittedAt: { lt: bestSub.submittedAt },
            status: { notIn: ['ACCEPTED', 'QUEUED', 'COMPILING', 'RUNNING'] },
          },
        });

        const contest = await db.contest.findUnique({ where: { id: contestId } });
        const start = contest ? new Date(contest.startTime).getTime() : 0;
        const subTime = new Date(bestSub.submittedAt).getTime();
        const minutesDiff = Math.max(0, Math.floor((subTime - start) / 60000));

        const penaltyMinutes = minutesDiff + wrongSubmissionsCount * (contest?.penaltyRules ?? 20);
        totalPenaltyTime += penaltyMinutes;

        problemScoresRecord[p.slug] = {
          score: bestSub.score,
          time: minutesDiff,
          penalty: penaltyMinutes,
        };
      }
    }

    // Update leaderboard entry
    await db.leaderboardEntry.upsert({
      where: {
        contestId_userId: { contestId, userId },
      },
      update: {
        userName: user.name,
        userEmail: user.email,
        institutionName: user.institution?.name || 'Independent',
        score: totalScore,
        totalPenaltyTime,
        problemScores: JSON.stringify(problemScoresRecord),
        updatedAt: new Date(),
      },
      create: {
        contestId,
        userId,
        userName: user.name,
        userEmail: user.email,
        institutionName: user.institution?.name || 'Independent',
        score: totalScore,
        totalPenaltyTime,
        problemScores: JSON.stringify(problemScoresRecord),
        rank: 1,
      },
    });

    // Re-calculate ranks for all entries in the contest
    const entries = await db.leaderboardEntry.findMany({
      where: { contestId },
      orderBy: [
        { score: 'desc' },
        { totalPenaltyTime: 'asc' },
        { updatedAt: 'asc' },
      ],
    });

    for (let i = 0; i < entries.length; i++) {
      await db.leaderboardEntry.update({
        where: { id: entries[i].id },
        data: { rank: i + 1 },
      });
    }

    console.log(`[LEADERBOARD] Recalculated ranking for user ${user.email} in contest ${contestId}`);
  } catch (err) {
    console.error('[LEADERBOARD_ERROR]', err);
  }
}

async function processSubmission(submissionId: string) {
  console.log(`[WORKER] Processing submission ${submissionId}...`);
  try {
    const submission = await db.submission.findUnique({
      where: { id: submissionId },
      include: {
        problem: {
          include: { testCases: true },
        },
      },
    });

    if (!submission) {
      console.error(`[WORKER] Submission ${submissionId} not found.`);
      return;
    }

    // Set state to RUNNING
    await db.submission.update({
      where: { id: submissionId },
      data: { status: 'RUNNING' },
    });

    const testcases = submission.problem.testCases;
    let passedCount = 0;
    let earnedPoints = 0;
    let maxExecutionTime = 0;
    let maxMemoryUsed = 0;
    let firstFailingStatus = 'ACCEPTED';
    let errorLog = '';

    // Clear any previous test results
    await db.submissionTestResult.deleteMany({
      where: { submissionId },
    });

    for (const tc of testcases) {
      const execResult = await executeSandboxCode(
        submission.language,
        submission.sourceCode,
        tc.inputData,
        submission.problem.timeLimitMs,
        submission.problem.memoryLimitMb
      );

      if (execResult.executionTimeMs > maxExecutionTime) {
        maxExecutionTime = execResult.executionTimeMs;
      }
      if (execResult.memoryUsedMb > maxMemoryUsed) {
        maxMemoryUsed = execResult.memoryUsedMb;
      }

      const normalizedActual = normalizeOutput(execResult.stdout);
      const normalizedExpected = normalizeOutput(tc.expectedOutput);

      let tcPassed = false;
      let tcStatus = execResult.status;

      if (execResult.status === 'ACCEPTED') {
        if (normalizedActual === normalizedExpected) {
          tcPassed = true;
          passedCount++;
          earnedPoints += tc.weight;
          tcStatus = 'ACCEPTED';
        } else {
          tcStatus = 'WRONG_ANSWER';
          if (firstFailingStatus === 'ACCEPTED') firstFailingStatus = 'WRONG_ANSWER';
        }
      } else {
        if (firstFailingStatus === 'ACCEPTED') firstFailingStatus = execResult.status;
        if (execResult.stderr) errorLog = execResult.stderr;
      }

      // Save Test Result
      await db.submissionTestResult.create({
        data: {
          submissionId,
          testCaseId: tc.id,
          status: tcStatus,
          executionTimeMs: execResult.executionTimeMs,
          memoryUsedMb: execResult.memoryUsedMb,
          score: tcPassed ? tc.weight : 0,
        },
      });
    }

    const finalStatus = passedCount === testcases.length ? 'ACCEPTED' : firstFailingStatus;

    // Save final submission score & details
    await db.submission.update({
      where: { id: submissionId },
      data: {
        status: finalStatus,
        score: earnedPoints,
        executionTimeMs: maxExecutionTime,
        memoryUsedMb: maxMemoryUsed,
        errorMessage: errorLog || null,
      },
    });

    console.log(`[WORKER] Finished submission ${submissionId}. Verdict: ${finalStatus}. Passed ${passedCount}/${testcases.length} cases.`);

    // Recalculate leaderboard
    await updateLeaderboard(submission.contestId, submission.userId);
  } catch (err: any) {
    console.error(`[WORKER_FAIL] Failed processing ${submissionId}:`, err);
    await db.submission.update({
      where: { id: submissionId },
      data: { status: 'SYSTEM_ERROR', errorMessage: err.message || String(err) },
    });
  }
}

async function startWorker() {
  console.log('🚀 ACM ONLINE JUDGE WORKER PROCESS RUNNING...');
  while (true) {
    try {
      const nextSubmission = await db.submission.findFirst({
        where: { status: 'QUEUED' },
        orderBy: { submittedAt: 'asc' },
      });

      if (nextSubmission) {
        await processSubmission(nextSubmission.id);
      } else {
        // Sleep for 1000ms if no jobs in queue
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (e) {
      console.error('[WORKER_LOOP_ERROR]', e);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

startWorker();
