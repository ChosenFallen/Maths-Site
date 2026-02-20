import { randInt } from "./utils.js";

// Helper function to render KaTeX
function renderKatex(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

export default {
    id: "substitution",
    label: "Substitution",
    instruction(options = {}) {
        const mode = options.variableMode || "one";
        if (mode === "one") return "Evaluate the expression for the given value.";
        return "Evaluate the expression for the given values.";
    },
    printTitle(options = {}) {
        const mode = options.variableMode || "one";
        if (mode === "one") return "Substitution (One Variable)";
        return "Substitution (Two Variables)";
    },
    options: [
        {
            id: "variableMode",
            label: "Variables:",
            type: "select",
            default: "one",
            values: [
                { value: "one", label: "One variable" },
                { value: "two", label: "Two variables" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const mode = options.variableMode || "one";
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty, mode));
        }
        return problems;
    },
};

// Helper function to format coefficient (omit 1, but keep -1 as -)
function formatCoeff(coeff, variable) {
    if (coeff === 1) return variable;
    if (coeff === -1) return `-${variable}`;
    return `${coeff}${variable}`;
}

function generateProblem(rand, difficulty, variableMode) {
    if (variableMode === "two") {
        return generateTwoVariableProblem(rand, difficulty);
    }

    // One variable
    let expression, x, answer, latex, plainText;

    const exprType = difficulty === "easy"
        ? randInt(rand, 0, 2) // Linear: ax+b, ax-b, a-bx
        : difficulty === "normal"
        ? randInt(rand, 0, 4) // Add squares: ax^2+b, ax+by (one var), ax^2-bx
        : randInt(rand, 0, 5); // Add cubics: ax^3+b, ax^2+bx+c

    const aRange = difficulty === "easy" ? [1, 9] : difficulty === "normal" ? [1, 9] : [-5, 10];
    const xRange = difficulty === "easy" ? [2, 9] : difficulty === "normal" ? [-5, 9] : [-5, 10];

    const a = randInt(rand, aRange[0], aRange[1]);
    const b = randInt(rand, aRange[0], aRange[1]);
    const c = difficulty === "hard" ? randInt(rand, aRange[0], aRange[1]) : 0;
    x = randInt(rand, xRange[0], xRange[1]);

    // Generate expression
    if (exprType === 0 && difficulty === "easy") {
        // ax + b
        expression = `${formatCoeff(a, "x")} + ${b}`;
        latex = `${formatCoeff(a, "x")} + ${b}`;
        answer = a * x + b;
    } else if (exprType === 1 && difficulty === "easy") {
        // ax - b
        expression = `${formatCoeff(a, "x")} − ${b}`;
        latex = `${formatCoeff(a, "x")} - ${b}`;
        answer = a * x - b;
    } else if (exprType === 2 && difficulty === "easy") {
        // a - bx
        expression = `${a} − ${formatCoeff(b, "x")}`;
        latex = `${a} - ${formatCoeff(b, "x")}`;
        answer = a - b * x;
    } else if (exprType === 0 && difficulty === "normal") {
        // ax^2 + b
        expression = `${formatCoeff(a, "x²")} + ${b}`;
        latex = `${formatCoeff(a, "x^{2}")} + ${b}`;
        answer = a * x * x + b;
    } else if (exprType === 1 && difficulty === "normal") {
        // ax^2 - bx
        expression = `${formatCoeff(a, "x²")} − ${formatCoeff(b, "x")}`;
        latex = `${formatCoeff(a, "x^{2}")} - ${formatCoeff(b, "x")}`;
        answer = a * x * x - b * x;
    } else if (exprType === 2 && difficulty === "normal") {
        // ax + b (repeat for variety)
        expression = `${formatCoeff(a, "x")} + ${b}`;
        latex = `${formatCoeff(a, "x")} + ${b}`;
        answer = a * x + b;
    } else if (exprType === 0 && difficulty === "hard") {
        // ax^2 + bx + c
        expression = `${formatCoeff(a, "x²")} + ${formatCoeff(b, "x")} + ${c}`;
        latex = `${formatCoeff(a, "x^{2}")} + ${formatCoeff(b, "x")} + ${c}`;
        answer = a * x * x + b * x + c;
    } else if (exprType === 1 && difficulty === "hard") {
        // ax^3 + b
        expression = `${formatCoeff(a, "x³")} + ${b}`;
        latex = `${formatCoeff(a, "x^{3}")} + ${b}`;
        answer = a * x * x * x + b;
    } else {
        // ax^2 + by^2 treated as one variable version for simplicity
        expression = `${formatCoeff(a, "x²")} + ${b}`;
        latex = `${formatCoeff(a, "x^{2}")} + ${b}`;
        answer = a * x * x + b;
    }

    // Render with KaTeX
    const katexHtml = renderKatex(latex + ` \\\\ \\text{when } x = ${x}`);

    const questionHtml = katexHtml || `${expression}\nwhen x = ${x}`;
    const question = `${expression}\nwhen x = ${x}`;

    return {
        questionHtml,
        question,
        answer,
    };
}

function generateTwoVariableProblem(rand, difficulty) {
    const aRange = difficulty === "easy" ? [1, 9] : difficulty === "normal" ? [1, 9] : [-5, 10];
    const xRange = difficulty === "easy" ? [2, 9] : difficulty === "normal" ? [2, 9] : [-5, 10];

    const a = randInt(rand, aRange[0], aRange[1]);
    const b = randInt(rand, aRange[0], aRange[1]);
    const x = randInt(rand, xRange[0], xRange[1]);
    const y = randInt(rand, xRange[0], xRange[1]);

    let expression, latex, answer;

    if (difficulty === "easy") {
        // ax + by
        expression = `${formatCoeff(a, "x")} + ${formatCoeff(b, "y")}`;
        latex = `${formatCoeff(a, "x")} + ${formatCoeff(b, "y")}`;
        answer = a * x + b * y;
    } else if (difficulty === "normal") {
        const type = randInt(rand, 0, 1);
        if (type === 0) {
            // ax + by
            expression = `${formatCoeff(a, "x")} + ${formatCoeff(b, "y")}`;
            latex = `${formatCoeff(a, "x")} + ${formatCoeff(b, "y")}`;
            answer = a * x + b * y;
        } else {
            // ax^2 + by
            expression = `${formatCoeff(a, "x²")} + ${formatCoeff(b, "y")}`;
            latex = `${formatCoeff(a, "x^{2}")} + ${formatCoeff(b, "y")}`;
            answer = a * x * x + b * y;
        }
    } else {
        // Hard: ax^2 + by^2
        expression = `${formatCoeff(a, "x²")} + ${formatCoeff(b, "y²")}`;
        latex = `${formatCoeff(a, "x^{2}")} + ${formatCoeff(b, "y^{2}")}`;
        answer = a * x * x + b * y * y;
    }

    const katexHtml = renderKatex(latex + ` \\\\ \\text{when } x = ${x}, y = ${y}`);

    const questionHtml = katexHtml || `${expression}\nwhen x = ${x}, y = ${y}`;
    const question = `${expression}\nwhen x = ${x}, y = ${y}`;

    return {
        questionHtml,
        question,
        answer,
    };
}
