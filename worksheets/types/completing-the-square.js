import { randInt, renderKatex } from "./utils.js";

// Format "x² + bx + c" as LaTeX (the question expression)
function fmtQuestionLatex(b, c) {
    let s = "x^2";
    if (b === 1)       s += " + x";
    else if (b === -1) s += " - x";
    else if (b > 0)    s += ` + ${b}x`;
    else if (b < 0)    s += ` - ${Math.abs(b)}x`;
    if (c > 0)         s += ` + ${c}`;
    else if (c < 0)    s += ` - ${Math.abs(c)}`;
    return s;
}

// Format "x² + bx + c" as plain text
function fmtQuestionText(b, c) {
    let s = "x\u00B2";
    if (b === 1)       s += " + x";
    else if (b === -1) s += " \u2212 x";
    else if (b > 0)    s += ` + ${b}x`;
    else if (b < 0)    s += ` \u2212 ${Math.abs(b)}x`;
    if (c > 0)         s += ` + ${c}`;
    else if (c < 0)    s += ` \u2212 ${Math.abs(c)}`;
    return s;
}

// Format "(x + h)² + k" as LaTeX where h and k are integers
function fmtAnswerLatex(h, k) {
    const bracket = h > 0 ? `x + ${h}` : h < 0 ? `x - ${Math.abs(h)}` : "x";
    let s = `\\left(${bracket}\\right)^2`;
    if (k > 0)      s += ` + ${k}`;
    else if (k < 0) s += ` - ${Math.abs(k)}`;
    return s;
}

// Format "(x + h)² + k" as plain text where h and k are integers
function fmtAnswerText(h, k) {
    const bracket = h > 0 ? `x + ${h}` : h < 0 ? `x \u2212 ${Math.abs(h)}` : "x";
    let s = `(${bracket})\u00B2`;
    if (k > 0)      s += ` + ${k}`;
    else if (k < 0) s += ` \u2212 ${Math.abs(k)}`;
    return s;
}

// Format "(x ± p/2)² + k_num/4" as LaTeX where p is a signed odd integer
function fmtAnswerLatexHalf(p, c) {
    const pAbs = Math.abs(p);
    const bracket = p > 0 ? `x + \\frac{${pAbs}}{2}` : `x - \\frac{${pAbs}}{2}`;
    const kNum = 4 * c - p * p;  // always non-zero for odd p
    let s = `\\left(${bracket}\\right)^2`;
    if (kNum > 0)      s += ` + \\frac{${kNum}}{4}`;
    else if (kNum < 0) s += ` - \\frac{${Math.abs(kNum)}}{4}`;
    return s;
}

// Format "(x ± p/2)² + k_num/4" as plain text
function fmtAnswerTextHalf(p, c) {
    const pAbs = Math.abs(p);
    const bracket = p > 0 ? `x + ${pAbs}/2` : `x \u2212 ${pAbs}/2`;
    const kNum = 4 * c - p * p;
    let s = `(${bracket})\u00B2`;
    if (kNum > 0)      s += ` + ${kNum}/4`;
    else if (kNum < 0) s += ` \u2212 ${Math.abs(kNum)}/4`;
    return s;
}

function render(latex, fallback) {
    return renderKatex(latex) || fallback;
}

// ── Easy: h ∈ [1,5] positive, k ∈ [1,8] positive ────────────────────────────
// x² + 2hx + (h²+k) → (x+h)² + k  (all coefficients positive and clean)

function genEasy(rand) {
    const h = randInt(rand, 1, 5);
    const k = randInt(rand, 1, 8);
    const b = 2 * h;
    const c = h * h + k;

    return {
        questionHtml: render(fmtQuestionLatex(b, c), fmtQuestionText(b, c)),
        question: fmtQuestionText(b, c),
        answer:   fmtAnswerText(h, k),
        answerHtml: render(fmtAnswerLatex(h, k), fmtAnswerText(h, k)),
    };
}

// ── Normal: h ∈ [-7,7] \ {0}, k ∈ [-12,12] \ {0} ────────────────────────────
// Includes negative h (bracket "x − |h|") and negative k

function genNormal(rand) {
    const hSign = randInt(rand, 0, 1) === 0 ? 1 : -1;
    const h = hSign * randInt(rand, 1, 7);
    let k;
    do { k = randInt(rand, -12, 12); } while (k === 0);
    const b = 2 * h;
    const c = h * h + k;

    return {
        questionHtml: render(fmtQuestionLatex(b, c), fmtQuestionText(b, c)),
        question: fmtQuestionText(b, c),
        answer:   fmtAnswerText(h, k),
        answerHtml: render(fmtAnswerLatex(h, k), fmtAnswerText(h, k)),
    };
}

// ── Hard: b is odd → h = b/2 is a half-integer, k has denominator 4 ──────────
// x² + px + c → (x + p/2)² + (4c−p²)/4  where p is odd

const ODD_MAGS = [1, 3, 5, 7, 9];

function genHard(rand) {
    const pAbs  = ODD_MAGS[randInt(rand, 0, ODD_MAGS.length - 1)];
    const pSign = randInt(rand, 0, 1) === 0 ? 1 : -1;
    const p     = pSign * pAbs;  // this is b, the x coefficient

    // Pick c so that |k_num| = |4c − p²| ≤ 20 and c ≥ 0
    const cMin = Math.max(0, Math.ceil((pAbs * pAbs - 20) / 4));
    const cMax = Math.floor((pAbs * pAbs + 20) / 4);
    const c = randInt(rand, cMin, cMax);

    const b = p;

    return {
        questionHtml: render(fmtQuestionLatex(b, c), fmtQuestionText(b, c)),
        question: fmtQuestionText(b, c),
        answer:   fmtAnswerTextHalf(p, c),
        answerHtml: render(fmtAnswerLatexHalf(p, c), fmtAnswerTextHalf(p, c)),
    };
}

// ── Worksheet export ──────────────────────────────────────────────────────────

export default {
    id: "completing-the-square",
    label: "Completing the Square",
    grades: [7, 8, 9],  // [easy, normal, hard]
    instruction() {
        return "Write each expression in the form (x + p)² + q.";
    },
    printTitle() {
        return "Completing the Square";
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
