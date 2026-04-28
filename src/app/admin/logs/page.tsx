"use client";

import { useEffect, useState } from "react";

interface LogEntry {
  id: string;
  at: string;
  actorName: string | null;
  actorEmail: string | null;
  action: string;
  target: string | null;
  meta: unknown;
}
interface AuthEntry {
  id: string;
  at: string;
  email: string;
  success: boolean;
  ip: string | null;
}

export default function LogsPage() {
  const [audit, setAudit] = useState<LogEntry[]>([]);
  const [auth, setAuth] = useState<AuthEntry[]>([]);
  const [tab, setTab] = useState<"audit" | "auth">("auth");

  useEffect(() => {
    fetch("/api/admin/logs/audit").then((r) => r.json()).then((d) => setAudit(d.logs ?? []));
    fetch("/api/admin/logs/auth").then((r) => r.json()).then((d) => setAuth(d.logs ?? []));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-extrabold">📜 Logs</h1>
      <div className="flex gap-1 border-b border-[var(--border)]">
        <button onClick={() => setTab("auth")} className={`px-4 py-2 text-sm font-semibold ${tab === "auth" ? "border-b-2 border-indigo-500 text-indigo-500" : "text-[var(--muted)]"}`}>Logins</button>
        <button onClick={() => setTab("audit")} className={`px-4 py-2 text-sm font-semibold ${tab === "audit" ? "border-b-2 border-indigo-500 text-indigo-500" : "text-[var(--muted)]"}`}>Auditoria</button>
      </div>
      {tab === "auth" && (
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg)] text-left text-[var(--muted)]">
            <tr><th className="px-3 py-2">Quando</th><th className="px-3 py-2">E-mail</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">IP</th></tr>
          </thead>
          <tbody>
            {auth.map((l) => (
              <tr key={l.id} className="border-t border-[var(--border)]">
                <td className="px-3 py-2 text-xs">{new Date(l.at).toLocaleString("pt-BR")}</td>
                <td className="px-3 py-2">{l.email}</td>
                <td className="px-3 py-2">{l.success ? "✅" : "❌"}</td>
                <td className="px-3 py-2 text-xs text-[var(--muted)]">{l.ip ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tab === "audit" && (
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg)] text-left text-[var(--muted)]">
            <tr><th className="px-3 py-2">Quando</th><th className="px-3 py-2">Quem</th><th className="px-3 py-2">Ação</th><th className="px-3 py-2">Alvo</th></tr>
          </thead>
          <tbody>
            {audit.map((l) => (
              <tr key={l.id} className="border-t border-[var(--border)]">
                <td className="px-3 py-2 text-xs">{new Date(l.at).toLocaleString("pt-BR")}</td>
                <td className="px-3 py-2">{l.actorName ?? "?"}</td>
                <td className="px-3 py-2 font-mono text-xs">{l.action}</td>
                <td className="px-3 py-2 text-xs text-[var(--muted)]">{l.target ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
