import { randInt } from "./utils.js";

export default {
    id: "sequences-missing-term",
    label: "Missing Terms in Sequences",
    instruction(options = {}) {
        const type = options.sequenceType || "mixed";
        if (type === "arithmetic") return "Find the missing term in each arithmetic sequence.";
        if (type === "geometric") return "Find the missing term in each geometric sequence.";
        return "Find the missing term in each sequence.";
    },
    printTitle() {
        return "Missing Terms in Sequences";
    },
    options: [
        {
            id: "sequenceType",
            label: "Sequence type:",
            type: "select",
            default: "mixed",
            values: [
                { value: "arithmetic", label: "Arithmetic" },
                { value: "geometric", label: "Geometric" },
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
                difficulty !== "easy" && randInt(rand, 0, 2) === 0; // ~33% geometric for normal/hard
            problems.push(useGeometric
                ? generateGeometric(rand, difficulty)
                : generateArithmetic(rand, difficulty));
        }
        return problems;
    },
};

function generateArithmetic(rand, difficulty) {
    let d, a1, missingPos;

    if (difficulty === "easy") {
        d = randInt(rand, 2, 10);
        a1 = randInt(rand, 1, 20);
        missingPos = randInt(rand, 1, 2); // 2nd or 3rd term (0-indexed)
    } else if (difficulty === "normal") {
        const sign = randInt(rand, 0, 1) === 0 ? 1 : -1;
        d = randInt(rand, 2, 10) * sign;
        a1 = randInt(rand, 1, 30);
        missingPos = randInt(rand, 1, 3); // 2nd, 3rd, or 4th term
    } else {
        const sign = randInt(rand, 0, 1) === 0 ? 1 : -1;
        d = randInt(rand, 3, 15) * sign;
        a1 = randInt(rand, -10, 40);
        missingPos = randInt(rand, 1, 3);
    }

    const terms = [a1, a1 + d, a1 + 2 * d, a1 + 3 * d, a1 + 4 * d];
    return buildProblem(terms, missingPos);
}

function generateGeometric(rand, difficulty) {
    let r, a1, missingPos;

    if (difficulty === "easy") {
        r = randInt(rand, 2, 3);
        a1 = randInt(rand, 1, 5);
        missingPos = randInt(rand, 1, 2);
    } else if (difficulty === "normal") {
        r = randInt(rand, 2, 4);
        a1 = randInt(rand, 1, 6);
        missingPos = randInt(rand, 1, 3);
    } else {
        r = randInt(rand, 2, 5);
        a1 = randInt(rand, 1, 4);
        missingPos = randInt(rand, 1, 3);
    }

    const terms = [a1, a1 * r, a1 * r ** 2, a1 * r ** 3, a1 * r ** 4];
    return buildProblem(terms, missingPos);
}

function buildProblem(terms, missingPos) {
    const missingValue = terms[missingPos];
    const display = terms.map((t, i) => i === missingPos ? "___" : formatNum(t));
    const question = display.join(", ");
    const answer = formatNum(missingValue);
    return { question, answer };
}

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}
