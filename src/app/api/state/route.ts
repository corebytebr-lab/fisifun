import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const st = await prisma.userState.findUnique({ where: { userId: s.uid } });
  return NextResponse.json({ state: st?.data ?? null });
}

export async function PUT(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const body = await req.json();
  const data = body.data ?? {};
  type StateBlob = {
    level?: number;
    xp?: number;
    coins?: number;
    streakDays?: number;
    hearts?: number;
    currentSubject?: string;
  };
  const blob = data as StateBlob;
  const meta = {
    level: typeof blob.level === "number" ? blob.level : 1,
    xp: typeof blob.xp === "number" ? blob.xp : 0,
    coins: typeof blob.coins === "number" ? blob.coins : 0,
    streak: typeof blob.streakDays === "number" ? blob.streakDays : 0,
    hearts: typeof blob.hearts === "number" ? blob.hearts : 5,
    currentSubject: typeof blob.currentSubject === "string" ? blob.currentSubject : "fisica",
  };
  await prisma.userState.upsert({
    where: { userId: s.uid },
    update: { data, ...meta },
    create: { userId: s.uid, data, ...meta },
  });
  return NextResponse.json({ ok: true });
}
