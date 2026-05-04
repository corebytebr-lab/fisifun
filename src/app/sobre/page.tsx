import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Sobre — Estude Física, Química, Cálculo e GA gamificado",
  description:
    "FisiFun é o app brasileiro de estudos gamificado pra Física, Química, Cálculo 1 e Geometria Analítica. Trilhas, XP, IA tutora, exercícios resolvidos e revisão espaçada. Ideal pra Enem, vestibular e engenharia.",
  alternates: { canonical: "/sobre" },
};

const ABOUT_FAQ = [
  {
    q: "O FisiFun é um app brasileiro?",
    a: "Sim. FisiFun é desenvolvido no Brasil pela CoreByte Tecnologia, com conteúdo todo em português, pensado pro currículo brasileiro: Enem, Fuvest, Unicamp, ITA/IME, vestibulares de medicina e cursos de engenharia. Pagamento em real via Kiwify.",
  },
  {
    q: "Por que estudar Física, Química e Cálculo no FisiFun em vez de só ler o livro?",
    a: "O livro ensina, mas não te força a praticar. O FisiFun usa gamificação (XP, sequência diária, conquistas) pra você criar o hábito de estudar todo dia. Cada exercício tem feedback imediato e a IA explica seus erros. Resultado: você fixa muito mais conteúdo no mesmo tempo.",
  },
  {
    q: "Quanto tempo leva pra estudar uma matéria completa?",
    a: "Cada matéria (Física, Química, Cálculo, GA) tem entre 10 e 24 capítulos. Estudando 30min/dia, você cobre uma matéria em 2-3 meses. Em 6 meses dá pra cobrir as 4. Mas o ritmo é seu — sem prazo nem cobrança.",
  },
  {
    q: "Funciona offline?",
    a: "Parcialmente. As trilhas, exercícios e fórmulas que você já abriu ficam disponíveis offline (PWA com cache). A IA tutora e o salvamento de progresso precisam de internet pra sincronizar.",
  },
];

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={buildFaqSchema(ABOUT_FAQ)} />

      <h1 className="text-3xl font-extrabold md:text-4xl">Sobre o FisiFun</h1>
      <p className="mt-4 text-base text-[var(--muted)]">
        FisiFun é um aplicativo brasileiro de estudos gamificado pra estudantes de Física, Química,
        Cálculo 1 e Geometria Analítica. Foi pensado pra quem prepara Enem, Fuvest, Unicamp, ITA/IME,
        vestibulares de medicina ou cursa engenharia, física, química ou matemática na faculdade.
      </p>
      <p className="mt-3 text-base text-[var(--muted)]">
        A ideia é simples: estudar exatas é difícil, mas pode ser viciante quando vira jogo.
        Cada exercício resolvido vira XP, cada dia estudado mantém sua sequência, cada capítulo
        terminado desbloqueia conquistas. O cérebro entende que estudar dá recompensa — e estudar
        deixa de ser obrigação pra ser hábito.
      </p>

      <h2 className="mt-8 text-2xl font-extrabold">Como o FisiFun funciona</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm md:text-base">
        <li>
          <strong>Trilhas:</strong> mais de 60 capítulos baseados em livros consagrados — Halliday
          (Física), Brown (Química), Stewart (Cálculo), Winterle (Geometria Analítica).
          Você segue capítulo por capítulo, com exercícios crescentes em dificuldade.
        </li>
        <li>
          <strong>XP, níveis e conquistas:</strong> ganhe XP a cada exercício correto, suba níveis a cada
          1.000 XP, desbloqueie conquistas tipo &quot;Primeiro capítulo&quot;, &quot;7 dias seguidos&quot;,
          &quot;100 exercícios resolvidos&quot;.
        </li>
        <li>
          <strong>IA tutora com Gemini:</strong> tire dúvidas mandando foto do exercício ou descrevendo. A IA
          explica passo a passo, mostrando fórmula, substituição de valores e a resposta final.
        </li>
        <li>
          <strong>Revisão espaçada (SRS):</strong> o app sabe o que você precisa revisar e quando, baseado no
          algoritmo SM-2 (mesmo do Anki). Conteúdo que você acerta volta menos; o que você erra volta mais
          rápido.
        </li>
        <li>
          <strong>Vídeo-aulas integradas:</strong> capítulos com vídeo direto na trilha, sem precisar abrir
          YouTube — explicação curada do conteúdo, em português.
        </li>
        <li>
          <strong>Exercícios resolvidos:</strong> mais de 1.000 questões com gabarito comentado, organizadas
          por capítulo e nível.
        </li>
        <li>
          <strong>Fórmulas e flashcards:</strong> caderno de fórmulas pesquisável e flashcards prontos pra
          revisão antes da prova.
        </li>
        <li>
          <strong>Cronômetro Pomodoro e calculadora científica:</strong> tudo dentro do app, sem precisar de
          ferramenta externa.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-extrabold">Pra quem é o FisiFun</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm md:text-base">
        <li>Estudantes de cursinho preparando Enem ou vestibular (Fuvest, Unicamp, UFRJ, UFMG, etc.)</li>
        <li>Universitários de engenharia, física, química ou matemática</li>
        <li>Alunos de cursinhos online e presenciais querendo material complementar</li>
        <li>Pais e filhos estudando juntos pelo plano Família (até 4 contas)</li>
        <li>Escolas e cursinhos com 20+ alunos (plano B2B com painel de gestão)</li>
        <li>Professores particulares que querem dar tarefa estruturada pros alunos</li>
      </ul>

      <h2 className="mt-8 text-2xl font-extrabold">Matérias disponíveis</h2>
      <div className="mt-3 space-y-3 text-sm md:text-base">
        <div>
          <h3 className="font-bold">Física 1 (Halliday)</h3>
          <p className="text-[var(--muted)]">
            Cinemática, dinâmica, energia, momento linear, rotação, gravitação, fluidos, oscilações,
            ondas, calor, termodinâmica.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Química Geral (Brown)</h3>
          <p className="text-[var(--muted)]">
            Estrutura atômica, ligações químicas, estequiometria, gases, soluções, termoquímica,
            equilíbrio químico, ácido-base, eletroquímica.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Cálculo 1 (Stewart)</h3>
          <p className="text-[var(--muted)]">
            Funções, limites, continuidade, derivadas, regras de derivação, aplicações de derivadas,
            integrais, técnicas de integração, aplicações de integrais.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Geometria Analítica (Winterle)</h3>
          <p className="text-[var(--muted)]">
            Vetores, retas, planos, distâncias, cônicas (parábola, elipse, hipérbole), superfícies
            quádricas.
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-extrabold">Quem fez</h2>
      <p className="mt-3 text-sm text-[var(--muted)] md:text-base">
        FisiFun é desenvolvido pela{" "}
        <a
          href="https://corebytecnologia.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:underline"
        >
          CoreByte Tecnologia
        </a>
        , empresa brasileira de tecnologia educacional. Foco em educação acessível e produtos digitais
        que entregam valor real pra estudantes brasileiros.
      </p>

      <h2 className="mt-8 text-2xl font-extrabold">Perguntas frequentes</h2>
      <div className="mt-3 space-y-3">
        {ABOUT_FAQ.map((f) => (
          <details
            key={f.q}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4"
          >
            <summary className="cursor-pointer font-bold">{f.q}</summary>
            <p className="mt-2 text-sm text-[var(--muted)]">{f.a}</p>
          </details>
        ))}
        <p className="text-center text-sm text-[var(--muted)]">
          <Link href="/duvidas-frequentes" className="text-indigo-500 hover:underline">
            Ver todas as perguntas frequentes →
          </Link>
        </p>
      </div>

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
      </div>
    </main>
  );
}
