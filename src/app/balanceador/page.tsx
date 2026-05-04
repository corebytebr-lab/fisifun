"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Equal } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { balanceEquation, type BalanceResult } from "@/lib/chem/balance";

const EXAMPLES = [
  "Fe + O2 -> Fe2O3",
  "C3H8 + O2 -> CO2 + H2O",
  "KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2",
  "Al + H2SO4 -> Al2(SO4)3 + H2",
  "C6H12O6 + O2 -> CO2 + H2O",
];

export default function BalancerPage() {
  const [input, setInput] = useState(EXAMPLES[0]);
  const [result, setResult] = useState<BalanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    try {
      const r = balanceEquation(input);
      setResult(r);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
      setResult(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
          <Equal size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Balanceador de Equações</h1>
          <p className="text-sm text-[var(--muted)]">Resolve por método algébrico (matriz + RREF).</p>
        </div>
      </header>

      <Card>
        <label className="text-sm font-semibold">Equação (use → ou =)</label>
        <input
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Fe + O2 -> Fe2O3"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {EXAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInput(s)}
              className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] font-mono hover:bg-[var(--bg)]"
            >
              {s}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={run}
          className="mt-3 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Balancear
        </button>

        {error && <div className="mt-3 rounded-md bg-rose-500/10 p-2 text-xs text-rose-600">{error}</div>}
        {result && (
          <div className="mt-3 rounded-xl bg-emerald-500/10 p-4 font-mono text-lg text-emerald-800 dark:text-emerald-200">
            {result.reactants.map((r, i) => (
              <span key={i}>
                {i > 0 && " + "}
                {r.coef !== 1 && <span className="font-bold">{r.coef} </span>}
                {r.formula}
              </span>
            ))}
            <span className="mx-2">→</span>
            {result.products.map((p, i) => (
              <span key={i}>
                {i > 0 && " + "}
                {p.coef !== 1 && <span className="font-bold">{p.coef} </span>}
                {p.formula}
              </span>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Como funciona</CardTitle>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Cada elemento gera uma equação de conservação. O sistema é resolvido em forma escalonada reduzida (RREF) e os
          coeficientes são normalizados para o menor inteiro positivo (gcd).
        </p>
      </Card>
    </div>
  );
}
