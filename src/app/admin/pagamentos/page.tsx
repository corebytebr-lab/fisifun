"use client";

import { useEffect, useState } from "react";

interface KiwifyConfigView {
  webhookSecret: string;
  hasSecret: boolean;
  productMap: Record<string, string>;
  links: Record<string, string>;
}

const PLAN_LINKS: { key: string; label: string; price: string }[] = [
  { key: "aluno", label: "Aluno", price: "R$ 59,90/mês" },
  { key: "total", label: "Total", price: "R$ 99,90/mês" },
  { key: "premium", label: "Premium", price: "R$ 149,90/mês" },
  { key: "anual", label: "Anual", price: "R$ 799,00 (1 ano)" },
  { key: "trienal", label: "3 Anos", price: "R$ 1.997,00 (3 anos)" },
  { key: "familia", label: "Família", price: "R$ 199,00/mês" },
  { key: "escola", label: "Escola B2B", price: "R$ 25,00/aluno/mês" },
];

export default function PagamentosAdmin() {
  const [cfg, setCfg] = useState<KiwifyConfigView | null>(null);
  const [secret, setSecret] = useState("");
  const [productMapJson, setProductMapJson] = useState("{}");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/kiwify-config")
      .then((r) => r.json())
      .then((d) => {
        setCfg(d);
        setProductMapJson(JSON.stringify(d.productMap ?? {}, null, 2));
      });
  }, []);

  async function saveSecret() {
    if (!secret) return;
    setBusy(true);
    await fetch("/api/admin/kiwify-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webhookSecret: secret }),
    });
    setSecret("");
    const r = await fetch("/api/admin/kiwify-config");
    setCfg(await r.json());
    setBusy(false);
    setMsg("Secret salvo.");
  }

  async function saveLink(key: string, value: string) {
    if (!cfg) return;
    setBusy(true);
    const links = { ...(cfg.links ?? {}), [key]: value.trim() };
    await fetch("/api/admin/kiwify-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ links }),
    });
    setCfg({ ...cfg, links });
    setBusy(false);
  }

  async function saveProductMap() {
    setBusy(true);
    setMsg(null);
    try {
      const parsed = JSON.parse(productMapJson);
      await fetch("/api/admin/kiwify-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productMap: parsed }),
      });
      setMsg("Mapa salvo.");
    } catch {
      setMsg("JSON inválido.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold">💳 Pagamentos · Kiwify</h1>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="mb-2 font-bold">📡 Webhook</h2>
        <p className="text-xs text-[var(--muted)]">
          Cole na Kiwify (Configurações → Integrações → Webhook):
        </p>
        <code className="mt-1 block rounded-lg bg-[var(--bg)] px-2 py-1 text-xs">
          https://fisifun.corebytecnologia.com/api/kiwify-webhook
        </code>
        <p className="mt-3 text-xs">
          <strong>Secret atual:</strong>{" "}
          <span className="font-mono text-[10px]">{cfg?.hasSecret ? cfg.webhookSecret : "—"}</span>
        </p>
        <div className="mt-2 flex gap-2">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Cole o token Kiwify"
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
          />
          <button
            onClick={saveSecret}
            disabled={busy || !secret}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
        <p className="mt-2 text-[10px] text-[var(--muted)]">
          Sem secret, o webhook ainda funciona mas qualquer um pode mandar dados — só ative em produção depois de salvar o secret.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="mb-2 font-bold">🔗 Links públicos da Kiwify</h2>
        <p className="text-xs text-[var(--muted)]">
          Cole a URL pública de cada link da Kiwify. O <code>/login/</code> usa essas URLs nos botões de plano.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {PLAN_LINKS.map((p) => (
            <PlanLinkRow
              key={p.key}
              label={p.label}
              price={p.price}
              value={cfg?.links?.[p.key] ?? ""}
              onSave={(v) => saveLink(p.key, v)}
              busy={busy}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="mb-2 font-bold">🗺️ Mapa Produto Kiwify → Plano FisiFun</h2>
        <p className="text-xs text-[var(--muted)]">
          Por padrão, detectamos pelo nome do produto (se contém &quot;aluno&quot;, &quot;total&quot;, etc). Se quiser
          mapear pelo product_id da Kiwify, cole aqui:
        </p>
        <textarea
          value={productMapJson}
          onChange={(e) => setProductMapJson(e.target.value)}
          rows={8}
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2 font-mono text-xs"
          placeholder='{ "abc123": "ALUNO", "fisifun-plano-total": "TOTAL" }'
        />
        <button
          onClick={saveProductMap}
          disabled={busy}
          className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          Salvar mapa
        </button>
        {msg && <p className="mt-2 text-xs">{msg}</p>}
      </section>
    </div>
  );
}

function PlanLinkRow({
  label,
  price,
  value,
  onSave,
  busy,
}: {
  label: string;
  price: string;
  value: string;
  onSave: (v: string) => void;
  busy: boolean;
}) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2">
      <div className="min-w-[120px]">
        <div className="text-sm font-bold">{label}</div>
        <div className="text-[10px] text-[var(--muted)]">{price}</div>
      </div>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="https://pay.kiwify.com.br/..."
        className="flex-1 min-w-[200px] rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 text-sm"
      />
      <button
        onClick={() => onSave(v)}
        disabled={busy}
        className="rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-500/30"
      >
        Salvar
      </button>
    </div>
  );
}
