import { randInt } from "./utils.js";

export default {
    id: "decimal-mul-div",
    label: "Multiply/Divide Decimals",
    instruction(options = {}) {
        const mode = options.decimalMulDivMode || "mixed";
        if (mode === "multiply") return "Multiply the decimals.";
        if (mode === "divide") return "Divide the decimals.";
        return "Multiply or divide the decimals.";
    },
    printTitle(options = {}) {
        const mode = options.decimalMulDivMode || "mixed";
        if (mode === "multiply") return "Multiply Decimals";
        if (mode === "divide") return "Divide Decimals";
        return "Multiply/Divide Decimals";
    },
    options: [
        {
            id: "decimalMulDivMode",
            label: "Operation:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "multiply", label: "Multiply" },
                { value: "divide", label: "Divide" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const dp = decimalPlaces(difficulty);
        const max = maxWhole(difficulty);
        const mode = options.decimalMulDivMode || "mixed";

        for (let i = 0; i < count; i++) {
            const op =
                mode === "multiply"
                    ? "×"
                    : mode === "divide"
                      ? "÷"
                      : randInt(rand, 0, 1) === 0
                        ? "×"
                        : "÷";

            const answerDp = Math.min(2, dp * 2);
            if (op === "×") {
                const a = randInt(rand, 1, max * Math.pow(10, dp)) / Math.pow(10, dp);
                const b = randInt(rand, 1, max * Math.pow(10, dp)) / Math.pow(10, dp);
                const result = a * b;
                const question = `${formatDecimal(a, dp)} × ${formatDecimal(
                    b,
                    dp,
                )} =`;
                const answer = formatDecimal(result, answerDp);
                problems.push({ question, answer });
            } else {
                // Create clean division: dividend = divisor * quotient
                const divisor =
                    randInt(rand, 1, max * Math.pow(10, dp)) / Math.pow(10, dp);
                const quotient =
                    randInt(rand, 1, max * Math.pow(10, dp)) / Math.pow(10, dp);
                const dividend = divisor * quotient;
                const question = `${formatDecimal(dividend, dp)} ÷ ${formatDecimal(
                    divisor,
                    dp,
                )} =`;
                const answer = formatDecimal(quotient, answerDp);
                problems.push({ question, answer });
            }
        }

        return problems;
    },
};

function decimalPlaces(difficulty) {
    if (difficulty === "easy") return 1;
    if (difficulty === "normal") return 2;
    return 3;
}

function maxWhole(difficulty) {
    if (difficulty === "easy") return 10;
    if (difficulty === "normal") return 20;
    return 50;
}

function formatDecimal(value, dp) {
    let s = value.toFixed(dp);
    s = s.replace(/\.?0+$/, "");
    return s;
}
