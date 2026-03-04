import { randInt, formatSignValue, formatCoeff, renderKatex } from "./utils.js";

export default {
    id: "equations-both-sides",
    label: "Equations: Letters on Both Sides",
    grades: [4, 5, 6],  // [easy, normal, hard]
    instruction(options = {}) {
        if (options.includeNegativeCoefficients) {
            return "Solve each equation, where letters appear on both sides. Some answers may be negative.";
        }
        return "Solve each equation, where letters appear on both sides.";
    },
    printTitle(options = {}) {
        return "Equations: Letters on Both Sides";
    },
    options: [
        {
            id: "includeNegativeCoefficients",
            label: "Include negative coefficients:",
            type: "checkbox",
            default: false,
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty, options));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, options = {}) {
    const includeNegative = options.includeNegativeCoefficients || false;
    let question = "";
    let answer = "";
    let latex = "";
    let answerLatex = "";

    if (difficulty === "easy") {
        // ax = bx + c form
        // x(a - b) = c, so x = c / (a - b)
        const x = randInt(rand, 1, 9);
        let a = randInt(rand, 3, 8);
        let b = randInt(rand, 1, 8);

        // With negative coefficients, each coefficient can independently be negative
        if (includeNegative) {
            if (randInt(rand, 0, 1) === 0) a = -a;
            if (randInt(rand, 0, 1) === 0) b = -b;
        }

        // Ensure a !== b
        let finalB = b;
        if (a === finalB) {
            finalB = a === 8 ? 7 : (a === -8 ? -7 : 8);
        }

        const c = x * (a - finalB);

        const { sign: cSign, abs: cAbs } = formatSignValue(c);
        const cSignLatex = cSign === "-" ? "-" : "+";

        question = `${formatCoeff(a, "x")} = ${formatCoeff(finalB, "x")} ${cSign} ${cAbs}`;
        latex = `${formatCoeff(a, "x")} = ${formatCoeff(finalB, "x")} ${cSignLatex} ${cAbs}`;
        answer = `x = ${x}`;
        answerLatex = `x = ${x}`;
    } else if (difficulty === "normal") {
        // ax + b = cx + d
        // x(a - c) = d - b, so x = (d - b) / (a - c)
        const x = randInt(rand, 1, 9);
        let a = randInt(rand, 2, 7);
        let c = randInt(rand, 1, 7);

        // With negative coefficients, each coefficient can independently be negative
        if (includeNegative) {
            if (randInt(rand, 0, 1) === 0) a = -a;
            if (randInt(rand, 0, 1) === 0) c = -c;
        }

        // Ensure a !== c
        let finalC = c;
        if (a === finalC) {
            finalC = a === 7 ? 2 : (a === -7 ? -2 : 7);
        }

        const b = randInt(rand, 1, 9);
        const d = b + x * (a - finalC);

        const { sign: bSign, abs: bAbs } = formatSignValue(b);
        const { sign: dSign, abs: dAbs } = formatSignValue(d);
        const bSignLatex = bSign === "-" ? "-" : "+";
        const dSignLatex = dSign === "-" ? "-" : "+";

        question = `${formatCoeff(a, "x")} ${bSign} ${bAbs} = ${formatCoeff(finalC, "x")} ${dSign} ${dAbs}`;
        latex = `${formatCoeff(a, "x")} ${bSignLatex} ${bAbs} = ${formatCoeff(finalC, "x")} ${dSignLatex} ${dAbs}`;
        answer = `x = ${x}`;
        answerLatex = `x = ${x}`;
    } else {
        // Hard: a(bx + c) = dx + e
        // abx + ac = dx + e
        // x(ab - d) = e - ac, so x = (e - ac) / (ab - d)
        const x = randInt(rand, 1, 8);
        const a = randInt(rand, 2, 4);
        let b = randInt(rand, 2, 4);
        let d = randInt(rand, 1, 12);

        // With negative coefficients, each coefficient can independently be negative
        if (includeNegative) {
            if (randInt(rand, 0, 1) === 0) b = -b;
            if (randInt(rand, 0, 1) === 0) d = -d;
        }

        const ab = a * b;

        // Ensure ab !== d
        let finalD = d;
        if (ab === finalD) {
            finalD = ab - 1;
        }

        const c = randInt(rand, 1, 5);
        const ac = a * c;
        const e = x * (ab - finalD) + ac;

        const { sign: cSign, abs: cAbs } = formatSignValue(c);
        const { sign: eSign, abs: eAbs } = formatSignValue(e);
        const cSignLatex = cSign === "-" ? "-" : "+";
        const eSignLatex = eSign === "-" ? "-" : "+";

        question = `${a}(${formatCoeff(b, "x")} ${cSign} ${cAbs}) = ${formatCoeff(finalD, "x")} ${eSign} ${eAbs}`;
        latex = `${a}(${formatCoeff(b, "x")} ${cSignLatex} ${cAbs}) = ${formatCoeff(finalD, "x")} ${eSignLatex} ${eAbs}`;
        answer = `x = ${x}`;
        answerLatex = `x = ${x}`;
    }

    // Render with KaTeX
    const questionHtml = renderKatex(latex) || question;
    const answerHtml = renderKatex(answerLatex) || answer;

    return { question, answer, questionHtml, answerHtml };
}
