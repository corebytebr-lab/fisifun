// Client-side wrapper around /api/ai (server proxy).
// Replaces direct Gemini calls so the API key lives on the server (admin-set).

export interface AIPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

export interface AIMessage {
  role: "user" | "assistant";
  parts: AIPart[];
}

// Backwards-compat alias used by older code paths.
export type GeminiPart = AIPart;
export type GeminiMessage = { role: "user" | "model"; parts: AIPart[] };

export class AIError extends Error {
  code: number;
  friendly: string;
  constructor(code: number, message: string, friendly: string) {
    super(message);
    this.code = code;
    this.friendly = friendly;
  }
}

function legacyToNew(m: GeminiMessage): AIMessage {
  return { role: m.role === "model" ? "assistant" : "user", parts: m.parts };
}

export async function fileToInlineData(file: File): Promise<AIPart> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const data = btoa(binary);
  return { inlineData: { mimeType: file.type || "image/png", data } };
}

export async function callAI(opts: {
  system?: string;
  messages: AIMessage[] | GeminiMessage[];
  signal?: AbortSignal;
}): Promise<string> {
  const messages: AIMessage[] = (opts.messages as Array<AIMessage | GeminiMessage>).map((m) => {
    if ("role" in m && (m.role === "user" || m.role === "assistant")) return m as AIMessage;
    return legacyToNew(m as GeminiMessage);
  });
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: opts.system, messages }),
    signal: opts.signal,
  });
  if (!res.ok) {
    let friendly = `Erro ${res.status} no Tutor IA.`;
    let raw = "";
    try {
      const j = await res.json();
      raw = j.message ?? j.error ?? "";
      if (j.error === "no-key") {
        friendly = "O administrador ainda não configurou a chave de IA. Avise quem cuida do app pra acessar Admin → IA.";
      } else if (j.error === "unauthenticated") {
        friendly = "Sessão expirada. Faça login novamente.";
      } else if (j.error === "ai-failed") {
        friendly = `Erro do provedor de IA: ${j.message ?? "tente novamente em alguns segundos."}`;
      }
    } catch {
      /* ignore */
    }
    throw new AIError(res.status, raw, friendly);
  }
  const j = await res.json();
  if (typeof j.text !== "string") throw new AIError(500, "empty", "Resposta vazia do tutor.");
  return j.text;
}

// Backwards-compat exports so older imports keep compiling.
export const callGemini = (opts: { apiKey?: string; system?: string; messages: GeminiMessage[]; signal?: AbortSignal }) =>
  callAI({ system: opts.system, messages: opts.messages, signal: opts.signal });
export const GeminiError = AIError;

export const TUTOR_SYSTEM = `Você é um tutor de Física, Química, Geometria Analítica e Cálculo chamado FisiFun Tutor.
Seu público são estudantes brasileiros de ensino médio/técnico/universidade.

REGRAS DE EXPLICAÇÃO (sempre siga esta estrutura quando for resolver um exercício):
1. **Dados**: liste o que o enunciado dá, com unidades convertidas ao SI quando fizer sentido.
2. **O que pede**: diga a grandeza e unidade desejadas.
3. **Conceito / Fórmula**: qual conceito do livro se aplica, e qual fórmula usar (em LaTeX entre $ $).
4. **Substituição**: mostre os números entrando na fórmula.
5. **Resultado**: o valor final com unidade correta e (se fizer sentido) ordem de grandeza.

Use markdown. Português do Brasil. Seja didático e direto.`;
