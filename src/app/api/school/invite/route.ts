import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { inviteSchoolStudent, removeSchoolStudent } from "@/lib/school";

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
  const result = await inviteSchoolStudent({
    managerId: s.uid,
    email: body.email,
    name: body.name,
    baseUrl,
  });
  if (!result.ok) {
    const map: Record<string, number> = {
      "invalid-email": 400,
      "not-school-manager": 403,
      "package-expired": 402,
      "no-slots": 409,
      "already-member": 409,
      "email-already-registered": 409,
    };
    return NextResponse.json(result, { status: map[result.reason ?? ""] ?? 400 });
  }
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  let body: { studentId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }
  if (!body.studentId) return NextResponse.json({ error: "missing-id" }, { status: 400 });
  const result = await removeSchoolStudent({ managerId: s.uid, studentId: body.studentId });
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
