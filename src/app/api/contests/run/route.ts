import { NextResponse } from 'next/server';
import { executeSandboxCode } from '@/server/judge/sandbox';
import { db } from '@/server/db/client';
import { getSessionUser } from '@/server/security/auth';
import { redis } from '@/server/services/redisService';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    const rateLimitKey = `rate_run_${user?.id || 'anonymous'}`;
    const limitCheck = await redis.isRateLimited(rateLimitKey, 10, 60);
    if (limitCheck.limited) {
      return NextResponse.json({ success: false, message: 'Too many execution requests. Please wait 60 seconds.' }, { status: 429 });
    }

    const body = await request.json();
    const { language, code, input, problemId } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: 'Code cannot be empty' }, { status: 400 });
    }

    let activeInput = input || '';

    // If a problemId is specified, we run it against its sample test cases
    if (problemId) {
      const sample = await db.problemTestCase.findFirst({
        where: { problemId, isHidden: false },
        orderBy: { orderIndex: 'asc' },
      });
      if (sample) {
        activeInput = sample.inputData;
      }
    }

    // Run in isolated VM sandbox
    const result = await executeSandboxCode(
      language || 'javascript',
      code,
      activeInput,
      2000, // time limit
      256   // memory limit
    );

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error running code:', error);
    return NextResponse.json({ success: false, message: error.message || 'Execution error' }, { status: 500 });
  }
}
