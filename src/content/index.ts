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

import type { Chapter, Exercise, Lesson } from "@/lib/types";

export const CHAPTERS: Chapter[] = [
  cap01,
  cap02,
  cap03,
  cap04,
  cap05,
  cap06,
  cap07,
  cap08,
  cap09,
  cap10,
  cap11,
];

export function findChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function findLesson(chapterId: string, lessonId: string): Lesson | undefined {
  const c = findChapter(chapterId);
  return c?.lessons.find((l) => l.id === lessonId);
}

export function allExercises(): { chapterId: string; lessonId: string; exercise: Exercise }[] {
  const out: { chapterId: string; lessonId: string; exercise: Exercise }[] = [];
  for (const c of CHAPTERS) {
    for (const l of c.lessons) {
      for (const e of l.exercises ?? []) {
        out.push({ chapterId: c.id, lessonId: l.id, exercise: e });
      }
    }
  }
  return out;
}

export function totalLessonCount(): number {
  return CHAPTERS.reduce((acc, c) => acc + c.lessons.length, 0);
}

export function totalExerciseCount(): number {
  return allExercises().length;
}

export function totalFormulaCount(): number {
  return CHAPTERS.reduce((acc, c) => acc + c.formulas.length, 0);
}

export function allFormulas(): { chapter: Chapter; formula: Chapter["formulas"][number] }[] {
  const out: { chapter: Chapter; formula: Chapter["formulas"][number] }[] = [];
  for (const c of CHAPTERS) {
    for (const f of c.formulas) {
      out.push({ chapter: c, formula: f });
    }
  }
  return out;
}
