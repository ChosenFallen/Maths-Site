import { randInt } from "./utils.js";

// Helper function to render KaTeX
function renderKatex(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

export default {
    id: "difference-of-two-squares",
    label: "Difference of Two Squares",
    instruction() {
        return "Factorise each expression.";
    },
    printTitle() {
        return "Difference of Two Squares";
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
    let question = "";
    let latex = "";
    let answer = "";

    if (difficulty === "easy") {
        // x² - b² = (x + b)(x - b)
        const b = randInt(rand, 2, 15);
        const bSq = b * b;

        question = `x² − ${bSq}`;
        latex = `x^2 - ${bSq}`;
        answer = `(x + ${b})(x − ${b})`;
    } else if (difficulty === "normal") {
        // (ax)² - b² = (ax + b)(ax - b)
        const a = randInt(rand, 2, 4);
        const b = randInt(rand, 2, 15);
        const aSq = a * a;
        const bSq = b * b;

        question = `${aSq}x² − ${bSq}`;
        latex = `${aSq}x^2 - ${bSq}`;
        answer = `(${a}x + ${b})(${a}x − ${b})`;
    } else {
        // (ax)² - b² = (ax + b)(ax - b)
        const a = randInt(rand, 2, 5);
        const b = randInt(rand, 2, 10);
        const aSq = a * a;
        const bSq = b * b;

        question = `${aSq}x² − ${bSq}`;
        latex = `${aSq}x^2 - ${bSq}`;
        answer = `(${a}x + ${b})(${a}x − ${b})`;
    }

    // Render with KaTeX
    const katexHtml = renderKatex(latex);
    const questionHtml = katexHtml || question;

    return {
        questionHtml,
        question,
        answer,
    };
}
