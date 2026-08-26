import { NextResponse } from 'next/server';
import { getProblemForArena } from '@/server/services/contestService';
import { getSessionUser } from '@/server/security/auth';

export async function GET(
  request: Request,
  { params }: { params: { slug: string; problemSlug: string } }
) {
  try {
    const user = await getSessionUser();
    const data = await getProblemForArena(params.slug, params.problemSlug, user?.id);

    if (!data) {
      return NextResponse.json({ success: false, message: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error('Error fetching arena problem:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch problem' }, { status: 500 });
  }
}
