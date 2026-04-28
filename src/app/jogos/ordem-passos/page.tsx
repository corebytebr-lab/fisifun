"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { STEP_ORDER_ITEMS, CHAPTER_LABEL } from "@/content/games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { ChevronUp, ChevronDown, RefreshCw } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OrdemPassosGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => shuffle(STEP_ORDER_ITEMS), [round]);
  const [idx, setIdx] = useState(0);
  const [order, setOrder] = useState<string[]>(() => shuffle(items[0].steps));
  const [checked, setChecked] = useState<{ ok: boolean } | null>(null);
  const [score, setScore] = useState(0);

  if (!mounted) return null;

  const current = items[idx];
  const finished = idx >= items.length;

  function move(i: number, dir: -1 | 1) {
    if (checked) return;
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  }

  function check() {
    const ok = order.every((s, i) => s === current.steps[i]);
    setChecked({ ok });
    if (ok) {
      setScore((s) => s + 20);
    } else {
      setScore((s) => Math.max(0, s - 5));
    }
  }

  function next() {
    const newIdx = idx + 1;
    setIdx(newIdx);
    setChecked(null);
    if (newIdx < items.length) {
      setOrder(shuffle(items[newIdx].steps));
    } else {
      awardXp(25);
    }
  }

  function restart() {
    setIdx(0);
    setChecked(null);
    setScore(0);
    setRound((r) => r + 1);
    setOrder(shuffle(items[0].steps));
  }

  if (finished) {
    return (
      <GameShell title="🪜 Ordem dos passos" score={score}>
        <Card className="bg-emerald-500/10 text-center">
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
            Fim! +25 XP · Pontuação {score}
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
      title="🪜 Ordem dos passos"
      subtitle={`${idx + 1} / ${items.length}`}
      score={score}
    >
      <Card>
        <div className="text-xs text-[var(--muted)]">{CHAPTER_LABEL[current.chapterId]}</div>
        <div className="mt-1 font-bold">{current.prompt}</div>
      </Card>

      <div className="flex flex-col gap-2">
        {order.map((s, i) => {
          const correctlyPlaced = checked && s === current.steps[i];
          return (
            <div
              key={s}
              className={`flex items-center gap-2 rounded-xl border p-3 ${
                checked
                  ? correctlyPlaced
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-rose-500 bg-rose-500/10"
                  : "border-[var(--border)] bg-[var(--bg-elev)]"
              }`}
            >
              <div className="flex flex-col gap-1">
                <button
                  className="rounded p-1 hover:bg-[var(--bg)]"
                  onClick={() => move(i, -1)}
                  disabled={!!checked}
                  aria-label="subir"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  className="rounded p-1 hover:bg-[var(--bg)]"
                  onClick={() => move(i, 1)}
                  disabled={!!checked}
                  aria-label="descer"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex-1 text-sm">{s}</div>
            </div>
          );
        })}
      </div>

      {!checked && (
        <Button onClick={check}>Verificar ordem</Button>
      )}
      {checked && (
        <Card className={checked.ok ? "bg-emerald-500/10" : "bg-rose-500/10"}>
          <div className="font-bold">
            {checked.ok ? "Perfeito! 🎯" : "Ordem errada. A ordem correta era:"}
          </div>
          {!checked.ok && (
            <ol className="mt-2 list-decimal pl-5 text-sm">
              {current.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
          <Button className="mt-3" onClick={next}>
            Próxima
          </Button>
        </Card>
      )}
    </GameShell>
  );
}
