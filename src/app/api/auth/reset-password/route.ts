import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  let body: { password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }
  const password = (body.password ?? "").trim();
  if (password.length < 6) {
    return NextResponse.json({ error: "weak-password" }, { status: 400 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: s.uid }, data: { passwordHash } });
  await prisma.auditLog.create({
    data: { actorId: s.uid, action: "auth.password-changed", target: s.uid },
  });
  return NextResponse.json({ ok: true });
}
