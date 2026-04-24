"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BOSSES, CHAPTER_LABEL } from "@/content/games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { Heart, RefreshCw, Swords } from "lucide-react";

export default function BossGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const loseHeart = useGame((s) => s.loseHeart);
  const [bossIdx, setBossIdx] = useState(0);
  const boss = BOSSES[bossIdx];
  const [hp, setHp] = useState(boss.hp);
  const [playerLives, setPlayerLives] = useState(3);
  const [qIdx, setQIdx] = useState(0);
  const [finished, setFinished] = useState<"won" | "lost" | null>(null);
  const [lastHit, setLastHit] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const totalHp = useMemo(() => boss.hp, [boss]);

  if (!mounted) return null;

  function reset(newIdx = bossIdx) {
    const b = BOSSES[newIdx];
    setBossIdx(newIdx);
    setHp(b.hp);
    setPlayerLives(3);
    setQIdx(0);
    setFinished(null);
    setLastHit(null);
    setScore(0);
  }

  function pick(i: number) {
    if (finished) return;
    const q = boss.questions[qIdx];
    let newHp = hp;
    let newLives = playerLives;
    if (i === q.correct) {
      newHp = Math.max(0, hp - q.damage);
      setScore((s) => s + 10);
      setLastHit(q.damage);
    } else {
      newLives = playerLives - 1;
      loseHeart();
      setScore((s) => Math.max(0, s - 2));
      setLastHit(0);
    }
    setHp(newHp);
    setPlayerLives(newLives);
    if (newHp <= 0) {
      setFinished("won");
      awardXp(40);
    } else if (newLives <= 0) {
      setFinished("lost");
    } else {
      const nextQ = (qIdx + 1) % boss.questions.length;
      setTimeout(() => {
        setQIdx(nextQ);
        setLastHit(null);
      }, 700);
    }
  }

  const q = boss.questions[qIdx];

  return (
    <GameShell
      title="👾 Boss de capítulo"
      subtitle={CHAPTER_LABEL[boss.chapterId]}
      score={score}
      rightSlot={
        <select
          className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1 text-sm"
          value={bossIdx}
          onChange={(e) => reset(parseInt(e.target.value, 10))}
        >
          {BOSSES.map((b, i) => (
            <option key={b.chapterId} value={i}>
              {CHAPTER_LABEL[b.chapterId]}
            </option>
          ))}
        </select>
      }
    >
      <Card className="bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{boss.emoji}</div>
          <div className="flex-1">
            <div className="text-xs uppercase opacity-80">Chefão</div>
            <div className="text-2xl font-extrabold">{boss.name}</div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-black/30">
              <div
                className="h-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${(hp / totalHp) * 100}%` }}
              />
            </div>
            <div className="mt-1 text-xs">{hp} / {totalHp} HP</div>
          </div>
          {lastHit !== null && lastHit > 0 && (
            <div className="animate-bounce text-2xl font-extrabold text-rose-200">−{lastHit}</div>
          )}
          {lastHit === 0 && (
            <div className="text-2xl">😈</div>
          )}
        </div>
      </Card>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">Suas vidas:</span>
        {[0, 1, 2].map((i) => (
          <Heart key={i} size={18} className={i < playerLives ? "fill-rose-500 text-rose-500" : "text-[var(--muted)]"} />
        ))}
      </div>

      {finished === "won" && (
        <Card className="bg-emerald-500/10 text-center">
          <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
            Venceu o {boss.name}! +40 XP
          </div>
          <div className="mt-2 flex justify-center gap-2">
            <Button onClick={() => reset((bossIdx + 1) % BOSSES.length)}>
              <Swords size={14} /> Próximo chefão
            </Button>
            <Button variant="secondary" onClick={() => reset(bossIdx)}>
              <RefreshCw size={14} /> Revanche
            </Button>
          </div>
        </Card>
      )}

      {finished === "lost" && (
        <Card className="bg-rose-500/10 text-center">
          <div className="text-xl font-extrabold text-rose-700 dark:text-rose-300">
            Vidas esgotadas — {boss.name} venceu.
          </div>
          <Button className="mt-3" onClick={() => reset(bossIdx)}>
            <RefreshCw size={14} /> Tentar de novo
          </Button>
        </Card>
      )}

      {!finished && (
        <>
          <Card>
            <div className="text-lg font-bold">{q.prompt}</div>
          </Card>
          <div className="grid gap-2 md:grid-cols-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                className="card-hover rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 text-left text-lg font-semibold"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </GameShell>
  );
}
