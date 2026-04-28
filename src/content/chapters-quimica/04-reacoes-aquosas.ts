import { chapter, lesson, mkMc, mkTf, mkNum, mkFill } from "../helpers";

export const cap04q = chapter({
  id: "q04-reacoes-aquosas",
  number: 4,
  subject: "quimica",
  title: "Reações Aquosas e Estequiometria de Soluções",
  subtitle: "Eletrólitos, ácido-base, redox e molaridade",
  color: "#0ea5e9",
  emoji: "💧",
  objectives: [
    "Distinguir eletrólitos fortes, fracos e não-eletrólitos.",
    "Identificar reações de precipitação, ácido-base e redox.",
    "Balancear semi-reações e identificar agente oxidante/redutor.",
    "Aplicar molaridade e dilução.",
  ],
  keyConcepts: [
    "Solução aquosa, solvente e soluto",
    "Eletrólito forte (NaCl, HCl) vs fraco (CH₃COOH)",
    "Regras de solubilidade",
    "Ácido de Arrhenius (libera H⁺); base (libera OH⁻)",
    "Reação de neutralização: ácido + base → sal + água",
    "Oxirredução: variação de NOX",
    "Molaridade M = n/V",
    "Dilução C₁V₁ = C₂V₂",
  ],
  commonMistakes: [
    "Esquecer que ácidos fracos só ionizam parcialmente.",
    "Confundir oxidação (perde e⁻) com redução (ganha e⁻).",
    "Misturar M (mol/L) com m (massa) em conversões.",
  ],
  units: ["mol/L (M)", "g/L", "L"],
  formulas: [
    {
      id: "q-molaridade",
      name: "Molaridade",
      latex: "C = \\dfrac{n}{V}",
      description: "Concentração em mols por litro.",
      variables: [
        { symbol: "C", meaning: "concentração", unit: "mol/L" },
        { symbol: "n", meaning: "mols de soluto", unit: "mol" },
        { symbol: "V", meaning: "volume da solução", unit: "L" },
      ],
      whenToUse: "Cálculos de soluções, titulação, diluição.",
      example: "29,25 g de NaCl (M=58,5) em 0,5 L → n=0,5 mol → C=1,0 mol/L.",
    },
    {
      id: "q-diluicao",
      name: "Diluição",
      latex: "C_1 V_1 = C_2 V_2",
      description: "Quando se adiciona solvente, mols ficam constantes.",
      variables: [
        { symbol: "C", meaning: "concentração", unit: "mol/L" },
        { symbol: "V", meaning: "volume", unit: "L" },
      ],
      whenToUse: "Sempre que adicionar/remover solvente.",
    },
  ],
  lessons: [
    lesson("q4-l1", "Eletrólitos e solubilidade", "concept", 12, 5, {
      concepts: [
        {
          title: "Eletrólitos",
          body:
            "Substâncias que **ionizam/dissociam** em água:\n" +
            "- **Fortes**: ionização completa → conduzem bem (sais, ácidos/bases fortes)\n" +
            "- **Fracos**: ionização parcial (CH₃COOH, NH₃)\n" +
            "- **Não-eletrólitos**: não ionizam (açúcar, álcool)",
        },
        {
          title: "Regras de solubilidade (resumo)",
          body:
            "Solúveis em geral:\n- Sais de Na⁺, K⁺, NH₄⁺ (sempre)\n- Nitratos (NO₃⁻), acetatos\n- Maioria dos cloretos (exceto Ag⁺, Pb²⁺, Hg₂²⁺)\n- Sulfatos (exceto Ba²⁺, Sr²⁺, Pb²⁺)\n\n" +
            "Insolúveis em geral:\n- Carbonatos, fosfatos, sulfetos, hidróxidos (exceto NH₄⁺ e alcalinos)",
        },
      ],
    }),
    lesson("q4-l2", "Ácido-base, redox e molaridade", "example", 14, 6, {
      concepts: [
        {
          title: "Tipos de reação",
          body:
            "**Precipitação**: dois solúveis formam um sólido — AgNO₃ + NaCl → AgCl↓ + NaNO₃.\n" +
            "**Ácido-base**: HCl + NaOH → NaCl + H₂O.\n" +
            "**Redox**: variação de NOX, com agentes oxidante (recebe e⁻) e redutor (doa e⁻).",
        },
        {
          title: "Molaridade e diluição",
          body:
            "M = n / V (em L). Para diluir, C₁V₁ = C₂V₂ — só adiciona solvente.\n\n" +
            "Para preparar 250 mL de NaCl 0,1 M: n = 0,025 mol → m = 0,025·58,5 = 1,46 g.",
        },
      ],
      exercises: [
        mkNum(
          "q4-l2-e1",
          "Quantos mols de NaOH há em 250 mL de solução 0,40 M?",
          0.1,
          0.005,
          "n = C·V = 0,40 · 0,250 = 0,100 mol.",
          { difficulty: 1 },
        ),
        mkNum(
          "q4-l2-e2",
          "Para preparar 100 mL de HCl 0,5 M a partir de HCl 6,0 M, quantos mL da solução concentrada?",
          8.33,
          0.1,
          "C₁V₁ = C₂V₂ ⇒ 6·V₁ = 0,5·100 ⇒ V₁ = 8,33 mL.",
          { difficulty: 2 },
        ),
        mkMc(
          "q4-l2-e3",
          "Em Zn + Cu²⁺ → Zn²⁺ + Cu, quem é o agente oxidante?",
          ["Zn", "Cu²⁺", "Zn²⁺", "Cu"],
          1,
          "Cu²⁺ recebe elétrons (vira Cu) → agente oxidante.",
          { difficulty: 2 },
        ),
        mkTf(
          "q4-l2-e4",
          "AgCl é solúvel em água.",
          false,
          "AgCl é uma exceção: insolúvel.",
          { difficulty: 1 },
        ),
        mkFill(
          "q4-l2-e5",
          "Na neutralização HCl + NaOH, o produto além de NaCl é ___.",
          ["água", "H2O", "H₂O"],
          "Sempre forma água em neutralização.",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("q4-l3", "Quiz — Reações Aquosas", "quiz", 18, 8, {
      exercises: [
        mkMc(
          "q4-l3-e1",
          "Eletrólito fraco típico:",
          ["NaCl", "CH₃COOH", "HCl", "KOH"],
          1,
          "Ácido acético ioniza parcialmente.",
          { difficulty: 1 },
        ),
        mkNum(
          "q4-l3-e2",
          "Massa (g) de KOH (M=56) para 500 mL de solução 0,2 M.",
          5.6,
          0.05,
          "n = 0,2·0,5 = 0,1 mol → m = 5,6 g.",
          { difficulty: 2 },
        ),
        mkMc(
          "q4-l3-e3",
          "Adicionando água a 50 mL de solução 1,0 M para 200 mL, a nova C é:",
          ["0,10 M", "0,25 M", "0,40 M", "0,50 M"],
          1,
          "1·50 = C·200 → C = 0,25 M.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});
