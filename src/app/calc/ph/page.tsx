"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Beaker } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";

type Mode = "strongAcid" | "strongBase" | "weakAcid" | "weakBase";

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: "strongAcid", label: "Ácido forte", desc: "[H⁺] = C → pH = -log[H⁺]" },
  { id: "strongBase", label: "Base forte", desc: "[OH⁻] = C → pOH; pH = 14 - pOH" },
  { id: "weakAcid", label: "Ácido fraco", desc: "Ka·C ≈ x² ⇒ x = √(Ka·C)" },
  { id: "weakBase", label: "Base fraca", desc: "Kb·C ≈ x² ⇒ pOH = -log x" },
];

export default function PhPage() {
  const [mode, setMode] = useState<Mode>("strongAcid");
  const [conc, setConc] = useState("0.01");
  const [k, setK] = useState("1.8e-5");

  const cVal = Number(conc.replace(",", "."));
  const kVal = Number(k.replace(",", "."));

  let pH: number | null = null, pOH: number | null = null, hPlus: number | null = null;
  if (Number.isFinite(cVal) && cVal > 0) {
    if (mode === "strongAcid") {
      hPlus = cVal;
      pH = -Math.log10(hPlus);
      pOH = 14 - pH;
    } else if (mode === "strongBase") {
      pOH = -Math.log10(cVal);
      pH = 14 - pOH;
      hPlus = Math.pow(10, -pH);
    } else if (mode === "weakAcid" && Number.isFinite(kVal) && kVal > 0) {
      const x = Math.sqrt(kVal * cVal);
      hPlus = x;
      pH = -Math.log10(x);
      pOH = 14 - pH;
    } else if (mode === "weakBase" && Number.isFinite(kVal) && kVal > 0) {
      const x = Math.sqrt(kVal * cVal);
      pOH = -Math.log10(x);
      pH = 14 - pOH;
      hPlus = Math.pow(10, -pH);
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/calc" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600">
          <Beaker size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">pH e pOH</h1>
          <p className="text-sm text-[var(--muted)]">Ácido/base forte ou fraco (com Ka/Kb).</p>
        </div>
      </header>

      <Card>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${mode === m.id ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300" : "border-[var(--border)]"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-[var(--muted)]">
          {MODES.find((m) => m.id === mode)?.desc}
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-[var(--muted)]">Concentração inicial (mol/L)</label>
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono"
              value={conc}
              onChange={(e) => setConc(e.target.value)}
              placeholder="0.01"
            />
          </div>
          {(mode === "weakAcid" || mode === "weakBase") && (
            <div>
              <label className="text-xs font-semibold text-[var(--muted)]">{mode === "weakAcid" ? "Ka" : "Kb"}</label>
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono"
                value={k}
                onChange={(e) => setK(e.target.value)}
                placeholder="1.8e-5"
              />
            </div>
          )}
        </div>

        {pH !== null && pOH !== null && hPlus !== null && (
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <Result label="pH" value={pH.toFixed(2)} color="bg-rose-500/10 text-rose-700" />
            <Result label="pOH" value={pOH.toFixed(2)} color="bg-blue-500/10 text-blue-700" />
            <Result label="[H⁺]" value={hPlus.toExponential(3)} color="bg-emerald-500/10 text-emerald-700" />
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Lembretes</CardTitle>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>pH + pOH = 14 a 25°C.</li>
          <li>Aproximação x ≈ √(K·C) vale quando x &lt;&lt; C (concentrações ≥ 100·K).</li>
          <li>Para sais hidrolisáveis, calcule Ka·Kb = Kw e use Kb a partir do par conjugado.</li>
        </ul>
      </Card>
    </div>
  );
}

function Result({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`rounded-xl p-3 ${color}`}>
      <div className="text-xs font-semibold">{label}</div>
      <div className="font-mono text-2xl font-extrabold">{value}</div>
    </div>
  );
}
