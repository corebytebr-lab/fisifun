"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CHAPTERS, allExercises } from "@/content/index";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExerciseRunner } from "@/components/exercicios/ExerciseRunner";
import { useGame } from "@/lib/store";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { ProgressBar } from "@/components/ui/Progress";
import { useHydrated } from "@/lib/useHydrated";

export default function ProvaPage() {
  const mounted = useHydrated();
  const [mode, setMode] = useState<"select" | "running" | "done">("select");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<ReturnType<typeof allExercises>>([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const state = useGame();

  const all = useMemo(() => allExercises(), []);

  function start(chapterIds: string[]) {
    const pool = chapterIds.length > 0 ? all.filter((x) => chapterIds.includes(x.chapterId)) : all;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(20, pool.length));
    setItems(shuffled);
    setIdx(0);
    setCorrect(0);
    setAnswers([]);
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
          <GraduationCap /> Modo Prova
        </h1>
        <p className="text-sm text-[var(--muted)]">Simulado sem dicas. Confira o resultado no final.</p>
      </div>

      {mode === "select" && (
        <Card>
          <CardTitle>Monte seu simulado</CardTitle>
          <CardSubtitle>Selecione os capítulos que entram na prova.</CardSubtitle>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CHAPTERS.map((c) => {
              const active = selected.has(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    const next = new Set(selected);
                    if (active) next.delete(c.id);
                    else next.add(c.id);
                    setSelected(next);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
                    active ? "border-indigo-500 bg-indigo-500 text-white" : "border-[var(--border)]"
                  }`}
                >
                  {c.emoji} Cap. {c.number}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="lg" onClick={() => start(Array.from(selected))} disabled={selected.size === 0}>
              Iniciar prova ({Math.min(20, selected.size === 0 ? all.length : all.filter((x) => selected.has(x.chapterId)).length)} questões)
            </Button>
            <Button size="lg" variant="secondary" onClick={() => start([])}>Prova cumulativa (todos)</Button>
          </div>
        </Card>
      )}

      {mode === "running" && items[idx] && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1">
              <ProgressBar value={idx} max={items.length} color="rose" />
            </div>
            <span className="text-xs text-[var(--muted)]">{idx + 1}/{items.length}</span>
          </div>
          <ExerciseRunner
            key={items[idx].exercise.id}
            exercise={items[idx].exercise}
            onSubmit={({ correct: ok }) => {
              if (ok) setCorrect((c) => c + 1);
              setAnswers((a) => [...a, ok]);
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
                const bonus = correct * 3 + (correct === items.length ? 50 : 0);
                state.awardXp(bonus);
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
          <div className="anim-pop text-5xl">{correct === items.length ? "🏆" : correct / items.length >= 0.7 ? "🎓" : "📚"}</div>
          <CardTitle className="mt-2">
            Nota: {((correct / items.length) * 10).toFixed(1)}
          </CardTitle>
          <div className="mt-2 text-sm text-[var(--muted)]">
            {correct}/{items.length} acertos
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={() => setMode("select")}>Nova prova</Button>
            <Link href="/"><Button variant="secondary">Início</Button></Link>
          </div>
          <div className="mt-5 grid grid-cols-10 gap-1 text-[10px]">
            {answers.map((ok, i) => (
              <div
                key={i}
                className={`aspect-square rounded ${ok ? "bg-emerald-500/70" : "bg-rose-500/70"} flex items-center justify-center text-white`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
