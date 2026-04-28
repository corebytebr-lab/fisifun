// Operações vetoriais em R² e R³.

export type Vec = number[]; // 2D ou 3D

export function add(a: Vec, b: Vec): Vec {
  const n = Math.max(a.length, b.length);
  return Array.from({ length: n }, (_, i) => (a[i] ?? 0) + (b[i] ?? 0));
}
export function sub(a: Vec, b: Vec): Vec {
  const n = Math.max(a.length, b.length);
  return Array.from({ length: n }, (_, i) => (a[i] ?? 0) - (b[i] ?? 0));
}
export function scale(k: number, a: Vec): Vec {
  return a.map((x) => k * x);
}
export function dot(a: Vec, b: Vec): number {
  const n = Math.max(a.length, b.length);
  let s = 0;
  for (let i = 0; i < n; i++) s += (a[i] ?? 0) * (b[i] ?? 0);
  return s;
}
export function norm(a: Vec): number {
  return Math.sqrt(dot(a, a));
}
export function cross(a: Vec, b: Vec): Vec {
  const ax = a[0] ?? 0, ay = a[1] ?? 0, az = a[2] ?? 0;
  const bx = b[0] ?? 0, by = b[1] ?? 0, bz = b[2] ?? 0;
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}
export function triple(a: Vec, b: Vec, c: Vec): number {
  return dot(a, cross(b, c));
}
export function angleRad(a: Vec, b: Vec): number {
  const c = dot(a, b) / (norm(a) * norm(b));
  return Math.acos(Math.max(-1, Math.min(1, c)));
}
export function angleDeg(a: Vec, b: Vec): number {
  return (angleRad(a, b) * 180) / Math.PI;
}
export function project(u: Vec, v: Vec): Vec {
  const k = dot(u, v) / dot(v, v);
  return scale(k, v);
}
export function unit(a: Vec): Vec {
  const n = norm(a);
  if (n === 0) return a.map(() => 0);
  return scale(1 / n, a);
}

export function fmt(v: Vec, p = 3): string {
  return `(${v.map((x) => prettyNumber(x, p)).join(", ")})`;
}
export function prettyNumber(x: number, p = 3): string {
  if (!Number.isFinite(x)) return "?";
  const r = Math.round(x * 1e10) / 1e10;
  if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r));
  return r.toFixed(p).replace(/\.?0+$/, "");
}
