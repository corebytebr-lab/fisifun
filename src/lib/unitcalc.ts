// Calculadora com unidades SI (básica).
// Suporta: +, -, *, /, ^, parênteses, números com unidade (ex. 10 N, 5 m, 2 kg).
// Unidades conhecidas viram dimensões e, quando possível, simplifica no final.

const BASE = ["kg", "m", "s", "A", "K", "mol", "cd"] as const;
type Base = (typeof BASE)[number];
type Dim = Record<Base, number>;

function zeroDim(): Dim {
  return { kg: 0, m: 0, s: 0, A: 0, K: 0, mol: 0, cd: 0 };
}

function eqDim(a: Dim, b: Dim): boolean {
  return BASE.every((k) => a[k] === b[k]);
}

function mulDim(a: Dim, b: Dim): Dim {
  const r = zeroDim();
  for (const k of BASE) r[k] = a[k] + b[k];
  return r;
}
function divDim(a: Dim, b: Dim): Dim {
  const r = zeroDim();
  for (const k of BASE) r[k] = a[k] - b[k];
  return r;
}
function powDim(a: Dim, n: number): Dim {
  const r = zeroDim();
  for (const k of BASE) r[k] = a[k] * n;
  return r;
}

// Unidades conhecidas → { factor para converter para SI base, dimensão resultante }
interface UnitDef {
  factor: number;
  dim: Dim;
}
function D(p: Partial<Dim>): Dim {
  return { ...zeroDim(), ...p };
}

const UNITS: Record<string, UnitDef> = {
  // base
  kg: { factor: 1, dim: D({ kg: 1 }) },
  g: { factor: 1e-3, dim: D({ kg: 1 }) },
  m: { factor: 1, dim: D({ m: 1 }) },
  cm: { factor: 0.01, dim: D({ m: 1 }) },
  mm: { factor: 1e-3, dim: D({ m: 1 }) },
  km: { factor: 1000, dim: D({ m: 1 }) },
  s: { factor: 1, dim: D({ s: 1 }) },
  min: { factor: 60, dim: D({ s: 1 }) },
  h: { factor: 3600, dim: D({ s: 1 }) },
  // derivadas
  N: { factor: 1, dim: D({ kg: 1, m: 1, s: -2 }) },
  J: { factor: 1, dim: D({ kg: 1, m: 2, s: -2 }) },
  W: { factor: 1, dim: D({ kg: 1, m: 2, s: -3 }) },
  Pa: { factor: 1, dim: D({ kg: 1, m: -1, s: -2 }) },
  Hz: { factor: 1, dim: D({ s: -1 }) },
  // ângulos (adimensionais)
  rad: { factor: 1, dim: zeroDim() },
};

function dimToString(d: Dim): string {
  // Tenta reconhecer unidades conhecidas primeiro
  const names: Record<string, Dim> = {
    N: UNITS.N.dim,
    J: UNITS.J.dim,
    W: UNITS.W.dim,
    Pa: UNITS.Pa.dim,
    Hz: UNITS.Hz.dim,
    "m/s": D({ m: 1, s: -1 }),
    "m/s²": D({ m: 1, s: -2 }),
    kg: D({ kg: 1 }),
    m: D({ m: 1 }),
    s: D({ s: 1 }),
  };
  for (const [name, nd] of Object.entries(names)) {
    if (eqDim(d, nd)) return name;
  }
  const parts: string[] = [];
  for (const k of BASE) {
    if (d[k] !== 0) {
      parts.push(d[k] === 1 ? k : `${k}^${d[k]}`);
    }
  }
  return parts.join("·") || "(adim)";
}

export interface Quantity {
  value: number;
  dim: Dim;
}

// Tokenizer
type Tok =
  | { type: "num"; value: number }
  | { type: "unit"; name: string }
  | { type: "op"; op: "+" | "-" | "*" | "/" | "^" | "(" | ")" };

function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  src = src.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "^" || ch === "(" || ch === ")") {
      toks.push({ type: "op", op: ch });
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < src.length && /[0-9.eE+-]/.test(src[j])) {
        // handle scientific notation: only accept +/- if preceded by e/E
        if ((src[j] === "+" || src[j] === "-") && !(j > i && /[eE]/.test(src[j - 1]))) break;
        j++;
      }
      const num = parseFloat(src.slice(i, j));
      toks.push({ type: "num", value: num });
      i = j;
      continue;
    }
    if (/[a-zA-Zµ°]/.test(ch)) {
      let j = i;
      while (j < src.length && /[a-zA-Zµ°²³]/.test(src[j])) j++;
      const name = src.slice(i, j);
      toks.push({ type: "unit", name });
      i = j;
      continue;
    }
    throw new Error(`Token inválido em: "...${src.slice(i, i + 10)}"`);
  }
  return toks;
}

// Parser recursivo descendente — avalia para Quantity
class Parser {
  tokens: Tok[];
  pos = 0;
  constructor(tokens: Tok[]) {
    this.tokens = tokens;
  }
  peek(): Tok | undefined {
    return this.tokens[this.pos];
  }
  eat(): Tok {
    return this.tokens[this.pos++];
  }
  matchOp(op: string): boolean {
    const t = this.peek();
    if (t && t.type === "op" && t.op === op) {
      this.eat();
      return true;
    }
    return false;
  }
  parseExpression(): Quantity {
    let left = this.parseTerm();
    while (true) {
      if (this.matchOp("+")) {
        const r = this.parseTerm();
        if (!eqDim(left.dim, r.dim)) throw new Error(`Não dá pra somar ${dimToString(left.dim)} + ${dimToString(r.dim)}.`);
        left = { value: left.value + r.value, dim: left.dim };
      } else if (this.matchOp("-")) {
        const r = this.parseTerm();
        if (!eqDim(left.dim, r.dim)) throw new Error(`Não dá pra subtrair ${dimToString(left.dim)} - ${dimToString(r.dim)}.`);
        left = { value: left.value - r.value, dim: left.dim };
      } else break;
    }
    return left;
  }
  parseTerm(): Quantity {
    let left = this.parsePow();
    while (true) {
      if (this.matchOp("*")) {
        const r = this.parsePow();
        left = { value: left.value * r.value, dim: mulDim(left.dim, r.dim) };
      } else if (this.matchOp("/")) {
        const r = this.parsePow();
        left = { value: left.value / r.value, dim: divDim(left.dim, r.dim) };
      } else break;
    }
    return left;
  }
  parsePow(): Quantity {
    let base = this.parseFactor();
    if (this.matchOp("^")) {
      const exp = this.parseFactor();
      if (!eqDim(exp.dim, zeroDim())) throw new Error("Expoente precisa ser adimensional.");
      base = { value: Math.pow(base.value, exp.value), dim: powDim(base.dim, exp.value) };
    }
    return base;
  }
  parseFactor(): Quantity {
    if (this.matchOp("(")) {
      const q = this.parseExpression();
      if (!this.matchOp(")")) throw new Error("Parêntese faltando.");
      // fatores com unidade depois do parêntese
      return this.attachUnit(q);
    }
    if (this.matchOp("-")) {
      const q = this.parseFactor();
      return { value: -q.value, dim: q.dim };
    }
    const t = this.peek();
    if (!t) throw new Error("Expressão incompleta.");
    if (t.type === "num") {
      this.eat();
      return this.attachUnit({ value: t.value, dim: zeroDim() });
    }
    if (t.type === "unit") {
      // número implícito 1 (ex "N/m")
      return this.attachUnit({ value: 1, dim: zeroDim() });
    }
    throw new Error(`Token inesperado: ${JSON.stringify(t)}`);
  }
  attachUnit(q: Quantity): Quantity {
    const t = this.peek();
    if (t && t.type === "unit") {
      this.eat();
      const def = UNITS[t.name];
      if (!def) throw new Error(`Unidade desconhecida: "${t.name}". Tenta kg, g, m, cm, km, s, min, h, N, J, W, Pa, Hz, rad.`);
      const val = q.value * def.factor;
      const dim = mulDim(q.dim, def.dim);
      // Ex "m/s" sem espaço -> check for follow-up ^ ou / ou *
      // Mas nosso parser já trata operadores depois. Só devolvemos a quantity com unidade aplicada.
      // Expoente direto na unidade (ex m²) já tratado pelo tokenizer? Vamos suportar m^2 etc depois do termo normal.
      return { value: val, dim };
    }
    return q;
  }
}

export function evaluateExpression(src: string): Quantity {
  const toks = tokenize(src);
  if (toks.length === 0) throw new Error("Expressão vazia.");
  const p = new Parser(toks);
  const q = p.parseExpression();
  if (p.peek()) throw new Error("Sobrou algo no final da expressão.");
  return q;
}

export function formatQuantity(q: Quantity): string {
  const val = q.value;
  let pretty: string;
  if (Math.abs(val) >= 1e4 || (Math.abs(val) < 1e-3 && val !== 0)) {
    pretty = val.toExponential(4).replace(/e([+-]?)(\d+)/, (_, s, d) => ` × 10^${s === "+" ? "" : s}${d}`);
  } else {
    pretty = Number(val.toPrecision(6)).toString();
  }
  const unit = dimToString(q.dim);
  return unit === "(adim)" ? pretty : `${pretty} ${unit}`;
}
