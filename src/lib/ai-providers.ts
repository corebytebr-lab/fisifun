// Server-side AI provider abstraction. Supports Gemini, DeepSeek, OpenAI and Claude.

export type AIProvider = "gemini" | "deepseek" | "openai" | "claude";

export interface AIPart {
  text?: string;
  inlineData?: { mimeType: string; data: string }; // base64
}

export interface AIMessage {
  role: "user" | "assistant";
  parts: AIPart[];
}

export interface AICallReq {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  system?: string;
  messages: AIMessage[];
  signal?: AbortSignal;
}

const DEFAULT_MODELS: Record<AIProvider, string[]> = {
  gemini: ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"],
  deepseek: ["deepseek-chat"],
  openai: ["gpt-4o-mini", "gpt-4o"],
  claude: ["claude-3-5-haiku-latest", "claude-3-5-sonnet-latest"],
};

function partsToText(parts: AIPart[]): string {
  return parts.map((p) => p.text ?? "").filter(Boolean).join("\n");
}

async function callGemini(model: string, req: AICallReq): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(req.apiKey)}`;
  const body = {
    contents: req.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: m.parts,
    })),
    systemInstruction: req.system ? { parts: [{ text: req.system }] } : undefined,
    generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: req.signal,
  });
  if (!res.ok) throw new Error(`gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.map((p: AIPart) => p.text).filter(Boolean).join("\n");
  if (!text) throw new Error("gemini: empty response");
  return text;
}

async function callDeepSeek(model: string, req: AICallReq): Promise<string> {
  const messages: { role: string; content: string }[] = [];
  if (req.system) messages.push({ role: "system", content: req.system });
  for (const m of req.messages) {
    messages.push({ role: m.role, content: partsToText(m.parts) });
  }
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${req.apiKey}` },
    body: JSON.stringify({ model, messages, temperature: 0.3 }),
    signal: req.signal,
  });
  if (!res.ok) throw new Error(`deepseek ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) throw new Error("deepseek: empty response");
  return text;
}

async function callOpenAI(model: string, req: AICallReq): Promise<string> {
  const messages: { role: string; content: unknown }[] = [];
  if (req.system) messages.push({ role: "system", content: req.system });
  for (const m of req.messages) {
    const content: unknown[] = [];
    for (const p of m.parts) {
      if (p.text) content.push({ type: "text", text: p.text });
      if (p.inlineData) content.push({ type: "image_url", image_url: { url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}` } });
    }
    messages.push({ role: m.role, content: content.length === 1 && (content[0] as { type: string }).type === "text" ? (content[0] as { text: string }).text : content });
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${req.apiKey}` },
    body: JSON.stringify({ model, messages, temperature: 0.3 }),
    signal: req.signal,
  });
  if (!res.ok) throw new Error(`openai ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) throw new Error("openai: empty response");
  return text;
}

async function callClaude(model: string, req: AICallReq): Promise<string> {
  const messages = req.messages.map((m) => {
    const content: unknown[] = [];
    for (const p of m.parts) {
      if (p.text) content.push({ type: "text", text: p.text });
      if (p.inlineData) content.push({ type: "image", source: { type: "base64", media_type: p.inlineData.mimeType, data: p.inlineData.data } });
    }
    return { role: m.role, content };
  });
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": req.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      messages,
      system: req.system,
      max_tokens: 2048,
    }),
    signal: req.signal,
  });
  if (!res.ok) throw new Error(`claude ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const text = json?.content?.map((c: { type: string; text?: string }) => (c.type === "text" ? c.text : "")).filter(Boolean).join("\n");
  if (!text) throw new Error("claude: empty response");
  return text;
}

export async function callAIServer(req: AICallReq): Promise<string> {
  const models = req.model ? [req.model] : DEFAULT_MODELS[req.provider];
  let lastErr: Error | null = null;
  for (const model of models) {
    try {
      switch (req.provider) {
        case "gemini": return await callGemini(model, req);
        case "deepseek": return await callDeepSeek(model, req);
        case "openai": return await callOpenAI(model, req);
        case "claude": return await callClaude(model, req);
      }
    } catch (e) {
      lastErr = e as Error;
    }
  }
  throw lastErr ?? new Error("All models failed");
}
