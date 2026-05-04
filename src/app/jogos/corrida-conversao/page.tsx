"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CONVERSION_ITEMS } from "@/content/new-games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw, Timer, Zap } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL_TIME = 60;

export default function CorridaConversaoGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deck = useMemo(() => shuffle(CONVERSION_ITEMS), [round]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [time, setTime] = useState(TOTAL_TIME);
  const [lastFeedback, setLastFeedback] = useState<null | { ok: boolean; correct: number; hint?: string }>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (time <= 0) return;
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [idx]);

  if (!mounted) return null;

  const finished = time <= 0;
  const current = deck[idx % deck.length];

  function submit() {
    if (finished) return;
    const raw = input.trim().replace(",", ".");
    if (!raw) return;
    const num = Number(raw);
    if (!Number.isFinite(num)) return;
    // tolerance: 1% (or absolute 1e-5 for very small numbers)
    const tol = Math.max(Math.abs(current.siValue) * 0.01, 1e-5);
    const ok = Math.abs(num - current.siValue) <= tol;
    if (ok) {
      const bonus = Math.min(combo, 10);
      setScore((s) => s + 10 + bonus);
      setCombo((c) => {
        const nc = c + 1;
        setMaxCombo((m) => Math.max(m, nc));
        return nc;
      });
      setLastFeedback({ ok: true, correct: current.siValue });
    } else {
      setCombo(0);
      setTime((t) => Math.max(0, t - 3)); // time penalty
      setLastFeedback({ ok: false, correct: current.siValue, hint: current.hint });
    }
    setInput("");
    setIdx((i) => i + 1);
  }

  function restart() {
    setIdx(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTime(TOTAL_TIME);
    setInput("");
    setLastFeedback(null);
    setRound((r) => r + 1);
  }

  if (finished) {
    // Only award XP once on first finish
    return (
      <GameShell title="⚡ Corrida de Conversão" score={score} streak={maxCombo}>
        <FinishedCard score={score} maxCombo={maxCombo} onRestart={restart} />
      </GameShell>
    );
  }

  return (
    <GameShell
      title="⚡ Corrida de Conversão"
      subtitle="Converta para SI o mais rápido possível. Errou = −3 s. Combos multiplicam."
      score={score}
    >
      <Card className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-xl font-bold ${time < 10 ? "text-rose-500" : ""}`}>
          <Timer /> {time}s
        </div>
        <div className="flex items-center gap-2 text-sm text-amber-500">
          <Zap size={14} /> Combo x{combo}
        </div>
      </Card>

      <Card>
        <div className="text-xs text-[var(--muted)]">Converta para SI:</div>
        <div className="text-3xl font-extrabold">{current.prompt}</div>
        <div className="mt-3 flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            inputMode="decimal"
            placeholder="Digite o valor..."
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 font-mono text-xl focus:border-indigo-500 focus:outline-none"
          />
          <span className="text-sm font-bold text-[var(--muted)]">{current.siUnit}</span>
          <Button onClick={submit}>Enviar</Button>
        </div>
      </Card>

      {lastFeedback && (
        <Card className={lastFeedback.ok ? "bg-emerald-500/10" : "bg-rose-500/10"}>
          {lastFeedback.ok ? (
            <div className="font-bold text-emerald-700 dark:text-emerald-300">✓ Correto!</div>
          ) : (
            <div>
              <div className="font-bold text-rose-700 dark:text-rose-300">
                ✗ Errou · resposta: {lastFeedback.correct}
              </div>
              {lastFeedback.hint && <div className="text-xs text-[var(--muted)]">Dica: {lastFeedback.hint}</div>}
            </div>
          )}
        </Card>
      )}
    </GameShell>
  );
}

function FinishedCard({ score, maxCombo, onRestart }: { score: number; maxCombo: number; onRestart: () => void }) {
  const awardXp = useGame((s) => s.awardXp);
  const awardedRef = useRef(false);
  useEffect(() => {
    if (awardedRef.current) return;
    awardedRef.current = true;
    awardXp(20 + Math.floor(score / 5));
  }, [awardXp, score]);
  return (
    <Card className="bg-emerald-500/10 text-center">
      <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
        Acabou! {score} pts · combo máx {maxCombo}
      </div>
      <Button className="mt-3" onClick={onRestart}>
        <RefreshCw size={14} /> De novo
      </Button>
    </Card>
  );
}
