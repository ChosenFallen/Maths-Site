import { randInt, renderKatex, formatSurdLatex, formatSurdText } from "./utils.js";

export default {
    id: "surds-add-sub",
    label: "Surd Addition & Subtraction",
    grades: [7, 8, 9],  // [easy, normal, hard]
    instruction() {
        return "Simplify each expression.";
    },
    printTitle() {
        return "Surd Addition & Subtraction";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty) {
    const kOptions = [2, 3, 5, 7];
    const isAddition = randInt(rand, 0, 1) === 0;

    if (difficulty === "easy") {
        // Like surds: a√k ± b√k = (a±b)√k
        const k = kOptions[randInt(rand, 0, kOptions.length - 1)];
        let a = randInt(rand, 2, 6);
        let b = randInt(rand, 1, 6);

        // For subtraction, ensure a > b to avoid negative
        if (!isAddition && a <= b) {
            const temp = a;
            a = b;
            b = temp;
        }

        const resultCoeff = isAddition ? a + b : a - b;
        const sign = isAddition ? "+" : "−";

        const questionLatex = `${formatSurdLatex(a, k)} ${sign} ${formatSurdLatex(b, k)}`;
        const questionText = `${formatSurdText(a, k)} ${sign} ${formatSurdText(b, k)}`;
        const answerLatex = formatSurdLatex(resultCoeff, k);
        const answerText = formatSurdText(resultCoeff, k);

        const questionHtml = renderKatex(questionLatex) || questionText;
        const answerHtml = renderKatex(answerLatex) || answerText;

        // Wrong answers
        const wrongAnswers = [];
        wrongAnswers.push(formatSurdText(a, k)); // forgot to add/subtract
        wrongAnswers.push(formatSurdText(b, k)); // only the second term
        const wrongOp = isAddition ? a - b : a + b; // opposite operation
        if (wrongOp > 0) wrongAnswers.push(formatSurdText(wrongOp, k));

        return {
            questionHtml,
            question: questionText,
            answer: answerText,
            answerHtml,
            wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answerText).slice(0, 3),
        };
    } else if (difficulty === "normal") {
        // Simplify one term, then add/subtract
        const k = kOptions[randInt(rand, 0, kOptions.length - 1)];
        let a = randInt(rand, 2, 4); // for √(a²k)
        let b = randInt(rand, 1, 5); // for b√k

        // For subtraction, ensure the simplified term >= the like term
        if (!isAddition && a <= b) {
            const temp = a;
            a = b;
            b = temp;
        }

        const aSquaredK = a * a * k;

        const resultCoeff = isAddition ? a + b : a - b;
        const sign = isAddition ? "+" : "−";

        const questionLatex = `\\sqrt{${aSquaredK}} ${sign} ${formatSurdLatex(b, k)}`;
        const questionText = `√${aSquaredK} ${sign} ${formatSurdText(b, k)}`;
        const answerLatex = formatSurdLatex(resultCoeff, k);
        const answerText = formatSurdText(resultCoeff, k);

        const questionHtml = renderKatex(questionLatex) || questionText;
        const answerHtml = renderKatex(answerLatex) || answerText;

        // Wrong answers
        const wrongAnswers = [];
        wrongAnswers.push(formatSurdText(a, k)); // forgot to add/subtract
        wrongAnswers.push(`√${aSquaredK} ${sign} √${k}`); // forgot to simplify the nested root
        const wrongOp = isAddition ? a - b : a + b;
        if (wrongOp !== resultCoeff) wrongAnswers.push(formatSurdText(wrongOp, k));

        return {
            questionHtml,
            question: questionText,
            answer: answerText,
            answerHtml,
            wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answerText).slice(0, 3),
        };
    } else {
        // Hard: simplify both terms
        const k = kOptions[randInt(rand, 0, kOptions.length - 1)];
        let a = randInt(rand, 2, 5);
        let b = randInt(rand, 2, 4);

        // Ensure a ≠ b
        if (a === b) {
            b = (b % 4) + 2;
        }

        // For subtraction, put the larger value first
        if (!isAddition && a < b) {
            const temp = a;
            a = b;
            b = temp;
        }

        const aSquaredK = a * a * k;
        const bSquaredK = b * b * k;
        const resultCoeff = isAddition ? a + b : a - b;
        const sign = isAddition ? "+" : "−";

        const questionLatex = `\\sqrt{${aSquaredK}} ${sign} \\sqrt{${bSquaredK}}`;
        const questionText = `√${aSquaredK} ${sign} √${bSquaredK}`;
        const answerLatex = formatSurdLatex(resultCoeff, k);
        const answerText = formatSurdText(resultCoeff, k);

        const questionHtml = renderKatex(questionLatex) || questionText;
        const answerHtml = renderKatex(answerLatex) || answerText;

        // Wrong answers
        const wrongAnswers = [];
        wrongAnswers.push(formatSurdText(a, k)); // forgot to add second simplified term
        wrongAnswers.push(`√${aSquaredK} ${sign} √${bSquaredK}`); // forgot to simplify
        const wrongOp = isAddition ? a - b : a + b;
        if (wrongOp !== resultCoeff) wrongAnswers.push(formatSurdText(wrongOp, k));

        return {
            questionHtml,
            question: questionText,
            answer: answerText,
            answerHtml,
            wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answerText).slice(0, 3),
        };
    }
}
