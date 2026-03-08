import {
    randInt,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "sequences-continue",
    label: "Continue Arithmetic Sequences",
    grades: [4, 5, 6],  // [easy, normal, hard]
    instruction(options = {}) {
        const dir = options.sequenceDirection || "mixed";
        const dirText = dir === "increasing" ? "increasing " : dir === "decreasing" ? "decreasing " : "";
        return `Find the next two terms of each ${dirText}arithmetic sequence.`;
    },
    printTitle() {
        return "Continue Arithmetic Sequences";
    },
    options: [
        {
            id: "sequenceDirection",
            label: "Direction:",
            type: "select",
            default: "mixed",
            values: [
                { value: "increasing", label: "Increasing only" },
                { value: "decreasing", label: "Decreasing only" },
                { value: "mixed", label: "Mixed" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const direction = options.sequenceDirection || "mixed";
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateContinue(rand, difficulty, direction));
        }
        return problems;
    },
};

function pickSign(rand, direction) {
    if (direction === "increasing") return 1;
    if (direction === "decreasing") return -1;
    return randInt(rand, 0, 1) === 0 ? 1 : -1;
}

function generateContinue(rand, difficulty, direction) {
    const sign = pickSign(rand, direction);
    let d, a1;
    if (difficulty === "easy") {
        d = randInt(rand, 2, 10) * sign;
        a1 = randInt(rand, 1, 20);
    } else if (difficulty === "normal") {
        d = randInt(rand, 2, 10) * sign;
        a1 = randInt(rand, 1, 30);
    } else {
        d = randInt(rand, 3, 15) * sign;
        a1 = randInt(rand, -10, 40);
    }

    const terms = [a1, a1 + d, a1 + 2 * d, a1 + 3 * d];
    const next = [a1 + 4 * d, a1 + 5 * d];

    const question = terms.map(formatNum).join(", ") + ", ___, ___";
    const answer = next.map(formatNum).join(", ");

    // Generate wrong answers
    const wrongAnswers = [];
    // Mistake 1: used wrong common difference (off by 1)
    const wrongD = d + (d > 0 ? -1 : 1);
    wrongAnswers.push(formatNum(a1 + 4 * wrongD) + ", " + formatNum(a1 + 5 * wrongD));
    // Mistake 2: only got one term right
    wrongAnswers.push(formatNum(a1 + 4 * d) + ", " + formatNum(a1 + 4 * d + d + 1));
    // Mistake 3: repeated the last term instead of continuing
    wrongAnswers.push(formatNum(a1 + 3 * d) + ", " + formatNum(a1 + 3 * d));

    return { question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
}

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}
