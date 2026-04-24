import { clsx } from "./clsx";

export function ProgressBar({
  value,
  max,
  color = "indigo",
  showLabel = false,
  height = 8,
}: {
  value: number;
  max: number;
  color?: "indigo" | "emerald" | "amber" | "rose" | "sky";
  showLabel?: boolean;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  const colors: Record<string, string> = {
    indigo: "bg-gradient-to-r from-indigo-500 to-purple-500",
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-500",
    amber: "bg-gradient-to-r from-amber-500 to-yellow-500",
    rose: "bg-gradient-to-r from-rose-500 to-pink-500",
    sky: "bg-gradient-to-r from-sky-500 to-blue-500",
  };
  return (
    <div className="w-full">
      <div
        className="overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        style={{ height }}
      >
        <div
          className={clsx("h-full rounded-full transition-all duration-500", colors[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-[var(--muted)]">
          {Math.round(value)} / {max}
        </div>
      )}
    </div>
  );
}
