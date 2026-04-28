"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, FlaskRound } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";

type Var = "C1" | "V1" | "C2" | "V2";

export default function DilutionPage() {
  const [unknown, setUnknown] = useState<Var>("V1");
  const [c1, setC1] = useState("1");
  const [v1, setV1] = useState("");
  const [c2, setC2] = useState("0.1");
  const [v2, setV2] = useState("100");

  const num = (s: string) => {
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };

  let answer: number | null = null;
  try {
    if (unknown === "C1") {
      const v = [num(v1), num(c2), num(v2)];
      if (v.every((x) => x !== null) && v[0]! !== 0) {
        answer = (v[1]! * v[2]!) / v[0]!;
      }
    } else if (unknown === "V1") {
      const v = [num(c1), num(c2), num(v2)];
      if (v.every((x) => x !== null) && v[0]! !== 0) {
        answer = (v[1]! * v[2]!) / v[0]!;
      }
    } else if (unknown === "C2") {
      const v = [num(c1), num(v1), num(v2)];
      if (v.every((x) => x !== null) && v[2]! !== 0) {
        answer = (v[0]! * v[1]!) / v[2]!;
      }
    } else if (unknown === "V2") {
      const v = [num(c1), num(v1), num(c2)];
      if (v.every((x) => x !== null) && v[2]! !== 0) {
        answer = (v[0]! * v[1]!) / v[2]!;
      }
    }
  } catch {
    // keep null
  }

  const Field = ({ name, label, value, setValue, unit }: { name: Var; label: string; value: string; setValue: (s: string) => void; unit: string }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[var(--muted)]">{label}</span>
      <div className="flex items-center gap-1">
        <input
          className={`w-full rounded-lg border px-3 py-2 font-mono ${unknown === name ? "border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100" : "border-[var(--border)] bg-[var(--bg)]"}`}
          value={unknown === name ? "?" : value}
          disabled={unknown === name}
          onChange={(e) => setValue(e.target.value)}
        />
        <span className="text-xs text-[var(--muted)]">{unit}</span>
      </div>
      <button
        type="button"
        onClick={() => setUnknown(name)}
        className={`text-[10px] underline ${unknown === name ? "text-amber-600" : "text-[var(--muted)]"}`}
      >
        {unknown === name ? "(incógnita)" : "tornar incógnita"}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/calc" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-600">
          <FlaskRound size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Diluição (C₁V₁ = C₂V₂)</h1>
          <p className="text-sm text-[var(--muted)]">Use unidades coerentes (mol/L e mL, por exemplo).</p>
        </div>
      </header>

      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <Field name="C1" label="C₁ (concentrada)" value={c1} setValue={setC1} unit="mol/L" />
          <Field name="V1" label="V₁ (concentrada)" value={v1} setValue={setV1} unit="mL ou L" />
          <Field name="C2" label="C₂ (diluída)" value={c2} setValue={setC2} unit="mol/L" />
          <Field name="V2" label="V₂ (diluída)" value={v2} setValue={setV2} unit="mL ou L" />
        </div>

        {answer !== null && (
          <div className="mt-4 rounded-xl bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300">
            <div className="text-xs font-semibold">Resultado</div>
            <div className="font-mono text-2xl font-extrabold">{unknown} = {answer.toFixed(4)}</div>
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Fórmula</CardTitle>
        <p className="mt-1 text-sm text-[var(--muted)]">
          C₁V₁ = C₂V₂. Vale para qualquer par concentrado→diluído desde que o solvente seja apenas adicionado.
        </p>
      </Card>
    </div>
  );
}
