"use client";

import { useEffect, useState } from "react";

interface Manager {
  id: string;
  email: string;
  name: string;
  schoolSlots: number;
  schoolUntil: string | null;
  studentsCount: number;
  active: boolean;
  lastLoginAt: string | null;
}

export default function AdminEscolasPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [slots, setSlots] = useState(30);
  const [duration, setDuration] = useState(30);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/school-managers");
    if (r.ok) {
      const d = await r.json();
      setManagers(d.managers ?? []);
    }
    setLoading(false);
  };
  useEffect(() => {
    reload();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const r = await fetch("/api/admin/school-managers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, slots, durationDays: duration }),
    });
    if (r.ok) {
      const d = await r.json();
      setMsg(d.created ? "Gestor criado e link enviado por email." : "Gestor existente atualizado com novos slots.");
      setEmail("");
      setName("");
      setShowForm(false);
      reload();
    } else {
      const d = await r.json().catch(() => ({}));
      setMsg(`Erro: ${d.error ?? "falha"}`);
    }
    setBusy(false);
  };

  const extend = async (id: string, days: number) => {
    await fetch(`/api/admin/school-managers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ extendDays: days }),
    });
    reload();
  };

  const setSlotsFor = async (id: string) => {
    const v = prompt("Quantos slots no total?");
    if (!v) return;
    const slots = parseInt(v, 10);
    if (!slots || slots < 1) return;
    await fetch(`/api/admin/school-managers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    });
    reload();
  };

  const revoke = async (id: string) => {
    if (!confirm("Revogar acesso desse gestor e dos alunos dele? Eles perdem o login.")) return;
    await fetch(`/api/admin/school-managers/${id}`, { method: "DELETE" });
    reload();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">🏫 Gestores de Escola</h1>
          <p className="text-sm text-[var(--muted)]">Crie pacotes B2B com X alunos e duração custom.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-sm font-bold text-white shadow"
        >
          {showForm ? "Fechar" : "+ Novo gestor"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold">Email do gestor</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold">Nome</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Cursinho XYZ"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold">Slots de aluno</span>
              <input
                type="number"
                min={1}
                value={slots}
                onChange={(e) => setSlots(parseInt(e.target.value, 10) || 1)}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold">Duração (dias)</span>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10) || 30)}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={busy || !email}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {busy ? "Criando…" : "Criar gestor + enviar email"}
            </button>
            {msg && <span className="text-xs">{msg}</span>}
          </div>
          <p className="mt-2 text-[11px] text-[var(--muted)]">
            O gestor recebe um link mágico por email pra entrar. Ele tem painel próprio em /escola/ pra convidar
            os alunos do pacote.
          </p>
        </form>
      )}

      {loading ? (
        <div className="text-sm text-[var(--muted)]">Carregando…</div>
      ) : managers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
          Nenhum gestor cadastrado. Crie o primeiro com o botão acima.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--muted)]">
                <th className="px-3 py-2">Gestor</th>
                <th className="px-3 py-2">Slots</th>
                <th className="px-3 py-2">Vence</th>
                <th className="px-3 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => {
                const expired = m.schoolUntil && new Date(m.schoolUntil).getTime() < Date.now();
                return (
                  <tr key={m.id} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2">
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-[10px] text-[var(--muted)]">{m.email}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div>{m.studentsCount}/{m.schoolSlots}</div>
                    </td>
                    <td className="px-3 py-2">
                      {m.schoolUntil ? (
                        <span className={expired ? "text-rose-600" : ""}>
                          {new Date(m.schoolUntil).toLocaleDateString("pt-BR")}
                          {expired && " (expirado)"}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        <button onClick={() => extend(m.id, 30)} className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-bold">
                          +30 dias
                        </button>
                        <button onClick={() => extend(m.id, 365)} className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-bold">
                          +1 ano
                        </button>
                        <button onClick={() => setSlotsFor(m.id)} className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-bold">
                          Slots
                        </button>
                        <button onClick={() => revoke(m.id)} className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          Revogar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
