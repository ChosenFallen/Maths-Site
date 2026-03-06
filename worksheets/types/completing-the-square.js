import {
    randInt, renderKatex,
    generateNumericDistracters
} from "./utils.js";

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
    const bracket = p > 0 ? `x + \\dfrac{${pAbs}}{2}` : `x - \\dfrac{${pAbs}}{2}`;
    const kNum = 4 * c - p * p;  // always non-zero for odd p
    let s = `\\left(${bracket}\\right)^2`;
    if (kNum > 0)      s += ` + \\dfrac{${kNum}}{4}`;
    else if (kNum < 0) s += ` - \\dfrac{${Math.abs(kNum)}}{4}`;
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

    const answer = fmtAnswerText(h, k);
    const wrongAnswers = [];

    // Mistake 1: only the squared bracket, no constant
    wrongAnswers.push(fmtAnswerText(h, 0));

    // Mistake 2: wrong sign on h
    wrongAnswers.push(fmtAnswerText(-h, k));

    // Mistake 3: constant off by 1
    const kOff = k > 1 ? k - 1 : k + 1;
    wrongAnswers.push(fmtAnswerText(h, kOff));

    return {
        questionHtml: render(fmtQuestionLatex(b, c), fmtQuestionText(b, c)),
        question: fmtQuestionText(b, c),
        answer,
        answerHtml: render(fmtAnswerLatex(h, k), answer),
        wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answer).slice(0, 3),
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

    const answer = fmtAnswerText(h, k);
    const wrongAnswers = [];

    // Mistake 1: only the squared bracket, no constant
    wrongAnswers.push(fmtAnswerText(h, 0));

    // Mistake 2: wrong sign on h (flip the sign)
    wrongAnswers.push(fmtAnswerText(-h, k));

    // Mistake 3: wrong k (sign flipped or off by small amount)
    const kWrong = -k;
    wrongAnswers.push(fmtAnswerText(h, kWrong));

    return {
        questionHtml: render(fmtQuestionLatex(b, c), fmtQuestionText(b, c)),
        question: fmtQuestionText(b, c),
        answer,
        answerHtml: render(fmtAnswerLatex(h, k), answer),
        wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answer).slice(0, 3),
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
    const answer = fmtAnswerTextHalf(p, c);
    const wrongAnswers = [];

    // Mistake 1: only the squared bracket, no constant
    wrongAnswers.push(fmtAnswerTextHalf(p, 0));

    // Mistake 2: wrong sign on p
    wrongAnswers.push(fmtAnswerTextHalf(-p, c));

    // Mistake 3: using whole number instead of half: (x ± p)² instead of (x ± p/2)²
    const kNum = 4 * c - p * p;
    const wrongBracket = p > 0 ? `x + ${pAbs}` : `x \u2212 ${pAbs}`;
    let wrongHalf = `(${wrongBracket})\u00B2`;
    if (kNum > 0)      wrongHalf += ` + ${kNum}/4`;
    else if (kNum < 0) wrongHalf += ` \u2212 ${Math.abs(kNum)}/4`;
    wrongAnswers.push(wrongHalf);

    return {
        questionHtml: render(fmtQuestionLatex(b, c), fmtQuestionText(b, c)),
        question: fmtQuestionText(b, c),
        answer,
        answerHtml: render(fmtAnswerLatexHalf(p, c), answer),
        wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answer).slice(0, 3),
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
