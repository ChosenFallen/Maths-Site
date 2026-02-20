import { randInt, renderKatex, formatCoeff, formatSignValue } from "./utils.js";

export default {
    id: "expanding-brackets",
    label: "Expanding Brackets",
    instruction(options = {}) {
        const mode = options.bracketMode || "single";
        if (mode === "single") return "Expand the brackets and simplify.";
        if (mode === "double") return "Expand the double brackets and simplify.";
        return "Expand the brackets and simplify.";
    },
    printTitle(options = {}) {
        const mode = options.bracketMode || "mixed";
        if (mode === "single") return "Expanding Single Brackets";
        if (mode === "double") return "Expanding Double Brackets";
        return "Expanding Brackets";
    },
    options: [
        {
            id: "bracketMode",
            label: "Bracket Type:",
            type: "select",
            default: "single",
            values: [
                { value: "single", label: "Single Brackets" },
                { value: "double", label: "Double Brackets" },
                { value: "mixed", label: "Mixed" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const mode = options.bracketMode || "single";
        const problems = [];
        for (let i = 0; i < count; i++) {
            const bracketType = mode === "mixed"
                ? (randInt(rand, 0, 1) === 0 ? "single" : "double")
                : mode;
            problems.push(generateProblem(rand, difficulty, bracketType));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, bracketType) {
    if (bracketType === "double") {
        return generateDoubleExpandProblem(rand, difficulty);
    }

    // Single bracket expansion: a(bx + c) or a(bx + cy + d)
    let a, b, c, d;
    let expression = "";
    let latex = "";
    let answer = "";

    if (difficulty === "easy") {
        // a(bx + c) format
        a = randInt(rand, 2, 5);
        b = randInt(rand, 1, 5);
        c = randInt(rand, 1, 9);

        expression = `${a}(${formatCoeff(b, "x")} + ${c})`;
        latex = `${a}(${formatCoeff(b, "x")} + ${c})`;
        answer = `${a * b}x + ${a * c}`;
    } else if (difficulty === "normal") {
        // a(bx + c) or a(bx + cy) with possible negatives
        a = randInt(rand, 2, 8);
        b = randInt(rand, 1, 5);
        c = randInt(rand, 1, 9);

        if (randInt(rand, 0, 1) === 0) {
            // a(bx + c)
            const isNegativeC = randInt(rand, 0, 1) === 0;
            const actualC = isNegativeC ? -c : c;
            const { sign: cSign, abs: cAbs } = formatSignValue(actualC);
            const { sign: cSignLatex } = formatSignValue(actualC, false);
            expression = `${a}(${formatCoeff(b, "x")} ${cSign} ${cAbs})`;
            latex = `${a}(${formatCoeff(b, "x")} ${cSignLatex} ${cAbs})`;

            const answerXCoeff = a * b;
            const answerConst = a * actualC;
            const { sign: answerSign, abs: answerAbs } = formatSignValue(answerConst);
            answer = `${answerXCoeff}x ${answerSign} ${answerAbs}`;
        } else {
            // a(bx + cy)
            const d = randInt(rand, 1, 5);
            const isNegativeD = randInt(rand, 0, 1) === 0;
            const actualD = isNegativeD ? -d : d;
            const { sign: dSign, abs: dAbs } = formatSignValue(actualD);
            const { sign: dSignLatex } = formatSignValue(actualD, false);
            expression = `${a}(${formatCoeff(b, "x")} ${dSign} ${dAbs}y)`;
            latex = `${a}(${formatCoeff(b, "x")} ${dSignLatex} ${dAbs}y)`;

            const answerXCoeff = a * b;
            const answerYCoeff = a * actualD;
            const { sign: ySign, abs: yAbs } = formatSignValue(answerYCoeff);
            answer = `${answerXCoeff}x ${ySign} ${yAbs}y`;
        }
    } else {
        // Hard: a(bx + cy + d) with larger coefficients
        a = randInt(rand, 3, 10);
        b = randInt(rand, 1, 6);
        c = randInt(rand, 1, 6);
        d = randInt(rand, 1, 9);

        const isNegativeC = randInt(rand, 0, 1) === 0;
        const isNegativeD = randInt(rand, 0, 1) === 0;
        const actualC = isNegativeC ? -c : c;
        const actualD = isNegativeD ? -d : d;

        const { sign: cSign, abs: cAbs } = formatSignValue(actualC);
        const { sign: cSignLatex } = formatSignValue(actualC, false);
        const { sign: dSign, abs: dAbs } = formatSignValue(actualD);
        const { sign: dSignLatex } = formatSignValue(actualD, false);

        expression = `${a}(${formatCoeff(b, "x")} ${cSign} ${cAbs}y ${dSign} ${dAbs})`;
        latex = `${a}(${formatCoeff(b, "x")} ${cSignLatex} ${cAbs}y ${dSignLatex} ${dAbs})`;

        const answerXCoeff = a * b;
        const answerYCoeff = a * actualC;
        const answerConst = a * actualD;

        const { sign: ySign, abs: yAbs } = formatSignValue(answerYCoeff);
        const { sign: constSign, abs: constAbs } = formatSignValue(answerConst);
        answer = `${answerXCoeff}x ${ySign} ${yAbs}y ${constSign} ${constAbs}`;
    }

    // Render with KaTeX
    const katexHtml = renderKatex(latex);
    const questionHtml = katexHtml || expression;

    return {
        questionHtml,
        question: expression,
        answer,
    };
}

function generateDoubleExpandProblem(rand, difficulty) {
    let expression = "";
    let latex = "";
    let answer = "";

    if (difficulty === "easy") {
        // (x + a)(x + b) format
        const a = randInt(rand, 1, 5);
        const b = randInt(rand, 1, 5);

        expression = `(x + ${a})(x + ${b})`;
        latex = `(x + ${a})(x + ${b})`;

        const coeff = a + b;
        const constant = a * b;
        answer = `x² + ${coeff}x + ${constant}`;
    } else if (difficulty === "normal") {
        // (x + a)(x + b) with possible negatives or (2x + a)(x + b)
        if (randInt(rand, 0, 1) === 0) {
            // (x ± a)(x ± b)
            const a = randInt(rand, 1, 6);
            const b = randInt(rand, 1, 6);
            const isNegativeA = randInt(rand, 0, 1) === 0;
            const isNegativeB = randInt(rand, 0, 1) === 0;

            const actualA = isNegativeA ? -a : a;
            const actualB = isNegativeB ? -b : b;

            const aSign = actualA >= 0 ? "+" : "−";
            const bSign = actualB >= 0 ? "+" : "−";

            expression = `(x ${aSign} ${Math.abs(actualA)})(x ${bSign} ${Math.abs(actualB)})`;
            latex = `(x ${aSign === "−" ? "-" : "+"} ${Math.abs(actualA)})(x ${bSign === "−" ? "-" : "+"} ${Math.abs(actualB)})`;

            const coeff = actualA + actualB;
            const constant = actualA * actualB;
            const coeffSign = coeff >= 0 ? "+" : "−";
            const constSign = constant >= 0 ? "+" : "−";

            answer = `x² ${coeffSign} ${Math.abs(coeff)}x ${constSign} ${Math.abs(constant)}`;
        } else {
            // (ax + b)(x + c)
            const a = randInt(rand, 2, 4);
            const b = randInt(rand, 1, 5);
            const c = randInt(rand, 1, 5);

            expression = `(${a}x + ${b})(x + ${c})`;
            latex = `(${a}x + ${b})(x + ${c})`;

            const x2Coeff = a;
            const xCoeff = a * c + b;
            const constant = b * c;
            answer = `${x2Coeff}x² + ${xCoeff}x + ${constant}`;
        }
    } else {
        // Hard: (ax + b)(cx + d) with more variety
        const a = randInt(rand, 1, 5);
        const b = randInt(rand, 1, 6);
        const c = randInt(rand, 1, 5);
        const d = randInt(rand, 1, 6);

        const isNegativeB = randInt(rand, 0, 1) === 0;
        const isNegativeD = randInt(rand, 0, 1) === 0;

        const actualB = isNegativeB ? -b : b;
        const actualD = isNegativeD ? -d : d;

        const bSign = actualB >= 0 ? "+" : "−";
        const dSign = actualD >= 0 ? "+" : "−";

        expression = `(${formatCoeff(a, "x")} ${bSign} ${Math.abs(actualB)})(${formatCoeff(c, "x")} ${dSign} ${Math.abs(actualD)})`;
        latex = `(${formatCoeff(a, "x")} ${bSign === "−" ? "-" : "+"} ${Math.abs(actualB)})(${formatCoeff(c, "x")} ${dSign === "−" ? "-" : "+"} ${Math.abs(actualD)})`;

        const x2Coeff = a * c;
        const xCoeff = a * actualD + actualB * c;
        const constant = actualB * actualD;

        const xSign = xCoeff >= 0 ? "+" : "−";
        const constSign = constant >= 0 ? "+" : "−";

        if (x2Coeff === 1) {
            answer = `x² ${xSign} ${Math.abs(xCoeff)}x ${constSign} ${Math.abs(constant)}`;
        } else {
            answer = `${x2Coeff}x² ${xSign} ${Math.abs(xCoeff)}x ${constSign} ${Math.abs(constant)}`;
        }
    }

    // Render with KaTeX
    const katexHtml = renderKatex(latex);
    const questionHtml = katexHtml || expression;

    return {
        questionHtml,
        question: expression,
        answer,
    };
}
