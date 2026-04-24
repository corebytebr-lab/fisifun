import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkDrag, mkOrder, mkGraph, mkCase } from "../helpers";

export const cap02 = chapter({
  id: "02-movimento-retilineo",
  number: 2,
  title: "Movimento Retilíneo",
  subtitle: "Posição, velocidade e aceleração",
  color: "#3b82f6",
  emoji: "🏃",
  objectives: [
    "Distinguir posição, deslocamento e distância percorrida.",
    "Calcular velocidades médias e instantâneas.",
    "Aplicar as equações de MRUV.",
    "Interpretar gráficos s×t e v×t.",
  ],
  keyConcepts: [
    "Posição e referencial",
    "Velocidade média e instantânea",
    "Aceleração",
    "MRU e MRUV",
    "Queda livre",
  ],
  commonMistakes: [
    "Confundir deslocamento (Δx) com distância percorrida.",
    "Esquecer sinal da aceleração em queda livre (g = -9,8 m/s² com eixo para cima).",
    "Usar v = v₀ + at com t errado em movimento com paradas.",
  ],
  units: ["m", "s", "m/s", "m/s²"],
  formulas: [
    {
      id: "v-media",
      name: "Velocidade média",
      latex: "\\bar{v} = \\dfrac{\\Delta x}{\\Delta t}",
      description: "Razão entre o deslocamento e o intervalo de tempo.",
      variables: [
        { symbol: "\\Delta x", meaning: "deslocamento", unit: "m" },
        { symbol: "\\Delta t", meaning: "intervalo de tempo", unit: "s" },
      ],
      whenToUse: "Quando precisa da velocidade média entre dois pontos.",
    },
    {
      id: "a-media",
      name: "Aceleração média",
      latex: "\\bar{a} = \\dfrac{\\Delta v}{\\Delta t}",
      description: "Variação da velocidade pelo tempo.",
      variables: [
        { symbol: "\\Delta v", meaning: "variação de velocidade", unit: "m/s" },
        { symbol: "\\Delta t", meaning: "intervalo de tempo", unit: "s" },
      ],
      whenToUse: "Sempre que a velocidade varia.",
    },
    {
      id: "mruv-v",
      name: "MRUV — velocidade",
      latex: "v = v_0 + a\\,t",
      description: "Velocidade em função do tempo, aceleração constante.",
      variables: [
        { symbol: "v_0", meaning: "velocidade inicial", unit: "m/s" },
        { symbol: "a", meaning: "aceleração", unit: "m/s²" },
        { symbol: "t", meaning: "tempo", unit: "s" },
      ],
      whenToUse: "Movimento com aceleração constante.",
    },
    {
      id: "mruv-x",
      name: "MRUV — posição",
      latex: "x = x_0 + v_0 t + \\tfrac{1}{2} a t^2",
      description: "Equação horária da posição.",
      variables: [
        { symbol: "x_0", meaning: "posição inicial", unit: "m" },
      ],
      whenToUse: "Calcular posição em MRUV.",
    },
    {
      id: "torricelli",
      name: "Torricelli",
      latex: "v^2 = v_0^2 + 2 a \\Delta x",
      description: "Relaciona velocidades com deslocamento, sem tempo.",
      variables: [],
      whenToUse: "Quando o tempo não é dado e não é pedido.",
    },
    {
      id: "queda-livre",
      name: "Queda livre",
      latex: "y = y_0 + v_0 t - \\tfrac{1}{2} g t^2",
      description: "Próximo à superfície da Terra, só a gravidade atua.",
      variables: [
        { symbol: "g", meaning: "aceleração da gravidade ≈ 9,8 m/s²", unit: "m/s²" },
      ],
      whenToUse: "Objetos em queda, desprezando resistência do ar.",
    },
  ],
  lessons: [
    lesson("c2-l1", "Posição, deslocamento e distância", "concept", 15, 5, {
      concepts: [
        {
          title: "Referencial é tudo",
          body:
            "Para descrever um movimento, escolhemos um **referencial** (um ponto de origem e um sentido positivo).\n\n" +
            "- **Posição** ($x$): onde o corpo está em relação à origem.\n" +
            "- **Deslocamento** ($\\Delta x = x_f - x_i$): variação de posição. É vetorial e pode ser negativo.\n" +
            "- **Distância percorrida**: quanto de caminho o corpo fez (sempre positiva e ≥ |Δx|).",
        },
        {
          title: "Exemplo rápido",
          body:
            "Você anda 10 m para frente e depois 4 m de volta.\n- Deslocamento = +10 − 4 = +6 m.\n- Distância percorrida = 10 + 4 = 14 m.",
        },
      ],
    }),
    lesson("c2-l2", "Velocidade média × instantânea", "example", 20, 7, {
      concepts: [
        {
          title: "Qual é a diferença?",
          body:
            "**Velocidade média** olha o percurso todo: $\\bar{v} = \\Delta x / \\Delta t$.\n\n" +
            "**Velocidade instantânea** é o limite quando Δt → 0: é a **derivada** da posição em relação ao tempo.\n\n" +
            "Num gráfico $x \\times t$, a velocidade instantânea é a **inclinação da reta tangente**.",
        },
      ],
      exercises: [
        mkNum("c2-l2-e1",
          "Um carro vai de x=0 a x=240 m em 12 s. Qual a velocidade média (m/s)?",
          20, 0.1, "v = 240/12 = 20 m/s.", { concept: "velocidade-media", formulaRef: "v-media" }),
        mkTf("c2-l2-e2",
          "Se a velocidade escalar média é 0, o corpo ficou parado o tempo todo.",
          false,
          "Não! Pode ter ido e voltado ao mesmo ponto. Velocidade média vetorial é 0, mas distância percorrida > 0."),
        mkCase("c2-l2-e3",
          "Interpretação",
          "Em um gráfico x×t, uma reta horizontal indica que o corpo:",
          ["Está parado", "Tem velocidade constante positiva", "Está acelerando", "Está voltando"],
          0, "Reta horizontal → x não muda → v = 0.", { concept: "grafico-x-t" }),
      ],
    }),
    lesson("c2-l3", "Aceleração e MRUV", "example", 25, 8, {
      concepts: [
        {
          title: "As equações do movimento uniformemente variado",
          body:
            "Quando a aceleração é **constante**:\n\n" +
            "$$ v = v_0 + at $$\n$$ x = x_0 + v_0 t + \\tfrac{1}{2} a t^2 $$\n$$ v^2 = v_0^2 + 2a\\,\\Delta x $$\n\n" +
            "Dica: se o tempo não aparece no problema, use **Torricelli**.",
        },
      ],
      exercises: [
        mkNum("c2-l3-e1",
          "Um carro parte do repouso com a = 2 m/s². Qual a velocidade após 5 s (m/s)?",
          10, 0.1, "v = 0 + 2·5 = 10 m/s.", { concept: "mruv", formulaRef: "mruv-v" }),
        mkNum("c2-l3-e2",
          "Mesmo carro, qual distância percorrida em 5 s (m)?",
          25, 0.5, "x = ½·2·25 = 25 m.", { concept: "mruv", formulaRef: "mruv-x" }),
        mkDrag("c2-l3-e3",
          "Monte a equação de Torricelli:",
          [
            { id: "v2", label: "v²" },
            { id: "eq", label: "=" },
            { id: "v02", label: "v₀²" },
            { id: "plus", label: "+" },
            { id: "2a", label: "2a" },
            { id: "dx", label: "Δx" },
          ],
          ["v2", "eq", "v02", "plus", "2a", "dx"],
          "v² = v₀² + 2aΔx.", { concept: "torricelli", formulaRef: "torricelli" }),
      ],
    }),
    lesson("c2-l4", "Queda livre", "practice", 25, 8, {
      concepts: [
        {
          title: "Próximo da superfície da Terra",
          body:
            "Se desprezarmos a resistência do ar, **todo corpo** cai com a mesma aceleração: $g \\approx 9{,}8\\,\\text{m/s}^2$.\n\n" +
            "Convenção: eixo $y$ para cima → $a = -g$. Cuidado com **sinais**.",
        },
      ],
      exercises: [
        mkNum("c2-l4-e1",
          "Uma pedra é solta de 20 m. Em quanto tempo bate no chão? (use g = 10 m/s²)",
          2, 0.05, "20 = ½·10·t² → t² = 4 → t = 2 s.", { concept: "queda-livre", formulaRef: "queda-livre" }),
        mkNum("c2-l4-e2",
          "Mesma pedra: com que velocidade (m/s) ela atinge o chão?",
          20, 0.2, "v = g·t = 10·2 = 20 m/s.", { concept: "queda-livre" }),
        mkTf("c2-l4-e3",
          "No ponto mais alto de um lançamento vertical, a aceleração é zero.",
          false,
          "A aceleração é sempre g (para baixo). A **velocidade** é que momentaneamente é zero."),
      ],
    }),
    lesson("c2-l5", "Gráficos do movimento", "practice", 25, 7, {
      exercises: [
        mkGraph("c2-l5-g1",
          "Interprete o gráfico x×t abaixo:",
          [{ x: 0, y: 0 }, { x: 1, y: 5 }, { x: 2, y: 10 }, { x: 3, y: 15 }, { x: 4, y: 20 }],
          "t (s)", "x (m)",
          "Qual é a velocidade do objeto?",
          ["0 m/s", "2,5 m/s", "5 m/s", "10 m/s"], 2,
          "Reta com inclinação 5 m por s = 5 m/s. MRU.", { concept: "grafico-x-t" }),
        mkGraph("c2-l5-g2",
          "Interprete o gráfico v×t:",
          [{ x: 0, y: 0 }, { x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }, { x: 4, y: 8 }],
          "t (s)", "v (m/s)",
          "Qual a aceleração?",
          ["0", "1 m/s²", "2 m/s²", "4 m/s²"], 2,
          "Δv/Δt = 8/4 = 2 m/s².", { concept: "grafico-v-t" }),
        mkMc("c2-l5-e3",
          "A área sob a curva de um gráfico v×t representa:",
          ["Velocidade média", "Aceleração", "Deslocamento", "Tempo total"],
          2, "Área v×t = deslocamento (integral de v dt).",
          { concept: "area-grafico" }),
      ],
    }),
    lesson("c2-l6", "Quiz — Movimento Retilíneo", "quiz", 50, 10, {
      exercises: [
        mkMc("c2-q-1",
          "Um corpo tem v = -5 m/s. Isso significa que:",
          ["Está parado", "Tem aceleração negativa", "Move-se no sentido negativo do eixo", "Está frenando"],
          2, "Sinal na velocidade indica sentido."),
        mkNum("c2-q-2",
          "Carro a 30 m/s freia com a = -5 m/s². Em quanto tempo (s) para?",
          6, 0.05, "0 = 30 - 5t → t = 6 s."),
        mkNum("c2-q-3",
          "Mesmo carro: distância percorrida até parar (m)?",
          90, 0.5, "v² = v₀² + 2aΔx → 0 = 900 - 10Δx → Δx = 90 m."),
        mkTf("c2-q-4",
          "Em queda livre sem resistência do ar, objetos leves caem mais devagar.",
          false, "Todos caem com a mesma g. Galileu demonstrou isso."),
        mkOrder("c2-q-5",
          "Ordene os passos para resolver um problema de cinemática:",
          [
            "Ler enunciado e desenhar o eixo/referencial.",
            "Identificar os dados e a incógnita.",
            "Escolher a equação certa (v = v₀+at, x = x₀+v₀t+½at², Torricelli).",
            "Substituir com atenção a sinais e unidades.",
            "Verificar se o resultado faz sentido fisicamente.",
          ],
          "Essa rotina evita erros."),
        mkFill("c2-q-6",
          "No MRU, a aceleração é ___.",
          ["zero", "nula", "0"], "MRU = velocidade constante → a = 0.",
          { concept: "mru" }),
      ],
    }),
  ],
});
