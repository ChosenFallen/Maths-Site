import { randInt, gcd, ensureNonUnitDenominator } from "./utils.js";

export default {
    id: "fdp-fraction-to-decimal",
    label: "Fraction → Decimal",
    instruction() {
        return "Convert each fraction to a decimal.";
    },
    printTitle() {
        return "Fraction → Decimal";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const dp = decimalPlaces(difficulty);
        for (let i = 0; i < count; i++) {
            const { numerator, denominator } = terminatingFraction(rand, dp);
            const value = numerator / denominator;
            const answer = formatDecimal(value, dp);
            const questionHtml = `${formatFraction(numerator, denominator)} =`;
            problems.push({ questionHtml, answer });
        }
        return problems;
    },
};

function decimalPlaces(difficulty) {
    if (difficulty === "easy") return 1;
    if (difficulty === "normal") return 2;
    return 3;
}

function terminatingFraction(rand, dp) {
    const maxPow = Math.max(1, dp);
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

function formatDecimal(value, dp) {
    let s = value.toFixed(dp);
    s = s.replace(/\.?0+$/, "");
    return s;
}

function formatFraction(numerator, denominator) {
    return `<span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span>`;
}
