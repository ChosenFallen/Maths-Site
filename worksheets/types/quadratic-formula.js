import { randInt, renderKatex, formatQuadraticLatex, formatQuadraticText } from "./utils.js";

// LaTeX for one root "h ± d√k" (dSign = +1 or −1)
function surdRootLatex(h, dSign, d, k) {
    const sq = d === 1 ? `\\sqrt{${k}}` : `${d}\\sqrt{${k}}`;
    if (h === 0) return dSign > 0 ? sq : `-\\sqrt{${k}}`;
    const sign = dSign > 0 ? "+" : "-";
    return `${h} ${sign} ${sq}`;
}

// Plain text for one root "h ± d√k"
function surdRootText(h, dSign, d, k) {
    const sq = d === 1 ? `\u221a${k}` : `${d}\u221a${k}`;
    const hStr = h < 0 ? `\u2212${Math.abs(h)}` : `${h}`;
    if (h === 0) return dSign > 0 ? sq : `\u2212${sq}`;
    return dSign > 0 ? `${hStr} + ${sq}` : `${hStr} \u2212 ${sq}`;
}

function buildSurdAnswer(h, d, k) {
    const r1L = surdRootLatex(h,  1, d, k);
    const r2L = surdRootLatex(h, -1, d, k);
    const r1T = surdRootText(h,  1, d, k);
    const r2T = surdRootText(h, -1, d, k);
    const r1Html = renderKatex(`x = ${r1L}`) || `x = ${r1T}`;
    const r2Html = renderKatex(`x = ${r2L}`) || `x = ${r2T}`;
    return {
        answerHtml: r1Html + `<br>or<br>` + r2Html,
        answer: `x = ${r1T}\nor x = ${r2T}`,
    };
}

// ── Easy: non-monic with rational roots ────────────────────────────────────────
// (x − r1)(ax − p) = 0  →  roots r1 (integer) and p/a (fraction)
// a ∈ {2, 3} so the equation doesn't factorise by inspection

const P_OPTIONS = {
    2: [1, 3, 5],       // coprime to 2
    3: [1, 2, 4, 5],    // coprime to 3
};

function genEasy(rand) {
    const a  = randInt(rand, 0, 1) === 0 ? 2 : 3;
    const r1 = randInt(rand, -4, 4);
    const pool = P_OPTIONS[a].filter(p => p !== a * r1);  // exclude double root
    const p  = pool[randInt(rand, 0, pool.length - 1)];

    // Expand (x − r1)(ax − p) = ax² − (p + ar1)x + pr1
    const b = -(p + a * r1);
    const c = p * r1;

    // Roots: p/a (positive fraction) and r1 (integer) — sort ascending for display
    const fracVal = p / a;
    const sorted = [
        { val: fracVal, latex: `\\dfrac{${p}}{${a}}`, text: `${p}/${a}` },
        { val: r1,      latex: `${r1}`,               text: r1 < 0 ? `\u2212${Math.abs(r1)}` : `${r1}` },
    ].sort((x, y) => x.val - y.val);

    const r1Html = renderKatex(`x = ${sorted[0].latex}`) || `x = ${sorted[0].text}`;
    const r2Html = renderKatex(`x = ${sorted[1].latex}`) || `x = ${sorted[1].text}`;

    return {
        questionHtml: renderKatex(formatQuadraticLatex(a, b, c)) || formatQuadraticText(a, b, c),
        question:     formatQuadraticText(a, b, c),
        answer:       `x = ${sorted[0].text}\nor x = ${sorted[1].text}`,
        answerHtml:   r1Html + `<br>or<br>` + r2Html,
    };
}

// ── Normal: monic, surd answers x = h ± √k ────────────────────────────────────
// a=1, b=−2h, c=h²−k  →  discriminant = 4k  →  x = h ± √k

const K_NORMAL = [2, 3, 5, 6, 7, 10, 11, 13];

function genNormal(rand) {
    const h = randInt(rand, -4, 4);
    const k = K_NORMAL[randInt(rand, 0, K_NORMAL.length - 1)];
    const { answerHtml, answer } = buildSurdAnswer(h, 1, k);

    return {
        questionHtml: renderKatex(formatQuadraticLatex(1, -2 * h, h * h - k)) || formatQuadraticText(1, -2 * h, h * h - k),
        question:     formatQuadraticText(1, -2 * h, h * h - k),
        answer,
        answerHtml,
    };
}

// ── Hard: monic, surd answers x = h ± 2√k ─────────────────────────────────────
// a=1, b=−2h, c=h²−4k  →  discriminant = 16k  →  x = h ± 2√k

const K_HARD = [2, 3, 5, 7];

function genHard(rand) {
    const h = randInt(rand, -4, 4);
    const k = K_HARD[randInt(rand, 0, K_HARD.length - 1)];
    const { answerHtml, answer } = buildSurdAnswer(h, 2, k);

    return {
        questionHtml: renderKatex(formatQuadraticLatex(1, -2 * h, h * h - 4 * k)) || formatQuadraticText(1, -2 * h, h * h - 4 * k),
        question:     formatQuadraticText(1, -2 * h, h * h - 4 * k),
        answer,
        answerHtml,
    };
}

// ── Worksheet export ──────────────────────────────────────────────────────────

export default {
    id: "quadratic-formula",
    label: "Quadratic Formula",
    grades: [8, 9, 9],  // [easy, normal, hard]
    instruction() {
        return "Solve each equation using the quadratic formula. Give exact answers.";
    },
    printTitle() {
        return "Quadratic Formula";
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
