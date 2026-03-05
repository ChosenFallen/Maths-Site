import { randInt, gcd, renderKatex, formatLinearLatex, formatLinearText } from "./utils.js";

// LaTeX for a linear expression "ax + b" used as a fraction numerator
function fmtL(a, b) {
    if (a === 0) return `${b}`;
    const xPart = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
    if (b === 0) return xPart;
    if (b > 0) return `${xPart} + ${b}`;
    return `${xPart} - ${Math.abs(b)}`;
}

// Plain text for "ax + b"
function fmtT(a, b) {
    if (a === 0) return `${b}`;
    const xPart = a === 1 ? "x" : a === -1 ? "\u2212x" : `${a}x`;
    if (b === 0) return xPart;
    if (b > 0) return `${xPart} + ${b}`;
    return `${xPart} \u2212 ${Math.abs(b)}`;
}

function render(latex, fallback) {
    return renderKatex(latex) || fallback;
}

// ── Easy: x/a ± x/b ──────────────────────────────────────────────────────────
// Coprime pairs [a, b] with a < b so subtraction gives positive result

const EASY_PAIRS = [
    [2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7], [3, 8],
    [3, 7], [4, 7], [5, 6], [5, 7], [4, 9], [2, 9], [5, 8], [7, 8],
];

function genEasy(rand) {
    const [a, b] = EASY_PAIRS[randInt(rand, 0, EASY_PAIRS.length - 1)];
    const op = randInt(rand, 0, 1) === 0 ? "+" : "-";

    // x/a ± x/b = (b ± a)x / (ab)
    const numCoeff = op === "+" ? (a + b) : (b - a);
    const denom = a * b;
    const g = gcd(numCoeff, denom);
    const sn = numCoeff / g;
    const sd = denom / g;

    const qLatex = `\\dfrac{x}{${a}} ${op} \\dfrac{x}{${b}}`;
    const aLatex = sd === 1 ? `${sn}x` : sn === 1 ? `\\dfrac{x}{${sd}}` : `\\dfrac{${sn}x}{${sd}}`;
    const qText  = `x/${a} ${op} x/${b}`;
    const aText  = sd === 1 ? `${sn}x` : `${sn}x/${sd}`;

    return {
        questionHtml: render(qLatex, qText),
        question: qText,
        answer: aText,
        answerHtml: render(aLatex, aText),
    };
}

// ── Normal: (x+p)/a ± (x+q)/b ────────────────────────────────────────────────
// Coprime denominators, linear numerators. b > a so subtraction xCoeff > 0.

const NORMAL_PAIRS = [[2, 3], [2, 5], [3, 4], [3, 5], [2, 7]];

function genNormal(rand) {
    const [a, b] = NORMAL_PAIRS[randInt(rand, 0, NORMAL_PAIRS.length - 1)];
    const p = randInt(rand, 1, 8);
    const q = randInt(rand, 1, 8);
    const op = randInt(rand, 0, 1) === 0 ? "+" : "-";

    // (x+p)/a ± (x+q)/b  →  (b(x+p) ± a(x+q)) / (ab)
    const xCoeff    = op === "+" ? (a + b) : (b - a);  // always > 0 since b > a
    const constPart = op === "+" ? (b * p + a * q) : (b * p - a * q);
    const denom     = a * b;

    const n1Latex = fmtL(1, p);
    const n2Latex = fmtL(1, q);
    const qLatex  = `\\dfrac{${n1Latex}}{${a}} ${op} \\dfrac{${n2Latex}}{${b}}`;
    const aLatex  = `\\dfrac{${fmtL(xCoeff, constPart)}}{${denom}}`;

    const n1Text = `x + ${p}`;
    const n2Text = `x + ${q}`;
    const qText  = `(${n1Text})/${a} ${op} (${n2Text})/${b}`;
    const aText  = `(${fmtT(xCoeff, constPart)})/${denom}`;

    return {
        questionHtml: render(qLatex, qText),
        question: qText,
        answer: aText,
        answerHtml: render(aLatex, aText),
    };
}

// ── Hard: A/(x+p) ± B/(x+q) ──────────────────────────────────────────────────
// Numeric numerators over linear denominators.

function genHard(rand) {
    const A = randInt(rand, 1, 5);
    const B = randInt(rand, 1, 5);
    const p = randInt(rand, 1, 7);
    let q   = randInt(rand, 1, 7);
    if (q === p) q = (q % 6) + 1;
    if (q === p) q = p + 1;
    const op = randInt(rand, 0, 1) === 0 ? "+" : "-";

    // A/(x+p) ± B/(x+q)  →  (A(x+q) ± B(x+p)) / ((x+p)(x+q))
    const xCoeff    = op === "+" ? (A + B) : (A - B);
    const constPart = op === "+" ? (A * q + B * p) : (A * q - B * p);

    const d1L = formatLinearLatex(p);
    const d2L = formatLinearLatex(q);
    const d1T = formatLinearText(p);
    const d2T = formatLinearText(q);

    const qLatex = `\\dfrac{${A}}{${d1L}} ${op} \\dfrac{${B}}{${d2L}}`;
    const aLatex = `\\dfrac{${fmtL(xCoeff, constPart)}}{(${d1L})(${d2L})}`;

    const qText = `${A}/(${d1T}) ${op} ${B}/(${d2T})`;
    const aText = `(${fmtT(xCoeff, constPart)})/((${d1T})(${d2T}))`;

    return {
        questionHtml: render(qLatex, qText),
        question: qText,
        answer: aText,
        answerHtml: render(aLatex, aText),
    };
}

// ── Worksheet export ──────────────────────────────────────────────────────────

export default {
    id: "algebraic-fractions-add-sub",
    label: "Algebraic Fractions: Add & Subtract",
    grades: [7, 8, 9],  // [easy, normal, hard]
    instruction() {
        return "Add or subtract the algebraic fractions. Give your answer as a single fraction.";
    },
    printTitle() {
        return "Algebraic Fractions: Add & Subtract";
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
