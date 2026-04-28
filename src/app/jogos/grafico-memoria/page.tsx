"use client";

import { useEffect, useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw } from "lucide-react";

interface Pt {
  t: number; // 0..10
  v: number; // 0..10
}

function makeTarget(): Pt[] {
  const count = 5;
  const out: Pt[] = [];
  let v = Math.round(Math.random() * 6 + 1);
  for (let i = 0; i < count; i++) {
    out.push({ t: (i * 10) / (count - 1), v });
    v = Math.min(10, Math.max(0, v + Math.round(Math.random() * 4 - 2)));
  }
  return out;
}

const W = 320;
const H = 240;
const P = 24;

function toPx(p: Pt) {
  return {
    x: P + (p.t / 10) * (W - 2 * P),
    y: H - P - (p.v / 10) * (H - 2 * P),
  };
}

export default function GraficoMemoriaGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const target = useMemo(() => makeTarget(), [round]);
  const [phase, setPhase] = useState<"memorize" | "guess" | "result">("memorize");
  const [timer, setTimer] = useState(3);
  const [guess, setGuess] = useState<Pt[]>(() => target.map((p) => ({ t: p.t, v: 5 })));
  const [score, setScore] = useState(0);

  // countdown in memorize
  useEffect(() => {
    if (phase !== "memorize") return;
    const t = setTimeout(() => {
      if (timer > 1) setTimer((x) => x - 1);
      else setPhase("guess");
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, timer]);

  if (!mounted) return null;

  function check() {
    let totalErr = 0;
    target.forEach((p, i) => {
      totalErr += Math.abs(p.v - guess[i].v);
    });
    const avgErr = totalErr / target.length;
    const points = Math.max(0, Math.round(30 - avgErr * 6));
    setScore((s) => s + points);
    setPhase("result");
    if (points > 0) awardXp(Math.max(3, Math.round(points / 3)));
  }

  function restart() {
    setRound((r) => r + 1);
    setPhase("memorize");
    setTimer(3);
    setGuess(target.map((p) => ({ t: p.t, v: 5 })));
  }

  // Build SVG
  const targetPath = target
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toPx(p).x},${toPx(p).y}`)
    .join(" ");
  const guessPath = guess
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toPx(p).x},${toPx(p).y}`)
    .join(" ");

  return (
    <GameShell
      title="📈 Gráfico memória"
      subtitle={
        phase === "memorize"
          ? `Memorize o gráfico... ${timer}`
          : phase === "guess"
            ? "Reconstrua: arraste os sliders."
            : "Resultado"
      }
      score={score}
      rightSlot={
        <Button size="sm" variant="secondary" onClick={restart}>
          <RefreshCw size={14} /> Novo
        </Button>
      }
    >
      <Card>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md mx-auto">
          {/* axes */}
          <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="currentColor" strokeOpacity="0.4" />
          <line x1={P} y1={P} x2={P} y2={H - P} stroke="currentColor" strokeOpacity="0.4" />
          <text x={W - P - 10} y={H - 6} fontSize={10} textAnchor="end" fill="currentColor">t</text>
          <text x={6} y={P + 6} fontSize={10} fill="currentColor">v</text>
          {/* grid */}
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <line
              key={`h-${v}`}
              x1={P}
              y1={H - P - (v / 10) * (H - 2 * P)}
              x2={W - P}
              y2={H - P - (v / 10) * (H - 2 * P)}
              stroke="currentColor"
              strokeOpacity="0.08"
            />
          ))}
          {phase === "memorize" && (
            <g>
              <path d={targetPath} fill="none" stroke="#6366f1" strokeWidth={3} />
              {target.map((p, i) => {
                const { x, y } = toPx(p);
                return <circle key={i} cx={x} cy={y} r={4} fill="#6366f1" />;
              })}
            </g>
          )}
          {phase === "guess" && (
            <g>
              <path d={guessPath} fill="none" stroke="#10b981" strokeWidth={3} />
              {guess.map((p, i) => {
                const { x, y } = toPx(p);
                return <circle key={i} cx={x} cy={y} r={5} fill="#10b981" />;
              })}
            </g>
          )}
          {phase === "result" && (
            <g>
              <path d={targetPath} fill="none" stroke="#6366f1" strokeWidth={3} strokeOpacity="0.8" />
              {target.map((p, i) => {
                const { x, y } = toPx(p);
                return <circle key={`t${i}`} cx={x} cy={y} r={4} fill="#6366f1" />;
              })}
              <path d={guessPath} fill="none" stroke="#10b981" strokeWidth={3} strokeDasharray="4 4" />
              {guess.map((p, i) => {
                const { x, y } = toPx(p);
                return <circle key={`g${i}`} cx={x} cy={y} r={4} fill="#10b981" />;
              })}
            </g>
          )}
        </svg>
      </Card>

      {phase === "guess" && (
        <Card>
          <div className="text-sm font-semibold">Ajuste cada ponto:</div>
          <div className="mt-2 grid gap-2">
            {guess.map((p, i) => (
              <label key={i} className="block text-sm">
                <div className="flex justify-between">
                  <span>t = {p.t.toFixed(1)}</span>
                  <span className="font-mono">v = {p.v.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={p.v}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setGuess((g) => g.map((q, j) => (j === i ? { ...q, v } : q)));
                  }}
                  className="w-full"
                />
              </label>
            ))}
          </div>
          <Button className="mt-3" onClick={check}>
            Verificar
          </Button>
        </Card>
      )}

      {phase === "result" && (
        <Card className="bg-emerald-500/10">
          <div className="font-bold text-emerald-700 dark:text-emerald-300">
            Resultado — Pontuação: {score}
          </div>
          <div className="mt-1 text-sm text-[var(--muted)]">
            Linha contínua = gráfico original · tracejada = seu palpite.
          </div>
          <Button className="mt-3" onClick={restart}>
            Jogar de novo
          </Button>
        </Card>
      )}
    </GameShell>
  );
}
