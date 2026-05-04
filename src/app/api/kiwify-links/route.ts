import { NextResponse } from "next/server";
import { getKiwifyConfig } from "@/lib/payments";

export const runtime = "nodejs";

export async function GET() {
  const cfg = await getKiwifyConfig();
  return NextResponse.json({ links: cfg.links ?? {} });
}
