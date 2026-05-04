import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return null;
  return s;
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await ctx.params;
  let body: { slots?: number; extendDays?: number; active?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const data: {
    schoolSlots?: number;
    schoolUntil?: Date;
    planUntil?: Date;
    active?: boolean;
  } = {};
  if (typeof body.slots === "number" && body.slots > 0) {
    data.schoolSlots = Math.floor(body.slots);
  }
  if (typeof body.extendDays === "number" && body.extendDays > 0) {
    const cur = await prisma.user.findUnique({
      where: { id },
      select: { schoolUntil: true },
    });
    const base = cur?.schoolUntil && cur.schoolUntil.getTime() > Date.now() ? cur.schoolUntil : new Date();
    const newDate = new Date(base.getTime() + body.extendDays * 86400000);
    data.schoolUntil = newDate;
    data.planUntil = newDate;
  }
  if (typeof body.active === "boolean") data.active = body.active;

  const updated = await prisma.user.update({ where: { id }, data });
  await prisma.auditLog.create({
    data: {
      actorId: s.uid,
      action: "school-manager.update",
      target: id,
      meta: body as object,
    },
  });
  return NextResponse.json({ ok: true, id: updated.id });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await ctx.params;
  // Soft revoke: deactivate manager and their students
  await prisma.user.updateMany({
    where: { schoolOwnerId: id },
    data: { active: false, plan: "BLOCKED", planUntil: null },
  });
  await prisma.user.update({
    where: { id },
    data: { active: false, role: "STUDENT", schoolSlots: null, schoolUntil: null },
  });
  await prisma.auditLog.create({
    data: { actorId: s.uid, action: "school-manager.revoke", target: id },
  });
  return NextResponse.json({ ok: true });
}
