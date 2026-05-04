"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface UserDetail {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  classGroup: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  state: { level: number; xp: number; streak: number; coins: number; hearts: number; currentSubject: string; totalStudyMin: number } | null;
  _count: { attempts: number; wrongs: number; srsItems: number; professorRuns: number };
}

export default function AlunoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<UserDetail | null>(null);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`).then((r) => r.json()).then((d) => setUser(d.user));
  }, [id]);

  if (!user) return <div className="text-sm text-[var(--muted)]">Carregando…</div>;

  return (
    <div className="flex flex-col gap-4">
      <Link href="/admin/usuarios" className="text-sm text-[var(--muted)]">← Usuários</Link>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">{user.name}</h1>
          <p className="text-sm text-[var(--muted)]">{user.email} · {user.role} {user.classGroup && `· ${user.classGroup}`}</p>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs ${user.active ? "bg-emerald-500/20 text-emerald-700" : "bg-rose-500/20 text-rose-700"}`}>
          {user.active ? "ativo" : "inativo"}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Nível" value={user.state?.level ?? 1} />
        <Stat label="XP" value={user.state?.xp ?? 0} />
        <Stat label="Streak" value={user.state?.streak ?? 0} />
        <Stat label="Matéria" value={user.state?.currentSubject ?? "—"} />
        <Stat label="Tentativas" value={user._count.attempts} />
        <Stat label="Erros" value={user._count.wrongs} />
        <Stat label="SRS items" value={user._count.srsItems} />
        <Stat label="Aulas dadas" value={user._count.professorRuns} />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4 text-sm">
        <div><strong>Criado em:</strong> {new Date(user.createdAt).toLocaleString("pt-BR")}</div>
        <div><strong>Último login:</strong> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("pt-BR") : "nunca"}</div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-3">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-xl font-extrabold">{value}</div>
    </div>
  );
}
