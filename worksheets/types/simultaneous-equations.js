import {
    randInt, renderKatex,
    generateNumericDistracters
} from "./utils.js";

// Format a coefficient×variable term for LaTeX
// coeff=1→"x", coeff=-1→"-x", coeff=2→"2x"
function termL(coeff, v) {
    if (coeff === 1)  return v;
    if (coeff === -1) return `-${v}`;
    return `${coeff}${v}`;
}

// Format a coefficient×variable term for plain text (Unicode minus)
function termT(coeff, v) {
    if (coeff === 1)  return v;
    if (coeff === -1) return `\u2212${v}`;
    if (coeff < 0)    return `\u2212${-coeff}${v}`;
    return `${coeff}${v}`;
}

// Build a full equation LaTeX string: ax + by = c
function eqLatex(a, b, c) {
    const first = termL(a, "x");
    const second = b > 0 ? `+ ${termL(b, "y")}` : `- ${termL(-b, "y")}`;
    return `${first} ${second} = ${c}`;
}

// Build a full equation plain-text string: ax + by = c
function eqText(a, b, c) {
    const first = termT(a, "x");
    const second = b > 0 ? `+ ${termT(b, "y")}` : `\u2212 ${termT(-b, "y")}`;
    return `${first} ${second} = ${c}`;
}

// Format the question HTML: two equations stacked, each rendered with KaTeX
function questionHtml(a1, b1, c1, a2, b2, c2) {
    const eq1 = renderKatex(eqLatex(a1, b1, c1)) || eqText(a1, b1, c1);
    const eq2 = renderKatex(eqLatex(a2, b2, c2)) || eqText(a2, b2, c2);
    return `<div style="display:flex;flex-direction:column;gap:6px;">${eq1}${eq2}</div>`;
}

// ── Easy ──────────────────────────────────────────────────────────────────────
// One equation is always x + y = c. Other has one coefficient 2 or 3.
// Direct subtraction eliminates a variable.

const EASY_PAIRS = [
    [2, 1], [1, 2], [3, 1], [1, 3],
];

function genEasy(rand) {
    const x = randInt(rand, 1, 7);
    const y = randInt(rand, 1, 7);
    const [a2, b2] = EASY_PAIRS[randInt(rand, 0, EASY_PAIRS.length - 1)];
    const c1 = x + y;
    const c2 = a2 * x + b2 * y;
    return { a1: 1, b1: 1, c1, a2, b2, c2, x, y };
}

// ── Normal ────────────────────────────────────────────────────────────────────
// Both equations have coefficients 1–3. Need to multiply one to eliminate.

function genNormal(rand) {
    const x = randInt(rand, 1, 8);
    const y = randInt(rand, 1, 8);

    for (let attempt = 0; attempt < 50; attempt++) {
        const a1 = randInt(rand, 1, 3);
        const b1 = randInt(rand, 1, 3);
        const a2 = randInt(rand, 1, 3);
        const b2 = randInt(rand, 1, 3);
        // Non-degenerate and not trivially the same as each other
        if (a1 * b2 === a2 * b1) continue;
        // Avoid both equations being identical coefficient ratios
        const c1 = a1 * x + b1 * y;
        const c2 = a2 * x + b2 * y;
        return { a1, b1, c1, a2, b2, c2, x, y };
    }
    // Fallback
    return genEasy(rand);
}

// ── Hard ──────────────────────────────────────────────────────────────────────
// Coefficients up to 5, x and y can be negative or zero.

function genHard(rand) {
    const x = randInt(rand, -4, 9);
    const y = randInt(rand, -4, 9);
    // Avoid trivial (0,0)
    if (x === 0 && y === 0) return genHard(rand);

    for (let attempt = 0; attempt < 50; attempt++) {
        const a1 = randInt(rand, 1, 5);
        const b1 = randInt(rand, 1, 5);
        const a2 = randInt(rand, 1, 5);
        const b2 = randInt(rand, 1, 5);
        if (a1 * b2 === a2 * b1) continue;
        const c1 = a1 * x + b1 * y;
        const c2 = a2 * x + b2 * y;
        return { a1, b1, c1, a2, b2, c2, x, y };
    }
    return genNormal(rand);
}

// ── Worksheet export ──────────────────────────────────────────────────────────

export default {
    id: "simultaneous-equations",
    label: "Simultaneous Equations",
    grades: [7, 8, 9],  // [easy, normal, hard]
    instruction() {
        return "Solve each pair of simultaneous equations.";
    },
    printTitle() {
        return "Simultaneous Equations";
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
    const gen = difficulty === "easy" ? genEasy
              : difficulty === "normal" ? genNormal
              : genHard;

    const { a1, b1, c1, a2, b2, c2, x, y } = gen(rand);

    const qHtml = questionHtml(a1, b1, c1, a2, b2, c2);
    const qText = `${eqText(a1, b1, c1)} and ${eqText(a2, b2, c2)}`;

    const answerText = `x = ${x}, y = ${y}`;
    const answerLatex = `x = ${x},\\ y = ${y}`;
    const answerHtml = renderKatex(answerLatex) || answerText;

    return {
        questionHtml: qHtml,
        question: qText,
        answer: answerText,
        answerHtml,
    };
}
