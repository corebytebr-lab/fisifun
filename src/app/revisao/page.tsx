"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { allExercises } from "@/content/index";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExerciseRunner } from "@/components/exercicios/ExerciseRunner";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { ProgressBar } from "@/components/ui/Progress";
import { useHydrated } from "@/lib/useHydrated";

export default function RevisaoPage() {
  const mounted = useHydrated();
  const state = useGame();
  const [tab, setTab] = useState<"wrong" | "srs">("wrong");
  const [running, setRunning] = useState(false);
  const [items, setItems] = useState<ReturnType<typeof allExercises>>([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);

  const all = useMemo(() => allExercises(), []);

  const wrongItems = useMemo(() => {
    if (!mounted) return [];
    const wrongIds = new Set(Object.keys(state.wrongExercises));
    return all.filter((x) => wrongIds.has(x.exercise.id));
  }, [mounted, state.wrongExercises, all]);

  const dueSrs = useMemo(() => {
    if (!mounted) return [];
    const now = Date.now();
    const dueIds = Object.values(state.srs)
      .filter((i) => i.dueDate <= now)
      .map((i) => i.exerciseId);
    const dueSet = new Set(dueIds);
    return all.filter((x) => dueSet.has(x.exercise.id));
  }, [mounted, state.srs, all]);

  function start(pool: typeof all) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 15);
    setItems(shuffled);
    setIdx(0);
    setCorrect(0);
    setRunning(true);
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-4 md:px-0 md:pt-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Início
      </Link>
      <div>
        <h1 className="text-2xl font-extrabold md:text-3xl flex items-center gap-2">
          <RefreshCw /> Revisão
        </h1>
        <p className="text-sm text-[var(--muted)]">Rever só o que você errou e itens da repetição espaçada.</p>
      </div>

      {!running && (
        <div className="flex gap-2">
          <button onClick={() => setTab("wrong")} className={`flex-1 rounded-xl border-2 p-3 text-left ${tab === "wrong" ? "border-indigo-500" : "border-[var(--border)]"}`}>
            <div className="text-sm font-bold">🎯 Só o que errei</div>
            <div className="text-xs text-[var(--muted)]">{wrongItems.length} itens</div>
          </button>
          <button onClick={() => setTab("srs")} className={`flex-1 rounded-xl border-2 p-3 text-left ${tab === "srs" ? "border-indigo-500" : "border-[var(--border)]"}`}>
            <div className="text-sm font-bold">🧠 Repetição espaçada</div>
            <div className="text-xs text-[var(--muted)]">{dueSrs.length} itens para revisar hoje</div>
          </button>
        </div>
      )}

      {!running && tab === "wrong" && (
        <Card>
          <CardTitle>Rever erros</CardTitle>
          <CardSubtitle>
            {wrongItems.length === 0
              ? "Você não tem erros pendentes. 🎉"
              : `Estão prontos ${wrongItems.length} itens onde você errou na última vez.`}
          </CardSubtitle>
          <div className="mt-3">
            <Button disabled={wrongItems.length === 0} onClick={() => start(wrongItems)} size="lg">
              Iniciar revisão
            </Button>
          </div>
        </Card>
      )}

      {!running && tab === "srs" && (
        <Card>
          <CardTitle>Repetição espaçada</CardTitle>
          <CardSubtitle>
            Itens estudados antes cujo intervalo ideal chegou na data de hoje.
            {dueSrs.length === 0 && " Nada para revisar agora — estude mais lições para alimentar o SRS."}
          </CardSubtitle>
          <div className="mt-3">
            <Button disabled={dueSrs.length === 0} onClick={() => start(dueSrs)} size="lg">
              Começar ({dueSrs.length})
            </Button>
          </div>
        </Card>
      )}

      {running && items[idx] && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1">
              <ProgressBar value={idx} max={items.length} color="amber" />
            </div>
            <span className="text-xs text-[var(--muted)]">{idx + 1}/{items.length}</span>
          </div>
          <ExerciseRunner
            key={items[idx].exercise.id}
            exercise={items[idx].exercise}
            onSubmit={({ correct: ok }) => {
              if (ok) setCorrect((c) => c + 1);
              state.recordAttempt({
                exerciseId: items[idx].exercise.id,
                chapterId: items[idx].chapterId,
                lessonId: items[idx].lessonId,
                correct: ok,
                at: Date.now(),
                concept: items[idx].exercise.concept,
              });
              state.reviewSrs(items[idx].exercise.id, ok);
            }}
            onNext={() => {
              if (idx + 1 >= items.length) {
                state.awardXp(correct * 4);
                setRunning(false);
              } else {
                setIdx(idx + 1);
              }
            }}
          />
        </>
      )}
    </div>
  );
}
