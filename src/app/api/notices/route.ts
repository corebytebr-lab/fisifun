import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ notices: [] });
  const now = new Date();
  const notices = await prisma.notice.findMany({
    where: {
      active: true,
      OR: [
        { startsAt: null, endsAt: null },
        { startsAt: { lte: now }, endsAt: null },
        { startsAt: null, endsAt: { gte: now } },
        { startsAt: { lte: now }, endsAt: { gte: now } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  // audience filter (basic): all / role:ADMIN / classGroup:foo
  const filtered = notices.filter((n) => {
    if (n.audience === "all") return true;
    if (n.audience.startsWith("role:")) return n.audience.split(":")[1] === s.role;
    return true;
  });
  return NextResponse.json({ notices: filtered });
}
