import { randInt, gcd, formatFrac, formatFracOrWhole } from "./utils.js";

export default {
    id: "fraction-mul-div",
    label: "Multiply/Divide Fractions",
    grades: [4, 5, 6],  // [easy, normal, hard]
    instruction(options = {}) {
        const mode = options.fractionMulDivMode || "mixed";
        if (mode === "multiply")
            return "Multiply the fractions and simplify your answers.";
        if (mode === "divide")
            return "Divide the fractions and simplify your answers.";
        return "Multiply or divide and simplify your answers.";
    },
    printTitle(options = {}) {
        const mode = options.fractionMulDivMode || "mixed";
        if (mode === "multiply") return "Multiply Fractions";
        if (mode === "divide") return "Divide Fractions";
        return "Multiply/Divide Fractions";
    },
    options: [
        {
            id: "fractionMulDivMode",
            label: "Operation:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "multiply", label: "Multiply" },
                { value: "divide", label: "Divide" },
            ],
        },
    ],
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

    const left = formatFrac(n1, d1);
    const right = formatFrac(n2, d2);

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
    const formatted = formatFracOrWhole(simpNum, simpDen);
    const answerHtml = formatted.html;
    const answer = formatted.text;

    // Wrong answers: common fraction multiplication/division mistakes
    const wrongAnswers = [];

    if (op === "×") {
        // Multiplication mistakes
        // Mistake 1: added instead of multiplied numerators
        const wrongNum1 = n1 + n2;
        const wrongDen1 = d1 + d2;
        wrongAnswers.push(formatFracOrWhole(wrongNum1, wrongDen1).text);

        // Mistake 2: multiplied numerators but added denominators
        wrongAnswers.push(formatFracOrWhole(n1 * n2, d1 + d2).text);

        // Mistake 3: added numerators, multiplied denominators
        wrongAnswers.push(formatFracOrWhole(n1 + n2, d1 * d2).text);
    } else {
        // Division mistakes: should be (n1/d1) × (d2/n2)
        // Mistake 1: forgot to flip the second fraction (just multiplied)
        wrongAnswers.push(formatFracOrWhole(n1 * n2, d1 * d2).text);

        // Mistake 2: flipped but then added instead of multiplied
        wrongAnswers.push(formatFracOrWhole(n1 + d2, d1 + n2).text);

        // Mistake 3: wrong flip (flipped first instead of second)
        wrongAnswers.push(formatFracOrWhole(d1 * n2, n1 * d2).text);
    }

    return {
        questionHtml,
        answerHtml,
        answer,
        wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answer).slice(0, 3),
    };
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
