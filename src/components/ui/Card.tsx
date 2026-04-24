import React from "react";
import { clsx } from "./clsx";

export function Card({
  className,
  children,
  padded = true,
  style,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  padded?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] shadow-sm",
        padded && "p-4 md:p-6",
        className,
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={clsx("text-xl font-bold tracking-tight", className)}>{children}</h2>;
}

export function CardSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-sm text-[var(--muted)]">{children}</p>;
}
