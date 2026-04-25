"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, Play, Loader2, Hand, Trophy } from "lucide-react";
import { Auditorium, type LumerState, type LumerMood } from "@/components/professor/Auditorium";
import { CHAPTERS } from "@/content/index";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import {
  evaluateAnswer,
  evaluateExplanation,
  generateQuestion,
  type ProfessorAnswerFeedback,
  type ProfessorEvaluation,
  type ProfessorQuestion,
} from "@/lib/professor";
import { GeminiError } from "@/lib/gemini";

type Phase =
  | "select"
  | "intro"
  | "explain"
  | "evaluating"
  | "react-wrong"
  | "react-ok"
  | "question-loading"
  | "question-ask"
  | "answer-evaluating"
  | "answer-feedback"
  | "ending"
  | "done";

const LUMER_NAMES = [
  "Lumi",
  "Puff",
  "Zé-Lumer",
  "Bia",
  "Nino",
  "Kiko",
  "Dora",
  "Pipo",
] as const;

const LUMER_COLORS = [
  "#ff9fb0",
  "#9bd6ff",
  "#fbd36b",
  "#b89cff",
  "#82e8c4",
  "#ffb17a",
  "#ff86d6",
  "#a3f09c",
];

const NUM_QUESTIONS = 3;

interface Topic {
  chapterId: string;
  chapterTitle: string;
  lessonId: string;
  title: string;
}

export function ProfessorClient() {
  const mounted = useHydrated();
  const apiKey = useGame((s) => s.geminiApiKey);
  const awardXp = useGame((s) => s.awardXp);

  const [phase, setPhase] = useState<Phase>("select");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [explanation, setExplanation] = useState("");
  const [evaluation, setEvaluation] = useState<ProfessorEvaluation | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ProfessorQuestion | null>(null);
  const [questionsAsked, setQuestionsAsked] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<ProfessorAnswerFeedback | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [askingLumerIdx, setAskingLumerIdx] = useState<number | null>(null);
  const [xpGained, setXpGained] = useState(0);

  const lumers = useMemo(
    () =>
      LUMER_NAMES.map<LumerState>((name, i) => ({
        name,
        color: LUMER_COLORS[i % LUMER_COLORS.length],
        mood: "idle",
      })),
    []
  );

  const lumerStates: LumerState[] = useMemo(() => {
    return lumers.map((l, i) => {
      let mood: LumerMood = "idle";
      let focused = false;
      if (phase === "react-ok") mood = "clap";
      else if (phase === "react-wrong") {
        if (i === 2) {
          mood = "raise";
          focused = true;
        } else mood = "boo";
      } else if (phase === "question-ask" || phase === "answer-evaluating" || phase === "answer-feedback") {
        if (i === askingLumerIdx) {
          mood = "raise";
          focused = true;
        } else mood = "nod";
      } else if (phase === "evaluating" || phase === "question-loading") {
        mood = "nod";
      }
      return { ...l, mood, focused };
    });
  }, [lumers, phase, askingLumerIdx]);

  const curtain = phase === "ending" || phase === "done" ? 1 : phase === "select" ? 1 : 0;

  // Auto-award XP once on done
  const awardedRef = useRef(false);
  useEffect(() => {
    if (phase === "done" && !awardedRef.current) {
      awardedRef.current = true;
      const base = 80; // por dar palestra
      const bonus = correctAnswersCount * 30;
      const total = base + bonus;
      setXpGained(total);
      awardXp(total);
    }
  }, [phase, correctAnswersCount, awardXp]);

  function pickAskingLumer() {
    // Pick a random lumer different from previous ones when possible
    const pool = [0, 1, 3, 4, 5, 6, 7]; // skip index 2 which we reserve for "doubt" in wrong-case
    const randomIdx = pool[Math.floor(Math.random() * pool.length)];
    setAskingLumerIdx(randomIdx);
    return randomIdx;
  }

  function resetLesson() {
    setExplanation("");
    setEvaluation(null);
    setCurrentQuestion(null);
    setQuestionsAsked([]);
    setAnswer("");
    setAnswerFeedback(null);
    setCorrectAnswersCount(0);
    setErrorMsg(null);
    setAskingLumerIdx(null);
    setXpGained(0);
    awardedRef.current = false;
  }

  function startLesson(t: Topic) {
    resetLesson();
    setTopic(t);
    setPhase("intro");
  }

  function enterAuditorium() {
    setPhase("explain");
  }

  async function submitExplanation() {
    if (!topic) return;
    if (!apiKey) {
      setErrorMsg("Configure a chave do Gemini em Configurações → Tutor IA pra dar aula aos Lumers.");
      return;
    }
    const text = explanation.trim();
    if (text.length < 20) {
      setErrorMsg("Escreva uma explicação com pelo menos 20 caracteres.");
      return;
    }
    setErrorMsg(null);
    setPhase("evaluating");
    try {
      const ev = await evaluateExplanation({
        apiKey,
        topic: topic.title,
        chapterTitle: topic.chapterTitle,
        explanation: text,
      });
      setEvaluation(ev);
      if (ev.verdict === "ok") {
        setPhase("react-ok");
        // After a brief clap, move to first question
        setTimeout(() => nextQuestion(), 2200);
      } else {
        setPhase("react-wrong");
      }
    } catch (e) {
      const friendly = e instanceof GeminiError ? e.friendly : "Não consegui avaliar agora. Tenta de novo.";
      setErrorMsg(friendly);
      setPhase("explain");
    }
  }

  async function nextQuestion() {
    if (!topic) return;
    if (questionsAsked.length >= NUM_QUESTIONS) {
      endLesson();
      return;
    }
    if (!apiKey) {
      endLesson();
      return;
    }
    const idx = pickAskingLumer();
    const lumerName = LUMER_NAMES[idx];
    setPhase("question-loading");
    setCurrentQuestion(null);
    setAnswer("");
    setAnswerFeedback(null);
    try {
      const q = await generateQuestion({
        apiKey,
        topic: topic.title,
        chapterTitle: topic.chapterTitle,
        explanation,
        lumerName,
        previousQuestions: questionsAsked,
      });
      setCurrentQuestion(q);
      setQuestionsAsked((prev) => [...prev, q.question]);
      setPhase("question-ask");
    } catch (e) {
      const friendly = e instanceof GeminiError ? e.friendly : "Não consegui gerar pergunta.";
      setErrorMsg(friendly);
      setPhase("question-ask");
      setCurrentQuestion({ question: "Pode dar um exemplo numérico, Professor?" });
    }
  }

  async function submitAnswer() {
    if (!topic || !currentQuestion || askingLumerIdx === null) return;
    if (!apiKey) return;
    const text = answer.trim();
    if (text.length < 3) {
      setErrorMsg("Responda a pergunta antes de enviar.");
      return;
    }
    setErrorMsg(null);
    setPhase("answer-evaluating");
    try {
      const fb = await evaluateAnswer({
        apiKey,
        topic: topic.title,
        chapterTitle: topic.chapterTitle,
        question: currentQuestion.question,
        answer: text,
        lumerName: LUMER_NAMES[askingLumerIdx],
      });
      setAnswerFeedback(fb);
      if (fb.verdict === "ok") setCorrectAnswersCount((n) => n + 1);
      setPhase("answer-feedback");
    } catch (e) {
      const friendly = e instanceof GeminiError ? e.friendly : "Falha ao avaliar.";
      setErrorMsg(friendly);
      setPhase("question-ask");
    }
  }

  function endLesson() {
    setPhase("ending");
    setTimeout(() => setPhase("done"), 1400);
  }

  function backToSelect() {
    resetLesson();
    setPhase("select");
  }

  if (!mounted) return null;

  if (phase === "select") {
    return (
      <div className="flex flex-col gap-6 px-4 pt-4 md:px-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <Sparkles size={14} /> Modo Professor
            </div>
            <h1 className="text-2xl font-extrabold md:text-3xl">Ensine os Lumers 👨‍🏫</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Escolha um assunto. Você vai entrar no auditório, explicar aos Lumers (os alunos) e responder
              às perguntas deles. Explicar bem rende XP alto.
            </p>
          </div>
        </header>

        {!apiKey ? (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
            ⚠️ Pra rodar o Modo Professor, configure a chave do Gemini em{" "}
            <Link href="/configuracoes" className="underline font-medium">
              Configurações → Tutor IA
            </Link>
            . Sem ela, os Lumers não conseguem avaliar a explicação.
          </div>
        ) : null}

        <div className="space-y-4">
          {CHAPTERS.map((c) => (
            <details
              key={c.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none font-bold">
                <span className="mr-2 text-lg">{c.emoji}</span>
                Cap. {c.number} — {c.title}
                <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                  ({c.lessons.filter((l) => l.kind !== "halliday").length} tópicos)
                </span>
              </summary>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {c.lessons
                  .filter((l) => l.kind !== "halliday")
                  .map((l) => (
                    <button
                      key={l.id}
                      onClick={() =>
                        startLesson({
                          chapterId: c.id,
                          chapterTitle: `Cap. ${c.number} — ${c.title}`,
                          lessonId: l.id,
                          title: l.title,
                        })
                      }
                      className="card-hover flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-left"
                    >
                      <div>
                        <div className="font-medium">{l.title}</div>
                        <div className="text-xs text-[var(--muted)]">
                          ~{l.estMinutes}min · dar aula
                        </div>
                      </div>
                      <Play size={18} className="text-indigo-500" />
                    </button>
                  ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  }

  // Auditorium phases: full-screen black stage
  return (
    <div className="fixed inset-0 z-50 bg-[#0b1028] text-white">
      {/* 3D scene */}
      <Auditorium lumers={lumerStates} curtain={curtain} />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-4 bg-gradient-to-b from-black/60 to-transparent px-4 py-3 md:px-6">
        <button
          onClick={backToSelect}
          className="flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-sm font-medium backdrop-blur hover:bg-black/70"
        >
          <ArrowLeft size={16} /> Sair da palestra
        </button>
        <div className="flex items-center gap-3 text-sm">
          <span className="rounded-full bg-white/10 px-3 py-1 font-medium">
            🎓 {topic?.title}
          </span>
          <span className="hidden rounded-full bg-white/10 px-3 py-1 md:inline">
            {topic?.chapterTitle}
          </span>
        </div>
      </div>

      {/* Phase-specific overlays (bottom drawer) */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        {phase === "intro" && (
          <BottomPanel title={`Assunto: ${topic?.title}`}>
            <div className="mb-3 rounded-lg bg-indigo-500/10 p-3 text-sm text-indigo-200">
              Os Lumers estão esperando. Quando você estiver pronto, entre no palco e explique o assunto.
              Eles podem discordar se algo estiver errado e vão te fazer perguntas depois.
            </div>
            <div className="flex justify-end">
              <button
                onClick={enterAuditorium}
                className="rounded-xl bg-indigo-500 px-5 py-2.5 font-semibold text-white shadow hover:bg-indigo-600"
              >
                Entrar no palco 🎤
              </button>
            </div>
          </BottomPanel>
        )}

        {phase === "explain" && (
          <BottomPanel title="👨‍🏫 Explique sobre esse assunto para os Lumers">
            <textarea
              autoFocus
              rows={5}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={`Explique com suas palavras o conceito de "${topic?.title}". Use fórmulas, dê exemplos, cite unidades.`}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:outline-none"
            />
            {errorMsg ? (
              <div className="mt-2 rounded-lg bg-rose-500/10 p-2 text-sm text-rose-300">{errorMsg}</div>
            ) : null}
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs text-white/50">{explanation.length} caracteres</div>
              <button
                onClick={submitExplanation}
                disabled={explanation.trim().length < 20}
                className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 font-semibold text-white shadow hover:bg-indigo-600 disabled:opacity-40"
              >
                <Send size={16} /> Explicar aos Lumers
              </button>
            </div>
          </BottomPanel>
        )}

        {phase === "evaluating" && (
          <BottomPanel title="🤔 Os Lumers estão prestando atenção…">
            <LoadingLine text="Avaliando sua explicação…" />
          </BottomPanel>
        )}

        {phase === "react-wrong" && evaluation ? (
          <BottomPanel title="🙋 Um Lumer levantou a mão">
            <SpeechBubble speaker="Zé-Lumer">
              Acho que está errado, Professor… {evaluation.suggestion || evaluation.issue}
            </SpeechBubble>
            {evaluation.issue && (
              <div className="mt-3 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-200">
                <strong>Problema:</strong> {evaluation.issue}
              </div>
            )}
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setPhase("explain")}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
              >
                Refazer explicação
              </button>
              <button
                onClick={() => {
                  setPhase("react-ok");
                  setTimeout(() => nextQuestion(), 1800);
                }}
                className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-600"
              >
                Seguir para as perguntas
              </button>
            </div>
          </BottomPanel>
        ) : null}

        {phase === "react-ok" && evaluation ? (
          <BottomPanel title="👏👏👏 Boa, Professor!">
            <SpeechBubble speaker="Os Lumers">
              {evaluation.strengths || "Explicação clara, Professor!"}
            </SpeechBubble>
            <div className="mt-2 text-sm text-white/60">Preparando a próxima dúvida…</div>
          </BottomPanel>
        ) : null}

        {phase === "question-loading" && (
          <BottomPanel title="🙋 Alguém levantou a mão…">
            <LoadingLine text="Pensando na pergunta…" />
          </BottomPanel>
        )}

        {phase === "question-ask" && currentQuestion && askingLumerIdx !== null ? (
          <BottomPanel title={`🙋 ${LUMER_NAMES[askingLumerIdx]} pergunta:`}>
            <SpeechBubble speaker={LUMER_NAMES[askingLumerIdx]}>{currentQuestion.question}</SpeechBubble>
            <textarea
              autoFocus
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Resposta do Professor…"
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:outline-none"
            />
            {errorMsg ? (
              <div className="mt-2 rounded-lg bg-rose-500/10 p-2 text-sm text-rose-300">{errorMsg}</div>
            ) : null}
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs text-white/50">
                Pergunta {questionsAsked.length}/{NUM_QUESTIONS}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={endLesson}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
                >
                  Terminei a palestra
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={answer.trim().length < 3}
                  className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-semibold hover:bg-indigo-600 disabled:opacity-40"
                >
                  Responder
                </button>
              </div>
            </div>
          </BottomPanel>
        ) : null}

        {phase === "answer-evaluating" && (
          <BottomPanel title="Os Lumers estão pensando…">
            <LoadingLine text="Avaliando sua resposta…" />
          </BottomPanel>
        )}

        {phase === "answer-feedback" && answerFeedback && askingLumerIdx !== null ? (
          <BottomPanel
            title={
              answerFeedback.verdict === "ok"
                ? "✅ Resposta certa!"
                : answerFeedback.verdict === "parcial"
                  ? "🤔 Quase lá"
                  : "❌ Ainda não foi dessa vez"
            }
          >
            <SpeechBubble speaker={LUMER_NAMES[askingLumerIdx]}>
              {answerFeedback.lumerReaction}
            </SpeechBubble>
            <div
              className={`mt-3 rounded-lg p-3 text-sm ${
                answerFeedback.verdict === "ok"
                  ? "bg-emerald-500/15 text-emerald-200"
                  : answerFeedback.verdict === "parcial"
                    ? "bg-amber-500/15 text-amber-200"
                    : "bg-rose-500/15 text-rose-200"
              }`}
            >
              <strong>Feedback:</strong> {answerFeedback.feedback}
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={endLesson}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
              >
                Terminei a palestra
              </button>
              <button
                onClick={() => nextQuestion()}
                className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-600"
              >
                {questionsAsked.length < NUM_QUESTIONS ? "Próxima pergunta" : "Encerrar"}
              </button>
            </div>
          </BottomPanel>
        ) : null}

        {phase === "ending" && (
          <BottomPanel title="🎭 Fechando as cortinas…">
            <LoadingLine text="Saindo do auditório…" />
          </BottomPanel>
        )}

        {phase === "done" && (
          <BottomPanel title="🎉 Palestra encerrada!">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Trophy size={16} className="text-amber-400" />
                <strong>+{xpGained} XP</strong>
                <span className="text-white/60">
                  ({correctAnswersCount}/{NUM_QUESTIONS} perguntas respondidas certo)
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={backToSelect}
                  className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-semibold hover:bg-indigo-600"
                >
                  Escolher outro assunto
                </button>
                <Link
                  href="/"
                  className="rounded-xl bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20"
                >
                  Voltar pra home
                </Link>
              </div>
            </div>
          </BottomPanel>
        )}
      </div>
    </div>
  );
}

function BottomPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl rounded-t-3xl border-t border-white/10 bg-black/70 p-4 backdrop-blur-md md:p-5">
      <div className="mb-2 text-sm font-bold uppercase tracking-wider text-indigo-300">{title}</div>
      {children}
    </div>
  );
}

function SpeechBubble({ speaker, children }: { speaker: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/8 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-indigo-300">
        <Hand size={12} /> {speaker}
      </div>
      <div className="text-sm leading-relaxed text-white/90">{children}</div>
    </div>
  );
}

function LoadingLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/80">
      <Loader2 size={16} className="animate-spin" /> {text}
    </div>
  );
}

