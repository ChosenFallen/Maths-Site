import { formatFrac, formatFracOrWhole, randInt, gcd, formatDecimal, decimalPlaces } from "./utils.js";

export default {
    id: "fdp-decimal-to-fraction",
    label: "Decimal → Fraction",
    instruction() {
        return "Convert each decimal to a fraction in simplest form.";
    },
    printTitle() {
        return "Decimal → Fraction";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const dp = decimalPlaces(difficulty);
        for (let i = 0; i < count; i++) {
            const value = randomDecimal(rand, dp);
            const asFraction = decimalToFraction(value, dp);
            const question = formatDecimal(value, dp);
            const formatted = formatFracOrWhole(asFraction.n, asFraction.d);
            const answerHtml = formatted.html;
            const answer = formatted.text;
            problems.push({ question, answerHtml, answer });
        }
        return problems;
    },
};

function randomDecimal(rand, dp) {
    const max = Math.pow(10, dp) - 1;
    const n = randInt(rand, 1, Math.max(1, max));
    return n / Math.pow(10, dp);
}

function decimalToFraction(value, dp) {
    const scale = Math.pow(10, dp);
    const n = Math.round(value * scale);
    const d = scale;
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
}
