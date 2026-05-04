import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const [
    totalUsers,
    activeUsers,
    newToday,
    attemptsToday,
    attemptsWeek,
    planBreakdown,
    expiringSoon,
    topRanking,
    recentLogins,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { active: true } }),
    prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.attempt.count({ where: { at: { gte: startOfDay } } }),
    prisma.attempt.count({ where: { at: { gte: startOfWeek } } }),
    prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),
    // assinaturas expirando nos próximos 7 dias
    prisma.user.count({
      where: {
        planUntil: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        plan: { in: ["ALUNO", "TOTAL", "PREMIUM", "FAMILIA", "ANUAL"] },
      },
    }),
    prisma.userState.findMany({
      orderBy: { xp: "desc" },
      take: 10,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.authLog.findMany({
      where: { success: true },
      orderBy: { at: "desc" },
      take: 20,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return NextResponse.json({
    totalUsers,
    activeUsers,
    newToday,
    attemptsToday,
    attemptsWeek,
    expiringSoon,
    planBreakdown: planBreakdown.reduce<Record<string, number>>((acc, p) => {
      acc[p.plan] = p._count._all;
      return acc;
    }, {}),
    topRanking: topRanking.map((s) => ({
      userId: s.userId,
      name: s.user.name,
      email: s.user.email,
      xp: s.xp,
      level: s.level,
      streak: s.streak,
      currentSubject: s.currentSubject,
    })),
    recentLogins: recentLogins.map((l) => ({
      at: l.at,
      name: l.user?.name ?? l.email,
      email: l.email,
      ip: l.ip,
    })),
  });
}
