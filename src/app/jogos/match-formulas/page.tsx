"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InlineMath } from "@/lib/format";
import { FORMULA_MATCHES, CHAPTER_LABEL } from "@/content/games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw, Check, X } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchFormulasGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const [round, setRound] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pairs = useMemo(() => shuffle(FORMULA_MATCHES).slice(0, 6), [round]);
  const concepts = useMemo(() => shuffle(pairs.map((p, i) => ({ i, label: p.concept }))), [pairs]);

  const [selectedFormulaIdx, setSelectedFormulaIdx] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({}); // formulaIdx -> conceptIdx (original i)
  const [wrongFlash, setWrongFlash] = useState<{ f: number; c: number } | null>(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const allMatched = Object.keys(matched).length === pairs.length;

  function onConceptClick(conceptI: number) {
    if (selectedFormulaIdx === null) return;
    if (pairs[selectedFormulaIdx].concept === concepts.find((c) => c.i === conceptI)?.label) {
      setMatched((m) => ({ ...m, [selectedFormulaIdx]: conceptI }));
      setScore((s) => s + 10);
      setSelectedFormulaIdx(null);
      if (Object.keys(matched).length + 1 === pairs.length && !finished) {
        setFinished(true);
        awardXp(15);
      }
    } else {
      setWrongFlash({ f: selectedFormulaIdx, c: conceptI });
      setScore((s) => Math.max(0, s - 2));
      setTimeout(() => setWrongFlash(null), 400);
      setSelectedFormulaIdx(null);
    }
  }

  function restart() {
    setMatched({});
    setSelectedFormulaIdx(null);
    setScore(0);
    setFinished(false);
    setRound((r) => r + 1);
  }

  if (!mounted) return null;

  return (
    <GameShell
      title="🧩 Match de fórmulas"
      subtitle="Clique em uma fórmula, depois no conceito que combina."
      score={score}
      rightSlot={
        <Button size="sm" variant="secondary" onClick={restart}>
          <RefreshCw size={14} /> Reiniciar
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-sm font-semibold text-[var(--muted)]">Fórmulas</div>
          <div className="flex flex-col gap-2">
            {pairs.map((p, i) => {
              const isMatched = matched[i] !== undefined;
              const isSelected = selectedFormulaIdx === i;
              return (
                <button
                  key={i}
                  disabled={isMatched}
                  onClick={() => setSelectedFormulaIdx(i)}
                  className={`card-hover rounded-xl border p-3 text-left ${
                    isMatched
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 opacity-80 dark:text-emerald-300"
                      : isSelected
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-[var(--border)] bg-[var(--bg-elev)]"
                  }`}
                >
                  <div className="text-xs text-[var(--muted)]">
                    {CHAPTER_LABEL[p.chapterId]}
                  </div>
                  <div className="mt-1">
                    <InlineMath expr={p.formulaLatex} />
                  </div>
                  {isMatched && (
                    <div className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                      <Check size={12} className="mr-1 inline" /> pareado
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-[var(--muted)]">Conceitos</div>
          <div className="flex flex-col gap-2">
            {concepts.map((c) => {
              const matchedBy = Object.entries(matched).find(([, v]) => v === c.i);
              const isMatched = !!matchedBy;
              const isWrong = wrongFlash?.c === c.i;
              return (
                <button
                  key={c.i}
                  disabled={isMatched || selectedFormulaIdx === null}
                  onClick={() => onConceptClick(c.i)}
                  className={`card-hover rounded-xl border p-3 text-left font-semibold ${
                    isMatched
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 opacity-80 dark:text-emerald-300"
                      : isWrong
                        ? "border-rose-500 bg-rose-500/10 text-rose-700"
                        : "border-[var(--border)] bg-[var(--bg-elev)]"
                  }`}
                >
                  {isMatched ? <Check size={14} className="mr-1 inline" /> : isWrong ? <X size={14} className="mr-1 inline" /> : null}
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {allMatched && (
        <Card className="bg-emerald-500/10 text-center">
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
            Zerou! +15 XP
          </div>
          <Button className="mt-3" onClick={restart}>
            <RefreshCw size={14} /> Jogar de novo
          </Button>
        </Card>
      )}
    </GameShell>
  );
}
