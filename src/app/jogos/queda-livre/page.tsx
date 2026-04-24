"use client";

import { useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw, Play } from "lucide-react";

const G = 9.81;
const H0 = 50; // altura inicial em metros (display scale)

export default function QuedaLivreGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const [targetH, setTargetH] = useState(() => 20 + Math.floor(Math.random() * 20)); // 20..40 m
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [result, setResult] = useState<{ clickedAt: number; y: number; expected: number; err: number; points: number } | null>(null);
  const [score, setScore] = useState(0);
  const raf = useRef<number | null>(null);
  const [y, setY] = useState(H0); // altura atual (começa em 50)

  useEffect(() => {
    if (!startedAt) return;
    function tick() {
      if (!startedAt) return;
      const t = (performance.now() - startedAt) / 1000;
      const newY = H0 - 0.5 * G * t * t;
      if (newY <= 0) {
        setY(0);
        return;
      }
      setY(newY);
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [startedAt]);

  if (!mounted) return null;

  function start() {
    setResult(null);
    setY(H0);
    setStartedAt(performance.now());
  }

  function hit() {
    if (!startedAt || result) return;
    const t = (performance.now() - startedAt) / 1000;
    const currentY = H0 - 0.5 * G * t * t;
    const expectedTForTarget = Math.sqrt((2 * (H0 - targetH)) / G);
    const err = Math.abs(currentY - targetH);
    let points = 0;
    if (err < 0.5) points = 30;
    else if (err < 1.5) points = 20;
    else if (err < 3) points = 10;
    else points = 0;
    setResult({ clickedAt: t, y: currentY, expected: expectedTForTarget, err, points });
    setScore((s) => s + points);
    if (raf.current) cancelAnimationFrame(raf.current);
    if (points > 0) awardXp(Math.max(5, points / 2));
  }

  function nextRound() {
    setResult(null);
    setTargetH(20 + Math.floor(Math.random() * 20));
    setStartedAt(null);
    setY(H0);
  }

  const ballPx = ((H0 - y) / H0) * 300 + 20;

  return (
    <GameShell
      title="🪂 Queda livre"
      subtitle={`Clique quando a bolinha passar pela altura alvo. g = ${G} m/s²`}
      score={score}
      rightSlot={
        <Button size="sm" variant="secondary" onClick={nextRound}>
          <RefreshCw size={14} /> Novo alvo
        </Button>
      }
    >
      <Card>
        <div className="flex items-start gap-4">
          <div className="relative h-[340px] w-16 rounded-lg border border-[var(--border)] bg-gradient-to-b from-sky-200 to-sky-50 dark:from-sky-900/50 dark:to-slate-900">
            {/* target line */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500"
              style={{ top: ((H0 - targetH) / H0) * 300 + 20 }}
            >
              <div className="absolute -right-16 -top-2 rounded bg-amber-500 px-2 text-xs font-bold text-white">
                {targetH} m
              </div>
            </div>
            {/* ball */}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-full bg-rose-500 shadow-lg transition-[top] duration-0"
              style={{ top: ballPx, width: 20, height: 20 }}
            />
            {/* ground */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-emerald-700"></div>
          </div>

          <div className="flex-1 text-sm">
            <div className="font-semibold">Alvo: {targetH} m do chão</div>
            <div className="text-[var(--muted)]">
              Altura inicial {H0} m. A bolinha cai em queda livre.
            </div>
            <div className="mt-3">
              {!startedAt && !result && (
                <Button onClick={start}>
                  <Play size={14} /> Soltar bolinha
                </Button>
              )}
              {startedAt && !result && y > 0 && (
                <Button onClick={hit} variant="success" className="animate-pulse">
                  Parar agora!
                </Button>
              )}
              {startedAt && !result && y <= 0 && (
                <Card className="bg-rose-500/10">
                  <div className="font-bold">Chegou ao chão sem você clicar.</div>
                  <Button className="mt-2" onClick={nextRound}>
                    Tentar de novo
                  </Button>
                </Card>
              )}
            </div>

            {result && (
              <Card className={result.points > 0 ? "mt-3 bg-emerald-500/10" : "mt-3 bg-rose-500/10"}>
                <div className="font-bold">
                  {result.points > 0 ? `+${result.points} pontos!` : "Fora do intervalo."}
                </div>
                <div className="mt-1 text-xs">
                  Tempo real: {result.clickedAt.toFixed(2)} s · altura no clique: {result.y.toFixed(2)} m ·
                  tempo ideal: {result.expected.toFixed(2)} s · erro: {result.err.toFixed(2)} m
                </div>
                <Button className="mt-3" onClick={nextRound}>
                  Próximo
                </Button>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </GameShell>
  );
}
