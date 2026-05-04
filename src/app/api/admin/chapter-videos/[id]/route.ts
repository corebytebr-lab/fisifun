import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { parseYouTubeId } from "@/lib/chapter-videos";

// PATCH /api/admin/chapter-videos/<id> { url?, title?, description?, position? }
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.url === "string") {
    const yt = parseYouTubeId(body.url);
    if (!yt) return NextResponse.json({ error: "URL do YouTube inválida" }, { status: 400 });
    data.youtubeId = yt;
  }
  if (typeof body.title === "string") data.title = body.title.slice(0, 200) || null;
  if (typeof body.description === "string") data.description = body.description.slice(0, 1000) || null;
  if (typeof body.position === "number") data.position = body.position;
  const row = await prisma.chapterVideo.update({ where: { id }, data });
  await prisma.auditLog.create({
    data: { actorId: s.uid, action: "chapter-video.update", target: id, meta: data as object },
  });
  return NextResponse.json({ ok: true, video: row });
}

// DELETE /api/admin/chapter-videos/<id>
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.chapterVideo.delete({ where: { id } }).catch(() => null);
  await prisma.auditLog.create({ data: { actorId: s.uid, action: "chapter-video.delete", target: id } });
  return NextResponse.json({ ok: true });
}
