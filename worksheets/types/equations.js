import { randInt, difficultyRange, renderKatex } from "./utils.js";

function generateOneStep(rand, difficulty) {
    const [min, max] = difficultyRange(difficulty);
    const ops = ["+", "−", "×", "÷"];
    const op = ops[randInt(rand, 0, ops.length - 1)];
    let x = randInt(rand, min, max);
    let a = randInt(rand, min, max);
    let left, right, latex;

    switch (op) {
        case "+": left = `x + ${a}`; latex = `x + ${a}`; right = x + a; break;
        case "−": left = `x − ${a}`; latex = `x - ${a}`; right = x - a; break;
        case "×": left = `${a}x`; latex = `${a}x`; right = x * a; break;
        case "÷": x = x * a; left = `x ÷ ${a}`; latex = `x / ${a}`; right = x / a; break;
    }

    const question = `${left} = ${right}`;
    const questionLatex = `${latex} = ${right}`;
    const questionHtml = renderKatex(questionLatex) || question;
    const answerHtml = renderKatex("x") || "x";

    return { question, questionHtml, answer: x, answerHtml };
}

function generateTwoStep(rand, difficulty) {
    const [min, max] = difficultyRange(difficulty);
    const a = randInt(rand, Math.max(2, min), Math.max(4, Math.min(12, max)));
    const x = randInt(rand, min, max);
    const b = randInt(rand, min, Math.min(20, max));
    const useMinus = randInt(rand, 0, 1) === 1;
    const c = useMinus ? a * x - b : a * x + b;
    const question = useMinus ? `${a}x − ${b} = ${c}` : `${a}x + ${b} = ${c}`;
    const latex = useMinus ? `${a}x - ${b} = ${c}` : `${a}x + ${b} = ${c}`;
    const questionHtml = renderKatex(latex) || question;
    const answerHtml = renderKatex("x") || "x";
    return { question, questionHtml, answer: x, answerHtml };
}

export default {
    id: "equations",
    label: "Solving Equations",
    grades: [5, 6, 6],  // [easy, normal, hard]
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
