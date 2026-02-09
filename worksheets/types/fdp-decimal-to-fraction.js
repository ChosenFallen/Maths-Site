import { randInt, gcd } from "./utils.js";

export default {
    id: "fdp-decimal-to-fraction",
    label: "Decimal → Fraction",
    instruction() {
        return "Convert each decimal to a fraction in simplest form.";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const dp = decimalPlaces(difficulty);
        for (let i = 0; i < count; i++) {
            const value = randomDecimal(rand, dp);
            const asFraction = decimalToFraction(value, dp);
            const question = formatDecimal(value, dp);
            const formatted = formatFractionOrWhole(asFraction.n, asFraction.d);
            const answerHtml = formatted.html;
            const answer = formatted.text;
            problems.push({ question, answerHtml, answer });
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

function decimalToFraction(value, dp) {
    const scale = Math.pow(10, dp);
    const n = Math.round(value * scale);
    const d = scale;
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
}

function formatDecimal(value, dp) {
    let s = value.toFixed(dp);
    s = s.replace(/\.?0+$/, "");
    return s;
}

function formatFraction(numerator, denominator) {
    return `<span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span>`;
}

function formatFractionOrWhole(numerator, denominator) {
    if (denominator === 1) {
        return { html: `${numerator}`, text: `${numerator}` };
    }
    return {
        html: formatFraction(numerator, denominator),
        text: `${numerator}/${denominator}`,
    };
}
