import {
    formatFrac, formatFracOrWhole, randInt, gcd, formatDecimal, decimalPlaces,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "fdp-decimal-to-fraction",
    label: "Decimal → Fraction",
    grades: [4, 5, 6],  // [easy, normal, hard]
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

            // Generate wrong answers: common decimal-to-fraction mistakes
            const wrongAnswers = [];
            const seen = new Set([answer]);
            const candidates = [];

            // Mistake 1: not simplified (unsimplified fraction)
            const scale = Math.pow(10, dp);
            const n = Math.round(value * scale);
            const unsimplified = formatFracOrWhole(n, scale);
            candidates.push({ text: unsimplified.text, html: unsimplified.html });

            // Mistake 2: wrong denominator power
            if (dp > 1) {
                const wrongDen1 = Math.pow(10, dp - 1);
                const wrong1 = formatFracOrWhole(asFraction.n, wrongDen1);
                candidates.push({ text: wrong1.text, html: wrong1.html });
            }

            // Mistake 3: off by one in numerator
            const wrong2 = formatFracOrWhole(asFraction.n + 1, asFraction.d);
            candidates.push({ text: wrong2.text, html: wrong2.html });

            // Mistake 4: off by one in denominator
            const wrong3 = formatFracOrWhole(asFraction.n, asFraction.d + 1);
            candidates.push({ text: wrong3.text, html: wrong3.html });

            // Mistake 5: swapped numerator and denominator
            const wrong4 = formatFracOrWhole(asFraction.d, asFraction.n);
            candidates.push({ text: wrong4.text, html: wrong4.html });

            // Collect unique ones
            for (const wa of candidates) {
                if (!seen.has(wa.text)) {
                    wrongAnswers.push(wa.html);
                    seen.add(wa.text);
                    if (wrongAnswers.length === 3) break;
                }
            }

            // Ensure we have 3
            while (wrongAnswers.length < 3) {
                const fallback = formatFracOrWhole(asFraction.n + 2, asFraction.d);
                wrongAnswers.push(fallback.html);
            }

            problems.push({ question, answerHtml, answer, wrongAnswers: wrongAnswers.slice(0, 3) });
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
