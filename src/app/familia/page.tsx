"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Member {
  id: string;
  email: string;
  name: string;
  active: boolean;
  lastLoginAt: string | null;
  isOwner: boolean;
}

interface FamilyResp {
  ok: true;
  isFamily: boolean;
  isOwner?: boolean;
  ownerId?: string;
  members: Member[];
}

const MAX = 4;

export default function FamiliaPage() {
  const [data, setData] = useState<FamilyResp | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const reload = async () => {
    const r = await fetch("/api/family/members");
    if (r.ok) setData(await r.json());
  };
  useEffect(() => {
    reload();
  }, []);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const r = await fetch("/api/family/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) {
      setMsg(`Convite enviado para ${email}.`);
      setEmail("");
      setName("");
      reload();
    } else {
      setMsg(reasonLabel(d.reason));
    }
    setBusy(false);
  };

  const remove = async (memberId: string) => {
    if (!confirm("Remover este membro? Ele perde o acesso imediatamente.")) return;
    setBusy(true);
    await fetch("/api/family/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });
    setBusy(false);
    reload();
  };

  if (!data) return <div className="p-6 text-sm text-[var(--muted)]">Carregando…</div>;

  if (!data.isFamily) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-3 px-4 pt-4 md:pt-8">
        <h1 className="text-2xl font-extrabold">👨‍👩‍👧 Família</h1>
        <p className="text-sm text-[var(--muted)]">
          Sua conta não está num plano Família. Pra liberar até 4 contas Total numa só assinatura, contrate o plano Família em{" "}
          <Link href="/login" className="text-indigo-500 underline">
            /login
          </Link>{" "}
          ou fale com a equipe.
        </p>
      </div>
    );
  }

  const used = data.members.length;
  const slotsLeft = Math.max(0, MAX - used);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-4 md:pt-8">
      <h1 className="text-2xl font-extrabold">👨‍👩‍👧 Família</h1>
      <p className="text-sm text-[var(--muted)]">
        Sua família tem <strong>{used}</strong> de {MAX} contas ativas.{" "}
        {data.isOwner ? "Convide até " + slotsLeft + " membros." : "Você é membro da família."}
      </p>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="mb-3 font-bold">Membros</h2>
        <ul className="flex flex-col gap-2">
          {data.members.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm text-white">
                  {m.name[0]?.toUpperCase()}
                </span>
                <div>
                  <div className="text-sm font-bold">
                    {m.name} {m.isOwner && <span className="ml-1 rounded bg-amber-200 px-1 text-[10px] text-amber-900">Responsável</span>}
                  </div>
                  <div className="text-[11px] text-[var(--muted)]">{m.email}</div>
                </div>
              </div>
              {data.isOwner && !m.isOwner && (
                <button
                  onClick={() => remove(m.id)}
                  disabled={busy}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-500/20 disabled:opacity-50"
                >
                  Remover
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {data.isOwner && slotsLeft > 0 && (
        <form
          onSubmit={invite}
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4"
        >
          <h2 className="mb-3 font-bold">Convidar novo membro</h2>
          <div className="flex flex-col gap-2">
            <input
              required
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Nome (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={busy || !email}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2 text-sm font-bold text-white shadow disabled:opacity-50"
            >
              {busy ? "Enviando…" : "✉️ Enviar convite"}
            </button>
            {msg && <div className="text-xs">{msg}</div>}
          </div>
          <p className="mt-2 text-[11px] text-[var(--muted)]">
            O membro recebe um link por email pra entrar sem precisar criar senha.
          </p>
        </form>
      )}
    </div>
  );
}

function reasonLabel(reason?: string): string {
  switch (reason) {
    case "invalid-email":
      return "Email inválido.";
    case "not-family-owner":
      return "Apenas o responsável da família pode convidar.";
    case "limit-reached":
      return "Limite de 4 contas atingido. Remova alguém pra liberar slot.";
    case "already-member":
      return "Esse email já é membro da sua família.";
    case "email-already-registered":
      return "Esse email já tem uma conta no FisiFun. Não dá pra adicionar como membro de família.";
    default:
      return "Não consegui adicionar agora. Tente de novo.";
  }
}
