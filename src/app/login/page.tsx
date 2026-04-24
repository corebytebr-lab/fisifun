"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn, Sparkles } from "lucide-react";
import { isFirebaseConfigured, signInWithGoogle } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (auth.status === "signed-in") {
      router.replace("/");
    }
  }, [auth.status, router]);

  const handleGoogle = async () => {
    setErr(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao entrar";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center p-6">
      <div className="fisifun-card w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl shadow-lg">
          ⚛️
        </div>
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight">Entrar no FisiFun</h1>
        <p className="mb-6 text-sm text-[var(--muted)]">
          Login opcional — seu progresso continua salvo no navegador de qualquer jeito.
        </p>

        {!isFirebaseConfigured() ? (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-left text-sm text-amber-700 dark:text-amber-200">
            <p className="font-semibold">Login do Google ainda não está configurado.</p>
            <p className="mt-1 opacity-80">
              O dono do app precisa adicionar as variáveis <code>NEXT_PUBLIC_FIREBASE_*</code> no ambiente de build. Enquanto isso você pode usar o app normalmente.
            </p>
          </div>
        ) : (
          <>
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <GoogleIcon />
              {loading ? "Entrando…" : "Entrar com Google"}
            </button>
            {err && (
              <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-300">
                {err}
              </p>
            )}
          </>
        )}

        <button
          onClick={() => router.replace("/")}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 text-xs font-medium text-[var(--muted)] hover:bg-[var(--bg)]"
        >
          <Sparkles size={14} /> Continuar sem entrar
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-[var(--muted)]">
        <LogIn size={12} className="mr-1 inline" /> Login serve só pra você abrir a conta em outro aparelho no futuro. Progresso atual fica no <code>localStorage</code>.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.7 6.5 29.1 4.5 24 4.5 12.9 4.5 4 13.4 4 24.5S12.9 44.5 24 44.5 44 35.6 44 24.5c0-1.4-.1-2.7-.4-4z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.7 6.5 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44.5c5 0 9.5-1.9 12.9-5l-6-4.9c-2 1.4-4.4 2.4-6.9 2.4-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.4 40 16.1 44.5 24 44.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6 4.9C41 35 44 30 44 24.5c0-1.4-.1-2.7-.4-4z"
      />
    </svg>
  );
}
