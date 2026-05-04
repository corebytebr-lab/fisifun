"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Slash } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { prettyNumber } from "@/lib/ga/vectors";

interface LineR2 {
  px: number; py: number; // ponto da reta
  vx: number; vy: number; // diretor
}

export default function LinesConvertPage() {
  const [px, setPx] = useState("1");
  const [py, setPy] = useState("2");
  const [vx, setVx] = useState("3");
  const [vy, setVy] = useState("4");

  const num = (s: string) => Number(s.replace(",", "."));
  const line: LineR2 = {
    px: num(px),
    py: num(py),
    vx: num(vx),
    vy: num(vy),
  };

  const valid = [line.px, line.py, line.vx, line.vy].every(Number.isFinite) && (line.vx !== 0 || line.vy !== 0);

  let m: number | null = null;
  let n: number | null = null;
  if (valid && line.vx !== 0) {
    m = line.vy / line.vx;
    n = line.py - m * line.px;
  }

  // Forma geral ax + by + c = 0:
  // direção (vx, vy) ⇒ normal (vy, -vx) ⇒ a = vy, b = -vx
  const a = line.vy;
  const b = -line.vx;
  const c = -(a * line.px + b * line.py);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-indigo-500">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600">
          <Slash size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Conversor de Equações de Reta</h1>
          <p className="text-sm text-[var(--muted)]">Insira ponto e vetor diretor; veja todas as 6 formas.</p>
        </div>
      </header>

      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <Input label="P_x" value={px} setValue={setPx} />
          <Input label="P_y" value={py} setValue={setPy} />
          <Input label="v_x (diretor)" value={vx} setValue={setVx} />
          <Input label="v_y (diretor)" value={vy} setValue={setVy} />
        </div>
      </Card>

      {valid && (
        <Card>
          <CardTitle>Equações da reta</CardTitle>
          <div className="mt-3 space-y-3 text-sm">
            <Eq title="Vetorial">
              (x, y) = ({prettyNumber(line.px)}, {prettyNumber(line.py)}) + t·({prettyNumber(line.vx)}, {prettyNumber(line.vy)})
            </Eq>
            <Eq title="Paramétrica">
              x = {prettyNumber(line.px)} + {prettyNumber(line.vx)}t<br />
              y = {prettyNumber(line.py)} + {prettyNumber(line.vy)}t
            </Eq>
            {line.vx !== 0 && line.vy !== 0 && (
              <Eq title="Simétrica">
                (x − {prettyNumber(line.px)}) / {prettyNumber(line.vx)} = (y − {prettyNumber(line.py)}) / {prettyNumber(line.vy)}
              </Eq>
            )}
            <Eq title="Geral (ax + by + c = 0)">
              {prettyNumber(a)}x + {prettyNumber(b)}y + {prettyNumber(c)} = 0
            </Eq>
            {m !== null && n !== null && (
              <Eq title="Reduzida">
                y = {prettyNumber(m)}x + {prettyNumber(n)}
              </Eq>
            )}
            {m !== null && n !== null && n !== 0 && m !== 0 && (() => {
              // Segmentária: x/p + y/q = 1
              // Encontre p (intercepto x) e q (intercepto y)
              // y = mx+n ⇒ x quando y=0: x = -n/m; y quando x=0: y = n
              const p = -n / m;
              const q = n;
              return (
                <Eq title="Segmentária">
                  x / {prettyNumber(p)} + y / {prettyNumber(q)} = 1
                </Eq>
              );
            })()}
            {line.vx === 0 && (
              <div className="rounded-lg bg-amber-500/10 p-2 text-xs text-amber-700">
                Reta vertical (v_x = 0): não tem coef. angular nem forma reduzida. Equação: x = {prettyNumber(line.px)}.
              </div>
            )}
          </div>
        </Card>
      )}

      <Card>
        <CardTitle>Posição relativa rápida</CardTitle>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Para comparar com outra reta, basta extrair os diretores: paralelas se diretores são LD; perpendiculares se u·v = 0.
        </p>
      </Card>
    </div>
  );
}

function Input({ label, value, setValue }: { label: string; value: string; setValue: (s: string) => void }) {
  return (
    <div>
      <div className="text-xs font-semibold text-[var(--muted)]">{label}</div>
      <input
        className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function Eq({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
      <div className="text-[10px] font-bold uppercase text-[var(--muted)]">{title}</div>
      <div className="mt-1 font-mono">{children}</div>
    </div>
  );
}
