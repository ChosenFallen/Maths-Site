import { randInt, difficultyRange } from "./utils.js";

export default {
    id: "multiplication",
    label: "Multiplication",
    instruction() {
        return "Solve the following.";
    },
    printTitle() {
        return "Multiplication";
    },
    generate(rand, difficulty, count) {
        const [min, max] = difficultyRange(difficulty);
        const problems = [];
        for (let i = 0; i < count; i++) {
            const a = randInt(rand, min, max);
            const b = randInt(rand, min, max);
            problems.push({
                question: `${a} × ${b} =`,
                answer: a * b,
            });
        }
        return problems;
    },
};
