"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { findChapter, findLesson, CHAPTERS } from "@/content/index";
import { useGame } from "@/lib/store";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { ExerciseRunner } from "@/components/exercicios/ExerciseRunner";
import { RichText } from "@/lib/format";
import { ChevronLeft, Heart, Sparkles, BookOpen } from "lucide-react";
import { achievements } from "@/lib/achievements";

export default function LessonClient() {
  const params = useParams<{ chapterId: string; lessonId: string }>();
  const router = useRouter();
  const chapterId = params.chapterId;
  const lessonId = params.lessonId;

  const chapter = findChapter(chapterId);
  const lesson = findLesson(chapterId, lessonId);

  const state = useGame();
  const [phase, setPhase] = useState<"intro" | "concept" | "exercise" | "done">("intro");
  const [conceptIdx, setConceptIdx] = useState(0);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [startedAt] = useState(Date.now());

  useEffect(() => {
    if (lesson?.concepts && lesson.concepts.length > 0) setPhase("concept");
    else if (lesson?.exercises && lesson.exercises.length > 0) setPhase("exercise");
    else setPhase("done");
  }, [lesson]);

  if (!chapter || !lesson) {
    return (
      <div className="p-6">
        <p>Lição não encontrada.</p>
        <Link href="/trilha">
          <Button className="mt-3"><ChevronLeft size={16} /> Voltar</Button>
        </Link>
      </div>
    );
  }

  const exercises = lesson.exercises ?? [];
  const conceptCount = lesson.concepts?.length ?? 0;

  function finish() {
    const total = exercises.length || 1;
    const score = totalAnswered > 0 ? correctCount / totalAnswered : 1;
    const minutes = Math.max(0.1, (Date.now() - startedAt) / 60000);
    const xpGain = Math.round(lesson!.xpReward * (0.4 + 0.6 * score));
    state.completeLesson(chapter!.id, lesson!.id, score, minutes, xpGain);
    // achievements
    const latest = useGame.getState();
    achievements.forEach((a) => {
      if (a.check(latest)) state.unlockAchievement(a.id);
    });
    // Unlock next chapter if we just finished the last lesson
    const allDone = chapter!.lessons.every((l) => {
      if (l.id === lesson!.id) return true;
      return state.lessonProgress[`${chapter!.id}/${l.id}`]?.completed;
    });
    if (allDone) {
      const idx = CHAPTERS.findIndex((c) => c.id === chapter!.id);
      const next = CHAPTERS[idx + 1];
      if (next) state.unlockChapter(next.id);
    }
    void total;
    setPhase("done");
  }

  const heartsOk = state.hearts > 0;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-4 md:px-0 md:pt-8">
      <header className="flex items-center justify-between gap-2">
        <Link href={`/capitulo/${chapter.id}`} className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
          <ChevronLeft size={16} /> {chapter.title}
        </Link>
        <div className="flex items-center gap-2 text-sm font-bold">
          <Heart size={16} className="text-rose-500" /> {state.hearts}
        </div>
      </header>

      {phase === "concept" && (
        <ConceptView
          chapter={chapter.title}
          lessonTitle={lesson.title}
          idx={conceptIdx}
          total={conceptCount}
          concept={lesson.concepts![conceptIdx]}
          onNext={() => {
            if (conceptIdx + 1 < conceptCount) setConceptIdx(conceptIdx + 1);
            else if (exercises.length > 0) setPhase("exercise");
            else finish();
          }}
        />
      )}

      {phase === "exercise" && exercises[exerciseIdx] && heartsOk && (
        <>
          <div className="flex items-center gap-2">
            <ProgressBar value={exerciseIdx} max={exercises.length} color="indigo" />
            <span className="text-xs text-[var(--muted)]">
              {exerciseIdx + 1}/{exercises.length}
            </span>
          </div>
          <ExerciseRunner
            key={exercises[exerciseIdx].id}
            exercise={exercises[exerciseIdx]}
            onSubmit={({ correct }) => {
              setTotalAnswered((n) => n + 1);
              if (correct) setCorrectCount((n) => n + 1);
              else state.loseHeart();
              state.recordAttempt({
                exerciseId: exercises[exerciseIdx].id,
                chapterId: chapter.id,
                lessonId: lesson.id,
                correct,
                at: Date.now(),
                concept: exercises[exerciseIdx].concept,
              });
              // upsert into SRS
              const existing = state.srs[exercises[exerciseIdx].id];
              state.upsertSrs({
                exerciseId: exercises[exerciseIdx].id,
                chapterId: chapter.id,
                lessonId: lesson.id,
                ease: existing?.ease ?? 2.3,
                interval: existing?.interval ?? 1,
                dueDate: existing?.dueDate ?? Date.now() + 86400000,
                lapses: existing?.lapses ?? 0,
                correctStreak: existing?.correctStreak ?? 0,
              });
              state.reviewSrs(exercises[exerciseIdx].id, correct);
            }}
            onNext={() => {
              if (exerciseIdx + 1 < exercises.length) setExerciseIdx(exerciseIdx + 1);
              else finish();
            }}
          />
        </>
      )}

      {phase === "exercise" && !heartsOk && (
        <Card>
          <CardTitle>Sem vidas</CardTitle>
          <CardSubtitle>Aguarde a regeneração (≈25 min cada) ou retome depois.</CardSubtitle>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => state.refillHearts()}>Reabastecer (grátis, uso pessoal)</Button>
            <Link href="/trilha"><Button variant="secondary">Voltar à trilha</Button></Link>
          </div>
        </Card>
      )}

      {phase === "done" && <DoneScreen chapter={chapter} lesson={lesson} correctCount={correctCount} total={totalAnswered} onBack={() => router.push(`/capitulo/${chapter.id}`)} />}
    </div>
  );
}

function ConceptView({
  chapter,
  lessonTitle,
  idx,
  total,
  concept,
  onNext,
}: {
  chapter: string;
  lessonTitle: string;
  idx: number;
  total: number;
  concept: { title: string; body: string; example?: string };
  onNext: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <ProgressBar value={idx + 1} max={total} color="sky" />
        <span className="text-xs text-[var(--muted)]">
          Conceito {idx + 1}/{total}
        </span>
      </div>
      <Card>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-indigo-500">
          <BookOpen size={14} /> {chapter} · {lessonTitle}
        </div>
        <CardTitle>{concept.title}</CardTitle>
        <div className="mt-3 text-sm leading-relaxed">
          <RichText>{concept.body}</RichText>
        </div>
        {concept.example && (
          <div className="mt-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3 text-sm">
            <div className="mb-1 text-xs font-bold uppercase text-indigo-500">Exemplo</div>
            <RichText>{concept.example}</RichText>
          </div>
        )}
        <div className="mt-5 flex justify-end">
          <Button onClick={onNext} size="lg">
            Continuar
          </Button>
        </div>
      </Card>
    </>
  );
}

function DoneScreen({
  chapter,
  lesson,
  correctCount,
  total,
  onBack,
}: {
  chapter: { title: string; id: string };
  lesson: { title: string; xpReward: number };
  correctCount: number;
  total: number;
  onBack: () => void;
}) {
  const acc = total > 0 ? Math.round((correctCount / total) * 100) : 100;
  const stars = acc === 100 ? 3 : acc >= 75 ? 2 : acc >= 50 ? 1 : 0;
  return (
    <Card className="text-center">
      <div className="anim-pop text-5xl">🎉</div>
      <CardTitle className="mt-2">Lição concluída!</CardTitle>
      <div className="mt-1 text-sm text-[var(--muted)]">
        {chapter.title} · {lesson.title}
      </div>
      <div className="mt-3 text-2xl">{"⭐".repeat(stars) || "⚪⚪⚪"}</div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border)] p-3">
          <div className="text-2xl font-bold text-emerald-500">
            {correctCount}/{total}
          </div>
          <div className="text-xs text-[var(--muted)]">acertos</div>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-3">
          <div className="text-2xl font-bold text-indigo-500 flex items-center justify-center gap-1">
            <Sparkles size={18} /> XP
          </div>
          <div className="text-xs text-[var(--muted)]">ganho nesta lição</div>
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-2">
        <Button onClick={onBack} size="lg">Voltar ao capítulo</Button>
      </div>
    </Card>
  );
}
