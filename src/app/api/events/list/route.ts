import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';

export async function GET() {
  const events = await db.event.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { startTime: 'asc' },
    include: { chapter: true, institution: true },
  });

  return NextResponse.json({ events });
}
