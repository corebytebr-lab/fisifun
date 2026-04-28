"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, BookX, RotateCcw, Sparkles } from "lucide-react";
import { useGame } from "@/lib/store";
import { CHAPTERS } from "@/content";
import type { Subject } from "@/lib/types";

export default function CadernoErrosPage() {
  const wrong = useGame((s) => s.wrongExercises);
  const [filterSubject, setFilterSubject] = useState<Subject | "all">("all");

  const items = useMemo(() => {
    const all = Object.values(wrong);
    return all
      .map((att) => {
        const ch = CHAPTERS.find((c) => c.id === att.chapterId);
        const lesson = ch?.lessons?.find((l) => l.id === att.lessonId);
        const ex = lesson?.exercises?.find((e) => e.id === att.exerciseId);
        return { att, chapter: ch, lesson, exercise: ex };
      })
      .filter((it) => it.chapter && it.exercise)
      .filter((it) => filterSubject === "all" ? true : (it.chapter!.subject ?? "fisica") === filterSubject)
      .sort((a, b) => b.att.at - a.att.at);
  }, [wrong, filterSubject]);

  const subjectCount = useMemo(() => {
    const counts: Record<string, number> = { fisica: 0, quimica: 0, ga: 0, calculo: 0 };
    for (const att of Object.values(wrong)) {
      const ch = CHAPTERS.find((c) => c.id === att.chapterId);
      const sub = ch?.subject ?? "fisica";
      counts[sub] = (counts[sub] ?? 0) + 1;
    }
    return counts;
  }, [wrong]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <Link href="/" className="mb-3 inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:underline">
        <ChevronLeft size={14} /> Voltar
      </Link>

      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold">
            <BookX size={24} /> Caderno de Erros
          </h1>
          <p className="text-sm text-[var(--muted)]">Tudo que você errou em um só lugar — pra revisar com calma sem perder vida.</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 text-center">
          <div className="text-3xl font-extrabold">{Object.keys(wrong).length}</div>
          <div className="text-[10px] uppercase text-[var(--muted)]">erros</div>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterPill active={filterSubject === "all"} onClick={() => setFilterSubject("all")} label={`Todas (${Object.keys(wrong).length})`} />
        <FilterPill active={filterSubject === "fisica"} onClick={() => setFilterSubject("fisica")} label={`🪐 Física (${subjectCount.fisica})`} />
        <FilterPill active={filterSubject === "quimica"} onClick={() => setFilterSubject("quimica")} label={`🧪 Química (${subjectCount.quimica})`} />
        <FilterPill active={filterSubject === "ga"} onClick={() => setFilterSubject("ga")} label={`📐 GA (${subjectCount.ga})`} />
        <FilterPill active={filterSubject === "calculo"} onClick={() => setFilterSubject("calculo")} label={`∫ Cálculo (${subjectCount.calculo})`} />
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-elev)] p-10 text-center">
          <div className="mb-2 text-5xl">🎉</div>
          <div className="font-bold">Sem erros pra revisar{filterSubject !== "all" ? ` em ${filterSubject}` : ""}!</div>
          <div className="mt-1 text-sm text-[var(--muted)]">Faça lições e exercícios — quando errar, eles aparecem aqui automaticamente.</div>
          <Link href="/trilha" className="mt-4 inline-flex items-center gap-1 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white">
            Ir à trilha
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it, idx) => (
            <ErrorCard
              key={`${it.att.exerciseId}-${idx}`}
              chapterTitle={`${it.chapter!.emoji ?? "📘"} Cap. ${it.chapter!.number} — ${it.chapter!.title}`}
              lessonTitle={it.lesson?.title ?? ""}
              prompt={it.exercise!.prompt}
              concept={it.att.concept}
              chapterId={it.chapter!.id}
              lessonId={it.lesson?.id}
              when={it.att.at}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${active ? "bg-indigo-500 text-white" : "border border-[var(--border)] bg-[var(--bg-elev)] hover:bg-[var(--bg)]"}`}
    >
      {label}
    </button>
  );
}

function ErrorCard({
  chapterTitle,
  lessonTitle,
  prompt,
  concept,
  chapterId,
  lessonId,
  when,
}: {
  chapterTitle: string;
  lessonTitle: string;
  prompt: string;
  concept?: string;
  chapterId: string;
  lessonId?: string;
  when: number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-bold text-[var(--muted)]">{chapterTitle}</div>
          <div className="text-sm font-semibold">{lessonTitle}</div>
        </div>
        <div className="text-[10px] text-[var(--muted)]">{new Date(when).toLocaleDateString("pt-BR")}</div>
      </div>
      <p className="mb-3 text-sm leading-relaxed">{prompt.length > 220 ? prompt.slice(0, 220) + "…" : prompt}</p>
      {concept && (
        <div className="mb-3 inline-block rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
          📚 {concept}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {lessonId && (
          <Link
            href={`/licao/${chapterId}/${lessonId}`}
            className="inline-flex items-center gap-1 rounded-xl bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white"
          >
            <RotateCcw size={12} /> Refazer lição
          </Link>
        )}
        <Link
          href={`/duvida?q=${encodeURIComponent(prompt.slice(0, 200))}`}
          className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold"
        >
          <Sparkles size={12} /> Resolver com IA
        </Link>
      </div>
    </div>
  );
}
