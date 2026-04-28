"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HALLIDAY_PROBLEMS, type HallidayProblem } from "@/content/halliday-problems";
import { CHAPTER_LABEL } from "@/content/games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { Card } from "@/components/ui/Card";
import { callGemini, GeminiError, TUTOR_SYSTEM, type GeminiMessage } from "@/lib/gemini";
import { RichText } from "@/lib/format";
import { BookOpen, CheckCircle2, XCircle, Sparkles, Loader2, Filter } from "lucide-react";

const DIFFICULTY_LABEL: Record<1 | 2 | 3, string> = {
  1: "Fácil",
  2: "Médio",
  3: "Difícil",
};

const DIFFICULTY_XP: Record<1 | 2 | 3, number> = {
  1: 8,
  2: 15,
  3: 25,
};

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  const color =
    level === 1 ? "text-emerald-500" : level === 2 ? "text-amber-500" : "text-red-500";
  return (
    <span className={`font-bold ${color}`} title={`Nível ${level} — ${DIFFICULTY_LABEL[level]}`}>
      {"•".repeat(level)}
      <span className="ml-1 text-[10px] uppercase tracking-wide opacity-70">
        Nível {level}
      </span>
    </span>
  );
}

export default function ProblemasPage() {
  const mounted = useHydrated();
  const state = useGame();
  const [chapter, setChapter] = useState<string | "all">("all");
  const [difficulty, setDifficulty] = useState<0 | 1 | 2 | 3>(0);
  const [statusFilter, setStatusFilter] = useState<"all" | "done" | "todo" | "wrong">("all");
  const [solvingId, setSolvingId] = useState<string | null>(null);
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return HALLIDAY_PROBLEMS.filter((p) => {
      if (chapter !== "all" && p.chapterId !== chapter) return false;
      if (difficulty !== 0 && p.difficulty !== difficulty) return false;
      if (statusFilter !== "all" && mounted) {
        const status = state.hallidayProgress[p.id];
        if (statusFilter === "done" && status !== "correct") return false;
        if (statusFilter === "todo" && status) return false;
        if (statusFilter === "wrong" && status !== "wrong") return false;
      }
      return true;
    });
  }, [chapter, difficulty, statusFilter, state.hallidayProgress, mounted]);

  const stats = useMemo(() => {
    const total = HALLIDAY_PROBLEMS.length;
    const done = mounted
      ? Object.values(state.hallidayProgress).filter((v) => v === "correct").length
      : 0;
    const wrong = mounted
      ? Object.values(state.hallidayProgress).filter((v) => v === "wrong").length
      : 0;
    return { total, done, wrong };
  }, [state.hallidayProgress, mounted]);

  const chapters = Array.from(new Set(HALLIDAY_PROBLEMS.map((p) => p.chapterId))).sort();

  async function solve(p: HallidayProblem) {
    setSolvingId(p.id);
    setErrors((e) => ({ ...e, [p.id]: "" }));
    try {
      const header = `Capítulo ${p.chapterNumber} do Halliday — Problema ${p.number} (dificuldade ${p.difficulty} de 3):`;
      const messages: GeminiMessage[] = [
        { role: "user", parts: [{ text: `${header}\n\n${p.text}\n\nResolva passo a passo seguindo a estrutura Dados → Fórmula → Substituição → Resultado.` }] },
      ];
      const reply = await callGemini({ system: TUTOR_SYSTEM, messages });
      setSolutions((s) => ({ ...s, [p.id]: reply }));
    } catch (e) {
      const msg =
        e instanceof GeminiError ? e.friendly : e instanceof Error ? e.message : "Erro desconhecido";
      setErrors((er) => ({ ...er, [p.id]: msg }));
    } finally {
      setSolvingId(null);
    }
  }

  function mark(p: HallidayProblem, result: "correct" | "wrong") {
    const prev = state.hallidayProgress[p.id];
    state.markHalliday(p.id, result);
    if (result === "correct" && prev !== "correct") {
      const xp = DIFFICULTY_XP[p.difficulty];
      state.awardXp(xp);
    }
    if (result === "wrong" && state.infiniteHearts === false) {
      state.loseHeart();
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
          <BookOpen /> Problemas do Halliday
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {HALLIDAY_PROBLEMS.length} problemas extraídos dos finais de capítulo do livro, agrupados por dificuldade (• / •• / •••). Ganhe {DIFFICULTY_XP[1]}/{DIFFICULTY_XP[2]}/{DIFFICULTY_XP[3]} XP por nível ao resolver.
        </p>
      </header>

      {mounted && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 text-sm">
          <span className="font-semibold">Progresso:</span>
          <span>
            <CheckCircle2 size={14} className="inline text-emerald-500" /> {stats.done} / {stats.total}
          </span>
          {stats.wrong > 0 && (
            <span>
              <XCircle size={14} className="inline text-red-500" /> {stats.wrong} erradas
            </span>
          )}
          <div className="ml-auto text-xs text-[var(--muted)]">
            Dica: sem chave Gemini, o botão &quot;Ver solução&quot; não funciona. Configure em{" "}
            <Link href="/configuracoes" className="text-indigo-500 underline">
              Configurações → Tutor IA
            </Link>
            .
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
          <Filter size={14} /> Filtros
        </div>
        <select
          value={chapter}
          onChange={(e) => setChapter(e.target.value as string | "all")}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs"
        >
          <option value="all">Todos os capítulos</option>
          {chapters.map((c) => (
            <option key={c} value={c}>
              {CHAPTER_LABEL[c] ?? c}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value) as 0 | 1 | 2 | 3)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs"
        >
          <option value={0}>Qualquer nível</option>
          <option value={1}>• Nível 1 (fácil)</option>
          <option value={2}>•• Nível 2 (médio)</option>
          <option value={3}>••• Nível 3 (difícil)</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs"
        >
          <option value="all">Todos</option>
          <option value="todo">Não tentei</option>
          <option value="done">Acertei</option>
          <option value="wrong">Errei</option>
        </select>
        <span className="ml-auto text-xs text-[var(--muted)]">{filtered.length} problema(s)</span>
      </div>

      <ul className="flex flex-col gap-3">
        {filtered.map((p) => {
          const status = mounted ? state.hallidayProgress[p.id] : undefined;
          const solution = solutions[p.id];
          const err = errors[p.id];
          const loading = solvingId === p.id;
          return (
            <Card key={p.id} className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="font-semibold">
                  {CHAPTER_LABEL[p.chapterId] ?? `Cap. ${p.chapterNumber}`} · Problema {p.number}
                </div>
                <DifficultyDots level={p.difficulty as 1 | 2 | 3} />
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{p.text}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => mark(p, "correct")}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    status === "correct"
                      ? "bg-emerald-500 text-white"
                      : "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                  }`}
                >
                  <CheckCircle2 size={14} /> Acertei{" "}
                  <span className="opacity-60">+{DIFFICULTY_XP[p.difficulty as 1 | 2 | 3]} XP</span>
                </button>
                <button
                  onClick={() => mark(p, "wrong")}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    status === "wrong"
                      ? "bg-red-500 text-white"
                      : "bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-300"
                  }`}
                >
                  <XCircle size={14} /> Errei
                </button>
                <button
                  onClick={() => solve(p)}
                  disabled={loading}
                  className="flex items-center gap-1 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-500/20 disabled:opacity-50 dark:text-indigo-300"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {loading ? "Resolvendo..." : solution ? "Reabrir solução" : "Ver solução (IA)"}
                </button>
                <Link
                  href={`/duvida?q=${encodeURIComponent(`Cap ${p.chapterNumber} · Problema ${p.number} do Halliday:\n\n${p.text}`)}`}
                  className="text-xs text-indigo-500 hover:underline"
                >
                  Abrir no Tutor IA
                </Link>
              </div>

              {err && (
                <div className="mt-3 rounded-lg bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300">
                  {err === "NO_KEY" ? (
                    <>
                      Sem chave Gemini. Configure em{" "}
                      <Link href="/configuracoes" className="underline">
                        Configurações → Tutor IA
                      </Link>
                      .
                    </>
                  ) : (
                    err
                  )}
                </div>
              )}

              {solution && (
                <details open className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-sm">
                  <summary className="cursor-pointer font-semibold">Solução (IA)</summary>
                  <div className="mt-2">
                    <RichText>{solution}</RichText>
                  </div>
                </details>
              )}
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
            Nenhum problema com esses filtros.
          </div>
        )}
      </ul>
    </div>
  );
}
