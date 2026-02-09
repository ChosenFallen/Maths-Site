import { randInt } from "./utils.js";

export default {
    id: "fdp-decimal-to-percent",
    label: "Decimal → Percentage",
    instruction() {
        return "Convert each decimal to a percentage.";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const dp = decimalPlaces(difficulty);
        for (let i = 0; i < count; i++) {
            const value = randomDecimal(rand, dp);
            const percent = value * 100;
            const question = formatDecimal(value, dp);
            const answer = formatPercent(percent, dp);
            problems.push({ question, answer });
        }
        return problems;
    },
};

function decimalPlaces(difficulty) {
    if (difficulty === "easy") return 1;
    if (difficulty === "normal") return 2;
    return 3;
}

function randomDecimal(rand, dp) {
    const max = Math.pow(10, dp) - 1;
    const n = randInt(rand, 1, Math.max(1, max));
    return n / Math.pow(10, dp);
}

function formatDecimal(value, dp) {
    let s = value.toFixed(dp);
    s = s.replace(/\.?0+$/, "");
    return s;
}

function formatPercent(value, dp) {
    let s = value.toFixed(dp);
    s = s.replace(/\.?0+$/, "");
    return `${s}%`;
}
