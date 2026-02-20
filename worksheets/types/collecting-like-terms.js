import { randInt } from "./utils.js";

// Helper function to render KaTeX
function renderKatex(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

// Format coefficient, handling 1 and -1 specially
function formatCoeff(coeff, variable) {
    if (coeff === 1) return variable;
    if (coeff === -1) return `-${variable}`;
    return `${coeff}${variable}`;
}

export default {
    id: "collecting-like-terms",
    label: "Collecting Like Terms",
    instruction() {
        return "Simplify each expression by collecting like terms.";
    },
    printTitle() {
        return "Collecting Like Terms";
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
    let terms = [];
    let answer = "";
    let question = "";
    let latex = "";

    if (difficulty === "easy") {
        // Simple: 2-3 x terms only (all must combine), simple coefficients, ensuring like terms
        const numTerms = randInt(rand, 2, 3);
        let xCoeff = 0;

        // Generate all terms as x terms to guarantee they combine
        for (let i = 0; i < numTerms; i++) {
            const coeff = randInt(rand, 1, 9);
            const isNegative = randInt(rand, 0, 1) === 0;
            const actualCoeff = isNegative ? -coeff : coeff;
            xCoeff += actualCoeff;

            if (i === 0) {
                terms.push(`${actualCoeff}x`);
            } else {
                const sign = actualCoeff >= 0 ? "+" : "−";
                terms.push(`${sign} ${Math.abs(actualCoeff)}x`);
            }
        }

        // Build answer
        answer = `${xCoeff}x`;

    } else if (difficulty === "normal") {
        // More complex: 2-3 terms, two variables, ensuring like terms exist
        const numTerms = randInt(rand, 2, 3);
        const varCoeffs = { x: 0, y: 0 };
        let constant = 0;

        // Generate variable sequence, guaranteeing at least one variable repeats
        let termVariables = [];
        if (numTerms === 2) {
            // Both terms must use same variable to guarantee like terms
            const var1 = randInt(rand, 0, 1) === 0 ? "x" : "y";
            termVariables = [var1, var1];
        } else { // numTerms === 3
            // Ensure one variable repeats: pick a var for positions 0 and 2
            const repeatVar = randInt(rand, 0, 1) === 0 ? "x" : "y";
            const otherVar = repeatVar === "x" ? "y" : "x";
            if (randInt(rand, 0, 1) === 0) {
                termVariables = [repeatVar, otherVar, repeatVar];
            } else {
                termVariables = [otherVar, repeatVar, repeatVar];
            }
        }

        for (let i = 0; i < numTerms; i++) {
            const variable = termVariables[i];
            const coeff = randInt(rand, 1, 9);
            const isNegative = randInt(rand, 0, 1) === 0;
            const actualCoeff = isNegative ? -coeff : coeff;

            if (i === 0) {
                varCoeffs[variable] += actualCoeff;
                terms.push(formatCoeff(actualCoeff, variable));
            } else {
                varCoeffs[variable] += actualCoeff;
                const absCoeff = Math.abs(actualCoeff);
                const sign = actualCoeff >= 0 ? "+" : "−";
                terms.push(`${sign} ${formatCoeff(absCoeff, variable)}`);
            }
        }

        // Build answer
        answer = "";
        if (varCoeffs.x !== 0) {
            answer = `${varCoeffs.x}x`;
        }
        if (varCoeffs.y !== 0) {
            const sign = varCoeffs.y >= 0 ? "+" : "−";
            answer += answer ? ` ${sign} ${Math.abs(varCoeffs.y)}y` : `${varCoeffs.y}y`;
        }
        if (answer === "") answer = "0";

    } else {
        // Hard: 3-4 terms, multiple variables, larger coefficients, ensuring like terms exist
        const numTerms = randInt(rand, 3, 4);
        const varCoeffs = { x: 0, y: 0, z: 0 };

        // Generate variable sequence, guaranteeing at least one variable repeats
        let termVariables = [];
        if (numTerms === 3) {
            // Pick one variable to repeat, ensure it appears twice
            const repeatVar = ["x", "y", "z"][randInt(rand, 0, 2)];
            const remaining = ["x", "y", "z"].filter((v) => v !== repeatVar);
            const otherVar = remaining[randInt(rand, 0, 1)];
            if (randInt(rand, 0, 1) === 0) {
                termVariables = [repeatVar, otherVar, repeatVar];
            } else {
                termVariables = [otherVar, repeatVar, repeatVar];
            }
        } else {
            // 4 terms: have two variables each appear twice
            const vars = ["x", "y", "z"];
            const var1 = vars[randInt(rand, 0, 2)];
            const var2 = vars.filter((v) => v !== var1)[randInt(rand, 0, 1)];
            if (randInt(rand, 0, 1) === 0) {
                termVariables = [var1, var2, var1, var2];
            } else {
                termVariables = [var2, var1, var2, var1];
            }
        }

        for (let i = 0; i < numTerms; i++) {
            const variable = termVariables[i];
            const coeff = randInt(rand, 1, 12);
            const isNegative = randInt(rand, 0, 1) === 0;
            const actualCoeff = isNegative ? -coeff : coeff;

            if (i === 0) {
                varCoeffs[variable] += actualCoeff;
                terms.push(formatCoeff(actualCoeff, variable));
            } else {
                varCoeffs[variable] += actualCoeff;
                const absCoeff = Math.abs(actualCoeff);
                const sign = actualCoeff >= 0 ? "+" : "−";
                terms.push(`${sign} ${formatCoeff(absCoeff, variable)}`);
            }
        }

        // Build answer
        answer = "";
        for (const variable of ["x", "y", "z"]) {
            if (varCoeffs[variable] !== 0) {
                if (answer === "") {
                    answer = `${varCoeffs[variable]}${variable}`;
                } else {
                    const sign = varCoeffs[variable] >= 0 ? "+" : "−";
                    answer += ` ${sign} ${Math.abs(varCoeffs[variable])}${variable}`;
                }
            }
        }
        if (answer === "") answer = "0";
    }

    // Format question
    question = terms.join(" ");
    latex = question.replace(/−/g, "-");

    // Render with KaTeX
    const katexHtml = renderKatex(latex);
    const questionHtml = katexHtml || question;

    return {
        questionHtml,
        question,
        answer,
    };
}
