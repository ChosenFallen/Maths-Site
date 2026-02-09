import { randInt, difficultyRange } from "./utils.js";

export default {
    id: "addition",
    label: "Addition",
    generate(rand, difficulty, count) {
        const [min, max] = difficultyRange(difficulty);
        const problems = [];
        for (let i = 0; i < count; i++) {
            const a = randInt(rand, min, max);
            const b = randInt(rand, min, max);
            problems.push({
                question: `${a} + ${b} =`,
                answer: a + b,
            });
        }
        return problems;
    },
};
