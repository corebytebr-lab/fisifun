import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-fallback-secret-change-me-32chars-min!!"
);
const COOKIE = "fisifun_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  uid: string;
  email: string;
  role: Role;
  name: string;
}

export async function createSession(data: SessionPayload) {
  const token = await new SignJWT(data as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const c = await cookies();
  c.delete(COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function verifyTokenEdge(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE;
