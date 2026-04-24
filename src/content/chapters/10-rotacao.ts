import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkDrag, mkCase } from "../helpers";

export const cap10 = chapter({
  id: "10-rotacao",
  number: 10,
  title: "Rotação",
  subtitle: "Cinemática angular, torque e momento de inércia",
  color: "#6366f1",
  emoji: "🌀",
  objectives: [
    "Aplicar equações cinemáticas angulares.",
    "Calcular momento de inércia de corpos rígidos.",
    "Usar τ = Iα e K_rot = ½Iω².",
  ],
  keyConcepts: [
    "Velocidade angular (ω)",
    "Aceleração angular (α)",
    "Momento de inércia (I)",
    "Torque (τ)",
    "Energia cinética de rotação",
  ],
  commonMistakes: [
    "Usar graus em vez de radianos.",
    "Esquecer que I depende do eixo de rotação.",
    "Confundir v = ωr com ω = v/r (tudo bem, é a mesma coisa) com α = a/r.",
  ],
  units: ["rad", "rad/s", "rad/s²", "kg·m²", "N·m"],
  formulas: [
    {
      id: "ang-linear",
      name: "Linear × angular",
      latex: "v = \\omega r, \\quad a_t = \\alpha r",
      description: "Relações entre grandezas lineares e angulares.",
      variables: [],
      whenToUse: "Conversão entre movimentos.",
    },
    {
      id: "mruv-ang",
      name: "Cinemática angular (α constante)",
      latex: "\\omega = \\omega_0 + \\alpha t, \\quad \\theta = \\theta_0 + \\omega_0 t + \\tfrac{1}{2}\\alpha t^2",
      description: "Analogia ao MRUV linear.",
      variables: [],
      whenToUse: "Rotação com α constante.",
    },
    {
      id: "torque",
      name: "Torque",
      latex: "\\tau = r\\,F\\,\\sin\\theta = I\\alpha",
      description: "Tendência de girar.",
      variables: [
        { symbol: "I", meaning: "momento de inércia", unit: "kg·m²" },
      ],
      whenToUse: "Problemas de rotação com força aplicada.",
    },
    {
      id: "krot",
      name: "Energia cinética de rotação",
      latex: "K_\\text{rot} = \\tfrac{1}{2} I \\omega^2",
      description: "Análoga à translacional ½mv².",
      variables: [],
      whenToUse: "Corpo girando sem transladar (ou combinado).",
    },
    {
      id: "I-aro",
      name: "I de aro (massa na borda)",
      latex: "I = m R^2",
      description: "Todas as massas à distância R.",
      variables: [],
      whenToUse: "Aro fino ou casca.",
    },
    {
      id: "I-disco",
      name: "I de disco/cilindro",
      latex: "I = \\tfrac{1}{2} m R^2",
      description: "Disco homogêneo em torno do eixo central.",
      variables: [],
      whenToUse: "Disco ou cilindro maciço.",
    },
  ],
  lessons: [
    lesson("c10-l1", "Cinemática angular", "concept", 15, 6, {
      concepts: [
        {
          title: "É a mesma coisa, com outras letras",
          body:
            "Substitua:\n- $x \\to \\theta$\n- $v \\to \\omega$\n- $a \\to \\alpha$\n\nE todas as equações do MRUV valem.\n\nRadianos são o 'SI natural' da rotação: $s = r\\theta$ (com θ em rad).",
        },
      ],
    }),
    lesson("c10-l2", "Momento de inércia", "example", 20, 7, {
      concepts: [
        {
          title: "Inércia de girar depende de como a massa se distribui",
          body:
            "$I = \\sum m_i r_i^2$. Quanto mais longe do eixo, mais difícil girar.\n\n" +
            "Teorema dos eixos paralelos: $I = I_{cm} + m d^2$.",
        },
      ],
      exercises: [
        mkNum("c10-l2-e1",
          "Disco maciço de m=2 kg e R=0,5 m. Momento de inércia (kg·m²)?",
          0.25, 0.005, "I = ½·2·0,25 = 0,25 kg·m²."),
        mkMc("c10-l2-e2",
          "Qual tem maior I (mesma massa e raio)?",
          ["Esfera maciça (I=2/5 mR²)", "Cilindro maciço (I=½mR²)", "Aro (I=mR²)", "Todos iguais"],
          2, "Aro tem massa toda na borda → maior I."),
        mkDrag("c10-l2-e3",
          "Monte K_rot:",
          [
            { id: "k", label: "K_rot" },
            { id: "eq", label: "=" },
            { id: "half", label: "½" },
            { id: "I", label: "I" },
            { id: "w2", label: "ω²" },
          ],
          ["k", "eq", "half", "I", "w2"],
          "K_rot = ½Iω²."),
      ],
    }),
    lesson("c10-l3", "Torque e 2ª lei angular", "practice", 25, 8, {
      exercises: [
        mkNum("c10-l3-e1",
          "Uma força de 10 N é aplicada perpendicularmente a 0,3 m do eixo. Torque?",
          3, 0.05, "τ = r·F = 0,3·10 = 3 N·m."),
        mkNum("c10-l3-e2",
          "I=0,5 kg·m², τ=2 N·m. α (rad/s²)?",
          4, 0.05, "α = τ/I = 4 rad/s²."),
        mkCase("c10-l3-e3",
          "Chave de boca",
          "Por que chaves longas são melhores?",
          ["Porque são mais leves", "Porque aumentam o braço de alavanca e o torque", "Porque aumentam a força aplicada", "Por estética"],
          1, "τ = rF. Maior r → maior τ com mesma F."),
      ],
    }),
    lesson("c10-l4", "Quiz — Rotação", "quiz", 45, 10, {
      exercises: [
        mkFill("c10-q-1",
          "A unidade de momento de inércia no SI é ___·m².",
          ["kg"], "I = Σmr²."),
        mkMc("c10-q-2",
          "Quando o patinador recolhe os braços, ω:",
          ["Aumenta", "Diminui", "Não muda", "Fica zero"], 0,
          "Recolher braços → I menor → ω maior (L conservado — ver próximo cap.)."),
        mkNum("c10-q-3",
          "Uma roda gira a 60 rpm. ω em rad/s?",
          6.28, 0.1, "60 rpm = 1 rps = 2π rad/s ≈ 6,28."),
        mkTf("c10-q-4",
          "Um objeto pode ter energia cinética de rotação mesmo com CM parado.",
          true, "Ex.: pião no lugar."),
      ],
    }),
  ],
});
