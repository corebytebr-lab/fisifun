import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { applyPaidOrder, getKiwifyConfig, planFromProductName } from "@/lib/payments";
import type { Plan } from "@prisma/client";

export const runtime = "nodejs";

interface KiwifyPayload {
  webhook_event_type?: string;
  order_id?: string;
  order_status?: string;
  Customer?: { email?: string; first_name?: string; last_name?: string };
  Product?: { product_id?: string; product_name?: string };
  Subscription?: { id?: string; status?: string };
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(req: NextRequest) {
  // Read body as raw text so we can verify the signature.
  const raw = await req.text();
  const signature = req.nextUrl.searchParams.get("signature") ?? req.headers.get("x-kiwify-signature");

  const cfg = await getKiwifyConfig();

  // Verify signature when a secret is configured.
  if (cfg.webhookSecret) {
    if (!signature) {
      return NextResponse.json({ error: "missing-signature" }, { status: 401 });
    }
    const expected = crypto.createHmac("sha1", cfg.webhookSecret).update(raw).digest("hex");
    if (!safeEqual(expected, signature)) {
      return NextResponse.json({ error: "invalid-signature" }, { status: 401 });
    }
  }

  let payload: KiwifyPayload;
  try {
    payload = JSON.parse(raw) as KiwifyPayload;
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const event = payload.webhook_event_type ?? payload.order_status ?? "unknown";
  const email = payload.Customer?.email?.toLowerCase().trim();
  const productId = payload.Product?.product_id ?? "";
  const productName = payload.Product?.product_name ?? "";

  // Always store an audit trail for debugging in production.
  await prisma.auditLog.create({
    data: {
      actorId: "system",
      action: `kiwify.${event}`,
      target: email ?? productId ?? "unknown",
      meta: payload as unknown as object,
    },
  });

  // Only treat approved/paid orders as plan grants.
  const isPaid =
    event === "order_approved" ||
    event === "subscription_renewed" ||
    payload.order_status === "paid";

  if (!isPaid || !email) {
    return NextResponse.json({ ok: true, skipped: true, event });
  }

  // Resolve plan: explicit map wins; else heuristic from product name.
  const explicit =
    cfg.productMap[productId] ?? cfg.productMap[productName.toLowerCase()] ?? null;
  const plan: Plan | null = (explicit as Plan) ?? planFromProductName(productName);

  if (!plan) {
    return NextResponse.json({ ok: false, reason: "plan-not-mapped", productId, productName }, { status: 200 });
  }

  const customerName = [payload.Customer?.first_name, payload.Customer?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const baseUrl =
    process.env.PUBLIC_APP_URL ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  const result = await applyPaidOrder({
    email,
    plan,
    subscriptionId: payload.Subscription?.id,
    orderId: payload.order_id ?? "unknown",
    source: "kiwify",
    rawEvent: payload,
    baseUrl,
    customerName: customerName || undefined,
  });

  return NextResponse.json(result);
}

export async function GET() {
  // Sanity check endpoint so you can verify the route is live.
  return NextResponse.json({ ok: true, service: "kiwify-webhook" });
}
