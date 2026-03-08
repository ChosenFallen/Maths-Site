import {
    randInt, renderKatex, formatCoeff,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "multiplying-terms",
    label: "Multiplying and Dividing Terms",
    grades: [4, 5, 6],  // [easy, normal, hard]
    instruction(options = {}) {
        const mode = options.multiplyingTermsMode || "mixed";
        if (mode === "multiply") return "Simplify by multiplying the terms.";
        if (mode === "divide") return "Simplify by dividing the terms.";
        return "Simplify each expression.";
    },
    printTitle(options = {}) {
        const mode = options.multiplyingTermsMode || "mixed";
        if (mode === "multiply") return "Multiplying Terms";
        if (mode === "divide") return "Dividing Terms";
        return "Multiplying and Dividing Terms";
    },
    options: [
        {
            id: "multiplyingTermsMode",
            label: "Operation:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "multiply", label: "Multiply" },
                { value: "divide", label: "Divide" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const mode = options.multiplyingTermsMode || "mixed";
        const problems = [];
        for (let i = 0; i < count; i++) {
            const operation = mode === "mixed" ? (randInt(rand, 0, 1) === 0 ? "multiply" : "divide") : mode;
            problems.push(generateProblem(rand, difficulty, operation));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, operation) {
    let question = "";
    let latex = "";
    let answer = "";
    let wrongAnswers = [];

    if (operation === "multiply") {
        if (difficulty === "easy") {
            // a × bx = (ab)x
            const a = randInt(rand, 2, 8);
            const b = randInt(rand, 1, 8);
            const coeff = a * b;

            question = `${a} × ${formatCoeff(b, "x")}`;
            latex = `${a} \\times ${formatCoeff(b, "x")}`;
            answer = `${coeff}x`;

            wrongAnswers.push(`${a}x`); // forgot to multiply both
            wrongAnswers.push(`${a}${b}x`); // concatenated instead of multiplied
            const wrongCoeff = coeff > 2 ? coeff - 1 : coeff + 1;
            wrongAnswers.push(`${wrongCoeff}x`);
        } else if (difficulty === "normal") {
            // 50% ax × by = abxy, 50% ax × bx = abx²
            if (randInt(rand, 0, 1) === 0) {
                // ax × by = abxy
                const a = randInt(rand, 1, 8);
                const b = randInt(rand, 1, 8);
                const coeff = a * b;

                question = `${formatCoeff(a, "x")} × ${formatCoeff(b, "y")}`;
                latex = `${formatCoeff(a, "x")} \\times ${formatCoeff(b, "y")}`;
                answer = `${coeff}xy`;

                wrongAnswers.push(`${coeff}`); // forgot variables
                const wrongCoeff = coeff > 2 ? coeff - 1 : coeff + 1;
                wrongAnswers.push(`${wrongCoeff}xy`);
                wrongAnswers.push(`${coeff}x`);
            } else {
                // ax × bx = abx²
                const a = randInt(rand, 1, 8);
                const b = randInt(rand, 1, 8);
                const coeff = a * b;

                question = `${formatCoeff(a, "x")} × ${formatCoeff(b, "x")}`;
                latex = `${formatCoeff(a, "x")} \\times ${formatCoeff(b, "x")}`;
                answer = `${coeff}x²`;

                wrongAnswers.push(`${coeff}x`); // forgot the power
                const wrongCoeff = coeff > 2 ? coeff - 1 : coeff + 1;
                wrongAnswers.push(`${wrongCoeff}x²`);
                wrongAnswers.push(`${coeff}`);
            }
        } else {
            // Hard: 50% ax² × bx = abx³, 50% ax × bx² = abx³
            if (randInt(rand, 0, 1) === 0) {
                // ax² × bx = abx³
                const a = randInt(rand, 1, 8);
                const b = randInt(rand, 1, 8);
                const coeff = a * b;

                question = `${formatCoeff(a, "x²")} × ${formatCoeff(b, "x")}`;
                latex = `${formatCoeff(a, "x^2")} \\times ${formatCoeff(b, "x")}`;
                answer = `${coeff}x³`;

                wrongAnswers.push(`${coeff}x²`); // wrong power
                const wrongCoeff = coeff > 2 ? coeff - 1 : coeff + 1;
                wrongAnswers.push(`${wrongCoeff}x³`);
                wrongAnswers.push(`${coeff}x`);
            } else {
                // ax × bx² = abx³
                const a = randInt(rand, 1, 8);
                const b = randInt(rand, 1, 8);
                const coeff = a * b;

                question = `${formatCoeff(a, "x")} × ${formatCoeff(b, "x²")}`;
                latex = `${formatCoeff(a, "x")} \\times ${formatCoeff(b, "x^2")}`;
                answer = `${coeff}x³`;

                wrongAnswers.push(`${coeff}x²`);
                const wrongCoeff = coeff > 2 ? coeff - 1 : coeff + 1;
                wrongAnswers.push(`${wrongCoeff}x³`);
                wrongAnswers.push(`${coeff}x`);
            }
        }
    } else {
        // Divide
        if (difficulty === "easy") {
            // abx ÷ a = bx
            const a = randInt(rand, 2, 8);
            const b = randInt(rand, 1, 8);
            const ab = a * b;

            question = `${ab}x ÷ ${a}`;
            latex = `${ab}x \\div ${a}`;
            answer = `${b}x`;

            wrongAnswers.push(`${ab}x`); // forgot to divide
            wrongAnswers.push(`${b}`); // forgot x
            const wrongCoeff = b > 1 ? b - 1 : b + 1;
            wrongAnswers.push(`${wrongCoeff}x`);
        } else if (difficulty === "normal") {
            // abxy ÷ ax = by
            const a = randInt(rand, 2, 8);
            const b = randInt(rand, 1, 8);
            const ab = a * b;

            question = `${ab}xy ÷ ${formatCoeff(a, "x")}`;
            latex = `${ab}xy \\div ${formatCoeff(a, "x")}`;
            answer = `${b}y`;

            wrongAnswers.push(`${ab}xy`); // forgot to divide
            wrongAnswers.push(`${ab}y`); // forgot to divide numerator
            const wrongCoeff = b > 1 ? b - 1 : b + 1;
            wrongAnswers.push(`${wrongCoeff}y`);
        } else {
            // Hard: abx² ÷ bx = ax
            const a = randInt(rand, 1, 8);
            const b = randInt(rand, 1, 8);
            const ab = a * b;

            question = `${ab}x² ÷ ${formatCoeff(b, "x")}`;
            latex = `${ab}x^2 \\div ${formatCoeff(b, "x")}`;
            answer = `${a}x`;

            wrongAnswers.push(`${ab}x`); // forgot to divide
            const wrongCoeff = a > 1 ? a - 1 : a + 1;
            wrongAnswers.push(`${wrongCoeff}x`);
            wrongAnswers.push(`${a}x²`); // forgot to reduce power
        }
    }

    // Render with KaTeX
    const katexHtml = renderKatex(latex);
    const questionHtml = katexHtml || question;

    return {
        questionHtml,
        question,
        answer,
        wrongAnswers: wrongAnswers.filter(wa => wa && wa !== answer).slice(0, 3),
    };
}
