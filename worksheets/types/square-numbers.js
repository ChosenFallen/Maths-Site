import { randInt } from "./utils.js";

export default {
    id: "square-numbers",
    label: "Square Numbers & Square Roots",
    instruction() {
        return "Calculate the square or square root of each number.";
    },
    printTitle() {
        return "Square Numbers & Square Roots";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function renderKatex(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}

function generateProblem(rand, difficulty) {
    let maxBase = 10;
    if (difficulty === "normal") maxBase = 15;
    if (difficulty === "hard") maxBase = 20;

    // Pick base and sign
    const base = randInt(rand, 1, maxBase);
    const isNegative = difficulty === "easy" ? false : randInt(rand, 0, 1) === 0;
    const signedBase = isNegative ? -base : base;

    // 50/50: square or square root
    const isSquare = randInt(rand, 0, 1) === 0;

    if (isSquare) {
        // Type A: square the number
        const answer = signedBase * signedBase;

        let latex;
        if (signedBase < 0) {
            latex = `(${signedBase})^2`;
        } else {
            latex = `${signedBase}^2`;
        }

        const questionHtml = renderKatex(latex) || `${signedBase}²`;
        return { questionHtml, answer: formatNum(answer) };
    } else {
        // Type B: square root
        const radicand = signedBase * signedBase;
        const answer = Math.abs(signedBase); // Square roots are always non-negative

        const latex = `\\sqrt{${radicand}}`;
        const questionHtml = renderKatex(latex) || `√(${radicand})`;

        return { questionHtml, answer: formatNum(answer) };
    }
}
