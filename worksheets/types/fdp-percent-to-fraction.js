import {
    formatFrac, formatFracOrWhole, randInt, gcd, ensureNonUnitDenominator, formatPercent, percentPlaces,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "fdp-percent-to-fraction",
    label: "Percentage → Fraction",
    grades: [4, 5, 6],  // [easy, normal, hard]
    instruction() {
        return "Convert each percentage to a fraction in simplest form.";
    },
    printTitle() {
        return "Percentage → Fraction";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const dp = percentPlaces(difficulty);
        for (let i = 0; i < count; i++) {
            const percent = randomPercent(rand, dp);
            const frac = percentToFraction(percent, dp);
            const question = formatPercent(percent, dp);
            const formatted = formatFracOrWhole(frac.n, frac.d);
            const answerHtml = formatted.html;
            const answer = formatted.text;

            // Generate wrong answers: common percentage-to-fraction mistakes
            const wrongAnswers = [];
            const seen = new Set([answer]);
            const candidates = [];

            // Mistake 1: forgot to divide by 100 (just used numerator/100)
            const scale = Math.pow(10, dp);
            const n = Math.round(percent * scale);
            const unsimplified = formatFracOrWhole(n, 100 * scale);
            candidates.push({ text: unsimplified.text, html: unsimplified.html });

            // Mistake 2: wrong denominator (used percent value as denominator)
            const percentWhole = Math.round(percent);
            if (percentWhole > 1) {
                const wrong1 = formatFracOrWhole(1, percentWhole);
                candidates.push({ text: wrong1.text, html: wrong1.html });
            }

            // Mistake 3: off by one in numerator
            const wrong2 = formatFracOrWhole(frac.n + 1, frac.d);
            candidates.push({ text: wrong2.text, html: wrong2.html });

            // Mistake 4: off by one in denominator
            const wrong3 = formatFracOrWhole(frac.n, frac.d + 1);
            candidates.push({ text: wrong3.text, html: wrong3.html });

            // Mistake 5: swapped numerator and denominator
            const wrong4 = formatFracOrWhole(frac.d, frac.n);
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
                const fallback = formatFracOrWhole(frac.n + 2, frac.d);
                wrongAnswers.push(fallback.html);
            }

            problems.push({ question, answerHtml, answer, wrongAnswers: wrongAnswers.slice(0, 3) });
        }
        return problems;
    },
};


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

