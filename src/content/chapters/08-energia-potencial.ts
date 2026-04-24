import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkDrag, mkCase } from "../helpers";

export const cap08 = chapter({
  id: "08-energia-potencial",
  number: 8,
  title: "Energia Potencial e Conservação",
  subtitle: "Conservação de energia mecânica e forças dissipativas",
  color: "#10b981",
  emoji: "🔋",
  objectives: [
    "Definir energia potencial gravitacional e elástica.",
    "Aplicar a conservação da energia mecânica.",
    "Tratar forças dissipativas (atrito) usando ΔE = -f·d.",
    "Interpretar curvas de energia potencial.",
  ],
  keyConcepts: [
    "Forças conservativas",
    "Energia potencial gravitacional (Ug)",
    "Energia potencial elástica (Ue)",
    "Conservação da energia mecânica",
    "Curva U(x)",
  ],
  commonMistakes: [
    "Esquecer de escolher um nível de referência para Ug.",
    "Aplicar conservação quando há atrito.",
    "Sinal da altura (h deve ser positivo quando acima do referencial).",
  ],
  units: ["J", "m"],
  formulas: [
    {
      id: "Ug",
      name: "Potencial gravitacional",
      latex: "U_g = m\\,g\\,h",
      description: "Energia armazenada pela gravidade.",
      variables: [
        { symbol: "h", meaning: "altura em relação ao referencial", unit: "m" },
      ],
      whenToUse: "Próximo à superfície da Terra.",
    },
    {
      id: "Ue",
      name: "Potencial elástica",
      latex: "U_e = \\tfrac{1}{2} k x^2",
      description: "Energia armazenada na mola deformada.",
      variables: [],
      whenToUse: "Mola ideal (Hooke).",
    },
    {
      id: "conservacao",
      name: "Conservação da energia mecânica",
      latex: "K_i + U_i = K_f + U_f",
      description: "Em sistemas sem dissipação, E_mec é constante.",
      variables: [],
      whenToUse: "Só forças conservativas agem.",
    },
    {
      id: "com-atrito",
      name: "Com atrito (energia não conservada)",
      latex: "E_{f} - E_{i} = -f\\,d",
      description: "Atrito remove energia do sistema.",
      variables: [],
      whenToUse: "Superfícies com atrito.",
    },
  ],
  lessons: [
    lesson("c8-l1", "Forças conservativas", "concept", 15, 6, {
      concepts: [
        {
          title: "Quem é conservativa?",
          body:
            "Uma força é **conservativa** se o trabalho que ela realiza não depende do caminho, só dos extremos.\n\n" +
            "Exemplos: gravidade, força de mola. Para essas, podemos definir uma **energia potencial**.\n\n" +
            "**Não** conservativas: atrito, arrasto.",
        },
      ],
    }),
    lesson("c8-l2", "Conservação de energia mecânica", "example", 25, 8, {
      concepts: [
        {
          title: "A ideia central",
          body:
            "Sem dissipação, energia mecânica $E = K + U$ é **constante**.\n\n" +
            "No caminho de um pêndulo, toda altura que ele ganha (U sobe) ele perde em velocidade (K cai) — e vice-versa.",
        },
      ],
      exercises: [
        mkNum("c8-l2-e1",
          "Uma pedra de 2 kg cai de h=5 m em queda livre. Velocidade ao chegar no chão (g=10)?",
          10, 0.1, "½·2·v² = 2·10·5 → v² = 100 → v = 10 m/s."),
        mkNum("c8-l2-e2",
          "Uma mola com k=400 N/m comprimida por 0,2 m lança uma bolinha de 0,5 kg. Velocidade máxima?",
          5.66, 0.1, "½·400·0,04 = ½·0,5·v² → 8 = 0,25 v² → v² = 32 → v ≈ 5,66 m/s."),
        mkCase("c8-l2-e3",
          "Loop",
          "Um carrinho de massa m deve fazer um loop de raio r. Altura mínima h de onde deve partir (sem atrito)?",
          ["r", "1,5 r", "2 r", "2,5 r"], 3,
          "Topo do loop exige v²=gr, então ½mv²=mg(h-2r) → h=2,5r."),
      ],
    }),
    lesson("c8-l3", "Atrito dissipando energia", "practice", 20, 7, {
      exercises: [
        mkNum("c8-l3-e1",
          "Um bloco de 2 kg, partindo do repouso em h=5 m, desce uma rampa com atrito e chega à base com v=8 m/s. Energia dissipada (J, g=10)?",
          36, 1, "E_i = mgh = 100 J. E_f = ½·2·64 = 64 J. Dissipada = 36 J."),
        mkTf("c8-l3-e2",
          "Em situações com atrito, a energia total do Universo é conservada.",
          true, "Energia se transforma em calor; conservação continua válida num sentido amplo."),
        mkDrag("c8-l3-e3",
          "Monte: energia dissipada",
          [
            { id: "E", label: "ΔE" },
            { id: "eq", label: "=" },
            { id: "neg", label: "−" },
            { id: "f", label: "f" },
            { id: "d", label: "d" },
          ],
          ["E", "eq", "neg", "f", "d"],
          "ΔE = −f·d (atrito).")
      ],
    }),
    lesson("c8-l4", "Curvas U(x)", "example", 20, 7, {
      concepts: [
        {
          title: "O que o gráfico diz",
          body:
            "Num gráfico $U(x)$, a **força** é $F = -dU/dx$: a inclinação **negativa** dá a força.\n\n" +
            "- Mínimos de U: equilíbrio **estável** (vai voltar se perturbado).\n- Máximos: equilíbrio **instável**.\n- Pontos de retorno: onde $K = E - U = 0$.",
        },
      ],
      exercises: [
        mkMc("c8-l4-e1",
          "Num ponto onde U tem mínimo, o equilíbrio é:",
          ["Estável", "Instável", "Indiferente", "Não há equilíbrio"],
          0, "Mínimo → força restauradora → estável."),
        mkTf("c8-l4-e2",
          "Se E < U_min, o corpo pode ficar em repouso no fundo do poço potencial.",
          false, "Energia total não pode ser menor que o mínimo da energia potencial."),
      ],
    }),
    lesson("c8-l5", "Quiz — Energia", "quiz", 50, 10, {
      exercises: [
        mkFill("c8-q-1",
          "A energia potencial gravitacional é ___·g·h.",
          ["m", "mg", "m·g"], "Ug = mgh."),
        mkNum("c8-q-2",
          "Mola k=100 N/m comprimida 0,3 m. Energia elástica (J)?",
          4.5, 0.1, "½·100·0,09 = 4,5 J."),
        mkMc("c8-q-3",
          "Num sistema isolado sem atrito, a energia mecânica:",
          ["Aumenta", "Diminui", "Se conserva", "Oscila"], 2),
        mkCase("c8-q-4",
          "Montanha-russa",
          "Um carrinho a 5 m/s sobe uma rampa sem atrito. Altura máxima atingida (g=10)?",
          ["0,5 m", "1 m", "1,25 m", "2,5 m"], 2,
          "½v²=gh → h = 25/20 = 1,25 m."),
        mkTf("c8-q-5",
          "Uma força conservativa produz trabalho dependente do caminho.",
          false, "Conservativa: independente do caminho."),
      ],
    }),
  ],
});
