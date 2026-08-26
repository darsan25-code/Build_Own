import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '../server/db/client';
import { executeSandboxCode, normalizeOutput } from '../server/judge/sandbox';

describe('ACM Online Judge & Coding Contest Engine Verification', () => {
  let studentUser: any;
  let testContest: any;
  let testProblem: any;

  beforeAll(async () => {
    studentUser = await db.user.findUnique({ where: { email: 'alex@xyz.edu' } });
    testContest = await db.contest.findUnique({
      where: { slug: 'acm-national-algorithmic-challenge-2026' },
      include: { problems: true },
    });
    testProblem = await db.problem.findFirst({
      where: { contestId: testContest.id, slug: 'two-sum-target' },
    });
  });

  // 1. Code Execution Engine - JavaScript Sandbox
  it('1. Execution Engine: should safely execute JS algorithms and capture standard I/O', async () => {
    const jsCode = `
      const line = readline().trim();
      const [a, b] = line.split(' ').map(Number);
      console.log(a + b);
    `;
    const res = await executeSandboxCode('javascript', jsCode, '15 25', 2000, 256);
    expect(res.status).toBe('ACCEPTED');
    expect(normalizeOutput(res.stdout)).toBe('40');
    expect(res.executionTimeMs).toBeLessThan(1000);
  });

  // 2. Code Execution Engine - Infinite Loop / Timeout Protection
  it('2. Sandbox Safety: should terminate infinite loops with TIME_LIMIT_EXCEEDED', async () => {
    const infiniteCode = `
      while(true) {}
    `;
    const res = await executeSandboxCode('javascript', infiniteCode, '', 500, 256);
    expect(res.status).toBe('TIME_LIMIT_EXCEEDED');
  });

  // 3. Contest Registration
  it('3. Contest Registration: should register participant and avoid duplicates', async () => {
    // Delete existing registration if any for clean test
    await db.contestParticipant.deleteMany({
      where: { contestId: testContest.id, userId: studentUser.id },
    });

    const participant = await db.contestParticipant.create({
      data: {
        contestId: testContest.id,
        userId: studentUser.id,
        status: 'ACTIVE',
      },
    });

    expect(participant).toBeDefined();
    expect(participant.userId).toBe(studentUser.id);
    expect(participant.contestId).toBe(testContest.id);

    // Duplicate check
    await expect(
      db.contestParticipant.create({
        data: {
          contestId: testContest.id,
          userId: studentUser.id,
          status: 'ACTIVE',
        },
      })
    ).rejects.toThrow();
  });

  // 4. Asynchronous Submission Queue Insertion
  it('4. Submission Queue: should insert submission into queue and set status to QUEUED', async () => {
    const validSolution = `
      const parts = readline().trim().split(/\\s+/);
      const n = parseInt(parts[0], 10);
      const target = parseInt(parts[1], 10);
      const nums = readList();
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
          console.log(map.get(complement) + " " + i);
          break;
        }
        map.set(nums[i], i);
      }
    `;

    const sub = await db.submission.create({
      data: {
        contestId: testContest.id,
        problemId: testProblem.id,
        userId: studentUser.id,
        language: 'javascript',
        sourceCode: validSolution,
        status: 'QUEUED',
        score: 0,
        executionTimeMs: 0,
        memoryUsedMb: 0.0,
      },
    });

    expect(sub.id).toBeDefined();
    expect(sub.status).toBe('QUEUED');
    expect(sub.sourceCode).toBe(validSolution);

    // Sleep for 2.5 seconds to let the background worker polling daemon process the submission!
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Retrieve processed submission status from DB
    const processed = await db.submission.findUnique({
      where: { id: sub.id },
    });

    expect(processed).not.toBeNull();
    expect(processed!.status).toBe('ACCEPTED');
    expect(processed!.score).toBe(testProblem.points);

    // Verify LeaderboardEntry is updated correctly
    const leaderboard = await db.leaderboardEntry.findUnique({
      where: { contestId_userId: { contestId: testContest.id, userId: studentUser.id } },
    });

    expect(leaderboard).not.toBeNull();
    expect(leaderboard!.score).toBeGreaterThanOrEqual(20);
  });
});
