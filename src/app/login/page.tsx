"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const WHATS_BASE = "https://wa.me/5561991770953?text=";
const PLANS_DISPLAY = [
  { name: "Trial 3 dias", price: "Grátis", desc: "3 dias com tudo do Total liberado", color: "from-amber-400 to-orange-500" },
  { name: "Aluno", price: "R$59,90/mês", desc: "1 matéria · 30 perguntas IA/mês", color: "from-sky-500 to-cyan-500" },
  { name: "Total", price: "R$99,90/mês", desc: "4 matérias · 100 perguntas IA/mês", color: "from-indigo-500 to-violet-500" },
  { name: "Premium", price: "R$149,90/mês", desc: "Tudo + IA ilimitada + prioridade", color: "from-violet-500 to-fuchsia-500" },
  { name: "Anual", price: "R$799/ano", desc: "12 meses do Total (~33% off)", color: "from-emerald-500 to-teal-500" },
  { name: "Família", price: "R$199/mês", desc: "Até 4 contas com Total", color: "from-rose-500 to-pink-500" },
  { name: "3 Anos", price: "R$1.997 (uma vez)", desc: "Total por 36 meses", color: "from-fuchsia-500 to-purple-600" },
];

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlans, setShowPlans] = useState(false);
  const [referral, setReferral] = useState("");
  const renewMsg = sp.get("renew");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "invalid" ? "E-mail ou senha inválidos." : "Erro no servidor.");
        return;
      }
      const from = sp.get("from") || "/";
      router.replace(from);
      router.refresh();
    } catch {
      setError("Erro de rede.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl shadow-lg">
            ⚛️
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">FisiFun</h1>
          <p className="text-sm text-zinc-500">Faça login para continuar estudando</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">E-mail</span>
            <input
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Senha</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </label>

          {error && <div className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowPlans((v) => !v)}
            className="rounded-xl border-2 border-emerald-500 bg-emerald-500/10 px-4 py-2.5 text-center text-sm font-bold text-emerald-700 transition hover:bg-emerald-500/20 dark:text-emerald-400"
          >
            🚀 Criar conta — escolha seu plano
          </button>
          {showPlans && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-2 text-[11px] font-semibold text-zinc-500">
                Escolha um plano e fale com a equipe pelo WhatsApp para liberar o pagamento (Pix, cartão de crédito ou débito):
              </div>
              <ul className="flex flex-col gap-1.5">
                {PLANS_DISPLAY.map((p) => (
                  <li key={p.name}>
                    <a
                      href={`${WHATS_BASE}${encodeURIComponent(`Olá! Quero contratar o plano ${p.name} (${p.price}) do FisiFun.${referral ? ` Código de indicação: ${referral}` : ""}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${p.color} p-2 text-left text-white shadow-sm transition hover:shadow-md`}
                    >
                      <div className="flex-1">
                        <div className="text-xs font-extrabold">{p.name}</div>
                        <div className="text-[10px] opacity-90">{p.desc}</div>
                      </div>
                      <div className="text-right text-[11px] font-bold">{p.price}</div>
                    </a>
                  </li>
                ))}
              </ul>
              <label className="mt-2 flex flex-col gap-1 text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Código de indicação (opcional)</span>
                <input
                  value={referral}
                  onChange={(e) => setReferral(e.target.value.toUpperCase())}
                  placeholder="EX: CARLOS-X7K2"
                  className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-[12px] uppercase tracking-wide outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </label>
              <p className="mt-2 text-[10px] text-zinc-500">
                Quem indicou ganha 50% off na próxima fatura. Combinado direto com a equipe.
              </p>
            </div>
          )}
          <a
            href={`${WHATS_BASE}${encodeURIComponent("Olá! Quero falar sobre o FisiFun")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            💬 Fale com nossa equipe
          </a>
        </div>

        {renewMsg && (
          <div className="mt-4 rounded-xl border border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
            ⚠️ Seu plano expirou. Renove falando com nossa equipe para continuar.
          </div>
        )}

        <p className="mt-4 text-center text-[10px] text-zinc-400">
          3 dias grátis · cancele quando quiser
        </p>
      </div>
    </div>
  );
}
