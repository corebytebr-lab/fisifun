"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SrsItem } from "./types";

export interface LessonProgress {
  completed: boolean;
  bestScore: number; // 0..1
  attempts: number;
  lastAttempt: number; // ms
}

export interface ExerciseAttempt {
  exerciseId: string;
  chapterId: string;
  lessonId: string;
  correct: boolean;
  at: number;
  concept?: string;
}

export interface DailyLog {
  dateKey: string; // YYYY-MM-DD
  xp: number;
  lessonsCompleted: number;
  correctAnswers: number;
  wrongAnswers: number;
  minutesStudied: number;
}

export interface PersistedState {
  // Profile
  username: string;
  avatar: string; // emoji

  // Gamification
  xp: number;
  level: number;
  coins: number;
  hearts: number;
  maxHearts: number;
  lastHeartRegenAt: number;
  streak: number;
  longestStreak: number;
  lastStudyDate: string; // YYYY-MM-DD
  dailyGoalXp: number;

  // Settings
  theme: "light" | "dark" | "system";
  soundEnabled: boolean;
  reminderTime: string | null; // HH:MM, local
  focusMode: boolean; // sem distração
  infiniteHearts: boolean; // vida infinita
  geminiApiKey: string; // chave do Google Gemini (fica só no navegador)

  // Progress
  lessonProgress: Record<string, LessonProgress>; // key = `${chapterId}/${lessonId}`
  chapterUnlocked: Record<string, boolean>;
  wrongExercises: Record<string, ExerciseAttempt>; // exerciseId -> last wrong attempt
  attemptHistory: ExerciseAttempt[]; // last N=500
  dailyLog: DailyLog[]; // last 60 days
  conceptMastery: Record<string, number>; // concept -> mastery 0..1
  achievementsUnlocked: Record<string, number>; // id -> unlockedAt ms

  // SRS
  srs: Record<string, SrsItem>; // exerciseId -> SrsItem

  // Finale
  gameCompleted: boolean;
  gameCompletedAt: number | null;

  // Novas features
  notes: Record<string, string>; // chapterId -> markdown
  formulaSrs: Record<string, SrsItem>; // formulaId -> SrsItem
  studyPlan: {
    examDate: string | null; // YYYY-MM-DD
    chapters: string[]; // chapter ids que caem
    dailyMinutes: number;
    createdAt: number | null;
  };
  pomodoroMinutes: number; // foco (default 25)
  pomodoroBreak: number; // pausa (default 5)

  // Problemas do Halliday: 'correct' | 'wrong' | ausente (nunca tentou)
  hallidayProgress: Record<string, "correct" | "wrong">;
}

export interface GameState extends PersistedState {
  // actions
  awardXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  regenHeartsIfDue: () => void;
  recordAttempt: (a: ExerciseAttempt) => void;
  completeLesson: (chapterId: string, lessonId: string, score: number, minutes: number, xp: number) => void;
  unlockChapter: (chapterId: string) => void;
  setTheme: (t: "light" | "dark" | "system") => void;
  setFocusMode: (v: boolean) => void;
  setInfiniteHearts: (v: boolean) => void;
  setGeminiApiKey: (k: string) => void;
  setDailyGoal: (xp: number) => void;
  setReminderTime: (t: string | null) => void;
  setUsername: (n: string) => void;
  setAvatar: (a: string) => void;
  unlockAchievement: (id: string) => void;
  upsertSrs: (item: SrsItem) => void;
  reviewSrs: (exerciseId: string, correct: boolean) => void;
  markGameCompleted: () => void;
  resetProgress: () => void;

  setNote: (chapterId: string, md: string) => void;
  reviewFormulaSrs: (formulaId: string, quality: 0 | 1 | 2) => void; // 0=errou, 1=difícil, 2=fácil
  setStudyPlan: (plan: PersistedState["studyPlan"]) => void;
  setPomodoro: (minutes: number, breakMin: number) => void;
  markHalliday: (problemId: string, result: "correct" | "wrong") => void;
}

const todayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const levelForXp = (xp: number) => {
  // gentle curve: each level needs 1.15x prev, starting 100
  let level = 1;
  let need = 100;
  let total = 0;
  while (xp >= total + need) {
    total += need;
    level += 1;
    need = Math.round(need * 1.15);
  }
  return level;
};

export const xpForLevel = (level: number) => {
  let need = 100;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += need;
    need = Math.round(need * 1.15);
  }
  return { total, nextNeed: need };
};

const HEART_REGEN_MS = 25 * 60 * 1000; // 25 min per heart

const initial: PersistedState = {
  username: "Estudante",
  avatar: "🧑‍🚀",

  xp: 0,
  level: 1,
  coins: 0,
  hearts: 5,
  maxHearts: 5,
  lastHeartRegenAt: Date.now(),
  streak: 0,
  longestStreak: 0,
  lastStudyDate: "",
  dailyGoalXp: 50,

  theme: "system",
  soundEnabled: true,
  reminderTime: null,
  focusMode: false,
  infiniteHearts: true,
  geminiApiKey: "",

  lessonProgress: {},
  chapterUnlocked: { "01-medicao": true },
  wrongExercises: {},
  attemptHistory: [],
  dailyLog: [],
  conceptMastery: {},
  achievementsUnlocked: {},

  srs: {},
  gameCompleted: false,
  gameCompletedAt: null,

  notes: {},
  formulaSrs: {},
  studyPlan: { examDate: null, chapters: [], dailyMinutes: 30, createdAt: null },
  pomodoroMinutes: 25,
  pomodoroBreak: 5,
  hallidayProgress: {},
};

const upsertDaily = (log: DailyLog[], patch: Partial<DailyLog>): DailyLog[] => {
  const key = todayKey();
  const existing = log.find((e) => e.dateKey === key);
  let updated: DailyLog[];
  if (existing) {
    updated = log.map((e) =>
      e.dateKey === key
        ? {
            ...e,
            xp: e.xp + (patch.xp ?? 0),
            lessonsCompleted: e.lessonsCompleted + (patch.lessonsCompleted ?? 0),
            correctAnswers: e.correctAnswers + (patch.correctAnswers ?? 0),
            wrongAnswers: e.wrongAnswers + (patch.wrongAnswers ?? 0),
            minutesStudied: e.minutesStudied + (patch.minutesStudied ?? 0),
          }
        : e,
    );
  } else {
    updated = [
      ...log,
      {
        dateKey: key,
        xp: patch.xp ?? 0,
        lessonsCompleted: patch.lessonsCompleted ?? 0,
        correctAnswers: patch.correctAnswers ?? 0,
        wrongAnswers: patch.wrongAnswers ?? 0,
        minutesStudied: patch.minutesStudied ?? 0,
      },
    ];
  }
  // keep last 60 entries
  return updated.slice(-60);
};

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      ...initial,

      awardXp: (amount) => {
        const { xp, streak, lastStudyDate, longestStreak } = get();
        const newXp = xp + amount;
        const newLevel = levelForXp(newXp);
        const tk = todayKey();
        let newStreak = streak;
        let newLongest = longestStreak;
        if (lastStudyDate !== tk) {
          const yesterday = todayKey(new Date(Date.now() - 86400000));
          if (lastStudyDate === yesterday) newStreak = streak + 1;
          else newStreak = 1;
          newLongest = Math.max(longestStreak, newStreak);
        }
        set({
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          longestStreak: newLongest,
          lastStudyDate: tk,
          coins: get().coins + Math.floor(amount / 10),
          dailyLog: upsertDaily(get().dailyLog, { xp: amount }),
        });
      },

      addCoins: (amount) => set({ coins: get().coins + amount }),

      loseHeart: () => {
        const { hearts, infiniteHearts } = get();
        if (infiniteHearts) return;
        if (hearts <= 0) return;
        set({ hearts: hearts - 1, lastHeartRegenAt: Date.now() });
      },

      refillHearts: () => set({ hearts: get().maxHearts, lastHeartRegenAt: Date.now() }),

      regenHeartsIfDue: () => {
        const { hearts, maxHearts, lastHeartRegenAt } = get();
        if (hearts >= maxHearts) return;
        const elapsed = Date.now() - lastHeartRegenAt;
        const regen = Math.floor(elapsed / HEART_REGEN_MS);
        if (regen <= 0) return;
        const newHearts = Math.min(maxHearts, hearts + regen);
        const remainder = elapsed - regen * HEART_REGEN_MS;
        set({ hearts: newHearts, lastHeartRegenAt: Date.now() - remainder });
      },

      recordAttempt: (a) => {
        const history = [...get().attemptHistory, a].slice(-500);
        const wrongExercises = { ...get().wrongExercises };
        if (!a.correct) {
          wrongExercises[a.exerciseId] = a;
        } else if (wrongExercises[a.exerciseId]) {
          // remove from wrong list if answered correctly this time
          delete wrongExercises[a.exerciseId];
        }
        // update concept mastery (EMA)
        let conceptMastery = get().conceptMastery;
        if (a.concept) {
          const prev = conceptMastery[a.concept] ?? 0.5;
          const target = a.correct ? 1 : 0;
          conceptMastery = { ...conceptMastery, [a.concept]: prev * 0.7 + target * 0.3 };
        }
        set({
          attemptHistory: history,
          wrongExercises,
          conceptMastery,
          dailyLog: upsertDaily(get().dailyLog, {
            correctAnswers: a.correct ? 1 : 0,
            wrongAnswers: a.correct ? 0 : 1,
          }),
        });
      },

      completeLesson: (chapterId, lessonId, score, minutes, xp) => {
        const key = `${chapterId}/${lessonId}`;
        const prev = get().lessonProgress[key];
        const wasCompleted = prev?.completed === true;
        const newProgress: LessonProgress = {
          completed: true,
          bestScore: Math.max(prev?.bestScore ?? 0, score),
          attempts: (prev?.attempts ?? 0) + 1,
          lastAttempt: Date.now(),
        };
        set({
          lessonProgress: { ...get().lessonProgress, [key]: newProgress },
          dailyLog: upsertDaily(get().dailyLog, {
            lessonsCompleted: wasCompleted ? 0 : 1,
            minutesStudied: minutes,
          }),
        });
        get().awardXp(xp);
      },

      unlockChapter: (chapterId) =>
        set({ chapterUnlocked: { ...get().chapterUnlocked, [chapterId]: true } }),

      setTheme: (t) => set({ theme: t }),
      setFocusMode: (v) => set({ focusMode: v }),
      setInfiniteHearts: (v) => set({ infiniteHearts: v, hearts: v ? get().maxHearts : get().hearts }),
      setGeminiApiKey: (k) => set({ geminiApiKey: k }),
      setDailyGoal: (n) => set({ dailyGoalXp: n }),
      setReminderTime: (t) => set({ reminderTime: t }),
      setUsername: (n) => set({ username: n }),
      setAvatar: (a) => set({ avatar: a }),

      unlockAchievement: (id) => {
        if (get().achievementsUnlocked[id]) return;
        set({ achievementsUnlocked: { ...get().achievementsUnlocked, [id]: Date.now() } });
      },

      upsertSrs: (item) => set({ srs: { ...get().srs, [item.exerciseId]: item } }),

      reviewSrs: (exerciseId, correct) => {
        const existing = get().srs[exerciseId];
        const now = Date.now();
        const day = 86400000;
        if (!existing) return;
        let { ease, interval, lapses, correctStreak } = existing;
        if (correct) {
          correctStreak += 1;
          if (correctStreak === 1) interval = 1;
          else if (correctStreak === 2) interval = 3;
          else interval = Math.round(interval * ease);
          ease = Math.min(3.0, ease + 0.05);
        } else {
          lapses += 1;
          correctStreak = 0;
          interval = 1;
          ease = Math.max(1.3, ease - 0.2);
        }
        const updated: SrsItem = {
          ...existing,
          ease,
          interval,
          lapses,
          correctStreak,
          dueDate: now + interval * day,
        };
        set({ srs: { ...get().srs, [exerciseId]: updated } });
      },

      markGameCompleted: () => set({ gameCompleted: true, gameCompletedAt: Date.now() }),

      resetProgress: () => set({ ...initial }),

      setNote: (chapterId, md) => set({ notes: { ...get().notes, [chapterId]: md } }),

      reviewFormulaSrs: (formulaId, quality) => {
        const now = Date.now();
        const cur: SrsItem = get().formulaSrs[formulaId] ?? {
          exerciseId: formulaId,
          chapterId: "",
          lessonId: "",
          ease: 2.5,
          interval: 0,
          correctStreak: 0,
          lapses: 0,
          dueDate: now,
        };
        let { ease, interval, correctStreak, lapses } = cur;
        if (quality === 0) {
          lapses += 1;
          correctStreak = 0;
          interval = 1;
          ease = Math.max(1.3, ease - 0.2);
        } else {
          correctStreak += 1;
          if (quality === 1) ease = Math.max(1.3, ease - 0.05);
          else ease = ease + 0.1;
          if (correctStreak === 1) interval = 1;
          else if (correctStreak === 2) interval = 3;
          else interval = Math.round(interval * ease);
        }
        const dueDate = now + interval * 24 * 60 * 60 * 1000;
        const updated: SrsItem = {
          exerciseId: formulaId,
          chapterId: cur.chapterId,
          lessonId: cur.lessonId,
          ease,
          interval,
          correctStreak,
          lapses,
          dueDate,
        };
        set({ formulaSrs: { ...get().formulaSrs, [formulaId]: updated } });
      },

      setStudyPlan: (plan) => set({ studyPlan: { ...plan, createdAt: plan.createdAt ?? Date.now() } }),

      setPomodoro: (minutes, breakMin) => set({ pomodoroMinutes: minutes, pomodoroBreak: breakMin }),

      markHalliday: (problemId, result) => {
        const prev = get().hallidayProgress[problemId];
        set((s) => ({ hallidayProgress: { ...s.hallidayProgress, [problemId]: result } }));
        // First-time correct = XP reward (prevents farming)
        if (result === "correct" && prev !== "correct") {
          // XP depends on difficulty embedded in id (cap{ch}-p{num}); caller pass XP via separate awardXp.
          // We just flag the progress; awardXp handled by caller.
        }
      },
    }),
    {
      name: "fisifun-state",
      version: 5,
      migrate: (persisted: unknown, version: number) => {
        let s = (persisted as Partial<PersistedState>) ?? {};
        if (version < 2) s = { ...s, infiniteHearts: true };
        if (version < 3) s = { ...s, geminiApiKey: s.geminiApiKey ?? "" };
        if (version < 4) {
          s = {
            ...s,
            notes: s.notes ?? {},
            formulaSrs: s.formulaSrs ?? {},
            studyPlan: s.studyPlan ?? { examDate: null, chapters: [], dailyMinutes: 30, createdAt: null },
            pomodoroMinutes: s.pomodoroMinutes ?? 25,
            pomodoroBreak: s.pomodoroBreak ?? 5,
          };
        }
        if (version < 5) {
          s = { ...s, hallidayProgress: s.hallidayProgress ?? {} };
        }
        return s as PersistedState;
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        // exclude action fns implicitly since zustand persist only serializes data
        const { ...rest } = s;
        return rest as PersistedState;
      },
    },
  ),
);
