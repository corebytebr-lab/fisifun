"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { RefreshCw } from "lucide-react";

interface Scenario {
  m1: number;
  m2: number;
  u1: number;
  u2: number;
}

function makeScenario(): Scenario {
  const m1 = [1, 2, 3, 5][Math.floor(Math.random() * 4)];
  const m2 = [1, 2, 3, 5][Math.floor(Math.random() * 4)];
  const u1 = [2, 4, 6, 8, 10][Math.floor(Math.random() * 5)];
  const u2 = [-6, -4, -2, 0, 2][Math.floor(Math.random() * 5)];
  return { m1, m2, u1, u2 };
}

// 1D elastic collision formulas
function solve({ m1, m2, u1, u2 }: Scenario) {
  const v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
  const v2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);
  return { v1, v2 };
}

export default function ColisaoElasticaGame() {
  const mounted = useHydrated();
  const awardXp = useGame((s) => s.awardXp);
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scenario = useMemo(() => makeScenario(), [round]);
  const expected = useMemo(() => solve(scenario), [scenario]);
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [result, setResult] = useState<{ ok1: boolean; ok2: boolean; pts: number } | null>(null);
  const [score, setScore] = useState(0);

  if (!mounted) return null;

  function check() {
    const a1 = parseFloat(v1.replace(",", "."));
    const a2 = parseFloat(v2.replace(",", "."));
    const tol = 0.3;
    const ok1 = Number.isFinite(a1) && Math.abs(a1 - expected.v1) < tol;
    const ok2 = Number.isFinite(a2) && Math.abs(a2 - expected.v2) < tol;
    let pts = 0;
    if (ok1) pts += 15;
    if (ok2) pts += 15;
    setResult({ ok1, ok2, pts });
    setScore((s) => s + pts);
    if (pts > 0) awardXp(Math.round(pts / 2));
  }

  function next() {
    setRound((r) => r + 1);
    setV1("");
    setV2("");
    setResult(null);
  }

  return (
    <GameShell
      title="🎱 Colisão elástica"
      subtitle="Conservação de momento + energia cinética. Preveja as velocidades finais."
      score={score}
      rightSlot={
        <Button size="sm" variant="secondary" onClick={next}>
          <RefreshCw size={14} /> Novo
        </Button>
      }
    >
      <Card>
        <div className="text-sm text-[var(--muted)]">Cenário (1D, colisão perfeitamente elástica):</div>
        <div className="mt-2 grid gap-2 font-mono text-lg md:grid-cols-2">
          <div>m₁ = {scenario.m1} kg · u₁ = {scenario.u1} m/s</div>
          <div>m₂ = {scenario.m2} kg · u₂ = {scenario.u2} m/s</div>
        </div>
        <div className="mt-2 text-xs text-[var(--muted)]">
          Convenção: + para a direita. u = inicial, v = final.
        </div>
      </Card>

      <div className="grid gap-2 md:grid-cols-2">
        <Card>
          <label className="block text-sm font-semibold">v₁ (m/s)</label>
          <input
            type="text"
            value={v1}
            onChange={(e) => setV1(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            placeholder="ex: 2.5"
          />
        </Card>
        <Card>
          <label className="block text-sm font-semibold">v₂ (m/s)</label>
          <input
            type="text"
            value={v2}
            onChange={(e) => setV2(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            placeholder="ex: 5.0"
          />
        </Card>
      </div>

      {!result && (
        <Button onClick={check}>Verificar</Button>
      )}

      {result && (
        <Card className={result.pts === 30 ? "bg-emerald-500/10" : result.pts > 0 ? "bg-amber-500/10" : "bg-rose-500/10"}>
          <div className="font-bold">
            {result.pts === 30 ? "Perfeito! +30" : result.pts > 0 ? `Acertou parcial: +${result.pts}` : "Errou os dois."}
          </div>
          <div className="mt-2 text-sm">
            v₁ esperado: <b>{expected.v1.toFixed(2)}</b> m/s {result.ok1 ? "✅" : "❌"} ·
            v₂ esperado: <b className="ml-2">{expected.v2.toFixed(2)}</b> m/s {result.ok2 ? "✅" : "❌"}
          </div>
          <div className="mt-2 text-xs text-[var(--muted)]">
            Fórmulas: v₁ = [(m₁−m₂)u₁ + 2m₂u₂]/(m₁+m₂);   v₂ = [(m₂−m₁)u₂ + 2m₁u₁]/(m₁+m₂)
          </div>
          <Button className="mt-3" onClick={next}>
            Próximo
          </Button>
        </Card>
      )}
    </GameShell>
  );
}
