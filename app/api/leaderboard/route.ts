// app/api/leaderboard/route.ts
import { createClient } from 'redis';
import { NextResponse } from 'next/server';

interface LeaderboardEntry {
  name: string;
  moves: number;
  time: number;
  date: string;
}

// Create Redis client singleton
let redis: ReturnType<typeof createClient> | null = null;

async function getRedis() {
  if (redis) return redis;

  const redisUrl = process.env.VERCEL_KV_REDIS_URL || process.env.REDIS_URL;

  if (!redisUrl) {
    console.error('❌ Missing Redis URL environment variable!');
    return null;
  }

  try {
    redis = createClient({
      url: redisUrl,
    });

    await redis.connect();
    console.log('✅ Redis connected successfully');
    return redis;
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    return null;
  }
}

// GET top 10 scores
export async function GET() {
  try {
    const client = await getRedis();

    if (!client) {
      console.warn('⚠️  Redis not available, returning empty leaderboard');
      return NextResponse.json([]);
    }

    // ZRANGE: get lowest scores (best players) from sorted set
    const results = await client.zRange('leaderboard', 0, 9);

    if (!results || results.length === 0) {
      return NextResponse.json([]);
    }

    // Parse each entry - handle both string and object formats
    const parsed: LeaderboardEntry[] = results
      .map(item => {
        try {
          // If it's already an object, return it
          if (typeof item === 'object' && item !== null) {
            return item as LeaderboardEntry;
          }
          // If it's a string, parse it
          if (typeof item === 'string') {
            return JSON.parse(item);
          }
          console.error('Unexpected item type:', typeof item, item);
          return null;
        } catch (e) {
          console.error('Failed to parse leaderboard entry:', item, e);
          return null;
        }
      })
      .filter((entry): entry is LeaderboardEntry => entry !== null);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Leaderboard GET error:', error);
    return NextResponse.json([]);
  }
}

// POST new score
export async function POST(req: Request) {
  try {
    const client = await getRedis();

    if (!client) {
      console.warn('⚠️  Redis not available, cannot save score');
      return NextResponse.json({ error: 'Storage not available' }, { status: 503 });
    }

    const body: LeaderboardEntry = await req.json();

    // Score formula: lower moves = better, tie-breaker = time
    const score = body.moves * 1000 + body.time;

    // Store as JSON string to ensure consistency
    const memberValue = JSON.stringify(body);

    // Add to sorted set (ZADD)
    await client.zAdd('leaderboard', {
      score: score,
      value: memberValue,
    });

    // Keep only top 50 scores (remove rank 50 onwards)
    await client.zRemRangeByRank('leaderboard', 50, -1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leaderboard POST error:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
