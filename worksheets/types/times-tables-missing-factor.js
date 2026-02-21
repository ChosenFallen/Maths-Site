import { randInt } from "./utils.js";

export default {
    id: "times-tables-missing-factor",
    label: "Times Tables: Missing Factor",
    instruction() {
        return "Find the missing number in the multiplication.";
    },
    printTitle() {
        return "Times Tables: Missing Factor";
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
    let maxTable, maxFactor;

    if (difficulty === "easy") {
        maxTable = 5;
        maxFactor = 10;
    } else if (difficulty === "normal") {
        maxTable = 10;
        maxFactor = 12;
    } else {
        maxTable = 12;
        maxFactor = 12;
    }

    // Pick answer first: the missing factor
    const missingFactor = randInt(rand, 1, maxFactor);
    const table = randInt(rand, 2, maxTable);
    const product = table * missingFactor;

    // Randomly choose which position the missing number is in
    const position = randInt(rand, 0, 1);
    let question;

    if (position === 0) {
        question = `? × ${table} = ${product}`;
    } else {
        question = `${table} × ? = ${product}`;
    }

    return { question, answer: `${missingFactor}` };
}
