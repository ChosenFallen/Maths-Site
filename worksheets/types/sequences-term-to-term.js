import {
    randInt,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "sequences-term-to-term",
    label: "Term-to-Term Rules",
    grades: [4, 5, 6],  // [easy, normal, hard]
    instruction(options = {}) {
        const type = options.sequenceType || "mixed";
        if (type === "arithmetic") return "State the term-to-term rule for each arithmetic sequence.";
        if (type === "geometric") return "State the term-to-term rule for each geometric sequence.";
        return "State the term-to-term rule for each sequence.";
    },
    printTitle() {
        return "Term-to-Term Rules";
    },
    options: [
        {
            id: "sequenceType",
            label: "Sequence type:",
            type: "select",
            default: "mixed",
            values: [
                { value: "arithmetic", label: "Arithmetic (add/subtract)" },
                { value: "geometric", label: "Geometric (multiply/divide)" },
                { value: "mixed", label: "Mixed" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const type = options.sequenceType || "mixed";
        const problems = [];
        for (let i = 0; i < count; i++) {
            const useGeometric =
                type === "geometric" ? true :
                type === "arithmetic" ? false :
                difficulty !== "easy" && randInt(rand, 0, 1) === 0;
            problems.push(useGeometric
                ? generateGeometric(rand, difficulty)
                : generateArithmetic(rand, difficulty));
        }
        return problems;
    },
};

function generateArithmetic(rand, difficulty) {
    let d, a1;
    if (difficulty === "easy") {
        d = randInt(rand, 2, 10);
        a1 = randInt(rand, 1, 20);
    } else if (difficulty === "normal") {
        const sign = randInt(rand, 0, 1) === 0 ? 1 : -1;
        d = randInt(rand, 2, 10) * sign;
        a1 = randInt(rand, 1, 30);
    } else {
        const sign = randInt(rand, 0, 1) === 0 ? 1 : -1;
        d = randInt(rand, 2, 15) * sign;
        a1 = randInt(rand, -10, 40);
    }

    const terms = [a1, a1 + d, a1 + 2 * d, a1 + 3 * d, a1 + 4 * d];
    const question = terms.map(formatNum).join(", ") + ", ...";
    const answer = d > 0 ? `Add ${d}` : `Subtract ${Math.abs(d)}`;

    // Wrong answers: common mistakes
    const wrongAnswers = [];
    const wrongD = d > 0 ? d - 1 : d + 1; // off by 1
    wrongAnswers.push(wrongD > 0 ? `Add ${wrongD}` : `Subtract ${Math.abs(wrongD)}`);
    wrongAnswers.push(d > 0 ? `Subtract ${d}` : `Add ${Math.abs(d)}`); // wrong operation
    const wrongD2 = d > 0 ? d + 1 : d - 1; // off by 1 other direction
    wrongAnswers.push(wrongD2 > 0 ? `Add ${wrongD2}` : `Subtract ${Math.abs(wrongD2)}`);

    return { question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
}

function generateGeometric(rand, difficulty) {
    let r, a1;
    if (difficulty === "easy") {
        r = randInt(rand, 2, 4);
        a1 = randInt(rand, 1, 8);
    } else if (difficulty === "normal") {
        r = randInt(rand, 2, 5);
        a1 = randInt(rand, 1, 6);
    } else {
        // Hard: also include halving sequences
        if (randInt(rand, 0, 2) === 0) {
            // Halving: a1 divisible by 16 so 5 terms stay as whole numbers
            const multiples = [16, 32, 48, 64, 80, 96];
            a1 = multiples[randInt(rand, 0, multiples.length - 1)];
            r = 0.5;
        } else {
            r = randInt(rand, 2, 5);
            a1 = randInt(rand, 1, 5);
        }
    }

    const terms = [a1, a1 * r, a1 * r ** 2, a1 * r ** 3, a1 * r ** 4];
    const question = terms.map(n => `${n}`).join(", ") + ", ...";
    const answer = r === 0.5 ? "Divide by 2" : `Multiply by ${r}`;

    // Wrong answers: common mistakes
    const wrongAnswers = [];
    if (r === 0.5) {
        wrongAnswers.push("Multiply by 2"); // opposite operation
        wrongAnswers.push("Divide by 3");
        wrongAnswers.push("Subtract 2");
    } else {
        const wrongR = r > 1 ? r - 1 : r + 1;
        wrongAnswers.push(`Multiply by ${wrongR}`); // off by 1
        wrongAnswers.push(`Divide by ${r}`); // opposite operation
        const wrongR2 = r > 1 ? r + 1 : r - 1;
        wrongAnswers.push(`Multiply by ${wrongR2}`);
    }

    return { question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
}

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}
