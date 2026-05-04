"use client";

import { useEffect, useState, useCallback } from "react";

interface Notice {
  id: string;
  title: string;
  body: string;
  kind: string;
  active: boolean;
  audience: string;
  createdAt: string;
}

export default function AvisosAdmin() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [form, setForm] = useState({ title: "", body: "", kind: "info", audience: "all", active: true });

  const reload = useCallback(async () => {
    const r = await fetch("/api/admin/notices");
    const d = await r.json();
    setNotices(d.notices ?? []);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const create = async () => {
    if (!form.title || !form.body) return;
    await fetch("/api/admin/notices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ title: "", body: "", kind: "info", audience: "all", active: true });
    reload();
  };

  const toggle = async (id: string, active: boolean) => {
    await fetch(`/api/admin/notices/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active }) });
    reload();
  };

  const del = async (id: string) => {
    if (!confirm("Apagar aviso?")) return;
    await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
    reload();
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold">📢 Avisos</h1>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="mb-3 font-bold">Novo aviso</h2>
        <div className="flex flex-col gap-2">
          <input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
          <textarea placeholder="Mensagem (markdown OK)" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={3} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-2">
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs">
              <option value="info">ℹ️ Info</option>
              <option value="warning">⚠️ Aviso</option>
              <option value="success">✅ Sucesso</option>
            </select>
            <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs">
              <option value="all">Todos</option>
              <option value="role:STUDENT">Só alunos</option>
              <option value="role:TEACHER">Só professores</option>
              <option value="role:ADMIN">Só admins</option>
            </select>
            <button onClick={create} className="ml-auto rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-bold text-white">Criar</button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="mb-3 font-bold">Avisos existentes</h2>
        <div className="flex flex-col gap-2">
          {notices.length === 0 && <div className="text-sm text-[var(--muted)]">Nenhum aviso.</div>}
          {notices.map((n) => (
            <div key={n.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{n.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${n.kind === "warning" ? "bg-amber-500/20 text-amber-700" : n.kind === "success" ? "bg-emerald-500/20 text-emerald-700" : "bg-sky-500/20 text-sky-700"}`}>{n.kind}</span>
                    <span className="text-xs text-[var(--muted)]">{n.audience}</span>
                  </div>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{n.body}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{new Date(n.createdAt).toLocaleString("pt-BR")}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggle(n.id, !n.active)} className={`rounded-lg px-2 py-1 text-xs font-semibold ${n.active ? "bg-emerald-500/20 text-emerald-700" : "bg-zinc-500/20 text-zinc-600"}`}>
                    {n.active ? "ativo" : "inativo"}
                  </button>
                  <button onClick={() => del(n.id)} className="rounded-lg border border-rose-500 bg-rose-500/10 px-2 py-1 text-xs text-rose-600">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
