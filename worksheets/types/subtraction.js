import { randInt, difficultyRange } from "./utils.js";

export default {
    id: "subtraction",
    label: "Subtraction",
    generate(rand, difficulty, count) {
        const [min, max] = difficultyRange(difficulty);
        const problems = [];
        for (let i = 0; i < count; i++) {
            let a = randInt(rand, min, max);
            let b = randInt(rand, min, max);
            if (a < b) {
                const temp = a;
                a = b;
                b = temp;
            }
            problems.push({
                question: `${a} − ${b} =`,
                answer: a - b,
            });
        }
        return problems;
    },
};
