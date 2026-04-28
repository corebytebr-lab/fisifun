import { chapter, lesson, mkMc, mkTf, mkNum, mkFill } from "../helpers";

export const cap02q = chapter({
  id: "q02-atomos-moleculas-ions",
  number: 2,
  subject: "quimica",
  title: "Átomos, Moléculas e Íons",
  subtitle: "Estrutura atômica, isótopos, íons e nomenclatura",
  color: "#06b6d4",
  emoji: "⚛️",
  objectives: [
    "Reconhecer prótons, nêutrons e elétrons e calcular Z, A.",
    "Distinguir isótopos e calcular massa atômica média.",
    "Nomear cátions, ânions e compostos iônicos simples.",
    "Identificar moléculas, íons poliatômicos e fórmulas.",
  ],
  keyConcepts: [
    "Modelo atômico de Dalton, Thomson, Rutherford, Bohr",
    "Z (próton), A (massa = p+n), elétrons",
    "Isótopos: mesmo Z, A diferente",
    "Massa atômica = média ponderada dos isótopos",
    "Cátion (+) perde e⁻; ânion (−) ganha e⁻",
    "Íons poliatômicos: NO₃⁻, SO₄²⁻, NH₄⁺, OH⁻, CO₃²⁻, PO₄³⁻",
  ],
  commonMistakes: [
    "Confundir A (massa) com Z (número atômico).",
    "Esquecer que isótopos têm propriedades químicas iguais.",
    "Trocar cátion com ânion na nomenclatura.",
  ],
  units: ["u (uma)", "g/mol", "carga elementar e"],
  formulas: [
    {
      id: "q-massa-media",
      name: "Massa atômica média",
      latex: "\\bar{A} = \\sum f_i A_i",
      description: "Média ponderada das massas isotópicas pelas abundâncias.",
      variables: [
        { symbol: "f_i", meaning: "fração de cada isótopo", unit: "-" },
        { symbol: "A_i", meaning: "massa do isótopo i", unit: "u" },
      ],
      whenToUse: "Para calcular massa atômica do elemento natural.",
      example: "Cl: 0,7577·35 + 0,2423·37 = 35,45 u.",
    },
  ],
  lessons: [
    lesson("q2-l1", "Estrutura do átomo", "concept", 12, 5, {
      concepts: [
        {
          title: "Partículas subatômicas",
          body:
            "- **Próton (p⁺)**: carga +1, massa ≈ 1 u, no núcleo\n" +
            "- **Nêutron (n)**: carga 0, massa ≈ 1 u, no núcleo\n" +
            "- **Elétron (e⁻)**: carga −1, massa ≈ 1/1836 u, na eletrosfera\n\n" +
            "**Z** = número atômico = nº de prótons (define o elemento).\n" +
            "**A** = nº de massa = p + n.",
        },
        {
          title: "Isótopos",
          body:
            "Mesmo Z, A diferente. Ex: ¹²C (6p, 6n), ¹³C (6p, 7n), ¹⁴C (6p, 8n).\n\n" +
            "Reagem **igual** (mesma química), mas têm propriedades nucleares diferentes (¹⁴C é radioativo).",
        },
      ],
    }),
    lesson("q2-l2", "Íons e nomenclatura iônica", "example", 12, 5, {
      concepts: [
        {
          title: "Cátions e ânions",
          body:
            "Metais geralmente perdem elétrons → **cátions**: Na⁺, Mg²⁺, Al³⁺.\n" +
            "Não-metais geralmente ganham → **ânions**: Cl⁻, O²⁻, N³⁻.\n\n" +
            "Compostos iônicos: a fórmula é o **menor inteiro** que neutraliza as cargas.\n" +
            "Ex: Al³⁺ + O²⁻ → Al₂O₃ (2·(+3) + 3·(−2) = 0).",
        },
        {
          title: "Nomenclatura de íons poliatômicos comuns",
          body:
            "- Amônio: NH₄⁺\n- Hidróxido: OH⁻\n- Nitrato: NO₃⁻ (e nitrito NO₂⁻)\n" +
            "- Sulfato: SO₄²⁻ (e sulfito SO₃²⁻)\n- Carbonato: CO₃²⁻\n- Fosfato: PO₄³⁻\n" +
            "- Acetato: CH₃COO⁻ (ou C₂H₃O₂⁻)",
        },
      ],
      exercises: [
        mkMc(
          "q2-l2-e1",
          "Fórmula do composto iônico formado por Ca²⁺ e PO₄³⁻:",
          ["CaPO₄", "Ca₂PO₄", "Ca₃(PO₄)₂", "Ca(PO₄)₃"],
          2,
          "Para neutralizar: 3·(+2) + 2·(−3) = 0 → Ca₃(PO₄)₂.",
          { difficulty: 2 },
        ),
        mkFill(
          "q2-l2-e2",
          "O ânion sulfato tem fórmula ___.",
          ["SO4 2-", "SO₄²⁻", "SO4^2-"],
          "SO₄²⁻ é um íon poliatômico clássico.",
          { difficulty: 1 },
        ),
        mkTf(
          "q2-l2-e3",
          "Cl⁻ tem 18 elétrons.",
          true,
          "Cl tem Z=17; ao ganhar 1 e⁻, fica com 18 elétrons (configuração de Ar).",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("q2-l3", "Massa atômica e quantidade", "practice", 14, 6, {
      exercises: [
        mkNum(
          "q2-l3-e1",
          "Cl tem dois isótopos: ³⁵Cl (75,77%) e ³⁷Cl (24,23%). Massa média = ?",
          35.48,
          0.05,
          "0,7577·35 + 0,2423·37 = 35,48 u.",
          { difficulty: 2 },
        ),
        mkMc(
          "q2-l3-e2",
          "Quantos prótons, nêutrons e elétrons tem ³¹P³⁻?",
          ["15p, 16n, 12e⁻", "15p, 16n, 18e⁻", "16p, 15n, 18e⁻", "31p, 0n, 28e⁻"],
          1,
          "Z=15 → 15p; A=31 → 16n; carga 3− → 15+3 = 18 e⁻.",
          { difficulty: 2 },
        ),
        mkTf(
          "q2-l3-e4",
          "Dois isótopos do mesmo elemento têm propriedades químicas idênticas.",
          true,
          "Sim — mesma estrutura eletrônica.",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("q2-l4", "Quiz — Átomos e Íons", "quiz", 18, 8, {
      exercises: [
        mkMc(
          "q2-l4-e1",
          "O que define o elemento químico?",
          ["A (nº de massa)", "Z (nº atômico)", "Número de elétrons", "Número de nêutrons"],
          1,
          "Z é a identidade do elemento.",
          { difficulty: 1 },
        ),
        mkMc(
          "q2-l4-e2",
          "Qual é a fórmula do nitrato de amônio?",
          ["NH₄NO₂", "NH₄NO₃", "(NH₄)₂NO₃", "NH₃NO₃"],
          1,
          "NH₄⁺ + NO₃⁻ → NH₄NO₃.",
          { difficulty: 2 },
        ),
        mkNum(
          "q2-l4-e3",
          "Cu tem dois isótopos ⁶³Cu (69%) e ⁶⁵Cu (31%). Massa média ≈ ?",
          63.62,
          0.1,
          "0,69·63 + 0,31·65 = 63,62 u.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});
