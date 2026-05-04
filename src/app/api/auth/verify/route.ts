import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { consumeMagicLink } from "@/lib/magic-link";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return redirectWithError(req, "missing-token");
  }
  const consumed = await consumeMagicLink(token);
  if (!consumed.ok || !consumed.email) {
    return redirectWithError(req, consumed.reason ?? "invalid");
  }

  const user = await prisma.user.findUnique({ where: { email: consumed.email } });
  if (!user) {
    return redirectWithError(req, "user-missing");
  }
  if (!user.active) {
    return redirectWithError(req, "blocked");
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
  await prisma.authLog.create({
    data: { userId: user.id, email: user.email, success: true, ip: null, ua: req.headers.get("user-agent") ?? null },
  });

  // For "reset" purpose, send to settings to set new password; for login/welcome, go home.
  const url = req.nextUrl.clone();
  if (consumed.purpose === "reset") {
    url.pathname = "/configuracoes";
    url.search = "?reset=1";
  } else {
    url.pathname = "/";
    url.search = "";
  }
  return NextResponse.redirect(url);
}

function redirectWithError(req: NextRequest, reason: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?ml_error=${encodeURIComponent(reason)}`;
  return NextResponse.redirect(url);
}
