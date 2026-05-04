"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, CalendarClock, Play } from "lucide-react";
import { useGame } from "@/lib/store";
import { CHAPTERS } from "@/content";
import { useHydrated } from "@/lib/useHydrated";

interface DailyTask {
  dateKey: string;
  dateLabel: string;
  items: { kind: "licao" | "revisao" | "flashcards" | "prova" | "treino"; label: string; href: string }[];
  estMinutes: number;
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function labelDate(d: Date): string {
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

export default function PlanoPage() {
  const mounted = useHydrated();
  const state = useGame();

  const [examDate, setExamDate] = useState(state.studyPlan.examDate ?? "");
  const [chapters, setChapters] = useState<string[]>(state.studyPlan.chapters);
  const [dailyMinutes, setDailyMinutes] = useState(state.studyPlan.dailyMinutes);

  const today = new Date();
  const chaptersKey = chapters.join(",");
  const schedule = useMemo<DailyTask[]>(() => {
    if (!examDate || chapters.length === 0) return [];
    const exam = new Date(examDate + "T00:00");
    const days: Date[] = [];
    const cursor = new Date(today);
    cursor.setHours(0, 0, 0, 0);
    while (cursor <= exam) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    if (days.length === 0) return [];

    // Distribui lições dos capítulos selecionados ao longo dos dias (deixando últimos 2 p/ revisão+prova)
    const selectedChapters = CHAPTERS.filter((c) => chapters.includes(c.id));
    const allLessons: { chapterId: string; chapterTitle: string; lessonId: string; lessonTitle: string; est: number }[] = [];
    for (const c of selectedChapters) {
      for (const l of c.lessons) {
        allLessons.push({ chapterId: c.id, chapterTitle: c.title, lessonId: l.id, lessonTitle: l.title, est: l.estMinutes });
      }
    }

    const reviewDays = Math.min(2, Math.max(1, days.length - 1));
    const lessonDays = Math.max(1, days.length - reviewDays);
    const perDay = Math.ceil(allLessons.length / lessonDays);

    const tasks: DailyTask[] = [];
    let lessonIdx = 0;
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      const items: DailyTask["items"] = [];
      let est = 0;
      const remainingDays = days.length - i;
      if (remainingDays > reviewDays) {
        // dia de lição
        for (let k = 0; k < perDay && lessonIdx < allLessons.length; k++) {
          const L = allLessons[lessonIdx++];
          items.push({
            kind: "licao",
            label: `${L.chapterTitle}: ${L.lessonTitle}`,
            href: `/licao/${L.chapterId}/${L.lessonId}`,
          });
          est += L.est;
        }
        // preencher com revisão se sobrou tempo
        if (est < dailyMinutes) {
          items.push({ kind: "flashcards", label: "Flashcards de fórmulas (SRS)", href: "/flashcards" });
          est += 5;
        }
        if (est < dailyMinutes) {
          items.push({ kind: "revisao", label: "Rever erros", href: "/revisao" });
          est += 5;
        }
      } else if (remainingDays === 1) {
        // véspera
        items.push({ kind: "revisao", label: "Revisão geral de erros", href: "/revisao" });
        items.push({ kind: "flashcards", label: "Flashcards de fórmulas", href: "/flashcards" });
        items.push({ kind: "prova", label: "Simulado final", href: "/prova" });
        est = dailyMinutes;
      } else {
        // dias de revisão
        items.push({ kind: "prova", label: "Simulado por capítulo", href: "/prova" });
        items.push({ kind: "flashcards", label: "Flashcards de fórmulas", href: "/flashcards" });
        items.push({ kind: "treino", label: "Treino rápido", href: "/treino" });
        est = dailyMinutes;
      }
      tasks.push({ dateKey: ymd(d), dateLabel: labelDate(d), items, estMinutes: est });
    }
    return tasks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examDate, chaptersKey, dailyMinutes]);

  if (!mounted) return null;

  function toggleChapter(id: string) {
    setChapters((cs) => (cs.includes(id) ? cs.filter((x) => x !== id) : [...cs, id]));
  }

  function savePlan() {
    state.setStudyPlan({ examDate: examDate || null, chapters, dailyMinutes, createdAt: Date.now() });
  }

  function clearPlan() {
    state.setStudyPlan({ examDate: null, chapters: [], dailyMinutes: 30, createdAt: null });
    setExamDate("");
    setChapters([]);
    setDailyMinutes(30);
  }

  const isActive = state.studyPlan.examDate === examDate && state.studyPlan.chapters.length > 0;
  const todayKey = ymd(today);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-4 md:px-0 md:pt-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Início
      </Link>
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
          <CalendarClock className="text-rose-500" /> Plano de estudo
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Coloca a data da prova e o que cai. O app monta seu cronograma diário.
        </p>
      </header>

      <Card>
        <CardTitle>Configurar</CardTitle>
        <CardSubtitle>Data da prova, capítulos e quanto tempo por dia.</CardSubtitle>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">Data da prova</span>
            <input
              type="date"
              value={examDate}
              min={ymd(new Date())}
              onChange={(e) => setExamDate(e.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">Minutos por dia (meta)</span>
            <input
              type="number"
              min={5}
              max={240}
              step={5}
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Math.max(5, parseInt(e.target.value || "30", 10)))}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2"
            />
          </label>
        </div>

        <div className="mt-3">
          <span className="text-sm font-semibold">Capítulos que caem</span>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {CHAPTERS.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={chapters.includes(c.id)}
                  onChange={() => toggleChapter(c.id)}
                  className="h-4 w-4"
                />
                <span>{c.emoji} Cap. {c.number} · {c.title}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Button onClick={savePlan} disabled={!examDate || chapters.length === 0}>Salvar plano</Button>
          {isActive && (
            <Button variant="ghost" onClick={clearPlan}>Limpar</Button>
          )}
        </div>
      </Card>

      {schedule.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Cronograma ({schedule.length} dias)</h2>
          {schedule.map((d) => {
            const isToday = d.dateKey === todayKey;
            return (
              <Card key={d.dateKey} className={isToday ? "border-indigo-500/60 bg-indigo-500/5" : undefined}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">
                      {d.dateLabel} {isToday && <span className="text-xs text-indigo-500">(hoje)</span>}
                    </div>
                    <div className="text-xs text-[var(--muted)]">~{d.estMinutes} min</div>
                  </div>
                </div>
                <ul className="mt-2 flex flex-col gap-1">
                  {d.items.map((it, i) => (
                    <li key={i}>
                      <Link href={it.href} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm hover:border-indigo-500/50">
                        <span>{it.label}</span>
                        <Play size={14} className="text-indigo-500" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
