"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { prettyNumber } from "@/lib/ga/vectors";

interface Pt { x: number; y: number; }

export default function Plotter2DPage() {
  const [A, setA] = useState<Pt>({ x: -3, y: -2 });
  const [B, setB] = useState<Pt>({ x: 3, y: 4 });
  const dragging = useRef<"A" | "B" | null>(null);

  // grid: -10..10 mapeado para 0..400
  const W = 400, H = 400;
  const pad = 20;
  const xMin = -10, xMax = 10, yMin = -10, yMax = 10;
  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad);
  const isx = (px: number) => xMin + ((px - pad) / (W - 2 * pad)) * (xMax - xMin);
  const isy = (py: number) => yMin + ((H - pad - py) / (H - 2 * pad)) * (yMax - yMin);

  const onPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const rect = (e.target as SVGElement).ownerSVGElement!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const x = Math.round(isx(px) * 2) / 2; // snap 0.5
    const y = Math.round(isy(py) * 2) / 2;
    if (dragging.current === "A") setA({ x, y });
    else setB({ x, y });
  };

  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const m = dx !== 0 ? dy / dx : null;
  const n = m !== null ? A.y - m * A.x : null;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };

  // reta extendida: dois pontos x=xMin, x=xMax na reta y=mx+n
  let lineX1 = 0, lineY1 = 0, lineX2 = 0, lineY2 = 0;
  if (m !== null && n !== null) {
    lineX1 = xMin; lineY1 = m * xMin + n;
    lineX2 = xMax; lineY2 = m * xMax + n;
  } else if (dx === 0) {
    lineX1 = A.x; lineY1 = yMin;
    lineX2 = A.x; lineY2 = yMax;
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header>
        <h1 className="text-2xl font-extrabold">Plotter 2D</h1>
        <p className="text-sm text-[var(--muted)]">Arraste os pontos A e B; veja equação, distância e ponto médio em tempo real.</p>
      </header>

      <Card>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          className="aspect-square max-w-md rounded-xl border border-[var(--border)] bg-white touch-none"
          onPointerMove={onPointer}
          onPointerUp={() => { dragging.current = null; }}
          onPointerLeave={() => { dragging.current = null; }}
        >
          {/* grid */}
          {Array.from({ length: 21 }, (_, i) => i - 10).map((g) => (
            <g key={g}>
              <line x1={sx(g)} y1={pad} x2={sx(g)} y2={H - pad} stroke="#e2e8f0" strokeWidth="1" />
              <line x1={pad} y1={sy(g)} x2={W - pad} y2={sy(g)} stroke="#e2e8f0" strokeWidth="1" />
            </g>
          ))}
          {/* eixos */}
          <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="#475569" strokeWidth="2" />
          <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="#475569" strokeWidth="2" />
          {/* labels */}
          <text x={W - pad - 4} y={sy(0) - 6} fontSize="10" fill="#475569" textAnchor="end">x</text>
          <text x={sx(0) + 4} y={pad + 10} fontSize="10" fill="#475569">y</text>

          {/* reta */}
          <line
            x1={sx(lineX1)} y1={sy(lineY1)} x2={sx(lineX2)} y2={sy(lineY2)}
            stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4"
          />

          {/* segmento AB */}
          <line x1={sx(A.x)} y1={sy(A.y)} x2={sx(B.x)} y2={sy(B.y)} stroke="#6366f1" strokeWidth="3" />

          {/* ponto médio */}
          <circle cx={sx(mid.x)} cy={sy(mid.y)} r="5" fill="#22c55e" />
          <text x={sx(mid.x) + 8} y={sy(mid.y) - 6} fontSize="10" fill="#22c55e">M</text>

          {/* A */}
          <circle
            cx={sx(A.x)} cy={sy(A.y)} r="9" fill="#3b82f6"
            onPointerDown={(e) => { e.preventDefault(); dragging.current = "A"; }}
            style={{ cursor: "grab" }}
          />
          <text x={sx(A.x) + 12} y={sy(A.y) - 8} fontSize="11" fill="#3b82f6" fontWeight="bold">A({A.x}, {A.y})</text>

          {/* B */}
          <circle
            cx={sx(B.x)} cy={sy(B.y)} r="9" fill="#ef4444"
            onPointerDown={(e) => { e.preventDefault(); dragging.current = "B"; }}
            style={{ cursor: "grab" }}
          />
          <text x={sx(B.x) + 12} y={sy(B.y) - 8} fontSize="11" fill="#ef4444" fontWeight="bold">B({B.x}, {B.y})</text>
        </svg>
        <div className="mt-2 text-xs text-[var(--muted)]">Toque/arraste os pontos azul (A) e vermelho (B). Snap a 0.5.</div>
      </Card>

      <Card>
        <CardTitle>Cálculos em tempo real</CardTitle>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <Row label="Distância |AB|" value={prettyNumber(dist)} />
          <Row label="Ponto médio" value={`(${prettyNumber(mid.x)}, ${prettyNumber(mid.y)})`} />
          <Row label="Vetor AB" value={`(${prettyNumber(dx)}, ${prettyNumber(dy)})`} />
          <Row label="Coef. angular" value={m !== null ? prettyNumber(m) : "—"} />
          <Row label="Equação reduzida" value={m !== null && n !== null ? `y = ${prettyNumber(m)}x + ${prettyNumber(n)}` : `x = ${A.x}`} />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[var(--bg)] px-3 py-2">
      <span className="text-xs text-[var(--muted)]">{label}</span>
      <span className="font-mono text-sm font-bold">{value}</span>
    </div>
  );
}
