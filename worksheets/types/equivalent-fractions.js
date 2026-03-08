import { randInt, gcd } from "./utils.js";

export default {
    id: "equivalent-fractions",
    label: "Equivalent Fractions",
    grades: [3, 4, 5],  // [easy, normal, hard]
    instruction() {
        return "Fill in the missing value to make the fractions equivalent.";
    },
    printTitle() {
        return "Equivalent Fractions";
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
            const missingValue = hideTop ? scaledNum : scaledDen;

            // Format answer as complete equation for answer key with bold missing value
            const leftFrac = formatFraction(numerator, denominator);
            const rightFrac = hideTop
                ? formatFractionWithBold(scaledNum, scaledDen, true)
                : formatFractionWithBold(scaledNum, scaledDen, false);
            const answerHtml = `${leftFrac} = ${rightFrac}`;
            const answer = `${numerator}/${denominator} = ${scaledNum}/${scaledDen}`;

            // Generate wrong answers: common equivalent fraction mistakes
            const wrongAnswers = [];
            const seen = new Set([answer]);

            // Mistake 1: scaled by wrong factor (factor - 1)
            if (factor > 2) {
                const wrongFactor1 = factor - 1;
                const wrongAnswer1 = hideTop
                    ? `${numerator}/${denominator} = ${numerator * wrongFactor1}/${scaledDen}`
                    : `${numerator}/${denominator} = ${scaledNum}/${denominator * wrongFactor1}`;
                if (!seen.has(wrongAnswer1)) {
                    const wrongNum1 = hideTop ? numerator * wrongFactor1 : scaledNum;
                    const wrongDen1 = hideTop ? scaledDen : denominator * wrongFactor1;
                    const wrongHtml1 = `${formatFraction(numerator, denominator)} = ${formatFractionWithBold(wrongNum1, wrongDen1, hideTop)}`;
                    wrongAnswers.push(wrongHtml1);
                    seen.add(wrongAnswer1);
                }
            }

            // Mistake 2: scaled by wrong factor (factor + 1)
            const wrongFactor2 = factor + 1;
            const wrongAnswer2 = hideTop
                ? `${numerator}/${denominator} = ${numerator * wrongFactor2}/${scaledDen}`
                : `${numerator}/${denominator} = ${scaledNum}/${denominator * wrongFactor2}`;
            if (!seen.has(wrongAnswer2)) {
                const wrongNum2 = hideTop ? numerator * wrongFactor2 : scaledNum;
                const wrongDen2 = hideTop ? scaledDen : denominator * wrongFactor2;
                const wrongHtml2 = `${formatFraction(numerator, denominator)} = ${formatFractionWithBold(wrongNum2, wrongDen2, hideTop)}`;
                wrongAnswers.push(wrongHtml2);
                seen.add(wrongAnswer2);
            }

            // Mistake 3: swapped numerator and denominator in second fraction
            const wrongAnswer3 = `${numerator}/${denominator} = ${scaledDen}/${scaledNum}`;
            if (!seen.has(wrongAnswer3)) {
                const wrongHtml3 = `${formatFraction(numerator, denominator)} = ${formatFractionWithBold(scaledDen, scaledNum, !hideTop)}`;
                wrongAnswers.push(wrongHtml3);
                seen.add(wrongAnswer3);
            }

            // Fallback
            if (wrongAnswers.length < 3) {
                const fallbackHtml = `${formatFraction(numerator, denominator)} = ${formatFractionWithBold(numerator, scaledDen, hideTop)}`;
                wrongAnswers.push(fallbackHtml);
            }

            problems.push({ questionHtml, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) });
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

    let denominator = randInt(rand, minDen, maxDen);
    let numerator = randInt(rand, 1, denominator - 1);

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

function formatFractionWithBold(numerator, denominator, boldTop) {
    const numHtml = boldTop ? `<strong>${numerator}</strong>` : numerator;
    const denHtml = !boldTop ? `<strong>${denominator}</strong>` : denominator;
    return `<span class="frac"><span class="top">${numHtml}</span><span class="bottom">${denHtml}</span></span>`;
}
