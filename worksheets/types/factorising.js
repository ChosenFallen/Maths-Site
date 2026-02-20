import { randInt, renderKatex, formatCoeff, formatSignValue } from "./utils.js";

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
        const { sign: cSign, abs: cAbs } = formatSignValue(actualC);
        const { sign: cSignLatex } = formatSignValue(actualC, false);

        question = `${fb}x ${cSign} ${cAbs}`;
        latex = `${fb}x ${cSignLatex} ${cAbs}`;
        answer = `${f}(${b}x ${cSign} ${cAbs})`;
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
            const { sign: cSign, abs: cAbs } = formatSignValue(actualC);
            const { sign: cSignLatex } = formatSignValue(actualC, false);

            question = `${fb}x ${cSign} ${cAbs}y`;
            latex = `${fb}x ${cSignLatex} ${cAbs}y`;
            answer = `${f}(${b}x ${cSign} ${cAbs}y)`;
        } else {
            // Type B: factor x from ax + bx²
            const a = randInt(rand, 1, 9);
            const b = randInt(rand, 1, 5);
            const bx = b;

            const isNegativeA = randInt(rand, 0, 1) === 0;
            const actualA = isNegativeA ? -a : a;
            const { sign: aSign, abs: aAbs } = formatSignValue(actualA);
            const { sign: aSignLatex } = formatSignValue(actualA, false);

            question = `${b}x² ${aSign} ${aAbs}x`;
            latex = `${b}x^2 ${aSignLatex} ${aAbs}x`;
            answer = `x(${b}x ${aSign} ${aAbs})`;
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
        const { sign: bSign, abs: bAbs } = formatSignValue(actualB);
        const { sign: bSignLatex } = formatSignValue(actualB, false);

        question = `${fa}x² ${bSign} ${bAbs}x`;
        latex = `${fa}x^2 ${bSignLatex} ${bAbs}x`;
        answer = `${f}x(${a}x ${bSign} ${bAbs})`;
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
