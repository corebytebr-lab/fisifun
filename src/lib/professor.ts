import { callGemini } from "./gemini";

export interface ProfessorEvaluation {
  verdict: "ok" | "incompleto" | "errado";
  score: number; // 0..100
  issue: string; // 1-2 frases descrevendo o problema (vazio se verdict=ok)
  suggestion: string; // o que o lumer "pensa" que pode estar errado (frase curta)
  strengths: string; // 1 linha elogiando o que estava bom (opcional)
}

export interface ProfessorQuestion {
  question: string;
}

export interface ProfessorAnswerFeedback {
  verdict: "ok" | "parcial" | "errado";
  feedback: string; // feedback para o professor (1-2 frases)
  lumerReaction: string; // 1 frase do que o lumer diz em resposta
}

const PROFESSOR_SYSTEM = `Você é um assistente de sala de aula no modo Professor do app FisiFun.
Seu papel é avaliar as explicações que um estudante (Professor) dá para alunos virtuais (Lumers) sobre tópicos de Física 1 (Mecânica), com base no livro Halliday Vol. 1 (9ª ed.).

REGRAS:
- Seja direto, gentil e encorajador — como um auxiliar de monitor.
- Use português brasileiro informal.
- Seja rigoroso com a física: aponte erros conceituais de verdade, mas ignore pequenos detalhes de escrita/ortografia.
- Respostas devem ser CURTAS (cabe em um balão de fala).
- Sempre responda em JSON válido quando pedido, sem markdown fences, sem comentário extra.`;

/**
 * Avalia a explicação que o professor (usuário) deu sobre um tópico.
 */
export async function evaluateExplanation(params: {
  apiKey: string;
  topic: string;
  chapterTitle: string;
  explanation: string;
}): Promise<ProfessorEvaluation> {
  const { apiKey, topic, chapterTitle, explanation } = params;
  const prompt = `TÓPICO: "${topic}" (${chapterTitle})

EXPLICAÇÃO DO PROFESSOR:
"""
${explanation}
"""

Avalie a explicação. Responda APENAS JSON:
{
  "verdict": "ok" | "incompleto" | "errado",
  "score": número de 0 a 100,
  "issue": "se errado/incompleto: 1 frase descrevendo o problema principal; se ok: \\"\\"",
  "suggestion": "se errado/incompleto: uma frase do tipo 'Acho que está errado Professor, ...' com a dúvida que um aluno teria; se ok: \\"\\"",
  "strengths": "se ok: 1 frase elogiando; se errado: \\"\\""
}`;

  const text = await callGemini({
    apiKey,
    system: PROFESSOR_SYSTEM,
    messages: [{ role: "user", parts: [{ text: prompt }] }],
  });
  return parseJsonStrict<ProfessorEvaluation>(text, {
    verdict: "ok",
    score: 70,
    issue: "",
    suggestion: "",
    strengths: "Boa explicação!",
  });
}

/**
 * Gera uma pergunta que um Lumer faria, baseada no tópico + explicação dada.
 */
export async function generateQuestion(params: {
  apiKey: string;
  topic: string;
  chapterTitle: string;
  explanation: string;
  lumerName: string;
  previousQuestions: string[];
}): Promise<ProfessorQuestion> {
  const { apiKey, topic, chapterTitle, explanation, lumerName, previousQuestions } = params;
  const prompt = `TÓPICO: "${topic}" (${chapterTitle})

EXPLICAÇÃO QUE O PROFESSOR DEU:
"""
${explanation}
"""

${
    previousQuestions.length
      ? `JÁ FORAM FEITAS (não repita ideia):\n- ${previousQuestions.join("\n- ")}`
      : "Ninguém fez pergunta ainda."
  }

Gere uma pergunta curta (máx 2 frases) que o aluno ${lumerName} faria ao professor. A pergunta deve:
- ser sobre algo dentro do tópico ${topic};
- ser respondível com raciocínio de Física 1 (Halliday);
- ter uma resposta factual (não opinião);
- variar entre conceitual e numérica simples.

Responda APENAS JSON:
{ "question": "..." }`;

  const text = await callGemini({
    apiKey,
    system: PROFESSOR_SYSTEM,
    messages: [{ role: "user", parts: [{ text: prompt }] }],
  });
  return parseJsonStrict<ProfessorQuestion>(text, { question: "Pode dar um exemplo?" });
}

/**
 * Avalia a resposta do professor a uma pergunta feita por um lumer.
 */
export async function evaluateAnswer(params: {
  apiKey: string;
  topic: string;
  chapterTitle: string;
  question: string;
  answer: string;
  lumerName: string;
}): Promise<ProfessorAnswerFeedback> {
  const { apiKey, topic, chapterTitle, question, answer, lumerName } = params;
  const prompt = `TÓPICO: "${topic}" (${chapterTitle})

PERGUNTA FEITA POR ${lumerName}: "${question}"
RESPOSTA DO PROFESSOR:
"""
${answer}
"""

Avalie a resposta. Responda APENAS JSON:
{
  "verdict": "ok" | "parcial" | "errado",
  "feedback": "1-2 frases de feedback para o professor explicando por que está ok/parcial/errado",
  "lumerReaction": "1 frase curta do que ${lumerName} diria em resposta (ex: 'Entendi agora, obrigado Professor!' ou 'Hmm, acho que ainda tá confuso...'). Não repita a pergunta."
}`;

  const text = await callGemini({
    apiKey,
    system: PROFESSOR_SYSTEM,
    messages: [{ role: "user", parts: [{ text: prompt }] }],
  });
  return parseJsonStrict<ProfessorAnswerFeedback>(text, {
    verdict: "parcial",
    feedback: "Resposta aceita.",
    lumerReaction: "Obrigado, Professor!",
  });
}

function parseJsonStrict<T>(raw: string, fallback: T): T {
  // Strip possible fences like ```json ... ```
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(json|JSON)?\n?/, "").replace(/```$/, "").trim();
  }
  // Find first { ... last }
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first >= 0 && last > first) {
    s = s.slice(first, last + 1);
  }
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}
