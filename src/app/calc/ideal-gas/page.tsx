"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Wind } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";

type Var = "P" | "V" | "n" | "T";

const R = 0.0821; // L·atm/(mol·K)

export default function IdealGasPage() {
  const [unknown, setUnknown] = useState<Var>("V");
  const [P, setP] = useState("1");
  const [V, setV] = useState("");
  const [n, setN] = useState("1");
  const [T, setT] = useState("300");

  const num = (s: string) => {
    const x = Number(s.replace(",", "."));
    return Number.isFinite(x) ? x : null;
  };

  let answer: number | null = null;
  const p = num(P), v = num(V), nn = num(n), t = num(T);
  try {
    if (unknown === "P" && v !== null && nn !== null && t !== null && v !== 0) answer = (nn * R * t) / v;
    if (unknown === "V" && p !== null && nn !== null && t !== null && p !== 0) answer = (nn * R * t) / p;
    if (unknown === "n" && p !== null && v !== null && t !== null && t !== 0) answer = (p * v) / (R * t);
    if (unknown === "T" && p !== null && v !== null && nn !== null && nn !== 0) answer = (p * v) / (nn * R);
  } catch {
    // keep null
  }

  const Field = ({ name, label, value, setValue, unit }: { name: Var; label: string; value: string; setValue: (s: string) => void; unit: string }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[var(--muted)]">{label}</span>
      <input
        className={`rounded-lg border px-3 py-2 font-mono ${unknown === name ? "border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100" : "border-[var(--border)] bg-[var(--bg)]"}`}
        value={unknown === name ? "?" : value}
        disabled={unknown === name}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-[var(--muted)]">{unit}</span>
        <button type="button" onClick={() => setUnknown(name)} className={unknown === name ? "text-amber-600" : "text-[var(--muted)] underline"}>
          {unknown === name ? "(incógnita)" : "incógnita"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/calc" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600">
          <Wind size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Gás Ideal — PV = nRT</h1>
          <p className="text-sm text-[var(--muted)]">R = 0,0821 L·atm/(mol·K). Use atm, L, mol, K.</p>
        </div>
      </header>

      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <Field name="P" label="Pressão" value={P} setValue={setP} unit="atm" />
          <Field name="V" label="Volume" value={V} setValue={setV} unit="L" />
          <Field name="n" label="Mols" value={n} setValue={setN} unit="mol" />
          <Field name="T" label="Temperatura" value={T} setValue={setT} unit="K" />
        </div>

        {answer !== null && (
          <div className="mt-4 rounded-xl bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300">
            <div className="text-xs font-semibold">Resultado</div>
            <div className="font-mono text-2xl font-extrabold">{unknown} = {answer.toFixed(4)}</div>
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Cuidados com unidades</CardTitle>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>T em Kelvin (K = °C + 273,15).</li>
          <li>Volume em litros. Para mL, divida por 1000.</li>
          <li>Pressão em atm. 1 atm ≈ 101,3 kPa ≈ 760 mmHg.</li>
        </ul>
      </Card>
    </div>
  );
}
