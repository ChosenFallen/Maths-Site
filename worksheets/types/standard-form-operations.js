import {
    randInt, exponentToSuperscript, renderKatex,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "standard-form-operations",
    label: "Standard Form: Addition and Subtraction",
    grades: [6, 7, 8],  // [easy, normal, hard]
    instruction() {
        return "Add or subtract numbers in standard form.";
    },
    printTitle() {
        return "Standard Form: Addition and Subtraction";
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
    if (difficulty === "easy") {
        // Same powers of 10, simple numbers
        const power = randInt(rand, 2, 4);
        let a = randInt(rand, 1, 9);
        let b = randInt(rand, 1, 9);
        const operation = randInt(rand, 0, 1) === 0 ? "+" : "−";

        // For subtraction, ensure a >= b for positive result
        if (operation === "−" && b > a) {
            [a, b] = [b, a];
        }

        const isAdd = operation === "+";
        const resultCoeff = isAdd ? a + b : a - b;
        let resultPower = power;

        let resultCoeffStr;

        if (resultCoeff >= 10) {
            resultPower += 1;
            resultCoeffStr = (resultCoeff / 10).toFixed(1);
        } else {
            resultCoeffStr = resultCoeff;
        }

        const questionLatex = `${a} \\times 10^{${power}} ${operation === "+" ? "+" : "-"} ${b} \\times 10^{${power}} =`;
        const questionHtml = renderKatex(questionLatex) || `${a} × 10${exponentToSuperscript(power)} ${operation} ${b} × 10${exponentToSuperscript(power)} =`;
        const question = `${a} × 10${exponentToSuperscript(power)} ${operation} ${b} × 10${exponentToSuperscript(power)} =`;

        const answerLatex = `${resultCoeffStr} \\times 10^{${resultPower}}`;
        const answerHtml = renderKatex(answerLatex) || `${resultCoeffStr} × 10${exponentToSuperscript(resultPower)}`;
        const answer = `${resultCoeffStr} × 10${exponentToSuperscript(resultPower)}`;
        const numericAnswer = parseFloat(resultCoeffStr);
        const formatWrongAnswer = (num) => `${num.toFixed(1)} × 10${exponentToSuperscript(resultPower)}`;

        return { questionHtml, question, answer, answerHtml, wrongAnswers: generateNumericDistracters(numericAnswer, rand).map(formatWrongAnswer) };
    } else if (difficulty === "normal") {
        // Same powers, decimal coefficients
        const power = randInt(rand, 2, 6);
        let a = (randInt(rand, 10, 99) / 10).toFixed(1);
        let b = (randInt(rand, 10, 99) / 10).toFixed(1);
        const operation = randInt(rand, 0, 1) === 0 ? "+" : "−";

        let aNum = parseFloat(a);
        let bNum = parseFloat(b);

        // For subtraction, ensure aNum >= bNum for positive result
        if (operation === "−" && bNum > aNum) {
            [a, b] = [b, a];
            [aNum, bNum] = [bNum, aNum];
        }

        const isAdd = operation === "+";
        const resultCoeff = isAdd ? aNum + bNum : aNum - bNum;

        let resultPower = power;
        let resultCoeffStr;

        if (resultCoeff >= 10) {
            resultPower += 1;
            resultCoeffStr = (resultCoeff / 10).toFixed(1);
        } else {
            resultCoeffStr = resultCoeff.toFixed(1);
        }

        const questionLatex = `${a} \\times 10^{${power}} ${operation === "+" ? "+" : "-"} ${b} \\times 10^{${power}} =`;
        const questionHtml = renderKatex(questionLatex) || `${a} × 10${exponentToSuperscript(power)} ${operation} ${b} × 10${exponentToSuperscript(power)} =`;
        const question = `${a} × 10${exponentToSuperscript(power)} ${operation} ${b} × 10${exponentToSuperscript(power)} =`;

        const answerLatex = `${resultCoeffStr} \\times 10^{${resultPower}}`;
        const answerHtml = renderKatex(answerLatex) || `${resultCoeffStr} × 10${exponentToSuperscript(resultPower)}`;
        const answer = `${resultCoeffStr} × 10${exponentToSuperscript(resultPower)}`;
        const numericAnswer = parseFloat(resultCoeffStr);
        const formatWrongAnswer = (num) => `${num.toFixed(1)} × 10${exponentToSuperscript(resultPower)}`;

        return { questionHtml, question, answer, answerHtml, wrongAnswers: generateNumericDistracters(numericAnswer, rand).map(formatWrongAnswer) };
    } else {
        // Different powers, need to convert
        const power1 = randInt(rand, 3, 6);
        const power2 = power1 - 1;
        const a = randInt(rand, 1, 5);
        const b = randInt(rand, 10, 99);

        // Convert b to same power as a
        // b × 10^(power2) = (b/10) × 10^(power1)
        const bConverted = b / 10;

        const operation = "+";
        const resultCoeff = a + bConverted;

        let resultPower = power1;
        let resultCoeffStr;

        if (resultCoeff >= 10) {
            resultPower += 1;
            resultCoeffStr = (resultCoeff / 10).toFixed(1);
        } else {
            resultCoeffStr = resultCoeff.toFixed(1);
        }

        const questionLatex = `${a} \\times 10^{${power1}} + ${b} \\times 10^{${power2}} =`;
        const questionHtml = renderKatex(questionLatex) || `${a} × 10${exponentToSuperscript(power1)} + ${b} × 10${exponentToSuperscript(power2)} =`;
        const question = `${a} × 10${exponentToSuperscript(power1)} + ${b} × 10${exponentToSuperscript(power2)} =`;

        const answerLatex = `${resultCoeffStr} \\times 10^{${resultPower}}`;
        const answerHtml = renderKatex(answerLatex) || `${resultCoeffStr} × 10${exponentToSuperscript(resultPower)}`;
        const answer = `${resultCoeffStr} × 10${exponentToSuperscript(resultPower)}`;
        const numericAnswer = parseFloat(resultCoeffStr);
        const formatWrongAnswer = (num) => `${num.toFixed(1)} × 10${exponentToSuperscript(resultPower)}`;

        return { questionHtml, question, answer, answerHtml, wrongAnswers: generateNumericDistracters(numericAnswer, rand).map(formatWrongAnswer) };
    }
}
