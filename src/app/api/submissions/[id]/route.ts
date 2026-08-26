import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { getSessionUser } from '@/server/security/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    const submission = await db.submission.findUnique({
      where: { id: params.id },
      include: {
        testResults: {
          include: {
            testCase: {
              select: {
                orderIndex: true,
                isHidden: true,
                inputData: true,
                expectedOutput: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }

    // Security check: only allow the owner or an admin to fetch detailed test case logs
    if (submission.userId !== user.id && user.role !== 'CHAPTER_ADMIN' && user.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // Sanitize results: do NOT reveal hidden inputData/expectedOutput to students
    const sanitizedTestResults = submission.testResults.map((r) => {
      const isHidden = r.testCase.isHidden;
      return {
        id: r.id,
        status: r.status,
        executionTimeMs: r.executionTimeMs,
        memoryUsedMb: r.memoryUsedMb,
        score: r.score,
        testCase: {
          orderIndex: r.testCase.orderIndex,
          isHidden: r.testCase.isHidden,
          inputData: isHidden ? '[Hidden Testcase]' : r.testCase.inputData,
          expectedOutput: isHidden ? '[Hidden]' : r.testCase.expectedOutput,
        },
      };
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        contestId: submission.contestId,
        problemId: submission.problemId,
        userId: submission.userId,
        language: submission.language,
        status: submission.status,
        score: submission.score,
        executionTimeMs: submission.executionTimeMs,
        memoryUsedMb: submission.memoryUsedMb,
        submittedAt: submission.submittedAt,
        errorMessage: submission.errorMessage,
        testResults: sanitizedTestResults,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
