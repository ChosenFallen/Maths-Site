import { randInt, lcm, renderKatex } from "./utils.js";

export default {
    id: "equations-fractions",
    label: "Equations with Fractions",
    grades: [5, 6, 7],  // [easy, normal, hard]
    instruction() {
        return "Solve each equation.";
    },
    printTitle() {
        return "Equations with Fractions";
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
    let answerLatex = "";

    if (difficulty === "easy") {
        // x/a = N form
        // Pick a and N, set x = a*N
        const a = randInt(rand, 2, 8);
        const N = randInt(rand, 2, 10);
        const x = a * N;

        question = `x/${a} = ${N}`;
        latex = `\\dfrac{x}{${a}} = ${N}`;
        answer = `x = ${x}`;
        answerLatex = `x = ${x}`;
    } else if (difficulty === "normal") {
        // (x + b)/a = c form
        // Pick a, c, b, set x = a*c - b
        const a = randInt(rand, 2, 6);
        const c = randInt(rand, 2, 10);
        const b = randInt(rand, 1, 8);
        const x = a * c - b;

        question = `(x + ${b})/${a} = ${c}`;
        latex = `\\dfrac{x + ${b}}{${a}} = ${c}`;
        answer = `x = ${x}`;
        answerLatex = `x = ${x}`;
    } else {
        // x/a + x/b = c form
        // Pick a, b (a != b), then x = lcm(a,b) * k, c = x/a + x/b
        const a = randInt(rand, 2, 5);
        const b = randInt(rand, 3, 6);
        // Ensure a != b
        if (a === b) {
            const alt = (b === 5) ? 2 : 5;
            const x = lcm(a, alt);
            const k = randInt(rand, 1, 4);
            const xVal = x * k;
            const c = Math.round(xVal / a + xVal / alt);

            question = `x/${a} + x/${alt} = ${c}`;
            latex = `\\dfrac{x}{${a}} + \\dfrac{x}{${alt}} = ${c}`;
            answer = `x = ${xVal}`;
            answerLatex = `x = ${xVal}`;

            const questionHtml = renderKatex(latex) || question;
            const answerHtml = renderKatex(answerLatex) || answer;
            return { question, questionHtml, answer, answerHtml };
        }

        const k = randInt(rand, 1, 4);
        const l = lcm(a, b);
        const x = l * k;
        const c = Math.round(x / a + x / b);

        question = `x/${a} + x/${b} = ${c}`;
        latex = `\\dfrac{x}{${a}} + \\dfrac{x}{${b}} = ${c}`;
        answer = `x = ${x}`;
        answerLatex = `x = ${x}`;
    }

    const questionHtml = renderKatex(latex) || question;
    const answerHtml = renderKatex(answerLatex) || answer;

    return { question, questionHtml, answer, answerHtml };
}
