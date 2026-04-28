import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkCase } from "../helpers";

export const cap06 = chapter({
  id: "06-forca-ii",
  number: 6,
  title: "Força e Movimento — II",
  subtitle: "Atrito, força de arrasto e MCU",
  color: "#dc2626",
  emoji: "🚗",
  objectives: [
    "Diferenciar atrito estático e cinético.",
    "Aplicar atrito em problemas de Newton.",
    "Analisar força de arrasto e velocidade terminal.",
    "Resolver problemas de MCU com forças.",
  ],
  keyConcepts: [
    "Atrito estático e cinético",
    "μₛ e μ_c",
    "Força de arrasto",
    "Velocidade terminal",
    "Forças em MCU",
  ],
  commonMistakes: [
    "Aplicar atrito estático quando há movimento (correto é cinético).",
    "Usar N = mg sem checar (em rampas ou elevadores é diferente).",
    "Esquecer que no MCU a força resultante é centrípeta.",
  ],
  units: ["N", "kg", "m/s"],
  formulas: [
    {
      id: "at-est",
      name: "Atrito estático",
      latex: "f_s \\le \\mu_s N",
      description: "Atrito estático varia até um máximo.",
      variables: [
        { symbol: "\\mu_s", meaning: "coeficiente de atrito estático", unit: "-" },
        { symbol: "N", meaning: "força normal", unit: "N" },
      ],
      whenToUse: "Corpo ainda parado na iminência de deslizar.",
    },
    {
      id: "at-cin",
      name: "Atrito cinético",
      latex: "f_c = \\mu_c N",
      description: "Atrito cinético é constante (aproximadamente).",
      variables: [
        { symbol: "\\mu_c", meaning: "coeficiente de atrito cinético", unit: "-" },
      ],
      whenToUse: "Corpo já em movimento.",
    },
    {
      id: "fcp",
      name: "Força centrípeta",
      latex: "F_{cp} = \\dfrac{mv^2}{r}",
      description: "Força resultante radial em MCU.",
      variables: [],
      whenToUse: "Corpo em movimento circular.",
    },
    {
      id: "arrasto",
      name: "Força de arrasto (simplificada)",
      latex: "F_d = \\tfrac{1}{2} C\\,\\rho\\,A\\,v^2",
      description: "Resistência do fluido, cresce com v².",
      variables: [
        { symbol: "C", meaning: "coeficiente de arrasto", unit: "-" },
        { symbol: "\\rho", meaning: "densidade do fluido", unit: "kg/m³" },
        { symbol: "A", meaning: "área frontal", unit: "m²" },
      ],
      whenToUse: "Movimento em ar ou água a velocidades moderadas.",
    },
  ],
  lessons: [
    lesson("c6-l1", "Atrito — estático × cinético", "concept", 15, 6, {
      concepts: [
        {
          title: "Duas personalidades do atrito",
          body:
            "**Atrito estático**: impede o movimento começar. É *adaptativo*: $0 \\le f_s \\le \\mu_s N$. Só atinge o máximo na iminência de deslizar.\n\n" +
            "**Atrito cinético**: aparece quando já há movimento. É *constante*: $f_c = \\mu_c N$ e, em geral, $\\mu_c < \\mu_s$.",
        },
      ],
    }),
    lesson("c6-l2", "Atrito em plano inclinado", "example", 25, 8, {
      concepts: [
        {
          title: "Equacionando",
          body:
            "No plano inclinado com atrito cinético:\n" +
            "- $N = m g \\cos\\theta$.\n" +
            "- Força paralela ao plano: $m g \\sin\\theta - \\mu_c m g \\cos\\theta = m a$.\n\n" +
            "Ou seja: $a = g(\\sin\\theta - \\mu_c \\cos\\theta)$.",
        },
      ],
      exercises: [
        mkNum("c6-l2-e1",
          "θ=30°, μ_c=0,2, g=10. Aceleração descendo o plano (m/s²)?",
          3.27, 0.1,
          "a = 10·(0,5 - 0,2·0,866) ≈ 10·(0,5 - 0,173) ≈ 3,27 m/s²."),
        mkTf("c6-l2-e2",
          "Para um corpo escorregar por um plano inclinado, μ_s deve ser menor que tan θ.",
          true, "A condição é tg θ ≥ μ_s."),
        mkCase("c6-l2-e3",
          "Aplicação",
          "Um carro em uma estrada horizontal arranca e os pneus derrapam. O atrito que atua nos pneus é:",
          ["Estático, no sentido do movimento", "Cinético, oposto ao movimento", "Estático, oposto ao movimento", "Nulo"],
          1, "Derrapar significa deslizar; atrito cinético."),
      ],
    }),
    lesson("c6-l3", "MCU e força centrípeta", "practice", 25, 8, {
      concepts: [
        {
          title: "Quem faz o papel de força centrípeta?",
          body:
            "A **força centrípeta não é um tipo especial** de força: é a *resultante radial* que mantém o corpo em curva.\n\n" +
            "Exemplos: a tração na corda, a normal no loop, o atrito estático numa curva plana.",
        },
      ],
      exercises: [
        mkNum("c6-l3-e1",
          "Um carro de 1000 kg em curva de raio 50 m a 10 m/s. Força centrípeta necessária?",
          2000, 1, "F = 1000·100/50 = 2000 N."),
        mkCase("c6-l3-e2",
          "Curva com atrito",
          "Em uma curva horizontal, a força centrípeta para manter o carro na trajetória vem:",
          ["Do peso", "Da normal", "Do atrito estático entre pneus e pista", "Do motor"],
          2, "Sem o atrito estático, o carro derrapa."),
        mkNum("c6-l3-e3",
          "Uma criança num balanço passa pelo ponto mais baixo a 4 m/s, cabo de 2 m, criança 30 kg. Tensão (g=10)?",
          540, 1, "T - mg = mv²/r → T = 300 + 30·16/2 = 300 + 240 = 540 N."),
      ],
    }),
    lesson("c6-l4", "Força de arrasto e velocidade terminal", "example", 20, 7, {
      concepts: [
        {
          title: "Por que o arrasto cresce com v²?",
          body:
            "O ar (ou outro fluido) 'empurra' o corpo cada vez mais forte conforme ele vai mais rápido. Para a maioria dos casos do dia a dia, $F_d \\propto v^2$.\n\n" +
            "Quando o arrasto iguala a gravidade, a aceleração fica zero — é a **velocidade terminal** $v_t$.",
        },
      ],
      exercises: [
        mkTf("c6-l4-e1",
          "Na velocidade terminal, a soma das forças sobre o corpo é zero.",
          true, "a = 0 implica F_res = 0."),
        mkMc("c6-l4-e2",
          "Dois paraquedistas iguais, mas o A abriu o paraquedas. Comparando as velocidades terminais, v_tA:",
          ["Maior que v_tB", "Igual a v_tB", "Menor que v_tB", "Não se pode dizer"],
          2, "Paraquedas aumenta área → maior arrasto → v_t menor."),
      ],
    }),
    lesson("c6-l5", "Quiz — Forças II", "quiz", 45, 10, {
      exercises: [
        mkFill("c6-q-1",
          "O atrito estático é no máximo igual a ___·N.",
          ["μs", "μ_s", "μₛ", "mu_s"], "f_s,max = μ_s·N."),
        mkMc("c6-q-2",
          "Em um loop vertical, no ponto mais alto, a normal é minimizada quando:",
          ["v é muito grande", "v = 0", "v² = gr", "v² = 2gr"],
          2, "Condição limite: N=0 → mg = mv²/r → v² = gr."),
        mkNum("c6-q-3",
          "μ_s=0,4 entre caixa e chão, m=5 kg, g=10. Força mínima horizontal (N) para começar a empurrar?",
          20, 0.5, "F = μ_s·m·g = 0,4·50 = 20 N."),
        mkTf("c6-q-4",
          "Em uma curva inclinada (peralte), o atrito é sempre necessário.",
          false, "Com peralte ideal, a normal fornece toda a força centrípeta."),
      ],
    }),
  ],
});
