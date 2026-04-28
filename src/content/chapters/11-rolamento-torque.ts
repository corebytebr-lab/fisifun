import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkCase, mkDrag } from "../helpers";

export const cap11 = chapter({
  id: "11-rolamento-torque",
  number: 11,
  title: "Rolamento, Torque e Momento Angular",
  subtitle: "Conservação do momento angular, giroscópios e rolagem",
  color: "#a855f7",
  emoji: "💡",
  objectives: [
    "Analisar o rolamento como translação + rotação.",
    "Aplicar conservação do momento angular.",
    "Entender princípios de torque como vetor.",
  ],
  keyConcepts: [
    "Rolamento sem deslizar",
    "Momento angular (L)",
    "Conservação de L",
    "Torque vetorial",
  ],
  commonMistakes: [
    "Esquecer que v_cm = ωR no rolamento sem deslizar.",
    "Aplicar conservação de L quando há torque externo.",
    "Direção de L: use regra da mão direita.",
  ],
  units: ["kg·m²/s", "N·m"],
  formulas: [
    {
      id: "rolamento",
      name: "Condição de rolamento",
      latex: "v_{cm} = \\omega R",
      description: "Rolagem sem deslizar.",
      variables: [],
      whenToUse: "Roda, bola, cilindro rolando sem escorregar.",
    },
    {
      id: "K-rolamento",
      name: "Energia cinética no rolamento",
      latex: "K = \\tfrac{1}{2} m v_{cm}^2 + \\tfrac{1}{2} I \\omega^2",
      description: "Soma translação + rotação.",
      variables: [],
      whenToUse: "Corpo rolando.",
    },
    {
      id: "L",
      name: "Momento angular",
      latex: "\\vec{L} = \\vec{r} \\times \\vec{p} = I \\vec{\\omega}",
      description: "Vetorial, perpendicular ao plano de rotação.",
      variables: [],
      whenToUse: "Qualquer movimento rotacional.",
    },
    {
      id: "cons-L",
      name: "Conservação de L",
      latex: "\\sum \\vec{\\tau}_\\text{ext} = 0 \\Rightarrow \\vec{L} = \\text{const.}",
      description: "Momento angular conservado sem torque externo.",
      variables: [],
      whenToUse: "Patinador, planeta em órbita (em torno do sol, o torque é zero).",
    },
  ],
  lessons: [
    lesson("c11-l1", "Rolamento sem deslizar", "concept", 15, 6, {
      concepts: [
        {
          title: "A mágica do ponto de contato",
          body:
            "Quando uma roda rola sem deslizar, o ponto de contato com o chão está **momentaneamente em repouso**. Isso implica que $v_{cm} = \\omega R$.\n\n" +
            "Por isso, uma bola rolando numa rampa desce mais devagar que uma deslizando: parte da energia vai para $K_\\text{rot}$.",
        },
      ],
    }),
    lesson("c11-l2", "Energia no rolamento", "example", 25, 8, {
      exercises: [
        mkCase("c11-l2-e1",
          "Corrida",
          "Um aro, um disco e uma esfera maciça descem uma rampa com atrito (rolam sem deslizar). Quem chega primeiro?",
          [
            "O aro (I=mR²)",
            "O disco (I=½mR²)",
            "A esfera (I=2/5 mR²)",
            "Chegam juntos"
          ],
          2, "Menor I → menos energia fica 'presa' na rotação → CM mais rápido."),
        mkNum("c11-l2-e2",
          "Disco m=2 kg, R=0,1 m, rola com v_cm=3 m/s. Energia cinética total (J)?",
          13.5, 0.1,
          "K = ½mv² + ½Iω² = ½·2·9 + ½·½·2·0,01·900 = 9 + 4,5 = 13,5 J."),
        mkDrag("c11-l2-e3",
          "Condição de rolamento:",
          [
            { id: "v", label: "v_cm" },
            { id: "eq", label: "=" },
            { id: "w", label: "ω" },
            { id: "R", label: "R" },
          ],
          ["v", "eq", "w", "R"],
          "v_cm = ωR."),
      ],
    }),
    lesson("c11-l3", "Momento angular e conservação", "practice", 25, 8, {
      concepts: [
        {
          title: "Por que a patinadora gira mais rápido?",
          body:
            "Quando ela recolhe os braços, **I diminui**, mas $L = I\\omega$ **não pode mudar** (torque externo desprezível), então **ω cresce**.",
        },
      ],
      exercises: [
        mkNum("c11-l3-e1",
          "Patinadora com I₁=5 kg·m² girando a ω₁=2 rad/s recolhe os braços, ficando com I₂=2 kg·m². Novo ω?",
          5, 0.1, "Lconst: I₁ω₁ = I₂ω₂ → 10 = 2ω → ω = 5 rad/s."),
        mkTf("c11-l3-e2",
          "A conservação do momento angular funciona mesmo quando I varia.",
          true, "L = Iω. Se I cai, ω sobe, e vice-versa."),
        mkMc("c11-l3-e3",
          "Um planeta em órbita elíptica:",
          [
            "Tem L constante",
            "Tem v constante",
            "Tem K constante",
            "Tem a constante"
          ],
          0, "Torque gravitacional em relação ao Sol é zero → L conservado (2ª lei de Kepler)."),
      ],
    }),
    lesson("c11-l4", "Quiz — Rolamento e Momento Angular", "quiz", 50, 10, {
      exercises: [
        mkFill("c11-q-1",
          "No rolamento sem deslizar: v_cm = ω·___.",
          ["R", "r"], "Condição cinemática."),
        mkMc("c11-q-2",
          "A direção do vetor momento angular $\\vec{L}$ é dada pela:",
          ["Regra da mão esquerda", "Regra da mão direita", "Regra do paralelogramo", "Direção do movimento"],
          1, "Regra da mão direita."),
        mkCase("c11-q-3",
          "Giroscópio",
          "Por que um giroscópio mantém sua orientação mesmo quando balançado?",
          [
            "Por não ter massa",
            "Por conservação do momento angular",
            "Por atrito desprezível",
            "Por conservação da energia"
          ],
          1, "Sem torque externo significativo, L é preservado."),
        mkTf("c11-q-4",
          "Um iô-iô em queda sobre um fio exemplifica K_rot + K_trans.",
          true, "O iô-iô rola; parte de K vira rotação."),
      ],
    }),
  ],
});
