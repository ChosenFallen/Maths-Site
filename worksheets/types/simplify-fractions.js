import { randInt, gcd } from "./utils.js";

export default {
    id: "simplify-fractions",
    label: "Simplify Fractions",
    instruction() {
        return "Simplify each fraction.";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            const { numerator, denominator } = generateFraction(rand, difficulty);
            const divisor = gcd(numerator, denominator);
            const simpNum = numerator / divisor;
            const simpDen = denominator / divisor;
            const questionHtml = `${formatFraction(numerator, denominator)} =`;
            const answerHtml = formatFraction(simpNum, simpDen);
            problems.push({ questionHtml, answerHtml, answer: `${simpNum}/${simpDen}` });
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

function formatFraction(numerator, denominator) {
    return `<span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span>`;
}
