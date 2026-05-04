import { prisma } from "@/lib/db";
import { issueMagicLink } from "@/lib/magic-link";
import { SUBJECT_IDS } from "@/lib/plans";
import bcrypt from "bcryptjs";

export const FAMILY_MAX_MEMBERS = 4; // owner + 3 invited

export interface FamilyMemberSummary {
  id: string;
  email: string;
  name: string;
  active: boolean;
  lastLoginAt: Date | null;
  isOwner: boolean;
}

export async function getFamilyOwnerId(userId: string): Promise<string | null> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, plan: true, familyOwnerId: true },
  });
  if (!u) return null;
  // If the user is the owner, their plan is FAMILIA and familyOwnerId is null.
  if (u.plan === "FAMILIA" && !u.familyOwnerId) return u.id;
  // If they're a member, return the linked owner.
  return u.familyOwnerId ?? null;
}

export async function listFamilyMembers(ownerId: string): Promise<FamilyMemberSummary[]> {
  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { id: true, email: true, name: true, active: true, lastLoginAt: true },
  });
  const members = await prisma.user.findMany({
    where: { familyOwnerId: ownerId },
    select: { id: true, email: true, name: true, active: true, lastLoginAt: true },
  });
  const out: FamilyMemberSummary[] = [];
  if (owner) out.push({ ...owner, isOwner: true });
  for (const m of members) out.push({ ...m, isOwner: false });
  return out;
}

export async function inviteFamilyMember(args: {
  ownerId: string;
  email: string;
  name?: string;
  baseUrl: string;
}): Promise<{ ok: boolean; reason?: string; userId?: string }> {
  const email = args.email.trim().toLowerCase();
  if (!email || !email.includes("@")) return { ok: false, reason: "invalid-email" };

  const owner = await prisma.user.findUnique({
    where: { id: args.ownerId },
    select: { id: true, plan: true, planUntil: true, familyOwnerId: true },
  });
  if (!owner || owner.plan !== "FAMILIA" || owner.familyOwnerId) {
    return { ok: false, reason: "not-family-owner" };
  }

  const memberCount = await prisma.user.count({ where: { familyOwnerId: owner.id } });
  if (memberCount + 1 >= FAMILY_MAX_MEMBERS) {
    return { ok: false, reason: "limit-reached" };
  }

  // If user already exists as a different account, don't hijack — block.
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.familyOwnerId === owner.id) {
      return { ok: false, reason: "already-member" };
    }
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
      plan: "FAMILIA",
      // Members inherit the owner's expiration
      planUntil: owner.planUntil,
      subjectsAllowed: [...SUBJECT_IDS],
      familyOwnerId: owner.id,
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
      actorId: owner.id,
      action: "family.invite",
      target: created.id,
      meta: { email } as object,
    },
  });

  return { ok: true, userId: created.id };
}

export async function removeFamilyMember(args: {
  ownerId: string;
  memberId: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const member = await prisma.user.findUnique({
    where: { id: args.memberId },
    select: { id: true, familyOwnerId: true },
  });
  if (!member) return { ok: false, reason: "not-found" };
  if (member.familyOwnerId !== args.ownerId) return { ok: false, reason: "not-your-member" };
  // Soft-disable: mark inactive + downgrade so the seat is freed
  await prisma.user.update({
    where: { id: member.id },
    data: {
      active: false,
      familyOwnerId: null,
      plan: "BLOCKED",
      planUntil: null,
    },
  });
  await prisma.auditLog.create({
    data: { actorId: args.ownerId, action: "family.remove", target: member.id },
  });
  return { ok: true };
}
