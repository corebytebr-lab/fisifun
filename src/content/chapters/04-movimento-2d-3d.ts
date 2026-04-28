import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkOrder, mkCase } from "../helpers";

export const cap04 = chapter({
  id: "04-movimento-2d-3d",
  number: 4,
  title: "Movimento em 2D e 3D",
  subtitle: "Balística, movimento circular e movimento relativo",
  color: "#eab308",
  emoji: "🎯",
  objectives: [
    "Analisar movimentos em duas dimensões (balística).",
    "Compreender movimento circular uniforme.",
    "Aplicar movimento relativo.",
  ],
  keyConcepts: [
    "Decomposição horizontal/vertical",
    "Alcance, altura e tempo de voo",
    "Aceleração centrípeta",
    "Movimento relativo entre referenciais",
  ],
  commonMistakes: [
    "Assumir que a velocidade horizontal muda em balística (não muda, se não há atrito).",
    "Esquecer que, no topo da trajetória, $v_y = 0$ mas $v_x \\ne 0$.",
    "Confundir velocidade angular com tangencial.",
  ],
  units: ["m", "s", "m/s", "rad/s"],
  formulas: [
    {
      id: "balistica",
      name: "Balística — equações",
      latex: "x = v_{0x} t, \\quad y = v_{0y} t - \\tfrac{1}{2} g t^2",
      description: "Movimento horizontal é MRU, vertical é MRUV.",
      variables: [
        { symbol: "v_{0x}", meaning: "v₀ cos θ", unit: "m/s" },
        { symbol: "v_{0y}", meaning: "v₀ sen θ", unit: "m/s" },
      ],
      whenToUse: "Projétil com resistência do ar desprezível.",
    },
    {
      id: "alcance",
      name: "Alcance horizontal (mesma altura)",
      latex: "R = \\dfrac{v_0^2 \\sin(2\\theta)}{g}",
      description: "Distância máxima quando parte e cai no mesmo nível.",
      variables: [],
      whenToUse: "Alcance é máximo em θ = 45°.",
    },
    {
      id: "centripeta",
      name: "Aceleração centrípeta",
      latex: "a_c = \\dfrac{v^2}{r} = \\omega^2 r",
      description: "Aceleração que aponta para o centro em MCU.",
      variables: [
        { symbol: "v", meaning: "velocidade tangencial", unit: "m/s" },
        { symbol: "r", meaning: "raio", unit: "m" },
        { symbol: "\\omega", meaning: "velocidade angular", unit: "rad/s" },
      ],
      whenToUse: "Movimento circular.",
    },
    {
      id: "periodo",
      name: "Período MCU",
      latex: "T = \\dfrac{2\\pi r}{v} = \\dfrac{2\\pi}{\\omega}",
      description: "Tempo de uma volta completa.",
      variables: [],
      whenToUse: "Relacionar T, f, ω, v.",
    },
    {
      id: "v-relativa",
      name: "Velocidade relativa",
      latex: "\\vec{v}_{AC} = \\vec{v}_{AB} + \\vec{v}_{BC}",
      description: "Soma vetorial de velocidades entre referenciais.",
      variables: [],
      whenToUse: "Problemas de barcos em rios, aviões com vento.",
    },
  ],
  lessons: [
    lesson("c4-l1", "Movimento balístico", "example", 25, 8, {
      concepts: [
        {
          title: "Dois movimentos independentes",
          body:
            "No movimento balístico, horizontal e vertical são **independentes**:\n" +
            "- Horizontal: MRU com $v_x = v_0 \\cos\\theta$.\n" +
            "- Vertical: MRUV com $v_y(t) = v_0 \\sin\\theta - g t$.\n\n" +
            "Para achar o **tempo de voo** num lançamento rasteiro e retorno ao mesmo nível, use $t_\\text{voo} = 2v_{0y}/g$.",
        },
      ],
      exercises: [
        mkNum("c4-l1-e1",
          "Um projétil é lançado com v₀ = 20 m/s a 37° (sen=0,6, cos=0,8). Qual é $v_{0x}$?",
          16, 0.1, "20·0,8 = 16 m/s."),
        mkNum("c4-l1-e2",
          "Mesmo projétil: $v_{0y}$?",
          12, 0.1, "20·0,6 = 12 m/s."),
        mkNum("c4-l1-e3",
          "Tempo de voo (g=10 m/s²)?",
          2.4, 0.05, "t = 2·12/10 = 2,4 s."),
        mkMc("c4-l1-e4",
          "No ponto mais alto da trajetória:",
          ["v é zero", "v_y é zero mas v_x continua", "v_x é zero", "A aceleração é zero"],
          1, "Gravidade é sempre para baixo; v_x não muda."),
      ],
    }),
    lesson("c4-l2", "Alcance e altura máxima", "practice", 20, 7, {
      concepts: [
        {
          title: "Fórmulas práticas (mesmo nível)",
          body:
            "$$ H = \\dfrac{v_0^2 \\sin^2\\theta}{2g}, \\quad R = \\dfrac{v_0^2 \\sin(2\\theta)}{g} $$\n\n" +
            "R é máximo quando $\\theta = 45°$.",
        },
      ],
      exercises: [
        mkNum("c4-l2-e1",
          "v₀=20 m/s, θ=45°, g=10 m/s². Alcance (m)?",
          40, 0.5, "R = 400·sin(90)/10 = 40 m."),
        mkNum("c4-l2-e2",
          "Mesmo problema: altura máxima?",
          10, 0.2, "H = 400·(√2/2)²/20 = 200/20 = 10 m."),
        mkTf("c4-l2-e3",
          "Em um lançamento rasteiro (ao mesmo nível), 30° e 60° têm o mesmo alcance.",
          true, "sin(60°) = sin(120°), logo R é o mesmo."),
      ],
    }),
    lesson("c4-l3", "Movimento circular uniforme", "example", 25, 8, {
      concepts: [
        {
          title: "Por que a aceleração existe se a velocidade 'é constante'?",
          body:
            "No MCU, o **módulo** da velocidade é constante, mas a **direção** muda.\n\n" +
            "Como aceleração é $\\Delta \\vec{v}/\\Delta t$, há aceleração — e ela aponta para o centro:\n\n" +
            "$$ a_c = \\dfrac{v^2}{r} $$",
        },
      ],
      exercises: [
        mkNum("c4-l3-e1",
          "Um carro a 20 m/s faz curva de raio 100 m. Aceleração centrípeta?",
          4, 0.05, "a = 400/100 = 4 m/s²."),
        mkNum("c4-l3-e2",
          "Se ω = 2 rad/s e r = 3 m, qual a velocidade tangencial?",
          6, 0.01, "v = ω·r = 6 m/s."),
        mkMc("c4-l3-e3",
          "O período de um movimento circular com ω = π rad/s é:",
          ["0,5 s", "1 s", "2 s", "π s"], 2, "T = 2π/ω = 2 s."),
      ],
    }),
    lesson("c4-l4", "Movimento relativo", "example", 20, 7, {
      concepts: [
        {
          title: "Escolha o referencial certo",
          body:
            "Se você está em um trem andando a 5 m/s e anda dentro dele a 2 m/s no mesmo sentido, uma pessoa no chão te vê andar a **7 m/s**.\n\n" +
            "Em 2D é igual, mas a soma é vetorial: $\\vec{v}_{AC} = \\vec{v}_{AB} + \\vec{v}_{BC}$.",
        },
      ],
      exercises: [
        mkNum("c4-l4-e1",
          "Um barco quer atravessar um rio de 100 m a 5 m/s em relação à água. Correnteza é 3 m/s para leste. Tempo para atravessar (s)?",
          20, 0.1, "Velocidade perpendicular à margem é 5 m/s → t = 100/5 = 20 s."),
        mkCase("c4-l4-e2",
          "Interpretação",
          "No mesmo problema, qual o deslocamento para leste (m) enquanto cruza?",
          ["0 m", "30 m", "60 m", "100 m"],
          2, "t=20 s, v=3 m/s → 60 m."),
        mkOrder("c4-l4-e3",
          "Ordene a análise de um problema de vento/aeronave:",
          [
            "Identificar referenciais (aeronave, vento, solo).",
            "Escrever v_aeronave/solo = v_aeronave/ar + v_ar/solo.",
            "Decompor cada vetor em x e y.",
            "Somar componentes e voltar ao módulo se necessário.",
          ],
          "Sistematiza problemas com vento."),
      ],
    }),
    lesson("c4-l5", "Quiz — Movimento 2D/3D", "quiz", 45, 10, {
      exercises: [
        mkMc("c4-q-1",
          "Em balística (sem resistência do ar), qual componente da velocidade é constante?",
          ["Vertical", "Horizontal", "Nenhuma", "Ambas"], 1),
        mkFill("c4-q-2",
          "O alcance é máximo no ângulo de ___°.",
          ["45"], "sin(90°) = 1 no alcance horizontal."),
        mkNum("c4-q-3",
          "Uma pedra em rotação a 4 m/s numa corda de 1 m. Aceleração centrípeta?",
          16, 0.1, "16/1 = 16 m/s²."),
        mkTf("c4-q-4",
          "No MCU, a velocidade é constante em módulo e direção.",
          false, "Módulo é constante; direção muda continuamente."),
        mkCase("c4-q-5",
          "Lançamento horizontal",
          "Uma bola rola com v=3 m/s de uma mesa de h=1,25 m. Tempo de queda? (g=10)",
          ["0,25 s", "0,5 s", "1 s", "1,5 s"], 1,
          "h = ½gt² → 1,25 = 5t² → t=0,5 s."),
      ],
    }),
  ],
});
