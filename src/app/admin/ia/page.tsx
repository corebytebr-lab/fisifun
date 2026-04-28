"use client";

import { useEffect, useState } from "react";

interface Cfg {
  provider: string;
  apiKey: string;
  hasKey: boolean;
  model: string | null;
  monthlyQuota: number;
}

const PROVIDERS = [
  { id: "gemini", label: "🔮 Google Gemini", note: "Grátis até 15 req/min. Modelos: gemini-2.5-flash, gemini-2.0-flash. Crie a chave em aistudio.google.com/apikey", price: "GRÁTIS no AI Studio" },
  { id: "deepseek", label: "🐳 DeepSeek", note: "Mais barato do mercado. Modelos: deepseek-chat. Crie a chave em platform.deepseek.com", price: "~R$0,005 / 1k tokens (10× mais barato que GPT)" },
  { id: "openai", label: "⚡ OpenAI (GPT)", note: "Mais conhecido. Modelos: gpt-4o-mini, gpt-4o. Crie a chave em platform.openai.com/api-keys", price: "~R$0,75 / 1k tokens (gpt-4o-mini)" },
  { id: "claude", label: "🤖 Anthropic Claude", note: "Excelente em raciocínio. Modelos: claude-3-5-haiku-latest, claude-3-5-sonnet-latest. Crie a chave em console.anthropic.com", price: "~R$1,25 / 1k tokens (haiku)" },
];

export default function AIConfigPage() {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [provider, setProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [monthlyQuota, setMonthlyQuota] = useState(50);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/ai-config").then((r) => r.json()).then((d) => {
      setCfg(d);
      setProvider(d.provider);
      setModel(d.model ?? "");
      setMonthlyQuota(d.monthlyQuota ?? 50);
    });
  }, []);

  const save = async () => {
    setBusy(true); setMsg(null);
    const body: Record<string, unknown> = { provider, model, monthlyQuota };
    if (apiKey) body.apiKey = apiKey;
    const r = await fetch("/api/admin/ai-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (r.ok) {
      setMsg("✅ Salvo. Os alunos já podem usar o tutor IA.");
      setApiKey("");
      const d = await (await fetch("/api/admin/ai-config")).json();
      setCfg(d);
    } else {
      setMsg("❌ Erro ao salvar.");
    }
  };

  if (!cfg) return <div className="text-sm text-[var(--muted)]">Carregando…</div>;

  const sel = PROVIDERS.find((p) => p.id === provider);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold">🤖 Configuração de IA (global)</h1>

      <div className="rounded-2xl border border-[var(--border)] bg-amber-500/10 p-4 text-sm">
        <p className="font-bold">ℹ️ Como funciona</p>
        <p className="mt-1">Você cola UMA chave aqui e ela vale pra todos os alunos. Os alunos não precisam configurar nada. O custo da IA fica todo na sua conta do provedor.</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Cota mensal limita quantas perguntas cada aluno pode fazer (em desenvolvimento).</p>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="mb-3 font-bold">Provedor</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className={`rounded-2xl border-2 p-3 text-left transition ${
                provider === p.id
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-[var(--border)] bg-[var(--bg)] hover:border-indigo-400"
              }`}
            >
              <div className="font-bold">{p.label}</div>
              <div className="mt-0.5 text-xs text-emerald-600">{p.price}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">{p.note}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="mb-3 font-bold">Chave da API</h2>
        <p className="mb-2 text-xs text-[var(--muted)]">Status: {cfg.hasKey ? `✅ Configurada (${cfg.apiKey})` : "❌ Sem chave"}</p>
        <input
          type="password"
          placeholder={cfg.hasKey ? "•••••• (cole para substituir)" : "Cole a chave aqui"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm"
        />
        <p className="mt-2 text-xs text-[var(--muted)]">Provedor selecionado: <strong>{sel?.label}</strong></p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="mb-3 font-bold">Avançado</h2>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          Modelo (opcional — deixa vazio pra usar o padrão da plataforma)
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="ex: gemini-2.5-flash, deepseek-chat, gpt-4o-mini, claude-3-5-haiku-latest"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="mt-3 flex flex-col gap-1 text-xs font-semibold">
          Cota mensal por aluno (perguntas/mês)
          <input
            type="number"
            min={0}
            value={monthlyQuota}
            onChange={(e) => setMonthlyQuota(Number(e.target.value))}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-normal"
          />
        </label>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={busy}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 font-bold text-white disabled:opacity-50"
        >
          {busy ? "Salvando…" : "Salvar"}
        </button>
        {msg && <span className="text-sm">{msg}</span>}
      </div>
    </div>
  );
}
