"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { allExercises, chaptersBySubject } from "@/content/index";
import { SUBJECTS } from "@/lib/types";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExerciseRunner } from "@/components/exercicios/ExerciseRunner";
import { useGame } from "@/lib/store";
import { Dumbbell, Timer, ChevronLeft } from "lucide-react";
import { ProgressBar } from "@/components/ui/Progress";
import { useHydrated } from "@/lib/useHydrated";

export default function TreinoPage() {
  const mounted = useHydrated();
  const [mode, setMode] = useState<"select" | "running" | "done">("select");
  const [filter, setFilter] = useState<string>("all");
  const [items, setItems] = useState<ReturnType<typeof allExercises>>([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(300); // 5 min
  const state = useGame();

  useEffect(() => {
    if (mode !== "running") return;
    if (remaining <= 0) {
      setMode("done");
      return;
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [mode, remaining]);

  const currentSubject = state.currentSubject;
  const subjectChapters = useMemo(() => chaptersBySubject(currentSubject), [currentSubject]);
  const subjectInfo = SUBJECTS.find((s) => s.id === currentSubject) ?? SUBJECTS[0];
  const all = useMemo(() => allExercises(currentSubject), [currentSubject]);

  function start(limit: number = 10, chapterId?: string) {
    const pool = all.filter((x) => !chapterId || chapterId === "all" || x.chapterId === chapterId);
    const shuffled = shuffle(pool).slice(0, limit);
    setItems(shuffled);
    setIdx(0);
    setCorrect(0);
    setTotal(0);
    setRemaining(300);
    setMode("running");
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-4 md:px-0 md:pt-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Início
      </Link>
      <div>
        <h1 className="text-2xl font-extrabold md:text-3xl flex items-center gap-2">
          <Dumbbell /> Modo Treino
        </h1>
        <p className="text-sm text-[var(--muted)]">Sessão rápida de exercícios, com cronômetro opcional.</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Matéria: <span className="font-bold text-[var(--fg)]">{subjectInfo.emoji} {subjectInfo.label}</span></p>
      </div>

      {mode === "select" && all.length === 0 && (
        <Card>
          <CardTitle>Sem exercícios para esta matéria ainda</CardTitle>
          <CardSubtitle>Troque a matéria pela barra lateral ou volte mais tarde.</CardSubtitle>
        </Card>
      )}

      {mode === "select" && (
        <Card>
          <CardTitle>Monte seu treino</CardTitle>
          <CardSubtitle>Escolha o capítulo e a quantidade.</CardSubtitle>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <FilterChip value="all" active={filter === "all"} onClick={() => setFilter("all")}>Todos</FilterChip>
            {subjectChapters.map((c) => (
              <FilterChip key={c.id} value={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
                {c.emoji} {c.number}
              </FilterChip>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            <Button size="lg" onClick={() => start(5, filter)}>⚡ 5 exercícios</Button>
            <Button size="lg" onClick={() => start(10, filter)} variant="secondary">🔟 10 exercícios</Button>
            <Button size="lg" onClick={() => start(20, filter)} variant="outline">💪 20 exercícios</Button>
          </div>
        </Card>
      )}

      {mode === "running" && items[idx] && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <Timer size={14} className="text-rose-500" />
            <span className="font-bold text-rose-500">{fmtTime(remaining)}</span>
            <div className="flex-1">
              <ProgressBar value={idx} max={items.length} color="indigo" />
            </div>
            <span className="text-xs text-[var(--muted)]">{idx + 1}/{items.length}</span>
          </div>
          <ExerciseRunner
            key={items[idx].exercise.id}
            exercise={items[idx].exercise}
            onSubmit={({ correct: ok }) => {
              setTotal((t) => t + 1);
              if (ok) setCorrect((c) => c + 1);
              state.recordAttempt({
                exerciseId: items[idx].exercise.id,
                chapterId: items[idx].chapterId,
                lessonId: items[idx].lessonId,
                correct: ok,
                at: Date.now(),
                concept: items[idx].exercise.concept,
              });
            }}
            onNext={() => {
              if (idx + 1 >= items.length) {
                const xp = correct * 5;
                state.awardXp(xp);
                setMode("done");
              } else {
                setIdx(idx + 1);
              }
            }}
          />
        </>
      )}

      {mode === "done" && (
        <Card className="text-center">
          <div className="anim-pop text-5xl">🏋️</div>
          <CardTitle className="mt-2">Treino finalizado</CardTitle>
          <div className="mt-2 text-sm text-[var(--muted)]">
            {correct}/{total} acertos · +{correct * 5} XP
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={() => setMode("select")}>Novo treino</Button>
            <Link href="/"><Button variant="secondary">Início</Button></Link>
          </div>
        </Card>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  value: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
        active ? "border-indigo-500 bg-indigo-500 text-white" : "border-[var(--border)] hover:border-indigo-400"
      }`}
    >
      {children}
    </button>
  );
}

function shuffle<T>(xs: T[]): T[] {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function fmtTime(s: number) {
  const m = Math.floor(Math.max(0, s) / 60);
  const sec = Math.max(0, s) % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}
