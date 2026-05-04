import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Preços e Planos — FisiFun",
  description:
    "Veja todos os planos do FisiFun: Aluno R$59,90, Total R$99,90, Premium R$149,90, Família R$199 e Anual R$799. Comece grátis 3 dias com tudo liberado.",
  alternates: { canonical: "/precos" },
  openGraph: {
    title: "Preços e Planos — FisiFun",
    description:
      "Aluno · Total · Premium · Família · Anual. Estude Física, Química, Cálculo 1 e Geometria Analítica de forma gamificada.",
    url: "/precos",
  },
};

interface Plan {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Trial",
    price: "Grátis",
    period: "3 dias",
    desc: "Comece sem cartão. Tudo do Total liberado por 3 dias.",
    features: ["4 matérias liberadas", "100 perguntas IA", "Trilhas e XP", "Cancele quando quiser"],
    cta: "Começar grátis",
    href: "/login",
  },
  {
    name: "Aluno",
    price: "R$59,90",
    period: "/mês",
    desc: "Pra quem quer focar em uma matéria só.",
    features: ["1 matéria à escolha", "30 perguntas IA/mês", "Trilhas + XP + conquistas", "Suporte"],
    cta: "Assinar Aluno",
    href: "https://pay.kiwify.com.br/QNYIJTk",
  },
  {
    name: "Total",
    price: "R$99,90",
    period: "/mês",
    desc: "O queridinho. Pra quem estuda pra vestibular ou engenharia.",
    features: [
      "Física + Química + Cálculo 1 + GA",
      "100 perguntas IA/mês",
      "Trilhas + XP + conquistas",
      "Halliday + Brown + Stewart + Winterle",
    ],
    cta: "Assinar Total",
    href: "https://pay.kiwify.com.br/XSn7Pgl",
    highlight: true,
  },
  {
    name: "Premium",
    price: "R$149,90",
    period: "/mês",
    desc: "Pra quem usa muito a IA e quer prioridade.",
    features: ["4 matérias", "IA ilimitada", "Prioridade no suporte", "Acesso antecipado a recursos novos"],
    cta: "Assinar Premium",
    href: "https://pay.kiwify.com.br/Z7tJdHL",
  },
  {
    name: "Família",
    price: "R$199",
    period: "/mês",
    desc: "1 paga, até 4 estudam. Ideal pra família ou irmãos.",
    features: ["Até 4 contas com Total", "Convite por e-mail (magic link)", "Renovação automática pra todos", "50% off vs individual"],
    cta: "Assinar Família",
    href: "https://pay.kiwify.com.br/hyJud91",
  },
  {
    name: "Anual",
    price: "R$799",
    period: "/ano",
    desc: "Total por 12 meses. Economiza ~33% vs mensal.",
    features: ["4 matérias liberadas", "IA + trilhas + tudo do Total", "Pagamento único", "Sem renovação automática"],
    cta: "Comprar Anual",
    href: "https://pay.kiwify.com.br/yV51NyY",
  },
];

export default function PrecosPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold md:text-5xl">Preços simples. Estudo sério.</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--muted)] md:text-base">
          Comece grátis por 3 dias. Cancele quando quiser. Pagamento seguro pela Kiwify (cartão, Pix ou boleto).
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`flex flex-col rounded-2xl border p-5 ${
              p.highlight
                ? "border-indigo-500 bg-indigo-500/5 shadow-lg"
                : "border-[var(--border)] bg-[var(--bg-elev)]"
            }`}
          >
            {p.highlight && (
              <div className="mb-2 self-start rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
                MAIS POPULAR
              </div>
            )}
            <h2 className="text-xl font-extrabold">{p.name}</h2>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold">{p.price}</span>
              <span className="text-sm text-[var(--muted)]">{p.period}</span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{p.desc}</p>
            <ul className="mt-4 flex flex-1 flex-col gap-1.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href={p.href}
              target={p.href.startsWith("http") ? "_blank" : undefined}
              rel={p.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`mt-5 rounded-xl px-4 py-3 text-center text-sm font-bold transition ${
                p.highlight
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "border border-[var(--border)] hover:bg-[var(--bg)]"
              }`}
            >
              {p.cta}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-5">
        <h2 className="text-xl font-extrabold">🏫 Sou escola ou cursinho (20+ alunos)</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Pacotes B2B com gestão de turma, ranking de XP, relatórios mensais e desconto por volume. Falar direto com a gente:
        </p>
        <a
          href="https://wa.me/5561991770953?text=Oi!%20Sou%20de%20uma%20escola/cursinho%20e%20quero%20saber%20mais%20sobre%20o%20FisiFun%20pra%2020%2B%20alunos."
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
        >
          Falar pelo WhatsApp
        </a>
      </div>

      <div className="mt-8 text-center text-sm text-[var(--muted)]">
        <Link href="/login" className="text-indigo-500 hover:underline">
          Já tem conta? Faça login
        </Link>
        {" · "}
        <Link href="/termos" className="hover:underline">
          Termos de uso
        </Link>
        {" · "}
        <Link href="/privacidade" className="hover:underline">
          Privacidade
        </Link>
      </div>
    </main>
  );
}
