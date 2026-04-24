import type {
  Exercise,
  Lesson,
  Chapter,
  Formula,
  ConceptCard,
  MultipleChoiceExercise,
  TrueFalseExercise,
  FillBlankExercise,
  NumericExercise,
  NumericWithUnitsExercise,
  DragFormulaExercise,
  OrderStepsExercise,
  GraphReadExercise,
  ConceptImageExercise,
  MiniCaseExercise,
} from "@/lib/types";

export const ex = {
  reset: (prefix: string) => prefix,
};

export function mkMc(
  id: string,
  prompt: string,
  options: string[],
  correct: number,
  explanation: string = "",
  opts: Partial<MultipleChoiceExercise> = {},
): MultipleChoiceExercise {
  return { id, type: "multiple-choice", prompt, options, correct, explanation, ...opts };
}

export function mkTf(
  id: string,
  prompt: string,
  correct: boolean,
  explanation: string = "",
  opts: Partial<TrueFalseExercise> = {},
): TrueFalseExercise {
  return { id, type: "true-false", prompt, correct, explanation, ...opts };
}

export function mkFill(
  id: string,
  prompt: string,
  answers: string[],
  explanation: string = "",
  opts: Partial<FillBlankExercise> = {},
): FillBlankExercise {
  return { id, type: "fill-blank", prompt, answers, explanation, ...opts };
}

export function mkNum(
  id: string,
  prompt: string,
  answer: number,
  tolerance: number,
  explanation: string = "",
  opts: Partial<NumericExercise> = {},
): NumericExercise {
  return { id, type: "numeric", prompt, answer, tolerance, explanation, ...opts };
}

export function mkNumU(
  id: string,
  prompt: string,
  answer: number,
  tolerance: number,
  unit: string,
  unitOptions: string[],
  explanation: string,
  opts: Partial<NumericWithUnitsExercise> = {},
): NumericWithUnitsExercise {
  return { id, type: "numeric-units", prompt, answer, tolerance, unit, unitOptions, explanation, ...opts };
}

export function mkDrag(
  id: string,
  prompt: string,
  tokens: { id: string; label: string }[],
  correct: string[],
  explanation: string,
  opts: Partial<DragFormulaExercise> = {},
): DragFormulaExercise {
  return { id, type: "drag-formula", prompt, tokens, correct, explanation, ...opts };
}

export function mkOrder(
  id: string,
  prompt: string,
  steps: string[],
  explanation: string,
  opts: Partial<OrderStepsExercise> = {},
): OrderStepsExercise {
  return { id, type: "order-steps", prompt, steps, explanation, ...opts };
}

export function mkGraph(
  id: string,
  prompt: string,
  points: { x: number; y: number }[],
  xLabel: string,
  yLabel: string,
  question: string,
  options: string[],
  correct: number,
  explanation: string,
  opts: Partial<GraphReadExercise> = {},
): GraphReadExercise {
  return { id, type: "graph-read", prompt, points, xLabel, yLabel, question, options, correct, explanation, ...opts };
}

export function mkImage(
  id: string,
  prompt: string,
  diagram: string,
  options: string[],
  correct: number,
  explanation: string,
  opts: Partial<ConceptImageExercise> = {},
): ConceptImageExercise {
  return { id, type: "concept-image", prompt, diagram, options, correct, explanation, ...opts };
}

export function mkCase(
  id: string,
  prompt: string,
  scenario: string,
  options: string[],
  correct: number,
  explanation: string,
  opts: Partial<MiniCaseExercise> = {},
): MiniCaseExercise {
  return { id, type: "mini-case", prompt, scenario, options, correct, explanation, ...opts };
}

export function lesson(
  id: string,
  title: string,
  kind: Lesson["kind"],
  xpReward: number,
  estMinutes: number,
  payload: { concepts?: ConceptCard[]; exercises?: Exercise[]; timeLimitSeconds?: number },
): Lesson {
  return { id, title, kind, xpReward, estMinutes, ...payload };
}

export function chapter(c: Chapter): Chapter {
  return c;
}

export type { Exercise, Lesson, Chapter, Formula, ConceptCard };
