"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, X } from "lucide-react";
import { compile, safeEval } from "@/lib/calc/expr";

export function CalcFab() {
  const [open, setOpen] = useState(false);
  const [expr, setExpr] = useState("");
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [angleDeg, setAngleDeg] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("fisifun-calc-history");
    if (saved) try { setHistory(JSON.parse(saved)); } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("fisifun-calc-history", JSON.stringify(history.slice(-30)));
  }, [history]);

  const result = useMemo(() => {
    if (!expr.trim()) return "";
    try {
      let input = expr;
      if (angleDeg) {
        // converte trig: sin/cos/tan recebem graus
        input = input.replace(/\b(sin|cos|tan)\s*\(/g, (_, fn) => `${fn}((PI/180)*(`).replace(/\)/g, "))");
        // simplification: only do trivial wrap if needed — fallback
      }
      const fn = compile(input);
      const v = safeEval(fn, 0);
      if (!isFinite(v) || Number.isNaN(v)) return "—";
      return formatNum(v);
    } catch (e) {
      return "—";
    }
  }, [expr, angleDeg]);

  const submit = () => {
    if (!expr.trim() || result === "—" || result === "") return;
    setHistory((h) => [...h, { expr, result }].slice(-30));
    setExpr(result);
  };

  const click = (s: string) => setExpr((p) => p + s);
  const back = () => setExpr((p) => p.slice(0, -1));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Calculadora científica"
        className="fixed bottom-20 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 md:bottom-6"
      >
        <Calculator size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-t-3xl bg-[var(--bg-elev)] p-4 shadow-xl md:rounded-3xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-bold">🧮 Calculadora científica</div>
              <button type="button" onClick={() => setOpen(false)} aria-label="fechar">
                <X size={18} />
              </button>
            </div>

            <div className="mb-2 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm">
              <span className="break-all">{expr || "0"}</span>
              <button
                type="button"
                onClick={() => setAngleDeg((v) => !v)}
                className={`rounded px-2 py-0.5 text-[10px] font-bold ${angleDeg ? "bg-amber-500/20 text-amber-700 dark:text-amber-300" : "bg-[var(--border)] text-[var(--muted)]"}`}
              >
                {angleDeg ? "DEG" : "RAD"}
              </button>
            </div>
            <div className="mb-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-right font-mono text-2xl font-bold">
              {result || "—"}
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-sm">
              {(["sin(", "cos(", "tan(", "ln(", "log("] as const).map((b) => (
                <Btn key={b} onClick={() => click(b)} small>{b}</Btn>
              ))}
              {(["sqrt(", "(", ")", "^", "PI"] as const).map((b) => (
                <Btn key={b} onClick={() => click(b)} small>{b}</Btn>
              ))}
              <Btn onClick={() => click("7")}>7</Btn>
              <Btn onClick={() => click("8")}>8</Btn>
              <Btn onClick={() => click("9")}>9</Btn>
              <Btn onClick={() => click("/")} accent>÷</Btn>
              <Btn onClick={back} accent>⌫</Btn>
              <Btn onClick={() => click("4")}>4</Btn>
              <Btn onClick={() => click("5")}>5</Btn>
              <Btn onClick={() => click("6")}>6</Btn>
              <Btn onClick={() => click("*")} accent>×</Btn>
              <Btn onClick={() => setExpr("")} accent>C</Btn>
              <Btn onClick={() => click("1")}>1</Btn>
              <Btn onClick={() => click("2")}>2</Btn>
              <Btn onClick={() => click("3")}>3</Btn>
              <Btn onClick={() => click("-")} accent>−</Btn>
              <Btn onClick={() => click("+")} accent>+</Btn>
              <Btn onClick={() => click("0")}>0</Btn>
              <Btn onClick={() => click(".")}>.</Btn>
              <Btn onClick={() => click("e")}>e</Btn>
              <Btn onClick={() => click(",")} small>,</Btn>
              <Btn onClick={submit} primary>=</Btn>
            </div>

            {history.length > 0 && (
              <div className="mt-3 max-h-28 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2 text-xs">
                <div className="mb-1 font-bold text-[var(--muted)]">Histórico</div>
                {history.slice().reverse().map((h, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setExpr(h.expr)}
                    className="flex w-full items-center justify-between gap-2 rounded px-1 py-0.5 hover:bg-[var(--bg-elev)]"
                  >
                    <span className="truncate font-mono">{h.expr}</span>
                    <span className="font-mono font-bold">{h.result}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Btn({ children, onClick, primary, accent, small }: { children: React.ReactNode; onClick: () => void; primary?: boolean; accent?: boolean; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg py-2.5 font-semibold transition active:scale-95 ${
        primary
          ? "bg-indigo-500 text-white hover:bg-indigo-600"
          : accent
          ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20"
          : small
          ? "bg-[var(--bg)] text-xs hover:bg-[var(--border)]"
          : "bg-[var(--bg)] hover:bg-[var(--border)]"
      }`}
    >
      {children}
    </button>
  );
}

function formatNum(v: number): string {
  if (Math.abs(v) > 1e10 || (Math.abs(v) < 1e-4 && v !== 0)) {
    return v.toExponential(6);
  }
  const s = Number.parseFloat(v.toPrecision(10)).toString();
  return s;
}
