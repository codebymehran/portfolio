import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const PASSWORD = process.env.DEVLOG_PASSWORD!;
const KEY = "devlog:entries";

export async function GET() {
  const entries = (await redis.get<object[]>(KEY)) ?? [];
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.password !== PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = (await redis.get<object[]>(KEY)) ?? [];
  const entry = {
    id: `${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    mood: body.mood,
    title: body.title,
    body: body.body ?? "",
    createdAt: Date.now(),
  };
  await redis.set(KEY, [entry, ...entries]);
  return NextResponse.json(entry);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  if (body.password !== PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = (await redis.get<object[]>(KEY)) ?? [];
  await redis.set(KEY, (entries as { id: string }[]).filter(e => e.id !== body.id));
  return NextResponse.json({ ok: true });
}
