"use client";

import { useGame, xpForLevel } from "@/lib/store";
import { Flame, Heart, Sparkles, Coins } from "lucide-react";
import { ProgressBar } from "../ui/Progress";
import {  } from "react";
import { useHydrated } from "@/lib/useHydrated";

export function GameBar() {
  const mounted = useHydrated();

  const xp = useGame((s) => s.xp);
  const level = useGame((s) => s.level);
  const streak = useGame((s) => s.streak);
  const hearts = useGame((s) => s.hearts);
  const maxHearts = useGame((s) => s.maxHearts);
  const coins = useGame((s) => s.coins);

  const { total, nextNeed } = xpForLevel(level);
  const inLevel = xp - total;

  if (!mounted) {
    return <div className="h-16" />;
  }

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-orange-600 dark:text-orange-300">
        <Flame size={16} />
        <span className="text-sm font-bold">{streak}</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-rose-600 dark:text-rose-300">
        <Heart size={16} />
        <span className="text-sm font-bold">
          {hearts}/{maxHearts}
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-amber-600 dark:text-amber-300">
        <Coins size={16} />
        <span className="text-sm font-bold">{coins}</span>
      </div>
      <div className="hidden md:block flex-1 min-w-0 max-w-sm">
        <div className="mb-1 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-300">
            <Sparkles size={14} /> Nível {level}
          </span>
          <span className="text-[var(--muted)]">
            {inLevel} / {nextNeed} XP
          </span>
        </div>
        <ProgressBar value={inLevel} max={nextNeed} />
      </div>
    </div>
  );
}
