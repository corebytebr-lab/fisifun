"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
          <a
            href="https://wa.me/5561991770953?text=Ol%C3%A1%21%20Quero%20criar%20uma%20conta%20no%20FisiFun"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border-2 border-emerald-500 bg-emerald-500/10 px-4 py-2.5 text-center text-sm font-bold text-emerald-700 transition hover:bg-emerald-500/20 dark:text-emerald-400"
          >
            🚀 Criar conta — a partir de R$59,90/mês
          </a>
          <a
            href="https://wa.me/5561991770953?text=Ol%C3%A1%21%20Quero%20falar%20sobre%20o%20FisiFun"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            💬 Fale com nossa equipe
          </a>
        </div>

        <p className="mt-4 text-center text-[10px] text-zinc-400">
          7 dias grátis · cancele quando quiser
        </p>
      </div>
    </div>
  );
}
