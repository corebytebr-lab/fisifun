import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkCase } from "../helpers";

export const cap09 = chapter({
  id: "09-centro-massa-momento",
  number: 9,
  title: "Centro de Massa e Momento Linear",
  subtitle: "Sistemas de partículas, colisões e impulso",
  color: "#8b5cf6",
  emoji: "💥",
  objectives: [
    "Localizar o centro de massa de sistemas simples.",
    "Aplicar conservação do momento linear.",
    "Diferenciar colisões elástica, inelástica e perfeitamente inelástica.",
    "Usar impulso = ΔP.",
  ],
  keyConcepts: [
    "Centro de massa",
    "Momento linear (p)",
    "Impulso (J)",
    "Conservação do momento linear",
    "Colisão elástica e inelástica",
  ],
  commonMistakes: [
    "Esquecer que conservação do momento requer força externa resultante nula.",
    "Aplicar conservação de energia cinética em colisão inelástica.",
    "Confundir impulso com força.",
  ],
  units: ["kg·m/s", "N·s"],
  formulas: [
    {
      id: "cm",
      name: "Centro de massa",
      latex: "\\vec{r}_{cm} = \\dfrac{\\sum m_i \\vec{r}_i}{\\sum m_i}",
      description: "Média ponderada das posições.",
      variables: [],
      whenToUse: "Sistema de várias partículas.",
    },
    {
      id: "momento",
      name: "Momento linear",
      latex: "\\vec{p} = m\\vec{v}",
      description: "Produto da massa pela velocidade.",
      variables: [],
      whenToUse: "Todo movimento.",
    },
    {
      id: "impulso",
      name: "Impulso",
      latex: "\\vec{J} = \\int \\vec{F}\\,dt = \\Delta \\vec{p}",
      description: "Impulso iguala a variação do momento.",
      variables: [],
      whenToUse: "Colisões, forças por curto período.",
    },
    {
      id: "cons-p",
      name: "Conservação do momento",
      latex: "\\sum \\vec{p}_i = \\sum \\vec{p}_f",
      description: "Em sistemas isolados, P_total é constante.",
      variables: [],
      whenToUse: "Nenhuma força externa resultante.",
    },
  ],
  lessons: [
    lesson("c9-l1", "Centro de massa", "concept", 15, 6, {
      concepts: [
        {
          title: "O CM é o 'ponto representativo'",
          body:
            "O centro de massa se move como se toda a massa do sistema estivesse lá, empurrada pela **resultante externa**.\n\n" +
            "Para duas massas: $x_{cm} = (m_1 x_1 + m_2 x_2)/(m_1+m_2)$.",
        },
      ],
    }),
    lesson("c9-l2", "Momento linear e impulso", "example", 25, 8, {
      concepts: [
        {
          title: "Uma outra cara da 2ª lei",
          body:
            "$$ \\vec{F} = \\dfrac{d\\vec{p}}{dt} $$\n\n" +
            "Integre no tempo e obtém o impulso: $\\vec{J} = \\Delta\\vec{p}$.",
        },
      ],
      exercises: [
        mkNum("c9-l2-e1",
          "Bola de 0,5 kg a 10 m/s é rebatida e volta a 10 m/s no sentido oposto. Módulo da variação do momento (kg·m/s)?",
          10, 0.1, "Δp = 0,5·10 - 0,5·(-10) = 10 kg·m/s."),
        mkNum("c9-l2-e2",
          "Se o contato durou 0,02 s, força média (N)?",
          500, 1, "F = Δp/Δt = 10/0,02 = 500 N."),
      ],
    }),
    lesson("c9-l3", "Colisões", "practice", 25, 8, {
      concepts: [
        {
          title: "Tipos de colisão",
          body:
            "- **Elástica**: conservam momento **e** energia cinética (idealizada).\n- **Inelástica**: momento sim, K não.\n- **Perfeitamente inelástica**: corpos se 'grudam' após bater.",
        },
      ],
      exercises: [
        mkNum("c9-l3-e1",
          "Colisão perfeitamente inelástica: m₁=2 kg a 6 m/s colide e 'gruda' em m₂=4 kg parado. Velocidade final?",
          2, 0.01, "p antes = 12. Depois: 6·v → v = 2 m/s."),
        mkCase("c9-l3-e2",
          "Tipo de colisão",
          "Duas bolas de bilhar colidem frontalmente e retornam sem perda apreciável de K. A colisão é:",
          ["Inelástica", "Perfeitamente inelástica", "Elástica (boa aproximação)", "Explosiva"],
          2, "K conservada → elástica."),
        mkTf("c9-l3-e3",
          "Em toda colisão isolada, o momento linear se conserva.",
          true, "Mesmo que energia não se conserve, o momento sim (se não há forças externas)."),
      ],
    }),
    lesson("c9-l4", "Quiz — Momento", "quiz", 45, 10, {
      exercises: [
        mkFill("c9-q-1",
          "O momento linear é o produto de massa e ___.",
          ["velocidade", "v"], "p = mv."),
        mkMc("c9-q-2",
          "Um canhão atira uma bala. Pela conservação do momento, o canhão:",
          ["Fica parado", "Move-se no mesmo sentido da bala", "Move-se no sentido oposto", "Explode"],
          2, "Recuo: p_total antes = 0 = p_canhão + p_bala, logo p_canhão = -p_bala."),
        mkNum("c9-q-3",
          "Patinador de 50 kg empurra outro de 70 kg, ficando com v=-2,8 m/s. Velocidade do outro?",
          2, 0.01, "50·2,8 = 70·v → v = 2 m/s."),
        mkTf("c9-q-4",
          "Em colisão inelástica, pode haver geração de calor.",
          true, "Energia cinética vira outras formas de energia."),
      ],
    }),
  ],
});
