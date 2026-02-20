import { randInt, difficultyRange } from "./utils.js";

export default {
    id: "missing-number",
    label: "Missing Number",
    instruction(options = {}) {
        const mode = options.operation || "mixed";
        if (mode === "mixed") return "Find the missing number in each equation.";
        const names = { addition: "addition", subtraction: "subtraction", multiplication: "multiplication", division: "division" };
        return `Find the missing number using ${names[mode]}.`;
    },
    printTitle(options = {}) {
        const mode = options.operation || "mixed";
        if (mode === "mixed") return "Missing Number";
        const names = { addition: "Addition", subtraction: "Subtraction", multiplication: "Multiplication", division: "Division" };
        return `Missing Number (${names[mode]})`;
    },
    options: [
        {
            id: "operation",
            label: "Operation:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "addition", label: "Addition" },
                { value: "subtraction", label: "Subtraction" },
                { value: "multiplication", label: "Multiplication" },
                { value: "division", label: "Division" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const mode = options.operation || "mixed";
        const problems = [];
        for (let i = 0; i < count; i++) {
            const op = mode === "mixed"
                ? ["addition", "subtraction", "multiplication", "division"][randInt(rand, 0, 3)]
                : mode;
            problems.push(generateProblem(rand, difficulty, op));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, op) {
    const [minVal, maxVal] = difficultyRange(difficulty);
    const blank = "______";

    let a, b, result, answer, question, symbol;

    if (op === "addition") {
        // _____ + b = result  or  a + _____ = result
        b = randInt(rand, minVal, maxVal);
        result = randInt(rand, minVal + 1, maxVal + minVal);
        a = result - b;
        if (a < minVal) a = minVal + 1;
        answer = a;
        const blankLeft = randInt(rand, 0, 1) === 0;
        question = blankLeft ? `${blank} + ${b} = ${result}` : `${a} + ${blank} = ${result}`;
        symbol = "+";
    } else if (op === "subtraction") {
        // _____ - b = result  or  a - _____ = result
        a = randInt(rand, minVal + 1, Math.max(minVal + 2, maxVal));
        b = randInt(rand, minVal, Math.min(a - 1, maxVal));
        result = a - b;
        const blankLeft = randInt(rand, 0, 1) === 0;
        if (blankLeft) {
            // _____ - b = result  →  _____ = result + b
            answer = result + b;
            question = `${blank} − ${b} = ${result}`;
        } else {
            // a - _____ = result  →  _____ = a - result
            answer = a - result;
            question = `${a} − ${blank} = ${result}`;
        }
        symbol = "−";
    } else if (op === "multiplication") {
        // _____ × b = result  or  a × _____ = result
        const multiplierRange = difficulty === "easy" ? [2, 5] : difficulty === "normal" ? [2, 12] : [2, 20];
        b = randInt(rand, multiplierRange[0], multiplierRange[1]);
        const maxResult = difficulty === "easy" ? 25 : difficulty === "normal" ? 144 : 400;
        result = randInt(rand, multiplierRange[0], Math.min(maxResult / b, 50)) * b;
        a = result / b;
        answer = a;
        const blankLeft = randInt(rand, 0, 1) === 0;
        question = blankLeft ? `${blank} × ${b} = ${result}` : `${a} × ${blank} = ${result}`;
        symbol = "×";
    } else {
        // _____ ÷ b = result  or  a ÷ _____ = result
        const divisorRange = difficulty === "easy" ? [2, 5] : difficulty === "normal" ? [2, 12] : [2, 20];
        b = randInt(rand, divisorRange[0], divisorRange[1]);
        result = randInt(rand, divisorRange[0], Math.min(50, 400 / b));
        a = result * b;
        answer = a;
        const blankLeft = randInt(rand, 0, 1) === 0;
        question = blankLeft ? `${blank} ÷ ${b} = ${result}` : `${a} ÷ ${blank} = ${result}`;
        symbol = "÷";
    }

    return { question, answer };
}
