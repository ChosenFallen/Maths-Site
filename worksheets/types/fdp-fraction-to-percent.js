import { formatFrac, formatFracOrWhole, randInt, gcd, ensureNonUnitDenominator } from "./utils.js";

export default {
    id: "fdp-fraction-to-percent",
    label: "Fraction → Percentage",
    instruction() {
        return "Convert each fraction to a percentage.";
    },
    printTitle() {
        return "Fraction → Percentage";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const dp = percentPlaces(difficulty);
        for (let i = 0; i < count; i++) {
            const { numerator, denominator } = terminatingFraction(rand, dp);
            const value = (numerator / denominator) * 100;
            const answer = formatPercent(value, dp);
            const questionHtml = `${formatFrac(numerator, denominator)} =`;
            problems.push({ questionHtml, answer });
        }
        return problems;
    },
};

function percentPlaces(difficulty) {
    if (difficulty === "easy") return 0;
    if (difficulty === "normal") return 1;
    return 2;
}

function terminatingFraction(rand, dp) {
    const maxPow = Math.max(1, dp + 1);
    let pow2 = randInt(rand, 0, maxPow);
    let pow5 = randInt(rand, 0, maxPow);
    if (pow2 === 0 && pow5 === 0) {
        pow2 = 1;
    }
    const denominator = Math.pow(2, pow2) * Math.pow(5, pow5);
    const numerator = randInt(rand, 1, Math.max(2, denominator - 1));
    const d = gcd(numerator, denominator);
    const reduced = { numerator: numerator / d, denominator: denominator / d };
    return ensureNonUnitDenominator(reduced.numerator, reduced.denominator);
}

function formatPercent(value, dp) {
    let s = value.toFixed(dp);
    s = s.replace(/\.?0+$/, "");
    return `${s}%`;
}
