import { chapter, lesson, mkMc, mkTf, mkNum, mkFill } from "../helpers";

export const cap03q = chapter({
  id: "q03-estequiometria",
  number: 3,
  subject: "quimica",
  title: "Estequiometria",
  subtitle: "Mol, massa molar, balanceamento e cálculos de reação",
  color: "#3b82f6",
  emoji: "⚖️",
  objectives: [
    "Aplicar o conceito de mol e Nₐ.",
    "Calcular massa molar e converter mol↔g↔partículas.",
    "Balancear equações químicas.",
    "Identificar reagente limitante e calcular rendimento.",
  ],
  keyConcepts: [
    "1 mol = 6,022 × 10²³ entidades (Nₐ)",
    "Massa molar M (g/mol) = soma das massas atômicas",
    "Lei da conservação da massa de Lavoisier",
    "Reagente limitante e em excesso",
    "Rendimento real, teórico e percentual",
    "% composição em massa",
  ],
  commonMistakes: [
    "Esquecer de balancear antes de aplicar proporção.",
    "Tratar reagente em excesso como limitante.",
    "Misturar gramas e mols no cálculo estequiométrico.",
  ],
  units: ["mol", "g/mol", "u", "Nₐ = 6,022·10²³"],
  formulas: [
    {
      id: "q-mol",
      name: "Mol e número de partículas",
      latex: "n = \\dfrac{N}{N_A} = \\dfrac{m}{M}",
      description: "Conexão entre quantidade de matéria, massa e nº de partículas.",
      variables: [
        { symbol: "n", meaning: "mols", unit: "mol" },
        { symbol: "N", meaning: "partículas", unit: "-" },
        { symbol: "N_A", meaning: "constante de Avogadro", unit: "6,022·10²³" },
        { symbol: "m", meaning: "massa", unit: "g" },
        { symbol: "M", meaning: "massa molar", unit: "g/mol" },
      ],
      whenToUse: "Sempre que precisar transitar entre mols, massa e partículas.",
      example: "44 g de CO₂ (M=44) = 1 mol = 6,022·10²³ moléculas.",
    },
    {
      id: "q-rendimento",
      name: "Rendimento percentual",
      latex: "\\eta\\% = \\dfrac{m_{real}}{m_{teorico}} \\times 100",
      description: "Eficiência da reação.",
      variables: [
        { symbol: "m_{real}", meaning: "massa obtida", unit: "g" },
        { symbol: "m_{teorico}", meaning: "massa esperada", unit: "g" },
      ],
      whenToUse: "Avaliar eficiência prática.",
    },
  ],
  lessons: [
    lesson("q3-l1", "Mol e massa molar", "concept", 12, 5, {
      concepts: [
        {
          title: "O conceito de mol",
          body:
            "1 **mol** é exatamente **6,022 × 10²³** entidades. É só uma 'dúzia gigante'.\n\n" +
            "**Massa molar (M)** = massa em gramas de 1 mol. Para um elemento, é o número de massa em g/mol.\n" +
            "Para um composto, soma-se as massas dos átomos: H₂O = 2·1 + 16 = 18 g/mol.",
        },
        {
          title: "Conversões essenciais",
          body:
            "**massa → mol**: divide por M.\n" +
            "**mol → partículas**: multiplica por Nₐ.\n" +
            "**massa → partículas**: massa → mol → partículas (em 2 passos).",
        },
      ],
    }),
    lesson("q3-l2", "Balanceamento e estequiometria", "example", 14, 6, {
      concepts: [
        {
          title: "Como balancear",
          body:
            "Conserve **átomos de cada elemento** (e cargas, em iônicas). Use **coeficientes** apenas (nunca mude subscritos).\n\n" +
            "Ex: combustão do metano:\n" +
            "CH₄ + O₂ → CO₂ + H₂O ⇒ **CH₄ + 2 O₂ → CO₂ + 2 H₂O**.",
        },
        {
          title: "Reagente limitante",
          body:
            "Calcule mols de **cada** reagente e divida pelo coeficiente. O **menor** é o limitante; o produto sai dele.",
        },
      ],
      exercises: [
        mkNum(
          "q3-l2-e1",
          "Quantos gramas de CO₂ (M=44) há em 0,5 mol?",
          22,
          0.5,
          "m = n·M = 0,5·44 = 22 g.",
          { difficulty: 1 },
        ),
        mkNum(
          "q3-l2-e2",
          "Balanceie: aFe + bO₂ → cFe₂O₃. Some a+b+c.",
          9,
          0.5,
          "4 Fe + 3 O₂ → 2 Fe₂O₃ ⇒ 4+3+2 = 9.",
          { difficulty: 2 },
        ),
        mkMc(
          "q3-l2-e3",
          "2 H₂ + O₂ → 2 H₂O. A partir de 4 mol H₂ e 1 mol O₂, qual o limitante?",
          ["H₂", "O₂", "Os dois", "Nenhum"],
          1,
          "H₂/2 = 2; O₂/1 = 1 → menor é O₂.",
          { difficulty: 2 },
        ),
        mkNum(
          "q3-l2-e4",
          "Massa molar de Ca(OH)₂. Use Ca=40, O=16, H=1.",
          74,
          0.5,
          "40 + 2·(16+1) = 74 g/mol.",
          { difficulty: 1 },
        ),
        mkTf(
          "q3-l2-e5",
          "Em uma reação balanceada, a massa total dos reagentes = massa dos produtos.",
          true,
          "Lei de Lavoisier.",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("q3-l3", "Quiz — Estequiometria", "quiz", 18, 8, {
      exercises: [
        mkNum(
          "q3-l3-e1",
          "Em 18 g de água há quantos mols?",
          1,
          0.05,
          "18/18 = 1 mol.",
          { difficulty: 1 },
        ),
        mkNum(
          "q3-l3-e2",
          "Em 1 mol de glicose (C₆H₁₂O₆, M=180), quantos átomos de oxigênio? (em 10²³)",
          36.13,
          0.5,
          "6·Nₐ = 6·6,022·10²³ ≈ 3,613·10²⁴ = 36,13 × 10²³.",
          { difficulty: 3 },
        ),
        mkFill(
          "q3-l3-e3",
          "A massa molar do CO₂ é ___ g/mol (use C=12 e O=16).",
          ["44"],
          "12 + 2·16 = 44.",
          { difficulty: 1 },
        ),
        mkNum(
          "q3-l3-e4",
          "Rendimento real 4,5 g; teórico 6,0 g. η% = ?",
          75,
          0.5,
          "4,5/6,0 × 100 = 75 %.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});
