import { NextResponse } from 'next/server';
import { getContestBySlug } from '@/server/services/contestService';
import { getSessionUser } from '@/server/security/auth';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const user = await getSessionUser();
    const contest = await getContestBySlug(params.slug, user?.id);

    if (!contest) {
      return NextResponse.json({ success: false, message: 'Contest not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, contest });
  } catch (error: any) {
    console.error('Error fetching contest details:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch contest' }, { status: 500 });
  }
}
