import {
    randInt, exponentToSuperscript
} from "./utils.js";

export default {
    id: "index-laws",
    label: "Index Laws",
    grades: [5, 6, 7],  // [easy, normal, hard]
    instruction(options = {}) {
        const rule = options.indexLaw || "mixed";
        if (rule === "product") return "Simplify each expression using the product rule: aᵐ × aⁿ = aᵐ⁺ⁿ.";
        if (rule === "quotient") return "Simplify each expression using the quotient rule: aᵐ ÷ aⁿ = aᵐ⁻ⁿ.";
        if (rule === "power") return "Simplify each expression using the power rule: (aᵐ)ⁿ = aᵐⁿ.";
        return "Simplify each expression using index laws.";
    },
    printTitle() {
        return "Index Laws";
    },
    options: [
        {
            id: "indexLaw",
            label: "Index Law:",
            type: "select",
            default: "mixed",
            values: [
                { value: "product", label: "Product Rule (aᵐ × aⁿ)" },
                { value: "quotient", label: "Quotient Rule (aᵐ ÷ aⁿ)" },
                { value: "power", label: "Power of a Power ((aᵐ)ⁿ)" },
                { value: "mixed", label: "Mixed" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const rule = options.indexLaw || "mixed";
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty, rule));
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

function formatTermLatex(coeff, v, p) {
    if (p === 0) return coeff === 1 ? "1" : `${coeff}`;
    const varPart = p === 1 ? v : `${v}^{${p}}`;
    return coeff === 1 ? varPart : `${coeff}${varPart}`;
}

function formatBiTermLatex(mx, my) {
    const xPart = formatTermLatex(1, "x", mx);
    if (my === 0) return xPart;
    const yPart = formatTermLatex(1, "y", my);
    return `${xPart}${yPart}`;
}

function formatTermText(coeff, v, p) {
    if (p === 0) return coeff === 1 ? "1" : `${coeff}`;
    const sup = p === 1 ? "" : exponentToSuperscript(p);
    const varPart = `${v}${sup}`;
    return coeff === 1 ? varPart : `${coeff}${varPart}`;
}

function formatBiTermText(mx, my) {
    const xPart = formatTermText(1, "x", mx);
    if (my === 0) return xPart;
    const yPart = formatTermText(1, "y", my);
    return `${xPart}${yPart}`;
}

function generateProblem(rand, difficulty, rule) {
    let selectedRule = rule;
    if (rule === "mixed") {
        const rules = ["product", "quotient", "power"];
        selectedRule = rules[randInt(rand, 0, 2)];
    }

    if (selectedRule === "product") {
        return generateProduct(rand, difficulty);
    } else if (selectedRule === "quotient") {
        return generateQuotient(rand, difficulty);
    } else {
        return generatePower(rand, difficulty);
    }
}

// Product Rule: a^m × a^n = a^(m+n)
function generateProduct(rand, difficulty) {
    if (difficulty === "easy") {
        const m = randInt(rand, 1, 4);
        const n = randInt(rand, 1, 4);
        const answerPower = m + n;

        const latex = `x^{${m}} \\times x^{${n}} =`;
        const questionHtml = renderKatex(latex) || `x${exponentToSuperscript(m)} × x${exponentToSuperscript(n)} =`;
        const question = `x${exponentToSuperscript(m)} × x${exponentToSuperscript(n)} =`;
        const answer = formatTermText(1, "x", answerPower);

        const wrongAnswers = [
            formatTermText(1, "x", m), // forgot n
            formatTermText(1, "x", n), // forgot m
            formatTermText(1, "x", m * n), // multiplied instead of added
        ];

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
    } else if (difficulty === "normal") {
        const mx = randInt(rand, 1, 5);
        const nx = randInt(rand, 1, 5);
        const my = randInt(rand, 1, 5);
        const ny = randInt(rand, 1, 5);

        const latex = `${formatBiTermLatex(mx, my)} \\times ${formatBiTermLatex(nx, ny)} =`;
        const questionHtml = renderKatex(latex) || `${formatBiTermText(mx, my)} × ${formatBiTermText(nx, ny)} =`;
        const question = `${formatBiTermText(mx, my)} × ${formatBiTermText(nx, ny)} =`;
        const answer = formatBiTermText(mx + nx, my + ny);

        const wrongAnswers = [
            formatBiTermText(mx, my), // forgot to add second term
            formatBiTermText(mx * nx, my * ny), // multiplied instead of added
            formatBiTermText(mx + nx, my), // forgot second y power
        ];

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
    } else {
        // Hard: coefficients
        const k1 = randInt(rand, 2, 4);
        const k2 = randInt(rand, 2, 4);
        const m = randInt(rand, 1, 5);
        const n = randInt(rand, 1, 5);
        const kProduct = k1 * k2;

        const latex = `${k1}x^{${m}} \\times ${k2}x^{${n}} =`;
        const questionHtml = renderKatex(latex) || `${k1}x${exponentToSuperscript(m)} × ${k2}x${exponentToSuperscript(n)} =`;
        const question = `${k1}x${exponentToSuperscript(m)} × ${k2}x${exponentToSuperscript(n)} =`;
        const answer = formatTermText(kProduct, "x", m + n);

        const wrongAnswers = [
            formatTermText(k1 * k2, "x", m), // forgot n
            formatTermText(kProduct, "x", m * n), // multiplied powers
            formatTermText(k1 + k2, "x", m + n), // added coefficients
        ];

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
    }
}

// Quotient Rule: a^m ÷ a^n = a^(m-n)
function generateQuotient(rand, difficulty) {
    if (difficulty === "easy") {
        const n = randInt(rand, 1, 4);
        const diff = randInt(rand, 1, 4);
        const m = n + diff;

        const latex = `x^{${m}} \\div x^{${n}} =`;
        const questionHtml = renderKatex(latex) || `x${exponentToSuperscript(m)} ÷ x${exponentToSuperscript(n)} =`;
        const question = `x${exponentToSuperscript(m)} ÷ x${exponentToSuperscript(n)} =`;
        const answer = formatTermText(1, "x", diff);

        const wrongAnswers = [
            formatTermText(1, "x", m), // forgot to subtract
            formatTermText(1, "x", n), // subtracted wrong way
            formatTermText(1, "x", m + n), // added instead of subtracted
        ];

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
    } else if (difficulty === "normal") {
        const diffX = randInt(rand, 1, 4);
        const diffY = randInt(rand, 1, 4);
        const nx = randInt(rand, 1, 4);
        const ny = randInt(rand, 1, 4);
        const mx = nx + diffX;
        const my = ny + diffY;

        const latex = `${formatBiTermLatex(mx, my)} \\div ${formatBiTermLatex(nx, ny)} =`;
        const questionHtml = renderKatex(latex) || `${formatBiTermText(mx, my)} ÷ ${formatBiTermText(nx, ny)} =`;
        const question = `${formatBiTermText(mx, my)} ÷ ${formatBiTermText(nx, ny)} =`;
        const answer = formatBiTermText(diffX, diffY);

        const wrongAnswers = [
            formatBiTermText(mx, my), // forgot to divide
            formatBiTermText(mx + nx, my + ny), // added instead
            formatBiTermText(mx - nx, my - ny), // subtracted numerator only
        ];

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
    } else {
        // Hard: coefficients, ensure clean division
        const k2 = randInt(rand, 2, 4);
        const factor = randInt(rand, 2, 4);
        const k1 = k2 * factor;
        const n = randInt(rand, 1, 4);
        const diff = randInt(rand, 1, 4);
        const m = n + diff;

        const latex = `${k1}x^{${m}} \\div ${k2}x^{${n}} =`;
        const questionHtml = renderKatex(latex) || `${k1}x${exponentToSuperscript(m)} ÷ ${k2}x${exponentToSuperscript(n)} =`;
        const question = `${k1}x${exponentToSuperscript(m)} ÷ ${k2}x${exponentToSuperscript(n)} =`;
        const answer = formatTermText(factor, "x", diff);

        const wrongAnswers = [
            formatTermText(factor, "x", m - n), // wrong difference
            formatTermText(k1 / k2, "x", diff), // didn't simplify coefficient
            formatTermText(factor, "x", m + n), // added instead of subtracted
        ];

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
    }
}

// Power of a Power: (a^m)^n = a^(m*n)
function generatePower(rand, difficulty) {
    if (difficulty === "easy") {
        const m = randInt(rand, 2, 4);
        const n = randInt(rand, 2, 3);
        const answerPower = m * n;

        const latex = `(x^{${m}})^{${n}} =`;
        const questionHtml = renderKatex(latex) || `(x${exponentToSuperscript(m)})${exponentToSuperscript(n)} =`;
        const question = `(x${exponentToSuperscript(m)})${exponentToSuperscript(n)} =`;
        const answer = formatTermText(1, "x", answerPower);

        const wrongAnswers = [
            formatTermText(1, "x", m), // forgot the outer power
            formatTermText(1, "x", n), // forgot the inner power
            formatTermText(1, "x", m + n), // added instead of multiplied
        ];

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
    } else if (difficulty === "normal") {
        const mx = randInt(rand, 1, 4);
        const my = randInt(rand, 1, 4);
        const n = randInt(rand, 2, 3);

        const latex = `(${formatBiTermLatex(mx, my)})^{${n}} =`;
        const questionHtml = renderKatex(latex) || `(${formatBiTermText(mx, my)})${exponentToSuperscript(n)} =`;
        const question = `(${formatBiTermText(mx, my)})${exponentToSuperscript(n)} =`;
        const answer = formatBiTermText(mx * n, my * n);

        const wrongAnswers = [
            formatBiTermText(mx, my), // forgot the power
            formatBiTermText(mx * mx, my * my), // squared instead
            formatBiTermText(mx + n, my + n), // added instead of multiplied
        ];

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
    } else {
        // Hard: with coefficient
        const k = randInt(rand, 2, 4);
        const m = randInt(rand, 2, 4);
        const n = randInt(rand, 2, 3);
        const kPower = Math.pow(k, n);
        const mPower = m * n;

        const latex = `(${k}x^{${m}})^{${n}} =`;
        const questionHtml = renderKatex(latex) || `(${k}x${exponentToSuperscript(m)})${exponentToSuperscript(n)} =`;
        const question = `(${k}x${exponentToSuperscript(m)})${exponentToSuperscript(n)} =`;
        const answer = formatTermText(kPower, "x", mPower);

        const wrongAnswers = [
            formatTermText(k * n, "x", m * n), // didn't raise coefficient
            formatTermText(kPower, "x", m + n), // added powers
            formatTermText(kPower, "x", m), // forgot to multiply power
        ];

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
    }
}
