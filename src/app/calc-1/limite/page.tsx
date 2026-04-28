"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { compile, safeEval, numericLimit } from "@/lib/calc/expr";

export default function LimitePage() {
  const [expr, setExpr] = useState("sin(x)/x");
  const [aStr, setAStr] = useState("0");

  const a = Number(aStr);

  const { fn, error } = useMemo(() => {
    try { return { fn: compile(expr), error: null as string | null }; } catch (e) { return { fn: null, error: (e as Error).message }; }
  }, [expr]);

  const result = useMemo(() => {
    if (!fn || !Number.isFinite(a)) return null;
    return numericLimit(fn, a);
  }, [fn, a]);

  const epsilons = [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6];
  const rows = useMemo(() => {
    if (!fn || !Number.isFinite(a)) return [];
    return epsilons.map((e) => ({
      eps: e,
      left: safeEval(fn, a - e),
      right: safeEval(fn, a + e),
    }));
  }, [fn, a]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header>
        <h1 className="text-2xl font-extrabold">Visualizador de Limite</h1>
        <p className="text-sm text-[var(--muted)]">Tabela x → a⁻ e x → a⁺. Diz se converge, diverge ou oscila.</p>
      </header>

      <Card>
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <input value={expr} onChange={(e) => setExpr(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono" placeholder="f(x)" />
          <input value={aStr} onChange={(e) => setAStr(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono" placeholder="x → a (ex: 0)" />
        </div>
        {error && <div className="mt-2 rounded-lg bg-rose-500/10 p-2 text-xs text-rose-700">{error}</div>}
      </Card>

      {result && (
        <Card>
          <CardTitle>Resultado</CardTitle>
          <div className="mt-2 flex flex-col gap-2">
            <Row label="Status" value={result.status} highlight />
            <Row label="lim x → a⁻" value={fmt(result.left)} />
            <Row label="lim x → a⁺" value={fmt(result.right)} />
            {result.value !== null && <Row label="Limite" value={fmt(result.value)} highlight />}
          </div>
        </Card>
      )}

      <Card>
        <CardTitle>Tabela de aproximação</CardTitle>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
              <th className="py-1">ε</th>
              <th>f(a−ε)</th>
              <th>f(a+ε)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.eps} className="border-b border-[var(--border)]/50">
                <td className="py-1 font-mono">{r.eps}</td>
                <td className="font-mono">{fmt(r.left)}</td>
                <td className="font-mono">{fmt(r.right)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function fmt(v: number): string {
  if (!Number.isFinite(v)) return v > 0 ? "+∞" : v < 0 ? "−∞" : "?";
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
