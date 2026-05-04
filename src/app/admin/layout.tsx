import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") redirect("/login?from=/admin");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-elev)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 font-extrabold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm text-white">🛡️</span>
              <span>Admin</span>
            </Link>
            <nav className="hidden gap-1 md:flex">
              <NavLink href="/admin">Dashboard</NavLink>
              <NavLink href="/admin/usuarios">Usuários</NavLink>
              <NavLink href="/admin/pagamentos">Pagamentos</NavLink>
              <NavLink href="/admin/avisos">Avisos</NavLink>
              <NavLink href="/admin/ia">IA</NavLink>
              <NavLink href="/admin/conteudo">Conteúdo</NavLink>
              <NavLink href="/admin/logs">Logs</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden text-[var(--muted)] md:inline">{s.email}</span>
            <Link href="/" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold">
              ← App
            </Link>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600">Sair</button>
            </form>
          </div>
        </div>
        <div className="border-t border-[var(--border)] px-4 py-1 md:hidden">
          <nav className="flex gap-1 overflow-x-auto">
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/usuarios">Usuários</NavLink>
            <NavLink href="/admin/pagamentos">Pagamentos</NavLink>
            <NavLink href="/admin/avisos">Avisos</NavLink>
            <NavLink href="/admin/ia">IA</NavLink>
            <NavLink href="/admin/conteudo">Conteúdo</NavLink>
            <NavLink href="/admin/logs">Logs</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-[var(--bg)] whitespace-nowrap">
      {children}
    </Link>
  );
}
