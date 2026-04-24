import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkDrag, mkCase } from "../helpers";

export const cap03 = chapter({
  id: "03-vetores",
  number: 3,
  title: "Vetores",
  subtitle: "Soma, componentes e produto de vetores",
  color: "#f97316",
  emoji: "➡️",
  objectives: [
    "Distinguir grandezas escalares e vetoriais.",
    "Decompor e somar vetores pelas componentes.",
    "Calcular produto escalar e vetorial.",
  ],
  keyConcepts: [
    "Soma vetorial",
    "Componentes cartesianas",
    "Vetores unitários (î, ĵ, k̂)",
    "Produto escalar (·)",
    "Produto vetorial (×)",
  ],
  commonMistakes: [
    "Somar módulos diretamente (só vale se vetores são paralelos).",
    "Esquecer de projetar com sen/cos correto.",
    "Confundir produto escalar com produto vetorial.",
  ],
  units: ["m", "-"],
  formulas: [
    {
      id: "componentes",
      name: "Componentes",
      latex: "a_x = a\\cos\\theta, \\quad a_y = a\\sin\\theta",
      description: "Projeções de um vetor de módulo a num eixo inclinado θ.",
      variables: [
        { symbol: "a", meaning: "módulo", unit: "unid. da grandeza" },
        { symbol: "\\theta", meaning: "ângulo com o eixo x", unit: "rad ou °" },
      ],
      whenToUse: "Decompor qualquer vetor nos eixos x e y.",
    },
    {
      id: "modulo",
      name: "Módulo a partir de componentes",
      latex: "a = \\sqrt{a_x^2 + a_y^2}",
      description: "Teorema de Pitágoras aplicado às componentes.",
      variables: [],
      whenToUse: "Quando soma componentes e quer voltar ao módulo.",
    },
    {
      id: "escalar",
      name: "Produto escalar",
      latex: "\\vec{a} \\cdot \\vec{b} = a\\,b\\,\\cos\\theta = a_x b_x + a_y b_y + a_z b_z",
      description: "Resultado é um escalar.",
      variables: [
        { symbol: "\\theta", meaning: "ângulo entre os vetores", unit: "rad" },
      ],
      whenToUse: "Trabalho, projeção, verificar perpendicularidade (escalar = 0).",
    },
    {
      id: "vetorial",
      name: "Produto vetorial",
      latex: "|\\vec{a} \\times \\vec{b}| = a\\,b\\,\\sin\\theta",
      description: "Resultado é um vetor perpendicular aos dois.",
      variables: [],
      whenToUse: "Torque, campo magnético, momento angular.",
    },
  ],
  lessons: [
    lesson("c3-l1", "Escalar vs. Vetorial", "concept", 15, 5, {
      concepts: [
        {
          title: "O que muda?",
          body:
            "**Escalar**: só tem módulo. Ex.: massa, temperatura, tempo, energia.\n\n" +
            "**Vetorial**: tem módulo, *direção* e *sentido*. Ex.: deslocamento, velocidade, força.",
        },
        {
          title: "Notação",
          body:
            "Um vetor costuma aparecer com seta: $\\vec{a}$. Seu módulo é $a$ ou $|\\vec{a}|$.\n\n" +
            "Nos eixos, escrevemos: $\\vec{a} = a_x\\hat{i} + a_y\\hat{j} + a_z\\hat{k}$.",
        },
      ],
    }),
    lesson("c3-l2", "Somando vetores", "example", 20, 7, {
      concepts: [
        {
          title: "Regra do paralelogramo × componentes",
          body:
            "Para somar vetores:\n" +
            "- **Graficamente**: cabeça-cauda ou regra do paralelogramo.\n" +
            "- **Analiticamente (melhor)**: some as componentes: $c_x = a_x + b_x$, $c_y = a_y + b_y$.\n\n" +
            "Depois, se quiser, volte ao módulo com Pitágoras.",
        },
      ],
      exercises: [
        mkNum("c3-l2-e1",
          "Um vetor tem módulo 5 e ângulo 53° com o eixo x. Qual é $a_x$? (use cos 53° = 0,6)",
          3, 0.05, "a_x = 5·0,6 = 3."),
        mkNum("c3-l2-e2",
          "Mesma situação: $a_y$? (sen 53° = 0,8)",
          4, 0.05, "a_y = 5·0,8 = 4."),
        mkDrag("c3-l2-e3",
          "Monte: módulo a partir das componentes",
          [
            { id: "a", label: "a" },
            { id: "eq", label: "=" },
            { id: "sqrt", label: "√(" },
            { id: "ax2", label: "aₓ²" },
            { id: "plus", label: "+" },
            { id: "ay2", label: "aᵧ²" },
            { id: "close", label: ")" },
          ],
          ["a", "eq", "sqrt", "ax2", "plus", "ay2", "close"],
          "|a| = √(aₓ² + aᵧ²)."),
      ],
    }),
    lesson("c3-l3", "Produto escalar e vetorial", "practice", 25, 8, {
      concepts: [
        {
          title: "Escalar: projeta, vetorial: gira",
          body:
            "**Escalar** mede o quanto dois vetores *se alinham*:\n- Se $\\theta = 0$ → máximo.\n- Se $\\theta = 90°$ → zero (perpendiculares).\n- Se $\\theta = 180°$ → negativo.\n\n" +
            "**Vetorial** mede o quanto eles *não se alinham* e gera um novo vetor perpendicular. Use a **regra da mão direita**.",
        },
      ],
      exercises: [
        mkMc("c3-l3-e1",
          "Se $\\vec{a} \\cdot \\vec{b} = 0$ (e nenhum é zero), então:",
          ["São paralelos", "São antiparalelos", "São perpendiculares", "Não há informação"],
          2, "Escalar nulo ⇔ perpendicularidade."),
        mkNum("c3-l3-e2",
          "$\\vec{a} = (3,4,0)$ e $\\vec{b} = (2,0,0)$. Qual é $\\vec{a} \\cdot \\vec{b}$?",
          6, 0.01, "3·2 + 4·0 + 0·0 = 6."),
        mkTf("c3-l3-e3",
          "O produto vetorial é comutativo: $\\vec{a} \\times \\vec{b} = \\vec{b} \\times \\vec{a}$.",
          false, "Ele é anti-comutativo: $\\vec{a}\\times\\vec{b} = -\\vec{b}\\times\\vec{a}$."),
        mkCase("c3-l3-e4",
          "Aplicação",
          "Você empurra uma caixa com força F=10 N e ela se move 5 m na mesma direção. Trabalho?",
          ["0 J", "25 J", "50 J", "100 J"], 2,
          "W = F·d·cos(0°) = 10·5 = 50 J."),
      ],
    }),
    lesson("c3-l4", "Quiz — Vetores", "quiz", 40, 10, {
      exercises: [
        mkMc("c3-q-1",
          "Qual é grandeza vetorial?",
          ["Temperatura", "Massa", "Velocidade", "Tempo"], 2),
        mkFill("c3-q-2",
          "A projeção no eixo x de um vetor de módulo a e ângulo θ é a·___(θ).",
          ["cos"], "a_x = a·cos θ."),
        mkNum("c3-q-3",
          "Dois deslocamentos perpendiculares: 3 m leste + 4 m norte. Módulo do resultante?",
          5, 0.01, "√(3²+4²) = 5 m."),
        mkTf("c3-q-4",
          "O módulo do produto vetorial entre dois vetores paralelos é zero.",
          true, "sin(0°)=0."),
        mkMc("c3-q-5",
          "A regra da mão direita ajuda a determinar:",
          ["Sentido do produto escalar", "Sentido do produto vetorial", "Módulo do vetor", "Ângulo entre vetores"],
          1),
      ],
    }),
  ],
});
