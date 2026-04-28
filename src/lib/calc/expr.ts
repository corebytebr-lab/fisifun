// Avaliador simples de expressões em função de x.
// Suporta: + - * / ^ ( ), funções (sin, cos, tan, asin, acos, atan, sqrt, exp, ln, log, abs),
// constantes (pi, e), e a variável x. Usado em plotter, limite, derivada numérica.

export type EvalFn = (x: number) => number;

export function compile(input: string): EvalFn {
  // Preprocess: troca ^ por **, junta variáveis dentro de funções, etc.
  // Substitui sintaxe matemática comum por JS.
  let src = input.trim();
  if (!src) throw new Error("Expressão vazia");

  // segurança: só permite caracteres seguros
  if (!/^[\sxXyYpiePIE0-9+\-*/^().,|<>=!a-zA-Z]+$/.test(src)) {
    throw new Error("Caracteres inválidos");
  }

  // Bloqueia identificadores perigosos
  const BLOCK = /\b(window|document|globalThis|process|require|import|eval|Function|fetch|XMLHttpRequest)\b/;
  if (BLOCK.test(src)) throw new Error("Identificador bloqueado");

  // Inserir multiplicação implícita: 2x → 2*x, x2 não é número, 2(x+1) → 2*(x+1)
  src = src.replace(/(\d|\))\s*([a-zA-Z(])/g, "$1*$2");
  src = src.replace(/([a-zA-Z)])\s*\(/g, (m, ch) => {
    // se ch é função conhecida ou variável adjacente
    if (/[a-z]/i.test(ch) && /^[a-zA-Z]+\(/.test(src.slice(src.indexOf(m)))) return m;
    return m;
  });

  // Substituir ^ por **
  src = src.replace(/\^/g, "**");

  // Mapas de funções → Math.fn
  const FUNCS: Record<string, string> = {
    sin: "Math.sin", cos: "Math.cos", tan: "Math.tan",
    asin: "Math.asin", acos: "Math.acos", atan: "Math.atan",
    sinh: "Math.sinh", cosh: "Math.cosh", tanh: "Math.tanh",
    sqrt: "Math.sqrt", exp: "Math.exp",
    ln: "Math.log", log: "Math.log10", log2: "Math.log2",
    abs: "Math.abs", sign: "Math.sign",
    floor: "Math.floor", ceil: "Math.ceil", round: "Math.round",
  };
  // Substitui nome de função (palavra seguida de '(')
  src = src.replace(/\b([a-zA-Z][a-zA-Z0-9_]*)\s*\(/g, (m, name) => {
    if (FUNCS[name]) return `${FUNCS[name]}(`;
    if (name === "x" || name === "pi" || name === "e") return m; // não é função
    throw new Error(`Função desconhecida: ${name}`);
  });

  // Constantes
  src = src.replace(/\bpi\b/g, "Math.PI");
  // 'e' como constante quando não dentro de outro identificador (evita collidir com Math.exp etc.)
  src = src.replace(/(^|[^a-zA-Z_.])(e)([^a-zA-Z_(0-9])/g, "$1Math.E$3");
  src = src.replace(/(^|[^a-zA-Z_.])(e)$/g, "$1Math.E");

  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const fn = new Function("x", `with(Math){return (${src});}`) as EvalFn;
    // teste com x=0
    fn(0);
    return fn;
  } catch (err) {
    throw new Error("Expressão inválida: " + (err as Error).message);
  }
}

export function safeEval(fn: EvalFn, x: number): number {
  try {
    const v = fn(x);
    if (typeof v !== "number") return NaN;
    return v;
  } catch {
    return NaN;
  }
}

// Derivada numérica via diferença central
export function numDerivative(fn: EvalFn, x: number, h = 1e-5): number {
  return (safeEval(fn, x + h) - safeEval(fn, x - h)) / (2 * h);
}

// Integral numérica (Simpson) para n par
export function simpson(fn: EvalFn, a: number, b: number, n = 200): number {
  if (n % 2) n++;
  const h = (b - a) / n;
  let s = safeEval(fn, a) + safeEval(fn, b);
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    s += (i % 2 ? 4 : 2) * safeEval(fn, x);
  }
  return (s * h) / 3;
}

// Limite numérico (com indicação de divergência/oscilação)
export function numericLimit(fn: EvalFn, a: number): { value: number | null; left: number; right: number; status: "converge" | "diverge" | "oscila" | "indefinido" } {
  const eps = [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6];
  const lefts = eps.map((e) => safeEval(fn, a - e));
  const rights = eps.map((e) => safeEval(fn, a + e));
  const left = lefts[lefts.length - 1];
  const right = rights[rights.length - 1];
  if (lefts.some((v) => !Number.isFinite(v)) || rights.some((v) => !Number.isFinite(v))) {
    return { value: null, left, right, status: "diverge" };
  }
  if (Math.abs(left - right) < 1e-3) {
    return { value: (left + right) / 2, left, right, status: "converge" };
  }
  // checa oscilação
  const span = Math.max(...lefts.concat(rights)) - Math.min(...lefts.concat(rights));
  if (span > 10) return { value: null, left, right, status: "oscila" };
  return { value: null, left, right, status: "indefinido" };
}
