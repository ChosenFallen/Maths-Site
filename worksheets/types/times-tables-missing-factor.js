import { randInt } from "./utils.js";

export default {
    id: "times-tables-missing-factor",
    label: "Times Tables: Missing Factor",
    grades: [2, 3, 4],  // [easy, normal, hard]
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
    let missingFactor = randInt(rand, 1, maxFactor);
    let table = randInt(rand, 2, maxTable);

    // Swap if needed so the first number is always larger to avoid duplicate variations
    // (e.g., "? × 5 = 20" and "5 × ? = 20" would both have the same answer 4)
    if (missingFactor > table) {
        [missingFactor, table] = [table, missingFactor];
    }

    const product = table * missingFactor;

    // Always show the larger number first, missing factor second
    // This ensures "5 × ? = 20" not "? × 5 = 20"
    const question = `${table} × ? = ${product}`;

    return { question, answer: `${missingFactor}` };
}
