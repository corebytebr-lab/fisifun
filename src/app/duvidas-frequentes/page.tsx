import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema, HOME_FAQ } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Dúvidas frequentes — FisiFun",
  description:
    "Respostas pras dúvidas mais comuns sobre o FisiFun: como funciona, quanto custa, quais matérias, IA tutora, plano Família, plano Escola, cancelamento e mais.",
  alternates: { canonical: "/duvidas-frequentes" },
  openGraph: {
    title: "Perguntas frequentes — FisiFun",
    description: "Tire suas dúvidas sobre o app de estudos gamificado de Física, Química, Cálculo e GA.",
    url: "/duvidas-frequentes",
  },
};

const FAQ = [
  {
    section: "Sobre o FisiFun",
    items: HOME_FAQ,
  },
  {
    section: "Conteúdo e estudo",
    items: [
      {
        q: "O conteúdo cobre todo o vestibular?",
        a: "Sim. As trilhas seguem os livros mais cobrados em vestibulares brasileiros: Halliday pra Física, Brown pra Química Geral, Stewart pra Cálculo 1 e Winterle pra Geometria Analítica. Tudo que cai em Enem, Fuvest, Unicamp, UFRJ, UFMG, ITA/IME e vestibulares de medicina está coberto.",
      },
      {
        q: "Tem questões de Enem e vestibulares no app?",
        a: "Os exercícios são adaptados do estilo Enem/vestibular, focados em interpretação e aplicação. Não copiamos provas literais (questão de direito autoral), mas o nível e formato são idênticos ao que cai.",
      },
      {
        q: "Posso usar o FisiFun se já estou na faculdade?",
        a: "Sim, é o uso principal de muitos alunos. Cálculo 1 e Geometria Analítica são as duas matérias mais reprovadas em engenharia, e o FisiFun te ajuda a fixar conteúdo e treinar resolução de exercícios passo a passo.",
      },
      {
        q: "Como funciona a revisão espaçada (SRS)?",
        a: "A revisão espaçada é uma técnica científica que mostra um conteúdo de novo no momento certo antes de você esquecer. O algoritmo SM-2 (o mesmo do Anki) calcula quando você precisa revisar cada conceito baseado em quão fácil foi pra você. Resultado: você estuda menos tempo e fixa muito mais.",
      },
      {
        q: "Tem fórmulas e flashcards?",
        a: "Sim. Há um caderno de fórmulas pesquisável (cinemática, dinâmica, termodinâmica, ondas, eletricidade, química, cálculo) e flashcards prontos pra revisão antes da prova. Você também pode criar seus próprios flashcards.",
      },
    ],
  },
  {
    section: "IA tutora",
    items: [
      {
        q: "Como funciona a IA tutora do FisiFun?",
        a: "Você manda foto do exercício (ou descreve em texto) e a IA — baseada no Gemini do Google — explica passo a passo: identifica a fórmula correta, mostra como aplicar, substitui os valores e chega na resposta final. Funciona pra qualquer matéria do app: Física, Química, Cálculo e GA.",
      },
      {
        q: "Qual o limite de perguntas por mês?",
        a: "Plano Aluno: 30/mês. Plano Total: 100/mês. Plano Premium: ilimitado. Trial: 100 perguntas nos 3 dias gratuitos.",
      },
      {
        q: "A IA pode estar errada?",
        a: "Raramente, mas pode. A IA é boa pra explicar conceitos e resolver exercícios típicos, mas pode errar em casos muito específicos ou contas longas. Sempre confira a resposta com o gabarito ou peça pra IA verificar de outra forma.",
      },
    ],
  },
  {
    section: "Planos, pagamento e cancelamento",
    items: [
      {
        q: "Quais formas de pagamento aceitam?",
        a: "Cartão de crédito (parcelável), Pix e boleto bancário, processados pela Kiwify (gateway brasileiro com criptografia SSL).",
      },
      {
        q: "Posso parcelar?",
        a: "Sim. Os planos mensais não fazem sentido parcelar (já é mês a mês), mas o plano Anual de R$799 pode ser parcelado em até 12x no cartão de crédito.",
      },
      {
        q: "Como cancelar?",
        a: "Direto no painel da Kiwify (link de cancelamento vem no email da compra) ou pelo email contato@corebytecnologia.com. Sem multa, sem fidelidade. O acesso continua até o fim do mês pago.",
      },
      {
        q: "Tenho garantia de reembolso?",
        a: "Sim. 7 dias de garantia incondicional pelo Código de Defesa do Consumidor brasileiro. Não gostou? Pede reembolso e devolvemos 100%.",
      },
      {
        q: "Como funciona o plano Família?",
        a: "Você assina por R$199/mês e convida até 3 outras pessoas (total 4 contas, custa R$49,75 por pessoa). Cada uma recebe um link mágico por email e tem acesso completo ao plano Total. Quando você renova, todos renovam junto.",
      },
      {
        q: "E o plano Escola?",
        a: "Pra escolas, cursinhos ou turmas com 20+ alunos. Inclui painel do gestor com ranking de XP, tempo estudado, conquistas e gestão de convites. Preço sob medida com desconto por volume — falar pelo WhatsApp na página de preços.",
      },
    ],
  },
  {
    section: "App e tecnologia",
    items: [
      {
        q: "Tem app no Google Play ou App Store?",
        a: "Não temos app nativo nas lojas (ainda), mas o FisiFun é um PWA: você abre no navegador (Chrome no Android, Safari no iOS) e adiciona à tela inicial. Vira tipo um app, com ícone, splash screen, tudo. E não ocupa espaço.",
      },
      {
        q: "Funciona offline?",
        a: "Parcialmente. As trilhas, capítulos e fórmulas que você já abriu ficam disponíveis offline. A IA tutora e o sincronismo de progresso precisam de internet.",
      },
      {
        q: "Os dados são salvos na nuvem?",
        a: "Sim. Seu progresso, XP, conquistas e flashcards são salvos no servidor — você pode trocar de celular ou computador e tudo continua lá.",
      },
      {
        q: "Funciona em iPhone?",
        a: "Sim, no Safari. Pra adicionar à tela inicial: abre fisifun.corebytecnologia.com no Safari → botão de compartilhar → 'Adicionar à Tela de Início'.",
      },
    ],
  },
] as const;

const ALL_FAQ_ITEMS = FAQ.flatMap((s) => s.items);

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={buildFaqSchema(ALL_FAQ_ITEMS)} />

      <nav className="mb-4 text-xs text-[var(--muted)]">
        <Link href="/" className="hover:underline">Início</Link>
        {" / "}
        <span>Dúvidas frequentes</span>
      </nav>

      <h1 className="text-3xl font-extrabold md:text-4xl">Dúvidas frequentes</h1>
      <p className="mt-4 text-base text-[var(--muted)]">
        Respostas pras perguntas mais comuns sobre o FisiFun. Não achou sua dúvida? Manda no
        WhatsApp ou pelo email <strong>contato@corebytecnologia.com</strong>.
      </p>

      {FAQ.map((section) => (
        <section key={section.section} className="mt-8">
          <h2 className="text-2xl font-extrabold">{section.section}</h2>
          <div className="mt-3 space-y-3">
            {section.items.map((f) => (
              <details
                key={f.q}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4"
              >
                <summary className="cursor-pointer font-bold">{f.q}</summary>
                <p className="mt-2 text-sm text-[var(--muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/precos"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
        >
          Ver preços
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold hover:bg-[var(--bg-elev)]"
        >
          Começar grátis (3 dias)
        </Link>
        <a
          href="https://wa.me/5561991770953?text=Oi!%20Tenho%20uma%20dúvida%20sobre%20o%20FisiFun."
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
        >
          Falar pelo WhatsApp
        </a>
      </div>
    </main>
  );
}
