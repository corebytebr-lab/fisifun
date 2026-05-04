import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { parseYouTubeId } from "@/lib/chapter-videos";

// GET /api/admin/chapter-videos?chapterId=cap01 (lista de um capítulo)
// GET /api/admin/chapter-videos (todos)
export async function GET(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const url = new URL(req.url);
  const chapterId = url.searchParams.get("chapterId");
  const where = chapterId ? { chapterId } : {};
  const rows = await prisma.chapterVideo.findMany({
    where,
    orderBy: [{ subject: "asc" }, { chapterId: "asc" }, { position: "asc" }],
  });
  return NextResponse.json({ videos: rows });
}

// POST /api/admin/chapter-videos { chapterId, subject, url, title?, description?, position? }
export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json();
  const chapterId = String(body.chapterId || "").trim();
  const subject = String(body.subject || "").trim();
  const youtubeId = parseYouTubeId(String(body.url || ""));
  if (!chapterId || !subject) return NextResponse.json({ error: "missing chapterId/subject" }, { status: 400 });
  if (!youtubeId) return NextResponse.json({ error: "URL do YouTube inválida" }, { status: 400 });
  const title = body.title ? String(body.title).slice(0, 200) : null;
  const description = body.description ? String(body.description).slice(0, 1000) : null;
  // posiciona no final do capítulo se não especificado
  let position = typeof body.position === "number" ? body.position : -1;
  if (position < 0) {
    const last = await prisma.chapterVideo.findFirst({
      where: { chapterId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    position = (last?.position ?? -1) + 1;
  }
  const row = await prisma.chapterVideo.create({
    data: { chapterId, subject, youtubeId, title, description, position },
  });
  await prisma.auditLog.create({
    data: { actorId: s.uid, action: "chapter-video.create", target: row.id, meta: { chapterId, youtubeId } },
  });
  return NextResponse.json({ ok: true, video: row });
}
