import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAIConfig, setAIConfig } from "@/lib/ai-config";
import { prisma } from "@/lib/db";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const cfg = await getAIConfig();
  // Mask the API key
  const masked = cfg.apiKey ? cfg.apiKey.slice(0, 6) + "•••••" + cfg.apiKey.slice(-4) : "";
  return NextResponse.json({ ...cfg, apiKey: masked, hasKey: !!cfg.apiKey });
}

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json();
  const patch: Record<string, unknown> = {};
  if (body.provider) patch.provider = body.provider;
  if (typeof body.apiKey === "string" && body.apiKey && !body.apiKey.includes("•")) patch.apiKey = body.apiKey;
  if (typeof body.model === "string") patch.model = body.model || null;
  if (typeof body.monthlyQuota === "number") patch.monthlyQuota = body.monthlyQuota;
  const cfg = await setAIConfig(patch);
  await prisma.auditLog.create({ data: { actorId: s.uid, action: "ai-config.update", meta: { provider: cfg.provider } } });
  return NextResponse.json({ ok: true });
}
