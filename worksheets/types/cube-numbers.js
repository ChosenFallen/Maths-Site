import { randInt } from "./utils.js";

export default {
    id: "cube-numbers",
    label: "Cube Numbers & Cube Roots",
    instruction() {
        return "Calculate the cube or cube root of each number.";
    },
    printTitle() {
        return "Cube Numbers & Cube Roots";
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
    let maxBase = 5;
    if (difficulty === "normal") maxBase = 8;
    if (difficulty === "hard") maxBase = 12;

    // Pick base and sign
    const base = randInt(rand, 1, maxBase);
    const isNegative = difficulty === "easy" ? false : randInt(rand, 0, 1) === 0;
    const signedBase = isNegative ? -base : base;

    // 50/50: cube or cube root
    const isCube = randInt(rand, 0, 1) === 0;

    if (isCube) {
        // Type A: cube the number
        const answer = signedBase * signedBase * signedBase;

        let latex;
        if (signedBase < 0) {
            latex = `(${signedBase})^3`;
        } else {
            latex = `${signedBase}^3`;
        }

        const questionHtml = renderKatex(latex) || `${signedBase}³`;
        return { questionHtml, answer: formatNum(answer) };
    } else {
        // Type B: cube root
        const radicand = signedBase * signedBase * signedBase;
        const answer = signedBase;

        const latex = `\\sqrt[3]{${radicand}}`;
        const questionHtml = renderKatex(latex) || `∛(${radicand})`;

        return { questionHtml, answer: formatNum(answer) };
    }
}
