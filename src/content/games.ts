// Banco de conteúdo dos minijogos (/jogos).
// Tudo estruturado por capítulo quando faz sentido.

export interface FormulaMatch {
  chapterId: string;
  formulaLatex: string;
  concept: string; // ex: "2ª Lei de Newton"
}

export interface UnitItem {
  chapterId: string;
  label: string; // ex: "aceleração da gravidade (≈9,81)"
  correct: string; // unidade correta (sem simbologia gringa)
  options: string[]; // alternativas (inclui a correta)
}

export interface StepOrderItem {
  chapterId: string;
  prompt: string;
  steps: string[]; // ordem certa
}

export interface SignErrorItem {
  chapterId: string;
  prompt: string;
  lines: string[]; // ordem certa
  wrongIndex: number; // 0-based; qual linha tá errada (o usuário tem que clicar nela)
  correction: string; // explicação do que está errado
}

export interface BossQuestion {
  prompt: string;
  options: string[];
  correct: number; // índice
  damage: number; // dano causado ao acertar
  explanation: string;
}

export interface Boss {
  chapterId: string;
  name: string;
  emoji: string;
  hp: number;
  questions: BossQuestion[];
}

export interface FragmentProblem {
  chapterId: string;
  prompt: string;
  // slots que o jogador precisa preencher, em ordem: Dados, Fórmula, Substituição, Resultado
  slots: { label: string; correctId: string }[];
  // fragmentos disponíveis (inclui a resposta certa e pegadinhas)
  fragments: { id: string; text: string }[];
  explanation: string;
}

// -------- FORMULA MATCH --------
export const FORMULA_MATCHES: FormulaMatch[] = [
  { chapterId: "01-medicao", formulaLatex: "\\rho = \\dfrac{m}{V}", concept: "Densidade" },
  { chapterId: "02-movimento-retilineo", formulaLatex: "v = v_0 + a t", concept: "Velocidade no MRUV" },
  { chapterId: "02-movimento-retilineo", formulaLatex: "v^2 = v_0^2 + 2 a \\Delta x", concept: "Torricelli (sem tempo)" },
  { chapterId: "03-vetores", formulaLatex: "\\vec{c} = \\vec{a} + \\vec{b}", concept: "Soma de vetores" },
  { chapterId: "04-movimento-2d-3d", formulaLatex: "a_c = \\dfrac{v^2}{r}", concept: "Aceleração centrípeta" },
  { chapterId: "05-forca-i", formulaLatex: "\\vec{F}_{res} = m \\vec{a}", concept: "2ª Lei de Newton" },
  { chapterId: "05-forca-i", formulaLatex: "P = m g", concept: "Peso" },
  { chapterId: "06-forca-ii", formulaLatex: "f_{at} \\le \\mu_s N", concept: "Atrito estático" },
  { chapterId: "07-trabalho-energia", formulaLatex: "W = F d \\cos\\theta", concept: "Trabalho de força" },
  { chapterId: "07-trabalho-energia", formulaLatex: "K = \\tfrac{1}{2} m v^2", concept: "Energia cinética" },
  { chapterId: "07-trabalho-energia", formulaLatex: "P = \\dfrac{W}{t}", concept: "Potência média" },
  { chapterId: "08-energia-potencial", formulaLatex: "U_g = m g h", concept: "Energia potencial gravitacional" },
  { chapterId: "08-energia-potencial", formulaLatex: "U_k = \\tfrac{1}{2} k x^2", concept: "Energia potencial elástica" },
  { chapterId: "09-centro-massa-momento", formulaLatex: "\\vec{p} = m \\vec{v}", concept: "Momento linear" },
  { chapterId: "09-centro-massa-momento", formulaLatex: "J = \\int F\\,dt = \\Delta p", concept: "Impulso" },
  { chapterId: "10-rotacao", formulaLatex: "\\omega = \\omega_0 + \\alpha t", concept: "Velocidade angular (MRUV angular)" },
  { chapterId: "10-rotacao", formulaLatex: "\\tau = I \\alpha", concept: "2ª Lei de Newton rotacional" },
  { chapterId: "11-rolamento-torque", formulaLatex: "L = I \\omega", concept: "Momento angular" },
];

// -------- UNIDADES --------
export const UNIT_ITEMS: UnitItem[] = [
  { chapterId: "01-medicao", label: "densidade da água", correct: "kg/m³", options: ["kg/m³", "N/m²", "J/kg", "m/s"] },
  { chapterId: "02-movimento-retilineo", label: "velocidade de um carro na rodovia", correct: "m/s", options: ["m/s", "m", "kg·m/s", "J"] },
  { chapterId: "02-movimento-retilineo", label: "aceleração da gravidade (≈9,81)", correct: "m/s²", options: ["m/s²", "m/s", "N", "kg"] },
  { chapterId: "05-forca-i", label: "força resultante em um corpo", correct: "N", options: ["N", "kg", "J", "Pa"] },
  { chapterId: "07-trabalho-energia", label: "trabalho realizado por uma força", correct: "J", options: ["J", "W", "N", "kg·m"] },
  { chapterId: "07-trabalho-energia", label: "potência dissipada em uma resistência", correct: "W", options: ["W", "J", "N·s", "Pa"] },
  { chapterId: "08-energia-potencial", label: "constante elástica de mola", correct: "N/m", options: ["N/m", "J/m²", "kg/s", "Pa·m"] },
  { chapterId: "09-centro-massa-momento", label: "momento linear de um corpo", correct: "kg·m/s", options: ["kg·m/s", "N", "J", "m/s²"] },
  { chapterId: "10-rotacao", label: "momento de inércia", correct: "kg·m²", options: ["kg·m²", "N·m", "J", "rad/s"] },
  { chapterId: "10-rotacao", label: "torque", correct: "N·m", options: ["N·m", "J", "kg·m", "rad"] },
  { chapterId: "11-rolamento-torque", label: "momento angular", correct: "kg·m²/s", options: ["kg·m²/s", "kg·m/s", "N·m", "J·s"] },
  { chapterId: "01-medicao", label: "pressão atmosférica", correct: "Pa", options: ["Pa", "N", "J/m²", "kg/m"] },
];

// -------- ORDEM DOS PASSOS --------
export const STEP_ORDER_ITEMS: StepOrderItem[] = [
  {
    chapterId: "02-movimento-retilineo",
    prompt: "Um carro parte do repouso e acelera a 2 m/s² por 5 s. Qual a velocidade final?",
    steps: [
      "Identifica os dados: v₀ = 0; a = 2 m/s²; t = 5 s.",
      "Escolhe a fórmula do MRUV: v = v₀ + a·t.",
      "Substitui: v = 0 + 2·5.",
      "Calcula: v = 10 m/s.",
    ],
  },
  {
    chapterId: "05-forca-i",
    prompt: "Uma caixa de 3 kg está em uma superfície sem atrito e uma força horizontal de 12 N é aplicada. Qual a aceleração?",
    steps: [
      "Dados: m = 3 kg; F = 12 N; sem atrito.",
      "Aplica a 2ª Lei: F_res = m·a → a = F_res/m.",
      "Substitui: a = 12/3.",
      "Resultado: a = 4 m/s².",
    ],
  },
  {
    chapterId: "07-trabalho-energia",
    prompt: "Uma força de 10 N move o corpo por 3 m na direção do movimento. Quanto trabalho foi feito?",
    steps: [
      "Dados: F = 10 N; d = 3 m; θ = 0° (mesma direção).",
      "Fórmula do trabalho: W = F·d·cos θ.",
      "Substitui: W = 10·3·cos 0° = 10·3·1.",
      "Resultado: W = 30 J.",
    ],
  },
  {
    chapterId: "08-energia-potencial",
    prompt: "Corpo de 2 kg solto a 5 m do chão. Qual a velocidade ao tocar o chão (g = 10 m/s²)?",
    steps: [
      "Dados: m = 2 kg; h = 5 m; g = 10 m/s².",
      "Conservação: m·g·h = ½·m·v².",
      "Isola v: v = √(2·g·h) = √(2·10·5).",
      "Resultado: v = 10 m/s.",
    ],
  },
  {
    chapterId: "09-centro-massa-momento",
    prompt: "Bola de 0,2 kg colide a 10 m/s e volta a 8 m/s. Qual o impulso?",
    steps: [
      "Dados: m = 0,2 kg; v_i = +10 m/s; v_f = −8 m/s.",
      "Impulso: J = Δp = m·(v_f − v_i).",
      "Substitui: J = 0,2·(−8 − 10) = 0,2·(−18).",
      "Resultado: J = −3,6 kg·m/s.",
    ],
  },
];

// -------- CAÇA AO ERRO DE SINAL --------
export const SIGN_ERROR_ITEMS: SignErrorItem[] = [
  {
    chapterId: "02-movimento-retilineo",
    prompt: "Queda livre: v² = v₀² + 2·a·Δy, com a = −g (para cima positivo). Onde está o erro?",
    lines: [
      "Dados: v₀ = 20 m/s ↑; g = 10 m/s²; subindo até v = 0.",
      "Equação: v² = v₀² + 2·a·Δy com a = −g.",
      "Substituição: 0 = 20² + 2·(−10)·Δy.",
      "Δy = +400 / 20 = +20 m.",
      "Δy = 20 m (sobe 20 m).",
    ],
    wrongIndex: 3,
    correction: "Está 0 = 400 − 20·Δy, logo Δy = 400/20 = 20 m (positivo, OK). O sinal na linha é coerente; revise se o cálculo mostra sinal correto: 400/20 = 20, sem inverter o lado.",
  },
  {
    chapterId: "05-forca-i",
    prompt: "Bloco 2 kg sobre plano inclinado 30° sem atrito. Decomposição na direção do plano (+ para baixo da rampa).",
    lines: [
      "Peso P = m·g = 2·10 = 20 N ↓.",
      "Componente ao longo da rampa: P_x = P·sin 30° = 20·0,5 = 10 N.",
      "Normal: N = P·cos 30° = 20·(√3/2) ≈ 17,3 N.",
      "F_res = P_x − N = 10 − 17,3 = −7,3 N.",
      "a = F_res / m.",
    ],
    wrongIndex: 3,
    correction: "Não se soma normal com a componente do peso ao longo da rampa: a normal é perpendicular. F_res ao longo da rampa = P_x (sem atrito) = 10 N.",
  },
  {
    chapterId: "07-trabalho-energia",
    prompt: "Trabalho do atrito ao puxar um corpo 5 m em superfície com atrito de 6 N.",
    lines: [
      "Dados: d = 5 m; f_at = 6 N.",
      "Atrito se opõe ao movimento → ângulo θ = 180°.",
      "W_at = f_at · d · cos 180°.",
      "W_at = 6 · 5 · (+1) = +30 J.",
      "W_at = −30 J (trabalho negativo, como esperado).",
    ],
    wrongIndex: 3,
    correction: "cos 180° = −1, não +1. Logo W_at = 6·5·(−1) = −30 J.",
  },
];

// -------- BOSS DE CAPÍTULO --------
export const BOSSES: Boss[] = [
  {
    chapterId: "01-medicao",
    name: "Unidado, o Conversor",
    emoji: "📏",
    hp: 60,
    questions: [
      { prompt: "Qual a unidade SI de densidade?", options: ["kg/m³", "g/cm³", "N/m³", "J/m"], correct: 0, damage: 20, explanation: "SI usa kg e m." },
      { prompt: "72 km/h equivale a quantos m/s?", options: ["7,2", "20", "72", "200"], correct: 1, damage: 20, explanation: "Divida por 3,6." },
      { prompt: "Quantos algarismos significativos em 0,00420?", options: ["2", "3", "4", "5"], correct: 1, damage: 20, explanation: "Zeros à esquerda não contam." },
    ],
  },
  {
    chapterId: "02-movimento-retilineo",
    name: "Acelerus, o Veloz",
    emoji: "🏃",
    hp: 80,
    questions: [
      { prompt: "Em MRUV, se v₀ = 0, a = 2 m/s² e t = 5 s, então v =?", options: ["2 m/s", "5 m/s", "10 m/s", "20 m/s"], correct: 2, damage: 25, explanation: "v = v₀ + at." },
      { prompt: "Queda livre a partir do repouso, g=10 m/s², 3 s depois v =?", options: ["10 m/s", "20 m/s", "30 m/s", "90 m/s"], correct: 2, damage: 25, explanation: "v = g·t." },
      { prompt: "Gráfico v×t é uma reta crescente. O movimento é...", options: ["MRU", "MRUV", "repouso", "MCU"], correct: 1, damage: 30, explanation: "Reta com inclinação = aceleração constante ≠ 0." },
    ],
  },
  {
    chapterId: "03-vetores",
    name: "Vetrix, o Decompositor",
    emoji: "➡️",
    hp: 70,
    questions: [
      { prompt: "Vetor de módulo 10 na direção 37° (sin≈0,6; cos≈0,8). Componente x =?", options: ["6", "8", "10", "37"], correct: 1, damage: 25, explanation: "Vx = V·cosθ." },
      { prompt: "|A|=3, |B|=4, perpendiculares. |A+B| =?", options: ["1", "5", "7", "12"], correct: 1, damage: 25, explanation: "Pitágoras: √(9+16) = 5." },
      { prompt: "Produto escalar A·B quando perpendiculares é...", options: ["|A||B|", "0", "−|A||B|", "|A|+|B|"], correct: 1, damage: 20, explanation: "cos 90° = 0." },
    ],
  },
  {
    chapterId: "04-movimento-2d-3d",
    name: "Balistix, o Projétil",
    emoji: "🏹",
    hp: 80,
    questions: [
      { prompt: "Em lançamento oblíquo, a aceleração vertical vale...", options: ["0", "g para cima", "−g (para baixo)", "v₀y"], correct: 2, damage: 25, explanation: "Apenas gravidade." },
      { prompt: "Aceleração centrípeta em MCU com v=10 e r=5:", options: ["2", "10", "20", "50"], correct: 2, damage: 25, explanation: "a_c = v²/r = 100/5." },
      { prompt: "No pico do lançamento oblíquo, v_y vale...", options: ["máximo", "0", "v₀·sinθ", "v₀"], correct: 1, damage: 30, explanation: "v_y troca de sinal no pico." },
    ],
  },
  {
    chapterId: "05-forca-i",
    name: "Newton Rex",
    emoji: "🍎",
    hp: 90,
    questions: [
      { prompt: "F = 12 N atua sobre m = 3 kg. Aceleração =?", options: ["3", "4", "9", "36"], correct: 1, damage: 30, explanation: "a = F/m." },
      { prompt: "Corpo em MRU tem F_res =?", options: ["P", "m·a", "0", "N"], correct: 2, damage: 30, explanation: "MRU ⇒ a = 0 ⇒ F_res = 0." },
      { prompt: "Peso de 5 kg (g = 10) vale...", options: ["5 N", "15 N", "50 N", "0,5 N"], correct: 2, damage: 30, explanation: "P = m·g." },
    ],
  },
  {
    chapterId: "06-forca-ii",
    name: "Friccio, o Pegajoso",
    emoji: "🛞",
    hp: 90,
    questions: [
      { prompt: "μ_s = 0,4, N = 50 N. Atrito estático máximo vale...", options: ["10", "20", "40", "50"], correct: 1, damage: 30, explanation: "f_s(max) = μ_s·N." },
      { prompt: "Carro em curva horizontal sem atrito...", options: ["não faz curva", "desliza", "as duas", "MCU estável"], correct: 2, damage: 30, explanation: "Precisa de força centrípeta, que viria do atrito." },
      { prompt: "No MCU, a força resultante aponta...", options: ["na direção de v", "centrípeta (para o centro)", "para fora", "para cima"], correct: 1, damage: 30, explanation: "F_c aponta para o centro." },
    ],
  },
  {
    chapterId: "07-trabalho-energia",
    name: "Energus, o Eterno",
    emoji: "⚡",
    hp: 100,
    questions: [
      { prompt: "F = 10 N; d = 3 m; θ = 0°. W =?", options: ["0", "10 J", "13 J", "30 J"], correct: 3, damage: 30, explanation: "W = F·d·cos 0° = 30 J." },
      { prompt: "m = 2 kg; v = 3 m/s. K =?", options: ["3 J", "6 J", "9 J", "18 J"], correct: 2, damage: 30, explanation: "K = ½mv² = ½·2·9 = 9 J." },
      { prompt: "Potência média de 600 J em 4 s vale...", options: ["4 W", "150 W", "600 W", "2400 W"], correct: 1, damage: 40, explanation: "P = W/t = 150 W." },
    ],
  },
  {
    chapterId: "08-energia-potencial",
    name: "Potus, o Conservador",
    emoji: "🔋",
    hp: 100,
    questions: [
      { prompt: "m=2 kg, h=5 m, g=10. U_g =?", options: ["10 J", "25 J", "50 J", "100 J"], correct: 3, damage: 30, explanation: "U = m·g·h = 100 J." },
      { prompt: "Mola com k=200 N/m, x=0,1 m. U_k =?", options: ["1 J", "2 J", "10 J", "20 J"], correct: 0, damage: 30, explanation: "U = ½·k·x² = ½·200·0,01 = 1 J." },
      { prompt: "Corpo cai 20 m do repouso. v ao chegar (sem atrito, g=10)?", options: ["10 m/s", "15 m/s", "20 m/s", "40 m/s"], correct: 2, damage: 40, explanation: "v = √(2gh) = √400 = 20 m/s." },
    ],
  },
  {
    chapterId: "09-centro-massa-momento",
    name: "Momentus, o Impulsor",
    emoji: "💥",
    hp: 100,
    questions: [
      { prompt: "m=3 kg; v=4 m/s. p =?", options: ["3", "7", "12", "16"], correct: 2, damage: 30, explanation: "p = m·v." },
      { prompt: "Colisão perfeitamente inelástica: que grandeza se conserva?", options: ["Só energia", "Só momento", "Ambas", "Nenhuma"], correct: 1, damage: 30, explanation: "Momento sempre; energia não na inelástica." },
      { prompt: "Impulso médio ao parar 2 kg que vinha a 5 m/s:", options: ["5 N·s", "10 N·s", "15 N·s", "20 N·s"], correct: 1, damage: 40, explanation: "J = Δp = 0 − 2·5 = −10 (módulo 10)." },
    ],
  },
  {
    chapterId: "10-rotacao",
    name: "Rotor, o Girador",
    emoji: "🌀",
    hp: 90,
    questions: [
      { prompt: "ω₀ = 0; α = 2 rad/s²; t = 3 s. ω =?", options: ["2", "3", "5", "6"], correct: 3, damage: 30, explanation: "ω = α·t." },
      { prompt: "Momento de inércia de massa pontual m a r do eixo:", options: ["m·r", "m·r²", "½·m·r²", "m/r"], correct: 1, damage: 30, explanation: "I = m·r² para massa pontual." },
      { prompt: "Torque gira um corpo. Relação com I:", options: ["τ = I/α", "τ = I·α", "τ = I + α", "τ = α/I"], correct: 1, damage: 30, explanation: "2ª Lei rotacional." },
    ],
  },
  {
    chapterId: "11-rolamento-torque",
    name: "Giromax, o Angular",
    emoji: "🎡",
    hp: 110,
    questions: [
      { prompt: "Rolamento sem deslizar: v do centro × raio × ω:", options: ["v = r·ω", "v = ω/r", "v = r/ω", "v = r + ω"], correct: 0, damage: 30, explanation: "Condição de rolagem pura." },
      { prompt: "Momento angular L para disco I e ω:", options: ["L = I + ω", "L = I·ω", "L = I/ω", "L = ω/I"], correct: 1, damage: 30, explanation: "Definição." },
      { prompt: "Patinador fecha os braços: L conservado. Ao diminuir I, ω...", options: ["diminui", "fica igual", "aumenta", "zera"], correct: 2, damage: 50, explanation: "I·ω constante ⇒ se I cai, ω sobe." },
    ],
  },
];

// -------- MONTE A RESOLUÇÃO --------
export const FRAGMENT_PROBLEMS: FragmentProblem[] = [
  {
    chapterId: "07-trabalho-energia",
    prompt: "Um bloco de massa 2 kg se move a 10 m/s. Qual a energia cinética?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "m = 2 kg; v = 10 m/s" },
      { id: "f1", text: "K = ½·m·v²" },
      { id: "s1", text: "K = ½·2·10²" },
      { id: "r1", text: "K = 100 J" },
      // pegadinhas:
      { id: "fx1", text: "K = m·v²" },
      { id: "fx2", text: "K = ½·2·10" },
      { id: "rx1", text: "K = 200 J" },
      { id: "rx2", text: "K = 20 J" },
    ],
    explanation: "O ½ é essencial; e elevar ao quadrado vem antes da multiplicação.",
  },
  {
    chapterId: "05-forca-i",
    prompt: "Uma força de 12 N atua sobre um corpo de 3 kg sem atrito. Qual a aceleração?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "F = 12 N; m = 3 kg" },
      { id: "f1", text: "a = F/m" },
      { id: "s1", text: "a = 12/3" },
      { id: "r1", text: "a = 4 m/s²" },
      // pegadinhas:
      { id: "fx1", text: "F = m·a (não isolada)" },
      { id: "fx2", text: "a = F·m" },
      { id: "rx1", text: "a = 36 m/s²" },
      { id: "rx2", text: "a = 1/4 m/s²" },
    ],
    explanation: "Isola a aceleração antes de substituir; a = F/m, não F·m.",
  },
  {
    chapterId: "08-energia-potencial",
    prompt: "Corpo de 2 kg é solto de 5 m de altura (g = 10 m/s²). Qual a velocidade ao tocar o solo (sem atrito)?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "m = 2 kg; h = 5 m; g = 10 m/s²" },
      { id: "f1", text: "m·g·h = ½·m·v² ⇒ v = √(2·g·h)" },
      { id: "s1", text: "v = √(2·10·5) = √100" },
      { id: "r1", text: "v = 10 m/s" },
      // pegadinhas:
      { id: "fx1", text: "v = 2·g·h" },
      { id: "fx2", text: "v² = g·h" },
      { id: "rx1", text: "v = 100 m/s" },
      { id: "rx2", text: "v = 5 m/s" },
    ],
    explanation: "Conservação: U_g → K; isola v com raiz.",
  },
  {
    chapterId: "02-movimento-retilineo",
    prompt: "Carro parte do repouso e acelera a 2 m/s² por 5 s. Qual a velocidade final?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "v₀ = 0; a = 2 m/s²; t = 5 s" },
      { id: "f1", text: "v = v₀ + a·t" },
      { id: "s1", text: "v = 0 + 2·5" },
      { id: "r1", text: "v = 10 m/s" },
      // pegadinhas:
      { id: "fx1", text: "Δx = v₀·t + ½·a·t²" },
      { id: "fx2", text: "v² = v₀² + 2·a·Δx" },
      { id: "rx1", text: "v = 7 m/s" },
      { id: "rx2", text: "v = 25 m/s" },
    ],
    explanation: "MRUV: v = v₀ + a·t quando tempo é dado.",
  },
  {
    chapterId: "09-centro-massa-momento",
    prompt: "Bola de 0,2 kg bate na parede a 10 m/s e volta a 8 m/s. Qual o impulso (tomando direção inicial como positiva)?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "m = 0,2 kg; v_i = +10 m/s; v_f = −8 m/s" },
      { id: "f1", text: "J = Δp = m·(v_f − v_i)" },
      { id: "s1", text: "J = 0,2·(−8 − 10) = 0,2·(−18)" },
      { id: "r1", text: "J = −3,6 kg·m/s" },
      // pegadinhas:
      { id: "fx1", text: "J = m·(v_i − v_f)" },
      { id: "fx2", text: "J = m·v_f" },
      { id: "rx1", text: "J = +3,6 kg·m/s" },
      { id: "rx2", text: "J = 0,4 kg·m/s" },
    ],
    explanation: "Sinais importam: volta significa v_f negativo se escolhemos inicial como positivo.",
  },
];

// Chapter pretty names (lookup)
export const CHAPTER_LABEL: Record<string, string> = {
  "01-medicao": "Cap. 1 · Medição",
  "02-movimento-retilineo": "Cap. 2 · Movimento Retilíneo",
  "03-vetores": "Cap. 3 · Vetores",
  "04-movimento-2d-3d": "Cap. 4 · Movimento 2D/3D",
  "05-forca-i": "Cap. 5 · Força I",
  "06-forca-ii": "Cap. 6 · Força II",
  "07-trabalho-energia": "Cap. 7 · Trabalho e Energia",
  "08-energia-potencial": "Cap. 8 · Energia Potencial",
  "09-centro-massa-momento": "Cap. 9 · Momento Linear",
  "10-rotacao": "Cap. 10 · Rotação",
  "11-rolamento-torque": "Cap. 11 · Rolamento/Torque",
};
