import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "missing-fields" }, { status: 400 });
    }
    const ip = req.headers.get("x-forwarded-for") ?? "";
    const ua = req.headers.get("user-agent") ?? "";
    const normEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normEmail } });
    if (!user || !user.active) {
      await prisma.authLog.create({ data: { email: normEmail, success: false, ip, ua } });
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      await prisma.authLog.create({ data: { userId: user.id, email: normEmail, success: false, ip, ua } });
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }
    await createSession({
      uid: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      plan: user.plan,
      planUntil: user.planUntil ? user.planUntil.toISOString() : null,
      subjectsAllowed: user.subjectsAllowed,
    });
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await prisma.authLog.create({ data: { userId: user.id, email: normEmail, success: true, ip, ua } });
    return NextResponse.json({
      ok: true,
      user: {
        id: user.id, email: user.email, role: user.role, name: user.name,
        plan: user.plan, planUntil: user.planUntil, subjectsAllowed: user.subjectsAllowed,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}
