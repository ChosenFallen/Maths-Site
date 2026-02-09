import { randInt, gcd, ensureNonUnitDenominator } from "./utils.js";

export default {
    id: "fdp-percent-to-fraction",
    label: "Percentage → Fraction",
    instruction() {
        return "Convert each percentage to a fraction in simplest form.";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const dp = percentPlaces(difficulty);
        for (let i = 0; i < count; i++) {
            const percent = randomPercent(rand, dp);
            const frac = percentToFraction(percent, dp);
            const question = formatPercent(percent, dp);
            const formatted = formatFractionOrWhole(frac.n, frac.d);
            const answerHtml = formatted.html;
            const answer = formatted.text;
            problems.push({ question, answerHtml, answer });
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
    let n = randInt(rand, 1, Math.max(1, max));
    if (n === max) n = max - 1;
    return n / Math.pow(10, dp);
}

function percentToFraction(percent, dp) {
    const scale = Math.pow(10, dp);
    const n = Math.round(percent * scale);
    const d = 100 * scale;
    const g = gcd(n, d);
    const reduced = { n: n / g, d: d / g };
    const fixed = ensureNonUnitDenominator(reduced.n, reduced.d);
    return { n: fixed.numerator, d: fixed.denominator };
}

function formatPercent(value, dp) {
    let s = value.toFixed(dp);
    s = s.replace(/\.?0+$/, "");
    return `${s}%`;
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
