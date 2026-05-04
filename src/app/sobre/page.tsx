import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre — Estude Física, Química, Cálculo e GA gamificado",
  description:
    "FisiFun é o app de estudos gamificado pra Física, Química, Cálculo 1 e Geometria Analítica. Trilhas, XP, IA tutora, exercícios resolvidos e revisão espaçada. Ideal pra Enem, vestibular e engenharia.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold md:text-4xl">Sobre o FisiFun</h1>
      <p className="mt-4 text-base text-[var(--muted)]">
        FisiFun é um app de estudos gamificado pra estudantes de Física, Química, Cálculo 1 e Geometria Analítica.
        A ideia é simples: estudar exatas é difícil, mas pode ser viciante.
      </p>

      <h2 className="mt-8 text-2xl font-extrabold">Como funciona</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm md:text-base">
        <li>
          <strong>Trilhas:</strong> 60+ capítulos baseados em livros consagrados (Halliday, Brown, Stewart, Winterle).
        </li>
        <li>
          <strong>XP e conquistas:</strong> ganhe XP a cada exercício resolvido, suba níveis, desbloqueie conquistas.
        </li>
        <li>
          <strong>IA tutora:</strong> tire dúvidas com fotos e explicações passo a passo.
        </li>
        <li>
          <strong>Revisão espaçada:</strong> o app sabe o que você precisa revisar e quando, baseado em ciência.
        </li>
        <li>
          <strong>Vídeo-aulas:</strong> conteúdo em vídeo direto na plataforma, integrado às trilhas.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-extrabold">Pra quem é</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm md:text-base">
        <li>Estudantes de cursinho preparando Enem ou vestibular</li>
        <li>Universitários de engenharia, física, química, matemática</li>
        <li>Alunos de cursinhos online e presenciais</li>
        <li>Pais e filhos estudando juntos (plano Família)</li>
        <li>Escolas e cursinhos (plano B2B sob medida)</li>
      </ul>

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
        . Foco em educação acessível e produtos digitais que entregam valor real.
      </p>

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
