import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await ctx.params;
  const b = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof b.title === "string") data.title = b.title;
  if (typeof b.body === "string") data.body = b.body;
  if (typeof b.kind === "string") data.kind = b.kind;
  if (typeof b.active === "boolean") data.active = b.active;
  if (typeof b.audience === "string") data.audience = b.audience;
  const n = await prisma.notice.update({ where: { id }, data });
  return NextResponse.json({ ok: true, notice: n });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await ctx.params;
  await prisma.notice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
