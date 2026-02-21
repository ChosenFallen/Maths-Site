import { randInt, renderKatex, exponentToSuperscript } from "./utils.js";

export default {
    id: "advanced-indices",
    label: "Advanced Indices (Fractional & Negative)",
    instruction(options = {}) {
        const type = options.indexType || "fractional";
        const basic = options.includeBasicLaws === true || options.includeBasicLaws === "true";

        const parts = {
            fractional: "Evaluate expressions with fractional indices.",
            negative: "Evaluate expressions with negative indices.",
            mixed: "Evaluate expressions with fractional and negative indices.",
        };
        let text = parts[type] || parts.fractional;
        if (basic) text += " Some questions also involve basic index laws.";
        return text;
    },
    printTitle() {
        return "Advanced Indices (Fractional & Negative)";
    },
    options: [
        {
            id: "indexType",
            label: "Index type:",
            type: "select",
            default: "fractional",
            values: [
                { value: "fractional", label: "Fractional Indices" },
                { value: "negative", label: "Negative Indices" },
                { value: "mixed", label: "Mixed (Both)" },
            ],
        },
        {
            id: "includeBasicLaws",
            label: "Include basic index laws",
            type: "checkbox",
            default: false,
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const type = options.indexType || "fractional";
        const basic = options.includeBasicLaws === true || options.includeBasicLaws === "true";

        for (let i = 0; i < count; i++) {
            // If includeBasicLaws is checked, 50% algebraic, 50% numerical
            if (basic && randInt(rand, 0, 1) === 0) {
                problems.push(generateAlgebraic(rand, difficulty, type));
            } else {
                problems.push(generateNumerical(rand, difficulty, type));
            }
        }
        return problems;
    },
};

function renderKatexLocal(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

// ============= NUMERICAL EVALUATION =============

function generateNumerical(rand, difficulty, type) {
    let selectedType = type;
    if (type === "mixed") {
        selectedType = randInt(rand, 0, 1) === 0 ? "fractional" : "negative";
    }

    if (selectedType === "fractional") {
        return generateFractionalNumerical(rand, difficulty);
    } else {
        return generateNegativeNumerical(rand, difficulty);
    }
}

// Fractional: k^n, ask for base^(1/n) = k, or base^(m/n) = k^m
function generateFractionalNumerical(rand, difficulty) {
    if (difficulty === "easy") {
        // base^(1/n) = k, where n ∈ {2, 3}
        const k = randInt(rand, 2, 5);
        const n = randInt(rand, 0, 1) === 0 ? 2 : 3;
        const base = Math.pow(k, n);

        const latex = `${base}^{\\frac{1}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `${base}^(1/${n}) =`;
        const question = `${base}^(1/${n}) =`;
        const answer = `${k}`;

        return { questionHtml, question, answer };
    } else if (difficulty === "normal") {
        // base^(m/n) = k^m, with m ≠ n
        const k = randInt(rand, 2, 4);
        const n = randInt(rand, 0, 1) === 0 ? 2 : 3;
        let m = randInt(rand, 2, 3);
        while (m === n) m = m === 2 ? 3 : 2; // ensure m ≠ n

        const base = Math.pow(k, n);
        const answerValue = Math.pow(k, m);

        const latex = `${base}^{\\frac{${m}}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `${base}^(${m}/${n}) =`;
        const question = `${base}^(${m}/${n}) =`;
        const answer = `${answerValue}`;

        return { questionHtml, question, answer };
    } else {
        // Hard: wider range
        const k = randInt(rand, 2, 5);
        const n = randInt(rand, 2, 4);
        let m;
        if (n === 2) {
            m = randInt(rand, 1, 3);
        } else if (n === 3) {
            m = randInt(rand, 1, 3);
            if (m === 3) m = 2; // avoid m = n
        } else {
            // n = 4
            m = randInt(rand, 0, 1) === 0 ? 1 : 3; // gcd(m, 4) = 1
        }

        const base = Math.pow(k, n);
        const answerValue = Math.pow(k, m);

        const latex = `${base}^{\\frac{${m}}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `${base}^(${m}/${n}) =`;
        const question = `${base}^(${m}/${n}) =`;
        const answer = `${answerValue}`;

        return { questionHtml, question, answer };
    }
}

// Negative: a^(-n) = 1/a^n
function generateNegativeNumerical(rand, difficulty) {
    if (difficulty === "easy") {
        const a = randInt(rand, 2, 5);
        const n = randInt(rand, 1, 2);
        const denom = Math.pow(a, n);

        const latex = `${a}^{-${n}} =`;
        const questionHtml = renderKatexLocal(latex) || `${a}^(-${n}) =`;
        const question = `${a}^(-${n}) =`;

        const answerLatex = `\\frac{1}{${denom}}`;
        const answerHtml = renderKatexLocal(answerLatex) || `1/${denom}`;
        const answer = `1/${denom}`;

        return { questionHtml, question, answer, answerHtml };
    } else if (difficulty === "normal") {
        const a = randInt(rand, 2, 4);
        const n = randInt(rand, 1, 3);
        const denom = Math.pow(a, n);

        const latex = `${a}^{-${n}} =`;
        const questionHtml = renderKatexLocal(latex) || `${a}^(-${n}) =`;
        const question = `${a}^(-${n}) =`;

        const answerLatex = `\\frac{1}{${denom}}`;
        const answerHtml = renderKatexLocal(answerLatex) || `1/${denom}`;
        const answer = `1/${denom}`;

        return { questionHtml, question, answer, answerHtml };
    } else {
        // Hard: negative fractional
        const k = randInt(rand, 2, 4);
        const n = randInt(rand, 2, 3);
        const m = randInt(rand, 1, 3);

        const base = Math.pow(k, n);
        const answerDenom = Math.pow(k, m);

        const latex = `${base}^{-\\frac{${m}}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `${base}^(-${m}/${n}) =`;
        const question = `${base}^(-${m}/${n}) =`;

        const answerLatex = `\\frac{1}{${answerDenom}}`;
        const answerHtml = renderKatexLocal(answerLatex) || `1/${answerDenom}`;
        const answer = `1/${answerDenom}`;

        return { questionHtml, question, answer, answerHtml };
    }
}

// ============= ALGEBRAIC SIMPLIFICATION =============

function generateAlgebraic(rand, difficulty, type) {
    let selectedType = type;
    if (type === "mixed") {
        selectedType = randInt(rand, 0, 1) === 0 ? "fractional" : "negative";
    }

    const algebraicTypes = ["product", "power", "quotient"];
    const lawType = algebraicTypes[randInt(rand, 0, 2)];

    if (selectedType === "fractional") {
        return generateAlgebraicFractional(rand, difficulty, lawType);
    } else {
        return generateAlgebraicNegative(rand, difficulty, lawType);
    }
}

// Algebraic with fractional exponents
function generateAlgebraicFractional(rand, difficulty, lawType) {
    if (lawType === "product") {
        // x^(1/n) × x^((n-1)/n) = x
        const n = randInt(rand, 2, 3);
        const p = 1;
        const q = n - 1;

        const latex = `x^{\\frac{${p}}{${n}}} \\times x^{\\frac{${q}}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `x^(${p}/${n}) × x^(${q}/${n}) =`;
        const question = `x^(${p}/${n}) × x^(${q}/${n}) =`;
        const answer = "x";
        const answerHtml = renderKatexLocal("x") || "x";

        return { questionHtml, question, answer, answerHtml };
    } else if (lawType === "power") {
        // (x^m)^(1/n) = x^(m/n), pick m divisible by n for clean answer
        const n = randInt(rand, 2, 3);
        const m = n * randInt(rand, 1, 3); // m divisible by n
        const resultNum = m / n;

        const latex = `(x^{${m}})^{\\frac{1}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `(x^${exponentToSuperscript(m)})^(1/${n}) =`;
        const question = `(x^${exponentToSuperscript(m)})^(1/${n}) =`;

        const answer = `x${resultNum === 1 ? "" : exponentToSuperscript(resultNum)}`;
        const answerLatex = resultNum === 1 ? "x" : `x^{${resultNum}}`;
        const answerHtml = renderKatexLocal(answerLatex) || answer;

        return { questionHtml, question, answer, answerHtml };
    } else {
        // Quotient with fractional
        const n = randInt(rand, 2, 3);
        const p = randInt(rand, 1, 2);
        const q = randInt(rand, 1, 2);
        if (p >= q) {
            // x^(p/n) ÷ x^(q/n) = x^((p-q)/n)
            const resultNum = p - q;
            const latex = `x^{\\frac{${p}}{${n}}} \\div x^{\\frac{${q}}{${n}}} =`;
            const questionHtml = renderKatexLocal(latex) || `x^(${p}/${n}) ÷ x^(${q}/${n}) =`;
            const question = `x^(${p}/${n}) ÷ x^(${q}/${n}) =`;

            const answer = `x${resultNum === 1 ? "" : `^(${resultNum}/${n})`}`;
            const answerLatex = resultNum === 1 ? "x" : `x^{\\frac{${resultNum}}{${n}}}`;
            const answerHtml = renderKatexLocal(answerLatex) || answer;

            return { questionHtml, question, answer, answerHtml };
        } else {
            // x^(q/n) ÷ x^(p/n) = x^((q-p)/n), then simplify if possible
            const resultNum = q - p;
            const latex = `x^{\\frac{${q}}{${n}}} \\div x^{\\frac{${p}}{${n}}} =`;
            const questionHtml = renderKatexLocal(latex) || `x^(${q}/${n}) ÷ x^(${p}/${n}) =`;
            const question = `x^(${q}/${n}) ÷ x^(${p}/${n}) =`;

            const answer = `x${resultNum === 1 ? "" : `^(${resultNum}/${n})`}`;
            const answerLatex = resultNum === 1 ? "x" : `x^{\\frac{${resultNum}}{${n}}}`;
            const answerHtml = renderKatexLocal(answerLatex) || answer;

            return { questionHtml, question, answer, answerHtml };
        }
    }
}

// Algebraic with negative exponents
function generateAlgebraicNegative(rand, difficulty, lawType) {
    if (lawType === "product") {
        // x^m × x^(-n) = x^(m-n)
        const m = randInt(rand, 2, 4);
        const n = randInt(rand, 1, 3);

        const latex = `x^{${m}} \\times x^{-${n}} =`;
        const questionHtml = renderKatexLocal(latex) || `x^${exponentToSuperscript(m)} × x^(${-n}) =`;
        const question = `x^${exponentToSuperscript(m)} × x^(${-n}) =`;

        const result = m - n;
        if (result > 0) {
            const answer = `x${exponentToSuperscript(result)}`;
            const answerHtml = renderKatexLocal(`x^{${result}}`) || answer;
            return { questionHtml, question, answer, answerHtml };
        } else if (result === 0) {
            const answer = "1";
            return { questionHtml, question, answer };
        } else {
            const absResult = Math.abs(result);
            const answer = `1/x${exponentToSuperscript(absResult)}`;
            const answerLatex = `\\frac{1}{x^{${absResult}}}`;
            const answerHtml = renderKatexLocal(answerLatex) || answer;
            return { questionHtml, question, answer, answerHtml };
        }
    } else if (lawType === "power") {
        // (x^m)^(-n) = x^(-mn) = 1/x^(mn)
        const m = randInt(rand, 1, 2);
        const n = randInt(rand, 1, 2);
        const result = m * n;

        const latex = `(x^{${m}})^{-${n}} =`;
        const questionHtml = renderKatexLocal(latex) || `(x^${exponentToSuperscript(m)})^(${-n}) =`;
        const question = `(x^${exponentToSuperscript(m)})^(${-n}) =`;

        const answer = `1/x${exponentToSuperscript(result)}`;
        const answerLatex = `\\frac{1}{x^{${result}}}`;
        const answerHtml = renderKatexLocal(answerLatex) || answer;

        return { questionHtml, question, answer, answerHtml };
    } else {
        // Quotient with negative
        const m = randInt(rand, 2, 4);
        const n = randInt(rand, 1, 2);

        const latex = `x^{${m}} \\div x^{-${n}} =`;
        const questionHtml = renderKatexLocal(latex) || `x^${exponentToSuperscript(m)} ÷ x^(${-n}) =`;
        const question = `x^${exponentToSuperscript(m)} ÷ x^(${-n}) =`;

        const result = m + n; // x^m ÷ x^(-n) = x^(m - (-n)) = x^(m+n)
        const answer = `x${exponentToSuperscript(result)}`;
        const answerHtml = renderKatexLocal(`x^{${result}}`) || answer;

        return { questionHtml, question, answer, answerHtml };
    }
}
