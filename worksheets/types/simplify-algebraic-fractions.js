import { randInt, gcd, renderKatex, formatLinearLatex, formatLinearText, formatSignValue } from "./utils.js";

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
    const { sign, abs } = formatSignValue(constant);
    return `${xTerm} ${sign} ${abs}`;
}

// Format a quadratic in KaTeX with proper signs (handles b=±1 for just "x")
function formatQuadraticLatex(b, c) {
    let result = "x^2";
    if (b === 1)       result += " + x";
    else if (b === -1) result += " - x";
    else if (b > 0)    result += ` + ${b}x`;
    else if (b < 0)    result += ` - ${Math.abs(b)}x`;
    if (c > 0)         result += ` + ${c}`;
    else if (c < 0)    result += ` - ${Math.abs(c)}`;
    return result;
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
        // Type B: (cx + ca) / (x + a) = c (with 50% negative a)
        const c = randInt(rand, 2, 7);
        const aMag = randInt(rand, 1, 10);
        const a = randInt(rand, 0, 1) === 0 ? aMag : -aMag;
        const ca = c * a;

        const questionLatex = `\\frac{${c}x ${ca >= 0 ? '+' : '-'} ${Math.abs(ca)}}{${formatLinearLatex(a)}}`;
        const answer = `${c}`;

        const questionHtml = renderKatex(questionLatex) || `(${c}x ${ca >= 0 ? '+' : '−'} ${Math.abs(ca)})/(${formatLinearText(a)})`;

        return {
            questionHtml,
            question: `(${c}x ${ca >= 0 ? '+' : '−'} ${Math.abs(ca)})/(${formatLinearText(a)})`,
            answer,
            answerHtml: answer,
        };
    }
}

function generateHard(rand) {
    // Two types: 50/50
    const typeA = randInt(rand, 0, 1) === 0;

    if (typeA) {
        // Type A: (x+p)(x+q) / (x+p) = x + q (with signed p and q)
        // Expand numerator to x^2 + (p+q)x + pq
        const pMag = randInt(rand, 1, 8);
        const qMag = randInt(rand, 1, 8);
        let p = randInt(rand, 0, 1) === 0 ? pMag : -pMag;
        let q = randInt(rand, 0, 1) === 0 ? qMag : -qMag;
        // Ensure p ≠ q
        if (p === q) {
            q = -q; // flip sign
        }

        const bCoeff = p + q;
        const cCoeff = p * q;

        const questionLatex = `\\frac{${formatQuadraticLatex(bCoeff, cCoeff)}}{${formatLinearLatex(p)}}`;
        const answerLatex = formatLinearLatex(q);
        const answer = formatLinearText(q);

        const questionHtml = renderKatex(questionLatex) || `(x^2 + ${bCoeff}x + ${cCoeff})/(${formatLinearText(p)})`;
        const answerHtml = renderKatex(answerLatex) || answer;

        return {
            questionHtml,
            question: `(x^2 + ${bCoeff}x + ${cCoeff})/(${formatLinearText(p)})`,
            answer,
            answerHtml,
        };
    } else {
        // Type B: (x+p)(x+q) / ((x+p)(x+r)) = (x+q)/(x+r) (with signed p, q, r)
        const pMag = randInt(rand, 1, 6);
        const qMag = randInt(rand, 1, 8);
        const rMag = randInt(rand, 1, 6);
        let p = randInt(rand, 0, 1) === 0 ? pMag : -pMag;
        let q = randInt(rand, 0, 1) === 0 ? qMag : -qMag;
        let r = randInt(rand, 0, 1) === 0 ? rMag : -rMag;

        // Ensure all distinct as signed values
        if (p === q) {
            q = -q;
        }
        if (p === r) {
            r = -r;
        }
        if (q === r) {
            r = (Math.abs(r) % 5) + 1;
            if (randInt(rand, 0, 1) === 0) r = -r;
        }

        const numBCoeff = p + q;
        const numCCoeff = p * q;
        const denBCoeff = p + r;
        const denCCoeff = p * r;

        const questionLatex = `\\frac{${formatQuadraticLatex(numBCoeff, numCCoeff)}}{${formatQuadraticLatex(denBCoeff, denCCoeff)}}`;
        const answerLatex = `\\frac{${formatLinearLatex(q)}}{${formatLinearLatex(r)}}`;
        const answer = `(${formatLinearText(q)})/(${formatLinearText(r)})`;

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
