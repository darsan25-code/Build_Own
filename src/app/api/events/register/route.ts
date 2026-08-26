import { NextResponse } from 'next/server';
import { getSession } from '@/server/security/auth';
import { registerForEvent } from '@/server/services/eventService';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { eventId } = await request.json();
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const registration = await registerForEvent(session.userId, eventId);
    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
  }
}
