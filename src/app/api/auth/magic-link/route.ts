import { NextRequest, NextResponse } from "next/server";
import { issueMagicLink } from "@/lib/magic-link";

export const runtime = "nodejs";

function getBaseUrl(req: NextRequest): string {
  const env = process.env.PUBLIC_APP_URL;
  if (env) return env;
  const url = req.nextUrl.clone();
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: NextRequest) {
  let body: { email?: string; purpose?: "login" | "reset" } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const purpose = body.purpose === "reset" ? "reset" : "login";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "invalid-email" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    undefined;
  const ua = req.headers.get("user-agent") ?? undefined;

  const result = await issueMagicLink({
    email,
    purpose,
    baseUrl: getBaseUrl(req),
    ip,
    ua,
  });

  // Always 200 — never leak whether the email is registered.
  return NextResponse.json({ ok: true, sent: result.emailSent ?? false });
}
