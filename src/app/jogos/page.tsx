"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useGame } from "@/lib/store";
import { SUBJECTS, type Subject } from "@/lib/types";

type Game = { href: string; title: string; sub: string; emoji: string; color: string; tag?: string; subjects: Subject[] };

const GAMES: Game[] = [
  // genéricos (servem pra qualquer matéria)
  { href: "/jogos/match-formulas", title: "Match de fórmulas", sub: "Arraste fórmula no conceito", emoji: "🧩", color: "from-emerald-500 to-teal-500", subjects: ["fisica", "quimica", "ga", "calculo"] },
  { href: "/jogos/unidade-correta", title: "Unidade correta", sub: "Grandeza → unidade SI", emoji: "📐", color: "from-sky-500 to-indigo-500", subjects: ["fisica", "quimica"] },
  { href: "/jogos/ordem-passos", title: "Ordem dos passos", sub: "Monte a resolução passo-a-passo", emoji: "🪜", color: "from-amber-500 to-orange-500", subjects: ["fisica", "quimica", "ga", "calculo"] },
  { href: "/jogos/caca-erro-sinal", title: "Caça ao erro", sub: "Ache a linha com sinal errado", emoji: "🕵️", color: "from-rose-500 to-pink-500", subjects: ["fisica", "quimica", "ga", "calculo"] },
  { href: "/jogos/duelo-relampago", title: "Duelo relâmpago", sub: "10 perguntas em 60s", emoji: "⚡", color: "from-yellow-500 to-amber-500", subjects: ["fisica", "quimica", "ga", "calculo"] },
  { href: "/jogos/boss-capitulo", title: "Boss de capítulo", sub: "Chefão com HP", emoji: "👾", color: "from-fuchsia-500 to-purple-600", subjects: ["fisica", "quimica", "ga", "calculo"] },
  { href: "/jogos/monte-resolucao", title: "Monte a resolução", sub: "Encaixe Dados·Fórmula·Subst·Result", emoji: "🧱", color: "from-rose-500 to-orange-500", subjects: ["fisica", "quimica", "ga", "calculo"] },
  // física-only
  { href: "/jogos/vetor-alvo", title: "Vetor-alvo", sub: "Ajuste ângulo e módulo", emoji: "🎯", color: "from-violet-500 to-indigo-500", subjects: ["fisica", "ga"] },
  { href: "/jogos/queda-livre", title: "Queda livre", sub: "Clique no tempo certo", emoji: "🪂", color: "from-sky-500 to-cyan-500", subjects: ["fisica"] },
  { href: "/jogos/grafico-memoria", title: "Gráfico memória", sub: "Reconstrua o v×t", emoji: "📈", color: "from-teal-500 to-emerald-500", subjects: ["fisica", "calculo"] },
  { href: "/jogos/colisao-elastica", title: "Colisão elástica", sub: "Preveja v finais", emoji: "🎱", color: "from-indigo-500 to-violet-500", subjects: ["fisica"] },
  { href: "/jogos/analise-dimensional", title: "Análise dimensional", sub: "3 equações, só 1 com dim. correta · 15s", emoji: "🔬", color: "from-cyan-500 to-blue-600", tag: "Difícil", subjects: ["fisica", "quimica"] },
  { href: "/jogos/corrida-conversao", title: "Corrida de conversão", sub: "60s convertendo pra SI · combos multiplicam", emoji: "🏁", color: "from-orange-500 to-red-500", tag: "Desafio", subjects: ["fisica", "quimica"] },
  { href: "/jogos/diagrama-forcas", title: "Diagrama de corpo livre", sub: "Marque as forças certas (e só as certas)", emoji: "🧲", color: "from-lime-500 to-emerald-600", tag: "Difícil", subjects: ["fisica"] },
  { href: "/jogos/escape-room", title: "Escape Room Físico", sub: "3 salas encadeadas — resolva pra sair", emoji: "🗝️", color: "from-fuchsia-500 to-rose-600", tag: "Chefão", subjects: ["fisica"] },
];

export default function JogosHub() {
  const currentSubject = useGame((s) => s.currentSubject);
  const subjectInfo = SUBJECTS.find((s) => s.id === currentSubject) ?? SUBJECTS[0];
  const filtered = GAMES.filter((g) => g.subjects.includes(currentSubject));

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/" className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--fg)]">
          <ChevronLeft size={16} /> Início
        </Link>
      </div>
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">🎮 Minijogos</h1>
        <p className="text-sm text-[var(--muted)]">Treine de um jeito diferente. Cada jogo te dá XP e trabalha um conceito.</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Matéria: <span className="font-bold text-[var(--fg)]">{subjectInfo.emoji} {subjectInfo.label}</span> · {filtered.length} jogo(s) disponíveis</p>
      </header>

      {filtered.length === 0 ? (
        <Card>
          <div className="text-base font-bold">Sem jogos para esta matéria ainda</div>
          <div className="mt-1 text-sm text-[var(--muted)]">Estamos preparando minijogos específicos para {subjectInfo.label}. Troque a matéria pela barra lateral.</div>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <Link key={g.href} href={g.href}>
              <Card className={`card-hover relative cursor-pointer bg-gradient-to-br ${g.color} text-white`}>
                {g.tag && (
                  <div className="absolute right-2 top-2 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    {g.tag}
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl">{g.emoji}</div>
                  <div>
                    <div className="text-lg font-extrabold">{g.title}</div>
                    <div className="text-xs opacity-90">{g.sub}</div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
