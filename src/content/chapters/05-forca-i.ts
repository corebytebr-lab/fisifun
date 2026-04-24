import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkDrag, mkOrder, mkCase } from "../helpers";

export const cap05 = chapter({
  id: "05-forca-i",
  number: 5,
  title: "Força e Movimento — I",
  subtitle: "As leis de Newton",
  color: "#ef4444",
  emoji: "🍎",
  objectives: [
    "Enunciar as três leis de Newton.",
    "Construir diagramas de corpo livre (DCL).",
    "Aplicar F = ma em sistemas simples.",
  ],
  keyConcepts: [
    "Força, massa e inércia",
    "Peso × massa",
    "Normal",
    "Tensão",
    "DCL",
  ],
  commonMistakes: [
    "Confundir peso (N) com massa (kg).",
    "Esquecer que a força normal nem sempre é igual ao peso.",
    "Aplicar a 3ª lei em forças no mesmo corpo (ação-reação atuam em corpos diferentes).",
  ],
  units: ["N", "kg", "m/s²"],
  formulas: [
    {
      id: "f-ma",
      name: "2ª Lei de Newton",
      latex: "\\sum \\vec{F} = m\\,\\vec{a}",
      description: "A força resultante produz aceleração proporcional e no mesmo sentido.",
      variables: [
        { symbol: "\\vec{F}", meaning: "força", unit: "N" },
        { symbol: "m", meaning: "massa", unit: "kg" },
        { symbol: "\\vec{a}", meaning: "aceleração", unit: "m/s²" },
      ],
      whenToUse: "Quando há forças resultantes atuando no corpo.",
    },
    {
      id: "peso",
      name: "Peso",
      latex: "P = m\\,g",
      description: "Força gravitacional na superfície da Terra.",
      variables: [
        { symbol: "g", meaning: "aceleração da gravidade ≈ 9,8 m/s²", unit: "m/s²" },
      ],
      whenToUse: "Sempre que a gravidade age.",
    },
    {
      id: "normal",
      name: "Força normal",
      latex: "N = P\\cos\\theta \\text{ (plano inclinado)}",
      description: "Força de contato perpendicular à superfície.",
      variables: [],
      whenToUse: "Corpo apoiado em superfície.",
    },
  ],
  lessons: [
    lesson("c5-l1", "As 3 leis de Newton", "concept", 15, 6, {
      concepts: [
        {
          title: "Em uma frase cada uma",
          body:
            "1. **Inércia**: todo corpo mantém seu estado (repouso ou MRU) se não houver força resultante.\n" +
            "2. **Fundamental**: $\\sum \\vec{F} = m\\vec{a}$.\n" +
            "3. **Ação-Reação**: para toda força, existe outra de igual módulo e sentido oposto, aplicada no *outro corpo*.",
        },
        {
          title: "Peso × Massa (não confunda!)",
          body:
            "**Massa** ($m$, kg) é uma propriedade do corpo; não muda com o lugar.\n\n" +
            "**Peso** ($P$, N) é a força que a gravidade faz: $P = m g$. Muda com a gravidade local.\n\n" +
            "Na Lua, sua massa é a mesma, mas o peso é ~1/6 do da Terra.",
        },
      ],
    }),
    lesson("c5-l2", "Diagrama de corpo livre", "example", 25, 8, {
      concepts: [
        {
          title: "O DCL resolve 90% dos problemas",
          body:
            "Sempre que aparecer um problema de Newton:\n- Isole o corpo.\n- Desenhe **todas** as forças que atuam nele (peso, normal, tensão, atrito, aplicada).\n- Escolha eixos (um geralmente paralelo ao movimento).\n- Escreva $\\sum F_x = m a_x$ e $\\sum F_y = m a_y$.",
        },
      ],
      exercises: [
        mkNum("c5-l2-e1",
          "Uma caixa de 10 kg recebe uma força horizontal de 30 N em superfície sem atrito. Aceleração?",
          3, 0.05, "a = F/m = 30/10 = 3 m/s²."),
        mkNum("c5-l2-e2",
          "Bloco de 5 kg no plano horizontal, apoiado. Qual a normal (N)? (g=10)",
          50, 0.1, "N = P = mg = 50 N."),
        mkMc("c5-l2-e3",
          "No plano inclinado sem atrito, a aceleração do bloco é:",
          ["g", "g cos θ", "g sen θ", "mg sen θ"], 2,
          "F resultante = mg senθ → a = g senθ."),
        mkDrag("c5-l2-e4",
          "Monte a 2ª lei:",
          [
            { id: "F", label: "F" },
            { id: "eq", label: "=" },
            { id: "m", label: "m" },
            { id: "a", label: "a" },
          ],
          ["F", "eq", "m", "a"],
          "F = m·a."),
      ],
    }),
    lesson("c5-l3", "Forças em cordas e polias", "practice", 25, 8, {
      concepts: [
        {
          title: "Cordas ideais: mesma tensão nas pontas",
          body:
            "Cordas **ideais** (sem massa, inextensíveis) transmitem a mesma **tensão** em toda a extensão.\n\n" +
            "**Polia ideal** (sem massa e sem atrito) simplesmente muda a direção da tensão.",
        },
      ],
      exercises: [
        mkNum("c5-l3-e1",
          "Dois blocos, m₁=2 kg e m₂=3 kg, conectados por corda, sendo m₁ puxado por F=20 N (sem atrito). Aceleração do sistema?",
          4, 0.05, "a = F/(m₁+m₂) = 20/5 = 4 m/s²."),
        mkNum("c5-l3-e2",
          "Mesmo sistema: tensão na corda (N)?",
          12, 0.1, "T = m₂·a = 3·4 = 12 N."),
        mkOrder("c5-l3-e3",
          "Ordene os passos para resolver um problema com polia:",
          [
            "Desenhar DCL de cada corpo.",
            "Escolher sentido positivo consistente com o movimento.",
            "Escrever ∑F = m a para cada corpo.",
            "Resolver o sistema de equações."
          ],
          "Essa rotina é universal."),
        mkCase("c5-l3-e4",
          "Elevador acelerando",
          "Sua massa é 60 kg. Em um elevador acelerando para cima a 2 m/s² (g=10), qual a leitura da balança?",
          ["480 N", "600 N", "720 N", "840 N"], 2,
          "N - mg = ma → N = m(g+a) = 60·12 = 720 N."),
      ],
    }),
    lesson("c5-l4", "Quiz — Forças I", "quiz", 45, 10, {
      exercises: [
        mkTf("c5-q-1",
          "A 3ª lei de Newton afirma que ação e reação atuam no mesmo corpo.",
          false, "Atuam em corpos diferentes."),
        mkMc("c5-q-2",
          "Unidade de força no SI:",
          ["Joule", "Newton", "Watt", "Pascal"], 1),
        mkFill("c5-q-3",
          "Se um corpo se move em MRU, a força resultante sobre ele é ___.",
          ["zero", "nula", "0"], "MRU → a = 0 → F = 0."),
        mkNum("c5-q-4",
          "Bloco de 4 kg sobe um plano inclinado a 30° com atrito desprezível. Qual a aceleração (m/s², g=10)?",
          -5, 0.1,
          "Convenção: subindo é positivo; a = -g sin θ = -5 m/s² (desaceleração)."),
        mkCase("c5-q-5",
          "Foguete",
          "Um foguete expele gases para baixo. Por que ele sobe?",
          [
            "Porque o ar empurra o foguete",
            "Porque os gases puxam o foguete por cordas",
            "Pela reação à força que o foguete faz nos gases",
            "Porque a gravidade empurra para cima"
          ],
          2, "3ª lei: o foguete empurra os gases para baixo e ganha igual força para cima."),
      ],
    }),
  ],
});
