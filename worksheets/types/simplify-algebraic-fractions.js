import { randInt, gcd } from "./utils.js";

// Helper function to render KaTeX
function renderKatex(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

// Format a monomial like "6x^2" or "x"
function formatMonomial(coeff, power) {
    if (power === 0) {
        return `${coeff}`;
    }
    if (coeff === 1) {
        return power === 1 ? "x" : `x^{${power}}`;
    }
    if (coeff === -1) {
        return power === 1 ? "-x" : `-x^{${power}}`;
    }
    return power === 1 ? `${coeff}x` : `${coeff}x^{${power}}`;
}

// Format a linear expression like "x + 3"
function formatLinear(coeff, constant) {
    const xTerm = coeff === 1 ? "x" : coeff === -1 ? "-x" : `${coeff}x`;
    const sign = constant >= 0 ? "+" : "−";
    const absConst = Math.abs(constant);
    return `${xTerm} ${sign} ${absConst}`;
}

export default {
    id: "simplify-algebraic-fractions",
    label: "Simplify Algebraic Fractions",
    instruction() {
        return "Simplify each algebraic fraction.";
    },
    printTitle() {
        return "Simplify Algebraic Fractions";
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
        return generateEasy(rand);
    } else if (difficulty === "normal") {
        return generateNormal(rand);
    } else {
        return generateHard(rand);
    }
}

function generateEasy(rand) {
    // Monomial over monomial
    // Pick coprime (c, q) and common factor k
    let c = randInt(rand, 1, 4);
    let q = randInt(rand, 2, 5);
    const g = gcd(c, q);
    c = c / g;
    q = q / g;

    const k = randInt(rand, 2, 5);
    const s = randInt(rand, 1, 2); // shared x power
    const r = randInt(rand, 1, 2); // answer x power

    const numCoeff = c * k;
    const denCoeff = q * k;
    const numPow = r + s;
    const denPow = s;

    // Question: (numCoeff * k)x^(r+s) / (denCoeff * k)x^s
    const numLatex = formatMonomial(numCoeff, numPow);
    const denLatex = formatMonomial(denCoeff, denPow);
    const questionLatex = `\\frac{${numLatex}}{${denLatex}}`;

    // Answer: c*x^r / q
    let answerLatex, answer;
    if (q === 1) {
        answerLatex = formatMonomial(c, r);
        answer = `${c}x${r === 1 ? "" : "^" + r}`;
    } else {
        const answerNumLatex = formatMonomial(c, r);
        answerLatex = `\\frac{${answerNumLatex}}{${q}}`;
        answer = `${c}x${r === 1 ? "" : "^" + r}/${q}`;
    }

    const questionHtml = renderKatex(questionLatex) || `(${numCoeff}x${numPow === 1 ? "" : "^" + numPow})/(${denCoeff}x${denPow === 1 ? "" : "^" + denPow})`;
    const answerHtml = renderKatex(answerLatex) || answer;

    return {
        questionHtml,
        question: `(${numCoeff}x${numPow === 1 ? "" : "^" + numPow})/(${denCoeff}x${denPow === 1 ? "" : "^" + denPow})`,
        answer,
        answerHtml,
    };
}

function generateNormal(rand) {
    // Two types: 50/50
    const typeA = randInt(rand, 0, 1) === 0;

    if (typeA) {
        // Type A: (x^2 + ax) / x = x + a
        const a = randInt(rand, 1, 15);

        const questionLatex = `\\frac{x^2 + ${a}x}{x}`;
        const answer = `x + ${a}`;

        const questionHtml = renderKatex(questionLatex) || `(x^2 + ${a}x)/x`;

        return {
            questionHtml,
            question: `(x^2 + ${a}x)/x`,
            answer,
            answerHtml: answer,
        };
    } else {
        // Type B: (cx + ca) / (x + a) = c
        const c = randInt(rand, 2, 7);
        const a = randInt(rand, 1, 10);
        const ca = c * a;

        const questionLatex = `\\frac{${c}x + ${ca}}{x + ${a}}`;
        const answer = `${c}`;

        const questionHtml = renderKatex(questionLatex) || `(${c}x + ${ca})/(x + ${a})`;

        return {
            questionHtml,
            question: `(${c}x + ${ca})/(x + ${a})`,
            answer,
            answerHtml: answer,
        };
    }
}

function generateHard(rand) {
    // Two types: 50/50
    const typeA = randInt(rand, 0, 1) === 0;

    if (typeA) {
        // Type A: (x+p)(x+q) / (x+p) = x + q
        // Expand numerator to x^2 + (p+q)x + pq
        let p = randInt(rand, 1, 8);
        let q = randInt(rand, 1, 8);
        // Ensure p ≠ q
        if (p === q) {
            q = (q % 6) + 1; // cycle through 1-6
        }

        const bCoeff = p + q;
        const cCoeff = p * q;

        const questionLatex = `\\frac{x^2 + ${bCoeff}x + ${cCoeff}}{x + ${p}}`;
        const answer = `x + ${q}`;

        const questionHtml = renderKatex(questionLatex) || `(x^2 + ${bCoeff}x + ${cCoeff})/(x + ${p})`;

        return {
            questionHtml,
            question: `(x^2 + ${bCoeff}x + ${cCoeff})/(x + ${p})`,
            answer,
            answerHtml: answer,
        };
    } else {
        // Type B: (x+p)(x+q) / ((x+p)(x+r)) = (x+q)/(x+r)
        let p = randInt(rand, 1, 6);
        let q = randInt(rand, 1, 8);
        let r = randInt(rand, 1, 6);

        // Ensure all distinct
        if (p === q) {
            q = (q % 6) + 1;
        }
        if (p === r || q === r) {
            r = (r % 4) + 1;
            if (p === r) r = (r % 4) + 1;
            if (q === r) r = (r % 4) + 1;
        }

        const numBCoeff = p + q;
        const numCCoeff = p * q;
        const denBCoeff = p + r;
        const denCCoeff = p * r;

        const questionLatex = `\\frac{x^2 + ${numBCoeff}x + ${numCCoeff}}{x^2 + ${denBCoeff}x + ${denCCoeff}}`;
        const answerLatex = `\\frac{x + ${q}}{x + ${r}}`;
        const answer = `(x + ${q})/(x + ${r})`;

        const questionHtml = renderKatex(questionLatex) || `(x^2 + ${numBCoeff}x + ${numCCoeff})/(x^2 + ${denBCoeff}x + ${denCCoeff})`;
        const answerHtml = renderKatex(answerLatex) || answer;

        return {
            questionHtml,
            question: `(x^2 + ${numBCoeff}x + ${numCCoeff})/(x^2 + ${denBCoeff}x + ${denCCoeff})`,
            answer,
            answerHtml,
        };
    }
}
