import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { issueMagicLink } from "@/lib/magic-link";
import { SUBJECT_IDS } from "@/lib/plans";

export const runtime = "nodejs";

async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return null;
  return s;
}

export async function GET() {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rows = await prisma.user.findMany({
    where: { role: "SCHOOL_MANAGER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      schoolSlots: true,
      schoolUntil: true,
      active: true,
      lastLoginAt: true,
      _count: { select: { schoolStudents: true } },
    },
  });
  return NextResponse.json({
    ok: true,
    managers: rows.map((r) => ({
      id: r.id,
      email: r.email,
      name: r.name,
      schoolSlots: r.schoolSlots ?? 0,
      schoolUntil: r.schoolUntil,
      studentsCount: r._count.schoolStudents,
      active: r.active,
      lastLoginAt: r.lastLoginAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  let body: { email?: string; name?: string; slots?: number; durationDays?: number } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const name = (body.name ?? "").trim() || email.split("@")[0];
  const slots = Math.max(1, Math.floor(body.slots ?? 0));
  const durationDays = Math.max(1, Math.floor(body.durationDays ?? 30));
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "invalid-email" }, { status: 400 });
  }
  if (slots < 1) return NextResponse.json({ error: "invalid-slots" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Convert existing user into a manager (or extend the package)
    const schoolUntil = new Date(Date.now() + durationDays * 86400000);
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: "SCHOOL_MANAGER",
        schoolSlots: slots,
        schoolUntil,
        active: true,
      },
    });
    await prisma.auditLog.create({
      data: {
        actorId: s.uid,
        action: "school-manager.upsert",
        target: updated.id,
        meta: { slots, durationDays } as object,
      },
    });
    return NextResponse.json({ ok: true, id: updated.id, created: false });
  }

  const tmp = Math.random().toString(36).slice(2, 12) + "A1!";
  const passwordHash = await bcrypt.hash(tmp, 10);
  const schoolUntil = new Date(Date.now() + durationDays * 86400000);
  const created = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "SCHOOL_MANAGER",
      plan: "ESCOLA",
      planUntil: schoolUntil,
      subjectsAllowed: [...SUBJECT_IDS],
      schoolSlots: slots,
      schoolUntil,
      state: { create: { data: {} } },
    },
  });

  const baseUrl = process.env.PUBLIC_APP_URL ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  await issueMagicLink({
    email,
    purpose: "welcome",
    baseUrl,
    nameOverride: name,
  });

  await prisma.auditLog.create({
    data: {
      actorId: s.uid,
      action: "school-manager.create",
      target: created.id,
      meta: { slots, durationDays } as object,
    },
  });

  return NextResponse.json({ ok: true, id: created.id, created: true });
}
