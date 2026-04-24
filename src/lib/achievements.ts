import type { Achievement } from "./types";

export const achievements: Achievement[] = [
  {
    id: "primeiro-passo",
    title: "Primeiro Passo",
    description: "Conclua sua primeira lição.",
    emoji: "👣",
    check: (s) => Object.values(s.lessonProgress).some((p) => p.completed),
  },
  {
    id: "streak-3",
    title: "Em Chamas",
    description: "Mantenha uma streak de 3 dias.",
    emoji: "🔥",
    check: (s) => s.longestStreak >= 3,
  },
  {
    id: "streak-7",
    title: "Semana Focada",
    description: "7 dias seguidos estudando.",
    emoji: "🗓️",
    check: (s) => s.longestStreak >= 7,
  },
  {
    id: "streak-30",
    title: "Mês Newtoniano",
    description: "30 dias seguidos estudando.",
    emoji: "🌙",
    check: (s) => s.longestStreak >= 30,
  },
  {
    id: "xp-500",
    title: "Acumulando Energia",
    description: "Ganhe 500 XP.",
    emoji: "⚡",
    check: (s) => s.xp >= 500,
  },
  {
    id: "xp-5000",
    title: "Usina de Conhecimento",
    description: "Ganhe 5000 XP.",
    emoji: "🏭",
    check: (s) => s.xp >= 5000,
  },
  {
    id: "level-5",
    title: "Aprendiz Avançado",
    description: "Alcance o nível 5.",
    emoji: "🎓",
    check: (s) => s.level >= 5,
  },
  {
    id: "level-15",
    title: "Físico Promissor",
    description: "Alcance o nível 15.",
    emoji: "🧪",
    check: (s) => s.level >= 15,
  },
  {
    id: "cap-01",
    title: "Medidor Certificado",
    description: "Complete o capítulo 1 — Medição.",
    emoji: "📏",
    check: (s) => hasChapterCompleted(s, "01-medicao"),
  },
  {
    id: "cap-newton",
    title: "Newton Aprovaria",
    description: "Complete os capítulos de Força (5 e 6).",
    emoji: "🍎",
    check: (s) => hasChapterCompleted(s, "05-forca-i") && hasChapterCompleted(s, "06-forca-ii"),
  },
  {
    id: "cap-energia",
    title: "Guardião da Energia",
    description: "Complete os capítulos de Trabalho e Energia (7 e 8).",
    emoji: "🔋",
    check: (s) => hasChapterCompleted(s, "07-trabalho-energia") && hasChapterCompleted(s, "08-energia-potencial"),
  },
  {
    id: "cap-rotacao",
    title: "Mestre da Rotação",
    description: "Complete os capítulos de Rotação (10 e 11).",
    emoji: "🌀",
    check: (s) => hasChapterCompleted(s, "10-rotacao") && hasChapterCompleted(s, "11-rolamento-torque"),
  },
  {
    id: "perfect-quiz",
    title: "Gabaritou",
    description: "Acerte 100% em um quiz final.",
    emoji: "🏆",
    check: (s) => Object.values(s.lessonProgress).some((p) => p.bestScore >= 0.999),
  },
  {
    id: "no-mistakes-day",
    title: "Dia Impecável",
    description: "Estude um dia sem errar nenhum exercício (mínimo 10 acertos).",
    emoji: "💎",
    check: (s) => s.dailyLog.some((d) => d.wrongAnswers === 0 && d.correctAnswers >= 10),
  },
  {
    id: "coins-500",
    title: "Cofrinho",
    description: "Junte 500 moedas.",
    emoji: "🪙",
    check: (s) => s.coins >= 500,
  },
  {
    id: "srs-champion",
    title: "Revisor Dedicado",
    description: "Revise 50 itens da repetição espaçada.",
    emoji: "🧠",
    check: (s) => Object.values(s.srs).reduce((acc, i) => acc + i.correctStreak, 0) >= 50,
  },
  {
    id: "all-formulas",
    title: "Manual de Fórmulas",
    description: "Visite a biblioteca de fórmulas de todos os capítulos.",
    emoji: "📚",
    // Simplified: checked via visited flag — we use conceptMastery length as proxy
    check: (s) => Object.keys(s.conceptMastery).length >= 25,
  },
  {
    id: "meta-diaria",
    title: "Meta Batida",
    description: "Atinja sua meta diária 7 vezes.",
    emoji: "🎯",
    check: (s) => s.dailyLog.filter((d) => d.xp >= s.dailyGoalXp).length >= 7,
  },
  {
    id: "zerou",
    title: "Zerou o Jogo",
    description: "Conclua todos os capítulos de Mecânica!",
    emoji: "🚀",
    check: (s) => s.gameCompleted,
  },
];

const CHAPTER_IDS = [
  "01-medicao",
  "02-movimento-retilineo",
  "03-vetores",
  "04-movimento-2d-3d",
  "05-forca-i",
  "06-forca-ii",
  "07-trabalho-energia",
  "08-energia-potencial",
  "09-centro-massa-momento",
  "10-rotacao",
  "11-rolamento-torque",
];

export const ALL_CHAPTER_IDS = CHAPTER_IDS;

function hasChapterCompleted(s: import("./store").PersistedState, chapterId: string): boolean {
  const keys = Object.keys(s.lessonProgress).filter((k) => k.startsWith(`${chapterId}/`));
  return keys.length > 0 && keys.every((k) => s.lessonProgress[k].completed);
}

export function chapterCompleted(s: import("./store").PersistedState, chapterId: string): boolean {
  return hasChapterCompleted(s, chapterId);
}
