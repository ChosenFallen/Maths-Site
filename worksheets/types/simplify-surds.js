import { randInt, renderKatex } from "./utils.js";

// Square-free numbers (no repeated prime factors)
const SQUARE_FREE_EASY = [2, 3, 5, 7, 11, 13];
const SQUARE_FREE_NORMAL = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];
const SQUARE_FREE_HARD = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22];

export default {
    id: "simplify-surds",
    label: "Simplifying Surds",
    instruction() {
        return "Write each surd in its simplest form.";
    },
    printTitle() {
        return "Simplifying Surds";
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
    let a, b;

    if (difficulty === "easy") {
        a = randInt(rand, 2, 6);
        const bList = SQUARE_FREE_EASY;
        b = bList[randInt(rand, 0, bList.length - 1)];
    } else if (difficulty === "normal") {
        a = randInt(rand, 2, 8);
        const bList = SQUARE_FREE_NORMAL;
        b = bList[randInt(rand, 0, bList.length - 1)];
    } else {
        // Hard
        a = randInt(rand, 3, 10);
        const bList = SQUARE_FREE_HARD;
        b = bList[randInt(rand, 0, bList.length - 1)];
    }

    // Question number: a² × b (the number under the radical)
    const n = a * a * b;

    // Question: √n
    const questionLatex = `\\sqrt{${n}}`;
    const questionText = `√${n}`;

    // Answer: a√b
    const answerLatex = `${a}\\sqrt{${b}}`;
    const answerText = `${a}√${b}`;

    // Render with KaTeX
    const questionHtml = renderKatex(questionLatex) || questionText;
    const answerHtml = renderKatex(answerLatex) || answerText;

    return {
        questionHtml,
        question: questionText,
        answer: answerText,
        answerHtml,
    };
}
