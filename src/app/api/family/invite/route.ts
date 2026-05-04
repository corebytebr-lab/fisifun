import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { inviteFamilyMember } from "@/lib/family";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  let body: { email?: string; name?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }
  if (!body.email) return NextResponse.json({ error: "missing-email" }, { status: 400 });

  const baseUrl = process.env.PUBLIC_APP_URL ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  const result = await inviteFamilyMember({
    ownerId: s.uid,
    email: body.email,
    name: body.name,
    baseUrl,
  });

  if (!result.ok) {
    const map: Record<string, number> = {
      "invalid-email": 400,
      "not-family-owner": 403,
      "limit-reached": 409,
      "already-member": 409,
      "email-already-registered": 409,
    };
    return NextResponse.json(result, { status: map[result.reason ?? ""] ?? 400 });
  }
  return NextResponse.json(result);
}
