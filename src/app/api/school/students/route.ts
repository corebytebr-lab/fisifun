import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSchoolInfo, listSchoolStudents } from "@/lib/school";

export const runtime = "nodejs";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const info = await getSchoolInfo(s.uid);
  if (!info) {
    return NextResponse.json({ ok: true, isManager: false, info: null, students: [] });
  }
  const students = await listSchoolStudents(s.uid);
  return NextResponse.json({ ok: true, isManager: true, info, students });
}
