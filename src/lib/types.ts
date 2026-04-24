// Core domain types for FisiFun — Física 1 gamified study app

export type ExerciseType =
  | "multiple-choice"
  | "true-false"
  | "fill-blank"
  | "drag-formula"
  | "order-steps"
  | "numeric"
  | "numeric-units"
  | "graph-read"
  | "concept-image"
  | "mini-case";

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  /** short explanation shown after answering */
  explanation: string;
  /** optional concept tag used by SRS / analytics */
  concept?: string;
  /** optional formula reference by id */
  formulaRef?: string;
  /** optional hint text shown before answering */
  hint?: string;
  /** difficulty from 1 (easy) to 3 (hard) */
  difficulty?: 1 | 2 | 3;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: "multiple-choice";
  options: string[];
  correct: number; // index
}

export interface TrueFalseExercise extends BaseExercise {
  type: "true-false";
  correct: boolean;
}

export interface FillBlankExercise extends BaseExercise {
  /** prompt uses "___" for blanks; answers is list of acceptable strings (case/accent insensitive). */
  type: "fill-blank";
  answers: string[];
}

export interface DragFormulaExercise extends BaseExercise {
  /**
   * User assembles a formula by ordering tokens. Tokens are displayed in random order;
   * correct is the ordered list of token ids.
   */
  type: "drag-formula";
  tokens: { id: string; label: string }[];
  correct: string[]; // token ids in correct order
}

export interface OrderStepsExercise extends BaseExercise {
  type: "order-steps";
  steps: string[]; // in correct order
}

export interface NumericExercise extends BaseExercise {
  type: "numeric";
  answer: number;
  tolerance?: number; // absolute tolerance, default 0.01
  unit?: string; // display-only unit hint
}

export interface NumericWithUnitsExercise extends BaseExercise {
  type: "numeric-units";
  answer: number;
  tolerance?: number;
  unit: string; // expected unit the user must select
  unitOptions: string[];
}

export interface GraphReadExercise extends BaseExercise {
  type: "graph-read";
  /** Simple line graph: list of (x,y) points. */
  points: { x: number; y: number }[];
  xLabel: string;
  yLabel: string;
  question: string;
  options: string[];
  correct: number;
}

export interface ConceptImageExercise extends BaseExercise {
  type: "concept-image";
  /** SVG string or a named diagram key handled by the renderer. */
  diagram: string;
  options: string[];
  correct: number;
}

export interface MiniCaseExercise extends BaseExercise {
  type: "mini-case";
  scenario: string;
  options: string[];
  correct: number;
}

export type Exercise =
  | MultipleChoiceExercise
  | TrueFalseExercise
  | FillBlankExercise
  | DragFormulaExercise
  | OrderStepsExercise
  | NumericExercise
  | NumericWithUnitsExercise
  | GraphReadExercise
  | ConceptImageExercise
  | MiniCaseExercise;

export interface Formula {
  id: string;
  name: string;
  latex: string; // KaTeX expression
  description: string;
  variables: { symbol: string; meaning: string; unit: string }[];
  whenToUse: string;
  example?: string;
}

export interface ConceptCard {
  title: string;
  body: string; // markdown-ish (simple, we render with a tiny formatter)
  example?: string;
}

export type LessonKind =
  | "concept" // learn content
  | "example" // guided example
  | "practice" // interactive exercises
  | "quiz" // final quiz with lives
  | "challenge"; // mixed/timed challenge

export interface Lesson {
  id: string;
  title: string;
  kind: LessonKind;
  /** estimated minutes */
  estMinutes: number;
  xpReward: number;
  concepts?: ConceptCard[];
  exercises?: Exercise[];
  /** if timed challenge, seconds allotted */
  timeLimitSeconds?: number;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  color: string; // tailwind-friendly hex
  emoji: string;
  objectives: string[];
  keyConcepts: string[];
  commonMistakes: string[];
  units: string[];
  formulas: Formula[];
  lessons: Lesson[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** rule evaluated against GameState */
  check: (s: import("./store").PersistedState) => boolean;
}

export interface SrsItem {
  exerciseId: string;
  chapterId: string;
  lessonId: string;
  // SM-2 like params
  ease: number;
  interval: number; // days
  dueDate: number; // ms timestamp
  lapses: number;
  correctStreak: number;
}
