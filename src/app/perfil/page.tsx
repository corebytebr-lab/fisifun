"use client";

import {  } from "react";
import { useGame, xpForLevel } from "@/lib/store";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import Link from "next/link";
import { totalLessonCount, totalExerciseCount } from "@/content/index";
import { ChevronLeft, Settings, BarChart3, Flame, Sparkles } from "lucide-react";
import { useHydrated } from "@/lib/useHydrated";

// Single-codepoint emojis only (no ZWJ sequences) for maximum cross-platform
// rendering — older Windows/Android fonts often miss "🧑‍🚀" style emojis.
const AVATARS = ["😀", "😎", "🤓", "🥳", "🤖", "🦊", "🐺", "🐨", "🦉", "🐱", "🐻", "🐼", "🐯", "🦁", "🐸", "🐧"];

export default function PerfilPage() {
  const mounted = useHydrated();
  const state = useGame();
  if (!mounted) return null;

  const { total, nextNeed } = xpForLevel(state.level);
  const inLevel = state.xp - total;
  const completed = Object.values(state.lessonProgress).filter((p) => p.completed).length;
  const totalL = totalLessonCount();
  const totalE = totalExerciseCount();
  const totalAttempts = state.attemptHistory.length;
  const correctAttempts = state.attemptHistory.filter((a) => a.correct).length;

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Início
      </Link>

      <Card className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-5xl shadow-lg">
          {state.avatar}
        </div>
        <div className="flex-1">
          <input
            value={state.username}
            onChange={(e) => state.setUsername(e.target.value)}
            className="w-full rounded-md bg-transparent text-2xl font-extrabold focus:outline-none md:text-3xl"
          />
          <div className="mt-1 text-sm text-[var(--muted)]">
            Nível {state.level} · {state.xp} XP totais · Streak {state.streak} 🔥 (recorde: {state.longestStreak})
          </div>
          <div className="mt-3">
            <ProgressBar value={inLevel} max={nextNeed} color="indigo" />
            <div className="mt-1 text-xs text-[var(--muted)]">
              {inLevel}/{nextNeed} XP para o nível {state.level + 1}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>Avatar</CardTitle>
        <CardSubtitle>Escolha seu emoji.</CardSubtitle>
        <div className="mt-3 flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => state.setAvatar(a)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition ${
                state.avatar === a ? "bg-indigo-500/20 ring-2 ring-indigo-500" : "bg-[var(--bg)] hover:bg-indigo-500/10"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-500"><Flame size={16} /> Streak</div>
          <div className="mt-1 text-3xl font-extrabold">{state.streak}</div>
          <div className="text-xs text-[var(--muted)]">Recorde: {state.longestStreak}</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-500"><Sparkles size={16} /> XP total</div>
          <div className="mt-1 text-3xl font-extrabold">{state.xp}</div>
          <div className="text-xs text-[var(--muted)]">Nível {state.level}</div>
        </Card>
        <Card>
          <div className="text-sm font-semibold text-emerald-500">Lições</div>
          <div className="mt-1 text-3xl font-extrabold">{completed}/{totalL}</div>
          <div className="text-xs text-[var(--muted)]">concluídas</div>
        </Card>
        <Card>
          <div className="text-sm font-semibold text-sky-500">Exercícios</div>
          <div className="mt-1 text-3xl font-extrabold">{totalAttempts}</div>
          <div className="text-xs text-[var(--muted)]">
            {totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0}% acerto
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/estatisticas">
          <Card className="card-hover flex items-center gap-3">
            <BarChart3 className="text-sky-500" />
            <div>
              <div className="font-bold">Estatísticas</div>
              <div className="text-xs text-[var(--muted)]">Gráfico semanal, desempenho por capítulo.</div>
            </div>
          </Card>
        </Link>
        <Link href="/configuracoes">
          <Card className="card-hover flex items-center gap-3">
            <Settings className="text-[var(--muted)]" />
            <div>
              <div className="font-bold">Configurações</div>
              <div className="text-xs text-[var(--muted)]">Tema, meta diária, lembretes, modo sem distração.</div>
            </div>
          </Card>
        </Link>
      </div>

      <Card>
        <CardTitle>Total do app</CardTitle>
        <CardSubtitle>O que FisiFun te oferece.</CardSubtitle>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-2xl font-extrabold">{totalL}</div>
            <div className="text-xs text-[var(--muted)]">lições</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold">{totalE}</div>
            <div className="text-xs text-[var(--muted)]">exercícios</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold">11</div>
            <div className="text-xs text-[var(--muted)]">capítulos</div>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>Zona de perigo</CardTitle>
        <CardSubtitle>Apaga todo o progresso (irreversível).</CardSubtitle>
        <div className="mt-3">
          <Button
            variant="danger"
            onClick={() => {
              if (confirm("Apagar todo o progresso?")) state.resetProgress();
            }}
          >
            Apagar progresso
          </Button>
        </div>
      </Card>
    </div>
  );
}
