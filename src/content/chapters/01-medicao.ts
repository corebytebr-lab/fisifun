import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkNumU, mkDrag, mkOrder, mkCase } from "../helpers";

export const cap01 = chapter({
  id: "01-medicao",
  number: 1,
  title: "Medição",
  subtitle: "Grandezas, SI e conversão de unidades",
  color: "#22c55e",
  emoji: "📏",
  objectives: [
    "Identificar as grandezas fundamentais do SI.",
    "Converter unidades com confiança usando fatores multiplicativos.",
    "Reconhecer algarismos significativos e ordens de grandeza.",
  ],
  keyConcepts: [
    "Grandeza física e padrão",
    "Sistema Internacional (SI)",
    "Prefixos (k, M, m, μ, n)",
    "Notação científica",
    "Algarismos significativos",
    "Densidade como grandeza derivada",
  ],
  commonMistakes: [
    "Esquecer de converter unidades antes de aplicar fórmulas.",
    "Somar grandezas com unidades diferentes.",
    "Confundir massa com peso (peso é força).",
  ],
  units: ["m", "kg", "s", "A", "K", "mol", "cd"],
  formulas: [
    {
      id: "densidade",
      name: "Densidade",
      latex: "\\rho = \\dfrac{m}{V}",
      description: "Razão entre massa e volume.",
      variables: [
        { symbol: "\\rho", meaning: "densidade", unit: "kg/m³" },
        { symbol: "m", meaning: "massa", unit: "kg" },
        { symbol: "V", meaning: "volume", unit: "m³" },
      ],
      whenToUse: "Quando um objeto é homogêneo e você conhece massa e volume.",
      example: "Um cubo de 0,1 m de lado com 2,7 kg tem ρ = 2,7/(0,1)³ = 2700 kg/m³ (alumínio).",
    },
    {
      id: "conversao",
      name: "Conversão de unidades",
      latex: "\\text{valor}_{\\text{novo}} = \\text{valor}_{\\text{antigo}} \\times \\text{fator}",
      description: "Multiplica-se por um fator dimensional equivalente a 1.",
      variables: [
        { symbol: "\\text{fator}", meaning: "razão entre unidades", unit: "adimensional" },
      ],
      whenToUse: "Sempre que as unidades da fórmula divergirem dos dados.",
      example: "72 km/h × (1000 m / 1 km) × (1 h / 3600 s) = 20 m/s.",
    },
    {
      id: "notacao-cientifica",
      name: "Notação científica",
      latex: "N = a \\times 10^n, \\quad 1 \\le |a| < 10",
      description: "Forma compacta para expressar números muito grandes ou muito pequenos.",
      variables: [
        { symbol: "a", meaning: "mantissa", unit: "-" },
        { symbol: "n", meaning: "expoente inteiro", unit: "-" },
      ],
      whenToUse: "Para comparar ordens de grandeza e simplificar cálculos.",
    },
  ],
  lessons: [
    lesson("c1-l1", "O que é Física e Medir?", "concept", 15, 5, {
      concepts: [
        {
          title: "Física é medir o mundo",
          body:
            "Física é a ciência que estuda como o universo funciona. Para isso, precisamos *medir* grandezas como **tempo, comprimento e massa**.\n\n" +
            "Cada grandeza tem um **padrão** de referência (por exemplo, 1 metro). Comparamos o mundo a esse padrão.",
        },
        {
          title: "O Sistema Internacional (SI)",
          body:
            "O SI define 7 grandezas fundamentais:\n" +
            "- comprimento — metro (m)\n" +
            "- massa — quilograma (kg)\n" +
            "- tempo — segundo (s)\n" +
            "- corrente elétrica — ampère (A)\n" +
            "- temperatura — kelvin (K)\n" +
            "- quantidade de matéria — mol (mol)\n" +
            "- intensidade luminosa — candela (cd)\n\n" +
            "*Todas* as demais grandezas (velocidade, força, energia...) são derivadas dessas.",
        },
        {
          title: "Prefixos mais usados",
          body:
            "Eles mudam a ordem de grandeza:\n" +
            "- **k** (quilo) = $10^3$\n" +
            "- **M** (mega) = $10^6$\n" +
            "- **m** (mili) = $10^{-3}$\n" +
            "- **μ** (micro) = $10^{-6}$\n" +
            "- **n** (nano) = $10^{-9}$",
        },
      ],
    }),
    lesson("c1-l2", "Conversão de unidades", "example", 20, 7, {
      concepts: [
        {
          title: "Como converter passo a passo",
          body:
            "Converter é multiplicar pelo **fator 1**.\n\n" +
            "$$ 1 = \\dfrac{1000\\,\\text{m}}{1\\,\\text{km}} $$\n\n" +
            "Aplicamos esse fator de modo que as unidades antigas **cancelem**:\n\n" +
            "$$ 72\\,\\dfrac{\\text{km}}{\\text{h}} \\times \\dfrac{1000\\,\\text{m}}{1\\,\\text{km}} \\times \\dfrac{1\\,\\text{h}}{3600\\,\\text{s}} = 20\\,\\dfrac{\\text{m}}{\\text{s}} $$",
          example: "Regra rápida: dividir por 3,6 converte km/h para m/s.",
        },
      ],
      exercises: [
        mkNumU("c1-l2-e1", "Converta 90 km/h para m/s.", 25, 0.1, "m/s", ["m/s", "km/s", "cm/s"],
          "90/3,6 = 25 m/s.", { difficulty: 1, concept: "conversao-unidades" }),
        mkNum("c1-l2-e2", "Quantos segundos há em 2,5 horas?", 9000, 0.1,
          "2,5 × 3600 = 9000 s.", { difficulty: 1, concept: "conversao-unidades" }),
        mkMc("c1-l2-e3",
          "Qual é a conversão correta de 5 nm para metros?",
          ["$5 \\times 10^{-3}$ m", "$5 \\times 10^{-6}$ m", "$5 \\times 10^{-9}$ m", "$5 \\times 10^{9}$ m"],
          2, "Nano (n) corresponde a $10^{-9}$.", { concept: "prefixos" }),
      ],
    }),
    lesson("c1-l3", "Algarismos e ordens de grandeza", "practice", 20, 7, {
      concepts: [
        {
          title: "Precisão e algarismos significativos",
          body:
            "Algarismos significativos são os **dígitos confiáveis** de uma medida.\n" +
            "- 2,10 tem 3 algarismos significativos (o zero conta).\n" +
            "- 0,0045 tem 2 (apenas o 4 e o 5).\n\n" +
            "Na hora de multiplicar/dividir, o resultado deve ter a menor quantidade de algarismos significativos dos fatores.",
        },
      ],
      exercises: [
        mkMc("c1-l3-e1", "Quantos algarismos significativos há em 0,00302?",
          ["2", "3", "4", "5"], 1, "Os zeros à esquerda não contam; contamos 3, 0, 2 → 3 algarismos.",
          { concept: "algarismos-significativos" }),
        mkTf("c1-l3-e2", "O número 1200 tem, necessariamente, 4 algarismos significativos.", false,
          "Sem notação científica, zeros finais são ambíguos. Use $1{,}2 \\times 10^3$ (2) ou $1{,}200 \\times 10^3$ (4)."),
        mkFill("c1-l3-e3",
          "A ordem de grandeza de 4500 é 10^___.",
          ["3"], "4500 ≈ $4,5 \\times 10^3$, portanto ordem de grandeza $10^3$.",
          { concept: "ordem-de-grandeza" }),
      ],
    }),
    lesson("c1-l4", "Densidade — aplicando fórmula", "example", 20, 8, {
      concepts: [
        {
          title: "Densidade e por que ela importa",
          body:
            "A densidade diz **quanta massa** cabe em cada volume.\n\n" +
            "$$ \\rho = \\dfrac{m}{V} $$\n\n" +
            "Objetos mais densos que a água afundam em água pura (se não forem ocos).",
        },
      ],
      exercises: [
        mkNumU("c1-l4-e1",
          "Um cubo de 10 cm de lado tem massa 1,0 kg. Qual a densidade em kg/m³?",
          1000, 1, "kg/m³", ["kg/m³", "g/cm³", "kg/L"],
          "V = (0,10)³ = $10^{-3}$ m³. ρ = 1,0/$10^{-3}$ = 1000 kg/m³ (água).",
          { concept: "densidade", formulaRef: "densidade" }),
        mkDrag("c1-l4-e2",
          "Monte a fórmula da densidade:",
          [
            { id: "rho", label: "ρ" },
            { id: "eq", label: "=" },
            { id: "m", label: "m" },
            { id: "slash", label: "/" },
            { id: "V", label: "V" },
          ],
          ["rho", "eq", "m", "slash", "V"],
          "ρ = m/V. Massa sobre volume.",
          { concept: "densidade" }),
        mkOrder("c1-l4-e3",
          "Ordene os passos para calcular a densidade de um objeto irregular:",
          [
            "Medir a massa do objeto na balança (m).",
            "Colocar o objeto em uma proveta com água e medir o volume deslocado (V).",
            "Dividir m por V para obter ρ.",
          ],
          "Esse é o método de Arquimedes para volumes irregulares.",
        ),
      ],
    }),
    lesson("c1-l5", "Quiz — Medição", "quiz", 40, 10, {
      exercises: [
        mkMc("c1-q-1",
          "A unidade de tempo no SI é:",
          ["minuto", "segundo", "hora", "dia"], 1,
          "A unidade base é o segundo (s)."),
        mkMc("c1-q-2",
          "Qual grandeza NÃO é fundamental no SI?",
          ["Massa", "Temperatura", "Força", "Corrente elétrica"], 2,
          "Força é derivada (F = m·a → kg·m/s²)."),
        mkNumU("c1-q-3",
          "Converta 2,5 L para m³.",
          0.0025, 1e-5, "m³", ["m³", "cm³", "mm³"],
          "1 L = $10^{-3}$ m³, então 2,5 L = 0,0025 m³.", { concept: "conversao-unidades" }),
        mkTf("c1-q-4",
          "10 mm = 1 cm.", true,
          "Mili é $10^{-3}$ e centi é $10^{-2}$, então 10 mm = 1 cm."),
        mkFill("c1-q-5",
          "Densidade é razão entre ___ e volume.",
          ["massa"], "ρ = m/V.", { concept: "densidade" }),
        mkCase("c1-q-6",
          "Interpretação de enunciado",
          "Um atleta corre 400 m em 50 s. A velocidade média é?",
          ["4 m/s", "6 m/s", "8 m/s", "10 m/s"], 2,
          "v = Δs/Δt = 400/50 = 8 m/s.", { concept: "velocidade-media" }),
      ],
    }),
  ],
});
