import { chapter, lesson, mkMc, mkTf, mkNum, mkFill } from "../helpers";
import type { Chapter } from "@/lib/types";

/**
 * Capítulos de Geometria Analítica (10) baseados em Winterle, Reis & Silva e
 * nos slides do prof. Luiz Fernando (IFG — Tópicos 01, 02, 03). Conteúdo
 * cobre R², R³, vetores, retas, planos e cônicas.
 */

const cap01: Chapter = chapter({
  id: "ga01-plano-cartesiano",
  number: 1,
  subject: "ga",
  title: "Plano Cartesiano e Distâncias em R²",
  subtitle: "Coordenadas, distância entre pontos e ponto médio",
  color: "#0ea5e9",
  emoji: "📍",
  objectives: [
    "Representar pontos no plano cartesiano.",
    "Calcular distância entre dois pontos.",
    "Calcular ponto médio e dividir um segmento.",
    "Reconhecer simetrias.",
  ],
  keyConcepts: [
    "Eixos x (abscissa) e y (ordenada); origem O(0,0)",
    "Quadrantes I, II, III, IV",
    "Distância: d(A,B) = √((x_B-x_A)² + (y_B-y_A)²)",
    "Ponto médio: M = ((x_A+x_B)/2, (y_A+y_B)/2)",
    "Baricentro G = ((x_A+x_B+x_C)/3, (y_A+y_B+y_C)/3)",
  ],
  commonMistakes: [
    "Trocar x↔y nas coordenadas.",
    "Esquecer da raiz na fórmula de distância.",
  ],
  units: ["unidades de comprimento (u.c.)"],
  formulas: [
    {
      id: "ga-dist",
      name: "Distância entre pontos",
      latex: "d(A,B) = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}",
      description: "Comprimento do segmento AB.",
      variables: [
        { symbol: "A,B", meaning: "pontos no plano", unit: "" },
      ],
      whenToUse: "Sempre que quer o comprimento de um segmento.",
      example: "A(-4,6), B(-1,9): d = √(3² + 3²) = √18 = 3√2.",
    },
    {
      id: "ga-pm",
      name: "Ponto médio",
      latex: "M = \\left(\\dfrac{x_A + x_B}{2}, \\dfrac{y_A + y_B}{2}\\right)",
      description: "Médio aritmético das coordenadas.",
      variables: [],
      whenToUse: "Mediana, mediatriz, simetria central.",
    },
    {
      id: "ga-baric",
      name: "Baricentro",
      latex: "G = \\left(\\dfrac{x_A + x_B + x_C}{3}, \\dfrac{y_A + y_B + y_C}{3}\\right)",
      description: "Encontro das medianas do triângulo.",
      variables: [],
      whenToUse: "Ponto médio das massas.",
    },
  ],
  lessons: [
    lesson("ga1-l1", "Pontos e distâncias", "concept", 12, 5, {
      concepts: [
        {
          title: "Plano cartesiano",
          body:
            "Cada ponto P do plano é um par ordenado (x, y) de números reais.\n\n" +
            "O 1º quadrante tem x>0 e y>0; II tem x<0, y>0; III x<0, y<0; IV x>0, y<0.",
        },
        {
          title: "Distância e ponto médio",
          body:
            "**Distância** vem do teorema de Pitágoras:\n" +
            "d² = Δx² + Δy² ⇒ d = √(Δx² + Δy²).\n\n" +
            "**Ponto médio** é só a média das coordenadas.",
        },
      ],
      exercises: [
        mkNum(
          "ga1-l1-e1",
          "Distância entre A(-4,6) e B(-1,9). (Lista Ex.1)",
          4.24,
          0.05,
          "d = √(3² + 3²) = √18 ≈ 4,24.",
          { difficulty: 1 },
        ),
        mkNum(
          "ga1-l1-e2",
          "Para A(-1,10), B(m,7). Qual m positivo tal que d=5? (Lista Ex.2)",
          3,
          0.1,
          "(m+1)² + 9 = 25 ⇒ (m+1)² = 16 ⇒ m+1 = ±4 ⇒ m = 3 ou -5.",
          { difficulty: 2 },
        ),
        mkMc(
          "ga1-l1-e3",
          "Ponto médio entre A(2,3) e B(-4,5):",
          ["(-1,4)", "(1,4)", "(-1,8)", "(3,4)"],
          0,
          "M = ((2-4)/2, (3+5)/2) = (-1, 4).",
          { difficulty: 1 },
        ),
        mkTf(
          "ga1-l1-e4",
          "O ponto P(-3, -2) está no III quadrante.",
          true,
          "x<0 e y<0.",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("ga1-l2", "Triângulos e baricentro", "practice", 12, 5, {
      exercises: [
        mkMc(
          "ga1-l2-e1",
          "Baricentro do triângulo A(0,0), B(6,0), C(0,3):",
          ["(2,1)", "(3, 1.5)", "(2, 1.5)", "(3,1)"],
          0,
          "G = ((0+6+0)/3, (0+0+3)/3) = (2, 1).",
          { difficulty: 2 },
        ),
        mkNum(
          "ga1-l2-e2",
          "Perímetro do triângulo A(0,0), B(3,0), C(0,4).",
          12,
          0.05,
          "lados 3, 4, 5 → P = 12.",
          { difficulty: 2 },
        ),
        mkTf(
          "ga1-l2-e3",
          "O baricentro divide cada mediana em 2:1 a partir do vértice.",
          true,
          "Propriedade clássica.",
          { difficulty: 2 },
        ),
      ],
    }),
    lesson("ga1-l3", "Quiz — Plano e distâncias", "quiz", 14, 6, {
      exercises: [
        mkNum(
          "ga1-l3-e1",
          "Distância de O(0,0) ao ponto P(5,12).",
          13,
          0.05,
          "√(25+144)=13.",
          { difficulty: 1 },
        ),
        mkFill(
          "ga1-l3-e2",
          "O ponto (4, 0) está sobre o eixo ___.",
          ["x", "X", "abscissa", "das abscissas"],
          "y=0.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

const cap02: Chapter = chapter({
  id: "ga02-vetores-r2",
  number: 2,
  subject: "ga",
  title: "Vetores no Plano (R²)",
  subtitle: "Definição, operações, decomposição e norma",
  color: "#22c55e",
  emoji: "➡️",
  objectives: [
    "Identificar segmentos orientados equivalentes.",
    "Somar, subtrair e multiplicar vetor por escalar.",
    "Calcular módulo e versor.",
    "Decompor em base canônica.",
  ],
  keyConcepts: [
    "Vetor = classe de equipolência de segmentos orientados",
    "AB = B - A (componentes)",
    "Soma: paralelogramo / cabeça-cauda",
    "Multiplicação por escalar muda módulo (e sentido se k<0)",
    "|v| = √(v_x² + v_y²); versor v̂ = v/|v|",
    "Base canônica i, j",
  ],
  commonMistakes: [
    "Trocar AB com BA (são opostos).",
    "Esquecer raiz no módulo.",
    "Misturar ponto com vetor (mesmo par ordenado).",
  ],
  units: ["u.v.", "rad"],
  formulas: [
    {
      id: "ga-modulo",
      name: "Módulo de vetor (R²)",
      latex: "|\\vec v| = \\sqrt{v_x^2 + v_y^2}",
      description: "Comprimento do vetor.",
      variables: [],
      whenToUse: "Sempre que precisa do tamanho.",
    },
    {
      id: "ga-versor",
      name: "Versor",
      latex: "\\hat u = \\dfrac{\\vec v}{|\\vec v|}",
      description: "Vetor unitário com mesma direção e sentido.",
      variables: [],
      whenToUse: "Decomposição em direção arbitrária.",
    },
  ],
  lessons: [
    lesson("ga2-l1", "Conceito e operações", "concept", 14, 6, {
      concepts: [
        {
          title: "O que é vetor",
          body:
            "Um vetor é um **objeto com módulo, direção e sentido**, representado por qualquer segmento orientado equivalente. Em R², escrevemos `v = (v_x, v_y)` ou `v = v_x i + v_y j`.\n\n" +
            "Se A = (1,2) e B = (4,6), então `AB = B - A = (3, 4)`.",
        },
        {
          title: "Operações",
          body:
            "**Soma**: u + v = (u_x + v_x, u_y + v_y) — regra do paralelogramo.\n" +
            "**Escalar**: k·v = (k·v_x, k·v_y).\n" +
            "**Subtração**: u - v = u + (-v).",
        },
      ],
      exercises: [
        mkMc(
          "ga2-l1-e1",
          "Se A(2,1) e B(5,5), AB = ?",
          ["(3,4)", "(-3,-4)", "(7,6)", "(2,3)"],
          0,
          "B - A = (3, 4).",
          { difficulty: 1 },
        ),
        mkNum(
          "ga2-l1-e2",
          "Módulo de v = (3, -4).",
          5,
          0.05,
          "√(9+16)=5.",
          { difficulty: 1 },
        ),
        mkMc(
          "ga2-l1-e3",
          "Soma (2,3) + (-1,4):",
          ["(1,7)", "(3,-1)", "(-2,12)", "(2,7)"],
          0,
          "Soma componente a componente.",
          { difficulty: 1 },
        ),
        mkNum(
          "ga2-l1-e4",
          "Para v=(6,8), o versor v̂ tem componente x igual a:",
          0.6,
          0.01,
          "|v|=10 → v̂=(0,6; 0,8).",
          { difficulty: 2 },
        ),
        mkTf(
          "ga2-l1-e5",
          "Os vetores AB e BA são iguais.",
          false,
          "Eles têm sentidos opostos: BA = -AB.",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("ga2-l2", "Combinação linear", "practice", 12, 5, {
      exercises: [
        mkMc(
          "ga2-l2-e1",
          "2·(1,3) - (4,1) = ?",
          ["(-2,5)", "(2,5)", "(-2,-5)", "(6,7)"],
          0,
          "(2,6) - (4,1) = (-2, 5).",
          { difficulty: 2 },
        ),
        mkTf(
          "ga2-l2-e2",
          "Os vetores (2,4) e (1,2) são paralelos.",
          true,
          "Um é múltiplo do outro (k=2).",
          { difficulty: 2 },
        ),
        mkNum(
          "ga2-l2-e3",
          "k tal que k·(2,3) = (6,9).",
          3,
          0.05,
          "k = 3.",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("ga2-l3", "Quiz — Vetores em R²", "quiz", 16, 6, {
      exercises: [
        mkNum(
          "ga2-l3-e1",
          "|(-3,4)| = ?",
          5,
          0.05,
          "√(9+16)=5.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

const cap03: Chapter = chapter({
  id: "ga03-produto-escalar",
  number: 3,
  subject: "ga",
  title: "Produto Escalar (Produto Interno)",
  subtitle: "Ângulo entre vetores, projeção e ortogonalidade",
  color: "#a855f7",
  emoji: "•",
  objectives: [
    "Calcular u·v.",
    "Determinar ângulo entre vetores.",
    "Projetar um vetor sobre outro.",
    "Identificar perpendicularidade.",
  ],
  keyConcepts: [
    "u·v = |u||v|cos θ",
    "u·v = u_x v_x + u_y v_y (em R²)",
    "u ⊥ v ⇔ u·v = 0",
    "Projeção: proj_v(u) = (u·v / |v|²) v",
    "u·u = |u|²",
  ],
  commonMistakes: [
    "Confundir produto escalar (resulta número) com vetorial (resulta vetor).",
    "Esquecer que produto interno é distributivo.",
  ],
  units: ["unidades²"],
  formulas: [
    {
      id: "ga-pe",
      name: "Produto escalar",
      latex: "\\vec u \\cdot \\vec v = u_x v_x + u_y v_y = |\\vec u||\\vec v|\\cos\\theta",
      description: "Operação que retorna número.",
      variables: [],
      whenToUse: "Ângulos, projeções, perpendicularidade.",
    },
    {
      id: "ga-proj",
      name: "Projeção ortogonal",
      latex: "\\text{proj}_{\\vec v} \\vec u = \\dfrac{\\vec u \\cdot \\vec v}{|\\vec v|^2} \\vec v",
      description: "Componente de u na direção de v.",
      variables: [],
      whenToUse: "Decomposição.",
    },
  ],
  lessons: [
    lesson("ga3-l1", "Cálculo e ângulo", "concept", 14, 6, {
      concepts: [
        {
          title: "Significado",
          body:
            "**u·v** mede o quanto u 'aponta na mesma direção' de v.\n" +
            "Se positivo: ângulo agudo. Negativo: obtuso. Zero: perpendiculares.",
        },
      ],
      exercises: [
        mkNum(
          "ga3-l1-e1",
          "Produto escalar de u=(2,3) e v=(-1,4).",
          10,
          0.05,
          "2·(-1) + 3·4 = -2 + 12 = 10.",
          { difficulty: 1 },
        ),
        mkMc(
          "ga3-l1-e2",
          "Quando u·v = 0:",
          ["paralelos", "perpendiculares", "iguais", "opostos"],
          1,
          "cos θ = 0 → θ = 90°.",
          { difficulty: 1 },
        ),
        mkNum(
          "ga3-l1-e3",
          "Cosseno do ângulo entre u=(1,0) e v=(1,1).",
          0.707,
          0.01,
          "cos θ = u·v/(|u||v|) = 1/√2 ≈ 0,707.",
          { difficulty: 2 },
        ),
        mkTf(
          "ga3-l1-e4",
          "Se u·v < 0, o ângulo é obtuso.",
          true,
          "cos θ < 0 ⇒ θ > 90°.",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("ga3-l2", "Projeção e perpendicularidade", "practice", 12, 6, {
      exercises: [
        mkMc(
          "ga3-l2-e1",
          "Vetor perpendicular a (3,4):",
          ["(4,3)", "(-4,3)", "(3,-4)", "(6,8)"],
          1,
          "(3,4)·(-4,3) = -12+12 = 0.",
          { difficulty: 2 },
        ),
        mkNum(
          "ga3-l2-e2",
          "Magnitude da projeção de u=(3,4) em v=(1,0).",
          3,
          0.05,
          "u·v/|v| = 3/1 = 3.",
          { difficulty: 2 },
        ),
      ],
    }),
    lesson("ga3-l3", "Quiz — Produto escalar", "quiz", 14, 6, {
      exercises: [
        mkNum(
          "ga3-l3-e1",
          "u=(1,2), v=(3,-1). u·v = ?",
          1,
          0.05,
          "3 - 2 = 1.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

const cap04: Chapter = chapter({
  id: "ga04-base-dependencia",
  number: 4,
  subject: "ga",
  title: "Combinação Linear e Bases",
  subtitle: "Dependência linear, bases e coordenadas em R²",
  color: "#f59e0b",
  emoji: "🧩",
  objectives: ["Decidir LD/LI.", "Encontrar coordenadas em uma base."],
  keyConcepts: [
    "Combinação linear: w = α u + β v",
    "LI ⇔ única solução α=β=0 para αu + βv = 0",
    "Base de R² = 2 vetores LI",
    "Coordenadas em base: par (α, β) tal que w = αu+βv",
  ],
  commonMistakes: ["Concluir LD apenas porque os módulos são iguais."],
  units: [],
  formulas: [],
  lessons: [
    lesson("ga4-l1", "LD vs LI", "concept", 12, 5, {
      concepts: [
        {
          title: "Critério rápido",
          body: "Em R², dois vetores são LI sse o determinante das coordenadas é não nulo.",
        },
      ],
      exercises: [
        mkMc(
          "ga4-l1-e1",
          "(2,3) e (4,6) são:",
          ["LI", "LD", "Ortogonais", "Iguais"],
          1,
          "Um é múltiplo do outro.",
          { difficulty: 1 },
        ),
        mkTf(
          "ga4-l1-e2",
          "Três vetores em R² são sempre LD.",
          true,
          "Em R^n, n+1 vetores quaisquer são LD.",
          { difficulty: 2 },
        ),
        mkMc(
          "ga4-l1-e3",
          "Coordenadas de w=(5,3) na base canônica:",
          ["(3,5)", "(5,3)", "(8,0)", "(0,8)"],
          1,
          "Base canônica.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

const cap05: Chapter = chapter({
  id: "ga05-retas-r2",
  number: 5,
  subject: "ga",
  title: "Retas no Plano (R²)",
  subtitle: "Equações vetorial, paramétrica, simétrica, geral e reduzida",
  color: "#ef4444",
  emoji: "📏",
  objectives: [
    "Escrever a reta em todas as 5 formas.",
    "Decidir paralela/perpendicular.",
    "Calcular distância ponto-reta.",
  ],
  keyConcepts: [
    "Vetorial: P = P₀ + t·v",
    "Paramétrica: x = x₀ + at, y = y₀ + bt",
    "Simétrica: (x-x₀)/a = (y-y₀)/b",
    "Geral: ax + by + c = 0",
    "Reduzida: y = mx + n",
    "Coeficiente angular m = (y_B - y_A)/(x_B - x_A)",
    "Paralelas: m₁ = m₂; Perpendiculares: m₁·m₂ = -1",
    "d(P, r) = |a·x_P + b·y_P + c| / √(a² + b²)",
  ],
  commonMistakes: [
    "Trocar coef angular com linear.",
    "Esquecer módulo na fórmula de distância.",
  ],
  units: [],
  formulas: [
    {
      id: "ga-reta-reduzida",
      name: "Equação reduzida",
      latex: "y = m x + n",
      description: "Onde m é o coef. angular e n é o linear.",
      variables: [],
      whenToUse: "Reta não-vertical.",
    },
    {
      id: "ga-dist-ponto-reta",
      name: "Distância ponto-reta",
      latex: "d(P, r) = \\dfrac{|a x_P + b y_P + c|}{\\sqrt{a^2 + b^2}}",
      description: "Para reta na forma geral.",
      variables: [],
      whenToUse: "Após escrever na forma ax+by+c=0.",
    },
  ],
  lessons: [
    lesson("ga5-l1", "Formas da reta", "concept", 16, 7, {
      concepts: [
        {
          title: "Da geral à reduzida",
          body: "ax+by+c=0 ⇒ y = -(a/b)x - c/b ⇒ m = -a/b, n = -c/b.",
        },
        {
          title: "Distância ponto-reta",
          body: "d(P, r) = |ax_P + by_P + c|/√(a² + b²).",
        },
      ],
      exercises: [
        mkMc(
          "ga5-l1-e1",
          "Reta passando por (0,2) com m=3:",
          ["y = 3x", "y = 3x + 2", "y = 2x + 3", "y = -3x + 2"],
          1,
          "y = mx + n.",
          { difficulty: 1 },
        ),
        mkNum(
          "ga5-l1-e2",
          "Coef. angular da reta por (1,2) e (3,8).",
          3,
          0.05,
          "m = (8-2)/(3-1) = 3.",
          { difficulty: 1 },
        ),
        mkNum(
          "ga5-l1-e3",
          "Distância de P(0,0) à reta 3x+4y-10=0.",
          2,
          0.05,
          "|−10|/5 = 2.",
          { difficulty: 2 },
        ),
        mkTf(
          "ga5-l1-e4",
          "Retas perpendiculares satisfazem m₁·m₂ = -1.",
          true,
          "Definição.",
          { difficulty: 1 },
        ),
        mkMc(
          "ga5-l1-e5",
          "Reta perpendicular a y=2x+1 passando por (0,3):",
          ["y = -0,5x + 3", "y = 2x + 3", "y = -2x + 3", "y = 0,5x + 3"],
          0,
          "m_perp = -1/2; passa em (0,3) → y = -0,5x + 3.",
          { difficulty: 2 },
        ),
      ],
    }),
    lesson("ga5-l2", "Parametrização", "practice", 12, 5, {
      exercises: [
        mkMc(
          "ga5-l2-e1",
          "Reta vetorial passando por A(1,2) com diretor v=(3,4):",
          ["P = (1,2) + t(3,4)", "P = (3,4) + t(1,2)", "P = (1,2)·t·(3,4)", "P = (1+t, 2-t)"],
          0,
          "P = P₀ + t·v.",
          { difficulty: 1 },
        ),
      ],
    }),
    lesson("ga5-l3", "Quiz — Retas em R²", "quiz", 14, 6, {
      exercises: [
        mkNum(
          "ga5-l3-e1",
          "Coef angular de y = -2x + 5.",
          -2,
          0.05,
          "m = -2.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

const cap06: Chapter = chapter({
  id: "ga06-vetores-r3",
  number: 6,
  subject: "ga",
  title: "Vetores no Espaço (R³)",
  subtitle: "Coordenadas espaciais, módulo e cossenos diretores",
  color: "#06b6d4",
  emoji: "🌐",
  objectives: ["Operar com vetores em R³.", "Calcular cossenos diretores."],
  keyConcepts: [
    "v = (v_x, v_y, v_z)",
    "|v| = √(v_x²+v_y²+v_z²)",
    "Cossenos diretores: cos α = v_x/|v| etc.",
    "cos²α + cos²β + cos²γ = 1",
  ],
  commonMistakes: ["Esquecer da 3ª coordenada na soma."],
  units: [],
  formulas: [],
  lessons: [
    lesson("ga6-l1", "R³ na prática", "concept", 12, 5, {
      concepts: [
        { title: "Distância em R³", body: "d = √(Δx²+Δy²+Δz²)." },
      ],
      exercises: [
        mkNum(
          "ga6-l1-e1",
          "Módulo de v=(2,3,6).",
          7,
          0.05,
          "√(4+9+36)=7.",
          { difficulty: 1 },
        ),
        mkMc(
          "ga6-l1-e2",
          "Distância entre A(1,2,3) e B(4,6,3):",
          ["3", "5", "7", "9"],
          1,
          "√(9+16+0) = 5.",
          { difficulty: 1 },
        ),
        mkTf(
          "ga6-l1-e3",
          "cos²α + cos²β + cos²γ sempre vale 1 para vetor não-nulo.",
          true,
          "Por construção dos cossenos diretores.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

const cap07: Chapter = chapter({
  id: "ga07-produto-vetorial",
  number: 7,
  subject: "ga",
  title: "Produto Vetorial e Produto Misto",
  subtitle: "u×v, área, volume e (u,v,w)",
  color: "#a855f7",
  emoji: "✖️",
  objectives: [
    "Calcular produto vetorial.",
    "Aplicar em áreas (paralelogramo) e volumes (paralelepípedo).",
  ],
  keyConcepts: [
    "u×v perpendicular a u e v",
    "|u×v| = |u||v|sen θ = área do paralelogramo",
    "(u, v, w) = u·(v×w) = volume do paralelepípedo",
    "u, v, w coplanares ⇔ misto = 0",
  ],
  commonMistakes: ["Esquecer ordem (u×v = -v×u).", "Não simplificar determinante."],
  units: [],
  formulas: [
    {
      id: "ga-prodvet",
      name: "Produto vetorial",
      latex: "\\vec u \\times \\vec v = \\det\\begin{pmatrix} i & j & k \\\\ u_x & u_y & u_z \\\\ v_x & v_y & v_z \\end{pmatrix}",
      description: "Determinante simbólico.",
      variables: [],
      whenToUse: "Vetor normal, área, torque.",
    },
  ],
  lessons: [
    lesson("ga7-l1", "Produto vetorial", "concept", 12, 6, {
      concepts: [
        {
          title: "Regra da mão direita",
          body: "Aponta os dedos no sentido de u → v; o polegar mostra u×v.",
        },
      ],
      exercises: [
        mkMc(
          "ga7-l1-e1",
          "i × j =",
          ["i", "j", "k", "0"],
          2,
          "Definição da base canônica.",
          { difficulty: 1 },
        ),
        mkNum(
          "ga7-l1-e2",
          "Área do paralelogramo gerado por u=(1,0,0) e v=(0,2,0).",
          2,
          0.05,
          "|u×v| = 2.",
          { difficulty: 2 },
        ),
        mkTf(
          "ga7-l1-e3",
          "u×v = -v×u.",
          true,
          "Antissimetria.",
          { difficulty: 1 },
        ),
        mkMc(
          "ga7-l1-e4",
          "Se (u,v,w)=0, então:",
          ["São paralelos", "São coplanares", "São perpendiculares", "Geram um paralelepípedo"],
          1,
          "Misto nulo = coplanaridade.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

const cap08: Chapter = chapter({
  id: "ga08-retas-r3",
  number: 8,
  subject: "ga",
  title: "Retas no Espaço (R³)",
  subtitle: "Equações vetoriais e paramétricas, posições relativas",
  color: "#ef4444",
  emoji: "🪜",
  objectives: ["Escrever retas em R³.", "Identificar paralelas, concorrentes e reversas."],
  keyConcepts: [
    "Vetorial: P = P₀ + t·v",
    "Paramétrica: x = x₀ + at, y = y₀ + bt, z = z₀ + ct",
    "Simétrica: (x-x₀)/a = (y-y₀)/b = (z-z₀)/c",
    "Concorrentes: têm ponto comum",
    "Paralelas: diretores LD",
    "Reversas: não se encontram nem são paralelas",
  ],
  commonMistakes: ["Confundir paralelas com reversas."],
  units: [],
  formulas: [],
  lessons: [
    lesson("ga8-l1", "Posições relativas", "concept", 12, 6, {
      concepts: [
        {
          title: "Critério",
          body:
            "Sejam r: A + t·u e s: B + λ·v.\n" +
            "1) Se u // v: paralelas (coincidentes se A∈s).\n" +
            "2) Senão, monte sistema A + t·u = B + λ·v: se tem solução, concorrentes; senão reversas.",
        },
      ],
      exercises: [
        mkMc(
          "ga8-l1-e1",
          "Retas r:(0,0,0)+t(1,1,1) e s:(2,2,2)+λ(2,2,2). São:",
          ["Reversas", "Perpendiculares", "Paralelas e coincidentes", "Paralelas distintas"],
          2,
          "Diretores múltiplos e (2,2,2) ∈ r.",
          { difficulty: 2 },
        ),
        mkTf(
          "ga8-l1-e2",
          "Em R³, duas retas que não se encontram são sempre paralelas.",
          false,
          "Podem ser reversas.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

const cap09: Chapter = chapter({
  id: "ga09-planos",
  number: 9,
  subject: "ga",
  title: "Planos no Espaço",
  subtitle: "Equações geral e vetorial, posições e distâncias",
  color: "#f97316",
  emoji: "🔲",
  objectives: ["Escrever planos.", "Calcular distância ponto-plano."],
  keyConcepts: [
    "Geral: ax + by + cz + d = 0 (n = (a,b,c))",
    "Vetorial: P = P₀ + s·u + t·v",
    "Distância: d = |ax_P + by_P + cz_P + d|/√(a²+b²+c²)",
    "Planos paralelos: normais paralelas",
    "Plano⊥ reta ⇔ diretor da reta é normal do plano",
  ],
  commonMistakes: ["Esquecer | | na distância."],
  units: [],
  formulas: [
    {
      id: "ga-dist-plano",
      name: "Distância ponto-plano",
      latex: "d(P, \\pi) = \\dfrac{|a x_P + b y_P + c z_P + d|}{\\sqrt{a^2 + b^2 + c^2}}",
      description: "Análoga ao caso de reta.",
      variables: [],
      whenToUse: "Plano em forma geral.",
    },
  ],
  lessons: [
    lesson("ga9-l1", "Planos", "concept", 12, 6, {
      concepts: [
        {
          title: "Vetor normal",
          body: "n = (a,b,c) é perpendicular ao plano ax+by+cz+d=0.",
        },
      ],
      exercises: [
        mkNum(
          "ga9-l1-e1",
          "Distância de O(0,0,0) ao plano 2x + 2y + z - 6 = 0.",
          2,
          0.05,
          "|−6|/3 = 2.",
          { difficulty: 2 },
        ),
        mkMc(
          "ga9-l1-e2",
          "Plano por (1,2,3) com normal (1,1,1):",
          ["x+y+z=6", "x+y+z=0", "x+y+z=3", "x-y+z=2"],
          0,
          "1+2+3=6 ⇒ x+y+z = 6.",
          { difficulty: 2 },
        ),
        mkTf(
          "ga9-l1-e3",
          "Dois planos com normais paralelas são paralelos ou coincidentes.",
          true,
          "Definição.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

const cap10: Chapter = chapter({
  id: "ga10-conicas",
  number: 10,
  subject: "ga",
  title: "Cônicas",
  subtitle: "Circunferência, elipse, hipérbole e parábola",
  color: "#7c3aed",
  emoji: "🌀",
  objectives: ["Reconhecer cada cônica.", "Escrever equações canônicas."],
  keyConcepts: [
    "Circunferência: (x-h)² + (y-k)² = r²",
    "Elipse: x²/a² + y²/b² = 1, focos em ±c, c²=a²-b²",
    "Hipérbole: x²/a² - y²/b² = 1, c²=a²+b²",
    "Parábola: y² = 4px (foco em (p,0))",
    "Excentricidade e: <1 elipse, =1 parábola, >1 hipérbole",
  ],
  commonMistakes: ["Confundir a com b.", "Trocar sinal na hipérbole."],
  units: [],
  formulas: [
    {
      id: "ga-elipse",
      name: "Elipse canônica",
      latex: "\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1",
      description: "Eixos sobre os eixos cartesianos.",
      variables: [],
      whenToUse: "Centro na origem.",
    },
  ],
  lessons: [
    lesson("ga10-l1", "Reconhecer cônicas", "concept", 12, 6, {
      concepts: [
        {
          title: "Identificação rápida",
          body:
            "x²+y²=r² → circunf.\n" +
            "x²/a²+y²/b²=1 → elipse.\n" +
            "x²/a²-y²/b²=1 → hipérbole.\n" +
            "y²=4px ou x²=4py → parábola.",
        },
      ],
      exercises: [
        mkMc(
          "ga10-l1-e1",
          "x² + y² = 25 representa:",
          ["Elipse", "Hipérbole", "Circunferência", "Parábola"],
          2,
          "Raio 5.",
          { difficulty: 1 },
        ),
        mkMc(
          "ga10-l1-e2",
          "x²/9 + y²/4 = 1. Os semieixos são:",
          ["3 e 2", "9 e 4", "6 e 4", "3 e 4"],
          0,
          "a=3, b=2.",
          { difficulty: 1 },
        ),
        mkNum(
          "ga10-l1-e3",
          "Excentricidade da hipérbole x²/9 - y²/16 = 1.",
          1.667,
          0.05,
          "c=√(9+16)=5; e=c/a=5/3≈1,67.",
          { difficulty: 3 },
        ),
        mkTf(
          "ga10-l1-e4",
          "Toda parábola tem excentricidade igual a 1.",
          true,
          "Definição.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

export const CHAPTERS_GA: Chapter[] = [
  cap01, cap02, cap03, cap04, cap05, cap06, cap07, cap08, cap09, cap10,
];
