"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, BookOpen, Search } from "lucide-react";
import { CHAPTERS } from "@/content";
import type { Subject } from "@/lib/types";

interface GlossaryEntry {
  type: "formula" | "concept";
  id: string;
  title: string;
  body: string;
  chapterId: string;
  chapterTitle: string;
  chapterNumber: number;
  subject: Subject;
}

export default function GlossarioPage() {
  const [query, setQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<Subject | "all">("all");

  const all = useMemo<GlossaryEntry[]>(() => {
    const entries: GlossaryEntry[] = [];
    for (const c of CHAPTERS) {
      const sub = c.subject ?? "fisica";
      for (const f of c.formulas ?? []) {
        entries.push({
          type: "formula",
          id: f.id,
          title: f.name,
          body: `${f.latex} — ${f.description}${f.whenToUse ? ` Quando usar: ${f.whenToUse}` : ""}`,
          chapterId: c.id,
          chapterTitle: c.title,
          chapterNumber: c.number,
          subject: sub,
        });
      }
      for (const lesson of c.lessons ?? []) {
        for (const concept of lesson.concepts ?? []) {
          entries.push({
            type: "concept",
            id: `${lesson.id}-${concept.title}`,
            title: concept.title,
            body: concept.body,
            chapterId: c.id,
            chapterTitle: c.title,
            chapterNumber: c.number,
            subject: sub,
          });
        }
      }
    }
    return entries;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((e) => filterSubject === "all" || e.subject === filterSubject)
      .filter((e) => !q || `${e.title} ${e.body} ${e.chapterTitle}`.toLowerCase().includes(q))
      .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  }, [all, query, filterSubject]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <Link href="/" className="mb-3 inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:underline">
        <ChevronLeft size={14} /> Voltar
      </Link>
      <header className="mb-4">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <BookOpen size={24} /> Glossário
        </h1>
        <p className="text-sm text-[var(--muted)]">Busca instantânea por fórmulas, definições e conceitos do app.</p>
      </header>

      <div className="mb-3 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2">
        <Search size={16} className="text-[var(--muted)]" />
        <input
          autoFocus
          type="text"
          placeholder="Buscar (ex: força, mol, derivada, vetor, pH...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "fisica", "quimica", "ga", "calculo"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterSubject(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filterSubject === s ? "bg-indigo-500 text-white" : "border border-[var(--border)] bg-[var(--bg-elev)]"}`}
          >
            {s === "all" ? "Todas" : s === "fisica" ? "🪐 Física" : s === "quimica" ? "🧪 Química" : s === "ga" ? "📐 GA" : "∫ Cálculo"}
          </button>
        ))}
      </div>

      <div className="mb-2 text-xs text-[var(--muted)]">
        {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
      </div>

      <div className="space-y-2">
        {filtered.slice(0, 200).map((e, idx) => (
          <Link
            key={`${e.id}-${idx}`}
            href={`/capitulo/${e.chapterId}`}
            className="block rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 hover:border-indigo-500"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase text-[var(--muted)]">
                  <span>{e.subject === "fisica" ? "🪐" : e.subject === "quimica" ? "🧪" : e.subject === "ga" ? "📐" : "∫"}</span>
                  <span>Cap. {e.chapterNumber} · {e.chapterTitle}</span>
                  <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-indigo-700 dark:text-indigo-300">{e.type === "formula" ? "Fórmula" : "Conceito"}</span>
                </div>
                <div className="font-bold">{e.title}</div>
                <div className="mt-1 text-xs text-[var(--muted)] line-clamp-2">{e.body}</div>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length > 200 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-elev)] p-3 text-center text-xs text-[var(--muted)]">
            … e mais {filtered.length - 200} (refine a busca)
          </div>
        )}
      </div>
    </div>
  );
}
