// Minimal Gemini client that runs 100% in the browser.
// Docs: https://ai.google.dev/api/generate-content
// Free tier: Gemini 2.0 Flash via AI Studio, sem cartão.

const MODEL = "gemini-2.0-flash";

export interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string }; // base64 (sem prefix)
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: GeminiPart[];
}

export interface GeminiRequest {
  apiKey: string;
  system?: string;
  messages: GeminiMessage[];
  signal?: AbortSignal;
}

export async function callGemini({ apiKey, system, messages, signal }: GeminiRequest): Promise<string> {
  if (!apiKey) throw new Error("Faltando API key do Gemini. Configure em Configurações → Tutor IA.");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: messages.map((m) => ({ role: m.role, parts: m.parts })),
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini API erro ${res.status}: ${txt.slice(0, 300)}`);
  }
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.map((p: GeminiPart) => p.text).filter(Boolean).join("\n");
  if (!text) throw new Error("Gemini não retornou texto.");
  return text as string;
}

export async function fileToInlineData(file: File): Promise<GeminiPart> {
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

export const TUTOR_SYSTEM = `Você é um tutor de Física 1 (Mecânica) chamado FisiFun Tutor.
Seu público são estudantes brasileiros de ensino médio/técnico/universidade estudando pelo livro Halliday, Fundamentos de Física Vol. 1 (9ª ed.).

REGRAS DE EXPLICAÇÃO (sempre siga esta estrutura quando for resolver um exercício):
1. **Dados**: liste o que o enunciado dá, com unidades convertidas ao SI.
2. **O que pede**: diga a grandeza e unidade desejadas.
3. **Conceito / Fórmula**: qual conceito do Halliday se aplica, e qual fórmula usar (em LaTeX entre $ $).
4. **Substituição**: mostre os números entrando na fórmula.
5. **Resultado**: o valor final com unidade correta e (se fizer sentido) ordem de grandeza.
6. **Por que assim?**: uma frase curta explicando o raciocínio físico (e. g. "a energia se conserva porque não há atrito").
7. **Cuidado comum**: um erro típico que o aluno costuma cometer nesse tipo de exercício.

Outras regras:
- Português BR, tom próximo e claro, sem encher de jargão.
- Use fórmulas em LaTeX dentro de $...$ (inline) ou $$...$$ (bloco).
- Não invente dados que não estão no enunciado. Se faltar dado, peça.
- Se o aluno estiver errado, explique o erro sem julgar.
- Prefira vetores, diagramas de forças e sinais explícitos quando útil.
- Você pode receber foto do exercício; leia o enunciado e explique.`;
