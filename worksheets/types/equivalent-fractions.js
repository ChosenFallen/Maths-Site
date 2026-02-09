import { randInt, gcd } from "./utils.js";

export default {
    id: "equivalent-fractions",
    label: "Equivalent Fractions",
    instruction() {
        return "Fill in the missing value to make the fractions equivalent.";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            const { numerator, denominator, factor } = generateFraction(rand, difficulty);
            const scaledNum = numerator * factor;
            const scaledDen = denominator * factor;
            const hideTop = randInt(rand, 0, 1) === 0;

            const left = formatFraction(numerator, denominator);
            const right = hideTop
                ? formatFractionBlank(scaledDen, true)
                : formatFractionBlank(scaledNum, false);

            const questionHtml = `${left} = ${right}`;
            const answer = hideTop ? scaledNum : scaledDen;
            const answerHtml = answer;

            problems.push({ questionHtml, answer, answerHtml });
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

    let numerator = randInt(rand, 1, maxDen - 1);
    let denominator = randInt(rand, minDen, maxDen);

    const divisor = gcd(numerator, denominator);
    numerator /= divisor;
    denominator /= divisor;

    const factor = randInt(rand, minFactor, maxFactor);
    return { numerator, denominator, factor };
}

function formatFraction(numerator, denominator) {
    return `<span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span>`;
}

function formatFractionBlank(knownValue, blankTop) {
    if (blankTop) {
        return `<span class="frac"><span class="top blank"></span><span class="bottom">${knownValue}</span></span>`;
    }
    return `<span class="frac"><span class="top">${knownValue}</span><span class="bottom blank"></span></span>`;
}
