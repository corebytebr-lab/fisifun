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
  // Cap 1 — Medição
  { chapterId: "01-medicao", formulaLatex: "\\rho = \\dfrac{m}{V}", concept: "Densidade" },
  { chapterId: "01-medicao", formulaLatex: "1\\,\\text{m}/\\text{s} = 3{,}6\\,\\text{km}/\\text{h}", concept: "Conversão m/s ↔ km/h" },
  { chapterId: "01-medicao", formulaLatex: "V_{\\text{esfera}} = \\tfrac{4}{3}\\pi r^3", concept: "Volume de esfera" },
  { chapterId: "01-medicao", formulaLatex: "[F] = [M][L][T]^{-2}", concept: "Análise dimensional (força)" },

  // Cap 2 — Movimento Retilíneo
  { chapterId: "02-movimento-retilineo", formulaLatex: "v = v_0 + a t", concept: "Velocidade no MRUV" },
  { chapterId: "02-movimento-retilineo", formulaLatex: "\\Delta x = v_0 t + \\tfrac{1}{2} a t^2", concept: "Posição no MRUV" },
  { chapterId: "02-movimento-retilineo", formulaLatex: "v^2 = v_0^2 + 2 a \\Delta x", concept: "Torricelli (sem tempo)" },
  { chapterId: "02-movimento-retilineo", formulaLatex: "\\bar{v} = \\dfrac{\\Delta x}{\\Delta t}", concept: "Velocidade média" },
  { chapterId: "02-movimento-retilineo", formulaLatex: "a = \\dfrac{dv}{dt}", concept: "Aceleração instantânea" },

  // Cap 3 — Vetores
  { chapterId: "03-vetores", formulaLatex: "\\vec{c} = \\vec{a} + \\vec{b}", concept: "Soma de vetores" },
  { chapterId: "03-vetores", formulaLatex: "A_x = A\\cos\\theta,\\ A_y = A\\sin\\theta", concept: "Componentes de um vetor" },
  { chapterId: "03-vetores", formulaLatex: "\\vec{a}\\cdot\\vec{b} = ab\\cos\\theta", concept: "Produto escalar" },
  { chapterId: "03-vetores", formulaLatex: "|\\vec{a}\\times\\vec{b}| = ab\\sin\\theta", concept: "Módulo do produto vetorial" },

  // Cap 4 — 2D/3D
  { chapterId: "04-movimento-2d-3d", formulaLatex: "a_c = \\dfrac{v^2}{r}", concept: "Aceleração centrípeta" },
  { chapterId: "04-movimento-2d-3d", formulaLatex: "R = \\dfrac{v_0^2\\sin 2\\theta}{g}", concept: "Alcance do lançamento oblíquo" },
  { chapterId: "04-movimento-2d-3d", formulaLatex: "T = \\dfrac{2\\pi r}{v}", concept: "Período do MCU" },
  { chapterId: "04-movimento-2d-3d", formulaLatex: "H = \\dfrac{v_0^2\\sin^2\\theta}{2g}", concept: "Altura máxima do projétil" },

  // Cap 5 — Força I
  { chapterId: "05-forca-i", formulaLatex: "\\vec{F}_{res} = m \\vec{a}", concept: "2ª Lei de Newton" },
  { chapterId: "05-forca-i", formulaLatex: "P = m g", concept: "Peso" },
  { chapterId: "05-forca-i", formulaLatex: "\\vec{F}_{AB} = -\\vec{F}_{BA}", concept: "3ª Lei de Newton (ação e reação)" },
  { chapterId: "05-forca-i", formulaLatex: "N = m g \\cos\\theta", concept: "Normal em plano inclinado" },

  // Cap 6 — Força II (atrito, arrasto, MCU)
  { chapterId: "06-forca-ii", formulaLatex: "f_{s,\\max} = \\mu_s N", concept: "Atrito estático máximo" },
  { chapterId: "06-forca-ii", formulaLatex: "f_k = \\mu_k N", concept: "Atrito cinético" },
  { chapterId: "06-forca-ii", formulaLatex: "F_c = \\dfrac{m v^2}{r}", concept: "Força centrípeta" },
  { chapterId: "06-forca-ii", formulaLatex: "F_d = \\tfrac{1}{2} C \\rho A v^2", concept: "Arrasto (velocidade alta)" },

  // Cap 7 — Trabalho e Energia
  { chapterId: "07-trabalho-energia", formulaLatex: "W = F d \\cos\\theta", concept: "Trabalho de força constante" },
  { chapterId: "07-trabalho-energia", formulaLatex: "K = \\tfrac{1}{2} m v^2", concept: "Energia cinética" },
  { chapterId: "07-trabalho-energia", formulaLatex: "P = \\dfrac{W}{t}", concept: "Potência média" },
  { chapterId: "07-trabalho-energia", formulaLatex: "P = \\vec{F}\\cdot\\vec{v}", concept: "Potência instantânea" },
  { chapterId: "07-trabalho-energia", formulaLatex: "W_{\\text{res}} = \\Delta K", concept: "Teorema trabalho-energia" },

  // Cap 8 — Energia Potencial
  { chapterId: "08-energia-potencial", formulaLatex: "U_g = m g h", concept: "Energia potencial gravitacional" },
  { chapterId: "08-energia-potencial", formulaLatex: "U_k = \\tfrac{1}{2} k x^2", concept: "Energia potencial elástica" },
  { chapterId: "08-energia-potencial", formulaLatex: "E_{mec} = K + U", concept: "Energia mecânica" },
  { chapterId: "08-energia-potencial", formulaLatex: "\\Delta E_{mec} = W_{nc}", concept: "Energia mecânica e forças não-conservativas" },

  // Cap 9 — Momento Linear
  { chapterId: "09-centro-massa-momento", formulaLatex: "\\vec{p} = m \\vec{v}", concept: "Momento linear" },
  { chapterId: "09-centro-massa-momento", formulaLatex: "J = \\int F\\,dt = \\Delta p", concept: "Impulso" },
  { chapterId: "09-centro-massa-momento", formulaLatex: "\\vec{R}_{cm} = \\dfrac{\\sum m_i \\vec{r}_i}{\\sum m_i}", concept: "Posição do centro de massa" },
  { chapterId: "09-centro-massa-momento", formulaLatex: "p_i = p_f", concept: "Conservação do momento linear" },

  // Cap 10 — Rotação
  { chapterId: "10-rotacao", formulaLatex: "\\omega = \\omega_0 + \\alpha t", concept: "Velocidade angular (MRUV angular)" },
  { chapterId: "10-rotacao", formulaLatex: "\\tau = I \\alpha", concept: "2ª Lei de Newton rotacional" },
  { chapterId: "10-rotacao", formulaLatex: "K_{rot} = \\tfrac{1}{2} I \\omega^2", concept: "Energia cinética de rotação" },
  { chapterId: "10-rotacao", formulaLatex: "I = \\sum m_i r_i^2", concept: "Momento de inércia (pontuais)" },

  // Cap 11 — Rolamento / Momento Angular
  { chapterId: "11-rolamento-torque", formulaLatex: "L = I \\omega", concept: "Momento angular" },
  { chapterId: "11-rolamento-torque", formulaLatex: "v_{cm} = r \\omega", concept: "Rolamento sem deslizar" },
  { chapterId: "11-rolamento-torque", formulaLatex: "K_{total} = \\tfrac{1}{2} m v_{cm}^2 + \\tfrac{1}{2} I \\omega^2", concept: "Energia de corpo rolando" },
  { chapterId: "11-rolamento-torque", formulaLatex: "\\tau = \\dfrac{dL}{dt}", concept: "Torque e momento angular" },
];

// -------- UNIDADES --------
export const UNIT_ITEMS: UnitItem[] = [
  // Cap 1
  { chapterId: "01-medicao", label: "densidade da água", correct: "kg/m³", options: ["kg/m³", "N/m²", "J/kg", "m/s"] },
  { chapterId: "01-medicao", label: "pressão atmosférica", correct: "Pa", options: ["Pa", "N", "J/m²", "kg/m"] },
  { chapterId: "01-medicao", label: "volume de um cubo", correct: "m³", options: ["m³", "m²", "L/s", "kg/m"] },
  { chapterId: "01-medicao", label: "intervalo de tempo", correct: "s", options: ["s", "Hz", "rad", "m"] },

  // Cap 2
  { chapterId: "02-movimento-retilineo", label: "velocidade de um carro na rodovia", correct: "m/s", options: ["m/s", "m", "kg·m/s", "J"] },
  { chapterId: "02-movimento-retilineo", label: "aceleração da gravidade (≈9,81)", correct: "m/s²", options: ["m/s²", "m/s", "N", "kg"] },
  { chapterId: "02-movimento-retilineo", label: "deslocamento", correct: "m", options: ["m", "m²", "m/s", "s"] },
  { chapterId: "02-movimento-retilineo", label: "velocidade média", correct: "m/s", options: ["m/s", "m·s", "m/s²", "km"] },

  // Cap 3
  { chapterId: "03-vetores", label: "módulo de um vetor posição", correct: "m", options: ["m", "m/s", "rad", "kg"] },
  { chapterId: "03-vetores", label: "ângulo entre dois vetores", correct: "rad", options: ["rad", "m", "kg", "s"] },
  { chapterId: "03-vetores", label: "produto escalar força × deslocamento", correct: "J", options: ["J", "N", "N·s", "m²"] },
  { chapterId: "03-vetores", label: "módulo do produto vetorial r × F", correct: "N·m", options: ["N·m", "N/m", "J·s", "kg"] },

  // Cap 4
  { chapterId: "04-movimento-2d-3d", label: "aceleração centrípeta", correct: "m/s²", options: ["m/s²", "rad/s²", "N", "m/s"] },
  { chapterId: "04-movimento-2d-3d", label: "período de um MCU", correct: "s", options: ["s", "Hz", "rad/s", "m"] },
  { chapterId: "04-movimento-2d-3d", label: "frequência de rotação", correct: "Hz", options: ["Hz", "s", "rad", "m/s"] },
  { chapterId: "04-movimento-2d-3d", label: "alcance horizontal de projétil", correct: "m", options: ["m", "m/s", "s", "J"] },

  // Cap 5
  { chapterId: "05-forca-i", label: "força resultante em um corpo", correct: "N", options: ["N", "kg", "J", "Pa"] },
  { chapterId: "05-forca-i", label: "massa inercial", correct: "kg", options: ["kg", "N", "J", "m"] },
  { chapterId: "05-forca-i", label: "tração em uma corda", correct: "N", options: ["N", "kg", "J/m", "Pa"] },
  { chapterId: "05-forca-i", label: "peso de um corpo", correct: "N", options: ["N", "kg", "kgf·s", "m/s²"] },

  // Cap 6
  { chapterId: "06-forca-ii", label: "coeficiente de atrito", correct: "(adimensional)", options: ["(adimensional)", "N", "kg", "1/s"] },
  { chapterId: "06-forca-ii", label: "força centrípeta", correct: "N", options: ["N", "kg·m", "J/s", "rad/s"] },
  { chapterId: "06-forca-ii", label: "raio da trajetória circular", correct: "m", options: ["m", "s", "rad", "N"] },
  { chapterId: "06-forca-ii", label: "força de arrasto", correct: "N", options: ["N", "Pa", "J", "kg·m"] },

  // Cap 7
  { chapterId: "07-trabalho-energia", label: "trabalho realizado por uma força", correct: "J", options: ["J", "W", "N", "kg·m"] },
  { chapterId: "07-trabalho-energia", label: "potência dissipada em uma resistência", correct: "W", options: ["W", "J", "N·s", "Pa"] },
  { chapterId: "07-trabalho-energia", label: "energia cinética", correct: "J", options: ["J", "N", "W", "kg·m/s"] },
  { chapterId: "07-trabalho-energia", label: "kilowatt-hora (energia)", correct: "J", options: ["J", "W", "W/s", "kg·m²"] },

  // Cap 8
  { chapterId: "08-energia-potencial", label: "constante elástica de mola", correct: "N/m", options: ["N/m", "J/m²", "kg/s", "Pa·m"] },
  { chapterId: "08-energia-potencial", label: "energia potencial gravitacional", correct: "J", options: ["J", "N", "Pa", "W"] },
  { chapterId: "08-energia-potencial", label: "energia potencial elástica", correct: "J", options: ["J", "N·m/s", "kg·m", "Pa"] },
  { chapterId: "08-energia-potencial", label: "altura em relação ao solo", correct: "m", options: ["m", "J/N", "N/kg", "N·m"] },

  // Cap 9
  { chapterId: "09-centro-massa-momento", label: "momento linear de um corpo", correct: "kg·m/s", options: ["kg·m/s", "N", "J", "m/s²"] },
  { chapterId: "09-centro-massa-momento", label: "impulso aplicado", correct: "N·s", options: ["N·s", "J", "kg·m²/s", "Pa"] },
  { chapterId: "09-centro-massa-momento", label: "posição do centro de massa", correct: "m", options: ["m", "kg", "J", "s"] },
  { chapterId: "09-centro-massa-momento", label: "força média em colisão", correct: "N", options: ["N", "N·s", "kg", "J"] },

  // Cap 10
  { chapterId: "10-rotacao", label: "momento de inércia", correct: "kg·m²", options: ["kg·m²", "N·m", "J", "rad/s"] },
  { chapterId: "10-rotacao", label: "torque", correct: "N·m", options: ["N·m", "J", "kg·m", "rad"] },
  { chapterId: "10-rotacao", label: "velocidade angular", correct: "rad/s", options: ["rad/s", "m/s", "Hz·m", "N/s"] },
  { chapterId: "10-rotacao", label: "aceleração angular", correct: "rad/s²", options: ["rad/s²", "m/s²", "rad·s", "Hz"] },

  // Cap 11
  { chapterId: "11-rolamento-torque", label: "momento angular", correct: "kg·m²/s", options: ["kg·m²/s", "kg·m/s", "N·m", "J·s"] },
  { chapterId: "11-rolamento-torque", label: "energia cinética rotacional", correct: "J", options: ["J", "N·m/s", "kg·m²", "W"] },
  { chapterId: "11-rolamento-torque", label: "velocidade do CM em rolamento puro", correct: "m/s", options: ["m/s", "rad/s", "m", "kg·m/s"] },
];

// -------- ORDEM DOS PASSOS --------
export const STEP_ORDER_ITEMS: StepOrderItem[] = [
  // Cap 1
  {
    chapterId: "01-medicao",
    prompt: "Converter 72 km/h para m/s.",
    steps: [
      "Identifica: 1 m/s = 3,6 km/h.",
      "Escolhe operação: dividir km/h por 3,6.",
      "Substitui: 72 / 3,6.",
      "Resultado: 20 m/s.",
    ],
  },
  {
    chapterId: "01-medicao",
    prompt: "Calcular a densidade de 500 g em 2 × 10⁻⁴ m³.",
    steps: [
      "Dados: m = 0,5 kg; V = 2·10⁻⁴ m³.",
      "Fórmula: ρ = m/V.",
      "Substitui: ρ = 0,5 / (2·10⁻⁴).",
      "Resultado: ρ = 2500 kg/m³.",
    ],
  },
  // Cap 2
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
    chapterId: "02-movimento-retilineo",
    prompt: "Pedra cai do repouso de 45 m (g = 10). Quanto tempo leva para cair?",
    steps: [
      "Dados: v₀ = 0; g = 10 m/s²; Δy = 45 m.",
      "Fórmula: Δy = ½·g·t².",
      "Isola t: t = √(2·Δy/g) = √(90/10).",
      "Resultado: t = 3 s.",
    ],
  },
  // Cap 3
  {
    chapterId: "03-vetores",
    prompt: "Decomponha um vetor de módulo 10 na direção 37° (sin ≈ 0,6; cos ≈ 0,8).",
    steps: [
      "Dados: |A| = 10; θ = 37°.",
      "Fórmulas: A_x = A·cos θ; A_y = A·sin θ.",
      "Substitui: A_x = 10·0,8; A_y = 10·0,6.",
      "Resultado: A_x = 8; A_y = 6.",
    ],
  },
  // Cap 4
  {
    chapterId: "04-movimento-2d-3d",
    prompt: "Objeto em MCU a 6 m/s, raio 2 m. Qual a aceleração centrípeta?",
    steps: [
      "Dados: v = 6 m/s; r = 2 m.",
      "Fórmula: a_c = v²/r.",
      "Substitui: a_c = 36/2.",
      "Resultado: a_c = 18 m/s².",
    ],
  },
  // Cap 5
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
    chapterId: "05-forca-i",
    prompt: "Bloco 5 kg pendurado por uma corda (equilíbrio). Qual a tração (g = 10)?",
    steps: [
      "Dados: m = 5 kg; g = 10 m/s²; equilíbrio → a = 0.",
      "2ª Lei: T − mg = 0 → T = mg.",
      "Substitui: T = 5·10.",
      "Resultado: T = 50 N.",
    ],
  },
  // Cap 6
  {
    chapterId: "06-forca-ii",
    prompt: "Bloco 2 kg sobre plano horizontal com μ_k = 0,2 (g = 10). Qual o atrito cinético?",
    steps: [
      "Dados: m = 2 kg; μ_k = 0,2; g = 10 m/s²; piso horizontal.",
      "Normal: N = m·g = 20 N.",
      "Fórmula: f_k = μ_k · N.",
      "Resultado: f_k = 0,2 · 20 = 4 N.",
    ],
  },
  // Cap 7
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
    chapterId: "07-trabalho-energia",
    prompt: "Motor realiza 1200 J em 4 s. Qual a potência média?",
    steps: [
      "Dados: W = 1200 J; t = 4 s.",
      "Fórmula: P = W / t.",
      "Substitui: P = 1200 / 4.",
      "Resultado: P = 300 W.",
    ],
  },
  // Cap 8
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
    chapterId: "08-energia-potencial",
    prompt: "Mola com k = 200 N/m comprimida 0,1 m. Qual a energia armazenada?",
    steps: [
      "Dados: k = 200 N/m; x = 0,1 m.",
      "Fórmula: U_k = ½·k·x².",
      "Substitui: U_k = ½·200·(0,1)² = ½·200·0,01.",
      "Resultado: U_k = 1 J.",
    ],
  },
  // Cap 9
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
  {
    chapterId: "09-centro-massa-momento",
    prompt: "Duas partículas: 2 kg em x=0 e 3 kg em x=5 m. Onde está o CM?",
    steps: [
      "Dados: m₁ = 2 kg; x₁ = 0; m₂ = 3 kg; x₂ = 5 m.",
      "Fórmula: x_cm = (m₁·x₁ + m₂·x₂) / (m₁ + m₂).",
      "Substitui: x_cm = (0 + 15) / 5.",
      "Resultado: x_cm = 3 m.",
    ],
  },
  // Cap 10
  {
    chapterId: "10-rotacao",
    prompt: "Roda parte do repouso com α = 2 rad/s² e gira 4 s. Qual ω final?",
    steps: [
      "Dados: ω₀ = 0; α = 2 rad/s²; t = 4 s.",
      "Fórmula: ω = ω₀ + α·t.",
      "Substitui: ω = 0 + 2·4.",
      "Resultado: ω = 8 rad/s.",
    ],
  },
  {
    chapterId: "10-rotacao",
    prompt: "Disco com I = 0,5 kg·m² e α = 4 rad/s². Qual o torque?",
    steps: [
      "Dados: I = 0,5 kg·m²; α = 4 rad/s².",
      "2ª Lei rotacional: τ = I·α.",
      "Substitui: τ = 0,5·4.",
      "Resultado: τ = 2 N·m.",
    ],
  },
  // Cap 11
  {
    chapterId: "11-rolamento-torque",
    prompt: "Bola (I = 2/5·m·r²) rolando sem deslizar com v_cm = 6 m/s e r = 0,3 m. Qual ω?",
    steps: [
      "Dados: v_cm = 6 m/s; r = 0,3 m; rolamento puro.",
      "Condição de rolar: v_cm = r·ω.",
      "Isola ω: ω = v_cm / r = 6 / 0,3.",
      "Resultado: ω = 20 rad/s.",
    ],
  },
  {
    chapterId: "11-rolamento-torque",
    prompt: "Patinador com L = 30 kg·m²/s fecha os braços reduzindo I de 6 para 2 kg·m². Qual ω_f?",
    steps: [
      "Dados: L inicial = 30 kg·m²/s; I_f = 2 kg·m².",
      "Conservação de L: L = I·ω → ω_f = L / I_f.",
      "Substitui: ω_f = 30 / 2.",
      "Resultado: ω_f = 15 rad/s.",
    ],
  },
];

// -------- CAÇA AO ERRO DE SINAL --------
export const SIGN_ERROR_ITEMS: SignErrorItem[] = [
  {
    chapterId: "02-movimento-retilineo",
    prompt: "Queda livre para cima: com v₀ = 20 m/s ↑ e g = 10 m/s², calcule Δy no pico.",
    lines: [
      "Dados: v₀ = +20 m/s; a = −g = −10 m/s²; v = 0 no pico.",
      "Equação: v² = v₀² + 2·a·Δy.",
      "0 = 20² − 20·Δy.",
      "Δy = +400 / +20 = +20 m.",
      "Δy = 20 m (sobe 20 m).",
    ],
    wrongIndex: 2,
    correction: "Conferindo: 0 = 400 + 2·(−10)·Δy = 400 − 20·Δy; a linha está certa. O erro seria escrever 0 = 20² + 20·Δy.",
  },
  {
    chapterId: "05-forca-i",
    prompt: "Bloco 2 kg em plano 30° sem atrito (+ para baixo da rampa). F_res na direção do plano =?",
    lines: [
      "Peso P = m·g = 2·10 = 20 N ↓.",
      "Componente ao longo da rampa: P_x = P·sin 30° = 20·0,5 = 10 N.",
      "Normal: N = P·cos 30° = 20·(√3/2) ≈ 17,3 N (perpendicular à rampa).",
      "F_res = P_x − N = 10 − 17,3 = −7,3 N.",
      "a = F_res / m.",
    ],
    wrongIndex: 3,
    correction: "Não se soma a normal com a componente do peso ao longo da rampa: a normal é perpendicular. F_res ao longo da rampa = P_x (sem atrito) = 10 N.",
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
  {
    chapterId: "08-energia-potencial",
    prompt: "Corpo cai de h = 5 m sem atrito. Achar v ao tocar o chão (g = 10).",
    lines: [
      "Conservação: m·g·h = ½·m·v².",
      "Simplifica m: g·h = ½·v².",
      "Isola v²: v² = 2·g·h = 2·10·5 = 100.",
      "v = −10 m/s.",
      "Módulo: v = 10 m/s (para baixo).",
    ],
    wrongIndex: 3,
    correction: "Ao tirar raiz de v², pegamos o módulo. O sinal vem da escolha de eixo — o enunciado pede o módulo de v: v = 10 m/s.",
  },
  {
    chapterId: "09-centro-massa-momento",
    prompt: "Bola de 0,2 kg bate em parede a +10 m/s e volta a −8 m/s. Calcule o impulso.",
    lines: [
      "Dados: m = 0,2 kg; v_i = +10; v_f = −8.",
      "J = Δp = m·(v_f − v_i).",
      "J = 0,2·(−8 − 10).",
      "J = 0,2·(+18) = +3,6 kg·m/s.",
      "Sinal negativo indica impulso contra o movimento inicial.",
    ],
    wrongIndex: 3,
    correction: "(−8 − 10) = −18 (não +18). Logo J = 0,2·(−18) = −3,6 kg·m/s.",
  },
  {
    chapterId: "06-forca-ii",
    prompt: "MCU: carro de 800 kg em curva r = 50 m a v = 10 m/s. F_c necessária?",
    lines: [
      "Dados: m = 800 kg; v = 10 m/s; r = 50 m.",
      "Fórmula: F_c = m·v²/r.",
      "Substitui: F_c = 800·100/50.",
      "F_c = 800 · 2 = 1600 N.",
      "F_c = −1600 N (aponta para fora do centro).",
    ],
    wrongIndex: 4,
    correction: "F_c sempre aponta PARA o centro — módulo positivo. Não é negativa nem aponta para fora.",
  },
  {
    chapterId: "10-rotacao",
    prompt: "Disco com I = 2 kg·m² parte do repouso e recebe τ = 4 N·m. Qual α?",
    lines: [
      "Dados: I = 2 kg·m²; τ = 4 N·m; ω₀ = 0.",
      "2ª Lei rotacional: τ = I·α.",
      "Isola α: α = τ / I.",
      "α = 4 · 2 = 8 rad/s².",
      "Direção igual à de τ.",
    ],
    wrongIndex: 3,
    correction: "Operação errada: α = τ/I, não τ·I. Logo α = 4/2 = 2 rad/s².",
  },
];

// -------- BOSS DE CAPÍTULO --------
export const BOSSES: Boss[] = [
  {
    chapterId: "01-medicao",
    name: "Unidado, o Conversor",
    emoji: "📏",
    hp: 100,
    questions: [
      { prompt: "Qual a unidade SI de densidade?", options: ["kg/m³", "g/cm³", "N/m³", "J/m"], correct: 0, damage: 20, explanation: "SI usa kg e m." },
      { prompt: "72 km/h equivale a quantos m/s?", options: ["7,2", "20", "72", "200"], correct: 1, damage: 20, explanation: "Divida por 3,6." },
      { prompt: "Quantos algarismos significativos em 0,00420?", options: ["2", "3", "4", "5"], correct: 1, damage: 20, explanation: "Zeros à esquerda não contam; o zero final sim." },
      { prompt: "1 hora tem quantos segundos?", options: ["60", "360", "3600", "36000"], correct: 2, damage: 20, explanation: "60·60 = 3600." },
      { prompt: "[velocidade] em unidades fundamentais é...", options: ["L·T", "L/T", "L·T⁻²", "M·L/T"], correct: 1, damage: 20, explanation: "velocidade = comprimento/tempo." },
    ],
  },
  {
    chapterId: "02-movimento-retilineo",
    name: "Acelerus, o Veloz",
    emoji: "🏃",
    hp: 120,
    questions: [
      { prompt: "Em MRUV, se v₀ = 0, a = 2 m/s² e t = 5 s, então v =?", options: ["2 m/s", "5 m/s", "10 m/s", "20 m/s"], correct: 2, damage: 25, explanation: "v = v₀ + at." },
      { prompt: "Queda livre a partir do repouso, g=10 m/s², 3 s depois v =?", options: ["10 m/s", "20 m/s", "30 m/s", "90 m/s"], correct: 2, damage: 25, explanation: "v = g·t." },
      { prompt: "Gráfico v×t é uma reta crescente. O movimento é...", options: ["MRU", "MRUV", "repouso", "MCU"], correct: 1, damage: 25, explanation: "Reta com inclinação = aceleração constante ≠ 0." },
      { prompt: "Corpo em MRUV v₀ = 10, a = 2, t = 4. Deslocamento Δx =?", options: ["24 m", "40 m", "48 m", "56 m"], correct: 2, damage: 20, explanation: "Δx = v₀t + ½at² = 40 + 16 = 56? Não: 40 + ½·2·16 = 40 + 16 = 56. Ops — 56 m." },
      { prompt: "Usando Torricelli (v² = v₀² + 2aΔx) com v₀=0, a=3, Δx=24, então v=?", options: ["8 m/s", "10 m/s", "12 m/s", "14 m/s"], correct: 2, damage: 25, explanation: "v² = 144 → v = 12." },
    ],
  },
  {
    chapterId: "03-vetores",
    name: "Vetrix, o Decompositor",
    emoji: "➡️",
    hp: 110,
    questions: [
      { prompt: "Vetor de módulo 10 na direção 37° (sin≈0,6; cos≈0,8). Componente x =?", options: ["6", "8", "10", "37"], correct: 1, damage: 20, explanation: "Vx = V·cosθ." },
      { prompt: "|A|=3, |B|=4, perpendiculares. |A+B| =?", options: ["1", "5", "7", "12"], correct: 1, damage: 25, explanation: "Pitágoras: √(9+16) = 5." },
      { prompt: "Produto escalar A·B quando perpendiculares é...", options: ["|A||B|", "0", "−|A||B|", "|A|+|B|"], correct: 1, damage: 20, explanation: "cos 90° = 0." },
      { prompt: "|A×B| é máximo quando o ângulo entre eles é...", options: ["0°", "45°", "90°", "180°"], correct: 2, damage: 25, explanation: "sin 90° = 1." },
      { prompt: "Vetor (3, 4) tem módulo igual a...", options: ["5", "7", "12", "25"], correct: 0, damage: 20, explanation: "√(9+16) = 5." },
    ],
  },
  {
    chapterId: "04-movimento-2d-3d",
    name: "Balistix, o Projétil",
    emoji: "🎯",
    hp: 110,
    questions: [
      { prompt: "Em lançamento oblíquo, a aceleração vertical vale...", options: ["0", "g para cima", "−g (para baixo)", "v₀y"], correct: 2, damage: 25, explanation: "Apenas gravidade." },
      { prompt: "Aceleração centrípeta em MCU com v=10 e r=5:", options: ["2", "10", "20", "50"], correct: 2, damage: 25, explanation: "a_c = v²/r = 100/5." },
      { prompt: "No pico do lançamento oblíquo, v_y vale...", options: ["máximo", "0", "v₀·sinθ", "v₀"], correct: 1, damage: 20, explanation: "v_y troca de sinal no pico." },
      { prompt: "Alcance máximo em solo plano acontece com θ =...", options: ["0°", "30°", "45°", "90°"], correct: 2, damage: 25, explanation: "sin(2·45°) = 1." },
      { prompt: "Período de MCU de raio 2 m a v = 4 m/s:", options: ["π s", "2π s", "π/2 s", "4π s"], correct: 0, damage: 20, explanation: "T = 2πr/v = 4π/4 = π." },
    ],
  },
  {
    chapterId: "05-forca-i",
    name: "Newton Rex",
    emoji: "🍎",
    hp: 130,
    questions: [
      { prompt: "F = 12 N atua sobre m = 3 kg. Aceleração =?", options: ["3", "4", "9", "36"], correct: 1, damage: 25, explanation: "a = F/m." },
      { prompt: "Corpo em MRU tem F_res =?", options: ["P", "m·a", "0", "N"], correct: 2, damage: 25, explanation: "MRU ⇒ a = 0 ⇒ F_res = 0." },
      { prompt: "Peso de 5 kg (g = 10) vale...", options: ["5 N", "15 N", "50 N", "0,5 N"], correct: 2, damage: 25, explanation: "P = m·g." },
      { prompt: "Par ação-reação tem módulos...", options: ["diferentes", "iguais e sentidos opostos", "só iguais se MRU", "só iguais se em repouso"], correct: 1, damage: 30, explanation: "3ª Lei: sempre." },
      { prompt: "Bloco 10 kg sobre piso (g = 10). Normal =?", options: ["0 N", "10 N", "50 N", "100 N"], correct: 3, damage: 25, explanation: "Equilíbrio vertical → N = mg." },
    ],
  },
  {
    chapterId: "06-forca-ii",
    name: "Friccio, o Pegajoso",
    emoji: "🚗",
    hp: 130,
    questions: [
      { prompt: "μ_s = 0,4, N = 50 N. Atrito estático máximo vale...", options: ["10", "20", "40", "50"], correct: 1, damage: 25, explanation: "f_s(max) = μ_s·N." },
      { prompt: "Carro em curva horizontal sem atrito...", options: ["faz curva normal", "desliza (não faz a curva)", "freia só", "MCU estável"], correct: 1, damage: 25, explanation: "Sem atrito, nada fornece força centrípeta." },
      { prompt: "No MCU, a força resultante aponta...", options: ["na direção de v", "centrípeta (para o centro)", "para fora", "para cima"], correct: 1, damage: 25, explanation: "F_c aponta para o centro." },
      { prompt: "Atrito cinético com μ_k = 0,3 sobre N = 20 N:", options: ["2 N", "4 N", "6 N", "60 N"], correct: 2, damage: 25, explanation: "f_k = μ_k·N = 6." },
      { prompt: "Em queda com arrasto, a velocidade terminal acontece quando...", options: ["v = 0", "F_arrasto = 0", "F_arrasto = peso", "F_arrasto > peso"], correct: 2, damage: 30, explanation: "Forças se equilibram." },
    ],
  },
  {
    chapterId: "07-trabalho-energia",
    name: "Energus, o Eterno",
    emoji: "⚡",
    hp: 140,
    questions: [
      { prompt: "F = 10 N; d = 3 m; θ = 0°. W =?", options: ["0", "10 J", "13 J", "30 J"], correct: 3, damage: 25, explanation: "W = F·d·cos 0° = 30 J." },
      { prompt: "m = 2 kg; v = 3 m/s. K =?", options: ["3 J", "6 J", "9 J", "18 J"], correct: 2, damage: 25, explanation: "K = ½mv² = ½·2·9 = 9 J." },
      { prompt: "Potência média de 600 J em 4 s vale...", options: ["4 W", "150 W", "600 W", "2400 W"], correct: 1, damage: 25, explanation: "P = W/t = 150 W." },
      { prompt: "Teorema trabalho-energia diz que W_res =...", options: ["Δp", "m·a", "ΔK", "ΔU"], correct: 2, damage: 30, explanation: "Variação da energia cinética." },
      { prompt: "Força perpendicular ao movimento realiza trabalho...", options: ["positivo", "negativo", "zero", "máximo"], correct: 2, damage: 35, explanation: "cos 90° = 0." },
    ],
  },
  {
    chapterId: "08-energia-potencial",
    name: "Potus, o Conservador",
    emoji: "🔋",
    hp: 140,
    questions: [
      { prompt: "m=2 kg, h=5 m, g=10. U_g =?", options: ["10 J", "25 J", "50 J", "100 J"], correct: 3, damage: 25, explanation: "U = m·g·h = 100 J." },
      { prompt: "Mola com k=200 N/m, x=0,1 m. U_k =?", options: ["1 J", "2 J", "10 J", "20 J"], correct: 0, damage: 25, explanation: "U = ½·k·x² = ½·200·0,01 = 1 J." },
      { prompt: "Corpo cai 20 m do repouso. v ao chegar (sem atrito, g=10)?", options: ["10 m/s", "15 m/s", "20 m/s", "40 m/s"], correct: 2, damage: 30, explanation: "v = √(2gh) = √400 = 20 m/s." },
      { prompt: "Energia mecânica é conservada quando só atuam forças...", options: ["de atrito", "conservativas", "externas", "de atrito cinético"], correct: 1, damage: 30, explanation: "Atrito dissipa." },
      { prompt: "Pêndulo ideal no ponto mais baixo: K e U relativos ao ponto mais alto…", options: ["K=0, U=máx", "K=máx, U=0", "K=U", "K=0, U=0"], correct: 1, damage: 30, explanation: "Altura mínima → U=0 (referencial); K máximo." },
    ],
  },
  {
    chapterId: "09-centro-massa-momento",
    name: "Momentus, o Impulsor",
    emoji: "🎱",
    hp: 140,
    questions: [
      { prompt: "m=3 kg; v=4 m/s. p =?", options: ["3", "7", "12", "16"], correct: 2, damage: 25, explanation: "p = m·v." },
      { prompt: "Colisão perfeitamente inelástica: que grandeza se conserva?", options: ["Só energia", "Só momento", "Ambas", "Nenhuma"], correct: 1, damage: 25, explanation: "Momento sempre; energia não na inelástica." },
      { prompt: "Impulso médio ao parar 2 kg que vinha a 5 m/s:", options: ["5 N·s", "10 N·s", "15 N·s", "20 N·s"], correct: 1, damage: 30, explanation: "J = Δp = 0 − 2·5 = −10 (módulo 10)." },
      { prompt: "Centro de massa de 2 kg em x=0 e 3 kg em x=5:", options: ["x=1", "x=2,5", "x=3", "x=4"], correct: 2, damage: 30, explanation: "x_cm = (0+15)/5 = 3." },
      { prompt: "Força × intervalo de tempo resulta em...", options: ["trabalho", "impulso", "potência", "energia"], correct: 1, damage: 30, explanation: "J = F·Δt." },
    ],
  },
  {
    chapterId: "10-rotacao",
    name: "Rotor, o Girador",
    emoji: "🌀",
    hp: 130,
    questions: [
      { prompt: "ω₀ = 0; α = 2 rad/s²; t = 3 s. ω =?", options: ["2", "3", "5", "6"], correct: 3, damage: 25, explanation: "ω = α·t." },
      { prompt: "Momento de inércia de massa pontual m a r do eixo:", options: ["m·r", "m·r²", "½·m·r²", "m/r"], correct: 1, damage: 25, explanation: "I = m·r² para massa pontual." },
      { prompt: "Torque gira um corpo. Relação com I:", options: ["τ = I/α", "τ = I·α", "τ = I + α", "τ = α/I"], correct: 1, damage: 25, explanation: "2ª Lei rotacional." },
      { prompt: "Energia cinética rotacional K_rot =...", options: ["½·m·v²", "½·I·ω²", "I·α", "m·g·h"], correct: 1, damage: 30, explanation: "Analogia a ½mv² com I e ω." },
      { prompt: "Relação entre v (tangencial) e ω em rotação pura: v =", options: ["ω/r", "ω·r", "ω + r", "ω − r"], correct: 1, damage: 25, explanation: "v = r·ω." },
    ],
  },
  {
    chapterId: "11-rolamento-torque",
    name: "Giromax, o Angular",
    emoji: "💡",
    hp: 150,
    questions: [
      { prompt: "Rolamento sem deslizar: v do centro × raio × ω:", options: ["v = r·ω", "v = ω/r", "v = r/ω", "v = r + ω"], correct: 0, damage: 25, explanation: "Condição de rolagem pura." },
      { prompt: "Momento angular L para disco I e ω:", options: ["L = I + ω", "L = I·ω", "L = I/ω", "L = ω/I"], correct: 1, damage: 25, explanation: "Definição." },
      { prompt: "Patinador fecha os braços: L conservado. Ao diminuir I, ω...", options: ["diminui", "fica igual", "aumenta", "zera"], correct: 2, damage: 40, explanation: "I·ω constante ⇒ se I cai, ω sobe." },
      { prompt: "Energia total de um corpo rolando puro:", options: ["½mv²", "½Iω²", "½mv² + ½Iω²", "mgh"], correct: 2, damage: 30, explanation: "Translação + rotação." },
      { prompt: "Unidade de L no SI:", options: ["kg·m/s", "kg·m²/s", "N·m", "J"], correct: 1, damage: 30, explanation: "L = I·ω tem dim kg·m² · rad/s = kg·m²/s." },
    ],
  },
];

// -------- MONTE A RESOLUÇÃO --------
export const FRAGMENT_PROBLEMS: FragmentProblem[] = [
  // Cap 1
  {
    chapterId: "01-medicao",
    prompt: "Converta 90 km/h para m/s.",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "v = 90 km/h; 1 m/s = 3,6 km/h" },
      { id: "f1", text: "v [m/s] = v [km/h] / 3,6" },
      { id: "s1", text: "v = 90 / 3,6" },
      { id: "r1", text: "v = 25 m/s" },
      { id: "fx1", text: "v [m/s] = v [km/h] · 3,6" },
      { id: "fx2", text: "v [m/s] = v [km/h] / 60" },
      { id: "rx1", text: "v = 324 m/s" },
      { id: "rx2", text: "v = 15 m/s" },
    ],
    explanation: "km/h → m/s: divida por 3,6. Multiplicar por 3,6 dá o caminho inverso.",
  },
  // Cap 2
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
      { id: "fx1", text: "Δx = v₀·t + ½·a·t²" },
      { id: "fx2", text: "v² = v₀² + 2·a·Δx" },
      { id: "rx1", text: "v = 7 m/s" },
      { id: "rx2", text: "v = 25 m/s" },
    ],
    explanation: "MRUV: v = v₀ + a·t quando o tempo é dado.",
  },
  {
    chapterId: "02-movimento-retilineo",
    prompt: "Pedra cai do repouso e cai 45 m (g = 10 m/s²). Quanto tempo leva?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "v₀ = 0; Δy = 45 m; g = 10 m/s²" },
      { id: "f1", text: "Δy = ½·g·t² ⇒ t = √(2·Δy/g)" },
      { id: "s1", text: "t = √(2·45/10) = √9" },
      { id: "r1", text: "t = 3 s" },
      { id: "fx1", text: "t = Δy / g" },
      { id: "fx2", text: "t² = Δy · g" },
      { id: "rx1", text: "t = 4,5 s" },
      { id: "rx2", text: "t = 9 s" },
    ],
    explanation: "Em queda livre do repouso: Δy = ½·g·t². Isola t com raiz.",
  },
  // Cap 3
  {
    chapterId: "03-vetores",
    prompt: "Decomponha um vetor de módulo 10 a 37° (sin ≈ 0,6; cos ≈ 0,8). Qual A_y?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "|A| = 10; θ = 37°" },
      { id: "f1", text: "A_y = A·sin θ" },
      { id: "s1", text: "A_y = 10·0,6" },
      { id: "r1", text: "A_y = 6" },
      { id: "fx1", text: "A_y = A·cos θ" },
      { id: "fx2", text: "A_y = A·tan θ" },
      { id: "rx1", text: "A_y = 8" },
      { id: "rx2", text: "A_y = 0,6" },
    ],
    explanation: "Componente vertical usa sin (lado oposto); horizontal usa cos.",
  },
  // Cap 4
  {
    chapterId: "04-movimento-2d-3d",
    prompt: "Objeto em MCU a 6 m/s, raio 2 m. Qual a aceleração centrípeta?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "v = 6 m/s; r = 2 m" },
      { id: "f1", text: "a_c = v²/r" },
      { id: "s1", text: "a_c = 36/2" },
      { id: "r1", text: "a_c = 18 m/s²" },
      { id: "fx1", text: "a_c = v/r" },
      { id: "fx2", text: "a_c = v·r" },
      { id: "rx1", text: "a_c = 3 m/s²" },
      { id: "rx2", text: "a_c = 12 m/s²" },
    ],
    explanation: "No MCU, a_c = v²/r aponta para o centro.",
  },
  // Cap 5
  {
    chapterId: "05-forca-i",
    prompt: "Força de 12 N em corpo 3 kg sem atrito. Qual a aceleração?",
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
      { id: "fx1", text: "F = m·a (não isolada)" },
      { id: "fx2", text: "a = F·m" },
      { id: "rx1", text: "a = 36 m/s²" },
      { id: "rx2", text: "a = 1/4 m/s²" },
    ],
    explanation: "Isola a aceleração antes de substituir; a = F/m, não F·m.",
  },
  // Cap 6
  {
    chapterId: "06-forca-ii",
    prompt: "Bloco 2 kg sobre piso horizontal com μ_k = 0,2 e g = 10. Atrito cinético?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "m = 2 kg; μ_k = 0,2; g = 10; piso horizontal" },
      { id: "f1", text: "f_k = μ_k·N, com N = m·g" },
      { id: "s1", text: "f_k = 0,2·(2·10)" },
      { id: "r1", text: "f_k = 4 N" },
      { id: "fx1", text: "f_k = μ_k·m" },
      { id: "fx2", text: "f_k = μ_k·g" },
      { id: "rx1", text: "f_k = 2 N" },
      { id: "rx2", text: "f_k = 20 N" },
    ],
    explanation: "No piso horizontal, N = m·g. Atrito = μ · Normal.",
  },
  // Cap 7
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
      { id: "fx1", text: "K = m·v²" },
      { id: "fx2", text: "K = ½·2·10" },
      { id: "rx1", text: "K = 200 J" },
      { id: "rx2", text: "K = 20 J" },
    ],
    explanation: "O ½ é essencial; elevar ao quadrado vem antes da multiplicação.",
  },
  // Cap 8
  {
    chapterId: "08-energia-potencial",
    prompt: "Corpo de 2 kg é solto de 5 m (g = 10). Qual a velocidade ao tocar o solo (sem atrito)?",
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
      { id: "fx1", text: "v = 2·g·h" },
      { id: "fx2", text: "v² = g·h" },
      { id: "rx1", text: "v = 100 m/s" },
      { id: "rx2", text: "v = 5 m/s" },
    ],
    explanation: "Conservação: U_g → K; isola v com raiz.",
  },
  // Cap 9
  {
    chapterId: "09-centro-massa-momento",
    prompt: "Bola de 0,2 kg bate na parede a 10 m/s e volta a 8 m/s. Qual o impulso (direção inicial positiva)?",
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
      { id: "fx1", text: "J = m·(v_i − v_f)" },
      { id: "fx2", text: "J = m·v_f" },
      { id: "rx1", text: "J = +3,6 kg·m/s" },
      { id: "rx2", text: "J = 0,4 kg·m/s" },
    ],
    explanation: "Sinais importam: volta significa v_f negativo se escolhemos a direção inicial como positiva.",
  },
  // Cap 10
  {
    chapterId: "10-rotacao",
    prompt: "Disco com I = 0,5 kg·m² sofre α = 4 rad/s². Qual o torque?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "I = 0,5 kg·m²; α = 4 rad/s²" },
      { id: "f1", text: "τ = I·α" },
      { id: "s1", text: "τ = 0,5·4" },
      { id: "r1", text: "τ = 2 N·m" },
      { id: "fx1", text: "τ = I/α" },
      { id: "fx2", text: "τ = α/I" },
      { id: "rx1", text: "τ = 8 N·m" },
      { id: "rx2", text: "τ = 0,125 N·m" },
    ],
    explanation: "Análogo rotacional de F = m·a: τ = I·α.",
  },
  // Cap 11
  {
    chapterId: "11-rolamento-torque",
    prompt: "Bola rolando sem deslizar com v_cm = 6 m/s e r = 0,3 m. Qual ω?",
    slots: [
      { label: "Dados", correctId: "d1" },
      { label: "Fórmula", correctId: "f1" },
      { label: "Substituição", correctId: "s1" },
      { label: "Resultado", correctId: "r1" },
    ],
    fragments: [
      { id: "d1", text: "v_cm = 6 m/s; r = 0,3 m; rolamento puro" },
      { id: "f1", text: "v_cm = r·ω ⇒ ω = v_cm / r" },
      { id: "s1", text: "ω = 6 / 0,3" },
      { id: "r1", text: "ω = 20 rad/s" },
      { id: "fx1", text: "ω = r·v_cm" },
      { id: "fx2", text: "ω = v_cm + r" },
      { id: "rx1", text: "ω = 1,8 rad/s" },
      { id: "rx2", text: "ω = 2 rad/s" },
    ],
    explanation: "Rolamento puro: v_cm = r·ω; isola ω com divisão.",
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
