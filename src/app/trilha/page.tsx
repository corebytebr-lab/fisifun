"use client";

import Link from "next/link";
import { chaptersBySubject } from "@/content/index";
import { SUBJECTS } from "@/lib/types";
import { useGame } from "@/lib/store";
import { useMemo } from "react";
import { Lock, Check } from "lucide-react";
import { useHydrated } from "@/lib/useHydrated";

export default function TrilhaPage() {
  const mounted = useHydrated();

  const progress = useGame((s) => s.lessonProgress);
  const chapterUnlocked = useGame((s) => s.chapterUnlocked);
  const currentSubject = useGame((s) => s.currentSubject);
  const setCurrentSubject = useGame((s) => s.setCurrentSubject);
  const list = useMemo(() => chaptersBySubject(currentSubject), [currentSubject]);
  const subjectInfo = SUBJECTS.find((s) => s.id === currentSubject) ?? SUBJECTS[0];

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Trilha de aprendizado</h1>
        <p className="text-sm text-[var(--muted)]">{subjectInfo.label} — {subjectInfo.description}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentSubject(s.id)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold ${currentSubject === s.id ? "border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300" : "border-[var(--border)] hover:bg-[var(--bg)]"}`}
          >
            <span>{s.emoji}</span> {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {list.map((c, chIdx) => {
          const prevChapter = list[chIdx - 1];
          const prevDone = !prevChapter || prevChapter.lessons.every((l) => progress[`${prevChapter.id}/${l.id}`]?.completed);
          const unlocked = chIdx === 0 || chapterUnlocked[c.id] || prevDone;
          return (
            <section key={c.id} className="relative">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-md"
                  style={{ backgroundColor: c.color + "35", color: c.color }}
                >
                  {c.emoji}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-[var(--muted)]">Capítulo {c.number}</div>
                  <h2 className="text-lg font-extrabold md:text-xl">{c.title}</h2>
                </div>
              </div>

              {/* Trilha visual: curva alternada */}
              <ol className="relative flex flex-col gap-3 pl-8">
                {c.lessons.map((l, i) => {
                  const key = `${c.id}/${l.id}`;
                  const done = progress[key]?.completed;
                  const prevLessonDone = i === 0 ? unlocked : !!progress[`${c.id}/${c.lessons[i - 1].id}`]?.completed || unlocked;
                  const canOpen = unlocked && (i === 0 || prevLessonDone);
                  const offset = i % 2 === 0 ? 0 : 40;
                  return (
                    <li key={l.id} style={{ marginLeft: offset }}>
                      {mounted ? (
                        canOpen ? (
                          <Link
                            href={`/licao/${c.id}/${l.id}`}
                            className="card-hover flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-3"
                          >
                            <LessonBadge kindEmoji={kindEmoji(l.kind)} done={!!done} color={c.color} />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-bold">{l.title}</div>
                              <div className="text-xs text-[var(--muted)]">
                                {labelKind(l.kind)} · {l.estMinutes} min · +{l.xpReward} XP
                              </div>
                            </div>
                            {done && <Check className="text-emerald-500" />}
                          </Link>
                        ) : (
                          <div className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-dashed border-[var(--border)] p-3 opacity-60">
                            <LessonBadge kindEmoji={<Lock size={16} />} done={false} color="#94a3b8" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-bold">{l.title}</div>
                              <div className="text-xs text-[var(--muted)]">Complete a lição anterior para desbloquear.</div>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="h-16 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]" />
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function LessonBadge({ kindEmoji, done, color }: { kindEmoji: React.ReactNode; done: boolean; color: string }) {
  return (
    <div
      className={`relative flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white shadow-md ${done ? "ring-4 ring-emerald-400/40" : ""}`}
      style={{ backgroundColor: done ? "#10b981" : color }}
    >
      {kindEmoji}
    </div>
  );
}

function kindEmoji(k: string) {
  switch (k) {
    case "concept": return "📖";
    case "example": return "🧠";
    case "practice": return "✏️";
    case "quiz": return "🏆";
    case "challenge": return "⚡";
    case "halliday": return "📗";
    default: return "▶";
  }
}

function labelKind(k: string) {
  switch (k) {
    case "concept": return "Conceito";
    case "example": return "Exemplo guiado";
    case "practice": return "Prática";
    case "quiz": return "Quiz";
    case "challenge": return "Desafio";
    case "halliday": return "Problemas do livro";
    default: return "Lição";
  }
}
