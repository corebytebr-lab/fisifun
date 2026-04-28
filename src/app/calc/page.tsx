"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Calculator } from "lucide-react";
import { evaluateExpression, formatQuantity } from "@/lib/unitcalc";

const EXAMPLES = [
  "10 N * 5 m",
  "(1200 kg) * (20 m / s)",
  "1/2 * 2 kg * (10 m/s)^2",
  "9.81 m/s^2 * 2 s",
  "72 km / h",
  "1000 kg * 9.81 m/s^2 * 10 m",
];

export default function CalcPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);

  function run(expr: string = input) {
    try {
      const q = evaluateExpression(expr);
      const r = formatQuantity(q);
      setResult(r);
      setError(null);
      setHistory((h) => [{ expr, result: r }, ...h].slice(0, 20));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setResult(null);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-4 md:px-0 md:pt-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Início
      </Link>
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
          <Calculator className="text-sky-500" /> Calculadora com unidades
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Digite com unidades (N, kg, m, s, J, W, Pa, km, km/h…). Ela checa dimensões e simplifica o resultado.
        </p>
      </header>

      <Card>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              run();
            }
          }}
          rows={2}
          placeholder="Ex: 10 N * 5 m  (Enter pra calcular)"
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-base outline-none focus:border-indigo-500"
        />
        <div className="mt-2 flex justify-end">
          <Button onClick={() => run()}>Calcular</Button>
        </div>
        {result && (
          <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="text-xs text-[var(--muted)]">Resultado</div>
            <div className="mt-1 font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-300">{result}</div>
          </div>
        )}
        {error && (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Exemplos (clica pra testar)</CardTitle>
        <CardSubtitle>O parser aceita operações com unidades físicas.</CardSubtitle>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setInput(ex);
                run(ex);
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1 font-mono text-xs hover:border-indigo-500/60"
            >
              {ex}
            </button>
          ))}
        </div>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardTitle>Histórico</CardTitle>
          <ul className="mt-2 space-y-1 font-mono text-sm">
            {history.map((h, i) => (
              <li key={i} className="flex items-center justify-between gap-2 border-b border-[var(--border)]/50 py-1 last:border-0">
                <span className="truncate text-[var(--muted)]">{h.expr}</span>
                <span className="shrink-0 font-bold">= {h.result}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
