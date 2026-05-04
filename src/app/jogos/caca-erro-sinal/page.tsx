"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SIGN_ERROR_ITEMS, CHAPTER_LABEL } from "@/content/games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function CacaErroSinalGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const [round, setRound] = useState(0);
  const items = useMemo(() => SIGN_ERROR_ITEMS, []);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  if (!mounted) return null;

  const current = items[idx];
  const finished = idx >= items.length;

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === current.wrongIndex) setScore((s) => s + 20);
    else setScore((s) => Math.max(0, s - 5));
  }

  function next() {
    setPicked(null);
    if (idx + 1 >= items.length) {
      setIdx(items.length);
      awardXp(20);
    } else {
      setIdx((i) => i + 1);
    }
  }

  function restart() {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setRound((r) => r + 1);
  }

  if (finished) {
    return (
      <GameShell title="🕵️ Caça ao erro" score={score}>
        <Card className="bg-emerald-500/10 text-center">
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
            Fim! +20 XP · Pontuação {score}
          </div>
          <Button className="mt-3" onClick={restart}>
            <RefreshCw size={14} /> Jogar de novo
          </Button>
        </Card>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="🕵️ Caça ao erro"
      subtitle={`${idx + 1} / ${items.length} — clique na linha errada.`}
      score={score}
    >
      <Card key={round}>
        <div className="text-xs text-[var(--muted)]">{CHAPTER_LABEL[current.chapterId]}</div>
        <div className="mt-1 font-bold">{current.prompt}</div>
      </Card>

      <div className="flex flex-col gap-2">
        {current.lines.map((l, i) => {
          const isWrongAnswer = picked !== null && i === current.wrongIndex;
          const isPickedAndWrong = picked === i && i !== current.wrongIndex;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={`card-hover rounded-xl border p-3 text-left ${
                isWrongAnswer
                  ? "border-amber-500 bg-amber-500/10"
                  : isPickedAndWrong
                    ? "border-rose-500 bg-rose-500/10"
                    : "border-[var(--border)] bg-[var(--bg-elev)]"
              }`}
            >
              <span className="mr-2 text-xs font-bold text-[var(--muted)]">{i + 1}.</span>
              {l}
              {isWrongAnswer && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                  <AlertTriangle size={12} /> erro aqui
                </span>
              )}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <Card className={picked === current.wrongIndex ? "bg-emerald-500/10" : "bg-rose-500/10"}>
          <div className="font-bold">
            {picked === current.wrongIndex
              ? "Boa! Você pegou."
              : "Errou — a linha errada era a " + (current.wrongIndex + 1) + "."}
          </div>
          <div className="mt-2 text-sm">{current.correction}</div>
          <Button className="mt-3" onClick={next}>
            Próxima
          </Button>
        </Card>
      )}
    </GameShell>
  );
}
