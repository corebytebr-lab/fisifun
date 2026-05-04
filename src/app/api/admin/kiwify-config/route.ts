import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getKiwifyConfig, setKiwifyConfig, type KiwifyConfig } from "@/lib/payments";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return null;
  return s;
}

export async function GET() {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const cfg = await getKiwifyConfig();
  // mask the secret
  const masked = cfg.webhookSecret ? cfg.webhookSecret.slice(0, 4) + "•••••" : "";
  return NextResponse.json({
    ...cfg,
    webhookSecret: masked,
    hasSecret: !!cfg.webhookSecret,
  });
}

export async function POST(req: NextRequest) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json();
  const patch: Partial<KiwifyConfig> = {};
  if (typeof body.webhookSecret === "string" && body.webhookSecret && !body.webhookSecret.includes("•")) {
    patch.webhookSecret = body.webhookSecret.trim();
  }
  if (body.productMap && typeof body.productMap === "object") {
    patch.productMap = body.productMap as KiwifyConfig["productMap"];
  }
  if (body.links && typeof body.links === "object") {
    patch.links = body.links as KiwifyConfig["links"];
  }
  const cfg = await setKiwifyConfig(patch);
  await prisma.auditLog.create({
    data: { actorId: s.uid, action: "kiwify-config.update", meta: { keys: Object.keys(patch) } },
  });
  return NextResponse.json({ ok: true, links: cfg.links, productMap: cfg.productMap });
}
