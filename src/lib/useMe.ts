"use client";

import { useEffect, useState } from "react";

export interface MeUser {
  id: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  name: string | null;
  plan: string;
  planUntil: string | null;
  subjectsAllowed: string[];
  runtime: {
    plan: string;
    expired: boolean;
    effectivePlan: string;
    subjectsAllowed: string[];
    aiQuota: number;
  };
}

let cachedUser: MeUser | null | undefined = undefined;
type Listener = (u: MeUser | null) => void;
const listeners = new Set<Listener>();

async function fetchMe(): Promise<MeUser | null> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return null;
    const j = await res.json();
    return (j.user as MeUser) ?? null;
  } catch {
    return null;
  }
}

export function refreshMe(): Promise<MeUser | null> {
  return fetchMe().then((u) => {
    cachedUser = u;
    listeners.forEach((cb) => cb(u));
    return u;
  });
}

export function useMe(): { loading: boolean; user: MeUser | null } {
  const [user, setUser] = useState<MeUser | null>(cachedUser ?? null);
  const [loading, setLoading] = useState<boolean>(cachedUser === undefined);

  useEffect(() => {
    let alive = true;
    const cb: Listener = (u) => {
      if (!alive) return;
      setUser(u);
      setLoading(false);
    };
    listeners.add(cb);
    if (cachedUser === undefined) {
      refreshMe().catch(() => {
        if (alive) setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      alive = false;
      listeners.delete(cb);
    };
  }, []);

  return { loading, user };
}
