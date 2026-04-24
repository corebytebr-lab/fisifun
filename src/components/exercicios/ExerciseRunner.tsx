"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Exercise } from "@/lib/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { RichText, InlineMath, normalizeText } from "@/lib/format";
import { CheckCircle2, XCircle, Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { callGemini, TUTOR_SYSTEM } from "@/lib/gemini";
import { useGame } from "@/lib/store";

export type ExerciseResult = { correct: boolean };

export function ExerciseRunner({
  exercise,
  onSubmit,
  onNext,
}: {
  exercise: Exercise;
  onSubmit: (result: ExerciseResult) => void;
  onNext: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function report(result: boolean) {
    setSubmitted(true);
    setCorrect(result);
    onSubmit({ correct: result });
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
            {labelType(exercise.type)}
          </div>
          <h3 className="mt-1 text-lg font-bold leading-snug"><RichText>{exercise.prompt}</RichText></h3>
        </div>
        {exercise.hint && (
          <button
            onClick={() => setShowHint((s) => !s)}
            aria-label="Mostrar dica"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-amber-500 transition hover:bg-amber-500/10"
          >
            <Lightbulb size={16} />
          </button>
        )}
      </div>

      {showHint && exercise.hint && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-200">
          💡 {exercise.hint}
        </div>
      )}

      <ExerciseBody
        exercise={exercise}
        submitted={submitted}
        onResult={report}
      />

      {submitted && (
        <Feedback correct={correct} exercise={exercise} onNext={onNext} />
      )}
    </Card>
  );
}

function Feedback({
  correct,
  exercise,
  onNext,
}: {
  correct: boolean;
  exercise: Exercise;
  onNext: () => void;
}) {
  const apiKey = useGame((s) => s.geminiApiKey);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  async function askAi() {
    if (!apiKey) {
      setAiError("NO_KEY");
      return;
    }
    setAiLoading(true);
    setAiError(null);
    try {
      const contextual = buildExerciseContext(exercise);
      const text = await callGemini({
        apiKey,
        system: TUTOR_SYSTEM,
        messages: [
          {
            role: "user",
            parts: [
              {
                text:
                  `Resolva e explique este exercício do app, passo a passo, em português, seguindo o formato Dados → O que pede → Conceito/Fórmula → Substituição → Resultado → Por quê → Cuidado comum.\n\n` +
                  contextual,
              },
            ],
          },
        ],
      });
      setAiText(text);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setAiError(msg);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div
      className={`anim-pop rounded-xl border p-4 ${
        correct
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-rose-500/30 bg-rose-500/10"
      }`}
    >
      <div className="flex items-start gap-3">
        {correct ? (
          <CheckCircle2 className="text-emerald-500" />
        ) : (
          <XCircle className="text-rose-500" />
        )}
        <div className="flex-1">
          <div className={`text-sm font-bold ${correct ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
            {correct ? "Isso aí!" : "Não exatamente"}
          </div>
          <div className="mt-1 text-sm">
            <RichText>{exercise.explanation}</RichText>
          </div>
        </div>
      </div>

      {aiText && (
        <div className="mt-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-sm">
          <div className="mb-1 flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-200">
            <Sparkles size={14} /> Explicação detalhada (IA)
          </div>
          <div className="prose-sm"><RichText>{aiText}</RichText></div>
        </div>
      )}

      {aiError && aiError !== "NO_KEY" && (
        <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">
          {aiError}
        </div>
      )}
      {aiError === "NO_KEY" && (
        <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
          Pra usar o tutor IA, configure sua chave grátis do Gemini em{" "}
          <Link href="/configuracoes" className="font-semibold underline">Configurações → Tutor IA</Link>.
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        {!aiText && (
          <button
            onClick={askAi}
            disabled={aiLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-500/20 disabled:opacity-50 dark:text-indigo-200"
          >
            {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {aiLoading ? "Pensando..." : "Explique melhor (IA)"}
          </button>
        )}
        <Button size="sm" onClick={onNext} variant={correct ? "success" : "primary"}>
          Próxima →
        </Button>
      </div>
    </div>
  );
}

function buildExerciseContext(e: Exercise): string {
  const lines: string[] = [];
  lines.push(`Tipo: ${e.type}`);
  lines.push(`Enunciado: ${e.prompt}`);
  switch (e.type) {
    case "multiple-choice":
      lines.push(`Alternativas: ${e.options.map((o, i) => `(${i + 1}) ${o}`).join(" | ")}`);
      lines.push(`Resposta correta: alternativa (${e.correct + 1}) = ${e.options[e.correct]}`);
      break;
    case "true-false":
      lines.push(`Resposta correta: ${e.correct ? "Verdadeiro" : "Falso"}`);
      break;
    case "fill-blank":
      lines.push(`Respostas possíveis: ${e.answers.join(" | ")}`);
      break;
    case "numeric":
      lines.push(`Resposta numérica: ${e.answer} (tolerância ${e.tolerance})`);
      break;
    case "numeric-units":
      lines.push(`Resposta: ${e.answer} ${e.unit}`);
      break;
    case "drag-formula":
      lines.push(`Ordem correta dos tokens: ${e.correct.join(" ")}`);
      break;
    case "order-steps":
      lines.push(`Ordem correta dos passos: ${e.steps.join(" → ")}`);
      break;
    case "graph-read":
      lines.push(`Pergunta sobre gráfico: ${e.question}`);
      lines.push(`Alternativas: ${e.options.map((o, i) => `(${i + 1}) ${o}`).join(" | ")}`);
      lines.push(`Resposta correta: (${e.correct + 1}) ${e.options[e.correct]}`);
      break;
    case "concept-image":
      lines.push(`Alternativas: ${e.options.map((o, i) => `(${i + 1}) ${o}`).join(" | ")}`);
      lines.push(`Resposta correta: (${e.correct + 1}) ${e.options[e.correct]}`);
      break;
    case "mini-case":
      lines.push(`Cenário: ${e.scenario}`);
      lines.push(`Alternativas: ${e.options.map((o, i) => `(${i + 1}) ${o}`).join(" | ")}`);
      lines.push(`Resposta correta: (${e.correct + 1}) ${e.options[e.correct]}`);
      break;
  }
  if (e.explanation) lines.push(`Explicação base: ${e.explanation}`);
  if ("concept" in e && e.concept) lines.push(`Conceito: ${e.concept}`);
  return lines.join("\n");
}

function labelType(t: Exercise["type"]): string {
  switch (t) {
    case "multiple-choice":
      return "Múltipla escolha";
    case "true-false":
      return "Verdadeiro ou falso";
    case "fill-blank":
      return "Preencher lacuna";
    case "drag-formula":
      return "Montar fórmula";
    case "order-steps":
      return "Ordenar passos";
    case "numeric":
      return "Resposta numérica";
    case "numeric-units":
      return "Número com unidade";
    case "graph-read":
      return "Interpretar gráfico";
    case "concept-image":
      return "Diagrama";
    case "mini-case":
      return "Mini caso";
  }
}

function ExerciseBody({
  exercise,
  submitted,
  onResult,
}: {
  exercise: Exercise;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  switch (exercise.type) {
    case "multiple-choice":
      return <MultipleChoice e={exercise} submitted={submitted} onResult={onResult} />;
    case "true-false":
      return <TrueFalse e={exercise} submitted={submitted} onResult={onResult} />;
    case "fill-blank":
      return <FillBlank e={exercise} submitted={submitted} onResult={onResult} />;
    case "drag-formula":
      return <DragFormula e={exercise} submitted={submitted} onResult={onResult} />;
    case "order-steps":
      return <OrderSteps e={exercise} submitted={submitted} onResult={onResult} />;
    case "numeric":
      return <NumericInput e={exercise} submitted={submitted} onResult={onResult} />;
    case "numeric-units":
      return <NumericUnits e={exercise} submitted={submitted} onResult={onResult} />;
    case "graph-read":
      return <GraphRead e={exercise} submitted={submitted} onResult={onResult} />;
    case "concept-image":
      return <ConceptImage e={exercise} submitted={submitted} onResult={onResult} />;
    case "mini-case":
      return <MiniCase e={exercise} submitted={submitted} onResult={onResult} />;
  }
}

function OptionList<T extends { id: string; label: string; correct: boolean }>({
  options,
  onPick,
  submitted,
  picked,
}: {
  options: T[];
  onPick: (id: string) => void;
  submitted: boolean;
  picked: string | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const isPicked = picked === o.id;
        let klass = "border-[var(--border)] hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10";
        if (submitted) {
          if (o.correct) klass = "border-emerald-500 bg-emerald-500/10";
          else if (isPicked) klass = "border-rose-500 bg-rose-500/10";
        } else if (isPicked) {
          klass = "border-indigo-500 bg-indigo-500/10";
        }
        return (
          <button
            key={o.id}
            onClick={() => !submitted && onPick(o.id)}
            disabled={submitted}
            className={`rounded-xl border-2 p-3 text-left text-sm font-medium transition ${klass}`}
          >
            <RichText>{o.label}</RichText>
          </button>
        );
      })}
    </div>
  );
}

// --- Multiple choice
function MultipleChoice({
  e,
  submitted,
  onResult,
}: {
  e: Extract<Exercise, { type: "multiple-choice" }>;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = e.options.map((label, i) => ({ id: `${i}`, label, correct: i === e.correct }));
  return (
    <div className="flex flex-col gap-3">
      <OptionList
        options={options}
        onPick={setPicked}
        submitted={submitted}
        picked={picked}
      />
      {!submitted && (
        <Button disabled={picked === null} onClick={() => onResult(Number(picked) === e.correct)}>
          Confirmar
        </Button>
      )}
    </div>
  );
}

// --- True/False
function TrueFalse({
  e,
  submitted,
  onResult,
}: {
  e: Extract<Exercise, { type: "true-false" }>;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = [
    { id: "true", label: "Verdadeiro", correct: e.correct === true },
    { id: "false", label: "Falso", correct: e.correct === false },
  ];
  return (
    <div className="flex flex-col gap-3">
      <OptionList options={options} onPick={setPicked} submitted={submitted} picked={picked} />
      {!submitted && (
        <Button disabled={picked === null} onClick={() => onResult(picked === "true" ? e.correct : !e.correct)}>
          Confirmar
        </Button>
      )}
    </div>
  );
}

// --- Fill blank
function FillBlank({
  e,
  submitted,
  onResult,
}: {
  e: Extract<Exercise, { type: "fill-blank" }>;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const parts = e.prompt.split("___");
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm">
        {parts.map((p, i) => (
          <span key={i}>
            <RichText>{p}</RichText>
            {i < parts.length - 1 && (
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={submitted}
                className="mx-1 inline-block w-28 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="…"
              />
            )}
          </span>
        ))}
      </div>
      {!submitted && (
        <Button
          disabled={!value.trim()}
          onClick={() => {
            const norm = normalizeText(value);
            const ok = e.answers.some((a) => normalizeText(a) === norm);
            onResult(ok);
          }}
        >
          Confirmar
        </Button>
      )}
    </div>
  );
}

// --- Drag formula (token reorder — buttons)
function DragFormula({
  e,
  submitted,
  onResult,
}: {
  e: Extract<Exercise, { type: "drag-formula" }>;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  const [pool, setPool] = useState(() => shuffle(e.tokens));
  const [placed, setPlaced] = useState<typeof e.tokens>([]);

  function takeFromPool(id: string) {
    const t = pool.find((x) => x.id === id);
    if (!t) return;
    setPool(pool.filter((x) => x.id !== id));
    setPlaced([...placed, t]);
  }
  function removeFromPlaced(idx: number) {
    const t = placed[idx];
    setPlaced(placed.filter((_, i) => i !== idx));
    setPool([...pool, t]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="min-h-[48px] rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--bg)] p-3 flex flex-wrap gap-2">
        {placed.map((t, i) => (
          <button
            key={t.id}
            onClick={() => !submitted && removeFromPlaced(i)}
            disabled={submitted}
            className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-bold text-white shadow"
          >
            {t.label}
          </button>
        ))}
        {placed.length === 0 && <span className="text-sm text-[var(--muted)]">Arraste os itens para cá</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {pool.map((t) => (
          <button
            key={t.id}
            onClick={() => !submitted && takeFromPool(t.id)}
            disabled={submitted}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1.5 text-sm font-bold shadow-sm hover:bg-indigo-500/10"
          >
            {t.label}
          </button>
        ))}
      </div>
      {!submitted && (
        <Button
          disabled={placed.length !== e.correct.length}
          onClick={() => {
            const ok = placed.every((t, i) => t.id === e.correct[i]);
            onResult(ok);
          }}
        >
          Confirmar
        </Button>
      )}
    </div>
  );
}

function shuffle<T>(xs: T[]): T[] {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// --- Order steps
function OrderSteps({
  e,
  submitted,
  onResult,
}: {
  e: Extract<Exercise, { type: "order-steps" }>;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  const initial = useMemo(() => shuffle(e.steps.map((text, i) => ({ id: `${i}`, text, correctIdx: i }))), [e]);
  const [items, setItems] = useState(initial);

  function move(idx: number, delta: number) {
    const next = [...items];
    const j = idx + delta;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setItems(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {items.map((it, idx) => (
          <li
            key={it.id}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
              {idx + 1}
            </span>
            <span className="flex-1">{it.text}</span>
            {!submitted && (
              <>
                <button
                  onClick={() => move(idx, -1)}
                  className="rounded-md border border-[var(--border)] px-2 py-1 text-xs"
                  disabled={idx === 0}
                >
                  ↑
                </button>
                <button
                  onClick={() => move(idx, 1)}
                  className="rounded-md border border-[var(--border)] px-2 py-1 text-xs"
                  disabled={idx === items.length - 1}
                >
                  ↓
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      {!submitted && (
        <Button
          onClick={() => {
            const ok = items.every((it, i) => it.correctIdx === i);
            onResult(ok);
          }}
        >
          Confirmar
        </Button>
      )}
    </div>
  );
}

// --- Numeric input
function NumericInput({
  e,
  submitted,
  onResult,
}: {
  e: Extract<Exercise, { type: "numeric" }>;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          inputMode="decimal"
          value={value}
          onChange={(v) => setValue(v.target.value)}
          disabled={submitted}
          placeholder="Digite o valor"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        {e.unit && <span className="text-sm text-[var(--muted)]"><InlineMath expr={e.unit} /></span>}
      </div>
      {!submitted && (
        <Button
          disabled={!value.trim()}
          onClick={() => {
            const v = parseFloat(value.replace(",", "."));
            if (isNaN(v)) return onResult(false);
            const tol = e.tolerance ?? 0.01;
            onResult(Math.abs(v - e.answer) <= tol);
          }}
        >
          Confirmar
        </Button>
      )}
    </div>
  );
}

// --- Numeric + unit choice
function NumericUnits({
  e,
  submitted,
  onResult,
}: {
  e: Extract<Exercise, { type: "numeric-units" }>;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          inputMode="decimal"
          value={value}
          onChange={(v) => setValue(v.target.value)}
          disabled={submitted}
          placeholder="Valor"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {e.unitOptions.map((u) => {
          const active = unit === u;
          return (
            <button
              key={u}
              onClick={() => !submitted && setUnit(u)}
              disabled={submitted}
              className={`rounded-lg border px-3 py-1.5 text-sm font-bold ${
                active ? "border-indigo-500 bg-indigo-500/10" : "border-[var(--border)]"
              }`}
            >
              {u}
            </button>
          );
        })}
      </div>
      {!submitted && (
        <Button
          disabled={!value.trim() || !unit}
          onClick={() => {
            const v = parseFloat(value.replace(",", "."));
            const tol = e.tolerance ?? 0.01;
            const ok = !isNaN(v) && Math.abs(v - e.answer) <= tol && unit === e.unit;
            onResult(ok);
          }}
        >
          Confirmar
        </Button>
      )}
    </div>
  );
}

// --- Graph read: simple line chart
function GraphRead({
  e,
  submitted,
  onResult,
}: {
  e: Extract<Exercise, { type: "graph-read" }>;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const pad = 28;
  const W = 300;
  const H = 180;
  const xs = e.points.map((p) => p.x);
  const ys = e.points.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(0, ...ys);
  const yMax = Math.max(...ys);
  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin || 1)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin || 1)) * (H - 2 * pad);
  const path = e.points.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`).join(" ");
  const options = e.options.map((label, i) => ({ id: `${i}`, label, correct: i === e.correct }));
  return (
    <div className="flex flex-col gap-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md self-center rounded-xl border border-[var(--border)] bg-[var(--bg)]">
        {/* axes */}
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="currentColor" opacity="0.4" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="currentColor" opacity="0.4" />
        <text x={W - 6} y={H - pad + 14} fontSize="10" textAnchor="end" opacity="0.6">{e.xLabel}</text>
        <text x={pad + 4} y={pad - 4} fontSize="10" opacity="0.6">{e.yLabel}</text>
        <path d={path} stroke="#6366f1" strokeWidth="2.5" fill="none" />
        {e.points.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="3.5" fill="#6366f1" />
        ))}
      </svg>
      <div className="font-semibold text-sm">{e.question}</div>
      <OptionList options={options} onPick={setPicked} submitted={submitted} picked={picked} />
      {!submitted && (
        <Button disabled={picked === null} onClick={() => onResult(Number(picked) === e.correct)}>
          Confirmar
        </Button>
      )}
    </div>
  );
}

// --- Concept image: renders SVG if starts with <svg>, otherwise emoji
function ConceptImage({
  e,
  submitted,
  onResult,
}: {
  e: Extract<Exercise, { type: "concept-image" }>;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = e.options.map((label, i) => ({ id: `${i}`, label, correct: i === e.correct }));
  return (
    <div className="flex flex-col gap-3">
      <div
        className="self-center rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-4xl"
        dangerouslySetInnerHTML={{ __html: e.diagram }}
      />
      <OptionList options={options} onPick={setPicked} submitted={submitted} picked={picked} />
      {!submitted && (
        <Button disabled={picked === null} onClick={() => onResult(Number(picked) === e.correct)}>
          Confirmar
        </Button>
      )}
    </div>
  );
}

// --- Mini case
function MiniCase({
  e,
  submitted,
  onResult,
}: {
  e: Extract<Exercise, { type: "mini-case" }>;
  submitted: boolean;
  onResult: (ok: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = e.options.map((label, i) => ({ id: `${i}`, label, correct: i === e.correct }));
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 text-sm">
        <RichText>{e.scenario}</RichText>
      </div>
      <OptionList options={options} onPick={setPicked} submitted={submitted} picked={picked} />
      {!submitted && (
        <Button disabled={picked === null} onClick={() => onResult(Number(picked) === e.correct)}>
          Confirmar
        </Button>
      )}
    </div>
  );
}
