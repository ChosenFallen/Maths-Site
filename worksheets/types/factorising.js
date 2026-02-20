import { randInt } from "./utils.js";

// Helper function to render KaTeX
function renderKatex(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

// Format coefficient, handling 1 and -1 specially
function formatCoeff(coeff, variable) {
    if (coeff === 1) return variable;
    if (coeff === -1) return `-${variable}`;
    return `${coeff}${variable}`;
}

export default {
    id: "factorising",
    label: "Factorising Expressions",
    instruction() {
        return "Factorise each expression fully.";
    },
    printTitle() {
        return "Factorising Expressions";
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
    let questionHtml = "";
    let answer = "";

    if (difficulty === "easy") {
        // Factor a number: fx + fy = f(x + y)
        const f = randInt(rand, 2, 5);
        const b = randInt(rand, 1, 5);
        const c = randInt(rand, 1, 9);
        const fb = f * b;
        const fc = f * c;

        const isNegativeC = randInt(rand, 0, 1) === 0;
        const actualC = isNegativeC ? -c : c;
        const cSign = actualC >= 0 ? "+" : "−";

        question = `${fb}x ${cSign} ${Math.abs(actualC)}`;
        latex = question.replace(/−/g, "-");
        answer = `${f}(${b}x ${cSign} ${Math.abs(actualC)})`;
    } else if (difficulty === "normal") {
        // 50% factor number from two variables, 50% factor x from ax + bx²
        if (randInt(rand, 0, 1) === 0) {
            // Type A: factor number from fx + fy = f(x + y)
            const f = randInt(rand, 2, 5);
            const b = randInt(rand, 1, 5);
            const c = randInt(rand, 1, 5);
            const fb = f * b;
            const fc = f * c;

            const isNegativeC = randInt(rand, 0, 1) === 0;
            const actualC = isNegativeC ? -c : c;
            const cSign = actualC >= 0 ? "+" : "−";

            question = `${fb}x ${cSign} ${Math.abs(actualC)}y`;
            latex = question.replace(/−/g, "-");
            answer = `${f}(${b}x ${cSign} ${Math.abs(actualC)}y)`;
        } else {
            // Type B: factor x from ax + bx²
            const a = randInt(rand, 1, 9);
            const b = randInt(rand, 1, 5);
            const bx = b;

            const isNegativeA = randInt(rand, 0, 1) === 0;
            const actualA = isNegativeA ? -a : a;
            const aSign = actualA >= 0 ? "+" : "−";

            question = `${b}x² ${aSign} ${Math.abs(actualA)}x`;
            latex = `${b}x^2 ${aSign === "−" ? "-" : "+"} ${Math.abs(actualA)}x`;
            answer = `x(${b}x ${aSign} ${Math.abs(actualA)})`;
        }
    } else {
        // Hard: factor fx from (fa)x² + (fb)x
        const f = randInt(rand, 2, 5);
        const a = randInt(rand, 2, 5);
        const b = randInt(rand, 1, 9);
        const fa = f * a;
        const fb = f * b;

        const isNegativeB = randInt(rand, 0, 1) === 0;
        const actualB = isNegativeB ? -b : b;
        const bSign = actualB >= 0 ? "+" : "−";

        question = `${fa}x² ${bSign} ${Math.abs(actualB)}x`;
        latex = `${fa}x^2 ${bSign === "−" ? "-" : "+"} ${Math.abs(actualB)}x`;
        answer = `${f}x(${a}x ${bSign} ${Math.abs(actualB)})`;
    }

    // Render with KaTeX (only for hard, which has x²)
    if (difficulty === "hard") {
        const katexHtml = renderKatex(latex);
        questionHtml = katexHtml || question;
    } else {
        questionHtml = question;
    }

    return {
        questionHtml,
        question,
        answer,
    };
}
