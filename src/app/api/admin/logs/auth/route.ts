import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rows = await prisma.authLog.findMany({ orderBy: { at: "desc" }, take: 200 });
  return NextResponse.json({ logs: rows });
}
