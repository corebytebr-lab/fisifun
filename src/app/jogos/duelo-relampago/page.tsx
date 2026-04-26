"use client";

import { useEffect, useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BOSSES } from "@/content/games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw, Play } from "lucide-react";

interface Q {
  prompt: string;
  options: string[];
  correct: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Q[] {
  const all: Q[] = [];
  for (const b of BOSSES) {
    for (const q of b.questions) {
      all.push({ prompt: q.prompt, options: q.options, correct: q.correct });
    }
  }
  return shuffle(all).slice(0, 10);
}

const DURATION = 60;

export default function DueloRelampagoGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deck = useMemo(() => buildDeck(), [round]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(DURATION);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started || done) return;
    if (remaining <= 0) {
      setDone(true);
      awardXp(Math.max(5, Math.round(score / 2)));
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [started, remaining, done, awardXp, score]);

  if (!mounted) return null;

  function pick(i: number) {
    if (done) return;
    const q = deck[idx];
    if (i === q.correct) {
      const pts = 10 + combo * 2;
      setScore((s) => s + pts);
      setCombo((c) => c + 1);
    } else {
      setCombo(0);
      setScore((s) => Math.max(0, s - 3));
    }
    if (idx + 1 >= deck.length) {
      setDone(true);
      awardXp(Math.max(10, Math.round(score / 2)));
    } else {
      setIdx((x) => x + 1);
    }
  }

  function restart() {
    setRound((r) => r + 1);
    setIdx(0);
    setScore(0);
    setCombo(0);
    setStarted(false);
    setRemaining(DURATION);
    setDone(false);
  }

  if (!started) {
    return (
      <GameShell
        title="⚡ Duelo relâmpago"
        subtitle="10 questões em 60 segundos. Combo multiplica XP."
      >
        <Card className="text-center">
          <Button size="lg" onClick={() => setStarted(true)}>
            <Play size={16} /> Começar
          </Button>
        </Card>
      </GameShell>
    );
  }

  if (done) {
    return (
      <GameShell title="⚡ Duelo relâmpago" score={score}>
        <Card className="bg-emerald-500/10 text-center">
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
            Fim! Pontuação {score} · Melhor combo {combo}
          </div>
          <Button className="mt-3" onClick={restart}>
            <RefreshCw size={14} /> Jogar de novo
          </Button>
        </Card>
      </GameShell>
    );
  }

  const q = deck[idx];
  return (
    <GameShell
      title="⚡ Duelo relâmpago"
      subtitle={`${idx + 1} / ${deck.length} · ${remaining}s`}
      score={score}
      streak={combo}
    >
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-1000"
          style={{ width: `${(remaining / DURATION) * 100}%` }}
        />
      </div>
      <Card>
        <div className="text-lg font-bold">{q.prompt}</div>
      </Card>
      <div className="grid gap-2 md:grid-cols-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className="card-hover rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 text-left text-lg font-semibold"
          >
            {opt}
          </button>
        ))}
      </div>
    </GameShell>
  );
}
