import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { redis } from '@/server/services/redisService';

export async function GET() {
  const status: Record<string, string> = {
    db: 'DOWN',
    redis: 'DOWN',
  };

  try {
    // 1. Test database connection
    await db.$queryRaw`SELECT 1`;
    status.db = 'OK';
  } catch (err) {
    status.db = 'ERROR';
  }

  try {
    // 2. Test cache latency
    await redis.set('ready_check', '1', 5);
    status.redis = 'OK';
  } catch (err) {
    status.redis = 'ERROR';
  }

  const allReady = status.db === 'OK' && status.redis === 'OK';

  return NextResponse.json(
    {
      status: allReady ? 'READY' : 'NOT_READY',
      timestamp: new Date().toISOString(),
      services: status,
    },
    { status: allReady ? 200 : 503 }
  );
}
