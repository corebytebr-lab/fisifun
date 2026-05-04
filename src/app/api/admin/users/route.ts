import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { Role, Plan } from "@prisma/client";
import { PLANS, SUBJECT_IDS } from "@/lib/plans";

async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return null;
  return s;
}

export async function GET(req: NextRequest) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const role = req.nextUrl.searchParams.get("role") as Role | null;
  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }
  if (role && ["ADMIN", "TEACHER", "STUDENT"].includes(role)) where.role = role;
  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      classGroup: true,
      plan: true,
      planUntil: true,
      subjectsAllowed: true,
      createdAt: true,
      lastLoginAt: true,
      state: { select: { level: true, xp: true, streak: true, currentSubject: true } },
    },
    take: 500,
  });
  return NextResponse.json({ users });
}

function normalizePlanInput(body: Record<string, unknown>): {
  plan: Plan;
  planUntil: Date | null;
  subjectsAllowed: string[];
} {
  const plan = (body.plan as Plan) ?? "TRIAL";
  const info = PLANS[plan] ?? PLANS.TRIAL;
  let planUntil: Date | null = null;
  if (typeof body.planUntil === "string" && body.planUntil) {
    const d = new Date(body.planUntil);
    if (!Number.isNaN(d.getTime())) planUntil = d;
  } else if (info.defaultDurationDays != null) {
    planUntil = new Date(Date.now() + info.defaultDurationDays * 86400000);
  }
  let subjectsAllowed: string[] = [];
  if (info.subjectAccess === "single") {
    const raw = (body.subjectsAllowed as string[] | undefined) ?? [];
    const valid = raw.filter((s) => (SUBJECT_IDS as readonly string[]).includes(s));
    subjectsAllowed = valid.length > 0 ? [valid[0]] : ["fisica"];
  } else if (info.subjectAccess === "all") {
    subjectsAllowed = [...SUBJECT_IDS];
  }
  return { plan, planUntil, subjectsAllowed };
}

export async function POST(req: NextRequest) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json();
  const email = (body.email as string)?.trim().toLowerCase();
  const password = body.password as string;
  const name = (body.name as string)?.trim();
  const role = (body.role as Role) ?? "STUDENT";
  const classGroup = body.classGroup as string | undefined;
  if (!email || !password || !name) return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "weak-password" }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "email-exists" }, { status: 409 });
  const passwordHash = await bcrypt.hash(password, 10);
  const { plan, planUntil, subjectsAllowed } = normalizePlanInput(body);
  const u = await prisma.user.create({
    data: {
      email, name, passwordHash, role, classGroup,
      plan, planUntil, subjectsAllowed,
      state: { create: { data: {} } },
    },
  });
  await prisma.auditLog.create({ data: { actorId: s.uid, action: "user.create", target: u.id, meta: { email, role, plan } } });
  return NextResponse.json({
    ok: true,
    user: { id: u.id, email: u.email, name: u.name, role: u.role, plan: u.plan, planUntil: u.planUntil, subjectsAllowed: u.subjectsAllowed },
  });
}
