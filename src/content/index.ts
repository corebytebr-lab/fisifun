import { cap01 } from "./chapters/01-medicao";
import { cap02 } from "./chapters/02-movimento-retilineo";
import { cap03 } from "./chapters/03-vetores";
import { cap04 } from "./chapters/04-movimento-2d-3d";
import { cap05 } from "./chapters/05-forca-i";
import { cap06 } from "./chapters/06-forca-ii";
import { cap07 } from "./chapters/07-trabalho-energia";
import { cap08 } from "./chapters/08-energia-potencial";
import { cap09 } from "./chapters/09-centro-massa-momento";
import { cap10 } from "./chapters/10-rotacao";
import { cap11 } from "./chapters/11-rolamento-torque";

import { cap01q } from "./chapters-quimica/01-materia-medidas";
import { cap02q } from "./chapters-quimica/02-atomos-moleculas-ions";
import { cap03q } from "./chapters-quimica/03-estequiometria";
import { cap04q } from "./chapters-quimica/04-reacoes-aquosas";
import { cap05q } from "./chapters-quimica/05-termoquimica";
import {
  cap06q, cap07q, cap08q, cap09q, cap10q, cap11q, cap12q, cap13q, cap14q,
  cap15q, cap16q, cap17q, cap18q, cap19q, cap20q, cap21q, cap22q, cap23q, cap24q,
} from "./chapters-quimica/more";

import { CHAPTERS_GA } from "./chapters-ga";
import { CHAPTERS_CALCULO } from "./chapters-calculo";

import type { Chapter, Exercise, Lesson, Subject } from "@/lib/types";
import { HALLIDAY_PROBLEMS } from "./halliday-problems";

// Minimum number of Halliday problems a user must answer (Acertei or Errei)
// in order to complete the chapter's "Problemas do livro" lesson.
export const HALLIDAY_LESSON_MIN_ANSWERED = 3;

/** Quantidade total de problemas do livro disponíveis no capítulo. */
export function hallidayProblemsForChapter(chapterId: string) {
  return HALLIDAY_PROBLEMS.filter((p) => p.chapterId === chapterId);
}

/**
 * Injeta uma lição "Problemas do livro (Halliday)" ao final de cada capítulo
 * que tenha problemas disponíveis. Ela só completa quando o usuário responde
 * pelo menos HALLIDAY_LESSON_MIN_ANSWERED problemas do capítulo.
 */
function withHallidayLesson(c: Chapter): Chapter {
  const count = hallidayProblemsForChapter(c.id).length;
  if (count === 0) return c;
  const hallidayLesson: Lesson = {
    id: "halliday-livro",
    title: "Problemas do livro (Halliday)",
    kind: "halliday",
    estMinutes: 15,
    xpReward: 60,
  };
  return { ...c, lessons: [...c.lessons, hallidayLesson] };
}

/** Garante que todo capítulo tenha o campo `subject` definido. */
function withSubject(c: Chapter, subject: Subject): Chapter {
  return c.subject ? c : { ...c, subject };
}

const PHYSICS_CHAPTERS: Chapter[] = [
  cap01, cap02, cap03, cap04, cap05, cap06, cap07, cap08, cap09, cap10, cap11,
]
  .map((c) => withSubject(c, "fisica"))
  .map(withHallidayLesson);

const CHEMISTRY_CHAPTERS: Chapter[] = [
  cap01q, cap02q, cap03q, cap04q, cap05q, cap06q, cap07q, cap08q, cap09q, cap10q,
  cap11q, cap12q, cap13q, cap14q, cap15q, cap16q, cap17q, cap18q, cap19q, cap20q,
  cap21q, cap22q, cap23q, cap24q,
].map((c) => withSubject(c, "quimica"));

const GA_CHAPTERS: Chapter[] = CHAPTERS_GA.map((c) => withSubject(c, "ga"));
const CALC_CHAPTERS: Chapter[] = CHAPTERS_CALCULO.map((c) => withSubject(c, "calculo"));

/**
 * CHAPTERS é a união de todas as matérias. Páginas de UI devem filtrar pela
 * `currentSubject` do store.
 */
export const CHAPTERS: Chapter[] = [
  ...PHYSICS_CHAPTERS,
  ...CHEMISTRY_CHAPTERS,
  ...GA_CHAPTERS,
  ...CALC_CHAPTERS,
];

export function chaptersBySubject(subject: Subject): Chapter[] {
  return CHAPTERS.filter((c) => (c.subject ?? "fisica") === subject);
}

export function findChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function findLesson(chapterId: string, lessonId: string): Lesson | undefined {
  const c = findChapter(chapterId);
  return c?.lessons.find((l) => l.id === lessonId);
}

export function allExercises(subject?: Subject): { chapterId: string; lessonId: string; exercise: Exercise; subject: Subject }[] {
  const out: { chapterId: string; lessonId: string; exercise: Exercise; subject: Subject }[] = [];
  const list = subject ? chaptersBySubject(subject) : CHAPTERS;
  for (const c of list) {
    const subj = (c.subject ?? "fisica") as Subject;
    for (const l of c.lessons) {
      for (const e of l.exercises ?? []) {
        out.push({ chapterId: c.id, lessonId: l.id, exercise: e, subject: subj });
      }
    }
  }
  return out;
}

export function totalLessonCount(subject?: Subject): number {
  const list = subject ? chaptersBySubject(subject) : CHAPTERS;
  return list.reduce((acc, c) => acc + c.lessons.length, 0);
}

export function totalExerciseCount(subject?: Subject): number {
  const list = subject ? chaptersBySubject(subject) : CHAPTERS;
  let n = 0;
  for (const c of list) for (const l of c.lessons) n += (l.exercises ?? []).length;
  return n;
}

export function totalFormulaCount(subject?: Subject): number {
  const list = subject ? chaptersBySubject(subject) : CHAPTERS;
  return list.reduce((acc, c) => acc + c.formulas.length, 0);
}

export function allFormulas(subject?: Subject): { chapter: Chapter; formula: Chapter["formulas"][number] }[] {
  const list = subject ? chaptersBySubject(subject) : CHAPTERS;
  const out: { chapter: Chapter; formula: Chapter["formulas"][number] }[] = [];
  for (const c of list) {
    for (const f of c.formulas) {
      out.push({ chapter: c, formula: f });
    }
  }
  return out;
}
