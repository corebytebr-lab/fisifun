"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useGame, xpForLevel } from "@/lib/store";
import { CHAPTERS, chaptersBySubject, totalLessonCount } from "@/content/index";
import { SUBJECTS } from "@/lib/types";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { GameBar } from "@/components/game/GameBar";
import {
  Flame,
  Heart,
  Sparkles,
  Play,
  Dumbbell,
  GraduationCap,
  RefreshCw,
  BookOpen,
  Clock3,
  MessageCircleQuestion,
  Layers,
  Notebook,
  CalendarClock,
  Calculator,
  Gamepad2,
  ClipboardList,
  Presentation,
  BookX,
  PencilRuler,
  Search,
} from "lucide-react";
import { chapterCompleted, ALL_CHAPTER_IDS } from "@/lib/achievements";
import { useHydrated } from "@/lib/useHydrated";

export default function HomePage() {
  const mounted = useHydrated();

  const state = useGame();
  const lessonProgress = state.lessonProgress;
  const dailyGoalXp = state.dailyGoalXp;
  const dailyLog = state.dailyLog;

  const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);
  const todayXp = dailyLog.find((d) => d.dateKey === todayKey)?.xp ?? 0;

  const subjectChapters = useMemo(() => chaptersBySubject(state.currentSubject), [state.currentSubject]);
  const subjectChapterIds = useMemo(() => new Set(subjectChapters.map((c) => c.id)), [subjectChapters]);
  const completedLessons = Object.entries(lessonProgress).filter(([key, p]) => {
    if (!p.completed) return false;
    const cid = key.split("/")[0];
    return subjectChapterIds.has(cid);
  }).length;
  const total = totalLessonCount(state.currentSubject);

  const nextLesson = useMemo(() => {
    for (const c of subjectChapters) {
      for (const l of c.lessons) {
        const key = `${c.id}/${l.id}`;
        if (!state.lessonProgress[key]?.completed) return { chapterId: c.id, lesson: l, chapter: c };
      }
    }
    return null;
  }, [state.lessonProgress, subjectChapters]);

  // Trigger game completion check
  useEffect(() => {
    if (!mounted) return;
    const allDone = ALL_CHAPTER_IDS.every((id) => chapterCompleted(state, id));
    if (allDone && !state.gameCompleted) {
      state.markGameCompleted();
    }
  }, [mounted, state]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6 px-4 pt-4 md:px-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <Sparkles size={14} /> Olá, {state.username}!
          </div>
          <h1 className="text-2xl font-extrabold md:text-3xl">
            {(() => {
              const subj = SUBJECTS.find((s) => s.id === state.currentSubject) ?? SUBJECTS[0];
              return `Pronto para mais um pouco de ${subj.label}?`;
            })()}
          </h1>
        </div>
        <GameBar />
      </header>

      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map((s) => {
          const active = state.currentSubject === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => state.setCurrentSubject(s.id)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${active ? "border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300" : "border-[var(--border)] hover:bg-[var(--bg)]"}`}
              aria-pressed={active}
            >
              <span className="text-lg">{s.emoji}</span>
              <span className="flex flex-col items-start leading-tight">
                <span>{s.label}</span>
                <span className="text-[10px] font-normal text-[var(--muted)]">{s.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-500">
              <Flame size={16} /> Meta diária
            </div>
            <div className="mt-2 text-3xl font-extrabold">{todayXp} <span className="text-base font-normal text-[var(--muted)]">/ {dailyGoalXp} XP</span></div>
          </div>
          <div className="mt-3">
            <ProgressBar value={todayXp} max={dailyGoalXp} color="amber" />
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-500">
              <Sparkles size={16} /> Nível {state.level}
            </div>
            <div className="mt-2 text-3xl font-extrabold">{state.xp} XP</div>
          </div>
          <LevelProgress />
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-rose-500">
              <Heart size={16} /> Vidas
            </div>
            <div className="mt-2 text-3xl font-extrabold">
              {state.hearts}<span className="text-base font-normal text-[var(--muted)]">/{state.maxHearts}</span>
            </div>
          </div>
          <div className="mt-3 text-sm text-[var(--muted)]">
            Regeneram automaticamente (~25 min cada).
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        {nextLesson ? (
          <Card className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg">
            <div className="text-xs font-semibold uppercase opacity-90">Continuar estudando</div>
            <CardTitle className="!text-white">
              Cap. {nextLesson.chapter.number} — {nextLesson.lesson.title}
            </CardTitle>
            <p className="mt-1 text-sm opacity-90">{nextLesson.chapter.title}</p>
            <div className="mt-4 flex items-center gap-3">
              <Link
                href={`/licao/${nextLesson.chapterId}/${nextLesson.lesson.id}`}
              >
                <Button size="lg" variant="secondary" className="!bg-white/15 !text-white hover:!bg-white/25">
                  <Play size={18} /> Iniciar lição
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <Clock3 size={14} /> {nextLesson.lesson.estMinutes} min · +{nextLesson.lesson.xpReward} XP
              </div>
            </div>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardTitle className="!text-white">Você zerou FisiFun! 🎉</CardTitle>
            <p className="mt-1 text-sm opacity-90">
              Veja a tela de vitória com um resumo completo do que tem no app.
            </p>
            <Link href="/vitoria">
              <Button size="lg" variant="secondary" className="mt-3 !bg-white/20 !text-white hover:!bg-white/30">
                Ver tela de vitória
              </Button>
            </Link>
          </Card>
        )}

        <Card>
          <CardTitle>Progresso geral</CardTitle>
          <CardSubtitle>
            {completedLessons} / {total} lições concluídas
          </CardSubtitle>
          <div className="mt-3">
            <ProgressBar value={completedLessons} max={total} color="emerald" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <Link href="/conquistas" className="rounded-lg border border-[var(--border)] p-2 text-center hover:bg-[var(--bg)]">
              🏆 Conquistas
            </Link>
            <Link href="/estatisticas" className="rounded-lg border border-[var(--border)] p-2 text-center hover:bg-[var(--bg)]">
              📈 Estatísticas
            </Link>
          </div>
        </Card>
      </div>

      {state.currentSubject === "quimica" && (
        <div>
          <h2 className="mb-2 text-lg font-bold">Ferramentas de Química</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <QuickMode href="/calc/molar-mass" icon={<Calculator />} label="Massa molar" sub="H₂O → g/mol" color="bg-emerald-500/10 text-emerald-600" />
            <QuickMode href="/calc/stoichiometry" icon={<Calculator />} label="Estequiometria" sub="Limitante + produto" color="bg-violet-500/10 text-violet-600" />
            <QuickMode href="/calc/ph" icon={<Calculator />} label="pH / pOH" sub="Forte e fraco" color="bg-rose-500/10 text-rose-600" />
            <QuickMode href="/calc/ideal-gas" icon={<Calculator />} label="Gás ideal" sub="PV = nRT" color="bg-blue-500/10 text-blue-600" />
            <QuickMode href="/calc/dilution" icon={<Calculator />} label="Diluição" sub="C₁V₁ = C₂V₂" color="bg-cyan-500/10 text-cyan-600" />
            <QuickMode href="/tabela-periodica" icon={<BookOpen />} label="Tabela periódica" sub="118 elementos" color="bg-pink-500/10 text-pink-600" />
            <QuickMode href="/balanceador" icon={<Calculator />} label="Balanceador" sub="Equações químicas" color="bg-amber-500/10 text-amber-600" />
          </div>
        </div>
      )}

      {state.currentSubject === "ga" && (
        <div>
          <h2 className="mb-2 text-lg font-bold">Ferramentas de Geometria Analítica</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <QuickMode href="/ga/vetores" icon={<Calculator />} label="Calc. Vetorial" sub="·  ×  (u,v,w)" color="bg-violet-500/10 text-violet-600" />
            <QuickMode href="/ga/retas" icon={<Calculator />} label="Reta — 6 formas" sub="Vet ↔ par ↔ geral" color="bg-rose-500/10 text-rose-600" />
            <QuickMode href="/ga/plotter" icon={<BookOpen />} label="Plotter 2D" sub="Arraste pontos" color="bg-emerald-500/10 text-emerald-600" />
          </div>
        </div>
      )}

      {state.currentSubject === "calculo" && (
        <div>
          <h2 className="mb-2 text-lg font-bold">Ferramentas de Cálculo</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <QuickMode href="/calc-1/plotter" icon={<BookOpen />} label="Plotter de função" sub="f(x) + f'(x)" color="bg-indigo-500/10 text-indigo-600" />
            <QuickMode href="/calc-1/limite" icon={<Calculator />} label="Limite" sub="x → a⁻ / a⁺" color="bg-emerald-500/10 text-emerald-600" />
            <QuickMode href="/calc-1/integral" icon={<Calculator />} label="Integral & Riemann" sub="Esq · Méd · Simpson" color="bg-rose-500/10 text-rose-600" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <QuickMode href="/problemas" icon={<ClipboardList />} label="Problemas Halliday" sub="248 Q · • •• •••" color="bg-violet-500/10 text-violet-600" />
        <QuickMode href="/professor" icon={<Presentation />} label="Modo Professor" sub="Ensine os Lumers em 3D" color="bg-pink-500/10 text-pink-600" />
        <QuickMode href="/jogos" icon={<Gamepad2 />} label="Minijogos" sub="15 jogos didáticos" color="bg-fuchsia-500/10 text-fuchsia-600" />
        <QuickMode href="/duvida" icon={<MessageCircleQuestion />} label="Tirar dúvida" sub="Foto ou texto · IA" color="bg-indigo-500/10 text-indigo-600" />
        <QuickMode href="/flashcards" icon={<Layers />} label="Flashcards" sub="Fórmulas (SRS)" color="bg-emerald-500/10 text-emerald-600" />
        <QuickMode href="/plano" icon={<CalendarClock />} label="Plano p/ prova" sub="Cronograma" color="bg-rose-500/10 text-rose-600" />
        <QuickMode href="/notas" icon={<Notebook />} label="Caderno" sub="Anotações" color="bg-amber-500/10 text-amber-600" />
        <QuickMode href="/calc" icon={<Calculator />} label="Calculadora" sub="Com unidades" color="bg-sky-500/10 text-sky-600" />
        <QuickMode href="/treino" icon={<Dumbbell />} label="Treino" sub="5 min" color="bg-sky-500/10 text-sky-600" />
        <QuickMode href="/revisao" icon={<RefreshCw />} label="Revisar erros" sub="Só onde errei" color="bg-amber-500/10 text-amber-600" />
        <QuickMode href="/prova" icon={<GraduationCap />} label="Modo prova" sub="Simulado" color="bg-rose-500/10 text-rose-600" />
        <QuickMode href="/formulas" icon={<BookOpen />} label="Fórmulas" sub="Biblioteca" color="bg-emerald-500/10 text-emerald-600" />
        <QuickMode href="/erros" icon={<BookX />} label="Caderno de erros" sub="Tudo que errei" color="bg-rose-500/10 text-rose-600" />
        <QuickMode href="/glossario" icon={<Search />} label="Glossário" sub="Busca rápida" color="bg-cyan-500/10 text-cyan-600" />
        <QuickMode href="/quadro" icon={<PencilRuler />} label="Quadro Branco" sub="Lousa zen" color="bg-violet-500/10 text-violet-600" />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">Capítulos</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {subjectChapters.map((c) => {
            const lessons = c.lessons.length;
            const done = c.lessons.filter((l) => state.lessonProgress[`${c.id}/${l.id}`]?.completed).length;
            const unlocked = state.chapterUnlocked[c.id] || done > 0 || c.id === "01-medicao";
            return (
              <Link
                key={c.id}
                href={`/capitulo/${c.id}`}
                className={`card-hover rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4 ${!unlocked && "opacity-60"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl"
                    style={{ backgroundColor: c.color + "25" }}
                  >
                    {c.emoji}
                  </div>
                  <span className="text-xs font-bold text-[var(--muted)]">Cap. {c.number}</span>
                </div>
                <div className="mt-3 font-extrabold">{c.title}</div>
                <div className="text-xs text-[var(--muted)]">{c.subtitle}</div>
                <div className="mt-3">
                  <ProgressBar value={done} max={lessons} color={done === lessons ? "emerald" : "indigo"} />
                  <div className="mt-1 text-xs text-[var(--muted)]">{done}/{lessons} lições</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuickMode({ href, icon, label, sub, color }: { href: string; icon: React.ReactNode; label: string; sub: string; color: string }) {
  return (
    <Link
      href={href}
      className="card-hover flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-3"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>{icon}</div>
      <div className="min-w-0">
        <div className="truncate text-sm font-bold">{label}</div>
        <div className="truncate text-xs text-[var(--muted)]">{sub}</div>
      </div>
    </Link>
  );
}

function LevelProgress() {
  const xp = useGame((s) => s.xp);
  const level = useGame((s) => s.level);
  const { total, nextNeed } = xpForLevel(level);
  const inLevel = xp - total;
  return (
    <div className="mt-3">
      <ProgressBar value={inLevel} max={nextNeed} color="indigo" />
      <div className="mt-1 text-xs text-[var(--muted)]">
        Faltam {Math.max(0, nextNeed - inLevel)} XP para o nível {level + 1}.
      </div>
    </div>
  );
}
