"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, FlaskConical } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { molarMass } from "@/lib/chem/elements";

const SUGGESTIONS = ["H2O", "CO2", "NaCl", "H2SO4", "Ca(OH)2", "C6H12O6", "(NH4)2SO4", "CuSO4·5H2O", "KMnO4", "Fe2O3"];

export default function MolarMassPage() {
  const [formula, setFormula] = useState("H2O");
  const [error, setError] = useState<string | null>(null);

  let result: ReturnType<typeof molarMass> | null = null;
  try {
    result = formula.trim() ? molarMass(formula.trim()) : null;
    if (error) setError(null);
  } catch (e) {
    if (formula.trim()) {
      const msg = e instanceof Error ? e.message : "Fórmula inválida";
      if (msg !== error) setError(msg);
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/calc" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar para Calculadoras
      </Link>
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
          <FlaskConical size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Massa Molar</h1>
          <p className="text-sm text-[var(--muted)]">Digite uma fórmula química e calcule a massa molar com decomposição por elemento.</p>
        </div>
      </header>

      <Card>
        <label className="block text-sm font-semibold">Fórmula química</label>
        <input
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-lg"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="ex: H2O, C6H12O6, Ca(OH)2"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFormula(s)}
              className="rounded-md border border-[var(--border)] px-2 py-0.5 text-xs hover:bg-[var(--bg)]"
            >
              {s}
            </button>
          ))}
        </div>
        {error && <div className="mt-2 rounded-md bg-rose-500/10 p-2 text-xs text-rose-600">{error}</div>}
      </Card>

      {result && !error && (
        <Card>
          <CardTitle>Resultado</CardTitle>
          <div className="mt-2 text-3xl font-extrabold text-indigo-600">
            {result.total.toFixed(3)} <span className="text-base font-normal text-[var(--muted)]">g/mol</span>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] text-xs uppercase text-[var(--muted)]">
                <tr>
                  <th className="py-2">Elemento</th>
                  <th>Quantidade</th>
                  <th>Massa atômica (u)</th>
                  <th className="text-right">Subtotal (g/mol)</th>
                </tr>
              </thead>
              <tbody>
                {result.breakdown.map((b) => (
                  <tr key={b.symbol} className="border-b border-[var(--border)]/40">
                    <td className="py-2 font-mono font-bold">{b.symbol}</td>
                    <td>×{b.count}</td>
                    <td>{b.atomic.toFixed(3)}</td>
                    <td className="text-right font-mono">{b.subtotal.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-2 font-semibold">Total</td>
                  <td className="pt-2 text-right font-mono font-bold">{result.total.toFixed(3)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      <Card>
        <CardTitle>Como ler</CardTitle>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>Maiúsculas iniciam novo elemento; minúsculas continuam (Na ≠ NA).</li>
          <li>Parênteses agrupam: <code>Ca(OH)2</code> = 1 Ca, 2 O, 2 H.</li>
          <li><code>·</code> ou <code>*</code> indicam hidrato: <code>CuSO4·5H2O</code>.</li>
        </ul>
      </Card>
    </div>
  );
}
