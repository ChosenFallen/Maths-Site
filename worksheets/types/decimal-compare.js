import { randInt } from "./utils.js";

export default {
    id: "decimal-compare",
    label: "Compare Decimals",
    instruction(options = {}) {
        const mode = options.decimalCompareMode || "mixed";
        if (mode === "no-equals") return "Compare the decimals using > or <.";
        return "Compare the decimals using >, <, or =.";
    },
    printTitle() {
        return "Compare Decimals";
    },
    options: [
        {
            id: "decimalCompareMode",
            label: "Comparison:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "no-equals", label: "No equals" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const dp = decimalPlaces(difficulty);
        const max = maxWhole(difficulty);
        const mode = options.decimalCompareMode || "mixed";

        for (let i = 0; i < count; i++) {
            const sameInteger = randInt(rand, 1, 100) <= 60;
            const intPart = randInt(rand, 1, max);
            const fracMax = Math.pow(10, dp) - 1;
            const fracA = randInt(rand, 0, fracMax) / Math.pow(10, dp);
            const fracB = randInt(rand, 0, fracMax) / Math.pow(10, dp);
            let a = sameInteger
                ? intPart + fracA
                : randInt(rand, 1, max * Math.pow(10, dp)) / Math.pow(10, dp);
            let b = sameInteger
                ? intPart + fracB
                : randInt(rand, 1, max * Math.pow(10, dp)) / Math.pow(10, dp);

            if (mode !== "no-equals" && randInt(rand, 1, 100) <= 20) {
                b = a;
            } else if (mode === "no-equals") {
                while (b === a) {
                    b =
                        randInt(rand, 1, max * Math.pow(10, dp)) /
                        Math.pow(10, dp);
                }
            }

            const cmp = a === b ? 0 : a > b ? 1 : -1;
            const answer = cmp === 0 ? "=" : cmp > 0 ? ">" : "<";
            const question = `${formatDecimal(a, dp)}  ?  ${formatDecimal(
                b,
                dp,
            )}`;
            const answerKey = `${formatDecimal(a, dp)} ${answer} ${formatDecimal(
                b,
                dp,
            )}`;
            problems.push({ question, answer, answerKeyHtml: answerKey });
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
    if (difficulty === "easy") return 20;
    if (difficulty === "normal") return 50;
    return 100;
}

function formatDecimal(value, dp) {
    let s = value.toFixed(dp);
    s = s.replace(/\.?0+$/, "");
    return s;
}
