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

  // ===== Multi-matéria =====
  {
    id: "primeiro-quimico",
    title: "Pequeno Químico",
    description: "Conclua sua primeira lição de Química.",
    emoji: "🧪",
    check: (s) => hasAnySubjectLesson(s, "quimica"),
  },
  {
    id: "primeiro-ga",
    title: "Geômetra Iniciante",
    description: "Conclua sua primeira lição de Geometria Analítica.",
    emoji: "📐",
    check: (s) => hasAnySubjectLesson(s, "ga"),
  },
  {
    id: "primeiro-calculo",
    title: "Calculista Júnior",
    description: "Conclua sua primeira lição de Cálculo.",
    emoji: "∫",
    check: (s) => hasAnySubjectLesson(s, "calculo"),
  },
  {
    id: "polivalente",
    title: "Polivalente",
    description: "Estude as 4 matérias em um mesmo dia.",
    emoji: "🌈",
    check: (s) => hasStudiedAllSubjectsSameDay(s),
  },
  {
    id: "marathonista",
    title: "Maratonista",
    description: "Estude por mais de 60 minutos em um único dia.",
    emoji: "⏱️",
    check: (s) => s.dailyLog.some((d) => (d.minutesStudied ?? 0) >= 60),
  },

  // ===== Streaks longos =====
  {
    id: "streak-100",
    title: "Centurião",
    description: "Mantenha streak de 100 dias.",
    emoji: "💯",
    check: (s) => s.longestStreak >= 100,
  },
  {
    id: "streak-365",
    title: "Ano Astronômico",
    description: "365 dias seguidos. Sério mesmo?!",
    emoji: "🌌",
    check: (s) => s.longestStreak >= 365,
  },

  // ===== XP / Níveis =====
  {
    id: "xp-10000",
    title: "Estrela em Formação",
    description: "Ganhe 10 000 XP.",
    emoji: "⭐",
    check: (s) => s.xp >= 10000,
  },
  {
    id: "xp-50000",
    title: "Supernova",
    description: "Ganhe 50 000 XP.",
    emoji: "💫",
    check: (s) => s.xp >= 50000,
  },
  {
    id: "level-30",
    title: "Mestre Universitário",
    description: "Alcance o nível 30.",
    emoji: "🎓",
    check: (s) => s.level >= 30,
  },
  {
    id: "level-50",
    title: "Doutor Honoris Causa",
    description: "Alcance o nível 50.",
    emoji: "📜",
    check: (s) => s.level >= 50,
  },

  // ===== Halliday / Problemas =====
  {
    id: "halliday-50",
    title: "Resolvedor",
    description: "Marque 50 problemas do Halliday como acertados.",
    emoji: "✏️",
    check: (s) => Object.values(s.hallidayStatus ?? {}).filter((v) => v === "right").length >= 50,
  },
  {
    id: "halliday-100",
    title: "Quase Halliday",
    description: "Marque 100 problemas do Halliday como acertados.",
    emoji: "📘",
    check: (s) => Object.values(s.hallidayStatus ?? {}).filter((v) => v === "right").length >= 100,
  },
  {
    id: "halliday-difficult-10",
    title: "Encara Difícil",
    description: "Acerte 10 problemas de nível ••• do Halliday.",
    emoji: "🥷",
    check: (s) => countHallidayByLevel(s, 3) >= 10,
  },

  // ===== Modo Professor =====
  {
    id: "professor-1",
    title: "Lumi-Professor",
    description: "Complete uma palestra no Modo Professor.",
    emoji: "🎤",
    check: (s) => (s.professorSessions ?? 0) >= 1,
  },
  {
    id: "professor-10",
    title: "Catedrático Lumer",
    description: "Complete 10 palestras no Modo Professor.",
    emoji: "🏫",
    check: (s) => (s.professorSessions ?? 0) >= 10,
  },

  // ===== Minijogos =====
  {
    id: "joga-1",
    title: "Aquecimento",
    description: "Jogue qualquer minijogo pela primeira vez.",
    emoji: "🎮",
    check: (s) => Object.keys(s.gameStats ?? {}).length >= 1,
  },
  {
    id: "joga-todos",
    title: "Sortidão",
    description: "Jogue 10 minijogos diferentes.",
    emoji: "🎲",
    check: (s) => Object.keys(s.gameStats ?? {}).length >= 10,
  },
  {
    id: "boss-3",
    title: "Caçador de Boss",
    description: "Derrote 3 bosses de capítulo.",
    emoji: "👹",
    check: (s) => (s.bossDefeated ?? 0) >= 3,
  },

  // ===== Ferramentas =====
  {
    id: "tool-explorer",
    title: "Explorador de Ferramentas",
    description: "Use 5 ferramentas diferentes (calculadoras / plotter / balanceador).",
    emoji: "🛠️",
    check: (s) => (s.toolsUsed ?? []).length >= 5,
  },
  {
    id: "tool-master",
    title: "Mestre das Ferramentas",
    description: "Use 10 ferramentas diferentes.",
    emoji: "🔧",
    check: (s) => (s.toolsUsed ?? []).length >= 10,
  },

  // ===== Outros =====
  {
    id: "no-mistakes-week",
    title: "Semana Limpa",
    description: "Atinja meta diária 7 dias seguidos sem perder vida.",
    emoji: "🪄",
    check: (s) => s.dailyLog.filter((d) => d.xp >= s.dailyGoalXp && d.wrongAnswers === 0).length >= 7,
  },
  {
    id: "noturno",
    title: "Coruja Estudiosa",
    description: "Conclua uma lição entre 22h e 5h.",
    emoji: "🦉",
    check: (s) => (s.flags?.studiedAtNight ?? false),
  },
  {
    id: "matinal",
    title: "Madrugador",
    description: "Conclua uma lição antes das 7h da manhã.",
    emoji: "🌅",
    check: (s) => (s.flags?.studiedEarlyMorning ?? false),
  },
  {
    id: "completo-1mat",
    title: "Domínio de Matéria",
    description: "Conclua todos os capítulos de uma matéria.",
    emoji: "🥇",
    check: (s) => completedAnyFullSubject(s),
  },
  {
    id: "feedback-100",
    title: "100 Acertos",
    description: "Some 100 acertos em exercícios.",
    emoji: "✅",
    check: (s) => sumCorrect(s) >= 100,
  },
  {
    id: "feedback-500",
    title: "500 Acertos",
    description: "Some 500 acertos em exercícios.",
    emoji: "🏅",
    check: (s) => sumCorrect(s) >= 500,
  },

  // ===== Bloco extra: streaks longos =====
  { id: "streak-60", title: "2 meses", description: "60 dias seguidos.", emoji: "🌟", check: (s) => s.longestStreak >= 60 },
  { id: "streak-100", title: "Centenário", description: "100 dias seguidos.", emoji: "💯", check: (s) => s.longestStreak >= 100 },
  { id: "streak-180", title: "Semestre", description: "180 dias seguidos.", emoji: "🏔️", check: (s) => s.longestStreak >= 180 },
  { id: "streak-365", title: "Ano completo", description: "365 dias seguidos!", emoji: "🌍", check: (s) => s.longestStreak >= 365 },

  // ===== XP escalado =====
  { id: "xp-1000", title: "Mil em XP", description: "1.000 XP acumulados.", emoji: "💫", check: (s) => s.xp >= 1000 },
  { id: "xp-2500", title: "Veterano", description: "2.500 XP acumulados.", emoji: "🎖️", check: (s) => s.xp >= 2500 },
  { id: "xp-10000", title: "Lenda do XP", description: "10.000 XP acumulados.", emoji: "👑", check: (s) => s.xp >= 10000 },
  { id: "xp-25000", title: "Mestre", description: "25.000 XP. Nível absurdo.", emoji: "🪐", check: (s) => s.xp >= 25000 },
  { id: "xp-50000", title: "Imortal", description: "50.000 XP. Você é outro nível.", emoji: "🌌", check: (s) => s.xp >= 50000 },

  // ===== Níveis altos =====
  { id: "level-25", title: "Especialista", description: "Nível 25.", emoji: "🧙", check: (s) => s.level >= 25 },
  { id: "level-50", title: "Mestre Jedi", description: "Nível 50.", emoji: "⚔️", check: (s) => s.level >= 50 },
  { id: "level-75", title: "Grande Mestre", description: "Nível 75.", emoji: "🏯", check: (s) => s.level >= 75 },
  { id: "level-100", title: "Centenário Acadêmico", description: "Nível 100!!", emoji: "💎", check: (s) => s.level >= 100 },

  // ===== Acertos =====
  { id: "feedback-1000", title: "1000 Acertos", description: "Mil questões acertadas.", emoji: "🎯", check: (s) => sumCorrect(s) >= 1000 },
  { id: "feedback-2500", title: "Sniper", description: "2.500 questões acertadas.", emoji: "🔫", check: (s) => sumCorrect(s) >= 2500 },
  { id: "feedback-5000", title: "Atirador de Elite", description: "5.000 acertos.", emoji: "🥇", check: (s) => sumCorrect(s) >= 5000 },

  // ===== Multi-matéria =====
  { id: "multi-3", title: "Tri-talento", description: "Estude as 4 matérias no mesmo dia.", emoji: "🎭", check: (s) => hasStudiedAllSubjectsSameDay(s) },
  { id: "completo-2mat", title: "Bi-mestre", description: "Conclua todos os capítulos de 2 matérias.", emoji: "🥈", check: (s) => completedSubjectsCount(s) >= 2 },
  { id: "completo-3mat", title: "Tri-mestre", description: "Conclua todos os capítulos de 3 matérias.", emoji: "🥇", check: (s) => completedSubjectsCount(s) >= 3 },
  { id: "completo-todas", title: "Onisciente", description: "Conclua TODAS as 4 matérias.", emoji: "🏆", check: (s) => completedSubjectsCount(s) >= 4 },

  // ===== Cálculo específico =====
  { id: "calc-iniciado", title: "∫ Iniciado", description: "Complete sua 1ª lição de Cálculo.", emoji: "∫", check: (s) => hasAnySubjectLesson(s, "calculo") },
  { id: "calc-derivada", title: "Derivador", description: "Complete o capítulo 03-derivadas.", emoji: "∂", check: (s) => hasChapterCompleted(s, "03-derivadas") },
  { id: "calc-integral", title: "Integralizador", description: "Complete o capítulo 05-integrais.", emoji: "∮", check: (s) => hasChapterCompleted(s, "05-integrais") },
  { id: "calc-stewart-mestre", title: "Discípulo de Stewart", description: "Conclua todos os capítulos de Cálculo.", emoji: "📘", check: (s) => completedFullSubject(s, "calculo") },

  // ===== Química específico =====
  { id: "quim-iniciado", title: "🧪 Químico", description: "Complete sua 1ª lição de Química.", emoji: "🧪", check: (s) => hasAnySubjectLesson(s, "quimica") },
  { id: "quim-tabela", title: "Tabelão", description: "Use a tabela periódica interativa.", emoji: "🧫", check: (s) => (s.flags?.usedPeriodicTable ?? false) },
  { id: "quim-balance", title: "Balanceador Mestre", description: "Use o balanceador automático.", emoji: "⚖️", check: (s) => (s.flags?.usedBalancer ?? false) },
  { id: "quim-brown-mestre", title: "Discípulo de Brown", description: "Conclua todos os capítulos de Química.", emoji: "📕", check: (s) => completedFullSubject(s, "quimica") },

  // ===== GA específico =====
  { id: "ga-iniciado", title: "📐 Geometra", description: "Complete sua 1ª lição de GA.", emoji: "📐", check: (s) => hasAnySubjectLesson(s, "ga") },
  { id: "ga-vetor", title: "Vetor Total", description: "Use a calculadora vetorial.", emoji: "➡️", check: (s) => (s.flags?.usedVetorCalc ?? false) },
  { id: "ga-plotter", title: "Plotador", description: "Use o plotter 2D de GA.", emoji: "📊", check: (s) => (s.flags?.usedGAPlotter ?? false) },
  { id: "ga-winterle-mestre", title: "Discípulo de Winterle", description: "Conclua todos os capítulos de GA.", emoji: "📗", check: (s) => completedFullSubject(s, "ga") },

  // ===== Física específico =====
  { id: "fis-halliday-mestre", title: "Discípulo de Halliday", description: "Conclua todos os 11 capítulos de Física.", emoji: "🪐", check: (s) => completedFullSubject(s, "fisica") },
  { id: "fis-rotacao", title: "Rotacional", description: "Conclua o capítulo 10-rotacao.", emoji: "🌀", check: (s) => hasChapterCompleted(s, "10-rotacao") },

  // ===== Halliday problems =====
  { id: "halliday-25", title: "25 Halliday", description: "Acerte 25 problemas do Halliday.", emoji: "📚", check: (s) => countHalliday(s, "correct") >= 25 },
  { id: "halliday-50", title: "50 Halliday", description: "Acerte 50 problemas do Halliday.", emoji: "📖", check: (s) => countHalliday(s, "correct") >= 50 },
  { id: "halliday-100", title: "100 Halliday", description: "Acerte 100 problemas do Halliday.", emoji: "📔", check: (s) => countHalliday(s, "correct") >= 100 },
  { id: "halliday-dificil", title: "Caçador de •••", description: "Acerte 10 problemas nível 3 (•••).", emoji: "🦁", check: (s) => countHallidayDifficulty(s, 3) >= 10 },
  { id: "halliday-dificil-25", title: "Domador de Difíceis", description: "Acerte 25 problemas nível 3.", emoji: "🐉", check: (s) => countHallidayDifficulty(s, 3) >= 25 },

  // ===== Modo Professor =====
  { id: "prof-primeira", title: "Primeira Aula", description: "Termine sua 1ª aula no Modo Professor.", emoji: "👨‍🏫", check: (s) => (s.flags?.professorRuns ?? 0) >= 1 },
  { id: "prof-cinco", title: "5 Aulas", description: "Dê 5 aulas no Modo Professor.", emoji: "📐", check: (s) => (s.flags?.professorRuns ?? 0) >= 5 },
  { id: "prof-dez", title: "10 Aulas", description: "Dê 10 aulas no Modo Professor.", emoji: "🎙️", check: (s) => (s.flags?.professorRuns ?? 0) >= 10 },
  { id: "prof-cinquenta", title: "50 Aulas", description: "Dê 50 aulas. Você é o sensei.", emoji: "🦉", check: (s) => (s.flags?.professorRuns ?? 0) >= 50 },
  { id: "prof-perfeito", title: "Aula Perfeita", description: "Tire nota 90+ numa aula do Modo Professor.", emoji: "💯", check: (s) => (s.flags?.professorBest ?? 0) >= 90 },

  // ===== Minijogos =====
  { id: "jogo-primeira", title: "Hora do Recreio", description: "Jogue qualquer minijogo.", emoji: "🎮", check: (s) => (s.flags?.gamesPlayed ?? 0) >= 1 },
  { id: "jogo-cinco-tipos", title: "Variado", description: "Jogue 5 minijogos diferentes.", emoji: "🎲", check: (s) => (s.flags?.distinctGamesPlayed ?? 0) >= 5 },
  { id: "jogo-dez-tipos", title: "Versátil", description: "Jogue 10 minijogos diferentes.", emoji: "🕹️", check: (s) => (s.flags?.distinctGamesPlayed ?? 0) >= 10 },
  { id: "jogo-boss", title: "Caçador de Boss", description: "Vença um Boss de capítulo.", emoji: "👹", check: (s) => (s.flags?.bossWins ?? 0) >= 1 },
  { id: "jogo-boss-5", title: "5 Bosses", description: "Vença 5 Bosses de capítulo.", emoji: "🐲", check: (s) => (s.flags?.bossWins ?? 0) >= 5 },

  // ===== SRS / Flashcards =====
  { id: "srs-50", title: "Memória de Elefante", description: "Revise 50 cards no SRS.", emoji: "🐘", check: (s) => (s.flags?.srsReviews ?? 0) >= 50 },
  { id: "srs-200", title: "Mente Fotográfica", description: "Revise 200 cards no SRS.", emoji: "📸", check: (s) => (s.flags?.srsReviews ?? 0) >= 200 },
  { id: "srs-1000", title: "Cérebro de Aço", description: "Revise 1000 cards no SRS.", emoji: "🧠", check: (s) => (s.flags?.srsReviews ?? 0) >= 1000 },
  { id: "srs-perfeito", title: "Sem Esquecer", description: "Revise tudo do SRS num dia (zerou a fila).", emoji: "🌟", check: (s) => (s.flags?.srsClearedFullDay ?? false) },

  // ===== Erros (caderno de erros) =====
  { id: "erros-zero", title: "Sem Pendências", description: "Refez todos os erros (caderno vazio).", emoji: "✨", check: (s) => Object.keys(s.wrongExercises).length === 0 && Object.values(s.lessonProgress).some((p) => p.completed) },
  { id: "erros-refeitos-10", title: "Persistente", description: "Refaça 10 questões que tinha errado.", emoji: "🔁", check: (s) => (s.flags?.wrongRedone ?? 0) >= 10 },
  { id: "erros-refeitos-50", title: "Aprendiz Resiliente", description: "Refaça 50 questões que tinha errado.", emoji: "🪨", check: (s) => (s.flags?.wrongRedone ?? 0) >= 50 },

  // ===== Ferramentas =====
  { id: "tool-derivada", title: "Calculou Derivada", description: "Use a calculadora simbólica de derivadas.", emoji: "🔧", check: (s) => (s.flags?.usedDerivCalc ?? false) },
  { id: "tool-integral", title: "Riemann Master", description: "Use o visualizador de Riemann.", emoji: "📐", check: (s) => (s.flags?.usedRiemann ?? false) },
  { id: "tool-limite", title: "Beira do Limite", description: "Use o visualizador de limite.", emoji: "♾️", check: (s) => (s.flags?.usedLimitViewer ?? false) },
  { id: "tool-todas", title: "Caixa de Ferramentas", description: "Use 5 ferramentas diferentes.", emoji: "🧰", check: (s) => (s.flags?.distinctToolsUsed ?? 0) >= 5 },

  // ===== Tutor IA =====
  { id: "ia-primeira", title: "Olá, Tutor!", description: "Faça sua 1ª pergunta ao Tutor IA.", emoji: "🤖", check: (s) => (s.flags?.aiQueries ?? 0) >= 1 },
  { id: "ia-25", title: "Curioso", description: "25 perguntas ao Tutor IA.", emoji: "🔎", check: (s) => (s.flags?.aiQueries ?? 0) >= 25 },
  { id: "ia-100", title: "Pesquisador", description: "100 perguntas ao Tutor IA.", emoji: "🧑‍🔬", check: (s) => (s.flags?.aiQueries ?? 0) >= 100 },
  { id: "ia-foto", title: "Câmera Solta", description: "Mande uma foto pro Tutor IA resolver.", emoji: "📷", check: (s) => (s.flags?.aiPhotoQueries ?? 0) >= 1 },

  // ===== Sociais / Admin =====
  { id: "perfil-foto", title: "Identificado", description: "Configure seu avatar.", emoji: "🖼️", check: (s) => (s.avatar ?? "") !== "🦊" },
  { id: "indicacao-1", title: "Embaixador", description: "Indique 1 amigo que entrou.", emoji: "🤝", check: (s) => (s.flags?.referrals ?? 0) >= 1 },
  { id: "indicacao-5", title: "Influenciador", description: "Indique 5 amigos que entraram.", emoji: "📣", check: (s) => (s.flags?.referrals ?? 0) >= 5 },

  // ===== Esquisitas / escondidas =====
  { id: "noctambulo", title: "Coruja", description: "Estude depois das 23h.", emoji: "🦉", check: (s) => (s.flags?.studiedLateNight ?? false) },
  { id: "domingo", title: "Sabbath Estudioso", description: "Estude num domingo.", emoji: "🛐", check: (s) => (s.flags?.studiedSunday ?? false) },
  { id: "ano-novo", title: "Resoluções", description: "Estude no dia 1 de janeiro.", emoji: "🎆", check: (s) => (s.flags?.studiedNewYear ?? false) },
  { id: "natal", title: "Bom Estudante de Natal", description: "Estude no dia 25 de dezembro.", emoji: "🎄", check: (s) => (s.flags?.studiedChristmas ?? false) },
  { id: "comeback", title: "Volta dos que não foram", description: "Voltou depois de 7+ dias parado.", emoji: "🔄", check: (s) => (s.flags?.comeback7d ?? false) },
  { id: "perfeicao", title: "Perfeição", description: "Acerte 20 questões seguidas.", emoji: "🎖️", check: (s) => (s.flags?.streakCorrect ?? 0) >= 20 },
  { id: "desafio-30", title: "Desafio do Mês", description: "Acerte 30 questões seguidas.", emoji: "🏆", check: (s) => (s.flags?.streakCorrect ?? 0) >= 30 },
  { id: "duelista", title: "Duelista", description: "Vença 1 partida do Duelo Relâmpago.", emoji: "⚔️", check: (s) => (s.flags?.dueloWins ?? 0) >= 1 },
  { id: "duelista-10", title: "Mestre dos Duelos", description: "Vença 10 partidas do Duelo Relâmpago.", emoji: "🏅", check: (s) => (s.flags?.dueloWins ?? 0) >= 10 },
  { id: "explorador-tudo", title: "Explorador", description: "Visite todas as áreas do app (Trilha, Jogos, Erros, SRS, Tutor, Modo Professor).", emoji: "🧭", check: (s) => (s.flags?.areasVisited ?? 0) >= 6 },
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

import { CHAPTERS } from "@/content";
import type { Subject } from "./types";
import { HALLIDAY_PROBLEMS } from "@/content/halliday-problems";

function hasAnySubjectLesson(s: import("./store").PersistedState, subject: Subject): boolean {
  const chapterIds = CHAPTERS.filter((c) => (c.subject ?? "fisica") === subject).map((c) => c.id);
  return Object.entries(s.lessonProgress).some(([k, p]) => p.completed && chapterIds.some((cid) => k.startsWith(`${cid}/`)));
}

function hasStudiedAllSubjectsSameDay(s: import("./store").PersistedState): boolean {
  const log = s.subjectsStudiedByDay ?? {};
  return Object.values(log).some((set) => set && set.length >= 4);
}

function countHallidayByLevel(s: import("./store").PersistedState, level: 1 | 2 | 3): number {
  const status = s.hallidayStatus ?? {};
  let count = 0;
  for (const [id, st] of Object.entries(status)) {
    if (st !== "right") continue;
    const p = HALLIDAY_PROBLEMS.find((q) => q.id === id);
    if (p && p.difficulty === level) count++;
  }
  return count;
}

function completedAnyFullSubject(s: import("./store").PersistedState): boolean {
  const subjects: Subject[] = ["fisica", "quimica", "ga", "calculo"];
  return subjects.some((subject) => {
    const chs = CHAPTERS.filter((c) => (c.subject ?? "fisica") === subject);
    if (chs.length === 0) return false;
    return chs.every((c) => hasChapterCompleted(s, c.id));
  });
}

function sumCorrect(s: import("./store").PersistedState): number {
  return s.dailyLog.reduce((acc, d) => acc + (d.correctAnswers ?? 0), 0);
}

function completedFullSubject(s: import("./store").PersistedState, subject: Subject): boolean {
  const chs = CHAPTERS.filter((c) => (c.subject ?? "fisica") === subject);
  if (chs.length === 0) return false;
  return chs.every((c) => hasChapterCompleted(s, c.id));
}

function completedSubjectsCount(s: import("./store").PersistedState): number {
  const subjects: Subject[] = ["fisica", "quimica", "ga", "calculo"];
  return subjects.filter((sub) => completedFullSubject(s, sub)).length;
}

function countHalliday(s: import("./store").PersistedState, kind: "correct" | "wrong"): number {
  const status = s.hallidayStatus ?? {};
  const target = kind === "correct" ? "right" : "wrong";
  return Object.values(status).filter((st) => st === target).length;
}

function countHallidayDifficulty(s: import("./store").PersistedState, level: 1 | 2 | 3): number {
  return countHallidayByLevel(s, level);
}
