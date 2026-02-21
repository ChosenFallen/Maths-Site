import { randInt } from "./utils.js";

export default {
    id: "times-tables-mixed-drill",
    label: "Times Tables: Mixed Drill",
    instruction() {
        return "Multiply the numbers from any times table.";
    },
    printTitle() {
        return "Times Tables: Mixed Drill";
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
        maxTable = 7;
        maxFactor = 10;
    } else if (difficulty === "normal") {
        minTable = 2;
        maxTable = 10;
        maxFactor = 12;
    } else {
        minTable = 2;
        maxTable = 12;
        maxFactor = 12;
    }

    const a = randInt(rand, minTable, maxTable);
    const b = randInt(rand, 1, maxFactor);
    const answer = a * b;

    const question = `${a} × ${b} =`;
    const answer_str = `${answer}`;

    return { question, answer: answer_str };
}
