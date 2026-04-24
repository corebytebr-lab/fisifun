"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { CHAPTERS } from "@/content/index";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { ChevronLeft } from "lucide-react";
import { useHydrated } from "@/lib/useHydrated";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function EstatisticasPage() {
  const mounted = useHydrated();
  const state = useGame();

  const last7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const label = d.toLocaleDateString("pt-BR", { weekday: "short" });
      const entry = state.dailyLog.find((x) => x.dateKey === key);
      days.push({
        date: label,
        xp: entry?.xp ?? 0,
        correct: entry?.correctAnswers ?? 0,
        wrong: entry?.wrongAnswers ?? 0,
      });
    }
    return days;
  }, [state.dailyLog]);

  const chapterStats = useMemo(() => {
    return CHAPTERS.map((c) => {
      const lessons = c.lessons.length;
      const done = c.lessons.filter((l) => state.lessonProgress[`${c.id}/${l.id}`]?.completed).length;
      const attempts = state.attemptHistory.filter((a) => a.chapterId === c.id);
      const correct = attempts.filter((a) => a.correct).length;
      const acc = attempts.length > 0 ? correct / attempts.length : 0;
      return {
        name: `${c.number}. ${c.title}`,
        short: `Cap ${c.number}`,
        done,
        total: lessons,
        acc: Math.round(acc * 100),
        attempts: attempts.length,
      };
    });
  }, [state.lessonProgress, state.attemptHistory]);

  const concepts = Object.entries(state.conceptMastery)
    .map(([k, v]) => ({ name: k, mastery: Math.round(v * 100) }))
    .sort((a, b) => b.mastery - a.mastery);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/perfil" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Perfil
      </Link>
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">📈 Estatísticas</h1>
        <p className="text-sm text-[var(--muted)]">Sua evolução semanal e desempenho por capítulo.</p>
      </header>

      <Card>
        <CardTitle>XP nos últimos 7 dias</CardTitle>
        <CardSubtitle>Meta diária: {state.dailyGoalXp} XP</CardSubtitle>
        <div className="mt-3 h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted)" fontSize={12} />
              <YAxis stroke="var(--muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }} />
              <Line type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardTitle>Acertos × Erros (semana)</CardTitle>
        <div className="mt-3 h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted)" fontSize={12} />
              <YAxis stroke="var(--muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }} />
              <Bar dataKey="correct" stackId="a" fill="#22c55e" />
              <Bar dataKey="wrong" stackId="a" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardTitle>Desempenho por capítulo</CardTitle>
        <CardSubtitle>% de acerto e progresso de lições.</CardSubtitle>
        <div className="mt-3 flex flex-col gap-2">
          {chapterStats.map((c) => (
            <div key={c.name} className="rounded-xl border border-[var(--border)] p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="font-bold">{c.name}</div>
                <div className="text-[var(--muted)]">{c.done}/{c.total} lições · {c.acc}% acerto</div>
              </div>
              <div className="mt-2">
                <ProgressBar value={c.done} max={c.total} color={c.done === c.total ? "emerald" : "indigo"} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Domínio por conceito</CardTitle>
        <CardSubtitle>Baseado em seus últimos acertos/erros.</CardSubtitle>
        <div className="mt-3 flex flex-col gap-2">
          {concepts.length === 0 && (
            <div className="text-sm text-[var(--muted)]">Responda mais exercícios para começar a mapear seus conceitos.</div>
          )}
          {concepts.slice(0, 20).map((c) => (
            <div key={c.name} className="rounded-xl border border-[var(--border)] p-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-bold">{c.name}</div>
                <div className="text-[var(--muted)]">{c.mastery}%</div>
              </div>
              <div className="mt-1">
                <ProgressBar
                  value={c.mastery}
                  max={100}
                  color={c.mastery > 80 ? "emerald" : c.mastery > 50 ? "indigo" : "rose"}
                  height={6}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
