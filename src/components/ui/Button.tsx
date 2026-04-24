"use client";

import React from "react";
import { clsx } from "./clsx";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-4";

  const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-400",
    secondary:
      "bg-[var(--bg-elev)] text-[var(--fg)] border border-[var(--border)] hover:bg-[var(--bg)] focus:ring-indigo-300",
    ghost:
      "bg-transparent text-[var(--fg)] hover:bg-[var(--bg)] focus:ring-indigo-300",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-300",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-300",
    outline:
      "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10",
  };

  return (
    <button className={clsx(base, sizes[size], variants[variant], className)} {...rest} />
  );
}
