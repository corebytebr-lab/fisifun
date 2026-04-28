"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Notebook } from "lucide-react";
import { useGame } from "@/lib/store";
import { CHAPTERS } from "@/content";
import { useHydrated } from "@/lib/useHydrated";
import { RichText } from "@/lib/format";

export default function NotasPage() {
  const mounted = useHydrated();
  const state = useGame();
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  if (!mounted) return null;

  const chapter = selected ? CHAPTERS.find((c) => c.id === selected) : null;

  function open(id: string) {
    setSelected(id);
    setDraft(state.notes[id] ?? "");
    setMode("edit");
  }

  function save() {
    if (!selected) return;
    state.setNote(selected, draft);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 pt-4 md:px-0 md:pt-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Início
      </Link>
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
          <Notebook className="text-amber-500" /> Caderno
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Anote por capítulo. Suporta LaTeX em <code>$...$</code> e <code>$$...$$</code>. Salva no seu navegador.
        </p>
      </header>

      {!chapter ? (
        <div className="grid gap-3 md:grid-cols-2">
          {CHAPTERS.map((c) => {
            const note = state.notes[c.id] ?? "";
            const count = note.trim().length;
            return (
              <button key={c.id} onClick={() => open(c.id)} className="text-left">
                <Card className="transition hover:border-indigo-500/50">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{c.emoji}</div>
                    <div className="flex-1">
                      <CardTitle>Cap. {c.number} · {c.title}</CardTitle>
                      <CardSubtitle>
                        {count > 0 ? `${count} caracteres` : "Sem anotações"}
                      </CardSubtitle>
                    </div>
                  </div>
                  {count > 0 && (
                    <p className="mt-2 line-clamp-2 text-xs text-[var(--muted)]">
                      {note.slice(0, 160)}
                    </p>
                  )}
                </Card>
              </button>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>{chapter.emoji} Cap. {chapter.number} · {chapter.title}</CardTitle>
              <CardSubtitle>Suas anotações do capítulo</CardSubtitle>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>← capítulos</Button>
          </div>

          <div className="mt-3 flex gap-2 text-sm">
            <button
              onClick={() => setMode("edit")}
              className={`rounded-full px-3 py-1 ${mode === "edit" ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-200" : "text-[var(--muted)]"}`}
            >
              Editar
            </button>
            <button
              onClick={() => setMode("preview")}
              className={`rounded-full px-3 py-1 ${mode === "preview" ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-200" : "text-[var(--muted)]"}`}
            >
              Prévia
            </button>
          </div>

          {mode === "edit" ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={save}
              rows={18}
              placeholder="Ex:&#10;&#10;$F = ma$ → força resultante.&#10;&#10;Atrito estático <= μ_s N.&#10;Sempre desenhar diagrama de corpo livre antes."
              className="mt-3 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-sm outline-none focus:border-indigo-500"
            />
          ) : (
            <div className="prose-sm mt-3 min-h-[280px] rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
              {draft.trim() ? <RichText>{draft}</RichText> : <span className="text-[var(--muted)]">(vazio)</span>}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
            <span>{draft.length} caracteres</span>
            <Button size="sm" onClick={save}>Salvar</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
