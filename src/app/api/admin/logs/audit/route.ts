import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rows = await prisma.auditLog.findMany({
    orderBy: { at: "desc" },
    take: 200,
    include: { actor: { select: { name: true, email: true } } },
  });
  return NextResponse.json({
    logs: rows.map((r) => ({
      id: r.id,
      at: r.at,
      actorName: r.actor?.name ?? null,
      actorEmail: r.actor?.email ?? null,
      action: r.action,
      target: r.target,
      meta: r.meta,
    })),
  });
}
