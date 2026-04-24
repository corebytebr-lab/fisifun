"use client";

import {  } from "react";
import { achievements } from "@/lib/achievements";
import { useGame } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { useHydrated } from "@/lib/useHydrated";

export default function ConquistasPage() {
  const mounted = useHydrated();
  const state = useGame();
  if (!mounted) return null;

  const unlocked = achievements.filter((a) => state.achievementsUnlocked[a.id]);
  const locked = achievements.filter((a) => !state.achievementsUnlocked[a.id]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">🏆 Conquistas</h1>
        <p className="text-sm text-[var(--muted)]">
          {unlocked.length}/{achievements.length} desbloqueadas
        </p>
      </header>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase text-[var(--muted)]">Desbloqueadas</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {unlocked.map((a) => (
            <Card key={a.id} className="flex items-center gap-3">
              <div className="text-3xl">{a.emoji}</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{a.title}</div>
                <div className="truncate text-xs text-[var(--muted)]">{a.description}</div>
              </div>
            </Card>
          ))}
          {unlocked.length === 0 && (
            <div className="col-span-full text-sm text-[var(--muted)]">Complete lições para desbloquear suas primeiras conquistas.</div>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-2 mt-4 text-sm font-bold uppercase text-[var(--muted)]">Bloqueadas</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {locked.map((a) => (
            <Card key={a.id} className="flex items-center gap-3 opacity-60">
              <div className="text-3xl grayscale">{a.emoji}</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{a.title}</div>
                <div className="truncate text-xs text-[var(--muted)]">{a.description}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
