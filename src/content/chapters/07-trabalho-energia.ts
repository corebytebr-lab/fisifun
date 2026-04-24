import { chapter, lesson, mkMc, mkTf, mkFill, mkNum, mkDrag, mkCase } from "../helpers";

export const cap07 = chapter({
  id: "07-trabalho-energia",
  number: 7,
  title: "Energia Cinética e Trabalho",
  subtitle: "Trabalho de forças, potência e teorema trabalho-energia",
  color: "#14b8a6",
  emoji: "⚡",
  objectives: [
    "Definir trabalho e energia cinética.",
    "Aplicar o teorema trabalho-energia cinética.",
    "Calcular trabalho de forças constantes e variáveis (molas).",
    "Calcular potência.",
  ],
  keyConcepts: [
    "Trabalho (W)",
    "Energia cinética (K)",
    "Teorema trabalho-energia",
    "Lei de Hooke",
    "Potência média e instantânea",
  ],
  commonMistakes: [
    "Esquecer o cosseno do ângulo entre F e deslocamento.",
    "Achar que trabalho sempre é positivo.",
    "Confundir potência com energia.",
  ],
  units: ["J", "W", "N", "m"],
  formulas: [
    {
      id: "K",
      name: "Energia cinética",
      latex: "K = \\tfrac{1}{2} m v^2",
      description: "Energia associada ao movimento.",
      variables: [
        { symbol: "m", meaning: "massa", unit: "kg" },
        { symbol: "v", meaning: "velocidade", unit: "m/s" },
      ],
      whenToUse: "Sempre que o corpo tem velocidade.",
    },
    {
      id: "W-const",
      name: "Trabalho (força constante)",
      latex: "W = F\\,d\\,\\cos\\theta",
      description: "Produto escalar entre F e deslocamento.",
      variables: [
        { symbol: "\\theta", meaning: "ângulo entre F e d", unit: "rad" },
      ],
      whenToUse: "Força constante, deslocamento retilíneo.",
    },
    {
      id: "te-k",
      name: "Teorema trabalho-energia",
      latex: "W_{\\text{res}} = \\Delta K",
      description: "Trabalho total = variação da energia cinética.",
      variables: [],
      whenToUse: "Quase sempre que aparecer trabalho/energia.",
    },
    {
      id: "hooke",
      name: "Lei de Hooke",
      latex: "F = -k x",
      description: "Força elástica proporcional ao deslocamento.",
      variables: [
        { symbol: "k", meaning: "constante elástica", unit: "N/m" },
        { symbol: "x", meaning: "deformação", unit: "m" },
      ],
      whenToUse: "Mola ideal.",
    },
    {
      id: "W-mola",
      name: "Trabalho da mola",
      latex: "W = -\\tfrac{1}{2} k x^2",
      description: "Área (negativa) do gráfico F×x.",
      variables: [],
      whenToUse: "Deformações em mola.",
    },
    {
      id: "potencia",
      name: "Potência",
      latex: "P = \\dfrac{dW}{dt} = \\vec{F}\\cdot\\vec{v}",
      description: "Taxa de trabalho realizado.",
      variables: [],
      whenToUse: "Quando interessa a rapidez do trabalho.",
    },
  ],
  lessons: [
    lesson("c7-l1", "Trabalho de uma força constante", "concept", 15, 6, {
      concepts: [
        {
          title: "Trabalho = força × deslocamento × cos θ",
          body:
            "O **trabalho** mede a transferência de energia por uma força:\n\n" +
            "$$ W = F\\,d\\,\\cos\\theta $$\n\n" +
            "- Se $\\theta = 0°$ → máximo.\n- Se $\\theta = 90°$ → zero.\n- Se $\\theta = 180°$ → negativo (força freia).",
        },
      ],
    }),
    lesson("c7-l2", "Trabalho e energia cinética", "example", 25, 8, {
      exercises: [
        mkNum("c7-l2-e1",
          "Um bloco de 2 kg é empurrado por F=10 N paralela ao movimento por 5 m. Trabalho (J)?",
          50, 0.5, "W = 10·5 = 50 J."),
        mkNum("c7-l2-e2",
          "Pelo teorema W=ΔK, se partiu do repouso, qual a velocidade final?",
          7.07, 0.1, "½·2·v² = 50 → v² = 50 → v ≈ 7,07 m/s."),
        mkMc("c7-l2-e3",
          "Uma força perpendicular ao deslocamento realiza trabalho:",
          ["Positivo", "Negativo", "Nulo", "Depende"],
          2, "cos(90°)=0."),
        mkDrag("c7-l2-e4",
          "Monte a energia cinética:",
          [
            { id: "K", label: "K" },
            { id: "eq", label: "=" },
            { id: "half", label: "½" },
            { id: "m", label: "m" },
            { id: "v2", label: "v²" },
          ],
          ["K", "eq", "half", "m", "v2"],
          "K = ½mv²."),
      ],
    }),
    lesson("c7-l3", "Trabalho da mola", "example", 20, 7, {
      concepts: [
        {
          title: "Mola: força varia com x",
          body:
            "A força da mola é proporcional à deformação: $F = -kx$.\n\n" +
            "Como F varia, o trabalho é a **área** sob o gráfico F×x → é um triângulo:\n\n" +
            "$$ W_\\text{mola} = -\\tfrac{1}{2} k x^2 $$",
        },
      ],
      exercises: [
        mkNum("c7-l3-e1",
          "k = 200 N/m, você estica a mola por 0,1 m. Trabalho que você realiza (J)?",
          1, 0.01, "W = ½·200·(0,1)² = 1 J (positivo, pois aplica força no mesmo sentido do deslocamento)."),
        mkTf("c7-l3-e2",
          "O trabalho da mola é sempre negativo quando a mola restaura o corpo para o equilíbrio.",
          true, "Restaura → força oposta ao deslocamento → trabalho negativo."),
      ],
    }),
    lesson("c7-l4", "Potência", "practice", 20, 7, {
      concepts: [
        {
          title: "Potência = rapidez do trabalho",
          body:
            "Potência é quanta energia (trabalho) por unidade de tempo.\n\n" +
            "$$ P = \\dfrac{W}{\\Delta t} = \\vec{F}\\cdot\\vec{v} $$\n\n" +
            "Unidade no SI: **watt (W)** = J/s. 1 HP ≈ 746 W.",
        },
      ],
      exercises: [
        mkNum("c7-l4-e1",
          "Um motor realiza 3000 J de trabalho em 5 s. Potência média (W)?",
          600, 1, "P = 3000/5 = 600 W."),
        mkCase("c7-l4-e2",
          "Elevador",
          "Um elevador com carga total 800 kg sobe com velocidade constante de 2 m/s. Potência necessária (g=10)?",
          ["8 kW", "16 kW", "1,6 kW", "80 kW"], 1,
          "P = F·v = mg·v = 8000·2 = 16000 W = 16 kW."),
      ],
    }),
    lesson("c7-l5", "Quiz — Trabalho e Energia", "quiz", 50, 10, {
      exercises: [
        mkFill("c7-q-1",
          "A unidade SI do trabalho é o ___.",
          ["joule", "J"], "1 J = 1 N·m."),
        mkNum("c7-q-2",
          "Uma força de 20 N é aplicada formando 60° com o deslocamento de 3 m. Trabalho (J)?",
          30, 0.5, "W = 20·3·cos(60°) = 30 J."),
        mkMc("c7-q-3",
          "A energia cinética dobra quando:",
          ["v dobra", "v é multiplicada por √2", "m dobra", "Ambas (v por √2) ou (m dobra)"],
          3, "K = ½mv²: dobra m OU v²."),
        mkTf("c7-q-4",
          "Se o trabalho resultante é negativo, a energia cinética diminui.",
          true, "W_res = ΔK."),
        mkNum("c7-q-5",
          "Um bloco de 4 kg recebe W_res = 50 J partindo do repouso. Velocidade final?",
          5, 0.1, "½·4·v² = 50 → v² = 25 → v = 5 m/s."),
      ],
    }),
  ],
});
