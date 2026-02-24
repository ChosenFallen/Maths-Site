import { randInt, gcd, renderKatex, formatLinearLatex, formatLinearText } from "./utils.js";

// LaTeX for "A * x^exp" (monomial)
function monoL(A, exp) {
    const xPart = exp === 0 ? "" : exp === 1 ? "x" : `x^{${exp}}`;
    if (!xPart) return `${A}`;
    if (A === 1) return xPart;
    return `${A}${xPart}`;
}

// Plain text for "A * x^exp"
function monoT(A, exp) {
    const SUP = ["\u2070", "\xB9", "\xB2", "\xB3", "\u2074"];
    const xPart = exp === 0 ? "" : exp === 1 ? "x" : `x${SUP[exp] || `^${exp}`}`;
    if (!xPart) return `${A}`;
    if (A === 1) return xPart;
    return `${A}${xPart}`;
}

// LaTeX for a fraction: \frac{numL}{denL}
function fracL(numL, denL) {
    return `\\frac{${numL}}{${denL}}`;
}

// LaTeX for "A(x + p)" — linear factor with coefficient
function linFactorL(A, p) {
    const lin = formatLinearLatex(p);  // "x + p" or "x - |p|"
    return A === 1 ? `(${lin})` : `${A}(${lin})`;
}

// Plain text for "A(x + p)"
function linFactorT(A, p) {
    const lin = formatLinearText(p);
    return A === 1 ? `(${lin})` : `${A}(${lin})`;
}

function render(latex, fallback) {
    return renderKatex(latex) || fallback;
}

// ── Easy: monomials, one shared coefficient cancels ───────────────────────────
//
// Multiply: (Ax^p / B) × (Bx^q / C) = Ax^(p+q) / C  (B cancels)
// Divide:   (Ax^p / B) ÷ (Cx^q / B) = Ax^(p-q) / C  (B cancels, p ≥ q)

function genEasy(rand) {
    const op = randInt(rand, 0, 1) === 0 ? "mult" : "div";
    const A = randInt(rand, 1, 5);
    const B = randInt(rand, 2, 6);  // shared factor, will cancel
    const C = randInt(rand, 2, 6);

    let n1L, n1T, d1L, d1T, n2L, n2T, d2L, d2T;
    let ansNum, ansDen, ansXExp;

    if (op === "mult") {
        const p = randInt(rand, 0, 2);
        const q = randInt(rand, 0, 2);
        n1L = monoL(A, p);  n1T = monoT(A, p);
        d1L = `${B}`;       d1T = `${B}`;
        n2L = monoL(B, q);  n2T = monoT(B, q);
        d2L = `${C}`;       d2T = `${C}`;
        ansXExp = p + q;
        ansNum  = A;
        ansDen  = C;
    } else {
        const p = randInt(rand, 1, 3);
        const q = randInt(rand, 0, p);  // q ≤ p so x power ≥ 0
        n1L = monoL(A, p);  n1T = monoT(A, p);
        d1L = `${B}`;       d1T = `${B}`;
        n2L = monoL(C, q);  n2T = monoT(C, q);
        d2L = `${B}`;       d2T = `${B}`;
        ansXExp = p - q;
        ansNum  = A;
        ansDen  = C;
    }

    const g = gcd(ansNum, ansDen);
    const sn = ansNum / g;
    const sd = ansDen / g;

    const opSymL = op === "mult" ? "\\times" : "\\div";
    const opSymT = op === "mult" ? "×" : "÷";

    const qLatex = `${fracL(n1L, d1L)} ${opSymL} ${fracL(n2L, d2L)}`;
    const qText  = `(${n1T})/(${d1T}) ${opSymT} (${n2T})/(${d2T})`;

    // Answer: sn * x^ansXExp / sd
    const ansNumL = monoL(sn, ansXExp);
    const ansNumT = monoT(sn, ansXExp);
    const aLatex = sd === 1 ? ansNumL : fracL(ansNumL, `${sd}`);
    const aText  = sd === 1 ? ansNumT : `${ansNumT}/${sd}`;

    return {
        questionHtml: render(qLatex, qText),
        question: qText,
        answer: aText,
        answerHtml: render(aLatex, aText),
    };
}

// ── Normal: linear factor cancels, integer answer ─────────────────────────────
//
// Multiply: [nd(x+p)/a] × [a / d(x+p)] = n
// Divide:   [na(x+p)/b] ÷ [a(x+p)/b]  = n

function genNormal(rand) {
    const op = randInt(rand, 0, 1) === 0 ? "mult" : "div";
    const n = randInt(rand, 2, 6);   // integer answer
    const p = randInt(rand, 1, 6);   // linear factor (x + p)

    let n1L, n1T, d1L, d1T, n2L, n2T, d2L, d2T;

    if (op === "mult") {
        const a = randInt(rand, 2, 5);  // cancels
        const d = randInt(rand, 2, 4);  // cancels
        // Fraction 1: nd(x+p) / a
        const coeff1 = n * d;
        n1L = `${coeff1}${formatLinearLatex(p).replace(/^x/, "(x")}`;
        // Simpler: use linFactorL
        n1L = linFactorL(coeff1, p);  n1T = linFactorT(coeff1, p);
        d1L = `${a}`;                  d1T = `${a}`;
        // Fraction 2: a / d(x+p)
        n2L = `${a}`;                  n2T = `${a}`;
        n2L = `${a}`;                  n2T = `${a}`;
        d2L = linFactorL(d, p);        d2T = linFactorT(d, p);
    } else {
        const a = randInt(rand, 2, 4);  // cancels
        const b = randInt(rand, 2, 5);  // shared denominator
        // Fraction 1: na(x+p) / b
        const coeff1 = n * a;
        n1L = linFactorL(coeff1, p);   n1T = linFactorT(coeff1, p);
        d1L = `${b}`;                   d1T = `${b}`;
        // Fraction 2: a(x+p) / b
        n2L = linFactorL(a, p);        n2T = linFactorT(a, p);
        d2L = `${b}`;                   d2T = `${b}`;
    }

    const opSymL = op === "mult" ? "\\times" : "\\div";
    const opSymT = op === "mult" ? "×" : "÷";

    const qLatex = `${fracL(n1L, d1L)} ${opSymL} ${fracL(n2L, d2L)}`;
    const qText  = `(${n1T})/(${d1T}) ${opSymT} (${n2T})/(${d2T})`;

    return {
        questionHtml: render(qLatex, qText),
        question: qText,
        answer: `${n}`,
        answerHtml: render(`${n}`, `${n}`),
    };
}

// ── Hard: quadratic numerator requires factoring, linear answer ───────────────
//
// (x² + (p+q)x + pq) / (x+r)  ×  (x+r) / (x+q)  =  x + p
//  numerator: (x+p)(x+q), factor (x+q) and (x+r) cancel
//
// OR divide form:
// (x² + (p+r)x + pr) / (x+q)  ÷  (x+p)  =  (x+r) / (x+q)

function genHard(rand) {
    const op = randInt(rand, 0, 1) === 0 ? "mult" : "div";

    if (op === "mult") {
        // (x² + (p+q)x + pq) / (x+r)  ×  (x+r) / (x+q)  =  x + p
        // Pick p, q, r all distinct positive integers
        const p = randInt(rand, 1, 5);
        let q = randInt(rand, 1, 5);
        if (q === p) q = (q % 4) + 2;
        let r = randInt(rand, 1, 5);
        if (r === p || r === q) r = (r % 3) + 3;

        const b = p + q;
        const c = p * q;

        // Fraction 1 numerator: x² + bx + c
        const quadLatex = `x^2 + ${b}x + ${c}`;
        const quadText  = `x\u00B2 + ${b}x + ${c}`;
        // Fraction 1 denominator: x + r
        const d1L = formatLinearLatex(r);
        const d1T = formatLinearText(r);
        // Fraction 2 numerator: x + r
        const n2L = `(${formatLinearLatex(r)})`;
        const n2T = `(${formatLinearText(r)})`;
        // Fraction 2 denominator: x + q
        const d2L = `(${formatLinearLatex(q)})`;
        const d2T = `(${formatLinearText(q)})`;

        const qLatex = `${fracL(quadLatex, d1L)} \\times ${fracL(n2L, d2L)}`;
        const qText  = `(${quadText})/(${d1T}) × (${n2T})/(${d2T})`;

        const ansL = formatLinearLatex(p);
        const ansT = formatLinearText(p);

        return {
            questionHtml: render(qLatex, qText),
            question: qText,
            answer: ansT,
            answerHtml: render(ansL, ansT),
        };
    } else {
        // (x² + (p+r)x + pr) / (x+q)  ÷  (x+p)  =  (x+r) / (x+q)
        const p = randInt(rand, 1, 5);
        let r = randInt(rand, 1, 5);
        if (r === p) r = (r % 4) + 2;
        let q = randInt(rand, 1, 5);
        if (q === p || q === r) q = (q % 3) + 3;

        const b = p + r;
        const c = p * r;

        const quadLatex = `x^2 + ${b}x + ${c}`;
        const quadText  = `x\u00B2 + ${b}x + ${c}`;
        const d1L = `(${formatLinearLatex(q)})`;
        const d1T = `(${formatLinearText(q)})`;
        const n2L = `(${formatLinearLatex(p)})`;
        const n2T = `(${formatLinearText(p)})`;

        const qLatex = `${fracL(quadLatex, d1L)} \\div ${n2L}`;
        const qText  = `(${quadText})/(${d1T}) ÷ ${n2T}`;

        const ansL = fracL(`(${formatLinearLatex(r)})`, `(${formatLinearLatex(q)})`);
        const ansT = `(${formatLinearText(r)})/(${formatLinearText(q)})`;

        return {
            questionHtml: render(qLatex, qText),
            question: qText,
            answer: ansT,
            answerHtml: render(ansL, ansT),
        };
    }
}

// ── Worksheet export ──────────────────────────────────────────────────────────

export default {
    id: "algebraic-fractions-mul-div",
    label: "Algebraic Fractions: Multiply & Divide",
    grades: [7, 8, 9],  // [easy, normal, hard]
    instruction() {
        return "Multiply or divide the algebraic fractions. Simplify your answer fully.";
    },
    printTitle() {
        return "Algebraic Fractions: Multiply & Divide";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty) {
    if (difficulty === "easy")   return genEasy(rand);
    if (difficulty === "normal") return genNormal(rand);
    return genHard(rand);
}
