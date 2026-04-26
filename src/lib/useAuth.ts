"use client";

import { useEffect, useState } from "react";
import {
  getFirebaseAuth,
  isFirebaseConfigured,
  onAuthStateChanged,
  type User,
} from "./firebase";

export type AuthState =
  | { status: "loading"; user: null; configured: boolean }
  | { status: "signed-in"; user: User; configured: true }
  | { status: "signed-out"; user: null; configured: boolean };

export function useAuth(): AuthState {
  const configured = isFirebaseConfigured();
  const [state, setState] = useState<AuthState>({
    status: configured ? "loading" : "signed-out",
    user: null,
    configured,
  });

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setState({ status: "signed-out", user: null, configured: false });
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setState({ status: "signed-in", user: u, configured: true });
      else setState({ status: "signed-out", user: null, configured: true });
    });
    return () => unsub();
  }, []);

  return state;
}
