import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { Role } from "@prisma/client";

async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return null;
  return s;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await ctx.params;
  const u = await prisma.user.findUnique({
    where: { id },
    include: {
      state: true,
      _count: { select: { attempts: true, wrongs: true, srsItems: true, professorRuns: true } },
    },
  });
  if (!u) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json({ user: u });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await ctx.params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.role === "string" && ["ADMIN", "TEACHER", "STUDENT"].includes(body.role)) data.role = body.role as Role;
  if (typeof body.active === "boolean") data.active = body.active;
  if (typeof body.classGroup === "string") data.classGroup = body.classGroup || null;
  if (typeof body.password === "string" && body.password.length >= 6) {
    data.passwordHash = await bcrypt.hash(body.password, 10);
  }
  const u = await prisma.user.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { actorId: s.uid, action: "user.update", target: id, meta: data as object } });
  return NextResponse.json({ ok: true, user: { id: u.id, email: u.email, name: u.name, role: u.role, active: u.active } });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await ctx.params;
  if (id === s.uid) return NextResponse.json({ error: "cannot-delete-self" }, { status: 400 });
  await prisma.user.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorId: s.uid, action: "user.delete", target: id } });
  return NextResponse.json({ ok: true });
}
