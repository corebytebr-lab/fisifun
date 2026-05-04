import { prisma } from "@/lib/db";
import { issueMagicLink } from "@/lib/magic-link";
import { SUBJECT_IDS } from "@/lib/plans";
import bcrypt from "bcryptjs";

export interface SchoolStudentRow {
  id: string;
  email: string;
  name: string;
  active: boolean;
  lastLoginAt: Date | null;
  xp: number;
  totalStudyMin: number;
  achievements: number;
}

export interface SchoolManagerInfo {
  id: string;
  email: string;
  name: string;
  schoolSlots: number;
  schoolUntil: Date | null;
  studentsCount: number;
  slotsLeft: number;
  expired: boolean;
}

export async function getSchoolInfo(managerId: string): Promise<SchoolManagerInfo | null> {
  const m = await prisma.user.findUnique({
    where: { id: managerId },
    select: {
      id: true,
      email: true,
      name: true,
      schoolSlots: true,
      schoolUntil: true,
      role: true,
    },
  });
  if (!m) return null;
  if (m.role !== "SCHOOL_MANAGER" || m.schoolSlots == null) return null;
  const studentsCount = await prisma.user.count({ where: { schoolOwnerId: m.id, active: true } });
  const expired = !!m.schoolUntil && m.schoolUntil.getTime() < Date.now();
  return {
    id: m.id,
    email: m.email,
    name: m.name,
    schoolSlots: m.schoolSlots,
    schoolUntil: m.schoolUntil,
    studentsCount,
    slotsLeft: Math.max(0, m.schoolSlots - studentsCount),
    expired,
  };
}

export async function listSchoolStudents(managerId: string): Promise<SchoolStudentRow[]> {
  const students = await prisma.user.findMany({
    where: { schoolOwnerId: managerId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      active: true,
      lastLoginAt: true,
      state: { select: { xp: true, totalStudyMin: true } },
    },
  });
  const ids = students.map((s) => s.id);
  const counts = ids.length
    ? await prisma.auditLog.groupBy({
        by: ["target"],
        where: {
          action: "achievement.unlock",
          target: { in: ids },
        },
        _count: { _all: true },
      })
    : [];
  const cmap = new Map<string, number>();
  for (const c of counts) {
    if (c.target) cmap.set(c.target, c._count._all);
  }
  return students.map((s) => ({
    id: s.id,
    email: s.email,
    name: s.name,
    active: s.active,
    lastLoginAt: s.lastLoginAt,
    xp: s.state?.xp ?? 0,
    totalStudyMin: s.state?.totalStudyMin ?? 0,
    achievements: cmap.get(s.id) ?? 0,
  }));
}

export async function inviteSchoolStudent(args: {
  managerId: string;
  email: string;
  name?: string;
  baseUrl: string;
}): Promise<{ ok: boolean; reason?: string; userId?: string }> {
  const email = args.email.trim().toLowerCase();
  if (!email || !email.includes("@")) return { ok: false, reason: "invalid-email" };

  const info = await getSchoolInfo(args.managerId);
  if (!info) return { ok: false, reason: "not-school-manager" };
  if (info.expired) return { ok: false, reason: "package-expired" };
  if (info.slotsLeft <= 0) return { ok: false, reason: "no-slots" };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.schoolOwnerId === args.managerId) return { ok: false, reason: "already-member" };
    return { ok: false, reason: "email-already-registered" };
  }

  const tmp = Math.random().toString(36).slice(2, 12) + "A1!";
  const passwordHash = await bcrypt.hash(tmp, 10);
  const created = await prisma.user.create({
    data: {
      email,
      name: args.name?.trim() || email.split("@")[0],
      passwordHash,
      role: "STUDENT",
      plan: "ESCOLA",
      planUntil: info.schoolUntil,
      subjectsAllowed: [...SUBJECT_IDS],
      schoolOwnerId: args.managerId,
      state: { create: { data: {} } },
    },
  });

  await issueMagicLink({
    email,
    purpose: "welcome",
    baseUrl: args.baseUrl,
    nameOverride: created.name,
  });

  await prisma.auditLog.create({
    data: {
      actorId: args.managerId,
      action: "school.invite",
      target: created.id,
      meta: { email } as object,
    },
  });

  return { ok: true, userId: created.id };
}

export async function removeSchoolStudent(args: {
  managerId: string;
  studentId: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const student = await prisma.user.findUnique({
    where: { id: args.studentId },
    select: { id: true, schoolOwnerId: true },
  });
  if (!student) return { ok: false, reason: "not-found" };
  if (student.schoolOwnerId !== args.managerId) return { ok: false, reason: "not-your-student" };
  await prisma.user.update({
    where: { id: student.id },
    data: { active: false, schoolOwnerId: null, plan: "BLOCKED", planUntil: null },
  });
  await prisma.auditLog.create({
    data: { actorId: args.managerId, action: "school.remove", target: student.id },
  });
  return { ok: true };
}
