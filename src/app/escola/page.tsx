"use client";

import { useEffect, useMemo, useState } from "react";

interface Student {
  id: string;
  email: string;
  name: string;
  active: boolean;
  lastLoginAt: string | null;
  xp: number;
  totalStudyMin: number;
  achievements: number;
}

interface SchoolInfo {
  id: string;
  email: string;
  name: string;
  schoolSlots: number;
  schoolUntil: string | null;
  studentsCount: number;
  slotsLeft: number;
  expired: boolean;
}

interface SchoolResp {
  ok: true;
  isManager: boolean;
  info: SchoolInfo | null;
  students: Student[];
}

export default function EscolaPage() {
  const [data, setData] = useState<SchoolResp | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const reload = async () => {
    const r = await fetch("/api/school/students");
    if (r.ok) setData(await r.json());
  };
  useEffect(() => {
    reload();
  }, []);

  const ranked = useMemo(() => {
    if (!data) return [];
    const list = [...data.students].sort((a, b) => b.xp - a.xp);
    if (!filter) return list;
    const f = filter.toLowerCase();
    return list.filter((s) => s.name.toLowerCase().includes(f) || s.email.toLowerCase().includes(f));
  }, [data, filter]);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const r = await fetch("/api/school/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) {
      setMsg(`Convite enviado pra ${email}.`);
      setEmail("");
      setName("");
      reload();
    } else {
      setMsg(reasonLabel(d.reason));
    }
    setBusy(false);
  };

  const removeStudent = async (id: string) => {
    if (!confirm("Remover esse aluno? Ele perde o acesso.")) return;
    setBusy(true);
    await fetch("/api/school/invite", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: id }),
    });
    setBusy(false);
    reload();
  };

  if (!data) return <div className="p-6 text-sm text-[var(--muted)]">Carregando…</div>;

  if (!data.isManager || !data.info) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-3 px-4 pt-4 md:pt-8">
        <h1 className="text-2xl font-extrabold">🏫 Escola</h1>
        <p className="text-sm text-[var(--muted)]">
          Sua conta não é de gestor de escola. Pra contratar um pacote escolar, fale com a equipe pelo WhatsApp via /login.
        </p>
      </div>
    );
  }

  const info = data.info;
  const usagePct = Math.min(100, (info.studentsCount / info.schoolSlots) * 100);
  const daysLeft = info.schoolUntil
    ? Math.ceil((new Date(info.schoolUntil).getTime() - Date.now()) / 86400000)
    : null;

  const totalXp = data.students.reduce((s, x) => s + x.xp, 0);
  const totalMin = data.students.reduce((s, x) => s + x.totalStudyMin, 0);
  const totalAch = data.students.reduce((s, x) => s + x.achievements, 0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 pt-4 md:pt-8">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">🏫 Painel da Escola</h1>
        <p className="text-sm text-[var(--muted)]">
          Gestor: <strong>{info.name}</strong> · {info.email}
        </p>
      </header>

      {info.expired && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-300">
          ⚠️ Pacote expirado em {info.schoolUntil ? new Date(info.schoolUntil).toLocaleDateString("pt-BR") : "—"}. Os alunos perderam acesso. Renove com a equipe pelo WhatsApp.
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Slots usados" value={`${info.studentsCount}/${info.schoolSlots}`} progress={usagePct} />
        <Stat label="Pacote vence em" value={daysLeft != null ? `${daysLeft} dias` : "—"} />
        <Stat label="XP total da turma" value={totalXp.toLocaleString("pt-BR")} />
        <Stat label="Conquistas" value={totalAch.toLocaleString("pt-BR")} />
      </div>

      {!info.expired && info.slotsLeft > 0 && (
        <form onSubmit={invite} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
          <h2 className="mb-2 font-bold">Convidar aluno</h2>
          <div className="flex flex-wrap gap-2">
            <input
              required
              type="email"
              placeholder="aluno@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-[220px] rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Nome (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 min-w-[180px] rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={busy || !email}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              ✉️ Convidar
            </button>
          </div>
          {msg && <p className="mt-2 text-xs">{msg}</p>}
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            O aluno recebe um link por email. Restam <strong>{info.slotsLeft}</strong> slots no pacote.
          </p>
        </form>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold">Ranking dos alunos</h2>
          <input
            placeholder="Buscar nome ou email"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--muted)]">
                <th className="px-2 py-1">#</th>
                <th className="px-2 py-1">Aluno</th>
                <th className="px-2 py-1">XP</th>
                <th className="px-2 py-1">Tempo</th>
                <th className="px-2 py-1">Conq.</th>
                <th className="px-2 py-1">Último login</th>
                <th className="px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((s, idx) => (
                <tr key={s.id} className="border-t border-[var(--border)]">
                  <td className="px-2 py-1 font-bold">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}º`}
                  </td>
                  <td className="px-2 py-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-[10px] text-[var(--muted)]">{s.email}</div>
                  </td>
                  <td className="px-2 py-1">{s.xp.toLocaleString("pt-BR")}</td>
                  <td className="px-2 py-1">{formatMin(s.totalStudyMin)}</td>
                  <td className="px-2 py-1">{s.achievements}</td>
                  <td className="px-2 py-1 text-[11px] text-[var(--muted)]">
                    {s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleDateString("pt-BR") : "nunca"}
                  </td>
                  <td className="px-2 py-1">
                    <button
                      onClick={() => removeStudent(s.id)}
                      disabled={busy}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-700 hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {ranked.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-2 py-4 text-center text-xs text-[var(--muted)]">
                    Nenhum aluno cadastrado ainda. Convide o primeiro acima.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] text-[var(--muted)]">
          Tempo conta minutos de estudo registrados pelo app. Conquistas conta as conquistas únicas desbloqueadas.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, progress }: { label: string; value: string; progress?: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-3">
      <div className="text-[11px] text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-lg font-extrabold">{value}</div>
      {progress != null && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function formatMin(min: number) {
  if (!min) return "0min";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function reasonLabel(reason?: string): string {
  switch (reason) {
    case "invalid-email":
      return "Email inválido.";
    case "not-school-manager":
      return "Você não é gestor de escola.";
    case "package-expired":
      return "Pacote expirado. Renove com a equipe.";
    case "no-slots":
      return "Sem slots disponíveis. Aumente o pacote ou remova alunos.";
    case "already-member":
      return "Esse email já é aluno da sua escola.";
    case "email-already-registered":
      return "Esse email já tem conta no FisiFun.";
    default:
      return "Não consegui adicionar agora. Tente de novo.";
  }
}
