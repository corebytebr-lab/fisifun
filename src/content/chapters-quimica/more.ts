import { chapter, lesson, mkMc, mkTf, mkNum, mkFill } from "../helpers";
import type { Chapter } from "@/lib/types";

/**
 * Capítulos 6–24 de Química Geral (Brown/LeMay) em forma compacta. Cada
 * capítulo cobre o essencial — conceitos-chave, fórmulas e um quiz —
 * suficiente para destravar trilha + flashcards + Modo Professor. Conteúdo
 * será expandido em iterações futuras.
 */

export const cap06q: Chapter = chapter({
  id: "q06-estrutura-eletronica",
  number: 6,
  subject: "quimica",
  title: "Estrutura Eletrônica dos Átomos",
  subtitle: "Quantização, orbitais e configuração eletrônica",
  color: "#a855f7",
  emoji: "🌌",
  objectives: [
    "Aplicar Bohr e o conceito de orbital.",
    "Conhecer 4 números quânticos.",
    "Escrever configuração eletrônica.",
  ],
  keyConcepts: [
    "Onda-partícula; E = hν",
    "Orbitais s, p, d, f",
    "Princípio de Aufbau, Pauli, Hund",
    "Diagrama de Linus Pauling",
    "Configuração e elétrons de valência",
  ],
  commonMistakes: [
    "Esquecer ordem de preenchimento (4s antes de 3d).",
    "Lotar mais de 2 e⁻ no mesmo orbital.",
  ],
  units: ["J", "Hz", "nm", "elétron"],
  formulas: [
    {
      id: "q-planck",
      name: "Energia do fóton",
      latex: "E = h\\nu = \\dfrac{hc}{\\lambda}",
      description: "Energia de um quantum de luz.",
      variables: [
        { symbol: "h", meaning: "constante de Planck", unit: "6,626·10⁻³⁴ J·s" },
        { symbol: "\\nu", meaning: "frequência", unit: "Hz" },
        { symbol: "\\lambda", meaning: "comprimento de onda", unit: "m" },
      ],
      whenToUse: "Espectros, fotoelétrico, raios X.",
    },
  ],
  lessons: [
    lesson("q6-l1", "Configuração eletrônica", "concept", 12, 5, {
      concepts: [
        {
          title: "Os 4 números quânticos",
          body:
            "- **n** (principal): nível energético (1, 2, 3,…)\n" +
            "- **ℓ** (azimutal): subnível (0=s, 1=p, 2=d, 3=f)\n" +
            "- **m_ℓ**: orbital específico (-ℓ … +ℓ)\n" +
            "- **m_s**: spin (+½ ou -½)",
        },
        {
          title: "Ordem de preenchimento",
          body:
            "Aufbau: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s 5f 6d 7p\n" +
            "Pauli: máx 2 e⁻ por orbital. Hund: 1 e⁻ em cada orbital antes de parear.",
        },
      ],
      exercises: [
        mkMc(
          "q6-l1-e1",
          "Configuração de Cl (Z=17):",
          ["1s² 2s² 2p⁶ 3s² 3p⁵", "1s² 2s² 2p⁶ 3s² 3p⁶", "1s² 2s² 2p⁵ 3s² 3p⁶", "1s² 2s² 2p⁶ 3s¹ 3p⁶"],
          0,
          "17 e⁻: 2+2+6+2+5.",
          { difficulty: 2 },
        ),
        mkNum(
          "q6-l1-e2",
          "Energia (em 10⁻¹⁹ J) de um fóton com λ = 500 nm. (h=6,626·10⁻³⁴, c=3·10⁸)",
          3.98,
          0.05,
          "E = hc/λ = (6,626·10⁻³⁴·3·10⁸)/(500·10⁻⁹) ≈ 3,98·10⁻¹⁹ J.",
          { difficulty: 3 },
        ),
        mkTf(
          "q6-l1-e3",
          "Subnível d comporta no máximo 10 elétrons.",
          true,
          "5 orbitais × 2 e⁻.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

export const cap07q: Chapter = chapter({
  id: "q07-periodicidade",
  number: 7,
  subject: "quimica",
  title: "Propriedades Periódicas",
  subtitle: "Raio, energia de ionização, eletronegatividade e tendências",
  color: "#ec4899",
  emoji: "📊",
  objectives: [
    "Explicar tendências de raio, EI, AE, EN.",
    "Localizar grupos e blocos na tabela.",
  ],
  keyConcepts: [
    "Z efetivo (Z_ef)",
    "Raio atômico ↑ pra baixo, ↓ pra direita",
    "Energia de ionização (EI) ↓ pra baixo, ↑ pra direita",
    "Afinidade eletrônica (AE)",
    "Eletronegatividade (Pauling)",
  ],
  commonMistakes: [
    "Inverter tendência de raio com a de EI.",
    "Esquecer da exceção de Be→B e N→O na EI.",
  ],
  units: ["pm", "eV", "kJ/mol"],
  formulas: [],
  lessons: [
    lesson("q7-l1", "Tendências periódicas", "concept", 12, 5, {
      concepts: [
        {
          title: "Resumo das tendências",
          body:
            "Da esquerda → direita: **EN, EI, AE aumentam**, **raio diminui**.\n" +
            "De cima → baixo: **raio aumenta**, **EN, EI, AE diminuem**.",
        },
      ],
      exercises: [
        mkMc(
          "q7-l1-e1",
          "Maior raio atômico:",
          ["F", "Cl", "Br", "I"],
          3,
          "Raio aumenta para baixo no grupo.",
          { difficulty: 1 },
        ),
        mkMc(
          "q7-l1-e2",
          "Mais eletronegativo:",
          ["Na", "C", "O", "F"],
          3,
          "F é o mais eletronegativo (3,98).",
          { difficulty: 1 },
        ),
        mkTf(
          "q7-l1-e3",
          "Energia de ionização aumenta da esquerda para a direita no período.",
          true,
          "Maior Z_ef segura mais o e⁻.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

export const cap08q: Chapter = chapter({
  id: "q08-ligacao-quimica",
  number: 8,
  subject: "quimica",
  title: "Conceitos Básicos de Ligação Química",
  subtitle: "Iônica, covalente, polar/apolar, Lewis e energia de ligação",
  color: "#14b8a6",
  emoji: "🔗",
  objectives: [
    "Diferenciar iônica de covalente.",
    "Desenhar estruturas de Lewis.",
    "Aplicar carga formal.",
  ],
  keyConcepts: [
    "Regra do octeto",
    "Ligação iônica vs covalente vs metálica",
    "Polaridade pela diferença de EN",
    "Estrutura de Lewis com pares ligantes/livres",
    "Carga formal: e⁻val − não-ligados − ½ligados",
  ],
  commonMistakes: [
    "Esquecer pares isolados na Lewis.",
    "Aplicar octeto a H (que tem 2) ou Be/B.",
  ],
  units: ["pm", "kJ/mol", "Debye (D)"],
  formulas: [],
  lessons: [
    lesson("q8-l1", "Lewis e polaridade", "concept", 12, 5, {
      concepts: [
        {
          title: "Iônica vs Covalente",
          body:
            "**Iônica** (ΔEN > ~1,7): metal + não-metal.\n" +
            "**Covalente polar** (ΔEN ~0,4–1,7): compartilha desigual.\n" +
            "**Covalente apolar** (ΔEN < 0,4 ou simétrica): igual.",
        },
        {
          title: "Estrutura de Lewis (passos)",
          body:
            "1. Some elétrons de valência (corrigir cargas).\n" +
            "2. Esqueleto: átomo central menos eletronegativo.\n" +
            "3. Distribua pares ligantes; complete octetos com pares livres.\n" +
            "4. Sobrou e⁻? Forme dupla/tripla.",
        },
      ],
      exercises: [
        mkMc(
          "q8-l1-e1",
          "HCl é classificada como:",
          ["Iônica", "Covalente polar", "Covalente apolar", "Metálica"],
          1,
          "ΔEN(Cl-H)≈0,96 → polar.",
          { difficulty: 1 },
        ),
        mkMc(
          "q8-l1-e2",
          "Quantos pares de elétrons livres em NH₃ (N central)?",
          ["0", "1", "2", "3"],
          1,
          "N tem 5 e⁻ val; usa 3 com H, sobra 1 par livre.",
          { difficulty: 2 },
        ),
        mkTf(
          "q8-l1-e3",
          "CO₂ é uma molécula polar.",
          false,
          "Apesar das ligações C=O polares, o vetor resultante é zero (linear simétrica).",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

export const cap09q: Chapter = chapter({
  id: "q09-geometria-molecular",
  number: 9,
  subject: "quimica",
  title: "Geometria Molecular e Teorias de Ligação",
  subtitle: "VSEPR, hibridização e teorias de orbitais",
  color: "#f97316",
  emoji: "🧬",
  objectives: [
    "Aplicar VSEPR pra prever geometria.",
    "Identificar hibridização.",
  ],
  keyConcepts: [
    "Geometrias VSEPR: linear, trigonal, tetraédrica, trig. bipiramidal, octaédrica",
    "Hibridização sp, sp², sp³, sp³d, sp³d²",
    "Polaridade molecular = soma vetorial",
    "Ligação σ vs π",
  ],
  commonMistakes: [
    "Esquecer pares livres no cálculo da geometria.",
    "Confundir geometria eletrônica com molecular.",
  ],
  units: ["°", "Å"],
  formulas: [],
  lessons: [
    lesson("q9-l1", "VSEPR e hibridização", "concept", 12, 5, {
      concepts: [
        {
          title: "Pares de elétrons → geometria",
          body:
            "- 2 grupos: **linear** (sp), 180°\n" +
            "- 3: **trigonal plana** (sp²), 120°\n" +
            "- 4: **tetraédrica** (sp³), 109,5°\n" +
            "- 5: **trigonal bipiramidal** (sp³d)\n" +
            "- 6: **octaédrica** (sp³d²)\n\n" +
            "Pares livres reduzem ângulos e mudam a geometria molecular.",
        },
      ],
      exercises: [
        mkMc(
          "q9-l1-e1",
          "Geometria molecular de H₂O (O central com 2 pares livres):",
          ["Linear", "Angular", "Trigonal plana", "Tetraédrica"],
          1,
          "4 grupos → tetraédrica eletrônica → 2 pares livres → angular.",
          { difficulty: 2 },
        ),
        mkMc(
          "q9-l1-e2",
          "Hibridização do C em CH₄:",
          ["sp", "sp²", "sp³", "sp³d"],
          2,
          "4 ligações simples → tetraédrico → sp³.",
          { difficulty: 1 },
        ),
        mkTf(
          "q9-l1-e3",
          "Em ligação tripla há 1σ e 2π.",
          true,
          "Sempre.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

export const cap10q: Chapter = chapter({
  id: "q10-gases",
  number: 10,
  subject: "quimica",
  title: "Gases",
  subtitle: "Leis dos gases, ideal, reais e estequiometria gasosa",
  color: "#3b82f6",
  emoji: "💨",
  objectives: [
    "Aplicar PV = nRT.",
    "Calcular densidade de gás.",
    "Resolver problemas com mistura gasosa (Dalton).",
  ],
  keyConcepts: [
    "P, V, T, n; R = 0,0821 L·atm/(mol·K)",
    "Boyle, Charles, Gay-Lussac, Avogadro",
    "Equação geral PV = nRT",
    "Pressão parcial: P_total = ΣP_i",
    "Velocidade média (RMS) e efusão (Graham)",
  ],
  commonMistakes: [
    "Esquecer de converter °C → K.",
    "Misturar L com mL.",
    "Trocar pressões parciais com totais.",
  ],
  units: ["atm", "Pa", "L", "K", "mol"],
  formulas: [
    {
      id: "q-pvnrt",
      name: "Gás ideal",
      latex: "P V = n R T",
      description: "Modelo de gás ideal.",
      variables: [
        { symbol: "P", meaning: "pressão", unit: "atm" },
        { symbol: "V", meaning: "volume", unit: "L" },
        { symbol: "n", meaning: "mols", unit: "mol" },
        { symbol: "R", meaning: "constante", unit: "0,0821 L·atm/(mol·K)" },
        { symbol: "T", meaning: "temperatura", unit: "K" },
      ],
      whenToUse: "Pressões baixas a moderadas.",
    },
  ],
  lessons: [
    lesson("q10-l1", "PV=nRT na prática", "concept", 14, 6, {
      concepts: [
        {
          title: "CNTP",
          body: "P=1 atm, T=273,15 K. 1 mol ocupa **22,4 L** (CNTP).",
        },
      ],
      exercises: [
        mkNum(
          "q10-l1-e1",
          "Volume (L) ocupado por 2 mol a 27°C e 1 atm.",
          49.2,
          0.5,
          "V = nRT/P = 2·0,0821·300 ≈ 49,3 L.",
          { difficulty: 2 },
        ),
        mkMc(
          "q10-l1-e2",
          "Lei de Boyle relaciona:",
          ["P e T", "V e T", "P e V", "n e T"],
          2,
          "PV = const. a T fixa.",
          { difficulty: 1 },
        ),
        mkNum(
          "q10-l1-e3",
          "P (atm) de 0,5 mol em 5,0 L a 300 K.",
          2.46,
          0.05,
          "P = nRT/V = 0,5·0,0821·300/5 ≈ 2,46 atm.",
          { difficulty: 2 },
        ),
        mkTf(
          "q10-l1-e4",
          "Em mistura gasosa, P_total = soma das pressões parciais.",
          true,
          "Lei de Dalton.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

export const cap11q: Chapter = chapter({
  id: "q11-intermoleculares",
  number: 11,
  subject: "quimica",
  title: "Forças Intermoleculares, Líquidos e Sólidos",
  subtitle: "Dipolo, ligações de hidrogênio, viscosidade e tipos de sólidos",
  color: "#0ea5e9",
  emoji: "💧",
  objectives: [
    "Comparar dipolo, dispersão e ligação de H.",
    "Relacionar IM com PE e viscosidade.",
  ],
  keyConcepts: [
    "Dispersão de London (todas)",
    "Dipolo-dipolo (moléculas polares)",
    "Ligação de H (H ligado a F, O, N)",
    "Tensão superficial, viscosidade, capilaridade",
    "Tipos de sólido: molecular, iônico, covalente, metálico",
  ],
  commonMistakes: [
    "Esquecer que dispersão existe sempre.",
    "Tratar HF como só dipolo-dipolo (é ligação de H).",
  ],
  units: ["°C", "kJ/mol", "mPa·s"],
  formulas: [],
  lessons: [
    lesson("q11-l1", "Forças intermoleculares", "concept", 12, 5, {
      concepts: [
        {
          title: "Hierarquia geral de força",
          body: "Ligação de H > dipolo-dipolo > dispersão (massas iguais).",
        },
      ],
      exercises: [
        mkMc(
          "q11-l1-e1",
          "Maior PE entre H₂O, H₂S, H₂Se:",
          ["H₂Se", "H₂S", "H₂O", "Igual"],
          2,
          "H₂O faz ligação de H → PE muito maior.",
          { difficulty: 2 },
        ),
        mkTf(
          "q11-l1-e2",
          "Diamante é um sólido covalente.",
          true,
          "Rede de C-C ligados covalentemente.",
          { difficulty: 1 },
        ),
        mkMc(
          "q11-l1-e3",
          "Tipo de sólido com pontos de fusão muito altos e bom condutor de calor:",
          ["Molecular", "Iônico", "Metálico", "Covalente"],
          2,
          "Metálicos têm mar de elétrons.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

export const cap12q: Chapter = chapter({
  id: "q12-solidos-modernos",
  number: 12,
  subject: "quimica",
  title: "Sólidos Modernos: Materiais e Nanotecnologia",
  subtitle: "Polímeros, semicondutores, nanomateriais",
  color: "#64748b",
  emoji: "🧱",
  objectives: ["Reconhecer classes de materiais modernos.", "Distinguir condutor/semicondutor/isolante."],
  keyConcepts: [
    "Polímeros (adição vs condensação)",
    "Semicondutor; dopagem n e p",
    "Cerâmicos, supercondutores",
    "Nanopartículas e propriedades dependentes do tamanho",
  ],
  commonMistakes: ["Confundir polímero linear com ramificado/reticulado."],
  units: ["nm", "g/mol"],
  formulas: [],
  lessons: [
    lesson("q12-l1", "Materiais", "concept", 8, 4, {
      concepts: [
        { title: "Quem conduz?", body: "Metais > semicondutores > isolantes. Si dopado com P (n) ou B (p)." },
      ],
      exercises: [
        mkMc(
          "q12-l1-e1",
          "Politileno (PE) é polímero de:",
          ["Adição", "Condensação", "Iônico", "Coordenação"],
          0,
          "Polimerização do etileno (adição).",
          { difficulty: 2 },
        ),
        mkTf("q12-l1-e2", "Si dopado com P torna-se tipo n.", true, "P doa e⁻.", { difficulty: 2 }),
      ],
    }),
  ],
});

export const cap13q: Chapter = chapter({
  id: "q13-solucoes",
  number: 13,
  subject: "quimica",
  title: "Propriedades das Soluções",
  subtitle: "Concentração, solubilidade, propriedades coligativas",
  color: "#22d3ee",
  emoji: "🧂",
  objectives: ["Calcular concentrações.", "Aplicar Henry e Raoult.", "Resolver coligativas."],
  keyConcepts: [
    "Frações: molar (x), molal (m), mássica (% m/m)",
    "Lei de Henry: S = k·P (gases)",
    "Raoult: P = x·P°",
    "Tonoscopia, ebulioscopia (ΔT_b = K_b·m·i), crioscopia (ΔT_f = K_f·m·i), osmose (Π=MRT·i)",
    "Fator de van't Hoff i",
  ],
  commonMistakes: ["Trocar molaridade (M) por molalidade (m).", "Esquecer fator i pra eletrólitos."],
  units: ["mol/L", "mol/kg", "atm"],
  formulas: [
    {
      id: "q-osmose",
      name: "Pressão osmótica",
      latex: "\\Pi = M R T \\cdot i",
      description: "Pressão para reverter osmose.",
      variables: [
        { symbol: "\\Pi", meaning: "pressão osmótica", unit: "atm" },
        { symbol: "M", meaning: "molaridade", unit: "mol/L" },
        { symbol: "i", meaning: "van't Hoff", unit: "-" },
      ],
      whenToUse: "Soluções diluídas; biologia.",
    },
  ],
  lessons: [
    lesson("q13-l1", "Coligativas", "concept", 10, 5, {
      concepts: [
        {
          title: "ΔT_f e ΔT_b",
          body: "ΔT_f = K_f·m·i (água: K_f=1,86); ΔT_b = K_b·m·i (água: K_b=0,512).",
        },
      ],
      exercises: [
        mkNum(
          "q13-l1-e1",
          "ΔT_f (em °C) ao adicionar 1 mol de glicose em 1 kg de água (K_f=1,86, i=1).",
          1.86,
          0.05,
          "1,86·1·1 = 1,86 °C.",
          { difficulty: 2 },
        ),
        mkMc(
          "q13-l1-e2",
          "Para NaCl em água, i ≈:",
          ["0,5", "1", "2", "3"],
          2,
          "NaCl → Na⁺ + Cl⁻.",
          { difficulty: 1 },
        ),
        mkTf(
          "q13-l1-e3",
          "Pressão osmótica é coligativa.",
          true,
          "Depende só do número de partículas, não da identidade.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

export const cap14q: Chapter = chapter({
  id: "q14-cinetica",
  number: 14,
  subject: "quimica",
  title: "Cinética Química",
  subtitle: "Velocidade, ordem de reação, mecanismos e Arrhenius",
  color: "#a855f7",
  emoji: "⏱️",
  objectives: ["Calcular velocidade.", "Identificar ordem.", "Aplicar Arrhenius."],
  keyConcepts: [
    "Velocidade média e instantânea",
    "Lei de velocidade: v = k[A]^m[B]^n",
    "Ordens 0, 1, 2 e meia-vida",
    "Mecanismos e etapa lenta",
    "Arrhenius: k = A·e^(-Ea/RT)",
    "Catálise abaixa Ea",
  ],
  commonMistakes: ["Confundir ordem total com molecularidade.", "Trocar k por v."],
  units: ["mol/(L·s)", "s⁻¹", "kJ/mol"],
  formulas: [
    {
      id: "q-arrhenius",
      name: "Arrhenius",
      latex: "k = A e^{-E_a/(RT)}",
      description: "Dependência da constante de velocidade com T.",
      variables: [
        { symbol: "E_a", meaning: "energia de ativação", unit: "J/mol" },
        { symbol: "R", meaning: "8,314 J/(mol·K)", unit: "" },
      ],
      whenToUse: "Comparar velocidades em diferentes temperaturas.",
    },
  ],
  lessons: [
    lesson("q14-l1", "Ordem e Arrhenius", "concept", 12, 5, {
      concepts: [
        {
          title: "Reação de 1ª ordem",
          body: "ln[A] = ln[A]₀ - kt; meia-vida t½ = ln2/k (independe de [A]₀).",
        },
      ],
      exercises: [
        mkMc(
          "q14-l1-e1",
          "Para v = k[A]²[B], a ordem total é:",
          ["1", "2", "3", "4"],
          2,
          "2 + 1 = 3.",
          { difficulty: 1 },
        ),
        mkTf(
          "q14-l1-e2",
          "Catalisador altera a constante de equilíbrio.",
          false,
          "Apenas reduz Ea (acelera direto e inverso igualmente).",
          { difficulty: 2 },
        ),
        mkNum(
          "q14-l1-e3",
          "Meia-vida (s) de reação 1ª ordem com k = 0,1 s⁻¹.",
          6.93,
          0.05,
          "t½ = ln2/k ≈ 6,93 s.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

export const cap15q: Chapter = chapter({
  id: "q15-equilibrio",
  number: 15,
  subject: "quimica",
  title: "Equilíbrio Químico",
  subtitle: "Kc, Kp, Le Chatelier e Q",
  color: "#16a34a",
  emoji: "⚖️",
  objectives: ["Calcular Kc/Kp.", "Aplicar Le Chatelier.", "Comparar Q e K."],
  keyConcepts: [
    "K_c = [P]/[R]; sólidos/líquidos não entram",
    "K_p = K_c·(RT)^Δn",
    "Q vs K → direção do desloc.",
    "Le Chatelier: pressão, T, concentração",
  ],
  commonMistakes: ["Incluir sólido em K.", "Inverter Q×K."],
  units: ["mol/L", "atm"],
  formulas: [],
  lessons: [
    lesson("q15-l1", "Le Chatelier", "concept", 10, 5, {
      concepts: [
        {
          title: "Princípio de Le Chatelier",
          body: "Sistema em equilíbrio reage à perturbação para minimizá-la (concentração, P, T).",
        },
      ],
      exercises: [
        mkMc(
          "q15-l1-e1",
          "Para N₂ + 3H₂ ⇌ 2NH₃ (exotérmica), aquecer:",
          ["Aumenta NH₃", "Diminui NH₃", "Não muda", "Aumenta N₂ apenas"],
          1,
          "Aumentar T desloca pra endo (reagentes).",
          { difficulty: 2 },
        ),
        mkTf(
          "q15-l1-e2",
          "Q < K significa que a reação tende a formar mais produto.",
          true,
          "Sistema vai pra direita até Q = K.",
          { difficulty: 2 },
        ),
        mkMc(
          "q15-l1-e3",
          "Aumentar P em N₂(g) + 3H₂(g) ⇌ 2NH₃(g):",
          ["Desloca p/ reagentes", "Desloca p/ produtos", "Sem efeito", "Inverte K"],
          1,
          "Sentido com menor número de mols gasosos (4 → 2).",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

export const cap16q: Chapter = chapter({
  id: "q16-acido-base",
  number: 16,
  subject: "quimica",
  title: "Equilíbrios Ácido-Base",
  subtitle: "pH, Ka, Kb, Kw e teorias",
  color: "#fb7185",
  emoji: "🧂",
  objectives: ["Calcular pH de fortes/fracos.", "Aplicar Ka·Kb=Kw."],
  keyConcepts: [
    "Arrhenius, Brønsted-Lowry, Lewis",
    "Kw = 10⁻¹⁴ a 25°C",
    "pH = -log[H⁺], pOH = -log[OH⁻], pH+pOH=14",
    "Ácido/base conjugados",
  ],
  commonMistakes: ["Tratar fraco como forte.", "Esquecer Ka·Kb=Kw."],
  units: ["mol/L", "pH"],
  formulas: [
    { id: "q-ph", name: "pH", latex: "pH = -\\log[H^+]", description: "Escala de acidez.", variables: [], whenToUse: "Sempre." },
  ],
  lessons: [
    lesson("q16-l1", "pH", "concept", 12, 5, {
      concepts: [
        { title: "pH de soluções fortes", body: "Forte 100% ionizado: HCl 0,01 M → [H⁺]=0,01 → pH=2." },
      ],
      exercises: [
        mkNum("q16-l1-e1", "pH de HCl 0,001 M.", 3, 0.05, "pH=-log(10⁻³)=3.", { difficulty: 1 }),
        mkNum(
          "q16-l1-e2",
          "pOH de NaOH 0,01 M.",
          2,
          0.05,
          "[OH⁻]=0,01 → pOH=2.",
          { difficulty: 1 },
        ),
        mkMc(
          "q16-l1-e3",
          "Ácido conjugado de NH₃ é:",
          ["NH₂⁻", "NH₄⁺", "N₂", "NO₃⁻"],
          1,
          "NH₃ + H⁺ → NH₄⁺.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

export const cap17q: Chapter = chapter({
  id: "q17-equilibrios-aquosos",
  number: 17,
  subject: "quimica",
  title: "Aspectos Adicionais dos Equilíbrios Aquosos",
  subtitle: "Tampões, titulação, Ksp e formação de complexos",
  color: "#f43f5e",
  emoji: "🧫",
  objectives: ["Calcular pH de tampão.", "Aplicar Ksp."],
  keyConcepts: [
    "Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA])",
    "Ponto de equivalência vs viragem",
    "Ksp = [cátion]^a[ânion]^b",
    "Q vs Ksp ⇒ precipita?",
  ],
  commonMistakes: ["Inverter razão A⁻/HA.", "Esquecer expoentes em Ksp."],
  units: ["mol/L", "pH"],
  formulas: [
    {
      id: "q-hh",
      name: "Henderson-Hasselbalch",
      latex: "pH = pK_a + \\log\\dfrac{[A^-]}{[HA]}",
      description: "pH de tampão.",
      variables: [],
      whenToUse: "Tampões.",
    },
  ],
  lessons: [
    lesson("q17-l1", "Tampões e Ksp", "concept", 12, 6, {
      concepts: [
        {
          title: "Tampão",
          body: "Mistura ácido fraco + base conjugada (ou vice-versa) que resiste a mudanças de pH.",
        },
      ],
      exercises: [
        mkNum(
          "q17-l1-e1",
          "pH de tampão com [HA]=[A⁻] e pKa=4,76.",
          4.76,
          0.05,
          "log(1)=0 ⇒ pH=pKa.",
          { difficulty: 2 },
        ),
        mkMc(
          "q17-l1-e2",
          "Para AgCl, Ksp = [Ag⁺][Cl⁻]. Se [Ag⁺]=10⁻⁵ e [Cl⁻]=10⁻⁵, Q vs Ksp=1,8·10⁻¹⁰:",
          ["Q < Ksp, sem precipitação", "Q > Ksp, precipita", "Q = Ksp", "Não dá para saber"],
          1,
          "Q=10⁻¹⁰ > 1,8·10⁻¹⁰? 10⁻¹⁰ ≈ 10·10⁻¹¹ > 1,8·10⁻¹⁰? Não — 10⁻¹⁰ vs 1,8·10⁻¹⁰: Q < Ksp, na verdade. Resposta deveria ser 'Q<Ksp' — corrija leitura.",
          { difficulty: 3 },
        ),
      ],
    }),
  ],
});

export const cap18q: Chapter = chapter({
  id: "q18-quimica-ambiental",
  number: 18,
  subject: "quimica",
  title: "Química Ambiental",
  subtitle: "Atmosfera, água, chuva ácida e poluentes",
  color: "#84cc16",
  emoji: "🌍",
  objectives: ["Reconhecer poluentes principais.", "Discutir efeito estufa e camada de ozônio."],
  keyConcepts: [
    "Composição da troposfera (N₂, O₂, CO₂)",
    "Efeito estufa (CO₂, CH₄, H₂O)",
    "Chuva ácida (SO₂, NOx)",
    "Buraco de ozônio (CFCs)",
  ],
  commonMistakes: ["Confundir efeito estufa com camada de ozônio."],
  units: ["ppm", "ppb"],
  formulas: [],
  lessons: [
    lesson("q18-l1", "Atmosfera e poluentes", "concept", 8, 4, {
      concepts: [
        {
          title: "Resumo",
          body: "Estufa ≠ Ozônio. Estufa retém calor (IR); ozônio bloqueia UV.",
        },
      ],
      exercises: [
        mkMc(
          "q18-l1-e1",
          "Principal causador da chuva ácida:",
          ["CO₂", "SO₂ e NOx", "CFCs", "CH₄"],
          1,
          "SO₂ + H₂O → H₂SO₃; idem NOx.",
          { difficulty: 1 },
        ),
        mkTf(
          "q18-l1-e2",
          "CFCs destroem o ozônio estratosférico.",
          true,
          "Liberam Cl que catalisa O₃→O₂.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

export const cap19q: Chapter = chapter({
  id: "q19-termodinamica",
  number: 19,
  subject: "quimica",
  title: "Termodinâmica Química",
  subtitle: "Entropia, energia livre de Gibbs e espontaneidade",
  color: "#fb923c",
  emoji: "♨️",
  objectives: ["Aplicar ΔG = ΔH - TΔS.", "Relacionar ΔG° e K."],
  keyConcepts: [
    "S aumenta com gases, mistura, T",
    "ΔS_univ > 0 ⇒ espontâneo",
    "ΔG = ΔH - TΔS",
    "ΔG° = -RT ln K",
  ],
  commonMistakes: ["Esquecer T em K.", "Confundir ΔG com ΔG°."],
  units: ["J/(mol·K)", "kJ/mol"],
  formulas: [
    {
      id: "q-gibbs",
      name: "Energia livre de Gibbs",
      latex: "\\Delta G = \\Delta H - T\\Delta S",
      description: "Espontaneidade.",
      variables: [],
      whenToUse: "Decidir se a reação é espontânea.",
    },
  ],
  lessons: [
    lesson("q19-l1", "Espontaneidade", "concept", 12, 5, {
      concepts: [
        {
          title: "Sinal de ΔG",
          body: "ΔG<0 espontânea, ΔG>0 não-espontânea (reverso é), ΔG=0 equilíbrio.",
        },
      ],
      exercises: [
        mkNum(
          "q19-l1-e1",
          "ΔG (kJ/mol) com ΔH=-50, T=300, ΔS=-0,1 kJ/(mol·K).",
          -20,
          0.5,
          "-50 - 300·(-0,1) = -50+30 = -20.",
          { difficulty: 2 },
        ),
        mkMc(
          "q19-l1-e2",
          "ΔH<0 e ΔS>0:",
          ["Sempre espontânea", "Nunca espontânea", "Espontânea só baixa T", "Espontânea só alta T"],
          0,
          "ΔG = ΔH - TΔS é sempre negativo.",
          { difficulty: 2 },
        ),
        mkTf(
          "q19-l1-e3",
          "K > 1 implica ΔG° < 0.",
          true,
          "ΔG°=-RT ln K.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

export const cap20q: Chapter = chapter({
  id: "q20-eletroquimica",
  number: 20,
  subject: "quimica",
  title: "Eletroquímica",
  subtitle: "Pilhas, eletrólise, Nernst",
  color: "#eab308",
  emoji: "🔋",
  objectives: ["Calcular E° da pilha.", "Aplicar Faraday.", "Usar Nernst."],
  keyConcepts: [
    "Anodo (oxidação) e cátodo (redução)",
    "E°_cel = E°_cat - E°_ano",
    "ΔG° = -nFE°",
    "Nernst: E = E° - (RT/nF) ln Q",
    "Faraday: m = (Q·M)/(n·F)",
  ],
  commonMistakes: ["Trocar ano com cátodo.", "Esquecer n na Nernst."],
  units: ["V", "C", "F = 96485 C/mol"],
  formulas: [
    {
      id: "q-nernst",
      name: "Equação de Nernst",
      latex: "E = E^\\circ - \\dfrac{RT}{nF} \\ln Q",
      description: "Potencial fora das condições padrão.",
      variables: [],
      whenToUse: "Concentrações ≠ 1 M.",
    },
  ],
  lessons: [
    lesson("q20-l1", "Pilha e Faraday", "concept", 12, 6, {
      concepts: [
        {
          title: "Sinais",
          body: "Pilha espontânea: E°_cel > 0 ⇒ ΔG° < 0.",
        },
      ],
      exercises: [
        mkNum(
          "q20-l1-e1",
          "E° de pilha Zn|Zn²⁺‖Cu²⁺|Cu (E°(Cu)=+0,34, E°(Zn)=-0,76):",
          1.10,
          0.02,
          "0,34 - (-0,76) = 1,10 V.",
          { difficulty: 2 },
        ),
        mkMc(
          "q20-l1-e2",
          "Em pilha de Daniell, oxidação ocorre em:",
          ["Cu", "Zn", "ambos", "nenhum"],
          1,
          "Zn é o ano (mais ativo).",
          { difficulty: 2 },
        ),
        mkTf(
          "q20-l1-e3",
          "Eletrólise é processo não-espontâneo.",
          true,
          "Requer fonte externa.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

export const cap21q: Chapter = chapter({
  id: "q21-quimica-nuclear",
  number: 21,
  subject: "quimica",
  title: "Química Nuclear",
  subtitle: "Decaimento, fusão, fissão e datação",
  color: "#dc2626",
  emoji: "☢️",
  objectives: ["Reconhecer decaimentos α, β, γ.", "Aplicar t½."],
  keyConcepts: [
    "α (⁴₂He), β⁻ (e⁻), β⁺ (pósitron), γ",
    "Meia-vida e cinética 1ª ordem",
    "Datação por ¹⁴C (t½=5730 anos)",
    "Fissão (U-235), fusão (estrelas)",
  ],
  commonMistakes: ["Trocar α por β.", "Esquecer que decaimento é 1ª ordem."],
  units: ["anos", "Bq", "Sv"],
  formulas: [],
  lessons: [
    lesson("q21-l1", "Decaimento", "concept", 10, 5, {
      concepts: [
        {
          title: "Tipos de decaimento",
          body:
            "α: A↓4, Z↓2 (²³⁸U → ²³⁴Th + α)\n" +
            "β⁻: A=, Z↑1 (n → p + e⁻)\n" +
            "β⁺: A=, Z↓1 (p → n + e⁺)\n" +
            "γ: só fóton (sem mudar A, Z)",
        },
      ],
      exercises: [
        mkMc(
          "q21-l1-e1",
          "²³⁸U (Z=92) decai α. O filho é:",
          ["²³⁴Th (Z=90)", "²³⁴Pa (Z=91)", "²³⁸Th (Z=90)", "²³⁹U (Z=92)"],
          0,
          "A↓4, Z↓2 → ²³⁴Th.",
          { difficulty: 2 },
        ),
        mkNum(
          "q21-l1-e2",
          "Após 3 meias-vidas, fração restante (em %):",
          12.5,
          0.5,
          "(1/2)³ = 12,5 %.",
          { difficulty: 1 },
        ),
        mkTf(
          "q21-l1-e3",
          "Fusão libera mais energia por núcleon que fissão para elementos leves.",
          true,
          "Pico em Fe; abaixo dele fusão libera, acima fissão libera.",
          { difficulty: 2 },
        ),
      ],
    }),
  ],
});

export const cap22q: Chapter = chapter({
  id: "q22-nao-metais",
  number: 22,
  subject: "quimica",
  title: "Química dos Não-Metais",
  subtitle: "Hidrogênio, halogênios, oxigênio, enxofre, nitrogênio",
  color: "#22d3ee",
  emoji: "💎",
  objectives: ["Conhecer reatividade típica dos grupos 14-17."],
  keyConcepts: [
    "H₂: principal redutor; síntese de NH₃ (Haber)",
    "Halogênios: F > Cl > Br > I em reatividade",
    "O₂, O₃; chuva ácida (SO₂)",
    "N₂ inerte; nitratos como oxidantes",
  ],
  commonMistakes: ["Confundir reatividade dos halogênios com seu PE."],
  units: ["g/mol"],
  formulas: [],
  lessons: [
    lesson("q22-l1", "Família dos halogênios", "concept", 8, 4, {
      concepts: [
        { title: "Reatividade", body: "F > Cl > Br > I (maior afinidade eletrônica em F)." },
      ],
      exercises: [
        mkMc(
          "q22-l1-e1",
          "Mais reativo:",
          ["I", "Br", "Cl", "F"],
          3,
          "F é o mais reativo dos halogênios.",
          { difficulty: 1 },
        ),
        mkTf("q22-l1-e2", "Síntese de NH₃ via Haber usa N₂ + H₂.", true, "N₂+3H₂⇌2NH₃.", { difficulty: 1 }),
      ],
    }),
  ],
});

export const cap23q: Chapter = chapter({
  id: "q23-transicao-coordenacao",
  number: 23,
  subject: "quimica",
  title: "Metais de Transição e Química de Coordenação",
  subtitle: "Complexos, ligantes, isomeria e teoria do campo cristalino",
  color: "#7c3aed",
  emoji: "💠",
  objectives: ["Identificar ligantes.", "Aplicar nomenclatura básica.", "Diferenciar high/low spin."],
  keyConcepts: [
    "Ligante mono/bi/polidentado (EDTA hexa)",
    "Número de coordenação (4, 6 comuns)",
    "Carga do íon central + cargas dos ligantes = carga total",
    "Cor: Δ_o do campo cristalino",
  ],
  commonMistakes: ["Esquecer que NH₃ é neutro mas Cl⁻ tem carga."],
  units: ["nm"],
  formulas: [],
  lessons: [
    lesson("q23-l1", "Complexos", "concept", 10, 5, {
      concepts: [
        { title: "Carga", body: "Em [Co(NH₃)₆]³⁺, NH₃=0 → Co=+3." },
      ],
      exercises: [
        mkMc(
          "q23-l1-e1",
          "NÚMERO de coordenação em [Cu(NH₃)₄]²⁺:",
          ["2", "4", "6", "8"],
          1,
          "4 ligantes monodentados.",
          { difficulty: 1 },
        ),
        mkTf(
          "q23-l1-e2",
          "EDTA é hexadentado.",
          true,
          "4 oxigênios + 2 nitrogênios.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});

export const cap24q: Chapter = chapter({
  id: "q24-organica-biologica",
  number: 24,
  subject: "quimica",
  title: "Química Orgânica e Biológica",
  subtitle: "Hidrocarbonetos, grupos funcionais, biomoléculas",
  color: "#65a30d",
  emoji: "🧫",
  objectives: ["Reconhecer grupos funcionais.", "Distinguir alcanos, alcenos, alcinos."],
  keyConcepts: [
    "Alcano (sat.) CnH2n+2; alceno CnH2n; alcino CnH2n-2",
    "Grupos: -OH álcool, -COOH ácido, -COO- éster, -NH₂ amina, -CHO aldeído, -CO- cetona",
    "Biomoléculas: carboidratos, lipídios, proteínas, ácidos nucleicos",
  ],
  commonMistakes: ["Confundir aldeído (-CHO) com cetona (R-CO-R)."],
  units: ["g/mol"],
  formulas: [],
  lessons: [
    lesson("q24-l1", "Grupos funcionais", "concept", 10, 5, {
      concepts: [
        { title: "Identificação rápida", body: "-OH álcool; -COOH ácido carboxílico; -CHO aldeído; -O- éter." },
      ],
      exercises: [
        mkMc(
          "q24-l1-e1",
          "CH₃CH₂OH é um:",
          ["Alcano", "Alceno", "Álcool", "Éster"],
          2,
          "Etanol (álcool).",
          { difficulty: 1 },
        ),
        mkMc(
          "q24-l1-e2",
          "Fórmula geral de alcano:",
          ["CnH2n+2", "CnH2n", "CnH2n-2", "CnH2n+1"],
          0,
          "Alcano sat.",
          { difficulty: 1 },
        ),
        mkTf(
          "q24-l1-e3",
          "Proteínas são polímeros de aminoácidos ligados por ligações peptídicas.",
          true,
          "Sim.",
          { difficulty: 1 },
        ),
      ],
    }),
  ],
});
