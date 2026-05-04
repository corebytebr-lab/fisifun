"use client";

import { useEffect, useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DIMENSION_ITEMS } from "@/content/new-games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw, Timer, Heart } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUND_SIZE = 8;
const SECONDS_PER = 15;

export default function AnaliseDimensionalGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const loseHeart = useGame((s) => s.loseHeart);
  const infinite = useGame((s) => s.infiniteHearts);
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => shuffle(DIMENSION_ITEMS).slice(0, ROUND_SIZE), [round]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; picked: string } | null>(null);
  const [time, setTime] = useState(SECONDS_PER);

  useEffect(() => {
    if (feedback || idx >= items.length) return;
    if (time <= 0) {
      setFeedback({ ok: false, picked: "—" });
      if (!infinite) loseHeart();
      return;
    }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, feedback, idx, items.length, infinite, loseHeart]);

  useEffect(() => {
    if (!feedback) setTime(SECONDS_PER);
  }, [idx, feedback]);

  if (!mounted) return null;

  const current = items[idx];
  const finished = idx >= items.length;

  function pick(expr: string) {
    if (feedback) return;
    const opt = current.options.find((o) => o.expr === expr);
    const ok = !!opt?.correct;
    setFeedback({ ok, picked: expr });
    if (ok) {
      const bonus = Math.max(0, time); // fast = more
      setScore((s) => s + 15 + bonus + streak * 2);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
      setScore((s) => Math.max(0, s - 5));
      if (!infinite) loseHeart();
    }
  }

  function next() {
    setFeedback(null);
    if (idx + 1 >= items.length) {
      setIdx(items.length);
      awardXp(25 + Math.floor(score / 10));
    } else {
      setIdx((i) => i + 1);
    }
  }

  function restart() {
    setIdx(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setRound((r) => r + 1);
  }

  if (finished) {
    return (
      <GameShell title="🎯 Análise Dimensional" score={score} streak={streak}>
        <Card className="bg-emerald-500/10 text-center">
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
            Fim! Pontuação {score} · Melhor streak {streak}
          </div>
          <Button className="mt-3" onClick={restart}>
            <RefreshCw size={14} /> Jogar de novo
          </Button>
        </Card>
      </GameShell>
    );
  }

  const correctOpt = current.options.find((o) => o.correct);

  return (
    <GameShell
      title="🎯 Análise Dimensional"
      subtitle={`${idx + 1} / ${items.length} · ${SECONDS_PER}s/questão`}
      score={score}
      streak={streak}
    >
      <Card>
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>Nível {current.options.length === 3 ? "••" : "•"}</span>
          <span className={`flex items-center gap-1 font-bold ${time < 5 ? "text-rose-500" : ""}`}>
            <Timer size={14} /> {time}s
          </span>
        </div>
        <div className="mt-2 text-lg font-bold">Qual expressão tem dimensão de</div>
        <div className="text-xl font-extrabold text-indigo-600">{current.quantity}?</div>
        <div className="mt-1 text-xs text-[var(--muted)]">Dimensões esperadas: {current.dims}</div>
      </Card>

      <div className="grid gap-2">
        {current.options.map((opt) => {
          const shown = feedback && (opt.correct || feedback.picked === opt.expr);
          const color = !feedback
            ? "border-[var(--border)] bg-[var(--bg-elev)]"
            : opt.correct
              ? "border-emerald-500 bg-emerald-500/10"
              : feedback.picked === opt.expr
                ? "border-rose-500 bg-rose-500/10"
                : "border-[var(--border)] bg-[var(--bg-elev)] opacity-60";
          return (
            <button
              key={opt.expr}
              onClick={() => pick(opt.expr)}
              disabled={!!feedback}
              className={`card-hover rounded-xl border p-3 text-left ${color}`}
            >
              <div className="font-mono text-lg font-bold">{opt.expr}</div>
              {shown && opt.note && <div className="text-xs text-[var(--muted)]">{opt.note}</div>}
            </button>
          );
        })}
      </div>

      {feedback && (
        <Card className={feedback.ok ? "bg-emerald-500/10" : "bg-rose-500/10"}>
          <div className="font-bold">
            {feedback.ok ? "Isso! Dimensão confere 🎯" : `Errou. Certa: ${correctOpt?.expr}`}
          </div>
          <div className="mt-1 text-sm">{current.explain}</div>
          {!feedback.ok && !infinite && (
            <div className="mt-1 flex items-center gap-1 text-xs text-rose-600">
              <Heart size={12} className="fill-rose-500 text-rose-500" /> −1 vida
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
