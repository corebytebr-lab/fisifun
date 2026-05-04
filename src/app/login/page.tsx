"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const WHATS_BASE = "https://wa.me/5561991770953?text=";
type PlanKey = "trial" | "aluno" | "total" | "premium" | "anual" | "familia" | "trienal";
const PLANS_DISPLAY: { key: PlanKey; name: string; price: string; desc: string; color: string }[] = [
  { key: "trial", name: "Trial 3 dias", price: "Grátis", desc: "3 dias com tudo do Total liberado", color: "from-amber-400 to-orange-500" },
  { key: "aluno", name: "Aluno", price: "R$59,90/mês", desc: "1 matéria · 30 perguntas IA/mês", color: "from-sky-500 to-cyan-500" },
  { key: "total", name: "Total", price: "R$99,90/mês", desc: "4 matérias · 100 perguntas IA/mês", color: "from-indigo-500 to-violet-500" },
  { key: "premium", name: "Premium", price: "R$149,90/mês", desc: "Tudo + IA ilimitada + prioridade", color: "from-violet-500 to-fuchsia-500" },
  { key: "anual", name: "Anual", price: "R$799/ano", desc: "12 meses do Total (~33% off)", color: "from-emerald-500 to-teal-500" },
  { key: "familia", name: "Família", price: "R$199/mês", desc: "Até 4 contas com Total", color: "from-rose-500 to-pink-500" },
  { key: "trienal", name: "3 Anos", price: "R$1.997 (uma vez)", desc: "Total por 36 meses", color: "from-fuchsia-500 to-purple-600" },
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
  const [kiwifyLinks, setKiwifyLinks] = useState<Partial<Record<PlanKey, string>>>({});
  const [magicSent, setMagicSent] = useState(false);
  const [magicBusy, setMagicBusy] = useState(false);
  const [showMagic, setShowMagic] = useState(false);
  const renewMsg = sp.get("renew");
  const mlError = sp.get("ml_error");

  useEffect(() => {
    fetch("/api/kiwify-links")
      .then((r) => (r.ok ? r.json() : { links: {} }))
      .then((d) => setKiwifyLinks(d.links ?? {}))
      .catch(() => undefined);
  }, []);

  const sendMagicLink = async () => {
    if (!email) {
      setError("Digite seu e-mail antes.");
      return;
    }
    setError(null);
    setMagicBusy(true);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "login" }),
      });
      if (!res.ok) throw new Error("fail");
      setMagicSent(true);
    } catch {
      setError("Não consegui enviar o link agora. Tente de novo em alguns segundos.");
    } finally {
      setMagicBusy(false);
    }
  };

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
          {mlError && (
            <div className="rounded-xl bg-amber-100 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              Link inválido ou expirado. Peça um novo abaixo.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setShowMagic((v) => !v)}
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {showMagic ? "Ocultar" : "Esqueci minha senha / Entrar com link por email"}
          </button>
          {showMagic && (
            <div className="rounded-xl bg-zinc-50 p-3 text-xs dark:bg-zinc-950">
              {magicSent ? (
                <p className="text-emerald-700 dark:text-emerald-400">
                  ✉️ Se o e-mail estiver cadastrado, vai chegar um link em <strong>{email}</strong>.
                  Pode fechar essa aba e abrir o e-mail — vale por 30 minutos.
                </p>
              ) : (
                <>
                  <p className="mb-2 text-zinc-600 dark:text-zinc-400">
                    Digite o e-mail acima e clique abaixo. Mandamos um link pra você entrar sem senha (ou trocar a sua).
                  </p>
                  <button
                    type="button"
                    onClick={sendMagicLink}
                    disabled={magicBusy || !email}
                    className="w-full rounded-xl bg-indigo-500/10 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-500/20 disabled:opacity-50 dark:text-indigo-300"
                  >
                    {magicBusy ? "Enviando…" : "✉️ Receber link por e-mail"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

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
                {PLANS_DISPLAY.map((p) => {
                  const kiwify = p.key !== "trial" ? kiwifyLinks[p.key] : undefined;
                  const refSuffix = referral ? `?ref=${encodeURIComponent(referral)}` : "";
                  const href = kiwify
                    ? `${kiwify}${refSuffix}`
                    : `${WHATS_BASE}${encodeURIComponent(`Olá! Quero contratar o plano ${p.name} (${p.price}) do FisiFun.${referral ? ` Código de indicação: ${referral}` : ""}`)}`;
                  return (
                    <li key={p.key}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${p.color} p-2 text-left text-white shadow-sm transition hover:shadow-md`}
                      >
                        <div className="flex-1">
                          <div className="text-xs font-extrabold">
                            {p.name}
                            {kiwify && <span className="ml-1 rounded bg-white/20 px-1 text-[9px]">Pix · Cartão</span>}
                          </div>
                          <div className="text-[10px] opacity-90">{p.desc}</div>
                        </div>
                        <div className="text-right text-[11px] font-bold">{p.price}</div>
                      </a>
                    </li>
                  );
                })}
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
