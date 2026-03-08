import { randInt, gcd, formatFrac, formatFracOrWhole } from "./utils.js";

export default {
    id: "simplify-fractions",
    label: "Simplify Fractions",
    grades: [3, 4, 5],  // [easy, normal, hard]
    instruction() {
        return "Simplify each fraction.";
    },
    printTitle() {
        return "Simplify Fractions";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            const { numerator, denominator } = generateFraction(rand, difficulty);
            const divisor = gcd(numerator, denominator);
            const simpNum = numerator / divisor;
            const simpDen = denominator / divisor;
            const questionHtml = `${formatFrac(numerator, denominator)} =`;
            const formatted = formatFracOrWhole(simpNum, simpDen);

            // Generate wrong answers: common simplification mistakes
            const wrongAnswers = [];
            const seen = new Set([formatted.text]);

            // Mistake 1: didn't simplify (original fraction)
            const original = formatFracOrWhole(numerator, denominator);
            if (!seen.has(original.text)) {
                wrongAnswers.push(original.html);
                seen.add(original.text);
            }

            // Mistake 2: only simplified numerator or denominator
            const partialNum = formatFracOrWhole(simpNum, denominator);
            if (!seen.has(partialNum.text)) {
                wrongAnswers.push(partialNum.html);
                seen.add(partialNum.text);
            }

            // Mistake 3: simplified by wrong factor
            if (divisor > 2) {
                const wrongDiv = divisor / 2;
                const wrongNum = numerator / wrongDiv;
                const wrongDen = denominator / wrongDiv;
                const wrongSimp = formatFracOrWhole(wrongNum, wrongDen);
                if (!seen.has(wrongSimp.text)) {
                    wrongAnswers.push(wrongSimp.html);
                    seen.add(wrongSimp.text);
                }
            }

            // Fallback: add a clearly wrong answer
            if (wrongAnswers.length < 3) {
                const fallback = formatFracOrWhole(simpNum, simpDen + 1);
                wrongAnswers.push(fallback.html);
            }

            problems.push({
                questionHtml,
                answerHtml: formatted.html,
                answer: formatted.text,
                wrongAnswers: wrongAnswers.slice(0, 3),
            });
        }
        return problems;
    },
};

function generateFraction(rand, difficulty) {
    let minDen = 4;
    let maxDen = 12;
    let minFactor = 2;
    let maxFactor = 5;

    if (difficulty === "easy") {
        minDen = 4;
        maxDen = 10;
        minFactor = 2;
        maxFactor = 4;
    } else if (difficulty === "normal") {
        minDen = 5;
        maxDen = 12;
        minFactor = 2;
        maxFactor = 6;
    } else if (difficulty === "hard") {
        minDen = 6;
        maxDen = 15;
        minFactor = 3;
        maxFactor = 8;
    }

    const baseDen = randInt(rand, minDen, maxDen);
    const baseNum = randInt(rand, 1, baseDen - 1);
    const factor = randInt(rand, minFactor, maxFactor);
    return {
        numerator: baseNum * factor,
        denominator: baseDen * factor,
    };
}
