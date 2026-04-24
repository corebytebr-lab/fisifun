// Minimal Gemini client that runs 100% in the browser.
// Docs: https://ai.google.dev/api/generate-content
// Free tier via AI Studio, sem cartão.

// Ordem de fallback: tenta os modelos nesta ordem até um funcionar.
// Alguns projetos têm quota só num subset, então a gente testa múltiplos.
const MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-8b-latest",
];

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

export class GeminiError extends Error {
  code: number;
  friendly: string;
  constructor(code: number, message: string, friendly: string) {
    super(message);
    this.code = code;
    this.friendly = friendly;
  }
}

async function callOne(model: string, { apiKey, system, messages, signal }: GeminiRequest): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
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
    let friendly = `Erro ${res.status} da API do Gemini.`;
    if (res.status === 429) {
      friendly =
        "A chave bateu no limite de cota do Google (429). Provavelmente a chave foi criada num projeto do Cloud com quota 0, ou você passou de 15 req/min.\n\n" +
        "Soluções:\n" +
        "• Espere 1 minuto e tente de novo.\n" +
        "• Ou crie uma chave nova em https://aistudio.google.com/apikey (precisa ser direto no AI Studio, NÃO no Google Cloud Console).\n" +
        "• Cole a chave nova em Configurações → Tutor IA.";
    } else if (res.status === 400 && txt.includes("API_KEY")) {
      friendly = "Chave inválida. Gera uma nova em https://aistudio.google.com/apikey.";
    } else if (res.status === 403) {
      friendly = "Acesso negado (403). A chave pode ter restrição de API/HTTP-referrer. Crie uma sem restrições em https://aistudio.google.com/apikey.";
    } else if (res.status === 404) {
      friendly = `Modelo ${model} não encontrado nessa chave.`;
    }
    throw new GeminiError(res.status, txt.slice(0, 400), friendly);
  }
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.map((p: GeminiPart) => p.text).filter(Boolean).join("\n");
  if (!text) throw new GeminiError(500, "Resposta vazia", "O Gemini não retornou texto. Tenta de novo.");
  return text as string;
}

export async function callGemini(req: GeminiRequest): Promise<string> {
  if (!req.apiKey) {
    throw new GeminiError(
      401,
      "Sem chave",
      "Faltando API key do Gemini. Configure em Configurações → Tutor IA."
    );
  }
  let lastErr: GeminiError | null = null;
  for (const model of MODEL_FALLBACKS) {
    try {
      return await callOne(model, req);
    } catch (e) {
      if (e instanceof GeminiError) {
        lastErr = e;
        // 429 (quota) e 404 (modelo indisponível) → tenta próximo modelo
        if (e.code === 429 || e.code === 404) continue;
        // Outros erros (auth, rede): não adianta tentar outro modelo
        throw e;
      }
      throw e;
    }
  }
  throw lastErr ?? new GeminiError(500, "falha", "Não conseguiu chamar nenhum modelo do Gemini.");
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
