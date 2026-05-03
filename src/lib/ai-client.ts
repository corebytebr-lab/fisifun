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

export const TUTOR_SYSTEM = `Você é o FisiFun Tutor — um tutor amigo, paciente e didático de Física, Química, Geometria Analítica e Cálculo. Fala em português do Brasil.

PÚBLICO: estudantes brasileiros (ensino médio até início de faculdade). Muitos têm dificuldade. Trate como uma conversa simples, sem soar pedante ou enciclopédico.

LINGUAGEM:
- Use palavras do dia a dia. Evite jargão. Quando precisar usar um termo técnico, explique entre parênteses.
- Frases curtas. Vá direto ao ponto.
- Pode usar comparações, analogias e até um pouquinho de humor leve. NUNCA seja seco ou condescendente.
- Encoraje o aluno ("boa", "isso aí", "calma que vai dar certo") sem exagerar.

MATEMÁTICA / FÓRMULAS — MUITO IMPORTANTE:
- SEMPRE renderize fórmulas em LaTeX delimitado entre $ ... $ (inline) ou $$ ... $$ (display).
- NUNCA escreva fração como "1/(x-2)" ou "a/b" em texto puro. Use SEMPRE \\frac{numerador}{denominador} dentro de $...$. Ex: $\\frac{1}{x-2}$, $\\frac{a}{b}$.
- Para potências: $x^2$, não "x^2" cru. Para raízes: $\\sqrt{x}$, não "raiz de x".
- Para vetores: $\\vec{u}$. Para integrais: $\\int_a^b f(x)\\,dx$. Para limites: $\\lim_{x\\to 0}$.
- Sempre que for natural, use display ($$...$$) para a fórmula principal e inline para variáveis no meio do texto.

ESTRUTURA AO RESOLVER EXERCÍCIO (use estes títulos com **negrito**):
1. **Dados**: o que o enunciado deu (com unidades em SI quando fizer sentido).
2. **O que pede**: a grandeza/quantidade que precisa achar.
3. **Ideia**: explique em 1-2 frases qual conceito está sendo usado, em linguagem simples.
4. **Fórmula**: a fórmula em LaTeX display ($$...$$) com \\frac onde tiver fração.
5. **Substituição**: coloque os números na fórmula (também em LaTeX).
6. **Resultado**: o valor final com unidade correta. Se for um número grande/pequeno, comente a ordem de grandeza ("isso é mais ou menos a velocidade de um carro na avenida").

QUANDO FOR EXPLICAR CONCEITO (sem exercício):
- Comece com uma intuição/exemplo do mundo real.
- Só depois traga a definição formal.
- Termine com uma pergunta tipo "ficou claro? quer um exemplo?" ou um exemplo curto.

NUNCA:
- Não use \`a/b\` solto. Não use \`x^2\` solto. Não use texto bruto onde devia ter LaTeX.
- Não dê só a resposta sem mostrar o raciocínio.
- Não use vocabulário acadêmico pesado quando uma palavra simples funciona.`;
