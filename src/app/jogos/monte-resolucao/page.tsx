"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FRAGMENT_PROBLEMS, CHAPTER_LABEL, type FragmentProblem } from "@/content/games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { Heart, RefreshCw, X } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MonteResolucaoGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const loseHeart = useGame((s) => s.loseHeart);
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deck = useMemo(() => shuffle(FRAGMENT_PROBLEMS), [round]);
  const [idx, setIdx] = useState(0);
  const problem: FragmentProblem = deck[idx];
  const [slotFills, setSlotFills] = useState<(string | null)[]>([null, null, null, null]);
  const [fragments, setFragments] = useState<{ id: string; text: string }[]>(() => shuffle(problem.fragments));
  const [errors, setErrors] = useState(0);
  const [lives, setLives] = useState(3);
  const [done, setDone] = useState<"ok" | "fail" | null>(null);
  const [score, setScore] = useState(0);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  if (!mounted) return null;

  function resetProblem(newIdx: number) {
    const p = deck[newIdx];
    setIdx(newIdx);
    setSlotFills([null, null, null, null]);
    setFragments(shuffle(p.fragments));
    setDone(null);
  }

  function placeInNextSlot(fragId: string) {
    if (done) return;
    // next empty slot
    const slotIdx = slotFills.findIndex((s) => s === null);
    if (slotIdx < 0) return;
    tryPlace(fragId, slotIdx);
  }

  function tryPlace(fragId: string, slotIdx: number) {
    const expected = problem.slots[slotIdx].correctId;
    if (fragId === expected) {
      const newFills = [...slotFills];
      newFills[slotIdx] = fragId;
      setSlotFills(newFills);
      setFragments((fs) => fs.filter((f) => f.id !== fragId));
      setScore((s) => s + 10);
      if (newFills.every((x) => x !== null)) {
        // success
        setDone("ok");
        const bonus = errors === 0 ? 30 : errors === 1 ? 15 : 5;
        awardXp(20 + bonus);
        setScore((s) => s + bonus);
      }
    } else {
      setErrors((e) => e + 1);
      setLives((l) => l - 1);
      loseHeart();
      setWrongFlash(fragId);
      setTimeout(() => setWrongFlash(null), 500);
      setScore((s) => Math.max(0, s - 5));
      if (lives - 1 <= 0) {
        setDone("fail");
      }
    }
  }

  function unSlot(slotIdx: number) {
    if (done) return;
    const fragId = slotFills[slotIdx];
    if (!fragId) return;
    const frag = problem.fragments.find((f) => f.id === fragId);
    if (!frag) return;
    const newFills = [...slotFills];
    newFills[slotIdx] = null;
    setSlotFills(newFills);
    setFragments((fs) => [...fs, frag]);
  }

  function nextProblem() {
    if (idx + 1 >= deck.length) {
      setRound((r) => r + 1);
      setIdx(0);
      resetProblem(0);
    } else {
      resetProblem(idx + 1);
    }
    setErrors(0);
    setLives(3);
  }

  function fullRestart() {
    setRound((r) => r + 1);
    setIdx(0);
    setSlotFills([null, null, null, null]);
    setErrors(0);
    setLives(3);
    setScore(0);
    setDone(null);
  }

  return (
    <GameShell
      title="🧱 Monte a resolução"
      subtitle="Encaixe os fragmentos certos em Dados → Fórmula → Substituição → Resultado. Cuidado com as pegadinhas!"
      score={score}
    >
      <Card>
        <div className="text-xs text-[var(--muted)]">{CHAPTER_LABEL[problem.chapterId]}</div>
        <div className="mt-1 font-bold">{problem.prompt}</div>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="font-semibold">Vidas:</span>
          {[0, 1, 2].map((i) => (
            <Heart key={i} size={18} className={i < lives ? "fill-rose-500 text-rose-500" : "text-[var(--muted)]"} />
          ))}
          <span className="ml-3 text-[var(--muted)]">Erros: {errors}</span>
        </div>
      </Card>

      <div className="grid gap-2 md:grid-cols-4">
        {problem.slots.map((slot, i) => {
          const filledId = slotFills[i];
          const filled = filledId ? problem.fragments.find((f) => f.id === filledId) : null;
          return (
            <Card
              key={i}
              className={`min-h-24 ${
                filled ? "border-2 border-emerald-500 bg-emerald-500/10" : "border-2 border-dashed"
              }`}
            >
              <div className="text-xs font-bold uppercase text-[var(--muted)]">
                {i + 1}. {slot.label}
              </div>
              <div className="mt-2 min-h-10 font-mono text-sm">
                {filled ? (
                  <div className="flex items-start gap-2">
                    <span className="flex-1">{filled.text}</span>
                    {!done && (
                      <button onClick={() => unSlot(i)} className="text-[var(--muted)] hover:text-rose-500">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-[var(--muted)]">(vazio)</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {!done && (
        <Card>
          <div className="mb-2 text-sm font-semibold">Fragmentos disponíveis (clique para encaixar no próximo slot):</div>
          <div className="flex flex-wrap gap-2">
            {fragments.map((f) => (
              <button
                key={f.id}
                onClick={() => placeInNextSlot(f.id)}
                className={`rounded-xl border px-3 py-2 font-mono text-sm ${
                  wrongFlash === f.id
                    ? "border-rose-500 bg-rose-500/20 anim-shake"
                    : "border-[var(--border)] bg-[var(--bg-elev)] hover:border-indigo-500"
                }`}
              >
                {f.text}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-[var(--muted)]">
            Dica: você está preenchendo o slot <b>{problem.slots[slotFills.findIndex((s) => s === null)]?.label ?? "—"}</b>. Errar tira 1 vida.
          </div>
        </Card>
      )}

      {done === "ok" && (
        <Card className="bg-emerald-500/10">
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
            Montou! {errors === 0 ? "+ bônus 100% (30 XP)" : errors === 1 ? "+ bônus parcial" : "sem bônus"}
          </div>
          <div className="mt-1 text-sm">{problem.explanation}</div>
          <div className="mt-3 flex gap-2">
            <Button onClick={nextProblem}>Próxima questão</Button>
            <Button variant="secondary" onClick={fullRestart}>
              <RefreshCw size={14} /> Recomeçar
            </Button>
          </div>
        </Card>
      )}

      {done === "fail" && (
        <Card className="bg-rose-500/10">
          <div className="text-lg font-extrabold text-rose-700 dark:text-rose-300">
            Suas vidas acabaram.
          </div>
          <div className="mt-1 text-sm">
            Solução correta (em ordem):
            <ol className="mt-1 list-decimal pl-5 font-mono text-sm">
              {problem.slots.map((s, i) => {
                const t = problem.fragments.find((f) => f.id === s.correctId)?.text;
                return <li key={i}><b>{s.label}:</b> {t}</li>;
              })}
            </ol>
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={fullRestart}>
              <RefreshCw size={14} /> Recomeçar
            </Button>
            <Button variant="secondary" onClick={nextProblem}>
              Pular
            </Button>
          </div>
        </Card>
      )}
    </GameShell>
  );
}
