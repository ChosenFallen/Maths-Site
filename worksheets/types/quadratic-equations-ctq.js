import { randInt, renderKatex, formatQuadraticLatex, formatQuadraticText } from "./utils.js";

// LaTeX for "(x + h)² = k"
function fmtCtqLatex(h, k) {
    const bracket = h > 0 ? `x + ${h}` : h < 0 ? `x - ${Math.abs(h)}` : `x`;
    return `\\left(${bracket}\\right)^2 = ${k}`;
}

// Plain text for "(x + h)² = k"
function fmtCtqText(h, k) {
    const bracket = h > 0 ? `x + ${h}` : h < 0 ? `x \u2212 ${Math.abs(h)}` : `x`;
    return `(${bracket})\u00B2 = ${k}`;
}

// LaTeX for one surd root: -h ± d√k
function rootLatex(mh, dSign, d, k) {
    const sq = d === 1 ? `\\sqrt{${k}}` : `${d}\\sqrt{${k}}`;
    if (mh === 0) return dSign > 0 ? sq : `-${sq}`;
    return dSign > 0 ? `${mh} + ${sq}` : `${mh} - ${sq}`;
}

// Plain text for one surd root: -h ± √k
function rootText(mh, dSign, k) {
    const sq = `\u221a${k}`;
    const mhStr = mh < 0 ? `\u2212${Math.abs(mh)}` : `${mh}`;
    if (mh === 0) return dSign > 0 ? sq : `\u2212${sq}`;
    return dSign > 0 ? `${mhStr} + ${sq}` : `${mhStr} \u2212 ${sq}`;
}

function render(latex, fallback) {
    return renderKatex(latex) || fallback;
}

// ── Easy: (x + h)² = k, rational roots x = −h ± n ────────────────────────────

function genEasy(rand) {
    const h  = randInt(rand, -5, 5);
    const n  = randInt(rand, 1, 5);
    const k  = n * n;
    const r1 = -h + n;
    const r2 = -h - n;
    const lo = Math.min(r1, r2);
    const hi = Math.max(r1, r2);

    const ansStr = `x = ${lo} or x = ${hi}`;

    return {
        questionHtml: render(fmtCtqLatex(h, k), fmtCtqText(h, k)),
        question:     fmtCtqText(h, k),
        answer:       ansStr,
        answerHtml:   ansStr,
    };
}

// ── Normal: x² + bx + c = 0 (b even) → (x+h)² = k, surd answers ──────────────
// b = 2h, c = h² − k  →  (x+h)² = k  →  x = −h ± √k

const K_NORMAL = [2, 3, 5, 6, 7, 10, 11, 13];

function genNormal(rand) {
    const h  = randInt(rand, -5, 5);
    const k  = K_NORMAL[randInt(rand, 0, K_NORMAL.length - 1)];
    const b  = 2 * h;
    const c  = h * h - k;
    const mh = -h;   // center of roots

    const r1L = rootLatex(mh,  1, 1, k);
    const r2L = rootLatex(mh, -1, 1, k);
    const r1T = rootText(mh,  1, k);
    const r2T = rootText(mh, -1, k);
    const r1Html = render(`x = ${r1L}`, `x = ${r1T}`);
    const r2Html = render(`x = ${r2L}`, `x = ${r2T}`);

    return {
        questionHtml: render(formatQuadraticLatex(1, b, c), formatQuadraticText(1, b, c)),
        question:     formatQuadraticText(1, b, c),
        answer:       `x = ${r1T} or x = ${r2T}`,
        answerHtml:   `${r1Html} or ${r2Html}`,
    };
}

// ── Hard: ax² + bx + c = 0  (a ∈ {2,3}), rational roots ─────────────────────
// Divide by a → x² + (b/a)x + (c/a) = 0, then complete the square.
// Build with b = 2ah, c = a(h²−n²) → roots x = −h ± n.

function genHard(rand) {
    const a  = randInt(rand, 0, 1) === 0 ? 2 : 3;
    const h  = randInt(rand, -4, 4);
    const n  = randInt(rand, 1, 3);
    const b  = 2 * a * h;
    const c  = a * (h * h - n * n);
    const r1 = -h + n;
    const r2 = -h - n;
    const lo = Math.min(r1, r2);
    const hi = Math.max(r1, r2);

    const ansStr = `x = ${lo} or x = ${hi}`;

    return {
        questionHtml: render(formatQuadraticLatex(a, b, c), formatQuadraticText(a, b, c)),
        question:     formatQuadraticText(a, b, c),
        answer:       ansStr,
        answerHtml:   ansStr,
    };
}

// ── Worksheet export ──────────────────────────────────────────────────────────

export default {
    id: "quadratic-equations-ctq",
    label: "Quadratic Equations: Completing the Square",
    grades: [6, 7, 8],  // [easy, normal, hard]
    instruction() {
        return "Solve each equation by completing the square. Give exact answers.";
    },
    printTitle() {
        return "Quadratic Equations: Completing the Square";
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
