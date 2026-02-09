import { randInt, difficultyRange } from "./utils.js";

export default {
    id: "division",
    label: "Division",
    instruction() {
        return "Solve the following.";
    },
    generate(rand, difficulty, count) {
        const [min, max] = difficultyRange(difficulty);
        const problems = [];
        for (let i = 0; i < count; i++) {
            let b = randInt(rand, min, max);
            b = Math.max(1, b);
            let a = randInt(rand, min, max);
            a = a * b;
            problems.push({
                question: `${a} ÷ ${b} =`,
                answer: a / b,
            });
        }
        return problems;
    },
};
