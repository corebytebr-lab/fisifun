"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/lib/store";
import { Timer, Play, Pause, RotateCcw, X } from "lucide-react";
import { useHydrated } from "@/lib/useHydrated";

type Phase = "work" | "break";

export function PomodoroFab() {
  const mounted = useHydrated();
  const workMin = useGame((s) => s.pomodoroMinutes);
  const breakMin = useGame((s) => s.pomodoroBreak);
  const setPomodoro = useGame((s) => s.setPomodoro);

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("work");
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(workMin * 60);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          // troca de fase
          const next: Phase = phase === "work" ? "break" : "work";
          setPhase(next);
          // tocar um beep curto
          try {
            const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = next === "break" ? 880 : 440;
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
          } catch {}
          return (next === "work" ? workMin : breakMin) * 60;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, phase, workMin, breakMin]);

  useEffect(() => {
    // reset quando mudar config e não estiver rodando
    if (!running) setRemaining((phase === "work" ? workMin : breakMin) * 60);
  }, [workMin, breakMin, running, phase]);

  if (!mounted) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const pretty = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  function reset() {
    setRunning(false);
    setPhase("work");
    setRemaining(workMin * 60);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Pomodoro"
        className={`fixed bottom-20 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition md:bottom-6 ${
          running
            ? phase === "work"
              ? "bg-indigo-600 text-white"
              : "bg-emerald-600 text-white"
            : "bg-[var(--bg-elev)] text-[var(--fg)] border border-[var(--border)]"
        }`}
      >
        {running ? <span className="text-[10px] font-bold">{pretty}</span> : <Timer size={20} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 md:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Timer className="text-indigo-500" /> Pomodoro
              </h3>
              <button onClick={() => setOpen(false)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>
            <div className="mt-1 text-xs text-[var(--muted)]">
              {phase === "work" ? "Foco" : "Pausa"} — { phase === "work" ? `${workMin} min` : `${breakMin} min` }
            </div>

            <div className="my-4 text-center font-mono text-6xl font-extrabold tracking-wider">
              {pretty}
            </div>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => setRunning((r) => !r)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold ${running ? "bg-amber-500 text-white" : "bg-indigo-600 text-white"}`}
              >
                {running ? <><Pause size={16} /> Pausar</> : <><Play size={16} /> Iniciar</>}
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold"
              >
                <RotateCcw size={14} /> Resetar
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <label className="flex flex-col gap-1">
                Foco (min)
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={workMin}
                  onChange={(e) => setPomodoro(Math.max(1, parseInt(e.target.value || "25", 10)), breakMin)}
                  className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1"
                />
              </label>
              <label className="flex flex-col gap-1">
                Pausa (min)
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={breakMin}
                  onChange={(e) => setPomodoro(workMin, Math.max(1, parseInt(e.target.value || "5", 10)))}
                  className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
