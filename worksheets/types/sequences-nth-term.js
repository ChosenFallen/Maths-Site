import { randInt } from "./utils.js";

export default {
    id: "sequences-nth-term",
    label: "Arithmetic Sequences: nth Term",
    grades: [5, 6, 7],  // [easy, normal, hard]
    instruction(options = {}) {
        const dir = options.sequenceDirection || "mixed";
        const dirText = dir === "increasing" ? "increasing " : dir === "decreasing" ? "decreasing " : "";
        return `Find an expression for the nth term of each ${dirText}arithmetic sequence.`;
    },
    printTitle() {
        return "Arithmetic Sequences: nth Term";
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
            problems.push(generateNthTerm(rand, difficulty, direction));
        }
        return problems;
    },
};

function pickSign(rand, direction) {
    if (direction === "increasing") return 1;
    if (direction === "decreasing") return -1;
    return randInt(rand, 0, 1) === 0 ? 1 : -1;
}

function generateNthTerm(rand, difficulty, direction) {
    const sign = pickSign(rand, direction);
    let d, c;
    if (difficulty === "easy") {
        d = randInt(rand, 2, 6) * sign;
        c = randInt(rand, 0, 12);
    } else if (difficulty === "normal") {
        d = randInt(rand, 2, 8) * sign;
        c = randInt(rand, -6, 12);
    } else {
        d = randInt(rand, 2, 8) * sign;
        c = randInt(rand, -10, 15);
    }

    // nth term = dn + c → terms: d+c, 2d+c, 3d+c, 4d+c
    const terms = [d + c, 2 * d + c, 3 * d + c, 4 * d + c];
    const question = terms.map(formatNum).join(", ") + ", ...   Find the nth term.";
    const answer = formatNthTerm(d, c);

    // Generate wrong answers
    const wrongAnswers = [];
    // Mistake 1: only the coefficient of n (missing constant)
    wrongAnswers.push(formatNthTerm(d, 0));
    // Mistake 2: wrong d (off by 1)
    const dWrong = d > 0 ? d - 1 : d + 1;
    if (dWrong !== 0) {
        wrongAnswers.push(formatNthTerm(dWrong, c));
    }
    // Mistake 3: first term instead of nth term
    wrongAnswers.push(formatNum(terms[0]));

    return {
        question,
        answer,
        wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answer).slice(0, 3),
    };
}

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}

function formatNthTerm(d, c) {
    let dPart;
    if (d === 1) dPart = "n";
    else if (d === -1) dPart = "−n";
    else if (d > 0) dPart = `${d}n`;
    else dPart = `−${Math.abs(d)}n`;

    if (c === 0) return dPart;
    if (c > 0) return `${dPart} + ${c}`;
    return `${dPart} − ${Math.abs(c)}`;
}
