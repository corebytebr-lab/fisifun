"use client";

import {  } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { CHAPTERS, totalLessonCount, totalExerciseCount, totalFormulaCount } from "@/content/index";
import { achievements } from "@/lib/achievements";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useHydrated } from "@/lib/useHydrated";

export default function VitoriaPage() {
  const mounted = useHydrated();
  const state = useGame();
  if (!mounted) return null;

  const totalL = totalLessonCount();
  const totalE = totalExerciseCount();
  const totalF = totalFormulaCount();
  const achievementsUnlocked = Object.keys(state.achievementsUnlocked).length;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pt-6 md:px-0">
      <div className="text-center">
        <div className="text-6xl">🚀🎉🏆</div>
        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
          Você zerou o FisiFun!
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Aqui está tudo o que o app oferece e um resumo da sua jornada.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <CardTitle className="!text-white">Sua jornada</CardTitle>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="XP total" value={state.xp} />
          <StatCard label="Nível" value={state.level} />
          <StatCard label="Maior streak" value={`${state.longestStreak} 🔥`} />
          <StatCard label="Moedas" value={state.coins} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle>📚 Conteúdo disponível</CardTitle>
          <ul className="mt-3 space-y-1 text-sm">
            <li>• <b>11 capítulos</b> de Mecânica (Halliday Vol. 1)</li>
            <li>• <b>{totalL} lições</b> (conceito, exemplo, prática, quiz)</li>
            <li>• <b>{totalE} exercícios</b> interativos</li>
            <li>• <b>{totalF} fórmulas</b> catalogadas na biblioteca</li>
            <li>• <b>{achievements.length} conquistas</b> para desbloquear</li>
          </ul>
        </Card>

        <Card>
          <CardTitle>🎮 Sistemas de jogo</CardTitle>
          <ul className="mt-3 space-y-1 text-sm">
            <li>• XP, níveis e moedas</li>
            <li>• Streak diária e recorde</li>
            <li>• Sistema de vidas com regeneração</li>
            <li>• Meta diária configurável</li>
            <li>• 3 estrelas por lição (100%, 75%, 50%)</li>
            <li>• Conquistas/medalhas</li>
          </ul>
        </Card>

        <Card>
          <CardTitle>📝 Tipos de exercício</CardTitle>
          <ul className="mt-3 space-y-1 text-sm">
            <li>• Múltipla escolha</li>
            <li>• Verdadeiro/Falso</li>
            <li>• Preencher lacunas</li>
            <li>• Montar fórmula (drag & drop)</li>
            <li>• Ordenar passos de resolução</li>
            <li>• Input numérico</li>
            <li>• Número com escolha de unidade</li>
            <li>• Interpretação de gráficos (v×t, x×t, U(x))</li>
            <li>• Mini casos e diagramas</li>
          </ul>
        </Card>

        <Card>
          <CardTitle>⚡ Modos de estudo</CardTitle>
          <ul className="mt-3 space-y-1 text-sm">
            <li>• <b>Trilha</b>: progressão linear por capítulo</li>
            <li>• <b>Treino rápido</b> (5–20 exercícios, 5 min cronometrados)</li>
            <li>• <b>Revisão de erros</b>: só o que você errou</li>
            <li>• <b>Repetição espaçada (SRS)</b>: revisão ótima</li>
            <li>• <b>Modo prova</b>: simulado cumulativo ou por capítulo</li>
            <li>• <b>Biblioteca de fórmulas</b> pesquisável</li>
          </ul>
        </Card>

        <Card>
          <CardTitle>📈 Acompanhamento</CardTitle>
          <ul className="mt-3 space-y-1 text-sm">
            <li>• Gráfico de XP dos últimos 7 dias</li>
            <li>• Acertos × erros por dia</li>
            <li>• Desempenho por capítulo</li>
            <li>• Domínio por conceito (mastery)</li>
            <li>• Histórico completo de tentativas</li>
          </ul>
        </Card>

        <Card>
          <CardTitle>⚙️ Personalização</CardTitle>
          <ul className="mt-3 space-y-1 text-sm">
            <li>• Tema claro, escuro ou automático</li>
            <li>• Modo sem distração</li>
            <li>• Meta diária configurável (25–200 XP)</li>
            <li>• Lembrete de estudo diário</li>
            <li>• Avatar e username personalizados</li>
            <li>• Exportar/importar progresso (JSON)</li>
          </ul>
        </Card>
      </div>

      <Card>
        <CardTitle>🏆 Todas as conquistas</CardTitle>
        <CardSubtitle>{achievementsUnlocked}/{achievements.length} desbloqueadas.</CardSubtitle>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {achievements.map((a) => {
            const unlocked = state.achievementsUnlocked[a.id];
            return (
              <div
                key={a.id}
                className={`rounded-xl border p-2 text-sm ${
                  unlocked
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-[var(--border)] opacity-50"
                }`}
              >
                <div className="text-2xl">{a.emoji}</div>
                <div className="mt-1 font-bold">{a.title}</div>
                <div className="text-xs text-[var(--muted)]">{a.description}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardTitle>📖 Capítulos completados</CardTitle>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {CHAPTERS.map((c) => {
            const done = c.lessons.every((l) => state.lessonProgress[`${c.id}/${l.id}`]?.completed);
            return (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3">
                <div className="text-2xl">{c.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold">Cap. {c.number} — {c.title}</div>
                  <div className="text-xs text-[var(--muted)]">{c.subtitle}</div>
                </div>
                <div>{done ? "✅" : "⏳"}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-center gap-2 pb-6">
        <Link href="/"><Button size="lg">Voltar ao início</Button></Link>
        <Link href="/estatisticas"><Button size="lg" variant="secondary">Ver estatísticas</Button></Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/15 p-3 text-center">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs opacity-90">{label}</div>
    </div>
  );
}
