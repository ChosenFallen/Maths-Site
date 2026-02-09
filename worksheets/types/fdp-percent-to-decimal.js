import { randInt } from "./utils.js";

export default {
    id: "fdp-percent-to-decimal",
    label: "Percentage → Decimal",
    instruction() {
        return "Convert each percentage to a decimal.";
    },
    printTitle() {
        return "Percentage → Decimal";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const dp = percentPlaces(difficulty);
        for (let i = 0; i < count; i++) {
            const percent = randomPercent(rand, dp);
            const value = percent / 100;
            const question = formatPercent(percent, dp);
            const answer = formatDecimal(value, dp + 2);
            problems.push({ question, answer });
        }
        return problems;
    },
};

function percentPlaces(difficulty) {
    if (difficulty === "easy") return 0;
    if (difficulty === "normal") return 1;
    return 2;
}

function randomPercent(rand, dp) {
    const max = 100 * Math.pow(10, dp);
    const n = randInt(rand, 1, Math.max(1, max));
    return n / Math.pow(10, dp);
}

function formatPercent(value, dp) {
    let s = value.toFixed(dp);
    s = s.replace(/\.?0+$/, "");
    return `${s}%`;
}

function formatDecimal(value, dp) {
    let s = value.toFixed(dp);
    s = s.replace(/\.?0+$/, "");
    return s;
}
