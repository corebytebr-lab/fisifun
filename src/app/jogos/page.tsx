"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";

const GAMES: { href: string; title: string; sub: string; emoji: string; color: string; tag?: string }[] = [
  { href: "/jogos/match-formulas", title: "Match de fórmulas", sub: "Arraste fórmula no conceito", emoji: "🧩", color: "from-emerald-500 to-teal-500" },
  { href: "/jogos/unidade-correta", title: "Unidade correta", sub: "Grandeza → unidade SI", emoji: "📐", color: "from-sky-500 to-indigo-500" },
  { href: "/jogos/ordem-passos", title: "Ordem dos passos", sub: "Monte a resolução passo-a-passo", emoji: "🪜", color: "from-amber-500 to-orange-500" },
  { href: "/jogos/caca-erro-sinal", title: "Caça ao erro", sub: "Ache a linha com sinal errado", emoji: "🕵️", color: "from-rose-500 to-pink-500" },
  { href: "/jogos/vetor-alvo", title: "Vetor-alvo", sub: "Ajuste ângulo e módulo", emoji: "🎯", color: "from-violet-500 to-indigo-500" },
  { href: "/jogos/queda-livre", title: "Queda livre", sub: "Clique no tempo certo", emoji: "🪂", color: "from-sky-500 to-cyan-500" },
  { href: "/jogos/grafico-memoria", title: "Gráfico memória", sub: "Reconstrua o v×t", emoji: "📈", color: "from-teal-500 to-emerald-500" },
  { href: "/jogos/duelo-relampago", title: "Duelo relâmpago", sub: "10 perguntas em 60s", emoji: "⚡", color: "from-yellow-500 to-amber-500" },
  { href: "/jogos/boss-capitulo", title: "Boss de capítulo", sub: "Chefão com HP", emoji: "👾", color: "from-fuchsia-500 to-purple-600" },
  { href: "/jogos/colisao-elastica", title: "Colisão elástica", sub: "Preveja v finais", emoji: "🎱", color: "from-indigo-500 to-violet-500" },
  { href: "/jogos/monte-resolucao", title: "Monte a resolução", sub: "Encaixe Dados·Fórmula·Subst·Result", emoji: "🧱", color: "from-rose-500 to-orange-500" },
  // Novos desafiadores:
  { href: "/jogos/analise-dimensional", title: "Análise dimensional", sub: "3 equações, só 1 com dim. correta · 15s", emoji: "🔬", color: "from-cyan-500 to-blue-600", tag: "Novo · difícil" },
  { href: "/jogos/corrida-conversao", title: "Corrida de conversão", sub: "60s convertendo pra SI · combos multiplicam", emoji: "🏁", color: "from-orange-500 to-red-500", tag: "Novo · desafio" },
  { href: "/jogos/diagrama-forcas", title: "Diagrama de corpo livre", sub: "Marque as forças certas (e só as certas)", emoji: "🧲", color: "from-lime-500 to-emerald-600", tag: "Novo · difícil" },
  { href: "/jogos/escape-room", title: "Escape Room Físico", sub: "3 salas encadeadas — resolva pra sair", emoji: "🗝️", color: "from-fuchsia-500 to-rose-600", tag: "Novo · chefão" },
];

export default function JogosHub() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--fg)]"
        >
          <ChevronLeft size={16} /> Início
        </Link>
      </div>
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">🎮 Minijogos</h1>
        <p className="text-sm text-[var(--muted)]">
          Treine física de um jeito diferente. Cada jogo te dá XP e trabalha um conceito.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((g) => (
          <Link key={g.href} href={g.href}>
            <Card className={`card-hover relative cursor-pointer bg-gradient-to-br ${g.color} text-white`}>
              {g.tag && (
                <div className="absolute right-2 top-2 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                  {g.tag}
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl">
                  {g.emoji}
                </div>
                <div>
                  <div className="text-lg font-extrabold">{g.title}</div>
                  <div className="text-xs opacity-90">{g.sub}</div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
