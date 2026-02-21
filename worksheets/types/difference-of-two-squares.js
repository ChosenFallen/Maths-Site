import { randInt, renderKatex } from "./utils.js";

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
        if (difficulty === "easy") {
            // Pool-based shuffle: b from 2–21 = 20 unique problems
            const pool = [];
            for (let b = 2; b <= 21; b++) pool.push(b);
            let all = [...pool];
            while (all.length < count) all = all.concat([...pool]);
            for (let i = all.length - 1; i > 0; i--) {
                const j = Math.floor(rand() * (i + 1));
                [all[i], all[j]] = [all[j], all[i]];
            }
            return all.slice(0, count).map(makeEasyProblem);
        }

        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function makeEasyProblem(b) {
    const bSq = b * b;
    const question = `x² − ${bSq}`;
    const latex = `x^2 - ${bSq}`;
    const answer = `(x + ${b})(x − ${b})`;
    const katexHtml = renderKatex(latex);
    const questionHtml = katexHtml || question;
    return { questionHtml, question, answer };
}

function generateProblem(rand, difficulty) {
    let question = "";
    let latex = "";
    let answer = "";

    if (difficulty === "easy") {
        // x² - b² = (x + b)(x - b)  [only used for normal/hard path now]
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
