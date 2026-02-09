import { randInt, difficultyRange } from "./utils.js";

export default {
    id: "equation2",
    label: "Two-Step Equations",
    instruction() {
        return "Solve the two-step equations.";
    },
    generate(rand, difficulty, count) {
        const X = "𝑥";
        const [min, max] = difficultyRange(difficulty);
        const problems = [];

        for (let i = 0; i < count; i++) {
            const a = randInt(rand, Math.max(2, min), Math.max(4, Math.min(12, max)));
            const x = randInt(rand, min, max);
            const b = randInt(rand, min, Math.min(20, max));

            const useMinus = randInt(rand, 0, 1) === 1;
            const c = useMinus ? a * x - b : a * x + b;

            const question = useMinus
                ? `${a}${X} − ${b} = ${c}`
                : `${a}${X} + ${b} = ${c}`;

            problems.push({ question, answer: x, answerPrefix: `→ ${X} = ` });
        }

        return problems;
    },
};
