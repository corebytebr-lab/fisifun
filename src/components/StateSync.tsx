"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/lib/store";

/**
 * Pulls server state on mount, then pushes localStorage state changes (debounced)
 * to /api/state. No-op when not authenticated (requests fail silently).
 */
export function StateSync() {
  const lastPushed = useRef<string>("");
  const initialized = useRef(false);
  const isPullingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        isPullingRef.current = true;
        const r = await fetch("/api/state", { cache: "no-store" });
        if (!r.ok) return;
        const d = await r.json();
        if (cancelled) return;
        if (d.state && typeof d.state === "object") {
          // Merge server state into local zustand
          useGame.setState(d.state, false);
        }
      } catch {
        /* ignore */
      } finally {
        isPullingRef.current = false;
        initialized.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const unsub = useGame.subscribe((state) => {
      if (!initialized.current || isPullingRef.current) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const blob = JSON.stringify(state);
        if (blob === lastPushed.current) return;
        lastPushed.current = blob;
        fetch("/api/state", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: state }),
        }).catch(() => {});
      }, 2500);
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsub();
    };
  }, []);

  return null;
}
