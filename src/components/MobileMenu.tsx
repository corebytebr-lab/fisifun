"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Settings, Shield, LogOut, Users, School } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMe } from "@/lib/useMe";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface MobileMenuProps {
  primary: NavItem[];
  extra: NavItem[];
}

export function MobileMenu({ primary, extra }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useMe();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] md:hidden"
      >
        <Menu size={16} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-[var(--bg-elev)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
              <span className="text-base font-extrabold">Menu</span>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--bg)]"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                Navegar
              </div>
              <div className="flex flex-col gap-1">
                {[...primary, ...extra].map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                        active
                          ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                          : "text-[var(--fg)] hover:bg-[var(--bg)]"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 mb-2 px-2 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                Conta
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  href="/configuracoes"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--fg)] hover:bg-[var(--bg)]"
                >
                  <Settings size={16} /> Configurações
                </Link>
                {user?.plan === "FAMILIA" && (
                  <Link
                    href="/familia"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--fg)] hover:bg-[var(--bg)]"
                  >
                    <Users size={16} /> Família
                  </Link>
                )}
                {(user?.role === "SCHOOL_MANAGER" || (user?.role === "ADMIN" && user?.schoolSlots != null)) && (
                  <Link
                    href="/escola"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-500/10"
                  >
                    <School size={16} /> Painel Escola
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-rose-500 hover:bg-rose-500/10"
                  >
                    <Shield size={16} /> Painel Admin
                  </Link>
                )}
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--muted)] hover:bg-[var(--bg)]"
                  >
                    <LogOut size={16} /> Sair
                  </button>
                </form>
              </div>
              {user && (
                <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-xs">
                  <div className="font-bold">{user.name ?? user.email}</div>
                  <div className="text-[10px] text-[var(--muted)]">{user.email}</div>
                  <div className="mt-1 text-[10px] text-[var(--muted)]">
                    Plano: <span className="font-bold text-[var(--fg)]">{user.runtime.effectivePlan}</span>
                    {user.runtime.expired && <span className="ml-1 text-rose-500">(expirado)</span>}
                  </div>
                </div>
              )}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
