import { randInt, difficultyRange } from "./utils.js";

export default {
    id: "equation1",
    label: "One-Step Equations",
    generate(rand, difficulty, count) {
        const [min, max] = difficultyRange(difficulty);
        const ops = ["+", "−", "×", "÷"];
        const problems = [];

        for (let i = 0; i < count; i++) {
            const op = ops[randInt(rand, 0, ops.length - 1)];
            let x = randInt(rand, min, max);
            let a = randInt(rand, min, max);

            let left;
            let right;

            switch (op) {
                case "+":
                    left = `x + ${a}`;
                    right = x + a;
                    break;
                case "−":
                    left = `x − ${a}`;
                    right = x - a;
                    break;
                case "×":
                    left = `${a}x`;
                    right = x * a;
                    break;
                case "÷":
                    x = x * a;
                    left = `x ÷ ${a}`;
                    right = x / a;
                    break;
            }

            const question = `${left} = ${right}`;
            problems.push({ question, answer: x });
        }

        return problems;
    },
};
