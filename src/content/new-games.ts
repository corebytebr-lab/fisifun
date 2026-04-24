// Conteúdo dos 4 minijogos desafiadores novos.

// ───────────────────── 1) Análise Dimensional ─────────────────────
// Dada uma grandeza (velocidade, energia, etc), escolha a expressão
// dimensionalmente correta entre 3 opções.

export interface DimensionItem {
  quantity: string; // ex: "velocidade (m/s)"
  dims: string; // ex: "[L]/[T]"
  options: { expr: string; correct: boolean; note?: string }[];
  explain: string;
}

export const DIMENSION_ITEMS: DimensionItem[] = [
  {
    quantity: "velocidade [L/T]",
    dims: "[L]/[T]",
    options: [
      { expr: "v = a · t", correct: true, note: "(m/s²)(s) = m/s ✓" },
      { expr: "v = a · t²", correct: false, note: "daria m (deslocamento)" },
      { expr: "v = a / t", correct: false, note: "daria m/s³" },
    ],
    explain: "Aceleração [L/T²] vezes tempo [T] dá [L/T] = velocidade.",
  },
  {
    quantity: "energia [M·L²/T²]",
    dims: "[M][L²]/[T²]",
    options: [
      { expr: "E = m · v²", correct: false, note: "falta o ½ mas dimensão bate — porém a opção oficial é a de baixo" },
      { expr: "E = ½ m v²", correct: true, note: "(kg)(m/s)² = kg·m²/s² = J ✓" },
      { expr: "E = m · v", correct: false, note: "daria kg·m/s (momentum)" },
    ],
    explain: "Energia cinética: ½·m·v². Dimensão M·L²/T² = joule.",
  },
  {
    quantity: "força [M·L/T²]",
    dims: "[M][L]/[T²]",
    options: [
      { expr: "F = m · v", correct: false, note: "kg·m/s = momentum, não força" },
      { expr: "F = m · a", correct: true, note: "kg · m/s² = N ✓" },
      { expr: "F = m · a²", correct: false, note: "kg·m²/s⁴, não é força" },
    ],
    explain: "2ª lei: F = m·a. Dimensão M·L/T² = N.",
  },
  {
    quantity: "pressão [M/(L·T²)]",
    dims: "[M]/([L][T²])",
    options: [
      { expr: "P = F · A", correct: false, note: "N·m² não é Pa" },
      { expr: "P = F / A", correct: true, note: "N/m² = Pa ✓" },
      { expr: "P = F / A²", correct: false, note: "N/m⁴" },
    ],
    explain: "Pressão é força por área. P = F/A → N/m² = Pa.",
  },
  {
    quantity: "trabalho [M·L²/T²]",
    dims: "[M][L²]/[T²]",
    options: [
      { expr: "W = F · d", correct: true, note: "N·m = J ✓" },
      { expr: "W = F / d", correct: false, note: "N/m" },
      { expr: "W = F · v", correct: false, note: "N·m/s = Watt (potência)" },
    ],
    explain: "Trabalho = força × deslocamento. N·m = J. F·v seria potência.",
  },
  {
    quantity: "potência [M·L²/T³]",
    dims: "[M][L²]/[T³]",
    options: [
      { expr: "P = F · v", correct: true, note: "N·m/s = J/s = W ✓" },
      { expr: "P = F · d", correct: false, note: "N·m = J (trabalho)" },
      { expr: "P = F / t", correct: false, note: "N/s" },
    ],
    explain: "Potência: trabalho por tempo. P = F·v = W/s = Watt.",
  },
  {
    quantity: "período [T]",
    dims: "[T]",
    options: [
      { expr: "T = 2π√(L/g)", correct: true, note: "√(m·s²/m) = √(s²) = s ✓ — pêndulo simples" },
      { expr: "T = 2π·L·g", correct: false, note: "m²/s² — não é tempo" },
      { expr: "T = 2π/(L·g)", correct: false, note: "1/(m²/s²) — não é tempo" },
    ],
    explain: "Pêndulo simples: T = 2π√(L/g). Checar: √(m/(m/s²)) = √(s²) = s.",
  },
  {
    quantity: "aceleração centrípeta [L/T²]",
    dims: "[L]/[T²]",
    options: [
      { expr: "a = v/r", correct: false, note: "(m/s)/m = 1/s — não é aceleração" },
      { expr: "a = v²/r", correct: true, note: "(m²/s²)/m = m/s² ✓" },
      { expr: "a = v·r", correct: false, note: "m²/s" },
    ],
    explain: "a_c = v²/r aponta para o centro do círculo. Dimensão confere.",
  },
  {
    quantity: "momento de inércia [M·L²]",
    dims: "[M][L²]",
    options: [
      { expr: "I = m · r", correct: false, note: "kg·m" },
      { expr: "I = m · r²", correct: true, note: "kg·m² ✓" },
      { expr: "I = m · v²", correct: false, note: "kg·(m/s)² = J (energia)" },
    ],
    explain: "Momento de inércia de uma massa pontual: I = mr².",
  },
  {
    quantity: "torque [M·L²/T²]",
    dims: "[M][L²]/[T²]",
    options: [
      { expr: "τ = F · r", correct: true, note: "N·m ✓ (mesma dim. de energia, mas vetor distinto)" },
      { expr: "τ = F / r", correct: false, note: "N/m" },
      { expr: "τ = I · ω", correct: false, note: "kg·m²/s = momento angular (L)" },
    ],
    explain: "Torque é r × F. Dimensão N·m. (Diferente de L = I·ω dim. M·L²/T.)",
  },
  {
    quantity: "momento linear [M·L/T]",
    dims: "[M][L]/[T]",
    options: [
      { expr: "p = m · v", correct: true, note: "kg·m/s ✓" },
      { expr: "p = m · v²", correct: false, note: "J (energia)" },
      { expr: "p = F · t", correct: true, note: "também é correto: N·s = kg·m/s ✓ (impulso)" },
    ],
    explain: "p = m·v. Impulso J = F·Δt também tem dim. de p (teorema do impulso).",
  },
  {
    quantity: "frequência angular [1/T]",
    dims: "1/[T]",
    options: [
      { expr: "ω = 2π · f", correct: true, note: "1/s = rad/s ✓" },
      { expr: "ω = 2π · T", correct: false, note: "s — não é 1/s" },
      { expr: "ω = 2π · v", correct: false, note: "m/s" },
    ],
    explain: "ω = 2π·f = 2π/T. Unidade rad/s = 1/s.",
  },
];

// ───────────────────── 2) Corrida de Conversão ─────────────────────
// Valor aparece em unidade não-SI → usuário digita equivalente em SI.
// Tolerância 1% (±).

export interface ConversionItem {
  prompt: string; // "72 km/h"
  siValue: number; // 20
  siUnit: string; // "m/s"
  hint?: string;
}

export const CONVERSION_ITEMS: ConversionItem[] = [
  { prompt: "72 km/h → m/s", siValue: 20, siUnit: "m/s", hint: "÷ 3,6" },
  { prompt: "108 km/h → m/s", siValue: 30, siUnit: "m/s", hint: "÷ 3,6" },
  { prompt: "36 km/h → m/s", siValue: 10, siUnit: "m/s", hint: "÷ 3,6" },
  { prompt: "90 km/h → m/s", siValue: 25, siUnit: "m/s", hint: "÷ 3,6" },
  { prompt: "54 km/h → m/s", siValue: 15, siUnit: "m/s", hint: "÷ 3,6" },
  { prompt: "1500 g → kg", siValue: 1.5, siUnit: "kg", hint: "÷ 1000" },
  { prompt: "250 g → kg", siValue: 0.25, siUnit: "kg", hint: "÷ 1000" },
  { prompt: "2500 mg → kg", siValue: 0.0025, siUnit: "kg", hint: "÷ 1 000 000" },
  { prompt: "5 min → s", siValue: 300, siUnit: "s", hint: "× 60" },
  { prompt: "2 h → s", siValue: 7200, siUnit: "s", hint: "× 3600" },
  { prompt: "1 dia → s", siValue: 86400, siUnit: "s" },
  { prompt: "3 kN → N", siValue: 3000, siUnit: "N", hint: "× 1000" },
  { prompt: "500 mN → N", siValue: 0.5, siUnit: "N", hint: "÷ 1000" },
  { prompt: "2 MPa → Pa", siValue: 2_000_000, siUnit: "Pa", hint: "× 1 000 000" },
  { prompt: "1 atm → Pa", siValue: 101325, siUnit: "Pa", hint: "≈ 101 325" },
  { prompt: "500 kPa → Pa", siValue: 500_000, siUnit: "Pa" },
  { prompt: "25 cm → m", siValue: 0.25, siUnit: "m", hint: "÷ 100" },
  { prompt: "450 mm → m", siValue: 0.45, siUnit: "m", hint: "÷ 1000" },
  { prompt: "2 km → m", siValue: 2000, siUnit: "m", hint: "× 1000" },
  { prompt: "3 L → m³", siValue: 0.003, siUnit: "m³", hint: "1 L = 1 dm³ = 10⁻³ m³" },
  { prompt: "500 mL → m³", siValue: 0.0005, siUnit: "m³" },
  { prompt: "1 kWh → J", siValue: 3_600_000, siUnit: "J", hint: "1 kW·h = 3,6 MJ" },
  { prompt: "100 cal → J (1 cal=4,18 J)", siValue: 418, siUnit: "J", hint: "× 4,18" },
  { prompt: "2 rev → rad", siValue: 12.566, siUnit: "rad", hint: "× 2π" },
  { prompt: "180° → rad", siValue: 3.14159, siUnit: "rad", hint: "= π" },
  { prompt: "60° → rad", siValue: 1.0472, siUnit: "rad", hint: "= π/3" },
  { prompt: "300 rpm → rad/s", siValue: 31.416, siUnit: "rad/s", hint: "(rpm · 2π) / 60" },
  { prompt: "10 g/cm³ → kg/m³", siValue: 10000, siUnit: "kg/m³", hint: "× 1000" },
  { prompt: "1,2 ton → kg", siValue: 1200, siUnit: "kg", hint: "× 1000" },
  { prompt: "80 µm → m", siValue: 0.00008, siUnit: "m", hint: "× 10⁻⁶" },
];

// ───────────────────── 3) Diagrama de Corpo Livre (DCL) ─────────────────────
// Cenário 2D. Lista de forças candidatas. Usuário marca as corretas.
// Forças padrão: "Peso (P)", "Normal (N)", "Tensão (T)", "Atrito (fₐ)",
// "Força aplicada (F)", "Empuxo (E)", "Centrípeta (F_c)"

export interface DCLScenario {
  id: string;
  title: string;
  description: string;
  // Lista de TODAS as forças disponíveis como opções (15 típicas)
  forces: string[];
  // Conjunto correto (subconjunto de forces)
  correct: string[];
  explain: string;
}

const ALL_FORCES = [
  "Peso (P)",
  "Normal (N)",
  "Tensão (T)",
  "Atrito estático (fₑ)",
  "Atrito cinético (fc)",
  "Força aplicada (F)",
  "Empuxo (E)",
  "Centrípeta (Fc)",
  "Resistência do ar",
  "Força elástica (Fel)",
  "Reação do apoio",
  "Tração extra",
];

export const DCL_SCENARIOS: DCLScenario[] = [
  {
    id: "bloco-plano-horizontal-parado",
    title: "Bloco parado em mesa horizontal",
    description: "Um bloco de 2 kg repousa sobre uma mesa horizontal. Nada empurra.",
    forces: ALL_FORCES,
    correct: ["Peso (P)", "Normal (N)"],
    explain: "Só peso (pra baixo) e normal (pra cima). Não há empurrão, então nem atrito nem força aplicada aparecem.",
  },
  {
    id: "bloco-puxado-com-atrito",
    title: "Bloco puxado na horizontal (com atrito)",
    description: "Um bloco em movimento é puxado por uma corda horizontal. O piso tem atrito.",
    forces: ALL_FORCES,
    correct: ["Peso (P)", "Normal (N)", "Tensão (T)", "Atrito cinético (fc)"],
    explain: "Peso ⬇, Normal ⬆, Tensão puxando, e atrito cinético se opondo ao movimento.",
  },
  {
    id: "pendulo-simples",
    title: "Pêndulo simples (no meio da oscilação)",
    description: "Massa presa por fio, balançando no ar sem atrito com o ar.",
    forces: ALL_FORCES,
    correct: ["Peso (P)", "Tensão (T)"],
    explain: "Só peso e tensão. A resultante radial é a centrípeta (componente de T − componente de P), mas ela não é 'nova' — é consequência dessas duas.",
  },
  {
    id: "bloco-plano-inclinado-atrito",
    title: "Bloco descendo plano inclinado (com atrito)",
    description: "Bloco deslizando para baixo num plano inclinado rugoso.",
    forces: ALL_FORCES,
    correct: ["Peso (P)", "Normal (N)", "Atrito cinético (fc)"],
    explain: "Peso ⬇, Normal ⊥ ao plano, e atrito cinético apontando pra cima do plano (oposto ao movimento).",
  },
  {
    id: "objeto-flutuando-agua",
    title: "Objeto flutuando em equilíbrio na água",
    description: "Cubo de isopor parado na superfície da água.",
    forces: ALL_FORCES,
    correct: ["Peso (P)", "Empuxo (E)"],
    explain: "Peso ⬇ e Empuxo ⬆. Em equilíbrio, |E| = |P|.",
  },
  {
    id: "carro-curva-horizontal",
    title: "Carro fazendo curva horizontal",
    description: "Carro em velocidade constante fazendo curva (pista horizontal, sem banqueta).",
    forces: ALL_FORCES,
    correct: ["Peso (P)", "Normal (N)", "Atrito estático (fₑ)"],
    explain: "Atrito estático entre pneu e pista fornece a centrípeta. Não se adiciona 'força centrípeta' separada — ela É o atrito.",
  },
  {
    id: "mola-comprimida",
    title: "Bloco encostado em mola comprimida (parado)",
    description: "Bloco horizontal parado com uma mola comprimida empurrando (sem atrito).",
    forces: ALL_FORCES,
    correct: ["Peso (P)", "Normal (N)", "Força elástica (Fel)"],
    explain: "Sem atrito: Peso, Normal e Força elástica horizontal da mola.",
  },
  {
    id: "paraquedista-terminal",
    title: "Paraquedista em velocidade terminal",
    description: "Paraquedista caindo com velocidade terminal constante.",
    forces: ALL_FORCES,
    correct: ["Peso (P)", "Resistência do ar"],
    explain: "Em velocidade terminal, resistência do ar = peso (em módulo). Aceleração = 0.",
  },
];

// ───────────────────── 4) Escape Room Físico ─────────────────────
// 3 salas sequenciais, cada uma pede um número como resposta.
// Cada sala usa conceito de um capítulo; tolerância 2%.

export interface EscapeRoom {
  id: string;
  title: string;
  intro: string;
  rooms: {
    title: string;
    puzzle: string;
    answer: number;
    tolerance: number; // em %
    unit: string;
    hint?: string;
    explain: string;
  }[];
}

export const ESCAPE_ROOMS: EscapeRoom[] = [
  {
    id: "queda-e-energia",
    title: "Torre da Queda",
    intro: "Você está trancado no topo de uma torre. 3 cadeados pedem números. Use física pra sair.",
    rooms: [
      {
        title: "Sala 1 — Relógio da Queda",
        puzzle: "Uma bola é solta do topo da torre. Cai por 3,0 s (g = 10 m/s²). Qual a altura da torre em metros?",
        answer: 45,
        tolerance: 2,
        unit: "m",
        hint: "h = ½·g·t²",
        explain: "h = ½·10·3² = 45 m. Cadeado abre com 45.",
      },
      {
        title: "Sala 2 — Batida no Chão",
        puzzle: "Com qual velocidade a bola chegou ao chão? (em m/s)",
        answer: 30,
        tolerance: 2,
        unit: "m/s",
        hint: "v = g·t",
        explain: "v = 10·3 = 30 m/s.",
      },
      {
        title: "Sala 3 — Energia ao Chegar",
        puzzle: "Se a bola tem 2 kg, qual a energia cinética no instante da batida? (em J)",
        answer: 900,
        tolerance: 2,
        unit: "J",
        hint: "K = ½·m·v²",
        explain: "K = ½·2·30² = 900 J. Saída liberada!",
      },
    ],
  },
  {
    id: "plano-inclinado",
    title: "Rampa do Laboratório",
    intro: "Caixa trancada em cima de uma rampa. Use os dados do local pra decifrar 3 códigos.",
    rooms: [
      {
        title: "Sala 1 — Componente do Peso",
        puzzle: "Um bloco de 5 kg está numa rampa de 30°. Qual a componente do peso paralela à rampa em Newtons? (g = 10)",
        answer: 25,
        tolerance: 3,
        unit: "N",
        hint: "m·g·sen(θ)",
        explain: "P∥ = 5·10·sen30° = 25 N.",
      },
      {
        title: "Sala 2 — Normal",
        puzzle: "Qual o módulo da Normal nesse bloco?",
        answer: 43.3,
        tolerance: 3,
        unit: "N",
        hint: "m·g·cos(θ)",
        explain: "N = 5·10·cos30° ≈ 43,3 N.",
      },
      {
        title: "Sala 3 — Aceleração (sem atrito)",
        puzzle: "Sem atrito, qual a aceleração de descida em m/s²?",
        answer: 5,
        tolerance: 3,
        unit: "m/s²",
        hint: "a = g·sen(θ)",
        explain: "a = 10·sen30° = 5 m/s². Laboratório aberto.",
      },
    ],
  },
  {
    id: "colisoes-conservacao",
    title: "Arcade Quebrado",
    intro: "Os vagões de um trenzinho descontrolado colidiram. Resolva as 3 etapas pra parar o sistema.",
    rooms: [
      {
        title: "Sala 1 — Momento Antes",
        puzzle: "Vagão A de 2 kg a 5 m/s colide com vagão B de 3 kg parado. Qual o momento total antes da colisão? (kg·m/s)",
        answer: 10,
        tolerance: 2,
        unit: "kg·m/s",
        hint: "p = mₐ·vₐ + m_b·v_b",
        explain: "p = 2·5 + 3·0 = 10 kg·m/s.",
      },
      {
        title: "Sala 2 — Velocidade Após (Colisão Perfeitamente Inelástica)",
        puzzle: "Se grudarem após a batida, qual a velocidade comum em m/s?",
        answer: 2,
        tolerance: 3,
        unit: "m/s",
        hint: "v' = p_total / (mₐ + m_b)",
        explain: "v' = 10/(2+3) = 2 m/s.",
      },
      {
        title: "Sala 3 — Energia Perdida",
        puzzle: "Quanta energia cinética foi perdida na colisão? (em J)",
        answer: 15,
        tolerance: 3,
        unit: "J",
        hint: "ΔK = K_i − K_f",
        explain: "K_i = ½·2·25 + 0 = 25 J; K_f = ½·5·4 = 10 J; ΔK = 15 J perdidos.",
      },
    ],
  },
];
