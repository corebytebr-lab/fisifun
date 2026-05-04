// Schema.org payloads centralizados. Mantém JSON-LD reutilizável e tipável.
// Foco: Google entender que "FisiFun" é um app educacional brasileiro,
// rankear bem em buscas tipo "fisifun", "estudar física online", etc.

const SITE_URL = process.env.PUBLIC_APP_URL ?? "https://fisifun.corebytecnologia.com";

export const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "FisiFun",
  alternateName: ["FisiFun App", "FisiFun Estudos"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon-512.png`,
    width: 512,
    height: 512,
  },
  sameAs: [
    "https://corebytecnologia.com",
  ],
  description:
    "FisiFun é um app brasileiro de estudos gamificado pra Física, Química, Cálculo 1 e Geometria Analítica. Trilhas, XP, IA tutora e revisão espaçada pra Enem, vestibular e engenharia.",
  founder: {
    "@type": "Organization",
    name: "CoreByte Tecnologia",
    url: "https://corebytecnologia.com",
  },
  knowsLanguage: ["pt-BR", "Portuguese"],
  areaServed: { "@type": "Country", name: "Brazil" },
} as const;

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "FisiFun",
  alternateName: "FisiFun — Estude Física, Química, Cálculo 1 e GA",
  inLanguage: "pt-BR",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
} as const;

export const SOFTWARE_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#app`,
  name: "FisiFun",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web, iOS, Android (PWA)",
  inLanguage: "pt-BR",
  url: SITE_URL,
  description:
    "App de estudos gamificado de Física, Química, Cálculo 1 e Geometria Analítica. Trilhas, XP, IA tutora, exercícios resolvidos e revisão espaçada.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  offers: [
    {
      "@type": "Offer",
      name: "Trial gratuito",
      price: "0.00",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      description: "3 dias com tudo do plano Total liberado, sem cartão.",
    },
    {
      "@type": "Offer",
      name: "Aluno",
      price: "59.90",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      description: "1 matéria à escolha, 30 perguntas IA/mês.",
    },
    {
      "@type": "Offer",
      name: "Total",
      price: "99.90",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      description: "Física + Química + Cálculo 1 + GA, 100 perguntas IA/mês.",
    },
    {
      "@type": "Offer",
      name: "Premium",
      price: "149.90",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      description: "Tudo do Total + IA ilimitada + prioridade.",
    },
    {
      "@type": "Offer",
      name: "Família",
      price: "199.00",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      description: "Até 4 contas com plano Total. 1 paga, todos estudam.",
    },
    {
      "@type": "Offer",
      name: "Anual",
      price: "799.00",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      description: "Total por 12 meses, pagamento único, ~33% off vs mensal.",
    },
  ],
  featureList: [
    "Trilhas com 60+ capítulos baseadas em Halliday, Brown, Stewart, Winterle",
    "Sistema de XP, níveis e conquistas",
    "IA tutora com Gemini (resolve dúvidas com foto)",
    "Revisão espaçada (SRS)",
    "Vídeo-aulas integradas",
    "Plano Família com até 4 contas",
    "Plano Escola B2B com gestão de turma",
  ],
} as const;

interface FaqItem {
  q: string;
  a: string;
}

export function buildFaqSchema(faqs: ReadonlyArray<FaqItem>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  } as const;
}

export const HOME_FAQ: ReadonlyArray<FaqItem> = [
  {
    q: "O que é o FisiFun?",
    a: "FisiFun é um aplicativo brasileiro de estudos gamificado focado em Física, Química, Cálculo 1 e Geometria Analítica. Funciona estilo Duolingo: você ganha XP a cada exercício, sobe níveis, desbloqueia conquistas e mantém uma sequência diária. Ideal pra estudantes de cursinho, vestibular, Enem e engenharia.",
  },
  {
    q: "Quanto custa o FisiFun?",
    a: "Tem trial grátis de 3 dias com tudo liberado. Depois: Aluno (1 matéria) R$59,90/mês, Total (4 matérias) R$99,90/mês, Premium (IA ilimitada) R$149,90/mês, Família (até 4 contas) R$199/mês, ou Anual R$799 (paga 1 vez, vale 12 meses).",
  },
  {
    q: "Quais matérias estão disponíveis?",
    a: "Física 1 (Halliday: cinemática, dinâmica, energia, fluidos, ondas, termodinâmica), Química Geral (Brown: ligações, estequiometria, gases, soluções, equilíbrio), Cálculo 1 (Stewart: limites, derivadas, integrais) e Geometria Analítica (Winterle: vetores, retas, planos, cônicas).",
  },
  {
    q: "Como funciona a IA tutora?",
    a: "Você pode mandar foto de um exercício ou descrever uma dúvida e a IA (Gemini) explica passo a passo, mostrando a fórmula, substituindo valores e chegando na resposta. Os planos têm cotas: Aluno 30/mês, Total 100/mês, Premium ilimitada.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim. O FisiFun é um PWA (Progressive Web App): você abre no navegador e adiciona à tela inicial, vira tipo um app nativo. Funciona em iPhone, Android, tablet, notebook ou desktop.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim, sem multa nem fidelidade. Cancelamento direto no painel da Kiwify (gateway de pagamento). O acesso continua liberado até o fim do mês pago.",
  },
  {
    q: "FisiFun serve pra Enem e vestibular?",
    a: "Sim. O conteúdo cobre todo o programa de Física, Química e Matemática (Cálculo 1 + GA) cobrado em Enem, Fuvest, Unicamp, vestibulares de medicina e engenharia. As trilhas seguem livros consagrados pra você não estudar nada que não cai.",
  },
  {
    q: "Tem plano para escolas e cursinhos?",
    a: "Sim, plano B2B sob medida pra escolas e cursinhos com 20+ alunos. Inclui painel do gestor com ranking de XP, tempo estudado, conquistas e gestão de convites. Falar pelo WhatsApp na página de preços.",
  },
];
