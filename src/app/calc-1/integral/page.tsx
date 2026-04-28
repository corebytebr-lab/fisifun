"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { compile, safeEval, simpson } from "@/lib/calc/expr";

type Method = "esq" | "dir" | "med" | "trap" | "simp";

export default function IntegralPage() {
  const [expr, setExpr] = useState("x^2");
  const [aStr, setAStr] = useState("0");
  const [bStr, setBStr] = useState("1");
  const [n, setN] = useState(10);
  const [method, setMethod] = useState<Method>("med");

  const a = Number(aStr), b = Number(bStr);
  const { fn, error } = useMemo(() => {
    try { return { fn: compile(expr), error: null as string | null }; } catch (e) { return { fn: null, error: (e as Error).message }; }
  }, [expr]);

  const sum = useMemo(() => {
    if (!fn || !Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 0;
    const h = (b - a) / n;
    let s = 0;
    if (method === "simp") return simpson(fn, a, b, n % 2 ? n + 1 : n);
    if (method === "trap") {
      s = (safeEval(fn, a) + safeEval(fn, b)) / 2;
      for (let i = 1; i < n; i++) s += safeEval(fn, a + i * h);
      return s * h;
    }
    for (let i = 0; i < n; i++) {
      let xc;
      if (method === "esq") xc = a + i * h;
      else if (method === "dir") xc = a + (i + 1) * h;
      else xc = a + (i + 0.5) * h;
      s += safeEval(fn, xc);
    }
    return s * h;
  }, [fn, a, b, n, method]);

  const exact = useMemo(() => fn ? simpson(fn, a, b, 1000) : 0, [fn, a, b]);

  // SVG
  const W = 600, H = 320, pad = 30;
  const N = 400;
  const points: { x: number; y: number }[] = useMemo(() => {
    if (!fn) return [];
    const arr: { x: number; y: number }[] = [];
    const dx = (b - a) / N;
    for (let i = 0; i <= N; i++) {
      const x = a + i * dx;
      arr.push({ x, y: safeEval(fn, x) });
    }
    return arr;
  }, [fn, a, b]);
  const ys = points.map((p) => p.y).filter(Number.isFinite);
  const yMaxV = ys.length ? Math.max(0, ...ys) : 1;
  const yMinV = ys.length ? Math.min(0, ...ys) : 0;
  const yPad = (yMaxV - yMinV) * 0.1 || 1;
  const yMin = yMinV - yPad, yMax = yMaxV + yPad;
  const sx = (x: number) => pad + ((x - a) / (b - a)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad);

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(" ");

  const rects = useMemo(() => {
    if (!fn) return [];
    const h = (b - a) / n;
    const arr: { x: number; w: number; yTop: number; v: number }[] = [];
    for (let i = 0; i < n; i++) {
      let xc, x0;
      if (method === "esq") { xc = a + i * h; x0 = a + i * h; }
      else if (method === "dir") { xc = a + (i + 1) * h; x0 = a + i * h; }
      else { xc = a + (i + 0.5) * h; x0 = a + i * h; }
      arr.push({ x: x0, w: h, yTop: safeEval(fn, xc), v: safeEval(fn, xc) });
    }
    return arr;
  }, [fn, a, b, n, method]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header>
        <h1 className="text-2xl font-extrabold">Integral & Somas de Riemann</h1>
        <p className="text-sm text-[var(--muted)]">Veja os retângulos convergirem ao valor da integral.</p>
      </header>

      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <input value={expr} onChange={(e) => setExpr(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono md:col-span-2" placeholder="f(x)" />
          <input value={aStr} onChange={(e) => setAStr(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono" placeholder="a" />
          <input value={bStr} onChange={(e) => setBStr(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono" placeholder="b" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["esq", "med", "dir", "trap", "simp"] as Method[]).map((m) => (
            <button key={m} type="button" onClick={() => setMethod(m)} className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${method === m ? "border-indigo-500 bg-indigo-500/10 text-indigo-700" : "border-[var(--border)]"}`}>
              {m === "esq" ? "Esquerda" : m === "dir" ? "Direita" : m === "med" ? "Médio" : m === "trap" ? "Trapézio" : "Simpson"}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <label className="text-xs text-[var(--muted)]">n = {n}</label>
          <input type="range" min={2} max={200} step={method === "simp" ? 2 : 1} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full" />
        </div>
        {error && <div className="mt-2 rounded-lg bg-rose-500/10 p-2 text-xs text-rose-700">{error}</div>}
      </Card>

      <Card>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="rounded-xl border border-[var(--border)] bg-white">
          {rects.map((r, i) => {
            const y0 = sy(0), y1 = sy(r.yTop);
            const top = Math.min(y0, y1), height = Math.abs(y1 - y0);
            return (
              <rect key={i}
                x={sx(r.x)} y={top}
                width={Math.max(0.5, sx(r.x + r.w) - sx(r.x))}
                height={Math.max(0.5, height)}
                fill={r.v >= 0 ? "#a5b4fc66" : "#fda4af66"}
                stroke="#6366f1" strokeWidth="0.5"
              />
            );
          })}
          <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="#475569" strokeWidth="1.5" />
          <path d={path} fill="none" stroke="#6366f1" strokeWidth="2" />
        </svg>
      </Card>

      <Card>
        <CardTitle>Resultados</CardTitle>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <Row label={`Aproximação (n=${n})`} value={fmt(sum)} highlight />
          <Row label="Valor 'exato' (Simpson n=1000)" value={fmt(exact)} />
          <Row label="Erro" value={fmt(Math.abs(sum - exact))} />
        </div>
      </Card>
    </div>
  );
}

function fmt(v: number): string {
  if (!Number.isFinite(v)) return "?";
  return v.toPrecision(8).replace(/0+$/, "").replace(/\.$/, "");
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${highlight ? "bg-indigo-500/10" : "bg-[var(--bg)]"}`}>
      <span className="text-xs text-[var(--muted)]">{label}</span>
      <span className={`font-mono ${highlight ? "text-base font-bold text-indigo-700" : "text-sm font-semibold"}`}>{value}</span>
    </div>
  );
}
