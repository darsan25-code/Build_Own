import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/security/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      accountType: user.accountType,
      avatarUrl: user.avatarUrl,
      institution: user.institution,
    },
  });
}
