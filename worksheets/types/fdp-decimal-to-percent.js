import { randInt, formatDecimal, decimalPlaces, formatPercent } from "./utils.js";

export default {
    id: "fdp-decimal-to-percent",
    label: "Decimal → Percentage",
    instruction() {
        return "Convert each decimal to a percentage.";
    },
    printTitle() {
        return "Decimal → Percentage";
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

function randomDecimal(rand, dp) {
    const max = Math.pow(10, dp) - 1;
    const n = randInt(rand, 1, Math.max(1, max));
    return n / Math.pow(10, dp);
}
