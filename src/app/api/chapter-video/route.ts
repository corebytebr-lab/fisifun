import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/chapter-video?chapterId=cap01 → { videos: [{ youtubeId, title, description }] }
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const chapterId = url.searchParams.get("chapterId");
  if (!chapterId) return NextResponse.json({ videos: [] });
  const rows = await prisma.chapterVideo
    .findMany({
      where: { chapterId },
      orderBy: { position: "asc" },
      select: { id: true, youtubeId: true, title: true, description: true, position: true },
    })
    .catch(() => []);
  return NextResponse.json({ videos: rows });
}
