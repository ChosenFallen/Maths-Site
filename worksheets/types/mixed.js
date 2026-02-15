import {
    randInt,
    difficultyRange,
    applyOp,
    isHighPrecedence,
    getRandomFactor,
} from "./utils.js";

export default {
    id: "mixed",
    label: "Mixed Operations",
    instruction() {
        return "Solve the following.";
    },
    printTitle() {
        return "Mixed Operations";
    },
    options: [
        {
            id: "includePowers",
            label: "Include powers (indices)",
            type: "checkbox",
            default: false,
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateMixedProblem(rand, difficulty, options));
        }
        return problems;
    },
};

function generateMixedProblem(rand, difficulty, options) {
    const [min, max] = difficultyRange(difficulty);
    const ops = options.includePowers
        ? ["+", "−", "×", "÷", "^"]
        : ["+", "−", "×", "÷"];

    let a = randInt(rand, min, max);
    let b = randInt(rand, min, max);
    let c = randInt(rand, min, max);

    let op1 = ops[randInt(rand, 0, ops.length - 1)];
    let op2 = ops[randInt(rand, 0, ops.length - 1)];

    // Avoid double powers or power-of-power expressions
    if (op1 === "^") {
        op2 = ops[randInt(rand, 0, ops.length - 2)]; // pick from non-^ ops
        if (op2 === "^") op2 = "+";
    } else if (op2 === "^") {
        // ok, single power
    }

    const useParens = randInt(rand, 1, 100) <= 20;

    if (op1 === "^") {
        a = randInt(rand, 2, 12);
        b = randInt(rand, 2, 3);
    }
    if (op2 === "^") {
        b = randInt(rand, 2, 12);
        c = randInt(rand, 2, 3);
    }

    if (useParens) {
        if (op2 === "^") {
            op2 = ops[randInt(rand, 0, ops.length - 2)];
            if (op2 === "^") op2 = "+";
        }
        if (op1 === "÷") {
            b = Math.max(1, b);
            a = a * b;
        }
        if (op2 === "÷") {
            c = Math.max(1, c);
            b = b * c;
        }

        const question = `(${formatOp(a, b, op1)}) ${formatOpSymbol(
            op2,
        )} ${c} =`;
        const first = applyOpExtended(a, b, op1);
        const answer = applyOpExtended(first, c, op2);
        return { questionHtml: question, answer };
    }

    const precedenceFirst =
        isHighPrecedenceExtended(op1) && !isHighPrecedenceExtended(op2);
    const precedenceSecond =
        !isHighPrecedenceExtended(op1) && isHighPrecedenceExtended(op2);

    if (precedenceFirst || (!precedenceFirst && !precedenceSecond)) {
        // (a op1 b) op2 c
        if (op1 === "÷") {
            b = Math.max(1, b);
            a = a * b;
        }
        let firstVal = applyOpExtended(a, b, op1);

        if (op2 === "÷") {
            // Ensure firstVal is a whole number for clean division
            firstVal = Math.round(firstVal);
            const factor = getRandomFactor(Math.abs(firstVal), rand);
            c = factor;
        }
        if (op2 === "−") {
            c = Math.min(c, Math.floor(firstVal));
        }

        const question = `${formatOp(a, b, op1)} ${formatOpSymbol(
            op2,
        )} ${c} =`;
        const answer = applyOpExtended(firstVal, c, op2);
        return { questionHtml: question, answer };
    }

    // a op1 (b op2 c)
    if (op2 === "÷") {
        c = Math.max(1, c);
        b = b * c;
    }
    let secondVal = applyOpExtended(b, c, op2);

    if (op1 === "÷") {
        // Ensure secondVal is a whole number for clean division
        secondVal = Math.round(secondVal);
        const factor = getRandomFactor(Math.abs(secondVal), rand);
        a = secondVal * factor;
    }
    if (op1 === "−") {
        a = Math.max(a, Math.ceil(secondVal));
    }

    const question = `${a} ${formatOpSymbol(op1)} ${formatOp(
        b,
        c,
        op2,
    )} =`;
    const answer = applyOpExtended(a, secondVal, op1);
    return { questionHtml: question, answer };
}

function applyOpExtended(x, y, op) {
    if (op === "^") return Math.pow(x, y);
    const result = applyOp(x, y, op);
    // Round division results to avoid long decimals
    if (op === "÷") {
        return Math.round(result * 10) / 10; // Max 1 decimal place
    }
    return result;
}

function isHighPrecedenceExtended(op) {
    return op === "^" || isHighPrecedence(op);
}

function formatOpSymbol(op) {
    return op === "^" ? "^" : op;
}

function formatOp(a, b, op) {
    if (op === "^") {
        return `${a}<sup>${b}</sup>`;
    }
    return `${a} ${op} ${b}`;
}
