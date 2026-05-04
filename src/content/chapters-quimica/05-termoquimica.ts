import { chapter, lesson, mkMc, mkTf, mkNum } from "../helpers";

export const cap05q = chapter({
  id: "q05-termoquimica",
  number: 5,
  subject: "quimica",
  title: "Termoquímica",
  subtitle: "Calor, entalpia, calorimetria e Lei de Hess",
  color: "#f59e0b",
  emoji: "🔥",
  objectives: [
    "Diferenciar exotérmica/endotérmica.",
    "Aplicar q = m·c·ΔT.",
    "Usar Lei de Hess.",
    "Calcular ΔH a partir de ΔH_f.",
  ],
  keyConcepts: [
    "Sistema, vizinhança e fronteira",
    "1ª Lei: ΔU = q + w",
    "Entalpia H; ΔH > 0 endo; ΔH < 0 exo",
    "Calor específico c (J/g·K)",
    "Lei de Hess: ΔH é função de estado",
    "Entalpia padrão de formação ΔH_f°",
  ],
  commonMistakes: [
    "Trocar sinal do trabalho/calor.",
    "Esquecer de multiplicar pela mol na soma de Hess.",
    "Confundir calor específico com capacidade calorífica.",
  ],
  units: ["J", "kJ", "J/g·K", "kJ/mol"],
  formulas: [
    {
      id: "q-calor",
      name: "Calor sensível",
      latex: "q = m \\cdot c \\cdot \\Delta T",
      description: "Calor para aquecer/esfriar massa m sem mudança de fase.",
      variables: [
        { symbol: "q", meaning: "calor", unit: "J" },
        { symbol: "m", meaning: "massa", unit: "g" },
        { symbol: "c", meaning: "calor específico", unit: "J/g·K" },
        { symbol: "\\Delta T", meaning: "variação de temperatura", unit: "K ou °C" },
      ],
      whenToUse: "Sem mudança de fase.",
      example: "100 g de água, c=4,18, ΔT=20 → q=100·4,18·20=8360 J.",
    },
    {
      id: "q-hess",
      name: "Lei de Hess",
      latex: "\\Delta H_{rx} = \\sum n\\,\\Delta H_f^{\\circ}(prod) - \\sum n\\,\\Delta H_f^{\\circ}(reag)",
      description: "ΔH de uma reação é independente do caminho.",
      variables: [
        { symbol: "\\Delta H_f^{\\circ}", meaning: "entalpia padrão de formação", unit: "kJ/mol" },
      ],
      whenToUse: "Quando se conhece ΔH_f° de produtos e reagentes.",
    },
  ],
  lessons: [
    lesson("q5-l1", "Calor, entalpia e Lei de Hess", "concept", 15, 6, {
      concepts: [
        {
          title: "Energia, calor e trabalho",
          body:
            "Energia interna **U** muda por **calor (q)** e **trabalho (w)**: ΔU = q + w.\n\n" +
            "À pressão constante, q = ΔH (entalpia).\n\n" +
            "**Exotérmica**: libera calor (ΔH < 0). **Endotérmica**: absorve (ΔH > 0).",
        },
        {
          title: "Lei de Hess",
          body:
            "Como ΔH é função de estado, podemos somar etapas:\n" +
            "Se A→B (ΔH₁) e B→C (ΔH₂), então A→C tem ΔH = ΔH₁ + ΔH₂.\n\n" +
            "Inverter a equação inverte o sinal de ΔH; multiplicar a equação multiplica ΔH.",
        },
      ],
      exercises: [
        mkNum(
          "q5-l1-e1",
          "100 g de água (c=4,18 J/g·K) absorve quantos J ao aquecer 25→75°C?",
          20900,
          50,
          "q = 100·4,18·50 = 20900 J.",
          { difficulty: 1 },
        ),
        mkMc(
          "q5-l1-e2",
          "Reação com ΔH = -890 kJ é:",
          ["Endotérmica", "Exotérmica", "Atérmica", "Irreversível"],
          1,
          "ΔH<0 → libera calor → exotérmica.",
          { difficulty: 1 },
        ),
        mkTf(
          "q5-l1-e3",
          "Inverter uma reação muda o sinal de ΔH.",
          true,
          "Se A→B tem ΔH, então B→A tem -ΔH.",
          { difficulty: 1 },
        ),
        mkNum(
          "q5-l1-e4",
          "ΔH(reação) = ΔHf(prod) - ΔHf(reag). Para CH₄ + 2O₂ → CO₂ + 2H₂O, com ΔHf: CH₄=-74, CO₂=-393, H₂O(l)=-285. Calcule ΔH em kJ.",
          -889,
          5,
          "ΔH = (-393 + 2·(-285)) - (-74 + 0) = -963 + 74 = -889 kJ.",
          { difficulty: 3 },
        ),
      ],
    }),
    lesson("q5-l2", "Quiz — Termoquímica", "quiz", 15, 6, {
      exercises: [
        mkMc(
          "q5-l2-e1",
          "Capacidade calorífica é em:",
          ["J/g·K", "J/K", "K/J", "J"],
          1,
          "C = m·c, em J/K.",
          { difficulty: 1 },
        ),
        mkNum(
          "q5-l2-e2",
          "Massa (g) que esfria 5 K com c=2 J/g·K liberando 200 J.",
          20,
          0.5,
          "200 = m·2·5 → m = 20 g.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});
