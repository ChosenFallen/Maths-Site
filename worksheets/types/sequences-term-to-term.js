import { randInt } from "./utils.js";

export default {
    id: "sequences-term-to-term",
    label: "Term-to-Term Rules",
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
    return { question, answer };
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
    return { question, answer };
}

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}
