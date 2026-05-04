import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { resolvePlan } from "@/lib/plans";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ user: null });
  const u = await prisma.user.findUnique({
    where: { id: s.uid },
    select: { familyOwnerId: true, schoolSlots: true, plan: true },
  });
  const runtime = resolvePlan({
    plan: s.plan ?? "TRIAL",
    planUntil: s.planUntil ?? null,
    subjectsAllowed: s.subjectsAllowed ?? [],
    role: s.role,
  });
  return NextResponse.json({
    user: {
      id: s.uid,
      email: s.email,
      role: s.role,
      name: s.name,
      plan: s.plan ?? u?.plan ?? "TRIAL",
      planUntil: s.planUntil ?? null,
      subjectsAllowed: s.subjectsAllowed ?? [],
      familyOwnerId: u?.familyOwnerId ?? null,
      schoolSlots: u?.schoolSlots ?? null,
      runtime,
    },
  });
}
