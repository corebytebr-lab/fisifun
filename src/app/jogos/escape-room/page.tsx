"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ESCAPE_ROOMS } from "@/content/new-games";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { Lock, Unlock, RefreshCw, Lightbulb, Heart } from "lucide-react";

export default function EscapeRoomGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const loseHeart = useGame((s) => s.loseHeart);
  const infinite = useGame((s) => s.infiniteHearts);
  const [roomIdx, setRoomIdx] = useState(0);
  const [stage, setStage] = useState(0); // 0..2 (sala atual) or 3 (acabou)
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scenario = ESCAPE_ROOMS[roomIdx];
  const room = scenario?.rooms[stage];

  if (!mounted) return null;

  function submit() {
    if (!room) return;
    const raw = guess.trim().replace(",", ".");
    const num = Number(raw);
    if (!Number.isFinite(num)) {
      setError("Digite um número válido.");
      return;
    }
    const tol = Math.max(Math.abs(room.answer) * (room.tolerance / 100), 0.1);
    if (Math.abs(num - room.answer) <= tol) {
      setError(null);
      const nextStage = stage + 1;
      setStage(nextStage);
      setGuess("");
      setShowHint(false);
      if (nextStage >= scenario.rooms.length) {
        awardXp(80); // completou uma sala
      }
    } else {
      setAttempts((a) => a + 1);
      setError(`Código errado. Tente de novo.`);
      if (!infinite && attempts >= 1) loseHeart();
    }
  }

  function nextRoom() {
    setRoomIdx((i) => (i + 1) % ESCAPE_ROOMS.length);
    setStage(0);
    setGuess("");
    setAttempts(0);
    setShowHint(false);
    setError(null);
  }

  function restart() {
    setStage(0);
    setGuess("");
    setAttempts(0);
    setShowHint(false);
    setError(null);
  }

  const done = stage >= scenario.rooms.length;

  return (
    <GameShell title="🔓 Escape Room Físico" subtitle={scenario.title}>
      <Card className="bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10">
        <div className="text-sm italic">{scenario.intro}</div>
      </Card>

      <div className="flex gap-2">
        {scenario.rooms.map((r, i) => (
          <div
            key={i}
            className={`flex h-10 flex-1 items-center justify-center rounded-xl border font-bold ${
              i < stage
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                : i === stage
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-700"
                  : "border-[var(--border)] bg-[var(--bg-elev)] text-[var(--muted)]"
            }`}
          >
            {i < stage ? <Unlock size={16} /> : <Lock size={16} />}
            <span className="ml-2 text-xs">Sala {i + 1}</span>
          </div>
        ))}
      </div>

      {!done && room && (
        <>
          <Card>
            <div className="font-bold">{room.title}</div>
            <p className="mt-2 text-sm">{room.puzzle}</p>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                inputMode="decimal"
                placeholder="Código..."
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 font-mono text-lg focus:border-indigo-500 focus:outline-none"
              />
              <span className="text-sm font-bold text-[var(--muted)]">{room.unit}</span>
              <Button onClick={submit}>Destravar</Button>
            </div>

            {error && (
              <div className="mt-2 flex items-center gap-2 text-xs text-rose-600">
                {error}
                {attempts >= 1 && !infinite && (
                  <span className="flex items-center gap-1">
                    <Heart size={12} className="fill-rose-500 text-rose-500" /> −1 vida
                  </span>
                )}
              </div>
            )}

            {room.hint && (
              <button
                className="mt-2 flex items-center gap-1 text-xs text-amber-500 hover:underline"
                onClick={() => setShowHint((s) => !s)}
              >
                <Lightbulb size={12} /> {showHint ? "Esconder dica" : "Mostrar dica"}
              </button>
            )}
            {showHint && room.hint && (
              <div className="mt-1 rounded-lg bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-300">
                💡 {room.hint}
              </div>
            )}
          </Card>

          {stage > 0 && (
            <Card className="bg-emerald-500/10 text-xs">
              ✓ {scenario.rooms[stage - 1].explain}
            </Card>
          )}
        </>
      )}

      {done && (
        <Card className="bg-emerald-500/10 text-center">
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
            🎉 Saiu! Escape {scenario.title} concluído com {attempts} erro(s).
          </div>
          <div className="mt-1 text-xs">{scenario.rooms[scenario.rooms.length - 1].explain}</div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Button onClick={nextRoom}>Próximo cenário →</Button>
            <Button variant="ghost" onClick={restart}>
              <RefreshCw size={14} /> Mesmo cenário
            </Button>
          </div>
        </Card>
      )}
    </GameShell>
  );
}
