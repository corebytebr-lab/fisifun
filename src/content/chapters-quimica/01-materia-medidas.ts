import { chapter, lesson, mkMc, mkTf, mkNum, mkNumU } from "../helpers";

export const cap01q = chapter({
  id: "q01-materia-medidas",
  number: 1,
  subject: "quimica",
  title: "Introdução: Matéria e Medidas",
  subtitle: "Estados, classificação, propriedades, unidades e algarismos significativos",
  color: "#10b981",
  emoji: "🧪",
  objectives: [
    "Classificar a matéria em substância pura, mistura homogênea/heterogênea, elemento e composto.",
    "Diferenciar propriedade física de química, intensiva de extensiva.",
    "Aplicar SI, fatores de conversão e algarismos significativos.",
    "Calcular densidade.",
  ],
  keyConcepts: [
    "Matéria, energia e estados (sólido, líquido, gasoso, plasma)",
    "Substância pura vs mistura; elemento vs composto",
    "Propriedade física (densidade, ponto de fusão) vs propriedade química (combustível)",
    "Unidades SI; prefixos; notação científica",
    "Algarismos significativos e propagação de incertezas",
    "Densidade ρ = m/V",
  ],
  commonMistakes: [
    "Esquecer de zero como significativo entre dígitos não-nulos.",
    "Misturar grama com quilograma na fórmula da densidade.",
    "Confundir mistura homogênea (uniforme) com substância pura.",
  ],
  units: ["kg", "m", "s", "K", "mol", "g/cm³", "g/mol"],
  formulas: [
    {
      id: "q-densidade",
      name: "Densidade",
      latex: "\\rho = \\dfrac{m}{V}",
      description: "Razão entre massa e volume.",
      variables: [
        { symbol: "\\rho", meaning: "densidade", unit: "g/cm³ ou kg/m³" },
        { symbol: "m", meaning: "massa", unit: "g ou kg" },
        { symbol: "V", meaning: "volume", unit: "cm³, mL ou m³" },
      ],
      whenToUse: "Para identificar substâncias ou converter massa↔volume.",
      example: "10 g de Hg em 0,737 cm³ → ρ = 10/0,737 = 13,6 g/cm³.",
    },
    {
      id: "q-conversao-temperatura",
      name: "Conversão de temperatura",
      latex: "T_K = T_C + 273,15;\\quad T_F = \\tfrac{9}{5}T_C + 32",
      description: "Relacionar Kelvin, Celsius e Fahrenheit.",
      variables: [
        { symbol: "T_K", meaning: "Kelvin", unit: "K" },
        { symbol: "T_C", meaning: "Celsius", unit: "°C" },
        { symbol: "T_F", meaning: "Fahrenheit", unit: "°F" },
      ],
      whenToUse: "Sempre que comparar temperaturas em escalas diferentes.",
    },
  ],
  lessons: [
    lesson("q1-l1", "Matéria e seus estados", "concept", 12, 5, {
      concepts: [
        {
          title: "O que é matéria",
          body:
            "**Matéria** é tudo que tem massa e ocupa volume. Pode estar nos estados **sólido**, **líquido**, **gasoso** ou **plasma**.\n\n" +
            "Estados se diferenciam por **espaçamento e mobilidade** das partículas:\n" +
            "- Sólido: partículas próximas e ordenadas\n" +
            "- Líquido: próximas mas móveis\n" +
            "- Gás: bem afastadas, livres",
        },
        {
          title: "Substância vs mistura",
          body:
            "**Substância pura** tem composição fixa (água, ouro). Pode ser **elemento** (Au, O₂) ou **composto** (H₂O, NaCl).\n\n" +
            "**Mistura** = duas ou mais substâncias com composição variável:\n" +
            "- **Homogênea** (solução): aspecto único — ar, salmoura\n" +
            "- **Heterogênea**: fases visíveis — granito, óleo+água",
        },
      ],
    }),
    lesson("q1-l2", "Propriedades e unidades", "example", 12, 5, {
      concepts: [
        {
          title: "Propriedades físicas vs químicas",
          body:
            "**Física**: medida sem alterar identidade (cor, ρ, ponto fusão).\n" +
            "**Química**: requer reação (combustível, oxidação).\n\n" +
            "**Intensivas** (independem da quantidade): T, ρ.\n" +
            "**Extensivas** (dependem): m, V, energia total.",
        },
        {
          title: "Algarismos significativos",
          body:
            "- Zeros entre dígitos contam (1**0**5 = 3 sig).\n" +
            "- Zeros à direita após vírgula contam (12,**00** = 4 sig).\n" +
            "- Zeros à esquerda **não** contam (0,007 = 1 sig).\n\n" +
            "Em **multiplicação/divisão**: o resultado tem o nº de sig do **menor** operando.\n" +
            "Em **soma/subtração**: o resultado mantém a **menor casa decimal**.",
        },
      ],
      exercises: [
        mkMc(
          "q1-l2-e1",
          "Quantos algarismos significativos tem 0,003020?",
          ["2", "3", "4", "5"],
          2,
          "Os zeros à esquerda não contam; o zero entre 2 e 0 conta; o zero final após vírgula conta. Total: 4.",
          { difficulty: 2 },
        ),
        mkNum(
          "q1-l2-e2",
          "Converta 25 °C para Kelvin.",
          298.15,
          0.05,
          "T_K = 25 + 273,15.",
          { difficulty: 1 },
        ),
        mkMc(
          "q1-l2-e3",
          "Qual é uma propriedade intensiva?",
          ["Massa", "Volume", "Densidade", "Energia interna"],
          2,
          "Densidade não depende da quantidade.",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("q1-l3", "Densidade — aplicando", "practice", 12, 5, {
      exercises: [
        mkNumU(
          "q1-l3-e1",
          "Massa de 50,0 g e volume de 18,5 mL → densidade?",
          2.7,
          0.05,
          "g/mL",
          ["g/mL", "g/L", "kg/m³"],
          "ρ = 50/18,5 ≈ 2,70 g/mL (alumínio).",
          { difficulty: 1 },
        ),
        mkNum(
          "q1-l3-e2",
          "Volume (em mL) de 27,2 g de mercúrio (ρ = 13,6 g/mL).",
          2,
          0.05,
          "V = m/ρ = 27,2/13,6 = 2,00 mL.",
          { difficulty: 2 },
        ),
        mkTf(
          "q1-l3-e3",
          "A densidade do gelo (0,92 g/mL) é maior que a da água líquida.",
          false,
          "Falso: o gelo é menos denso (por isso flutua).",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("q1-l4", "Quiz — Matéria e medidas", "quiz", 18, 8, {
      exercises: [
        mkMc(
          "q1-l4-e1",
          "Granito é classificado como:",
          ["Substância pura", "Composto", "Mistura homogênea", "Mistura heterogênea"],
          3,
          "Granito tem grãos visíveis (quartzo, feldspato, mica).",
          { difficulty: 1 },
        ),
        mkMc(
          "q1-l4-e2",
          "0,0078 m em mm é:",
          ["0,78 mm", "7,8 mm", "78 mm", "780 mm"],
          1,
          "0,0078 m × 1000 = 7,8 mm.",
          { difficulty: 1 },
        ),
        mkNum(
          "q1-l4-e3",
          "(2,3 × 10⁴) × (1,5 × 10⁻²) = ? (em notação científica, mantissa com 2 sig)",
          345,
          1,
          "2,3 × 1,5 = 3,45; 10⁴⁻² = 10². Resultado: 3,4 × 10² = 340.",
          { difficulty: 2 },
        ),
        mkMc(
          "q1-l4-e4",
          "Qual NÃO é unidade SI fundamental?",
          ["mol", "K", "litro", "candela"],
          2,
          "Litro é derivada de m³ (1 L = 0,001 m³).",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});
