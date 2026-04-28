"use client";

import Link from "next/link";
import { ChevronLeft, Trophy } from "lucide-react";

export function GameShell({
  title,
  subtitle,
  score,
  streak,
  children,
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  score?: number;
  streak?: number;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/jogos"
          className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--fg)]"
        >
          <ChevronLeft size={16} /> Jogos
        </Link>
      </div>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
          {subtitle && <p className="text-sm text-[var(--muted)]">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {typeof score === "number" && (
            <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 font-semibold text-amber-600">
              <Trophy size={14} /> {score}
            </div>
          )}
          {typeof streak === "number" && streak > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-rose-500/10 px-3 py-1 font-semibold text-rose-600">
              🔥 {streak}
            </div>
          )}
          {rightSlot}
        </div>
      </header>
      {children}
    </div>
  );
}
