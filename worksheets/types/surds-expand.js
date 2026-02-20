import {
    randInt,
    renderKatex,
    formatSurdLatex,
    formatSurdText,
    formatAnswerWithSurd,
    formatAnswerWithSurdLatex,
} from "./utils.js";

export default {
    id: "surds-expand",
    label: "Surd Expansion",
    instruction() {
        return "Expand and simplify each expression.";
    },
    printTitle() {
        return "Surd Expansion";
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
        // Two types: single bracket
        const typeA = randInt(rand, 0, 1) === 0;

        if (typeA) {
            // Type A: a(b + c√k) = ab + ac√k
            const a = randInt(rand, 2, 4);
            const b = randInt(rand, 1, 5);
            const c = randInt(rand, 1, 3);
            const kOptions = [2, 3, 5, 7];
            const k = kOptions[randInt(rand, 0, kOptions.length - 1)];

            const intPart = a * b;
            const surdCoeff = a * c;

            const questionLatex = `${a}(${b} + ${c}\\sqrt{${k}})`;
            const answerLatex = formatAnswerWithSurdLatex(intPart, surdCoeff, k);
            const answerText = formatAnswerWithSurd(intPart, surdCoeff, k);

            const questionHtml = renderKatex(questionLatex) || questionLatex;
            const answerHtml = renderKatex(answerLatex) || answerText;

            return {
                questionHtml,
                question: `${a}(${b} + ${c}√${k})`,
                answer: answerText,
                answerHtml,
            };
        } else {
            // Type B: √k(a + b√k) = a√k + bk
            const kOptions = [2, 3, 5];
            const k = kOptions[randInt(rand, 0, kOptions.length - 1)];
            const a = randInt(rand, 1, 4);
            const b = randInt(rand, 1, 3);

            const surdCoeff = a;
            const intPart = b * k;

            const questionLatex = `\\sqrt{${k}}(${a} + ${b}\\sqrt{${k}})`;
            const answerLatex = formatAnswerWithSurdLatex(intPart, surdCoeff, k);
            const answerText = formatAnswerWithSurd(intPart, surdCoeff, k);

            const questionHtml = renderKatex(questionLatex) || questionLatex;
            const answerHtml = renderKatex(answerLatex) || answerText;

            return {
                questionHtml,
                question: `√${k}(${a} + ${b}√${k})`,
                answer: answerText,
                answerHtml,
            };
        }
    } else if (difficulty === "normal") {
        // Double brackets: (a + √k)(b + √k) = ab + (a+b)√k + k = (ab+k) + (a+b)√k
        const a = randInt(rand, 1, 5);
        const b = randInt(rand, 1, 5);
        const kOptions = [2, 3, 5, 7];
        const k = kOptions[randInt(rand, 0, kOptions.length - 1)];

        const intPart = a * b + k;
        const surdCoeff = a + b;

        const questionLatex = `(${a} + \\sqrt{${k}})(${b} + \\sqrt{${k}})`;
        const answerLatex = formatAnswerWithSurdLatex(intPart, surdCoeff, k);
        const answerText = formatAnswerWithSurd(intPart, surdCoeff, k);

        const questionHtml = renderKatex(questionLatex) || questionLatex;
        const answerHtml = renderKatex(answerLatex) || answerText;

        return {
            questionHtml,
            question: `(${a} + √${k})(${b} + √${k})`,
            answer: answerText,
            answerHtml,
        };
    } else {
        // Hard: (a + b√k)² = a² + 2ab√k + b²k = (a² + b²k) + 2ab√k
        const a = randInt(rand, 1, 4);
        const b = randInt(rand, 1, 3);
        const kOptions = [2, 3, 5, 7];
        const k = kOptions[randInt(rand, 0, kOptions.length - 1)];

        const intPart = a * a + b * b * k;
        const surdCoeff = 2 * a * b;

        const questionLatex = `(${a} + ${b}\\sqrt{${k}})^2`;
        const answerLatex = formatAnswerWithSurdLatex(intPart, surdCoeff, k);
        const answerText = formatAnswerWithSurd(intPart, surdCoeff, k);

        const questionHtml = renderKatex(questionLatex) || questionLatex;
        const answerHtml = renderKatex(answerLatex) || answerText;

        return {
            questionHtml,
            question: `(${a} + ${b}√${k})²`,
            answer: answerText,
            answerHtml,
        };
    }
}
