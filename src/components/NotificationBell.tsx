"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Notice {
  id: string;
  title: string;
  body: string;
  kind: string;
  createdAt: string;
}

const READ_KEY = "fisifun_notice_read_ids_v1";

function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set<string>(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => getReadIds());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/notices", { cache: "no-store" });
        if (!res.ok) return;
        const j = await res.json();
        if (alive) setNotices(j.notices ?? []);
      } catch {
        // ignore
      }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = notices.filter((n) => !readIds.has(n.id)).length;

  function markAllRead() {
    const next = new Set(readIds);
    notices.forEach((n) => next.add(n.id));
    setReadIds(next);
    saveReadIds(next);
  }

  function toggle() {
    setOpen((o) => {
      const next = !o;
      if (next) markAllRead();
      return next;
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Notificações"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg)] hover:bg-[var(--bg)]"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-32px)] rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold">Notificações</span>
            <span className="text-[10px] text-[var(--muted)]">{notices.length} aviso(s)</span>
          </div>
          {notices.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] p-4 text-center text-xs text-[var(--muted)]">
              Sem avisos por enquanto.
            </div>
          ) : (
            <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
              {notices.map((n) => {
                const color =
                  n.kind === "warning"
                    ? "border-amber-500/50 bg-amber-500/10"
                    : n.kind === "success"
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-sky-500/50 bg-sky-500/10";
                return (
                  <li key={n.id} className={`rounded-lg border p-2 text-xs ${color}`}>
                    <div className="font-bold">{n.title}</div>
                    <div className="mt-0.5 text-[var(--muted)]">{n.body}</div>
                    <div className="mt-1 text-[10px] text-[var(--muted)]">
                      {new Date(n.createdAt).toLocaleString("pt-BR")}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
