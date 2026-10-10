/* A tiny recursive-descent evaluator for the Zenith calculator.
   Supports + - * / ^ % ( ) unary minus, the functions sin cos tan asin acos
   atan log (base 10) ln sqrt exp, the constants pi and e, postfix factorial
   (!) and percent (%), and implicit multiplication (2pi, 2(3)). No eval. */

const FUNCS = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  log: Math.log10,
  ln: Math.log,
  sqrt: Math.sqrt,
  exp: Math.exp,
};

const CONSTS = { pi: Math.PI, e: Math.E };

function tokenize(input) {
  const s = input
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/√/g, 'sqrt')
    .replace(/π/g, 'pi');
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === ',') {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let num = '';
      while (i < s.length && /[0-9.]/.test(s[i])) num += s[i++];
      tokens.push({ t: 'num', v: parseFloat(num) });
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      let name = '';
      while (i < s.length && /[a-zA-Z]/.test(s[i])) name += s[i++];
      tokens.push({ t: 'id', v: name.toLowerCase() });
      continue;
    }
    if ('+-*/^%()!'.includes(c)) {
      tokens.push({ t: 'op', v: c });
      i++;
      continue;
    }
    throw new Error(`Unexpected character: ${c}`);
  }
  return tokens;
}

function parse(tokens) {
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseExpr() {
    let left = parseTerm();
    while (peek() && peek().t === 'op' && (peek().v === '+' || peek().v === '-')) {
      const op = next().v;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parseFactor();
    while (peek()) {
      const tk = peek();
      if (tk.t === 'op' && (tk.v === '*' || tk.v === '/')) {
        const op = next().v;
        const right = parseFactor();
        if (op === '*') left = left * right;
        else left = right === 0 ? NaN : left / right;
      } else if (tk.t === 'num' || tk.t === 'id' || (tk.t === 'op' && tk.v === '(')) {
        // implicit multiplication: 2pi, 2(3), 2sin(2)
        const right = parseFactor();
        left = left * right;
      } else break;
    }
    return left;
  }

  function parseFactor() {
    let left = parseUnary();
    while (peek() && peek().t === 'op' && peek().v === '^') {
      next();
      const right = parseUnary(); // right-associative
      left = Math.pow(left, right);
    }
    return left;
  }

  function parseUnary() {
    if (peek() && peek().t === 'op' && peek().v === '-') {
      next();
      return -parseUnary();
    }
    if (peek() && peek().t === 'op' && peek().v === '+') {
      next();
      return parseUnary();
    }
    return parsePostfix();
  }

  function parsePostfix() {
    let val = parsePrimary();
    while (peek() && peek().t === 'op' && (peek().v === '!' || peek().v === '%')) {
      const op = next().v;
      if (op === '!') {
        if (val < 0 || !Number.isInteger(val)) throw new Error('factorial domain');
        let f = 1;
        for (let k = 2; k <= val; k++) f *= k;
        val = f;
      } else {
        val = val / 100;
      }
    }
    return val;
  }

  function parsePrimary() {
    const tk = peek();
    if (!tk) throw new Error('unexpected end');
    if (tk.t === 'num') {
      next();
      return tk.v;
    }
    if (tk.t === 'op' && tk.v === '(') {
      next();
      const v = parseExpr();
      if (!peek() || peek().v !== ')') throw new Error('missing )');
      next();
      return v;
    }
    if (tk.t === 'id') {
      next();
      if (CONSTS[tk.v] !== undefined) return CONSTS[tk.v];
      if (FUNCS[tk.v]) {
        if (!peek() || peek().v !== '(') throw new Error('expected (');
        next();
        const arg = parseExpr();
        if (!peek() || peek().v !== ')') throw new Error('missing )');
        next();
        return FUNCS[tk.v](arg);
      }
      throw new Error(`unknown name: ${tk.v}`);
    }
    throw new Error('unexpected token');
  }

  const result = parseExpr();
  if (pos < tokens.length) throw new Error('trailing input');
  return result;
}

export function calcEval(input) {
  if (!input || !input.trim()) return 0;
  const tokens = tokenize(input);
  if (!tokens.length) return 0;
  return parse(tokens);
}