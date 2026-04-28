"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Atom, Beaker, Compass, Sigma } from "lucide-react";
import { useGame } from "@/lib/store";
import { SUBJECTS } from "@/lib/types";
import type { Subject } from "@/lib/types";

const META: Record<Subject, { Icon: React.ComponentType<{ size?: number }>; gradient: string; bullets: string[]; chapters: number }> = {
  fisica: {
    Icon: Atom,
    gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
    chapters: 11,
    bullets: ["Halliday vol. 1", "248 problemas do livro", "15 minijogos"],
  },
  quimica: {
    Icon: Beaker,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    chapters: 24,
    bullets: ["Brown / LeMay", "Tabela periódica · 118 elementos", "Balanceador automático"],
  },
  ga: {
    Icon: Compass,
    gradient: "from-rose-500 via-pink-500 to-orange-500",
    chapters: 10,
    bullets: ["Winterle / Reis & Silva", "Calc. vetorial 2D/3D", "Plotter interativo"],
  },
  calculo: {
    Icon: Sigma,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    chapters: 12,
    bullets: ["Stewart vol. 1", "Plotter de função", "Limite, derivada e integral"],
  },
};

export default function EscolherPage() {
  const setSubject = useGame((s) => s.setCurrentSubject);
  const setChosen = useGame((s) => (s as unknown as { setHasChosenSubject?: (v: boolean) => void }).setHasChosenSubject);
  const current = useGame((s) => s.currentSubject);
  const router = useRouter();

  const choose = (id: Subject) => {
    setSubject(id);
    if (setChosen) setChosen(true);
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--bg)] via-[var(--bg-elev)] to-[var(--bg)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:py-14">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl shadow-lg">
            ⚛️
          </div>
          <h1 className="text-3xl font-extrabold md:text-4xl">Qual matéria você quer estudar agora?</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--muted)]">
            Você pode trocar a qualquer momento pela barra lateral. Cada matéria tem suas próprias trilhas, ferramentas, banco de problemas e Modo Professor.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {SUBJECTS.map((s) => {
            const meta = META[s.id];
            const Icon = meta.Icon;
            const active = current === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => choose(s.id)}
                className={`group relative overflow-hidden rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-xl ${active ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-[var(--border)] bg-[var(--bg-elev)]"}`}
              >
                <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${meta.gradient} opacity-20 blur-2xl transition group-hover:opacity-40`} />
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}>
                      <Icon size={26} />
                    </span>
                    <div>
                      <div className="text-xl font-extrabold">{s.label}</div>
                      <div className="text-xs text-[var(--muted)]">{s.description}</div>
                    </div>
                  </div>
                  <span className="text-3xl">{s.emoji}</span>
                </div>

                <ul className="relative mt-4 space-y-1 text-sm">
                  {meta.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[var(--muted)]">{meta.chapters} capítulos</span>
                  <span className="flex items-center gap-1 text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition">
                    Começar <ArrowRight size={14} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center text-xs text-[var(--muted)]">
          <Link href="/" className="underline">Pular para o app</Link> · você pode escolher depois
        </div>
      </div>
    </div>
  );
}
