"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DCL_SCENARIOS } from "@/content/new-games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw, Check, X, Heart } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUND_SIZE = 5;

export default function DiagramaCorpoLivreGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const loseHeart = useGame((s) => s.loseHeart);
  const infinite = useGame((s) => s.infiniteHearts);
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => shuffle(DCL_SCENARIOS).slice(0, ROUND_SIZE), [round]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reveal, setReveal] = useState(false);

  if (!mounted) return null;

  const current = items[idx];
  const finished = idx >= items.length;

  function toggle(f: string) {
    if (reveal) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }

  function confirm() {
    if (!current) return;
    const correctSet = new Set(current.correct);
    let missed = 0;
    let extra = 0;
    for (const f of correctSet) if (!selected.has(f)) missed++;
    for (const f of selected) if (!correctSet.has(f)) extra++;
    const perfect = missed === 0 && extra === 0;
    if (perfect) {
      setScore((s) => s + 30);
    } else {
      const penalty = (missed + extra) * 5;
      setScore((s) => Math.max(0, s - penalty));
      if (!infinite && (missed >= 2 || extra >= 2)) loseHeart();
    }
    setReveal(true);
  }

  function next() {
    setReveal(false);
    setSelected(new Set());
    if (idx + 1 >= items.length) {
      setIdx(items.length);
      awardXp(40);
    } else {
      setIdx((i) => i + 1);
    }
  }

  function restart() {
    setIdx(0);
    setScore(0);
    setReveal(false);
    setSelected(new Set());
    setRound((r) => r + 1);
  }

  if (finished) {
    return (
      <GameShell title="🎨 Diagrama de Corpo Livre" score={score}>
        <Card className="bg-emerald-500/10 text-center">
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
            Fim da rodada · {score} pts
          </div>
          <Button className="mt-3" onClick={restart}>
            <RefreshCw size={14} /> Jogar de novo
          </Button>
        </Card>
      </GameShell>
    );
  }

  const correctSet = new Set(current.correct);

  return (
    <GameShell
      title="🎨 Diagrama de Corpo Livre"
      subtitle={`${idx + 1} / ${items.length} · marque TODAS as forças que atuam (e só elas)`}
      score={score}
    >
      <Card>
        <div className="text-lg font-bold">{current.title}</div>
        <p className="mt-1 text-sm text-[var(--muted)]">{current.description}</p>
      </Card>

      <div className="grid gap-2 md:grid-cols-2">
        {current.forces.map((f) => {
          const picked = selected.has(f);
          const isCorrect = correctSet.has(f);
          const base = "rounded-xl border p-3 text-left font-semibold transition";
          let color = "border-[var(--border)] bg-[var(--bg-elev)]";
          if (!reveal && picked) color = "border-indigo-500 bg-indigo-500/10";
          if (reveal) {
            if (isCorrect && picked) color = "border-emerald-500 bg-emerald-500/10";
            else if (isCorrect && !picked) color = "border-amber-500 bg-amber-500/10";
            else if (!isCorrect && picked) color = "border-rose-500 bg-rose-500/10";
            else color = "border-[var(--border)] bg-[var(--bg-elev)] opacity-60";
          }
          return (
            <button
              key={f}
              onClick={() => toggle(f)}
              disabled={reveal}
              className={`${base} ${color}`}
            >
              <div className="flex items-center justify-between">
                <span>{f}</span>
                {reveal && isCorrect && <Check size={16} className="text-emerald-500" />}
                {reveal && !isCorrect && picked && <X size={16} className="text-rose-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {!reveal && (
        <Button className="w-full" onClick={confirm}>
          Confirmar DCL
        </Button>
      )}

      {reveal && (
        <Card className="bg-indigo-500/10">
          <div className="text-sm">{current.explain}</div>
          {!infinite && (
            <div className="mt-1 flex items-center gap-1 text-xs text-rose-600">
              <Heart size={12} /> (erros grandes consomem vida)
            </div>
          )}
          <Button className="mt-2" onClick={next}>
            Próxima
          </Button>
        </Card>
      )}
    </GameShell>
  );
}
