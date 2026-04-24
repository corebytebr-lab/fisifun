"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Map as MapIcon,
  BookOpen,
  Trophy,
  User,
  Dumbbell,
  GraduationCap,
  Sparkles,
  Moon,
  Sun,
  Monitor,
  MessageCircleQuestion,
} from "lucide-react";
import { useGame } from "@/lib/store";
import { PomodoroFab } from "./Pomodoro";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useGame((s) => s.theme);
  const focusMode = useGame((s) => s.focusMode);
  const regen = useGame((s) => s.regenHeartsIfDue);

  useEffect(() => {
    setMounted(true);
    regen();
    const id = setInterval(regen, 60_000);
    return () => clearInterval(id);
  }, [regen]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "light") root.classList.remove("dark");
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.body.classList.toggle("focus-mode", focusMode);
  }, [focusMode, mounted]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-6">{children}</main>
      <BottomNav />
      <PomodoroFab />
    </div>
  );
}

const NAV = [
  { href: "/", label: "Início", icon: Home },
  { href: "/trilha", label: "Trilha", icon: MapIcon },
  { href: "/duvida", label: "Dúvida", icon: MessageCircleQuestion },
  { href: "/treino", label: "Treino", icon: Dumbbell },
  { href: "/revisao", label: "Revisão", icon: Sparkles },
  { href: "/formulas", label: "Fórmulas", icon: BookOpen },
  { href: "/prova", label: "Prova", icon: GraduationCap },
  { href: "/conquistas", label: "Conquistas", icon: Trophy },
  { href: "/perfil", label: "Perfil", icon: User },
];

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fisifun-chrome hidden w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg-elev)] md:block">
      <div className="sticky top-0 p-4">
        <Link href="/" className="mb-6 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl shadow-md">
            ⚛️
          </span>
          <span className="text-lg font-extrabold tracking-tight">FisiFun</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                    : "text-[var(--muted)] hover:bg-[var(--bg)]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6">
          <ThemeSwitcher />
        </div>
      </div>
    </aside>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const items = NAV.slice(0, 5);
  return (
    <nav className="fisifun-chrome fixed inset-x-0 bottom-0 z-20 flex items-stretch border-t border-[var(--border)] bg-[var(--bg-elev)] md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[0.7rem] font-medium ${
              active ? "text-indigo-600 dark:text-indigo-300" : "text-[var(--muted)]"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function ThemeSwitcher() {
  const theme = useGame((s) => s.theme);
  const setTheme = useGame((s) => s.setTheme);
  const opts: { v: typeof theme; icon: React.ComponentType<{ size?: number }> }[] = [
    { v: "light", icon: Sun },
    { v: "system", icon: Monitor },
    { v: "dark", icon: Moon },
  ];
  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] p-1">
      {opts.map((o) => {
        const Icon = o.icon;
        const active = theme === o.v;
        return (
          <button
            key={o.v}
            aria-label={o.v}
            onClick={() => setTheme(o.v)}
            className={`flex flex-1 items-center justify-center rounded-md px-2 py-1 text-xs font-medium transition ${
              active ? "bg-indigo-500/15 text-indigo-700 dark:text-indigo-200" : "text-[var(--muted)]"
            }`}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
