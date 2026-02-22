import { randInt, difficultyRange } from "./utils.js";

const X = "𝑥";

function generateOneStep(rand, difficulty) {
    const [min, max] = difficultyRange(difficulty);
    const ops = ["+", "−", "×", "÷"];
    const op = ops[randInt(rand, 0, ops.length - 1)];
    let x = randInt(rand, min, max);
    let a = randInt(rand, min, max);
    let left, right;

    switch (op) {
        case "+": left = `${X} + ${a}`; right = x + a; break;
        case "−": left = `${X} − ${a}`; right = x - a; break;
        case "×": left = `${a}${X}`;    right = x * a; break;
        case "÷": x = x * a; left = `${X} ÷ ${a}`; right = x / a; break;
    }

    return { question: `${left} = ${right}`, answer: x, answerPrefix: `${X} = ` };
}

function generateTwoStep(rand, difficulty) {
    const [min, max] = difficultyRange(difficulty);
    const a = randInt(rand, Math.max(2, min), Math.max(4, Math.min(12, max)));
    const x = randInt(rand, min, max);
    const b = randInt(rand, min, Math.min(20, max));
    const useMinus = randInt(rand, 0, 1) === 1;
    const c = useMinus ? a * x - b : a * x + b;
    const question = useMinus ? `${a}${X} − ${b} = ${c}` : `${a}${X} + ${b} = ${c}`;
    return { question, answer: x, answerPrefix: `${X} = ` };
}

export default {
    id: "equations",
    label: "Solving Equations",
    instruction(options = {}) {
        const mode = options.equationMode || "mixed";
        if (mode === "one") return "Solve the one-step equations.";
        if (mode === "two") return "Solve the two-step equations.";
        return "Solve the equations.";
    },
    printTitle(options = {}) {
        const mode = options.equationMode || "mixed";
        if (mode === "one") return "One-Step Equations";
        if (mode === "two") return "Two-Step Equations";
        return "Solving Equations";
    },
    options: [
        {
            id: "equationMode",
            label: "Equation steps:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "one",   label: "One step" },
                { value: "two",   label: "Two steps" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const mode = options.equationMode || "mixed";
        const problems = [];
        for (let i = 0; i < count; i++) {
            const useTwoStep = mode === "two" ? true : mode === "one" ? false : randInt(rand, 0, 1) === 0;
            problems.push(useTwoStep ? generateTwoStep(rand, difficulty) : generateOneStep(rand, difficulty));
        }
        return problems;
    },
};
