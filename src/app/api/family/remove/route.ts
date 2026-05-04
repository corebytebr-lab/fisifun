import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { removeFamilyMember } from "@/lib/family";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  let body: { memberId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }
  if (!body.memberId) return NextResponse.json({ error: "missing-memberId" }, { status: 400 });
  const result = await removeFamilyMember({ ownerId: s.uid, memberId: body.memberId });
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
