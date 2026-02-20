import { randInt } from "./utils.js";

const SIGNS = ["<", "≤"];

export default {
    id: "compound-inequalities",
    label: "Compound Inequalities",
    instruction() {
        return "Solve each compound inequality.";
    },
    printTitle() {
        return "Compound Inequalities";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

// Format coefficient with variable, handling 1 specially
function formatCoeff(coeff) {
    if (coeff === 1) return "x";
    if (coeff === -1) return "−x";
    if (coeff < 0) return `−${Math.abs(coeff)}x`;
    return `${coeff}x`;
}

// Format expression: mx + k or mx or just x
function formatExpr(m, k) {
    const xPart = formatCoeff(m);
    if (k === 0) return xPart;
    if (k > 0) return `${xPart} + ${k}`;
    return `${xPart} − ${Math.abs(k)}`;
}

// Format a signed bound (can be negative)
function formatBound(n) {
    if (n < 0) return `−${Math.abs(n)}`;
    return `${n}`;
}

function generateProblem(rand, difficulty) {
    const signL = SIGNS[randInt(rand, 0, 1)];
    const signR = SIGNS[randInt(rand, 0, 1)];

    if (difficulty === "easy") {
        // a < x + k < b (addition only)
        let lo = randInt(rand, -3, 4);
        let hi = lo + randInt(rand, 1, 6);
        const k = randInt(rand, 1, 8);

        const a = lo + k;
        const b = hi + k;

        const question = `${formatBound(a)} ${signL} x + ${k} ${signR} ${formatBound(b)}`;
        const answer = `${formatBound(lo)} ${signL} x ${signR} ${formatBound(hi)}`;

        return { question, answer };
    } else if (difficulty === "normal") {
        // a < mx + k < b (multiplication and addition)
        const m = randInt(rand, 2, 4);
        let k = randInt(rand, -6, 6);
        let lo = randInt(rand, -2, 5);
        let hi = lo + randInt(rand, 1, 4);

        const a = m * lo + k;
        const b = m * hi + k;

        let question;
        if (k === 0) {
            question = `${formatBound(a)} ${signL} ${formatCoeff(m)} ${signR} ${formatBound(b)}`;
        } else {
            question = `${formatBound(a)} ${signL} ${formatExpr(m, k)} ${signR} ${formatBound(b)}`;
        }

        const answer = `${formatBound(lo)} ${signL} x ${signR} ${formatBound(hi)}`;

        return { question, answer };
    } else {
        // Hard: a < cx + d < b (larger coefficients, more variety)
        const c = randInt(rand, 2, 5);
        let d = randInt(rand, -8, 8);
        let lo = randInt(rand, -3, 5);
        let hi = lo + randInt(rand, 1, 5);

        const a = c * lo + d;
        const b = c * hi + d;

        let question;
        if (d === 0) {
            question = `${formatBound(a)} ${signL} ${formatCoeff(c)} ${signR} ${formatBound(b)}`;
        } else {
            question = `${formatBound(a)} ${signL} ${formatExpr(c, d)} ${signR} ${formatBound(b)}`;
        }

        const answer = `${formatBound(lo)} ${signL} x ${signR} ${formatBound(hi)}`;

        return { question, answer };
    }
}
