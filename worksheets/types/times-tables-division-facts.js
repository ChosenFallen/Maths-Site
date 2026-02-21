import { randInt } from "./utils.js";

export default {
    id: "times-tables-division-facts",
    label: "Times Tables: Division Facts",
    instruction() {
        return "Divide the numbers using division facts (inverse of times tables).";
    },
    printTitle() {
        return "Times Tables: Division Facts";
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
    let minTable, maxTable, maxQuotient;

    if (difficulty === "easy") {
        minTable = 2;
        maxTable = 5;
        maxQuotient = 10;
    } else if (difficulty === "normal") {
        minTable = 6;
        maxTable = 10;
        maxQuotient = 12;
    } else {
        minTable = 2;
        maxTable = 12;
        maxQuotient = 12;
    }

    // Pick answer first: the quotient
    const quotient = randInt(rand, 1, maxQuotient);
    const divisor = randInt(rand, minTable, maxTable);
    const dividend = divisor * quotient;

    const question = `${dividend} ÷ ${divisor} =`;
    const answer = `${quotient}`;

    return { question, answer };
}
