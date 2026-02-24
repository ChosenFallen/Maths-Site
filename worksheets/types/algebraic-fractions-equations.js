import { randInt, renderKatex, formatLinearLatex, formatLinearText } from "./utils.js";

function render(latex, fallback) {
    return renderKatex(latex) || fallback;
}

// ── Easy: A/(x+p) = n ─────────────────────────────────────────────────────────
// Pick rp = r+p (so denominator at answer = rp > 0), then A = n·rp, r = rp−p.

function genEasy(rand) {
    const n  = randInt(rand, 1, 4);
    const p  = randInt(rand, 1, 6);
    const rp = randInt(rand, 1, 7);   // r + p; answer x = rp − p
    const A  = n * rp;
    const r  = rp - p;

    const qLatex = `\\frac{${A}}{${formatLinearLatex(p)}} = ${n}`;
    const qText  = `${A}/(${formatLinearText(p)}) = ${n}`;

    return {
        questionHtml: render(qLatex, qText),
        question:     qText,
        answer:       `x = ${r}`,
        answerHtml:   `x = ${r}`,
    };
}

// ── Normal: A/(x+p) = B/(x+q) ─────────────────────────────────────────────────
// Cross-multiply: A(x+q) = B(x+p)  →  (A−B)x = Bp−Aq  →  x = (Bp−Aq)/(A−B)
//
// Pick-answer-first: B/A = (q+r)/(p+r).
// With coprime pair (A,B), set p = kA−r and q = kB−r for some k ≥ 1.
// Then q−p = k(B−A) > 0, and (Bp−Aq)/(A−B) = (Bp−Aq)/(A−B) = r. ✓

const AB_PAIRS = [[2,3],[2,5],[3,4],[3,5],[4,7],[3,7],[2,7],[5,7]];

function genNormal(rand) {
    const [A, B] = AB_PAIRS[randInt(rand, 0, AB_PAIRS.length - 1)];
    const r      = randInt(rand, 0, 5);                         // answer x = r
    const kMin   = Math.max(1, Math.ceil((r + 1) / A));        // ensures p = kA−r ≥ 1
    const k      = kMin + randInt(rand, 0, 2);
    const p      = k * A - r;
    const q      = k * B - r;

    const qLatex = `\\frac{${A}}{${formatLinearLatex(p)}} = \\frac{${B}}{${formatLinearLatex(q)}}`;
    const qText  = `${A}/(${formatLinearText(p)}) = ${B}/(${formatLinearText(q)})`;

    return {
        questionHtml: render(qLatex, qText),
        question:     qText,
        answer:       `x = ${r}`,
        answerHtml:   `x = ${r}`,
    };
}

// ── Hard: x + A/(x+p) = B  (quadratic after clearing denominator) ─────────────
// Multiply by (x+p): x(x+p) + A = B(x+p)
//   x² + (p−B)x + (A−Bp) = 0
//
// Pick roots r1, r2 ≥ 0 first:
//   A = (r1+p)(r2+p),  B = r1+r2+p

function genHard(rand) {
    const p  = randInt(rand, 2, 4);
    const r1 = randInt(rand, 0, 2);
    const r2 = r1 + 1 + randInt(rand, 0, 2);   // r2 > r1, both ≥ 0

    const A = (r1 + p) * (r2 + p);
    const B = r1 + r2 + p;

    const qLatex = `x + \\frac{${A}}{${formatLinearLatex(p)}} = ${B}`;
    const qText  = `x + ${A}/(${formatLinearText(p)}) = ${B}`;
    const ansStr = `x = ${r1} or x = ${r2}`;

    return {
        questionHtml: render(qLatex, qText),
        question:     qText,
        answer:       ansStr,
        answerHtml:   ansStr,
    };
}

// ── Worksheet export ──────────────────────────────────────────────────────────

export default {
    id: "algebraic-fractions-equations",
    label: "Algebraic Fractions: Equations",
    grades: [7, 8, 9],  // [easy, normal, hard]
    instruction() {
        return "Solve each equation involving algebraic fractions.";
    },
    printTitle() {
        return "Algebraic Fractions: Equations";
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
