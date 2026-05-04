"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RichText } from "@/lib/format";
import { callGemini, GeminiError, TUTOR_SYSTEM, type GeminiMessage } from "@/lib/gemini";
import type { HallidayProblem } from "@/content/halliday-problems";
import { CHAPTER_LABEL } from "@/content/games";
import { CheckCircle2, XCircle, Sparkles, Loader2 } from "lucide-react";

export const DIFFICULTY_XP: Record<1 | 2 | 3, number> = { 1: 8, 2: 15, 3: 25 };

export function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  const color =
    level === 1 ? "text-emerald-500" : level === 2 ? "text-amber-500" : "text-red-500";
  const label = level === 1 ? "fácil" : level === 2 ? "médio" : "difícil";
  return (
    <span className={`font-bold ${color}`} title={`Nível ${level} — ${label}`}>
      {"•".repeat(level)}
      <span className="ml-1 text-[10px] uppercase tracking-wide opacity-70">Nível {level}</span>
    </span>
  );
}

export function HallidayProblemCard({
  problem,
  status,
  onAnswer,
  geminiKey,
}: {
  problem: HallidayProblem;
  status: "correct" | "wrong" | undefined;
  onAnswer: (result: "correct" | "wrong") => void;
  geminiKey?: string;
}) {
  const [solution, setSolution] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function solve() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const messages: GeminiMessage[] = [
        {
          role: "user",
          parts: [
            {
              text: `Resolva este problema do Halliday (Cap ${problem.chapterNumber}, Problema ${problem.number}, nível ${problem.difficulty}) passo a passo, no formato Dados → Fórmula → Substituição → Resultado → Conceito-chave. Use formatação Markdown e LaTeX com $...$ para fórmulas.\n\nEnunciado:\n${problem.text}`,
            },
          ],
        },
      ];
      const answer = await callGemini({
        system: TUTOR_SYSTEM,
        messages,
        apiKey: geminiKey ?? "",
      });
      setSolution(answer);
    } catch (e) {
      if (e instanceof GeminiError && e.code === 401) setError("NO_KEY");
      else if (e instanceof GeminiError) setError(e.friendly);
      else if (e instanceof Error) setError(e.message);
      else setError("Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="font-semibold">
          {CHAPTER_LABEL[problem.chapterId] ?? `Cap. ${problem.chapterNumber}`} · Problema{" "}
          {problem.number}
        </div>
        <DifficultyDots level={problem.difficulty as 1 | 2 | 3} />
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{problem.text}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => onAnswer("correct")}
          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            status === "correct"
              ? "bg-emerald-500 text-white"
              : "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
          }`}
        >
          <CheckCircle2 size={14} /> Acertei{" "}
          <span className="opacity-60">+{DIFFICULTY_XP[problem.difficulty as 1 | 2 | 3]} XP</span>
        </button>
        <button
          onClick={() => onAnswer("wrong")}
          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            status === "wrong"
              ? "bg-red-500 text-white"
              : "bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-300"
          }`}
        >
          <XCircle size={14} /> Errei
        </button>
        <button
          onClick={solve}
          disabled={loading}
          className="flex items-center gap-1 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-500/20 disabled:opacity-50 dark:text-indigo-300"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? "Resolvendo..." : solution ? "Reabrir solução" : "Ver solução (IA)"}
        </button>
        <Link
          href={`/duvida?q=${encodeURIComponent(`Cap ${problem.chapterNumber} · Problema ${problem.number} do Halliday:\n\n${problem.text}`)}`}
          className="text-xs text-indigo-500 hover:underline"
        >
          Abrir no Tutor IA
        </Link>
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300">
          {error === "NO_KEY" ? (
            <>
              Você precisa configurar uma chave Gemini em{" "}
              <Link href="/configuracoes" className="underline">
                Configurações → Tutor IA
              </Link>
              .
            </>
          ) : (
            <>Erro: {error}</>
          )}
        </div>
      )}

      {solution && (
        <details open className="mt-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3">
          <summary className="cursor-pointer text-xs font-bold uppercase text-indigo-500">
            Solução passo a passo
          </summary>
          <div className="mt-2 text-sm leading-relaxed">
            <RichText>{solution}</RichText>
          </div>
        </details>
      )}
    </Card>
  );
}
