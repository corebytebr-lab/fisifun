"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, RotateCw, Layers } from "lucide-react";
import { useGame } from "@/lib/store";
import { allFormulas } from "@/content";
import { useHydrated } from "@/lib/useHydrated";
import { BlockMath } from "@/lib/format";

export default function FlashcardsPage() {
  const mounted = useHydrated();
  const state = useGame();
  const [flipped, setFlipped] = useState(false);
  const [idx, setIdx] = useState(0);

  const all = useMemo(() => allFormulas(), []);

  // fila: devido primeiro, depois nunca vistos, depois o resto
  const queue = useMemo(() => {
    const now = Date.now();
    const withMeta = all.map((x) => {
      const srs = state.formulaSrs[x.formula.id];
      return { ...x, srs, due: srs ? srs.dueDate <= now : true, unseen: !srs };
    });
    const due = withMeta.filter((x) => x.due && !x.unseen);
    const unseen = withMeta.filter((x) => x.unseen);
    const rest = withMeta.filter((x) => !x.due && !x.unseen);
    return [...due, ...unseen, ...rest];
  }, [all, state.formulaSrs]);

  if (!mounted) return null;

  const current = queue[idx % queue.length];

  function review(quality: 0 | 1 | 2) {
    if (!current) return;
    state.reviewFormulaSrs(current.formula.id, quality);
    setFlipped(false);
    setIdx((i) => i + 1);
  }

  const reviewedCount = Object.keys(state.formulaSrs).length;
  const dueCount = Object.values(state.formulaSrs).filter((x) => x.dueDate <= Date.now()).length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-4 md:px-0 md:pt-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Início
      </Link>
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
          <Layers className="text-emerald-500" /> Flashcards de fórmulas
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Memorize com repetição espaçada. Vire o card, tente lembrar, aí avalia se foi fácil ou difícil.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <Card className="!p-3">
          <div className="text-xs text-[var(--muted)]">Total</div>
          <div className="text-lg font-bold">{all.length}</div>
        </Card>
        <Card className="!p-3">
          <div className="text-xs text-[var(--muted)]">Revisadas</div>
          <div className="text-lg font-bold">{reviewedCount}</div>
        </Card>
        <Card className="!p-3">
          <div className="text-xs text-[var(--muted)]">Para hoje</div>
          <div className="text-lg font-bold text-amber-500">{dueCount}</div>
        </Card>
      </div>

      {!current ? (
        <Card>Nada pra revisar agora 🎉</Card>
      ) : (
        <Card className="flex min-h-[320px] flex-col items-center justify-between gap-4">
          <div className="flex w-full items-center justify-between text-xs text-[var(--muted)]">
            <span>Cap. {current.chapter.number} · {current.chapter.title}</span>
            {current.unseen && <span className="rounded-full bg-sky-500/15 px-2 py-0.5 font-semibold text-sky-600">nova</span>}
            {current.due && !current.unseen && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-600">revisar</span>}
          </div>

          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-lg font-bold">{current.formula.name}</div>
            {flipped && (
              <div className="mt-4 w-full">
                <div className="mx-auto my-2 max-w-full overflow-x-auto">
                  <BlockMath expr={current.formula.latex} />
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{current.formula.description}</p>
                {current.formula.variables.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {current.formula.variables.map((v, i) => (
                      <li key={i}>
                        <span className="font-mono font-bold">{v.symbol}</span> — {v.meaning} <span className="text-[var(--muted)]">({v.unit})</span>
                      </li>
                    ))}
                  </ul>
                )}
                {current.formula.whenToUse && (
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    <span className="font-semibold">Quando usar:</span> {current.formula.whenToUse}
                  </p>
                )}
              </div>
            )}
          </div>

          {!flipped ? (
            <Button onClick={() => setFlipped(true)} size="md">
              <RotateCw size={16} /> Ver fórmula
            </Button>
          ) : (
            <div className="flex w-full flex-wrap justify-center gap-2">
              <Button variant="danger" size="sm" onClick={() => review(0)}>
                Errei
              </Button>
              <Button variant="secondary" size="sm" onClick={() => review(1)}>
                Difícil
              </Button>
              <Button variant="success" size="sm" onClick={() => review(2)}>
                Fácil
              </Button>
            </div>
          )}
        </Card>
      )}

      <div className="flex justify-end text-xs text-[var(--muted)]">
        <button
          onClick={() => {
            setFlipped(false);
            setIdx((i) => i + 1);
          }}
          className="underline"
        >
          Pular
        </button>
      </div>
    </div>
  );
}
