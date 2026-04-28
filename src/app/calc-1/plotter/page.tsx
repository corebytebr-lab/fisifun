"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { compile, safeEval, numDerivative } from "@/lib/calc/expr";

export default function CalcPlotterPage() {
  const [expr, setExpr] = useState("sin(x)/x");
  const [xMin, setXMin] = useState("-10");
  const [xMax, setXMax] = useState("10");
  const [showDeriv, setShowDeriv] = useState(true);

  const a = Number(xMin), b = Number(xMax);

  const { fn, error } = useMemo(() => {
    try {
      return { fn: compile(expr), error: null as string | null };
    } catch (e) {
      return { fn: null, error: (e as Error).message };
    }
  }, [expr]);

  const W = 600, H = 380, pad = 30;
  const N = 600;
  const points = useMemo(() => {
    if (!fn || !Number.isFinite(a) || !Number.isFinite(b) || b <= a) return [];
    const arr: { x: number; y: number; dy: number }[] = [];
    const dx = (b - a) / N;
    for (let i = 0; i <= N; i++) {
      const x = a + i * dx;
      arr.push({ x, y: safeEval(fn, x), dy: showDeriv ? numDerivative(fn, x) : NaN });
    }
    return arr;
  }, [fn, a, b, showDeriv]);

  const ys = points.map((p) => p.y).filter(Number.isFinite);
  const yMinV = ys.length ? Math.min(...ys) : -10;
  const yMaxV = ys.length ? Math.max(...ys) : 10;
  const yPad = (yMaxV - yMinV) * 0.1 || 1;
  const yMin = yMinV - yPad, yMax = yMaxV + yPad;

  const sx = (x: number) => pad + ((x - a) / (b - a)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad);

  const path = (key: "y" | "dy") => {
    const segs: string[] = [];
    let started = false;
    for (const p of points) {
      const v = p[key];
      if (!Number.isFinite(v)) { started = false; continue; }
      const cmd = started ? "L" : "M";
      segs.push(`${cmd}${sx(p.x).toFixed(1)} ${sy(v).toFixed(1)}`);
      started = true;
    }
    return segs.join(" ");
  };

  const examples = ["sin(x)/x", "x^2 - 3x + 2", "exp(-x^2)", "ln(x)", "x^3 - 2x", "1/(1+x^2)", "tan(x)"];

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header>
        <h1 className="text-2xl font-extrabold">Plotter de Função</h1>
        <p className="text-sm text-[var(--muted)]">Digite f(x). Suporta sin, cos, tan, exp, ln, log, sqrt, ^, π (pi), e.</p>
      </header>

      <Card>
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono"
            placeholder="ex: sin(x)/x"
          />
          <input value={xMin} onChange={(e) => setXMin(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono" placeholder="x mín" />
          <input value={xMax} onChange={(e) => setXMax(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono" placeholder="x máx" />
          <button
            type="button"
            onClick={() => setShowDeriv((v) => !v)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold ${showDeriv ? "border-emerald-500 bg-emerald-500/10 text-emerald-700" : "border-[var(--border)]"}`}
          >
            f'(x): {showDeriv ? "ON" : "OFF"}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {examples.map((ex) => (
            <button key={ex} type="button" onClick={() => setExpr(ex)} className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-mono hover:bg-[var(--bg)]">
              {ex}
            </button>
          ))}
        </div>
        {error && <div className="mt-2 rounded-lg bg-rose-500/10 p-2 text-xs text-rose-700">{error}</div>}
      </Card>

      <Card>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="rounded-xl border border-[var(--border)] bg-white">
          {/* grid */}
          {Array.from({ length: 11 }).map((_, i) => {
            const x = a + (i * (b - a)) / 10;
            return <line key={`vx${i}`} x1={sx(x)} y1={pad} x2={sx(x)} y2={H - pad} stroke="#e2e8f0" strokeWidth="1" />;
          })}
          {Array.from({ length: 9 }).map((_, i) => {
            const y = yMin + (i * (yMax - yMin)) / 8;
            return <line key={`vy${i}`} x1={pad} y1={sy(y)} x2={W - pad} y2={sy(y)} stroke="#e2e8f0" strokeWidth="1" />;
          })}
          {/* eixos */}
          <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="#475569" strokeWidth="1.5" />
          <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="#475569" strokeWidth="1.5" />

          {showDeriv && <path d={path("dy")} fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" />}
          <path d={path("y")} fill="none" stroke="#6366f1" strokeWidth="2" />

          <text x={W - pad - 5} y={sy(0) - 6} fontSize="10" fill="#475569" textAnchor="end">x</text>
          <text x={sx(0) + 4} y={pad + 12} fontSize="10" fill="#475569">y</text>
          <text x={pad + 5} y={pad + 12} fontSize="10" fill="#6366f1" fontWeight="bold">f(x)</text>
          {showDeriv && <text x={pad + 50} y={pad + 12} fontSize="10" fill="#22c55e" fontWeight="bold">f'(x)</text>}
        </svg>
        <div className="mt-2 text-xs text-[var(--muted)]">
          y de {yMin.toFixed(2)} a {yMax.toFixed(2)} · {points.filter((p) => Number.isFinite(p.y)).length} pontos válidos
        </div>
      </Card>
    </div>
  );
}
