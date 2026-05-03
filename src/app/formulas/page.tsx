"use client";

import { chaptersBySubject } from "@/content/index";
import { Card } from "@/components/ui/Card";
import { InlineMath, RichText } from "@/lib/format";
import { useMemo, useState } from "react";
import { normalizeText } from "@/lib/format";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { SUBJECTS } from "@/lib/types";

export default function FormulasPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const norm = normalizeText(q);
  const currentSubject = useGame((s) => s.currentSubject);
  const subjectChapters = useMemo(() => chaptersBySubject(currentSubject), [currentSubject]);
  const subjectInfo = SUBJECTS.find((s) => s.id === currentSubject) ?? SUBJECTS[0];

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Biblioteca de Fórmulas</h1>
        <p className="text-sm text-[var(--muted)]">Toque numa fórmula para ver variáveis, unidades e quando aplicar.</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Matéria: <span className="font-bold text-[var(--fg)]">{subjectInfo.emoji} {subjectInfo.label}</span></p>
      </header>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nome, variável ou capítulo..."
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
      />

      <div className="flex flex-col gap-6">
        {subjectChapters.map((c) => {
          const items = c.formulas.filter((f) => {
            if (!norm) return true;
            return normalizeText(`${f.name} ${f.latex} ${c.title}`).includes(norm);
          });
          if (items.length === 0) return null;
          return (
            <section key={c.id}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{c.emoji}</span>
                <h2 className="font-bold">Cap. {c.number} — {c.title}</h2>
                <Link href={`/capitulo/${c.id}`} className="ml-auto text-xs text-indigo-500 hover:underline">Ver capítulo</Link>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {items.map((f) => {
                  const id = `${c.id}-${f.id}`;
                  const open = active === id;
                  return (
                    <Card key={id} className="cursor-pointer" >
                      <button className="w-full text-left" onClick={() => setActive(open ? null : id)}>
                        <div className="font-bold">{f.name}</div>
                        <div className="my-2 text-center text-lg"><InlineMath expr={f.latex} /></div>
                        <div className="text-xs text-[var(--muted)]">{f.whenToUse}</div>
                      </button>
                      {open && (
                        <div className="mt-3 border-t border-[var(--border)] pt-3 text-sm">
                          <RichText>{f.description}</RichText>
                          {f.variables.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs font-semibold uppercase text-[var(--muted)]">Variáveis</div>
                              <ul className="mt-1 space-y-1 text-sm">
                                {f.variables.map((v) => (
                                  <li key={v.symbol} className="flex items-center gap-2">
                                    <span className="inline-block w-10 text-center"><InlineMath expr={v.symbol} /></span>
                                    <span className="text-[var(--muted)]">—</span>
                                    <span className="flex-1">{v.meaning}</span>
                                    <span className="font-mono text-xs text-[var(--muted)]">{v.unit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {f.example && (
                            <div className="mt-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-2 text-xs">
                              <span className="font-bold">Exemplo: </span>
                              <RichText>{f.example}</RichText>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
