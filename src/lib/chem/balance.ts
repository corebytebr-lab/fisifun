// Balanceador de equações químicas usando matriz de coeficientes e RREF.
// Suporta forma "Fe + O2 -> Fe2O3" ou "Fe + O2 = Fe2O3".

import { parseFormula } from "./elements";

export interface BalanceResult {
  reactants: { formula: string; coef: number }[];
  products: { formula: string; coef: number }[];
}

export function balanceEquation(input: string): BalanceResult {
  const cleaned = input.replace(/=/g, "->").replace(/\s+/g, " ").trim();
  const sides = cleaned.split("->");
  if (sides.length !== 2) throw new Error("Formato esperado: A + B -> C + D");
  const left = sides[0].split("+").map((s) => s.trim()).filter(Boolean);
  const right = sides[1].split("+").map((s) => s.trim()).filter(Boolean);
  if (left.length === 0 || right.length === 0) throw new Error("Cada lado precisa de pelo menos um composto");

  const species = [...left, ...right];
  const counts = species.map((f) => parseFormula(f));
  const elements = new Set<string>();
  for (const c of counts) for (const k of c.keys()) elements.add(k);
  const elList = [...elements];
  const m = elList.length;
  const n = species.length;

  // Matriz [m × n] sendo: + para reagentes, - para produtos, igual a 0
  const A: number[][] = Array.from({ length: m }, () => Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const sign = j < left.length ? 1 : -1;
    for (const [el, q] of counts[j]) {
      const i = elList.indexOf(el);
      A[i][j] = sign * q;
    }
  }

  // Resolver A·x = 0 com x_n = 1 → x = -A⁻¹ b com b = última coluna
  // Estratégia: usar Gauss para encontrar solução não-trivial racional.
  const coefs = nullspaceInteger(A);
  // construir resultado
  return {
    reactants: left.map((f, i) => ({ formula: f, coef: coefs[i] })),
    products: right.map((f, i) => ({ formula: f, coef: coefs[left.length + i] })),
  };
}

/**
 * Encontra um vetor inteiro positivo no núcleo de A (sistema homogêneo).
 * Implementação simples por eliminação gaussiana fracionária e depois
 * normalizando para inteiros.
 */
function nullspaceInteger(A: number[][]): number[] {
  const m = A.length;
  const n = A[0].length;
  // Augmented copy with rationals (use Fraction)
  const M: Fraction[][] = A.map((row) => row.map((v) => fr(v)));

  // Forward elimination with row swaps
  let r = 0;
  const pivotCols: number[] = [];
  for (let c = 0; c < n && r < m; c++) {
    // find pivot
    let p = -1;
    for (let i = r; i < m; i++) {
      if (!isZero(M[i][c])) {
        p = i;
        break;
      }
    }
    if (p === -1) continue;
    [M[r], M[p]] = [M[p], M[r]];
    // eliminate
    for (let i = 0; i < m; i++) {
      if (i === r) continue;
      if (!isZero(M[i][c])) {
        const f = div(M[i][c], M[r][c]);
        for (let k = 0; k < n; k++) {
          M[i][k] = sub(M[i][k], mul(f, M[r][k]));
        }
      }
    }
    // normalize pivot to 1
    const piv = M[r][c];
    for (let k = 0; k < n; k++) M[r][k] = div(M[r][k], piv);
    pivotCols.push(c);
    r++;
  }

  // Free col = primeira coluna que não é pivô. Atribuir 1 e ler outras.
  const freeCol = (() => {
    for (let c = 0; c < n; c++) if (!pivotCols.includes(c)) return c;
    return n - 1;
  })();

  const x: Fraction[] = Array(n).fill(fr(0));
  x[freeCol] = fr(1);
  for (let i = 0; i < pivotCols.length; i++) {
    const c = pivotCols[i];
    // Linha i tem 1 em col c e fator M[i][freeCol]
    x[c] = neg(M[i][freeCol]);
  }

  // converte vetor para inteiros positivos: lcm dos denominadores
  let L = BigInt(1);
  for (const v of x) L = lcm(L, BigInt(v.den));
  const ints = x.map((v) => Number((BigInt(v.num) * L) / BigInt(v.den)));
  // tornar todos positivos (multiplicar por -1 se necessário)
  const allNeg = ints.every((v) => v <= 0);
  const signed = allNeg ? ints.map((v) => -v) : ints;
  if (signed.some((v) => v <= 0)) {
    // fallback: força 1 onde sair zero
    for (let i = 0; i < signed.length; i++) if (signed[i] <= 0) signed[i] = 1;
  }
  // simplificar pelo gcd
  const g = signed.reduce((a, b) => Number(gcd(BigInt(Math.abs(a)), BigInt(Math.abs(b)))), 0);
  const final = g > 0 ? signed.map((v) => v / g) : signed;
  return final;
}

interface Fraction {
  num: number;
  den: number;
}
function fr(n: number, d = 1): Fraction {
  if (d === 0) throw new Error("div 0");
  if (!Number.isInteger(n) || !Number.isInteger(d)) {
    // Aproximar — multiplicar até virar inteiro
    const SCALE = 1_000_000;
    n = Math.round(n * SCALE);
    d = Math.round(d * SCALE);
  }
  const g = Number(gcd(BigInt(Math.abs(n)), BigInt(Math.abs(d))));
  if (d < 0) { n = -n; d = -d; }
  return { num: g === 0 ? n : n / g, den: g === 0 ? d : d / g };
}
function add(a: Fraction, b: Fraction): Fraction { return fr(a.num * b.den + b.num * a.den, a.den * b.den); }
function sub(a: Fraction, b: Fraction): Fraction { return fr(a.num * b.den - b.num * a.den, a.den * b.den); }
function mul(a: Fraction, b: Fraction): Fraction { return fr(a.num * b.num, a.den * b.den); }
function div(a: Fraction, b: Fraction): Fraction { if (b.num === 0) throw new Error("div0"); return fr(a.num * b.den, a.den * b.num); }
function neg(a: Fraction): Fraction { return fr(-a.num, a.den); }
function isZero(a: Fraction): boolean { return a.num === 0; }
function gcd(a: bigint, b: bigint): bigint { const Z = BigInt(0); a = a < Z ? -a : a; b = b < Z ? -b : b; while (b !== Z) { [a, b] = [b, a % b]; } return a; }
function lcm(a: bigint, b: bigint): bigint { const Z = BigInt(0); if (a === Z || b === Z) return Z; return (a / gcd(a, b)) * b; }
