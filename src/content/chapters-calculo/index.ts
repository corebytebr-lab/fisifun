import { chapter, lesson, mkMc, mkTf, mkNum, mkFill } from "../helpers";
import type { Chapter } from "@/lib/types";

/**
 * Capítulos de Cálculo Diferencial e Integral 1 baseados em
 * Stewart — Cálculo Vol. 1, 9ª ed. (versão métrica).
 */

const cap01: Chapter = chapter({
  id: "c01-funcoes-modelos",
  number: 1,
  subject: "calculo",
  title: "Funções e Modelos",
  subtitle: "Revisão essencial: função, gráfico, simetria e modelos",
  color: "#0ea5e9",
  emoji: "🧮",
  objectives: [
    "Avaliar funções e seus domínios.",
    "Reconhecer transformações de gráficos.",
    "Identificar funções pares/ímpares e periódicas.",
  ],
  keyConcepts: [
    "Função: regra de y para cada x do domínio",
    "Domínio = entradas válidas; Imagem = saídas",
    "Composição (f ∘ g)(x) = f(g(x))",
    "Função par: f(-x)=f(x); ímpar: f(-x)=-f(x)",
    "Funções básicas: polinomiais, racionais, trigonométricas, exponenciais e logarítmicas",
  ],
  commonMistakes: [
    "Esquecer restrições do domínio (raízes pares, log).",
    "Confundir composição com multiplicação.",
  ],
  units: [],
  formulas: [
    {
      id: "calc-comp",
      name: "Composição de funções",
      latex: "(f \\circ g)(x) = f(g(x))",
      description: "Aplica g e depois f.",
      variables: [],
      whenToUse: "Encadear funções.",
    },
  ],
  lessons: [
    lesson("c1-l1", "Função: definição e domínio", "concept", 14, 6, {
      concepts: [
        {
          title: "Restrições típicas",
          body: "Denominador ≠ 0; argumentos de raízes pares ≥ 0; argumentos de log > 0.",
        },
      ],
      exercises: [
        mkMc(
          "c1-l1-e1",
          "Domínio de f(x) = 1/(x-2):",
          ["x ≠ 0", "x ≠ 2", "x > 2", "x ∈ ℝ"],
          1,
          "Denominador zero em x=2.",
          { difficulty: 1 },
        ),
        mkMc(
          "c1-l1-e2",
          "Domínio de g(x) = √(x+1):",
          ["x ≥ -1", "x > -1", "x ≥ 0", "x ≠ -1"],
          0,
          "Raiz par exige x+1 ≥ 0.",
          { difficulty: 1 },
        ),
        mkTf(
          "c1-l1-e3",
          "f(x) = x² é par.",
          true,
          "f(-x)=(-x)²=x²=f(x).",
          { difficulty: 1 },
        ),
        mkNum(
          "c1-l1-e4",
          "Se f(x)=x²+1 e g(x)=x-3, calcule (f∘g)(5).",
          5,
          0.05,
          "g(5)=2; f(2)=4+1=5.",
          { difficulty: 2 },
        ),
      ],
    }),
    lesson("c1-l2", "Quiz — Funções", "quiz", 12, 5, {
      exercises: [
        mkMc(
          "c1-l2-e1",
          "Qual é ímpar?",
          ["x²", "|x|", "x³", "cos(x)"],
          2,
          "f(-x) = -x³ = -f(x).",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

const cap02: Chapter = chapter({
  id: "c02-limites",
  number: 2,
  subject: "calculo",
  title: "Limites e Continuidade",
  subtitle: "Conceito intuitivo, leis dos limites e continuidade",
  color: "#22c55e",
  emoji: "♾️",
  objectives: [
    "Calcular limites por substituição direta e fatoração.",
    "Reconhecer formas indeterminadas.",
    "Usar limites laterais.",
    "Verificar continuidade.",
  ],
  keyConcepts: [
    "lim_{x→a} f(x) = L",
    "Limites laterais: x→a⁻ e x→a⁺",
    "Indeterminações: 0/0, ∞/∞, 0·∞, ∞-∞",
    "f contínua em a ⇔ lim_{x→a} f(x) = f(a)",
    "lim_{x→0} sin(x)/x = 1",
    "lim_{x→∞} (1+1/x)ˣ = e",
  ],
  commonMistakes: [
    "Substituir e dividir por zero sem checar indeterminação.",
    "Esquecer fatorar antes de aplicar.",
  ],
  units: [],
  formulas: [
    {
      id: "calc-lim-sin",
      name: "Limite trigonométrico fundamental",
      latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1",
      description: "Indeterminação 0/0.",
      variables: [],
      whenToUse: "Limites com sin, tan, 1-cos próximos a 0.",
    },
    {
      id: "calc-lim-e",
      name: "Limite que define e",
      latex: "\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e",
      description: "Forma 1^∞.",
      variables: [],
      whenToUse: "Limites com (1+algo)^algo.",
    },
  ],
  lessons: [
    lesson("c2-l1", "Calcular limites", "concept", 14, 7, {
      concepts: [
        {
          title: "Estratégia",
          body:
            "1) Substitua direto.\n" +
            "2) Se der 0/0, fatorar/racionalizar/usar identidade trig.\n" +
            "3) Se der ∞/∞, divida pelo termo dominante.\n" +
            "4) Use limites notáveis ou L'Hôpital (cap. 4).",
        },
      ],
      exercises: [
        mkNum(
          "c2-l1-e1",
          "lim_{x→2} (x²-4)/(x-2)",
          4,
          0.05,
          "(x-2)(x+2)/(x-2) = x+2 → 4.",
          { difficulty: 2 },
        ),
        mkNum(
          "c2-l1-e2",
          "lim_{x→0} sin(3x)/x",
          3,
          0.05,
          "= 3 · sin(3x)/(3x) → 3·1 = 3.",
          { difficulty: 2 },
        ),
        mkMc(
          "c2-l1-e3",
          "lim_{x→∞} (3x²+1)/(x²-5):",
          ["0", "1", "3", "∞"],
          2,
          "Divida por x²: numerador → 3, denominador → 1.",
          { difficulty: 2 },
        ),
        mkTf(
          "c2-l1-e4",
          "f(x) = 1/x é contínua em x=0.",
          false,
          "Não está definida em 0.",
          { difficulty: 1 },
        ),
        mkNum(
          "c2-l1-e5",
          "lim_{x→0⁺} x·ln(x)",
          0,
          0.05,
          "Forma 0·∞ → vai a 0 (logarítmo cresce mais devagar).",
          { difficulty: 3 },
        ),
      ],
    }),
    lesson("c2-l2", "Quiz — Limites", "quiz", 14, 6, {
      exercises: [
        mkNum(
          "c2-l2-e1",
          "lim_{x→1} (x³-1)/(x-1).",
          3,
          0.05,
          "Fatorando: x²+x+1 → 3.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

const cap03: Chapter = chapter({
  id: "c03-derivadas",
  number: 3,
  subject: "calculo",
  title: "Derivadas",
  subtitle: "Definição, regras e derivadas das funções elementares",
  color: "#a855f7",
  emoji: "📐",
  objectives: [
    "Calcular derivadas pela definição.",
    "Aplicar regras (potência, soma, produto, quociente, cadeia).",
    "Derivar trigonométricas, exp e log.",
  ],
  keyConcepts: [
    "f'(a) = lim_{h→0} (f(a+h)-f(a))/h",
    "(xⁿ)' = n·xⁿ⁻¹",
    "(uv)' = u'v + uv'",
    "(u/v)' = (u'v - uv')/v²",
    "(f(g(x)))' = f'(g(x))·g'(x)",
    "(sin x)' = cos x; (cos x)' = -sin x",
    "(eˣ)' = eˣ; (ln x)' = 1/x",
  ],
  commonMistakes: [
    "Esquecer regra da cadeia.",
    "Trocar produto com regra `f'·g'` (errado).",
    "Aplicar a fórmula da potência em base variável (precisa log).",
  ],
  units: [],
  formulas: [
    {
      id: "calc-cadeia",
      name: "Regra da cadeia",
      latex: "(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)",
      description: "Função composta.",
      variables: [],
      whenToUse: "Sempre que houver função 'dentro' de outra.",
    },
    {
      id: "calc-prod",
      name: "Regra do produto",
      latex: "(uv)' = u'v + uv'",
      description: "Não use u'·v'.",
      variables: [],
      whenToUse: "Produto de funções.",
    },
  ],
  lessons: [
    lesson("c3-l1", "Regras de derivação", "concept", 16, 8, {
      concepts: [
        {
          title: "Tabelinha essencial",
          body:
            "(c)' = 0\n" +
            "(x)' = 1\n" +
            "(xⁿ)' = n·xⁿ⁻¹\n" +
            "(eˣ)' = eˣ\n" +
            "(aˣ)' = aˣ ln a\n" +
            "(ln x)' = 1/x\n" +
            "(sin x)' = cos x; (cos x)' = -sin x\n" +
            "(tan x)' = sec² x",
        },
      ],
      exercises: [
        mkMc(
          "c3-l1-e1",
          "Derivada de f(x) = 3x⁴:",
          ["12x³", "3x³", "12x⁴", "4x³"],
          0,
          "n=4 → 4·3x³ = 12x³.",
          { difficulty: 1 },
        ),
        mkMc(
          "c3-l1-e2",
          "Derivada de sin(x²):",
          ["cos(x²)", "2x·cos(x²)", "2x·sin(x²)", "cos(2x)"],
          1,
          "Regra da cadeia.",
          { difficulty: 2 },
        ),
        mkMc(
          "c3-l1-e3",
          "Derivada de x·ln(x):",
          ["1", "ln(x)+1", "1/x", "x"],
          1,
          "Regra do produto: 1·ln x + x·(1/x).",
          { difficulty: 2 },
        ),
        mkNum(
          "c3-l1-e4",
          "f(x)=x³ - 2x. f'(2) = ?",
          10,
          0.05,
          "f'(x)=3x²-2 → 12-2 = 10.",
          { difficulty: 1 },
        ),
        mkTf(
          "c3-l1-e5",
          "(eˣ²)' = e^(x²) · 2x.",
          true,
          "Cadeia: derivada de x² é 2x.",
          { difficulty: 2 },
        ),
      ],
    }),
    lesson("c3-l2", "Quiz — Derivadas", "quiz", 14, 6, {
      exercises: [
        mkMc(
          "c3-l2-e1",
          "Derivada de tan(x):",
          ["cot(x)", "sec²(x)", "-csc²(x)", "1/cos(x)"],
          1,
          "Padrão.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

const cap04: Chapter = chapter({
  id: "c04-aplicacoes-derivada",
  number: 4,
  subject: "calculo",
  title: "Aplicações da Derivada",
  subtitle: "Taxas, máx/mín, L'Hôpital e gráficos",
  color: "#f59e0b",
  emoji: "📈",
  objectives: [
    "Resolver problemas de taxa relacionada.",
    "Encontrar máximos e mínimos.",
    "Aplicar L'Hôpital.",
    "Esboçar gráficos com sinal de f' e f''.",
  ],
  keyConcepts: [
    "Ponto crítico: f'(c) = 0 ou indefinido",
    "Teste da 1ª derivada (sinal antes/depois)",
    "Teste da 2ª derivada (concavidade)",
    "L'Hôpital: 0/0 ou ∞/∞ ⇒ lim f/g = lim f'/g'",
    "Concavidade: f''>0 (∪), f''<0 (∩)",
    "Reta tangente em a: y = f(a) + f'(a)(x-a)",
  ],
  commonMistakes: [
    "Aplicar L'Hôpital fora de 0/0 ou ∞/∞.",
    "Esquecer o domínio ao otimizar.",
  ],
  units: [],
  formulas: [
    {
      id: "calc-tangente",
      name: "Reta tangente",
      latex: "y = f(a) + f'(a)(x - a)",
      description: "Aproximação linear em x = a.",
      variables: [],
      whenToUse: "Aproximações lineares, otimização.",
    },
    {
      id: "calc-lhop",
      name: "Regra de L'Hôpital",
      latex: "\\lim \\frac{f}{g} = \\lim \\frac{f'}{g'}",
      description: "Apenas para 0/0 e ∞/∞.",
      variables: [],
      whenToUse: "Indeterminações.",
    },
  ],
  lessons: [
    lesson("c4-l1", "Otimização e gráficos", "concept", 16, 8, {
      concepts: [
        {
          title: "Roteiro de máximo/mínimo",
          body:
            "1) Calcule f'(x).\n" +
            "2) Pontos críticos: f'(x)=0.\n" +
            "3) Teste da 2ª derivada: f''(c)>0 ⇒ mínimo; f''(c)<0 ⇒ máximo.\n" +
            "4) Verifique extremos do intervalo.",
        },
      ],
      exercises: [
        mkNum(
          "c4-l1-e1",
          "f(x)=x²-6x+5. Mínimo em x = ?",
          3,
          0.05,
          "f'(x)=2x-6=0 → x=3.",
          { difficulty: 2 },
        ),
        mkMc(
          "c4-l1-e2",
          "lim_{x→0} sin(x)/x²:",
          ["0", "1", "∞", "Não existe"],
          3,
          "Limites laterais diferentes (+∞ e -∞).",
          { difficulty: 3 },
        ),
        mkMc(
          "c4-l1-e3",
          "lim_{x→0} (eˣ - 1)/x:",
          ["0", "1", "e", "∞"],
          1,
          "L'Hôpital: eˣ → 1.",
          { difficulty: 2 },
        ),
        mkTf(
          "c4-l1-e4",
          "Se f''(c)=0, então c é ponto de inflexão.",
          false,
          "Precisa mudar de sinal de f''.",
          { difficulty: 2 },
        ),
        mkNum(
          "c4-l1-e5",
          "Reta tangente a f(x)=x² em x=3 cruza o eixo y em y₀ = ?",
          -9,
          0.05,
          "y = 9 + 6(x-3) = 6x - 9 → y₀ = -9.",
          { difficulty: 3 },
        ),
      ],
    }),
    lesson("c4-l2", "Quiz — Aplicações", "quiz", 14, 6, {
      exercises: [
        mkNum(
          "c4-l2-e1",
          "lim_{x→0} (1-cos x)/x².",
          0.5,
          0.02,
          "L'Hôpital ou série: 1/2.",
          { difficulty: 3 },
        ),
      ],
    }),
  ],
});

const cap05: Chapter = chapter({
  id: "c05-integrais",
  number: 5,
  subject: "calculo",
  title: "Integrais",
  subtitle: "Antiderivada, soma de Riemann e Teorema Fundamental",
  color: "#ef4444",
  emoji: "∫",
  objectives: [
    "Calcular antiderivadas simples.",
    "Avaliar integrais definidas pelo TFC.",
    "Reconhecer somas de Riemann.",
  ],
  keyConcepts: [
    "Antiderivada: F'(x) = f(x) ⇒ ∫f dx = F(x) + C",
    "TFC parte 1: d/dx ∫_a^x f(t)dt = f(x)",
    "TFC parte 2: ∫_a^b f(x) dx = F(b) - F(a)",
    "∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ -1)",
    "∫1/x dx = ln|x| + C",
    "∫eˣ dx = eˣ + C",
    "∫sin x dx = -cos x + C",
  ],
  commonMistakes: [
    "Esquecer +C nas indefinidas.",
    "Confundir ∫f' com f.",
  ],
  units: [],
  formulas: [
    {
      id: "calc-tfc",
      name: "Teorema Fundamental do Cálculo (parte 2)",
      latex: "\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)",
      description: "Avalia integral definida via antiderivada.",
      variables: [],
      whenToUse: "Sempre que f for integrável e F existir.",
    },
  ],
  lessons: [
    lesson("c5-l1", "Antiderivada e TFC", "concept", 16, 8, {
      exercises: [
        mkNum(
          "c5-l1-e1",
          "∫₀² 2x dx",
          4,
          0.05,
          "F=x²; 4-0 = 4.",
          { difficulty: 1 },
        ),
        mkNum(
          "c5-l1-e2",
          "∫ x² dx avaliada de 0 a 3.",
          9,
          0.05,
          "x³/3 → 27/3 = 9.",
          { difficulty: 1 },
        ),
        mkMc(
          "c5-l1-e3",
          "Antiderivada de 1/x:",
          ["ln(x²)+C", "ln|x|+C", "1/x²+C", "x ln(x)+C"],
          1,
          "Padrão.",
          { difficulty: 1 },
        ),
        mkNum(
          "c5-l1-e4",
          "∫₀^π sin(x) dx",
          2,
          0.05,
          "-cos x de 0 a π = 1-(-1) = 2.",
          { difficulty: 2 },
        ),
        mkTf(
          "c5-l1-e5",
          "Toda função contínua tem antiderivada.",
          true,
          "Pelo TFC parte 1.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

const cap06: Chapter = chapter({
  id: "c06-aplicacoes-integral",
  number: 6,
  subject: "calculo",
  title: "Aplicações da Integral",
  subtitle: "Área, volume e comprimento de arco",
  color: "#06b6d4",
  emoji: "🌊",
  objectives: ["Calcular áreas entre curvas.", "Volumes de revolução."],
  keyConcepts: [
    "Área entre f e g: ∫_a^b (f-g) dx",
    "Volume disco/anel: V = π ∫_a^b [R(x)² − r(x)²] dx",
    "Volume cascas: V = 2π ∫_a^b x·f(x) dx",
    "Comprimento de arco: L = ∫_a^b √(1+(f')²) dx",
  ],
  commonMistakes: ["Trocar f e g (área negativa)."],
  units: [],
  formulas: [],
  lessons: [
    lesson("c6-l1", "Áreas e volumes", "concept", 14, 6, {
      exercises: [
        mkNum(
          "c6-l1-e1",
          "Área entre y=x² e y=x de 0 a 1.",
          0.167,
          0.02,
          "∫₀¹ (x - x²) dx = 1/2 - 1/3 = 1/6.",
          { difficulty: 2 },
        ),
        mkNum(
          "c6-l1-e2",
          "Volume sólido por revolução de y=x ao girar em [0,1] ao redor do eixo x. (V/π)",
          0.333,
          0.02,
          "V = π∫₀¹ x² dx = π/3 → V/π = 1/3.",
          { difficulty: 3 },
        ),
      ],
    }),
  ],
});

const cap07: Chapter = chapter({
  id: "c07-tecnicas-integracao",
  number: 7,
  subject: "calculo",
  title: "Técnicas de Integração",
  subtitle: "Substituição, partes, frações parciais e trigonométricas",
  color: "#7c3aed",
  emoji: "🧩",
  objectives: ["Aplicar u-substituição.", "Aplicar integração por partes."],
  keyConcepts: [
    "Substituição: u = g(x), du = g'(x)dx",
    "Por partes: ∫u dv = uv - ∫v du",
    "Tabela de derivadas/integrais à mão",
    "Frações parciais para racionais",
  ],
  commonMistakes: ["Trocar u sem trocar dx.", "Não escolher u conforme LIATE/ILATE."],
  units: [],
  formulas: [
    {
      id: "calc-partes",
      name: "Integração por partes",
      latex: "\\int u \\, dv = uv - \\int v \\, du",
      description: "Use LIATE/ILATE para escolher u.",
      variables: [],
      whenToUse: "Produtos como x·eˣ, x·sin x, ln x.",
    },
  ],
  lessons: [
    lesson("c7-l1", "u-sub e por partes", "concept", 16, 8, {
      exercises: [
        mkMc(
          "c7-l1-e1",
          "∫ 2x·cos(x²) dx = ?",
          ["sin(x²)+C", "cos(x²)+C", "x²·sin(x²)+C", "2sin(x²)+C"],
          0,
          "u = x², du = 2x dx.",
          { difficulty: 2 },
        ),
        mkMc(
          "c7-l1-e2",
          "∫ x·eˣ dx = ?",
          ["x·eˣ + C", "(x-1)eˣ + C", "eˣ + C", "x²eˣ/2 + C"],
          1,
          "Por partes: u=x, dv=eˣdx → x·eˣ - eˣ + C.",
          { difficulty: 3 },
        ),
        mkNum(
          "c7-l1-e3",
          "∫₀¹ 2x·e^(x²) dx = e^(x²) avaliado.",
          1.718,
          0.02,
          "u=x²; resultado = e-1 ≈ 1,718.",
          { difficulty: 3 },
        ),
      ],
    }),
  ],
});

const cap08: Chapter = chapter({
  id: "c08-aplicacoes-extra",
  number: 8,
  subject: "calculo",
  title: "Aplicações Adicionais",
  subtitle: "Centro de massa, trabalho, probabilidade",
  color: "#f97316",
  emoji: "⚖️",
  objectives: ["Aplicar integrais em física e estatística básica."],
  keyConcepts: [
    "Trabalho: W = ∫ F(x) dx",
    "Centroide: x̄ = (1/A) ∫ x·f(x) dx",
    "f.d.p.: ∫ f(x)dx = 1, P(a≤X≤b) = ∫_a^b f",
  ],
  commonMistakes: [],
  units: [],
  formulas: [],
  lessons: [
    lesson("c8-l1", "Aplicações", "concept", 12, 5, {
      exercises: [
        mkNum(
          "c8-l1-e1",
          "Trabalho W = ∫₀² 3x dx (em joules, F em N).",
          6,
          0.05,
          "3x²/2 |₀² = 6.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

const cap09: Chapter = chapter({
  id: "c09-eqdif",
  number: 9,
  subject: "calculo",
  title: "Equações Diferenciais (Introdução)",
  subtitle: "1ª ordem, separáveis e crescimento exponencial",
  color: "#10b981",
  emoji: "📊",
  objectives: ["Resolver EDOs separáveis.", "Aplicar em modelos."],
  keyConcepts: [
    "y' = ky ⇒ y = y₀·e^(kt)",
    "Separáveis: g(y)dy = h(x)dx ⇒ ∫g dy = ∫h dx",
  ],
  commonMistakes: ["Esquecer constante de integração."],
  units: [],
  formulas: [
    {
      id: "calc-exp",
      name: "Crescimento exponencial",
      latex: "y(t) = y_0 e^{kt}",
      description: "Solução de y' = ky.",
      variables: [],
      whenToUse: "Decaimento radioativo, juros contínuos, populações.",
    },
  ],
  lessons: [
    lesson("c9-l1", "EDO básica", "concept", 12, 5, {
      exercises: [
        mkMc(
          "c9-l1-e1",
          "Solução geral de y' = 2y:",
          ["y = e²ˣ", "y = C·e²ˣ", "y = 2x + C", "y = x²+C"],
          1,
          "Crescimento exponencial.",
          { difficulty: 2 },
        ),
        mkNum(
          "c9-l1-e2",
          "Meia-vida de uma substância com k=-0,1 (anos⁻¹). Em anos.",
          6.93,
          0.05,
          "ln(2)/0,1 ≈ 6,93.",
          { difficulty: 3 },
        ),
      ],
    }),
  ],
});

const cap10: Chapter = chapter({
  id: "c10-sequencias-series",
  number: 10,
  subject: "calculo",
  title: "Sequências e Séries",
  subtitle: "Convergência, p-série, geométrica e testes",
  color: "#a855f7",
  emoji: "🔢",
  objectives: ["Decidir convergência de séries simples."],
  keyConcepts: [
    "Geométrica Σ rⁿ converge ⇔ |r|<1, soma = 1/(1-r)",
    "p-série Σ 1/nᵖ converge ⇔ p>1",
    "Teste da razão: lim |a_{n+1}/a_n| < 1 ⇒ converge",
    "Teste do termo geral: a_n não tende a 0 ⇒ diverge",
  ],
  commonMistakes: ["Concluir convergência só porque a_n → 0."],
  units: [],
  formulas: [],
  lessons: [
    lesson("c10-l1", "Convergência básica", "concept", 12, 5, {
      exercises: [
        mkMc(
          "c10-l1-e1",
          "Σ 1/n²:",
          ["Diverge", "Converge", "Geométrica", "Indeterminada"],
          1,
          "p=2>1.",
          { difficulty: 1 },
        ),
        mkNum(
          "c10-l1-e2",
          "Soma da série geométrica Σ_{n=0}^∞ (1/2)ⁿ.",
          2,
          0.05,
          "1/(1-1/2) = 2.",
          { difficulty: 1 },
        ),
        mkTf(
          "c10-l1-e3",
          "Σ 1/n converge.",
          false,
          "Série harmônica diverge.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

const cap11: Chapter = chapter({
  id: "c11-series-potencias",
  number: 11,
  subject: "calculo",
  title: "Séries de Potências",
  subtitle: "Taylor, Maclaurin e raio de convergência",
  color: "#ec4899",
  emoji: "🌀",
  objectives: ["Calcular série de Maclaurin de funções básicas."],
  keyConcepts: [
    "Maclaurin: f(x) = Σ f⁽ⁿ⁾(0)/n! · xⁿ",
    "eˣ = 1 + x + x²/2! + x³/3! + ...",
    "sin x = x - x³/3! + x⁵/5! - ...",
    "cos x = 1 - x²/2! + x⁴/4! - ...",
    "1/(1-x) = 1 + x + x² + ...",
    "Raio R: lim |a_{n+1}/a_n| = 1/R",
  ],
  commonMistakes: ["Esquecer a constante na expansão."],
  units: [],
  formulas: [],
  lessons: [
    lesson("c11-l1", "Maclaurin", "concept", 12, 5, {
      exercises: [
        mkMc(
          "c11-l1-e1",
          "1° termo não nulo de sin(x) (potência mais baixa):",
          ["1", "x", "x²", "x³"],
          1,
          "Série inicia em x.",
          { difficulty: 1 },
        ),
        mkNum(
          "c11-l1-e2",
          "Aproximação de e^0,1 por Maclaurin com 3 termos (1+x+x²/2). Decimal.",
          1.105,
          0.005,
          "1 + 0,1 + 0,005 = 1,105.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

const cap12: Chapter = chapter({
  id: "c12-vetores-espaco",
  number: 12,
  subject: "calculo",
  title: "Vetores e Geometria do Espaço",
  subtitle: "Conexão com Geometria Analítica e cálculo vetorial",
  color: "#0ea5e9",
  emoji: "🌐",
  objectives: ["Operar vetores no R³ e usar parametrizações."],
  keyConcepts: [
    "Vetor posição r(t)",
    "Velocidade v(t) = r'(t); aceleração a(t) = r''(t)",
    "|v| = velocidade escalar",
    "Equação paramétrica de reta: r(t) = r₀ + t·v",
  ],
  commonMistakes: [],
  units: [],
  formulas: [],
  lessons: [
    lesson("c12-l1", "Curvas paramétricas", "concept", 12, 5, {
      exercises: [
        mkMc(
          "c12-l1-e1",
          "r(t)=(cos t, sin t) traça:",
          ["Reta", "Parábola", "Círculo unitário", "Espiral"],
          2,
          "Parametrização do círculo.",
          { difficulty: 1 },
        ),
        mkNum(
          "c12-l1-e2",
          "Para r(t)=(t, t², t³) em t=1, |v(1)| ≈ ?",
          3.742,
          0.05,
          "v=(1, 2, 3); |v|=√14.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

export const CHAPTERS_CALCULO: Chapter[] = [
  cap01, cap02, cap03, cap04, cap05, cap06, cap07, cap08, cap09, cap10, cap11, cap12,
];
