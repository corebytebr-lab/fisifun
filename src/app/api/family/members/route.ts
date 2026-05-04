import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFamilyOwnerId, listFamilyMembers } from "@/lib/family";

export const runtime = "nodejs";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const ownerId = await getFamilyOwnerId(s.uid);
  if (!ownerId) return NextResponse.json({ ok: true, isFamily: false, members: [] });
  const members = await listFamilyMembers(ownerId);
  return NextResponse.json({
    ok: true,
    isFamily: true,
    isOwner: ownerId === s.uid,
    ownerId,
    members,
  });
}
