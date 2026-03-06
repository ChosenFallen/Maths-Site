import {
    randInt,
    formatDecimal,
    decimalPlaces,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "decimal-add-sub",
    label: "Add/Subtract Decimals",
    grades: [3, 4, 5],  // [easy, normal, hard]
    instruction() {
        return "Add or subtract the decimals.";
    },
    printTitle() {
        return "Add/Subtract Decimals";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const dp = decimalPlaces(difficulty);
        const max = Math.pow(10, dp) * maxWhole(difficulty);
        for (let i = 0; i < count; i++) {
            const a = randInt(rand, 1, max) / Math.pow(10, dp);
            const b = randInt(rand, 1, max) / Math.pow(10, dp);
            const doSub = randInt(rand, 0, 1) === 1;
            const [x, y] = doSub && a < b ? [b, a] : [a, b];
            const op = doSub ? "−" : "+";
            const result = doSub ? x - y : x + y;
            const question = `${formatDecimal(x, dp)} ${op} ${formatDecimal(
                y,
                dp,
            )} =`;
            const answer = formatDecimal(result, dp);
            problems.push({ question, answer });
        }
        return problems;
    },
};

function maxWhole(difficulty) {
    if (difficulty === "easy") return 20;
    if (difficulty === "normal") return 50;
    return 100;
}
