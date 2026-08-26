import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { getSessionUser } from '@/server/security/auth';
import { Role } from '@/types';

// Get list of testcases for a problem (Admins authorized to view all)
export async function GET(
  request: Request,
  { params }: { params: { id: string; problemId: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === Role.PUBLIC_USER || user.role === Role.STUDENT) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const testCases = await db.problemTestCase.findMany({
      where: { problemId: params.problemId },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({ success: true, testCases });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Upload/Create new testcase (public sample or hidden evaluation)
export async function POST(
  request: Request,
  { params }: { params: { id: string; problemId: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === Role.PUBLIC_USER || user.role === Role.STUDENT) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { inputData, expectedOutput, isHidden, explanation, weight, orderIndex } = body;

    if (inputData === undefined || expectedOutput === undefined) {
      return NextResponse.json({ success: false, message: 'Missing input data or expected output' }, { status: 400 });
    }

    const testCase = await db.problemTestCase.create({
      data: {
        problemId: params.problemId,
        inputData: String(inputData),
        expectedOutput: String(expectedOutput),
        isHidden: !!isHidden,
        explanation: explanation || null,
        weight: parseInt(weight, 10) || 10,
        orderIndex: parseInt(orderIndex, 10) || 1,
      },
    });

    return NextResponse.json({ success: true, testCase }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
