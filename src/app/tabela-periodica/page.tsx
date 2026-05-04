"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  ELEMENTS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type Element,
  type Category,
} from "@/lib/chem/elements";

// Posições especiais para os elementos sem grupo (lantanídeos/actinídeos)
function elementGridPos(e: Element): { row: number; col: number } | null {
  if (e.category === "lanthanide") {
    if (e.z === 57) return { row: 9, col: 3 };
    return { row: 9, col: 3 + (e.z - 57) };
  }
  if (e.category === "actinide") {
    if (e.z === 89) return { row: 10, col: 3 };
    return { row: 10, col: 3 + (e.z - 89) };
  }
  if (!e.group || !e.period) return null;
  return { row: e.period, col: e.group };
}

export default function PeriodicTablePage() {
  const [sel, setSel] = useState<Element | null>(ELEMENTS[0]);
  const [highlight, setHighlight] = useState<"category" | "block" | "none">("category");

  const cells: Array<{ row: number; col: number; element: Element }> = [];
  for (const e of ELEMENTS) {
    const pos = elementGridPos(e);
    if (pos) cells.push({ ...pos, element: e });
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header>
        <h1 className="text-2xl font-extrabold">Tabela Periódica</h1>
        <p className="text-sm text-[var(--muted)]">
          Clique em um elemento para ver Z, massa, configuração, raio e EN.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["category", "block", "none"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setHighlight(m)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${highlight === m ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300" : "border-[var(--border)]"}`}
          >
            Cor: {m === "category" ? "categoria" : m === "block" ? "bloco s/p/d/f" : "neutro"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid min-w-[760px] gap-1"
          style={{ gridTemplateColumns: "repeat(18, minmax(38px, 1fr))" }}
        >
          {cells.map(({ row, col, element }) => {
            const color =
              highlight === "category"
                ? CATEGORY_COLORS[element.category]
                : highlight === "block"
                ? blockColor(element.block)
                : "#64748b";
            const isSel = sel?.z === element.z;
            return (
              <button
                key={element.z}
                type="button"
                onClick={() => setSel(element)}
                style={{ gridRow: row, gridColumn: col, backgroundColor: color + (isSel ? "" : "30"), color: isSel ? "white" : color, borderColor: isSel ? color : "transparent" }}
                className={`rounded-md border-2 px-1 py-1 text-center text-[10px] font-mono leading-tight transition hover:opacity-90 ${isSel ? "shadow-lg ring-2 ring-white" : ""}`}
              >
                <div className="text-[9px] opacity-70">{element.z}</div>
                <div className="text-base font-bold">{element.symbol}</div>
                <div className="text-[8px] opacity-70 truncate">{element.mass.toFixed(1)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {sel && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold"
              style={{ backgroundColor: CATEGORY_COLORS[sel.category], color: "white" }}
            >
              {sel.symbol}
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-[var(--muted)]">{CATEGORY_LABELS[sel.category]}</div>
              <h2 className="text-xl font-extrabold">{sel.name}</h2>
              <div className="text-xs text-[var(--muted)]">Z = {sel.z} · Massa atômica {sel.mass.toFixed(3)} u</div>
            </div>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <Stat label="Período" value={String(sel.period)} />
            <Stat label="Grupo" value={sel.group ? String(sel.group) : "—"} />
            <Stat label="Bloco" value={sel.block.toUpperCase()} />
            <Stat label="Configuração eletrônica" value={sel.config} mono />
            <Stat label="Eletronegatividade" value={sel.electronegativity ? String(sel.electronegativity) : "—"} />
            <Stat label="Raio covalente (pm)" value={sel.radiusPm ? String(sel.radiusPm) : "—"} />
            {sel.flameColor && <Stat label="Cor de chama" value={sel.flameColor} />}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2">
      <div className="text-[10px] font-bold uppercase text-[var(--muted)]">{label}</div>
      <div className={`text-sm font-semibold ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function blockColor(b: "s" | "p" | "d" | "f"): string {
  return b === "s" ? "#ef4444" : b === "p" ? "#f59e0b" : b === "d" ? "#3b82f6" : "#a855f7";
}

// Suppress unused warning if needed
void ([] as Category[]);
