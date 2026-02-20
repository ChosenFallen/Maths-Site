import { randInt, renderKatex, formatCoeff, formatSignValue } from "./utils.js";

export default {
    id: "factorising-quadratics",
    label: "Factorising Quadratics",
    instruction() {
        return "Factorise each quadratic expression.";
    },
    printTitle() {
        return "Factorising Quadratics";
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
        // (x + p)(x + q) = x² + (p+q)x + pq
        // Pick p and q such that they're not too large
        let p = randInt(rand, 1, 6);
        let q = randInt(rand, 1, 6);

        // Randomly use negative values
        const isNegativeP = randInt(rand, 0, 1) === 0;
        const isNegativeQ = randInt(rand, 0, 1) === 0;
        const actualP = isNegativeP ? -p : p;
        const actualQ = isNegativeQ ? -q : q;

        const b = actualP + actualQ;
        const c = actualP * actualQ;

        const { sign: bSign, abs: bAbs } = formatSignValue(b);
        const { sign: bSignLatex } = formatSignValue(b, false);
        const { sign: cSign, abs: cAbs } = formatSignValue(c);
        const { sign: cSignLatex } = formatSignValue(c, false);

        question = `x² ${bSign} ${bAbs}x ${cSign} ${cAbs}`;
        latex = `x^2 ${bSignLatex} ${bAbs}x ${cSignLatex} ${cAbs}`;

        // Format answer: (x + p)(x + q)
        const { sign: pSign, abs: pAbs } = formatSignValue(actualP);
        const { sign: qSign, abs: qAbs } = formatSignValue(actualQ);

        answer = `(x ${pSign} ${pAbs})(x ${qSign} ${qAbs})`;
    } else if (difficulty === "normal") {
        // 50% chance: (x + p)(x + q), 50% chance: (2x + p)(x + q) or (3x + p)(x + q)
        if (randInt(rand, 0, 1) === 0) {
            // (x + p)(x + q) format
            let p = randInt(rand, 1, 6);
            let q = randInt(rand, 1, 6);
            const isNegativeP = randInt(rand, 0, 1) === 0;
            const isNegativeQ = randInt(rand, 0, 1) === 0;
            const actualP = isNegativeP ? -p : p;
            const actualQ = isNegativeQ ? -q : q;

            const b = actualP + actualQ;
            const c = actualP * actualQ;

            const { sign: bSign, abs: bAbs } = formatSignValue(b);
            const { sign: bSignLatex } = formatSignValue(b, false);
            const { sign: cSign, abs: cAbs } = formatSignValue(c);
            const { sign: cSignLatex } = formatSignValue(c, false);

            question = `x² ${bSign} ${bAbs}x ${cSign} ${cAbs}`;
            latex = `x^2 ${bSignLatex} ${bAbs}x ${cSignLatex} ${cAbs}`;

            const { sign: pSign, abs: pAbs } = formatSignValue(actualP);
            const { sign: qSign, abs: qAbs } = formatSignValue(actualQ);

            answer = `(x ${pSign} ${pAbs})(x ${qSign} ${qAbs})`;
        } else {
            // (ax + p)(x + q) where a = 2 or 3
            const a = randInt(rand, 2, 3);
            let p = randInt(rand, 1, 5);
            let q = randInt(rand, 1, 5);
            const isNegativeP = randInt(rand, 0, 1) === 0;
            const isNegativeQ = randInt(rand, 0, 1) === 0;
            const actualP = isNegativeP ? -p : p;
            const actualQ = isNegativeQ ? -q : q;

            const aCoeff = a;
            const bCoeff = a * actualQ + actualP;
            const cCoeff = actualP * actualQ;

            const { sign: bSign, abs: bAbs } = formatSignValue(bCoeff);
            const { sign: bSignLatex } = formatSignValue(bCoeff, false);
            const { sign: cSign, abs: cAbs } = formatSignValue(cCoeff);
            const { sign: cSignLatex } = formatSignValue(cCoeff, false);

            question = `${aCoeff}x² ${bSign} ${bAbs}x ${cSign} ${cAbs}`;
            latex = `${aCoeff}x^2 ${bSignLatex} ${bAbs}x ${cSignLatex} ${cAbs}`;

            const { sign: pSign, abs: pAbs } = formatSignValue(actualP);
            const { sign: qSign, abs: qAbs } = formatSignValue(actualQ);

            answer = `(${a}x ${pSign} ${pAbs})(x ${qSign} ${qAbs})`;
        }
    } else {
        // Hard: (ax + p)(bx + q) where a, b >= 2
        const a = randInt(rand, 2, 4);
        const b = randInt(rand, 2, 4);
        let p = randInt(rand, 1, 4);
        let q = randInt(rand, 1, 4);
        const isNegativeP = randInt(rand, 0, 1) === 0;
        const isNegativeQ = randInt(rand, 0, 1) === 0;
        const actualP = isNegativeP ? -p : p;
        const actualQ = isNegativeQ ? -q : q;

        const aCoeff = a * b;
        const bCoeff = a * actualQ + b * actualP;
        const cCoeff = actualP * actualQ;

        const { sign: bSign, abs: bAbs } = formatSignValue(bCoeff);
        const { sign: bSignLatex } = formatSignValue(bCoeff, false);
        const { sign: cSign, abs: cAbs } = formatSignValue(cCoeff);
        const { sign: cSignLatex } = formatSignValue(cCoeff, false);

        question = `${aCoeff}x² ${bSign} ${bAbs}x ${cSign} ${cAbs}`;
        latex = `${aCoeff}x^2 ${bSignLatex} ${bAbs}x ${cSignLatex} ${cAbs}`;

        const { sign: pSign, abs: pAbs } = formatSignValue(actualP);
        const { sign: qSign, abs: qAbs } = formatSignValue(actualQ);

        answer = `(${a}x ${pSign} ${pAbs})(${b}x ${qSign} ${qAbs})`;
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
