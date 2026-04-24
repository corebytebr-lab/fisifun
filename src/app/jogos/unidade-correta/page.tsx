"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UNIT_ITEMS, CHAPTER_LABEL } from "@/content/games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function UnidadeCorretaGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => shuffle(UNIT_ITEMS).slice(0, 8), [round]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; correct: string } | null>(null);

  if (!mounted) return null;

  const current = items[idx];
  const finished = idx >= items.length;

  function pick(opt: string) {
    if (feedback) return;
    const ok = opt === current.correct;
    setFeedback({ ok, correct: current.correct });
    if (ok) {
      setScore((s) => s + 10 + streak);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
      setScore((s) => Math.max(0, s - 3));
    }
  }

  function next() {
    setFeedback(null);
    if (idx + 1 >= items.length) {
      setIdx(items.length); // finished
      awardXp(15);
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
      <GameShell title="📐 Unidade correta" score={score} streak={streak}>
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

  return (
    <GameShell
      title="📐 Unidade correta"
      subtitle={`${idx + 1} / ${items.length}`}
      score={score}
      streak={streak}
    >
      <Card>
        <div className="text-xs text-[var(--muted)]">{CHAPTER_LABEL[current.chapterId]}</div>
        <div className="mt-2 text-xl font-bold">Qual a unidade SI de</div>
        <div className="text-xl italic">{current.label}?</div>
      </Card>

      <div className="grid gap-2 md:grid-cols-2">
        {current.options.map((opt) => {
          const isCorrect = feedback && opt === current.correct;
          const isPicked = feedback && !feedback.ok && opt !== current.correct; // not the correct and chose wrong
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={!!feedback}
              className={`card-hover rounded-xl border p-3 text-left text-lg font-semibold ${
                isCorrect
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : isPicked
                    ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    : "border-[var(--border)] bg-[var(--bg-elev)]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {feedback && (
        <Card className={feedback.ok ? "bg-emerald-500/10" : "bg-rose-500/10"}>
          <div className="font-bold">
            {feedback.ok ? "Isso! 🎯" : `Ops — resposta certa: ${feedback.correct}`}
          </div>
          <Button className="mt-2" onClick={next}>
            Próxima
          </Button>
        </Card>
      )}
    </GameShell>
  );
}
