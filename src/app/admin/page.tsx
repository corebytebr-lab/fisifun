"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  newToday: number;
  attemptsToday: number;
  attemptsWeek: number;
  expiringSoon: number;
  planBreakdown: Record<string, number>;
  topRanking: { userId: string; name: string; email: string; xp: number; level: number; streak: number; currentSubject: string }[];
  recentLogins: { at: string; name: string; email: string; ip: string | null }[];
}

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  TRIAL: { label: "Trial", color: "bg-amber-500/15 text-amber-600" },
  ALUNO: { label: "Aluno", color: "bg-sky-500/15 text-sky-600" },
  TOTAL: { label: "Total", color: "bg-indigo-500/15 text-indigo-600" },
  PREMIUM: { label: "Premium", color: "bg-fuchsia-500/15 text-fuchsia-600" },
  FAMILIA: { label: "Família", color: "bg-rose-500/15 text-rose-600" },
  ANUAL: { label: "Anual", color: "bg-emerald-500/15 text-emerald-600" },
  EXPIRED: { label: "Expirado", color: "bg-gray-500/15 text-gray-600" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d as Stats))
      .catch(() => setStats(null));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold">📊 Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        <Stat label="Usuários" value={stats?.totalUsers ?? "—"} icon="👥" />
        <Stat label="Ativos" value={stats?.activeUsers ?? "—"} icon="✅" />
        <Stat label="Novos hoje" value={stats?.newToday ?? "—"} icon="🆕" />
        <Stat label="Tentativas hoje" value={stats?.attemptsToday ?? "—"} icon="📝" />
        <Stat label="Tentativas semana" value={stats?.attemptsWeek ?? "—"} icon="📅" />
        <Stat label="Expira em 7d" value={stats?.expiringSoon ?? "—"} icon="⏳" />
      </div>

      {stats?.planBreakdown && Object.keys(stats.planBreakdown).length > 0 && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
          <h2 className="mb-3 font-bold">📦 Distribuição de planos</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.planBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([plan, count]) => {
                const meta = PLAN_LABELS[plan] ?? { label: plan, color: "bg-gray-500/15 text-gray-600" };
                return (
                  <span
                    key={plan}
                    className={`rounded-full px-3 py-1 text-sm font-bold ${meta.color}`}
                  >
                    {meta.label}: {count}
                  </span>
                );
              })}
          </div>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">🏆 Top XP</h2>
            <Link href="/admin/usuarios" className="text-xs text-indigo-500">ver todos →</Link>
          </div>
          <div className="flex flex-col gap-1">
            {stats?.topRanking.length === 0 && <div className="text-sm text-[var(--muted)]">Nenhum usuário ainda.</div>}
            {stats?.topRanking.map((r, i) => (
              <Link key={r.userId} href={`/admin/aluno/${r.userId}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-[var(--bg)]">
                <span className="flex items-center gap-2">
                  <span className="w-5 text-right text-[var(--muted)]">{i + 1}</span>
                  <span className="font-semibold">{r.name}</span>
                  <span className="text-[var(--muted)]">· lvl {r.level}</span>
                </span>
                <span className="font-mono text-xs text-indigo-500">{r.xp} XP</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">🔑 Últimos logins</h2>
            <Link href="/admin/logs" className="text-xs text-indigo-500">ver tudo →</Link>
          </div>
          <div className="flex flex-col gap-1">
            {stats?.recentLogins.length === 0 && <div className="text-sm text-[var(--muted)]">Sem logins ainda.</div>}
            {stats?.recentLogins.slice(0, 8).map((l, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm">
                <span className="font-semibold">{l.name}</span>
                <span className="text-xs text-[var(--muted)]">{new Date(l.at).toLocaleString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="mb-3 font-bold">⚡ Ações rápidas</h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <QuickLink href="/admin/usuarios?new=1" emoji="➕" label="Novo usuário" />
          <QuickLink href="/admin/usuarios?import=1" emoji="📥" label="Importar CSV" />
          <QuickLink href="/admin/avisos" emoji="📢" label="Novo aviso" />
          <QuickLink href="/admin/escolas" emoji="🏫" label="Gestores Escola" />
          <QuickLink href="/admin/conteudo" emoji="🎬" label="Vídeo-aulas" />
          <QuickLink href="/admin/pagamentos" emoji="💳" label="Pagamentos" />
          <QuickLink href="/admin/ia" emoji="🤖" label="IA Config" />
          <QuickLink href="/admin/logs" emoji="📋" label="Logs" />
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-3">
      <div className="text-xs text-[var(--muted)]">{icon} {label}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function QuickLink({ href, emoji, label }: { href: string; emoji: string; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm font-semibold hover:bg-indigo-500/10">
      <span className="text-xl">{emoji}</span>
      {label}
    </Link>
  );
}
