import { randInt, gcd } from "./utils.js";

export default {
    id: "fraction-mul-div",
    label: "Multiply/Divide Fractions",
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.fractionMulDivMode || "mixed";
        for (let i = 0; i < count; i++) {
            const op =
                mode === "multiply"
                    ? "×"
                    : mode === "divide"
                      ? "÷"
                      : randInt(rand, 0, 1) === 0
                        ? "×"
                        : "÷";
            problems.push(generateProblem(rand, difficulty, op));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, op) {
    const [minDen, maxDen] = denominatorRange(difficulty);

    const d1 = randInt(rand, minDen, maxDen);
    const d2 = randInt(rand, minDen, maxDen);
    const n1 = randInt(rand, 1, d1 - 1);
    const n2 = randInt(rand, 1, d2 - 1);

    const left = formatFraction(n1, d1);
    const right = formatFraction(n2, d2);

    let resultNum;
    let resultDen;

    if (op === "×") {
        resultNum = n1 * n2;
        resultDen = d1 * d2;
    } else {
        // division: (n1/d1) ÷ (n2/d2) = (n1/d1) * (d2/n2)
        resultNum = n1 * d2;
        resultDen = d1 * n2;
    }

    const divisor = gcd(Math.abs(resultNum), resultDen);
    const simpNum = resultNum / divisor;
    const simpDen = resultDen / divisor;

    const questionHtml = `${left} ${op} ${right} =`;
    const answerHtml = formatFraction(simpNum, simpDen);
    const answer = `${simpNum}/${simpDen}`;

    return { questionHtml, answerHtml, answer };
}

function denominatorRange(difficulty) {
    switch (difficulty) {
        case "easy":
            return [2, 8];
        case "normal":
            return [2, 12];
        case "hard":
            return [3, 15];
        default:
            return [2, 8];
    }
}

function formatFraction(numerator, denominator) {
    return `<span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span>`;
}
