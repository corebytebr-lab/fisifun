"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw } from "lucide-react";

interface Puzzle {
  // componentes alvo (em unidades arbitrárias)
  tx: number;
  ty: number;
  // vetor fixo A
  a: { mag: number; angleDeg: number };
}

function makePuzzle(): Puzzle {
  const tx = Math.round((Math.random() * 10 - 5) * 10) / 10;
  const ty = Math.round((Math.random() * 10 - 5) * 10) / 10;
  const aMag = Math.round((Math.random() * 4 + 1) * 10) / 10;
  const aAngle = Math.round(Math.random() * 360);
  return { tx, ty, a: { mag: aMag, angleDeg: aAngle } };
}

function xy(mag: number, angleDeg: number) {
  const r = (angleDeg * Math.PI) / 180;
  return { x: mag * Math.cos(r), y: mag * Math.sin(r) };
}

const SCALE = 30; // pixels per unit
const CX = 200;
const CY = 200;

export default function VetorAlvoGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const puzzle = useMemo(() => makePuzzle(), [round]);
  const [bMag, setBMag] = useState(3);
  const [bAngle, setBAngle] = useState(45);
  const [score, setScore] = useState(0);

  if (!mounted) return null;

  const a = xy(puzzle.a.mag, puzzle.a.angleDeg);
  const b = xy(bMag, bAngle);
  const rx = a.x + b.x;
  const ry = a.y + b.y;
  const err = Math.hypot(rx - puzzle.tx, ry - puzzle.ty);
  const good = err < 0.2;

  function lock() {
    if (good) {
      setScore((s) => s + 30);
      awardXp(10);
      setRound((r) => r + 1);
      setBMag(3);
      setBAngle(45);
    }
  }

  const toPx = (x: number, y: number) => ({ x: CX + x * SCALE, y: CY - y * SCALE });
  const target = toPx(puzzle.tx, puzzle.ty);
  const aEnd = toPx(a.x, a.y);
  const bEnd = toPx(a.x + b.x, a.y + b.y);

  return (
    <GameShell
      title="🎯 Vetor-alvo"
      subtitle="Ajuste módulo e ângulo de B para que A + B atinja o alvo (⊕)."
      score={score}
      rightSlot={
        <Button size="sm" variant="secondary" onClick={() => setRound((r) => r + 1)}>
          <RefreshCw size={14} /> Novo alvo
        </Button>
      }
    >
      <Card>
        <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
          {/* grid */}
          <g stroke="currentColor" strokeOpacity="0.1">
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`v-${i}`} x1={i * 40} y1={0} x2={i * 40} y2={400} />
            ))}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`h-${i}`} x1={0} y1={i * 40} x2={400} y2={i * 40} />
            ))}
          </g>
          {/* axes */}
          <line x1={0} y1={CY} x2={400} y2={CY} stroke="currentColor" strokeOpacity="0.4" />
          <line x1={CX} y1={0} x2={CX} y2={400} stroke="currentColor" strokeOpacity="0.4" />
          {/* target */}
          <circle cx={target.x} cy={target.y} r={12} fill="none" stroke="#f59e0b" strokeWidth={3} />
          <line x1={target.x - 10} y1={target.y} x2={target.x + 10} y2={target.y} stroke="#f59e0b" strokeWidth={2} />
          <line x1={target.x} y1={target.y - 10} x2={target.x} y2={target.y + 10} stroke="#f59e0b" strokeWidth={2} />
          {/* A */}
          <line x1={CX} y1={CY} x2={aEnd.x} y2={aEnd.y} stroke="#6366f1" strokeWidth={3} markerEnd="url(#arrA)" />
          {/* B (after A) */}
          <line x1={aEnd.x} y1={aEnd.y} x2={bEnd.x} y2={bEnd.y} stroke="#10b981" strokeWidth={3} markerEnd="url(#arrB)" />
          {/* Result dashed */}
          <line x1={CX} y1={CY} x2={bEnd.x} y2={bEnd.y} stroke={good ? "#10b981" : "#ef4444"} strokeWidth={2} strokeDasharray="4 4" />
          <defs>
            <marker id="arrA" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#6366f1" />
            </marker>
            <marker id="arrB" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#10b981" />
            </marker>
          </defs>
        </svg>

        <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
          <div>
            <div className="text-xs text-[var(--muted)]">Alvo</div>
            <div className="font-mono">({puzzle.tx}, {puzzle.ty})</div>
          </div>
          <div>
            <div className="text-xs text-[var(--muted)]">Vetor A (fixo)</div>
            <div className="font-mono">|A|={puzzle.a.mag} / {puzzle.a.angleDeg}°</div>
          </div>
          <div>
            <div className="text-xs text-[var(--muted)]">Resultante atual</div>
            <div className="font-mono">({rx.toFixed(2)}, {ry.toFixed(2)}) · err={err.toFixed(2)}</div>
          </div>
        </div>
      </Card>

      <Card>
        <label className="block text-sm">
          <div className="mb-1 font-semibold">|B| = {bMag.toFixed(1)}</div>
          <input
            type="range"
            min={0}
            max={10}
            step={0.1}
            value={bMag}
            onChange={(e) => setBMag(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="mt-3 block text-sm">
          <div className="mb-1 font-semibold">Ângulo B = {bAngle}°</div>
          <input
            type="range"
            min={0}
            max={359}
            step={1}
            value={bAngle}
            onChange={(e) => setBAngle(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </label>
        <div className="mt-3 flex items-center gap-2">
          <Button onClick={lock} disabled={!good} variant={good ? "success" : "primary"}>
            {good ? "Acertou! (+30 · próximo)" : "Chegue ao alvo"}
          </Button>
          <span className="text-xs text-[var(--muted)]">
            Dica: ajuste o ângulo primeiro, depois o módulo.
          </span>
        </div>
      </Card>
    </GameShell>
  );
}
