import {
    randInt, renderKatex, exponentToSuperscript,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "advanced-indices",
    label: "Advanced Indices (Fractional & Negative)",
    grades: [6, 7, 8],  // [easy, normal, hard]
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
        const type = options.indexType || "fractional";
        const basic = options.includeBasicLaws === true || options.includeBasicLaws === "true";

        // Easy without basic laws: use pool-based shuffle for guaranteed ≥ 20 unique
        if (difficulty === "easy" && !basic) {
            const pool = buildEasyPool(type);
            let all = [...pool];
            while (all.length < count) all = all.concat([...pool]);
            for (let i = all.length - 1; i > 0; i--) {
                const j = Math.floor(rand() * (i + 1));
                [all[i], all[j]] = [all[j], all[i]];
            }
            return all.slice(0, count);
        }

        const problems = [];
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

// ============= EASY POOL (guaranteed ≥ 20 unique) =============

function buildEasyPool(type) {
    const pool = [];

    if (type === "fractional" || type === "mixed") {
        // base^(1/n) = k: n∈{2,3}, k∈[2,12] → 22 unique
        for (let k = 2; k <= 12; k++) {
            for (const n of [2, 3]) {
                const base = Math.pow(k, n);
                const latex = `${base}^{\\dfrac{1}{${n}}} =`;
                const questionHtml = renderKatexLocal(latex) || `${base}^(1/${n}) =`;
                const question = `${base}^(1/${n}) =`;
                const answer = `${k}`;

                // Wrong answers
                const wrongAnswers = [];
                const seen = new Set([answer]);

                const wrong1 = `${base}`;
                if (!seen.has(wrong1)) {
                    wrongAnswers.push(wrong1);
                    seen.add(wrong1);
                }

                const wrong2 = `${Math.floor(base / n)}`;
                if (!seen.has(wrong2)) {
                    wrongAnswers.push(wrong2);
                    seen.add(wrong2);
                }

                const wrong3 = `${Math.max(1, k - 1)}`;
                if (!seen.has(wrong3)) {
                    wrongAnswers.push(wrong3);
                    seen.add(wrong3);
                }

                if (wrongAnswers.length < 3) {
                    wrongAnswers.push(`${k + 1}`);
                }

                pool.push({ questionHtml, question, answer, wrongAnswers: wrongAnswers.slice(0, 3) });
            }
        }
    }

    if (type === "negative" || type === "mixed") {
        // a^(-n) = 1/a^n: n∈{1,2}, a∈[2,12] → 22 unique
        for (let a = 2; a <= 12; a++) {
            for (const n of [1, 2]) {
                const denom = Math.pow(a, n);
                const latex = `${a}^{-${n}} =`;
                const questionHtml = renderKatexLocal(latex) || `${a}^(-${n}) =`;
                const question = `${a}^(-${n}) =`;
                const answerLatex = `\\dfrac{1}{${denom}}`;
                const answerHtml = renderKatexLocal(answerLatex) || `1/${denom}`;
                const answer = `1/${denom}`;

                // Wrong answers
                const wrongAnswers = [];
                const seen = new Set([answer]);

                const wrong1 = `${a}`;
                if (!seen.has(wrong1)) {
                    wrongAnswers.push(wrong1);
                    seen.add(wrong1);
                }

                const wrong2 = `${denom}`;
                if (!seen.has(wrong2)) {
                    wrongAnswers.push(wrong2);
                    seen.add(wrong2);
                }

                const wrong3 = `1/${denom + 1}`;
                if (!seen.has(wrong3)) {
                    wrongAnswers.push(wrong3);
                    seen.add(wrong3);
                }

                if (wrongAnswers.length < 3) {
                    wrongAnswers.push(`1/${Math.max(1, denom - 1)}`);
                }

                pool.push({ questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) });
            }
        }
    }

    return pool;
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
        // base^(1/n) = k, where n ∈ {2, 3}, k ∈ [2, 12] → 22 unique
        const k = randInt(rand, 2, 12);
        const n = randInt(rand, 0, 1) === 0 ? 2 : 3;
        const base = Math.pow(k, n);

        const latex = `${base}^{\\dfrac{1}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `${base}^(1/${n}) =`;
        const question = `${base}^(1/${n}) =`;
        const answer = `${k}`;

        // Wrong answers: common mistakes with fractional exponents
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Mistake 1: inverted exponent (treated as k^n instead of k^(1/n))
        const wrong1 = `${base}`;
        if (!seen.has(wrong1)) {
            wrongAnswers.push(wrong1);
            seen.add(wrong1);
        }

        // Mistake 2: divided by n instead of taking nth root
        const wrong2 = `${Math.floor(base / n)}`;
        if (!seen.has(wrong2)) {
            wrongAnswers.push(wrong2);
            seen.add(wrong2);
        }

        // Mistake 3: off by one
        const wrong3 = `${Math.max(1, k - 1)}`;
        if (!seen.has(wrong3)) {
            wrongAnswers.push(wrong3);
            seen.add(wrong3);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            wrongAnswers.push(`${k + 1}`);
        }

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.slice(0, 3) };
    } else if (difficulty === "normal") {
        // base^(m/n) = k^m, with m ≠ n, k ∈ [2, 12] → 22 unique
        const k = randInt(rand, 2, 12);
        const n = randInt(rand, 0, 1) === 0 ? 2 : 3;
        let m = randInt(rand, 2, 3);
        while (m === n) m = m === 2 ? 3 : 2; // ensure m ≠ n

        const base = Math.pow(k, n);
        const answerValue = Math.pow(k, m);

        const latex = `${base}^{\\dfrac{${m}}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `${base}^(${m}/${n}) =`;
        const question = `${base}^(${m}/${n}) =`;
        const answer = `${answerValue}`;

        // Wrong answers
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Mistake 1: forgot numerator (took nth root only)
        const wrong1 = `${k}`;
        if (!seen.has(wrong1)) {
            wrongAnswers.push(wrong1);
            seen.add(wrong1);
        }

        // Mistake 2: used n instead of m
        const wrong2 = `${Math.pow(k, n)}`;
        if (!seen.has(wrong2)) {
            wrongAnswers.push(wrong2);
            seen.add(wrong2);
        }

        // Mistake 3: off by one in answer
        const wrong3 = `${Math.max(1, answerValue - 1)}`;
        if (!seen.has(wrong3)) {
            wrongAnswers.push(wrong3);
            seen.add(wrong3);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            wrongAnswers.push(`${answerValue + 1}`);
        }

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.slice(0, 3) };
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

        const latex = `${base}^{\\dfrac{${m}}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `${base}^(${m}/${n}) =`;
        const question = `${base}^(${m}/${n}) =`;
        const answer = `${answerValue}`;

        // Wrong answers
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Mistake 1: just evaluated base
        const wrong1 = `${base}`;
        if (!seen.has(wrong1)) {
            wrongAnswers.push(wrong1);
            seen.add(wrong1);
        }

        // Mistake 2: forgot exponent numerator
        const wrong2 = `${k}`;
        if (!seen.has(wrong2)) {
            wrongAnswers.push(wrong2);
            seen.add(wrong2);
        }

        // Mistake 3: off by one
        const wrong3 = `${Math.max(1, answerValue - 1)}`;
        if (!seen.has(wrong3)) {
            wrongAnswers.push(wrong3);
            seen.add(wrong3);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            wrongAnswers.push(`${answerValue + 1}`);
        }

        return { questionHtml, question, answer, wrongAnswers: wrongAnswers.slice(0, 3) };
    }
}

// Negative: a^(-n) = 1/a^n
function generateNegativeNumerical(rand, difficulty) {
    if (difficulty === "easy") {
        // a ∈ [2, 12], n ∈ {1, 2} → 22 unique
        const a = randInt(rand, 2, 12);
        const n = randInt(rand, 1, 2);
        const denom = Math.pow(a, n);

        const latex = `${a}^{-${n}} =`;
        const questionHtml = renderKatexLocal(latex) || `${a}^(-${n}) =`;
        const question = `${a}^(-${n}) =`;

        const answerLatex = `\\dfrac{1}{${denom}}`;
        const answerHtml = renderKatexLocal(answerLatex) || `1/${denom}`;
        const answer = `1/${denom}`;

        // Wrong answers
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Mistake 1: forgot the negative (just a^n)
        const wrong1 = `${denom}`;
        if (!seen.has(wrong1)) {
            wrongAnswers.push(wrong1);
            seen.add(wrong1);
        }

        // Mistake 2: made reciprocal of base instead of power
        const wrong2 = `1/${a}`;
        if (!seen.has(wrong2)) {
            wrongAnswers.push(wrong2);
            seen.add(wrong2);
        }

        // Mistake 3: negative reciprocal
        const wrong3 = `-1/${denom}`;
        if (!seen.has(wrong3)) {
            wrongAnswers.push(wrong3);
            seen.add(wrong3);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            wrongAnswers.push(`1/${denom + 1}`);
        }

        return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
    } else if (difficulty === "normal") {
        // a ∈ [2, 8], n ∈ {1, 2, 3} → 21 unique
        const a = randInt(rand, 2, 8);
        const n = randInt(rand, 1, 3);
        const denom = Math.pow(a, n);

        const latex = `${a}^{-${n}} =`;
        const questionHtml = renderKatexLocal(latex) || `${a}^(-${n}) =`;
        const question = `${a}^(-${n}) =`;

        const answerLatex = `\\dfrac{1}{${denom}}`;
        const answerHtml = renderKatexLocal(answerLatex) || `1/${denom}`;
        const answer = `1/${denom}`;

        // Wrong answers
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Mistake 1: forgot negative sign
        const wrong1 = `${denom}`;
        if (!seen.has(wrong1)) {
            wrongAnswers.push(wrong1);
            seen.add(wrong1);
        }

        // Mistake 2: just reciprocal of base
        const wrong2 = `1/${a}`;
        if (!seen.has(wrong2)) {
            wrongAnswers.push(wrong2);
            seen.add(wrong2);
        }

        // Mistake 3: wrong power
        const wrong3 = `1/${Math.pow(a, Math.max(1, n - 1))}`;
        if (!seen.has(wrong3)) {
            wrongAnswers.push(wrong3);
            seen.add(wrong3);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            wrongAnswers.push(`1/${denom + 1}`);
        }

        return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
    } else {
        // Hard: negative fractional
        const k = randInt(rand, 2, 4);
        const n = randInt(rand, 2, 3);
        const m = randInt(rand, 1, 3);

        const base = Math.pow(k, n);
        const answerDenom = Math.pow(k, m);

        const latex = `${base}^{-\\dfrac{${m}}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `${base}^(-${m}/${n}) =`;
        const question = `${base}^(-${m}/${n}) =`;

        const answerLatex = `\\dfrac{1}{${answerDenom}}`;
        const answerHtml = renderKatexLocal(answerLatex) || `1/${answerDenom}`;
        const answer = `1/${answerDenom}`;

        // Wrong answers
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Mistake 1: forgot negative
        const wrong1 = `${answerDenom}`;
        if (!seen.has(wrong1)) {
            wrongAnswers.push(wrong1);
            seen.add(wrong1);
        }

        // Mistake 2: wrong denominator power
        const wrong2 = `1/${base}`;
        if (!seen.has(wrong2)) {
            wrongAnswers.push(wrong2);
            seen.add(wrong2);
        }

        // Mistake 3: forgot fraction exponent
        const wrong3 = `1/${k}`;
        if (!seen.has(wrong3)) {
            wrongAnswers.push(wrong3);
            seen.add(wrong3);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            wrongAnswers.push(`1/${answerDenom + 1}`);
        }

        return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
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

        const latex = `x^{\\dfrac{${p}}{${n}}} \\times x^{\\dfrac{${q}}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `x^(${p}/${n}) × x^(${q}/${n}) =`;
        const question = `x^(${p}/${n}) × x^(${q}/${n}) =`;
        const answer = "x";
        const answerHtml = renderKatexLocal("x") || "x";

        // Wrong answers
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Mistake 1: just took first term
        const wrong1 = `x^(${p}/${n})`;
        if (!seen.has(wrong1)) {
            wrongAnswers.push(wrong1);
            seen.add(wrong1);
        }

        // Mistake 2: added exponents wrong
        const wrong2 = `x^${exponentToSuperscript(n)}`;
        if (!seen.has(wrong2)) {
            wrongAnswers.push(wrong2);
            seen.add(wrong2);
        }

        // Mistake 3: didn't simplify
        const wrong3 = `x^(1/${n}) × x^(${q}/${n})`;
        if (!seen.has(wrong3)) {
            wrongAnswers.push(wrong3);
            seen.add(wrong3);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            wrongAnswers.push("x^2");
        }

        return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
    } else if (lawType === "power") {
        // (x^m)^(1/n) = x^(m/n), pick m divisible by n for clean answer
        const n = randInt(rand, 2, 3);
        const m = n * randInt(rand, 1, 3); // m divisible by n
        const resultNum = m / n;

        const latex = `(x^{${m}})^{\\dfrac{1}{${n}}} =`;
        const questionHtml = renderKatexLocal(latex) || `(x^${exponentToSuperscript(m)})^(1/${n}) =`;
        const question = `(x^${exponentToSuperscript(m)})^(1/${n}) =`;

        const answer = `x${resultNum === 1 ? "" : exponentToSuperscript(resultNum)}`;
        const answerLatex = resultNum === 1 ? "x" : `x^{${resultNum}}`;
        const answerHtml = renderKatexLocal(answerLatex) || answer;

        // Wrong answers
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Mistake 1: forgot to apply power rule
        const wrong1 = `x^(${m}/${n})`;
        if (!seen.has(wrong1)) {
            wrongAnswers.push(wrong1);
            seen.add(wrong1);
        }

        // Mistake 2: just took the inner exponent
        const wrong2 = `x${exponentToSuperscript(m)}`;
        if (!seen.has(wrong2)) {
            wrongAnswers.push(wrong2);
            seen.add(wrong2);
        }

        // Mistake 3: wrong exponent value
        const wrong3 = `x${exponentToSuperscript(Math.max(1, resultNum - 1))}`;
        if (!seen.has(wrong3)) {
            wrongAnswers.push(wrong3);
            seen.add(wrong3);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            wrongAnswers.push(`x^${exponentToSuperscript(resultNum + 1)}`);
        }

        return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
    } else {
        // Quotient with fractional
        const n = randInt(rand, 2, 3);
        const p = randInt(rand, 1, 2);
        const q = randInt(rand, 1, 2);
        if (p >= q) {
            // x^(p/n) ÷ x^(q/n) = x^((p-q)/n)
            const resultNum = p - q;
            const latex = `x^{\\dfrac{${p}}{${n}}} \\div x^{\\dfrac{${q}}{${n}}} =`;
            const questionHtml = renderKatexLocal(latex) || `x^(${p}/${n}) ÷ x^(${q}/${n}) =`;
            const question = `x^(${p}/${n}) ÷ x^(${q}/${n}) =`;

            const answer = `x${resultNum === 1 ? "" : `^(${resultNum}/${n})`}`;
            const answerLatex = resultNum === 1 ? "x" : `x^{\\dfrac{${resultNum}}{${n}}}`;
            const answerHtml = renderKatexLocal(answerLatex) || answer;

            // Wrong answers
            const wrongAnswers = [];
            const seen = new Set([answer]);

            // Mistake 1: added exponents instead of subtracting
            const sum = p + q;
            const wrong1 = `x^(${sum}/${n})`;
            if (!seen.has(wrong1)) {
                wrongAnswers.push(wrong1);
                seen.add(wrong1);
            }

            // Mistake 2: just took first term
            const wrong2 = `x^(${p}/${n})`;
            if (!seen.has(wrong2)) {
                wrongAnswers.push(wrong2);
                seen.add(wrong2);
            }

            // Mistake 3: wrong denominator
            const wrong3 = resultNum === 1 ? "x^2" : `x${exponentToSuperscript(resultNum)}`;
            if (!seen.has(wrong3)) {
                wrongAnswers.push(wrong3);
                seen.add(wrong3);
            }

            // Fallback
            if (wrongAnswers.length < 3) {
                wrongAnswers.push("1");
            }

            return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
        } else {
            // x^(q/n) ÷ x^(p/n) = x^((q-p)/n), then simplify if possible
            const resultNum = q - p;
            const latex = `x^{\\dfrac{${q}}{${n}}} \\div x^{\\dfrac{${p}}{${n}}} =`;
            const questionHtml = renderKatexLocal(latex) || `x^(${q}/${n}) ÷ x^(${p}/${n}) =`;
            const question = `x^(${q}/${n}) ÷ x^(${p}/${n}) =`;

            const answer = `x${resultNum === 1 ? "" : `^(${resultNum}/${n})`}`;
            const answerLatex = resultNum === 1 ? "x" : `x^{\\dfrac{${resultNum}}{${n}}}`;
            const answerHtml = renderKatexLocal(answerLatex) || answer;

            // Wrong answers
            const wrongAnswers = [];
            const seen = new Set([answer]);

            // Mistake 1: added exponents
            const sum = q + p;
            const wrong1 = `x^(${sum}/${n})`;
            if (!seen.has(wrong1)) {
                wrongAnswers.push(wrong1);
                seen.add(wrong1);
            }

            // Mistake 2: just took first term
            const wrong2 = `x^(${q}/${n})`;
            if (!seen.has(wrong2)) {
                wrongAnswers.push(wrong2);
                seen.add(wrong2);
            }

            // Mistake 3: wrong exponent
            const wrong3 = `x^(${p}/${n})`;
            if (!seen.has(wrong3)) {
                wrongAnswers.push(wrong3);
                seen.add(wrong3);
            }

            // Fallback
            if (wrongAnswers.length < 3) {
                wrongAnswers.push("1");
            }

            return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
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

            // Wrong answers
            const wrongAnswers = [];
            const seen = new Set([answer]);

            // Mistake 1: forgot the negative (added instead)
            const wrong1 = `x${exponentToSuperscript(m + n)}`;
            if (!seen.has(wrong1)) {
                wrongAnswers.push(wrong1);
                seen.add(wrong1);
            }

            // Mistake 2: just took first term
            const wrong2 = `x${exponentToSuperscript(m)}`;
            if (!seen.has(wrong2)) {
                wrongAnswers.push(wrong2);
                seen.add(wrong2);
            }

            // Mistake 3: wrong exponent value
            const wrong3 = `x${exponentToSuperscript(result + 1)}`;
            if (!seen.has(wrong3)) {
                wrongAnswers.push(wrong3);
                seen.add(wrong3);
            }

            // Fallback
            if (wrongAnswers.length < 3) {
                wrongAnswers.push(`x${exponentToSuperscript(result - 1)}`);
            }

            return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
        } else if (result === 0) {
            const answer = "1";

            // Wrong answers
            const wrongAnswers = [];
            const seen = new Set([answer]);

            // Mistake 1: forgot to simplify
            const wrong1 = `x${exponentToSuperscript(m)}/x${exponentToSuperscript(n)}`;
            if (!seen.has(wrong1)) {
                wrongAnswers.push(wrong1);
                seen.add(wrong1);
            }

            // Mistake 2: used m
            const wrong2 = `x${exponentToSuperscript(m)}`;
            if (!seen.has(wrong2)) {
                wrongAnswers.push(wrong2);
                seen.add(wrong2);
            }

            // Mistake 3: used n
            const wrong3 = `x${exponentToSuperscript(n)}`;
            if (!seen.has(wrong3)) {
                wrongAnswers.push(wrong3);
                seen.add(wrong3);
            }

            // Fallback
            if (wrongAnswers.length < 3) {
                wrongAnswers.push("0");
            }

            return { questionHtml, question, answer, wrongAnswers: wrongAnswers.slice(0, 3) };
        } else {
            const absResult = Math.abs(result);
            const answer = `1/x${exponentToSuperscript(absResult)}`;
            const answerLatex = `\\dfrac{1}{x^{${absResult}}}`;
            const answerHtml = renderKatexLocal(answerLatex) || answer;

            // Wrong answers
            const wrongAnswers = [];
            const seen = new Set([answer]);

            // Mistake 1: forgot negative (positive exponent)
            const wrong1 = `x${exponentToSuperscript(absResult)}`;
            if (!seen.has(wrong1)) {
                wrongAnswers.push(wrong1);
                seen.add(wrong1);
            }

            // Mistake 2: wrong exponent in denominator
            const wrong2 = `1/x${exponentToSuperscript(m)}`;
            if (!seen.has(wrong2)) {
                wrongAnswers.push(wrong2);
                seen.add(wrong2);
            }

            // Mistake 3: wrong exponent value
            const wrong3 = `1/x${exponentToSuperscript(absResult + 1)}`;
            if (!seen.has(wrong3)) {
                wrongAnswers.push(wrong3);
                seen.add(wrong3);
            }

            // Fallback
            if (wrongAnswers.length < 3) {
                wrongAnswers.push(`x^(-${absResult})`);
            }

            return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
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
        const answerLatex = `\\dfrac{1}{x^{${result}}}`;
        const answerHtml = renderKatexLocal(answerLatex) || answer;

        // Wrong answers
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Mistake 1: forgot power rule (didn't multiply exponents)
        const wrong1 = `1/x${exponentToSuperscript(m)}`;
        if (!seen.has(wrong1)) {
            wrongAnswers.push(wrong1);
            seen.add(wrong1);
        }

        // Mistake 2: forgot negative
        const wrong2 = `x${exponentToSuperscript(result)}`;
        if (!seen.has(wrong2)) {
            wrongAnswers.push(wrong2);
            seen.add(wrong2);
        }

        // Mistake 3: wrong exponent
        const wrong3 = `1/x${exponentToSuperscript(result + 1)}`;
        if (!seen.has(wrong3)) {
            wrongAnswers.push(wrong3);
            seen.add(wrong3);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            wrongAnswers.push(`x^(-${result})`);
        }

        return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
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

        // Wrong answers
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Mistake 1: forgot negative (subtracted instead)
        const wrong1 = `x${exponentToSuperscript(m - n)}`;
        if (!seen.has(wrong1)) {
            wrongAnswers.push(wrong1);
            seen.add(wrong1);
        }

        // Mistake 2: just took first term
        const wrong2 = `x${exponentToSuperscript(m)}`;
        if (!seen.has(wrong2)) {
            wrongAnswers.push(wrong2);
            seen.add(wrong2);
        }

        // Mistake 3: wrong exponent
        const wrong3 = `x${exponentToSuperscript(result - 1)}`;
        if (!seen.has(wrong3)) {
            wrongAnswers.push(wrong3);
            seen.add(wrong3);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            wrongAnswers.push(`x${exponentToSuperscript(result + 1)}`);
        }

        return { questionHtml, question, answer, answerHtml, wrongAnswers: wrongAnswers.slice(0, 3) };
    }
}
