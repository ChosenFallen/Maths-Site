import { randInt } from "./utils.js";

export default {
    id: "times-tables-speed",
    label: "Times Tables: Speed Drill",
    instruction() {
        return "Multiply the numbers to find the answer.";
    },
    printTitle() {
        return "Times Tables: Speed Drill";
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
    let minTable, maxTable;

    if (difficulty === "easy") {
        minTable = 2;
        maxTable = 6;
    } else if (difficulty === "normal") {
        minTable = 7;
        maxTable = 12;
    } else {
        minTable = 2;
        maxTable = 12;
    }

    const a = randInt(rand, minTable, maxTable);
    const b = randInt(rand, 1, 12);
    const answer = a * b;

    const question = `${a} × ${b} =`;
    const answer_str = `${answer}`;

    return { question, answer: answer_str };
}
