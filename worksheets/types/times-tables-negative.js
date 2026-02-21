import { randInt } from "./utils.js";

export default {
    id: "times-tables-negative",
    label: "Times Tables: With Negative Numbers",
    instruction() {
        return "Multiply numbers that may be positive or negative.";
    },
    printTitle() {
        return "Times Tables: With Negative Numbers";
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
    let minTable, maxTable, maxFactor;

    if (difficulty === "easy") {
        minTable = 2;
        maxTable = 6;
        maxFactor = 8;
    } else if (difficulty === "normal") {
        minTable = 2;
        maxTable = 10;
        maxFactor = 10;
    } else {
        minTable = 2;
        maxTable = 12;
        maxFactor = 12;
    }

    // Pick answer first - the product
    const a = randInt(rand, minTable, maxTable);
    const bAbs = randInt(rand, 1, maxFactor);

    // Randomly decide if one or both factors should be negative
    const negationType = randInt(rand, 0, 2);
    let aFinal = a;
    let bFinal = bAbs;

    if (negationType === 0) {
        // First factor negative
        aFinal = -a;
    } else if (negationType === 1) {
        // Second factor negative
        bFinal = -bAbs;
    } else {
        // Both negative (product is positive)
        aFinal = -a;
        bFinal = -bAbs;
    }

    const answer = aFinal * bFinal;

    const question = `${aFinal} × ${bFinal} =`;
    const answer_str = `${answer}`;

    return { question, answer: answer_str };
}
