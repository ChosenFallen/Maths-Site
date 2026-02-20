import { randInt, gcd } from "./utils.js";

// Helper function to render KaTeX
function renderKatex(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

// Format a surd term like "3√2" or "√3"
function formatSurdLatex(coeff, k) {
    if (coeff === 1) {
        return `\\sqrt{${k}}`;
    }
    return `${coeff}\\sqrt{${k}}`;
}

function formatSurdText(coeff, k) {
    if (coeff === 1) {
        return `√${k}`;
    }
    return `${coeff}√${k}`;
}

// Format fraction in LaTeX
function formatFracLatex(num, den) {
    return `\\frac{${num}}{${den}}`;
}

export default {
    id: "surds-rationalise",
    label: "Rationalising Denominators",
    instruction() {
        return "Rationalise the denominator of each expression.";
    },
    printTitle() {
        return "Rationalising Denominators";
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
    if (difficulty === "easy") {
        // a / √k = a√k / k
        // Simplify: gcd(a, k)
        const kOptions = [2, 3, 5];
        const k = kOptions[randInt(rand, 0, kOptions.length - 1)];
        const a = randInt(rand, 1, 8);

        const g = gcd(a, k);
        const numCoeff = a / g;
        const denVal = k / g;

        // Question: a / √k
        const questionLatex = `\\frac{${a}}{\\sqrt{${k}}}`;
        const questionHtml = renderKatex(questionLatex) || `${a}/√${k}`;

        // Answer: numCoeff√k / denVal or just numCoeff√k if denVal === 1
        let answerLatex, answerText;
        if (denVal === 1) {
            answerLatex = formatSurdLatex(numCoeff, k);
            answerText = formatSurdText(numCoeff, k);
        } else {
            answerLatex = `\\frac{${formatSurdLatex(numCoeff, k)}}{${denVal}}`;
            answerText = `${formatSurdText(numCoeff, k)}/${denVal}`;
        }

        const answerHtml = renderKatex(answerLatex) || answerText;

        return {
            questionHtml,
            question: `${a}/√${k}`,
            answer: answerText,
            answerHtml,
        };
    } else if (difficulty === "normal") {
        // n / (m√k) = n√k / (mk)
        // Simplify: gcd(n, mk)
        const nOptions = randInt(rand, 1, 8);
        const mOptions = [2, 3];
        const kOptions = [2, 3, 5];

        const n = nOptions;
        const m = mOptions[randInt(rand, 0, mOptions.length - 1)];
        const k = kOptions[randInt(rand, 0, kOptions.length - 1)];

        const mk = m * k;
        const g = gcd(n, mk);
        const numCoeff = n / g;
        const denVal = mk / g;

        // Question: n / (m√k)
        const questionLatex = `\\frac{${n}}{${m}\\sqrt{${k}}}`;
        const questionHtml = renderKatex(questionLatex) || `${n}/(${m}√${k})`;

        // Answer: numCoeff√k / denVal
        let answerLatex, answerText;
        if (denVal === 1) {
            answerLatex = formatSurdLatex(numCoeff, k);
            answerText = formatSurdText(numCoeff, k);
        } else {
            answerLatex = `\\frac{${formatSurdLatex(numCoeff, k)}}{${denVal}}`;
            answerText = `${formatSurdText(numCoeff, k)}/${denVal}`;
        }

        const answerHtml = renderKatex(answerLatex) || answerText;

        return {
            questionHtml,
            question: `${n}/(${m}√${k})`,
            answer: answerText,
            answerHtml,
        };
    } else {
        // Hard: a / (b + √k)
        // Multiply by (b - √k) / (b - √k)
        // Result: a(b - √k) / (b² - k)
        // Need b² > k (positive denominator)

        const aOptions = [1, 2, 4];
        const a = aOptions[randInt(rand, 0, aOptions.length - 1)];

        // Pick b and k where b² > k
        let b, k, validCombos = [];
        for (b = 2; b <= 5; b++) {
            for (k of [2, 3, 5, 7]) {
                if (b * b > k) {
                    validCombos.push([b, k]);
                }
            }
        }

        const combo = validCombos[randInt(rand, 0, validCombos.length - 1)];
        b = combo[0];
        k = combo[1];

        const d = b * b - k; // denominator after rationalization
        const g = gcd(a, d);
        const aSimp = a / g;
        const dSimp = d / g;

        // Answer: aSimp(b - √k) / dSimp
        // If dSimp === 1: answer is aSimp(b - √k)
        // Otherwise: answer is aSimp(b - √k) / dSimp

        // For cleaner representation:
        // aSimp * b - aSimp * √k all over dSimp
        const ansIntPart = aSimp * b;
        const ansSurdCoeff = aSimp;

        let answerLatex, answerText;
        if (dSimp === 1) {
            // Just aSimp*b - aSimp√k = aSimp(b - √k)
            const sign = "−";
            if (ansIntPart === 0) {
                answerLatex = `-${formatSurdLatex(ansSurdCoeff, k)}`;
                answerText = `-${formatSurdText(ansSurdCoeff, k)}`;
            } else {
                answerLatex = `${ansIntPart} ${sign} ${formatSurdLatex(ansSurdCoeff, k)}`;
                answerText = `${ansIntPart} ${sign} ${formatSurdText(ansSurdCoeff, k)}`;
            }
        } else {
            // Fraction form
            const fracNum = `${ansIntPart} ${ansSurdCoeff === 0 ? "" : "−"} ${ansSurdCoeff > 0 ? formatSurdLatex(ansSurdCoeff, k) : ""}`;
            // Simpler: just show the factored form: aSimp(b - √k) / dSimp
            answerLatex = `\\frac{${aSimp}(${b} - \\sqrt{${k}})}{${dSimp}}`;
            answerText = `${aSimp}(${b} - √${k})/${dSimp}`;
        }

        const answerHtml = renderKatex(answerLatex) || answerText;

        // Question: a / (b + √k)
        const questionLatex = `\\frac{${a}}{${b} + \\sqrt{${k}}}`;
        const questionHtml = renderKatex(questionLatex) || `${a}/(${b} + √${k})`;

        return {
            questionHtml,
            question: `${a}/(${b} + √${k})`,
            answer: answerText,
            answerHtml,
        };
    }
}
