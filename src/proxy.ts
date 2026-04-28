import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge, SESSION_COOKIE } from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/login", "/api/auth/login", "/api/auth/logout", "/api/health"]);
const PUBLIC_PREFIXES = ["/_next", "/favicon", "/icons", "/screenshots", "/manifest"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Normalize trailing slash so `/login/` matches `/login`
  const norm = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  if (PUBLIC_PATHS.has(norm)) return NextResponse.next();
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (pathname.includes(".") && !pathname.endsWith("/")) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifyTokenEdge(token);

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in users hitting /login go to home
  if (norm === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (session.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
