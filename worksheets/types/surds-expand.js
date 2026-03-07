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
    grades: [8, 8, 9],  // [easy, normal, hard]
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

            // Wrong answers: common mistakes in expansion
            const wrongAnswers = [];
            // Mistake 1: forgot to multiply inside - just distribute a to first term
            wrongAnswers.push(formatAnswerWithSurd(a * b, c, k));
            // Mistake 2: multiplied by a but forgot the surd gets it too
            if (surdCoeff !== c) wrongAnswers.push(formatAnswerWithSurd(intPart, c, k));
            // Mistake 3: wrong distribution (common error)
            wrongAnswers.push(formatAnswerWithSurd(b, a * c, k));

            return {
                questionHtml,
                question: `${a}(${b} + ${c}√${k})`,
                answer: answerText,
                answerHtml,
                wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answerText).slice(0, 3),
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

            // Wrong answers
            const wrongAnswers = [];
            // Mistake 1: forgot to multiply the first term by √k
            wrongAnswers.push(formatAnswerWithSurd(0, a, k));
            // Mistake 2: forgot the b√k term
            wrongAnswers.push(formatAnswerWithSurd(intPart, 0, k));
            // Mistake 3: wrong multiplication in second term
            wrongAnswers.push(formatAnswerWithSurd(intPart, a + b, k));

            return {
                questionHtml,
                question: `√${k}(${a} + ${b}√${k})`,
                answer: answerText,
                answerHtml,
                wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answerText).slice(0, 3),
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

        // Wrong answers: common mistakes in double bracket expansion
        const wrongAnswers = [];
        // Mistake 1: forgot the k term in the integer part (just ab + (a+b)√k)
        wrongAnswers.push(formatAnswerWithSurd(a * b, a + b, k));
        // Mistake 2: forgot the cross terms (just a*b + b*b*k)
        wrongAnswers.push(formatAnswerWithSurd(a * b + k, 0, k));
        // Mistake 3: only did partial distribution
        wrongAnswers.push(formatAnswerWithSurd(a * b, b, k));

        return {
            questionHtml,
            question: `(${a} + √${k})(${b} + √${k})`,
            answer: answerText,
            answerHtml,
            wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answerText).slice(0, 3),
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

        // Wrong answers: common mistakes in squaring
        const wrongAnswers = [];
        // Mistake 1: forgot the middle term (a² + b²k)
        wrongAnswers.push(formatAnswerWithSurd(a * a, b * b, k));
        // Mistake 2: used ab instead of 2ab (a² + ab√k + b²k)
        wrongAnswers.push(formatAnswerWithSurd(a * a + b * b * k, a * b, k));
        // Mistake 3: just squared the bracket naively
        wrongAnswers.push(formatAnswerWithSurd(a * a + b, b, k));

        return {
            questionHtml,
            question: `(${a} + ${b}√${k})²`,
            answer: answerText,
            answerHtml,
            wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answerText).slice(0, 3),
        };
    }
}
