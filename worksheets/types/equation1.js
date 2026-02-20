import { randInt, difficultyRange } from "./utils.js";

export default {
    id: "equation1",
    label: "One-Step Equations",
    instruction() {
        return "Solve the one-step equations.";
    },
    printTitle() {
        return "One-Step Equations";
    },
    generate(rand, difficulty, count) {
        const X = "𝑥";
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
                    left = `${X} + ${a}`;
                    right = x + a;
                    break;
                case "−":
                    left = `${X} − ${a}`;
                    right = x - a;
                    break;
                case "×":
                    left = `${a}${X}`;
                    right = x * a;
                    break;
                case "÷":
                    x = x * a;
                    left = `${X} ÷ ${a}`;
                    right = x / a;
                    break;
            }

            const question = `${left} = ${right}`;
            problems.push({ question, answer: x, answerPrefix: `${X} = ` });
        }

        return problems;
    },
};
