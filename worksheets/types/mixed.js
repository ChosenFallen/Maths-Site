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
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateMixedProblem(rand, difficulty));
        }
        return problems;
    },
};

function generateMixedProblem(rand, difficulty) {
    const [min, max] = difficultyRange(difficulty);
    const ops = ["+", "−", "×", "÷"];

    let a = randInt(rand, min, max);
    let b = randInt(rand, min, max);
    let c = randInt(rand, min, max);

    const op1 = ops[randInt(rand, 0, ops.length - 1)];
    const op2 = ops[randInt(rand, 0, ops.length - 1)];

    const useParens = randInt(rand, 1, 100) <= 20;

    if (useParens) {
        if (op1 === "÷") {
            b = Math.max(1, b);
            a = a * b;
        }
        if (op2 === "÷") {
            c = Math.max(1, c);
            b = b * c;
        }

        const question = `(${a} ${op1} ${b}) ${op2} ${c} =`;
        const answer = applyOp(applyOp(a, b, op1), c, op2);
        return { question, answer };
    }

    const precedenceFirst = isHighPrecedence(op1) && !isHighPrecedence(op2);
    const precedenceSecond = !isHighPrecedence(op1) && isHighPrecedence(op2);

    if (precedenceFirst || (!precedenceFirst && !precedenceSecond)) {
        // (a op1 b) op2 c
        if (op1 === "÷") {
            b = Math.max(1, b);
            a = a * b;
        }
        const firstVal = applyOp(a, b, op1);

        if (op2 === "÷") {
            const factor = getRandomFactor(firstVal, rand);
            c = factor;
        }
        if (op2 === "−") {
            c = Math.min(c, firstVal);
        }

        const question = `${a} ${op1} ${b} ${op2} ${c} =`;
        const answer = applyOp(firstVal, c, op2);
        return { question, answer };
    }

    // a op1 (b op2 c)
    if (op2 === "÷") {
        c = Math.max(1, c);
        b = b * c;
    }
    const secondVal = applyOp(b, c, op2);

    if (op1 === "÷") {
        const factor = getRandomFactor(secondVal, rand);
        a = secondVal * factor;
    }
    if (op1 === "−") {
        a = Math.max(a, secondVal);
    }

    const question = `${a} ${op1} ${b} ${op2} ${c} =`;
    const answer = applyOp(a, secondVal, op1);
    return { question, answer };
}
