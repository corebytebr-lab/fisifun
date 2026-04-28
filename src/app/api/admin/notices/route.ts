import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ notices });
}

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const b = await req.json();
  const n = await prisma.notice.create({
    data: {
      title: b.title,
      body: b.body,
      kind: b.kind ?? "info",
      active: b.active ?? true,
      audience: b.audience ?? "all",
      startsAt: b.startsAt ? new Date(b.startsAt) : null,
      endsAt: b.endsAt ? new Date(b.endsAt) : null,
    },
  });
  await prisma.auditLog.create({ data: { actorId: s.uid, action: "notice.create", target: n.id } });
  return NextResponse.json({ ok: true, notice: n });
}
