"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import * as V from "@/lib/ga/vectors";

type Mode = "2d" | "3d";

export default function VectorsCalcPage() {
  const [mode, setMode] = useState<Mode>("3d");
  const [u, setU] = useState<string[]>(["1", "2", "3"]);
  const [v, setV] = useState<string[]>(["4", "5", "6"]);
  const [w, setW] = useState<string[]>(["1", "0", "0"]);

  const dim = mode === "2d" ? 2 : 3;
  const num = (s: string) => {
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };
  const uV = u.slice(0, dim).map(num);
  const vV = v.slice(0, dim).map(num);
  const wV = w.slice(0, dim).map(num);

  const sum = V.add(uV, vV);
  const diff = V.sub(uV, vV);
  const dotResult = V.dot(uV, vV);
  const angle = V.angleDeg(uV, vV);
  const proj = V.project(uV, vV);
  const cross = mode === "3d" ? V.cross(uV, vV) : null;
  const triple = mode === "3d" ? V.triple(uV, vV, wV) : null;

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-600">
          <ArrowRight size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Calculadora Vetorial</h1>
          <p className="text-sm text-[var(--muted)]">Soma, produto escalar, vetorial, misto, ângulo e projeção.</p>
        </div>
      </header>

      <div className="flex gap-2">
        {(["2d", "3d"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${mode === m ? "border-indigo-500 bg-indigo-500/10 text-indigo-700" : "border-[var(--border)]"}`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <VectorInput label="u" dim={dim} value={u} setValue={setU} color="text-blue-600" />
        <VectorInput label="v" dim={dim} value={v} setValue={setV} color="text-rose-600" />
        {mode === "3d" && <VectorInput label="w (apenas para misto)" dim={dim} value={w} setValue={setW} color="text-emerald-600" />}
      </div>

      <Card>
        <CardTitle>Resultados</CardTitle>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <Row label="u + v" value={V.fmt(sum)} />
          <Row label="u − v" value={V.fmt(diff)} />
          <Row label="|u|" value={V.prettyNumber(V.norm(uV))} />
          <Row label="|v|" value={V.prettyNumber(V.norm(vV))} />
          <Row label="u · v" value={V.prettyNumber(dotResult)} />
          <Row label="ângulo (u, v)" value={`${V.prettyNumber(angle)}°`} />
          <Row label="proj_v(u)" value={V.fmt(proj)} />
          <Row label="ortogonais?" value={Math.abs(dotResult) < 1e-9 ? "sim" : "não"} />
          {cross && <Row label="u × v" value={V.fmt(cross)} />}
          {cross && <Row label="|u × v| (área paralelogramo)" value={V.prettyNumber(V.norm(cross))} />}
          {triple !== null && <Row label="(u, v, w) misto" value={V.prettyNumber(triple)} />}
          {triple !== null && <Row label="volume paralelepípedo |misto|" value={V.prettyNumber(Math.abs(triple))} />}
          {triple !== null && <Row label="coplanares?" value={Math.abs(triple) < 1e-9 ? "sim" : "não"} />}
        </div>
      </Card>

      <Card>
        <CardTitle>Fórmulas usadas</CardTitle>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[var(--muted)]">
          <li>u · v = u_x v_x + u_y v_y (+ u_z v_z em R³)</li>
          <li>cos θ = u·v / (|u||v|)</li>
          <li>proj_v(u) = (u·v / |v|²) v</li>
          <li>u × v = det |i j k; u; v|</li>
          <li>(u, v, w) = u · (v × w)</li>
        </ul>
      </Card>
    </div>
  );
}

function VectorInput({ label, dim, value, setValue, color }: { label: string; dim: number; value: string[]; setValue: (s: string[]) => void; color: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] p-3">
      <div className={`text-sm font-bold ${color}`}>{label}</div>
      <div className="mt-2 flex gap-2">
        {Array.from({ length: dim }, (_, i) => (
          <input
            key={i}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 font-mono"
            value={value[i] ?? ""}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              setValue(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[var(--bg)] px-3 py-2">
      <span className="text-xs text-[var(--muted)]">{label}</span>
      <span className="font-mono text-sm font-bold">{value}</span>
    </div>
  );
}
