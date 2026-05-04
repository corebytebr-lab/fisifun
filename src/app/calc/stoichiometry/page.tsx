"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Scale } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { molarMass } from "@/lib/chem/elements";

interface Reagent {
  formula: string;
  coef: number;
  amount: string; // grams
}

export default function StoichPage() {
  const [reagentA, setReagentA] = useState<Reagent>({ formula: "H2", coef: 2, amount: "4" });
  const [reagentB, setReagentB] = useState<Reagent>({ formula: "O2", coef: 1, amount: "32" });
  const [productCoef, setProductCoef] = useState(2);
  const [productFormula, setProductFormula] = useState("H2O");

  const num = (s: string) => Number(s.replace(",", "."));

  let result: { limiting: "A" | "B"; productMass: number; productMol: number; details: string[] } | null = null;
  try {
    const Ma = molarMass(reagentA.formula).total;
    const Mb = molarMass(reagentB.formula).total;
    const Mp = molarMass(productFormula).total;
    const ma = num(reagentA.amount);
    const mb = num(reagentB.amount);
    if (Number.isFinite(ma) && Number.isFinite(mb) && Number.isFinite(Ma) && Number.isFinite(Mb)) {
      const nA = ma / Ma;
      const nB = mb / Mb;
      const ratioA = nA / reagentA.coef;
      const ratioB = nB / reagentB.coef;
      const limiting = ratioA < ratioB ? "A" : "B";
      const limitingMol = limiting === "A" ? nA : nB;
      const limitingCoef = limiting === "A" ? reagentA.coef : reagentB.coef;
      const productMol = (limitingMol / limitingCoef) * productCoef;
      const productMass = productMol * Mp;
      result = {
        limiting,
        productMass,
        productMol,
        details: [
          `n(${reagentA.formula}) = ${ma}/${Ma.toFixed(2)} = ${nA.toFixed(3)} mol → razão ${(ratioA).toFixed(3)}`,
          `n(${reagentB.formula}) = ${mb}/${Mb.toFixed(2)} = ${nB.toFixed(3)} mol → razão ${(ratioB).toFixed(3)}`,
          `Limitante: ${limiting === "A" ? reagentA.formula : reagentB.formula}`,
          `n(${productFormula}) = (${limitingMol.toFixed(3)} / ${limitingCoef}) × ${productCoef} = ${productMol.toFixed(3)} mol`,
          `m(${productFormula}) = ${productMol.toFixed(3)} × ${Mp.toFixed(2)} = ${productMass.toFixed(3)} g`,
        ],
      };
    }
  } catch {
    result = null;
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/calc" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-600">
          <Scale size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Estequiometria — Reagente Limitante</h1>
          <p className="text-sm text-[var(--muted)]">Insira a equação balanceada e as massas iniciais.</p>
        </div>
      </header>

      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <ReagentForm label="Reagente A" reagent={reagentA} setReagent={setReagentA} />
          <ReagentForm label="Reagente B" reagent={reagentB} setReagent={setReagentB} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-[var(--muted)]">Coef. produto</label>
            <input
              type="number"
              min={1}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono"
              value={productCoef}
              onChange={(e) => setProductCoef(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--muted)]">Fórmula do produto</label>
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono"
              value={productFormula}
              onChange={(e) => setProductFormula(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-[var(--bg)] p-3 font-mono text-sm">
          {reagentA.coef} {reagentA.formula} + {reagentB.coef} {reagentB.formula} → {productCoef} {productFormula}
        </div>

        {result && (
          <div className="mt-4 rounded-xl bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-200">
            <div className="text-xs font-semibold uppercase">Resultado</div>
            <div className="font-mono text-xl font-extrabold">
              {result.productMass.toFixed(3)} g de {productFormula} ({result.productMol.toFixed(3)} mol)
            </div>
            <ol className="mt-2 list-decimal space-y-0.5 pl-5 text-xs">
              {result.details.map((d, i) => <li key={i}>{d}</li>)}
            </ol>
          </div>
        )}
      </Card>
    </div>
  );
}

function ReagentForm({ label, reagent, setReagent }: { label: string; reagent: Reagent; setReagent: (r: Reagent) => void }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-3">
      <div className="text-xs font-bold uppercase text-[var(--muted)]">{label}</div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-[var(--muted)]">Coef</label>
          <input
            type="number"
            min={1}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 font-mono"
            value={reagent.coef}
            onChange={(e) => setReagent({ ...reagent, coef: Number(e.target.value) })}
          />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] text-[var(--muted)]">Fórmula</label>
          <input
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 font-mono"
            value={reagent.formula}
            onChange={(e) => setReagent({ ...reagent, formula: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-2">
        <label className="text-[10px] text-[var(--muted)]">Massa (g)</label>
        <input
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 font-mono"
          value={reagent.amount}
          onChange={(e) => setReagent({ ...reagent, amount: e.target.value })}
        />
      </div>
    </div>
  );
}
