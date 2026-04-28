import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAIConfig } from "@/lib/ai-config";
import { callAIServer, type AIMessage } from "@/lib/ai-providers";

export const runtime = "nodejs";
export const maxDuration = 60;

interface AIBody {
  system?: string;
  messages: AIMessage[];
}

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const cfg = await getAIConfig();
  if (!cfg.apiKey) {
    return NextResponse.json({ error: "no-key", message: "Administrador ainda não configurou a IA. Acesse Admin → IA." }, { status: 503 });
  }
  let body: AIBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "no-messages" }, { status: 400 });
  }
  try {
    const text = await callAIServer({
      provider: cfg.provider,
      apiKey: cfg.apiKey,
      model: cfg.model || undefined,
      system: body.system,
      messages: body.messages,
    });
    return NextResponse.json({ text, provider: cfg.provider });
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json({ error: "ai-failed", message: msg }, { status: 502 });
  }
}
