"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  active: boolean;
  classGroup: string | null;
  plan?: string;
  planUntil?: string | null;
  subjectsAllowed?: string[];
  createdAt: string;
  lastLoginAt: string | null;
  state: { level: number; xp: number; streak: number; currentSubject: string } | null;
}

const PLAN_OPTIONS: { value: string; label: string; needSubject?: boolean; days: number | null }[] = [
  { value: "TRIAL", label: "Trial 3 dias (grátis)", days: 3 },
  { value: "ALUNO", label: "Aluno R$59,90/m (1 matéria)", needSubject: true, days: 30 },
  { value: "TOTAL", label: "Total R$99,90/m (4 matérias)", days: 30 },
  { value: "PREMIUM", label: "Premium R$149,90/m", days: 30 },
  { value: "ANUAL", label: "Anual R$799 (1 ano)", days: 365 },
  { value: "TRIENAL", label: "3 Anos R$1.997", days: 365 * 3 },
  { value: "FAMILIA", label: "Família R$199/m", days: 30 },
  { value: "ESCOLA", label: "Escola B2B", days: 30 },
  { value: "BLOCKED", label: "Bloqueado", days: null },
];

const SUBJECT_OPTS = [
  { value: "fisica", label: "Física" },
  { value: "quimica", label: "Química" },
  { value: "ga", label: "Geometria Analítica" },
  { value: "calculo", label: "Cálculo 1" },
];

export default function UsuariosAdmin() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  const reload = useCallback(async () => {
    const r = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`);
    const d = await r.json();
    setUsers(d.users ?? []);
  }, [q]);

  useEffect(() => { reload(); }, [reload]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">👥 Usuários</h1>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Buscar nome ou e-mail…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1.5 text-sm"
          />
          <button onClick={() => setShowImport(true)} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1.5 text-sm font-semibold">
            📥 Importar CSV
          </button>
          <button onClick={() => setShowNew(true)} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 text-sm font-bold text-white">
            ➕ Novo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--bg)]">
            <tr className="text-left text-[var(--muted)]">
              <th className="px-3 py-2 font-semibold">Nome</th>
              <th className="px-3 py-2 font-semibold">E-mail</th>
              <th className="px-3 py-2 font-semibold">Papel</th>
              <th className="px-3 py-2 font-semibold">Turma</th>
              <th className="px-3 py-2 font-semibold">XP</th>
              <th className="px-3 py-2 font-semibold">Último login</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-[var(--border)] hover:bg-[var(--bg)]">
                <td className="px-3 py-2 font-semibold">{u.name}</td>
                <td className="px-3 py-2 text-[var(--muted)]">{u.email}</td>
                <td className="px-3 py-2"><RoleBadge role={u.role} /></td>
                <td className="px-3 py-2 text-[var(--muted)]">{u.classGroup ?? "—"}</td>
                <td className="px-3 py-2 font-mono text-xs">{u.state?.xp ?? 0}</td>
                <td className="px-3 py-2 text-xs text-[var(--muted)]">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("pt-BR") : "nunca"}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${u.active ? "bg-emerald-500/20 text-emerald-700" : "bg-rose-500/20 text-rose-700"}`}>
                    {u.active ? "ativo" : "inativo"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <Link href={`/admin/aluno/${u.id}`} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs">Ver</Link>
                    <button onClick={() => setEditing(u)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs">Editar</button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={8} className="p-4 text-center text-sm text-[var(--muted)]">Nenhum usuário encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showNew && <NewUserModal onClose={() => { setShowNew(false); reload(); }} />}
      {showImport && <ImportCsvModal onClose={() => { setShowImport(false); reload(); }} />}
      {editing && <EditUserModal user={editing} onClose={() => { setEditing(null); reload(); }} />}
    </div>
  );
}

function RoleBadge({ role }: { role: "ADMIN" | "TEACHER" | "STUDENT" }) {
  const map = {
    ADMIN: { color: "bg-purple-500/20 text-purple-700", label: "Admin" },
    TEACHER: { color: "bg-amber-500/20 text-amber-700", label: "Professor" },
    STUDENT: { color: "bg-sky-500/20 text-sky-700", label: "Aluno" },
  };
  const m = map[role];
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${m.color}`}>{m.label}</span>;
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-[var(--bg-elev)] p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-extrabold">{title}</h2>
          <button onClick={onClose} className="text-2xl text-[var(--muted)]">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function NewUserModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    classGroup: "",
    plan: "TRIAL",
    subject: "fisica",
  });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const planInfo = PLAN_OPTIONS.find((p) => p.value === form.plan)!;

  const submit = async () => {
    setBusy(true); setErr(null);
    const payload: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      classGroup: form.classGroup,
      plan: form.plan,
    };
    if (planInfo.needSubject) payload.subjectsAllowed = [form.subject];
    const r = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setBusy(false);
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      setErr(d.error === "email-exists" ? "E-mail já cadastrado." : d.error === "weak-password" ? "Senha precisa de 6+ caracteres." : "Erro.");
      return;
    }
    onClose();
  };

  const genPwd = () => {
    const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 10; i++) s += a[Math.floor(Math.random() * a.length)];
    setForm((f) => ({ ...f, password: s }));
  };

  return (
    <ModalShell title="➕ Novo usuário" onClose={onClose}>
      <div className="flex flex-col gap-2">
        <Input label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Input label="E-mail" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <div>
          <label className="mb-1 block text-xs font-semibold">Senha</label>
          <div className="flex gap-2">
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
            <button type="button" onClick={genPwd} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold">Gerar</button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Papel</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm">
            <option value="STUDENT">Aluno</option>
            <option value="TEACHER">Professor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <Input label="Turma (opcional)" value={form.classGroup} onChange={(v) => setForm({ ...form, classGroup: v })} />
        <div>
          <label className="mb-1 block text-xs font-semibold">Plano</label>
          <select
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
          >
            {PLAN_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {planInfo.days != null && (
            <div className="mt-1 text-[10px] text-[var(--muted)]">
              Expira em {planInfo.days} dias. Você pode mudar/bloquear depois pela ficha do aluno.
            </div>
          )}
        </div>
        {planInfo.needSubject && (
          <div>
            <label className="mb-1 block text-xs font-semibold">Matéria liberada (plano Aluno só libera 1)</label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            >
              {SUBJECT_OPTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        )}
        {err && <div className="rounded-xl bg-rose-100 px-3 py-2 text-xs text-rose-700">{err}</div>}
        <button onClick={submit} disabled={busy} className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2 font-bold text-white disabled:opacity-50">
          {busy ? "Criando..." : "Criar"}
        </button>
      </div>
    </ModalShell>
  );
}

function EditUserModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const [form, setForm] = useState({
    name: user.name,
    role: user.role,
    active: user.active,
    classGroup: user.classGroup ?? "",
    password: "",
    plan: user.plan ?? "TRIAL",
    subject: user.subjectsAllowed?.[0] ?? "fisica",
    extendDays: 0,
  });
  const [busy, setBusy] = useState(false);
  const planInfo = PLAN_OPTIONS.find((p) => p.value === form.plan)!;

  const save = async () => {
    setBusy(true);
    const body: Record<string, unknown> = {
      name: form.name,
      role: form.role,
      active: form.active,
      classGroup: form.classGroup,
      plan: form.plan,
    };
    if (form.password) body.password = form.password;
    if (planInfo.needSubject) body.subjectsAllowed = [form.subject];
    if (form.extendDays > 0) body.extendDays = form.extendDays;
    const r = await fetch(`/api/admin/users/${user.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false);
    if (r.ok) onClose();
  };

  const del = async () => {
    if (!confirm(`Apagar ${user.email}?`)) return;
    setBusy(true);
    await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    setBusy(false);
    onClose();
  };

  return (
    <ModalShell title={`✏️ Editar — ${user.email}`} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <Input label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <div>
          <label className="mb-1 block text-xs font-semibold">Papel</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AdminUser["role"] })}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm">
            <option value="STUDENT">Aluno</option>
            <option value="TEACHER">Professor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <Input label="Turma" value={form.classGroup} onChange={(v) => setForm({ ...form, classGroup: v })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Conta ativa
        </label>
        <Input label="Nova senha (opcional)" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        <div>
          <label className="mb-1 block text-xs font-semibold">Plano atual</label>
          <select
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
          >
            {PLAN_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {user.planUntil && (
            <div className="mt-1 text-[10px] text-[var(--muted)]">
              Expira em {new Date(user.planUntil).toLocaleDateString("pt-BR")}
            </div>
          )}
        </div>
        {planInfo.needSubject && (
          <div>
            <label className="mb-1 block text-xs font-semibold">Matéria liberada</label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            >
              {SUBJECT_OPTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs font-semibold">Estender plano (dias)</label>
          <input
            type="number"
            min={0}
            value={form.extendDays}
            onChange={(e) => setForm({ ...form, extendDays: Number(e.target.value) || 0 })}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
          />
          <div className="mt-1 text-[10px] text-[var(--muted)]">Ex: 30 estende o vencimento em 30 dias.</div>
        </div>
        <div className="mt-2 flex gap-2">
          <button onClick={save} disabled={busy} className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2 font-bold text-white disabled:opacity-50">Salvar</button>
          <button onClick={del} disabled={busy} className="rounded-xl border border-rose-500 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-600">🗑️</button>
        </div>
      </div>
    </ModalShell>
  );
}

function ImportCsvModal({ onClose }: { onClose: () => void }) {
  const [csv, setCsv] = useState("name,email,password,role,classGroup\n");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ created: number; failed: { email: string; reason: string }[] } | null>(null);

  const submit = async () => {
    setBusy(true); setResult(null);
    const r = await fetch("/api/admin/users/import", { method: "POST", headers: { "Content-Type": "text/csv" }, body: csv });
    const d = await r.json();
    setBusy(false);
    setResult(d);
  };

  return (
    <ModalShell title="📥 Importar usuários (CSV)" onClose={onClose}>
      <p className="mb-2 text-xs text-[var(--muted)]">
        Cabeçalho: <code>name,email,password,role,classGroup</code>. <code>role</code> = STUDENT, TEACHER ou ADMIN.
        Se senha estiver vazia, será gerada e mostrada no resultado.
      </p>
      <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={10}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2 font-mono text-xs" />
      {result && (
        <div className="mt-2 rounded-xl bg-emerald-500/10 p-2 text-xs">
          ✅ {result.created} criados.
          {result.failed.length > 0 && (
            <div className="mt-1 text-rose-600">⚠️ {result.failed.length} falharam: {result.failed.map((f) => `${f.email} (${f.reason})`).join(", ")}</div>
          )}
        </div>
      )}
      <button onClick={submit} disabled={busy} className="mt-3 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2 font-bold text-white disabled:opacity-50">
        {busy ? "Importando..." : "Importar"}
      </button>
    </ModalShell>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold">
      {label}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-normal" />
    </label>
  );
}
