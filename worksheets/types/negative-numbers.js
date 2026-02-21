import { randInt } from "./utils.js";

export default {
    id: "negative-numbers",
    label: "Negative Number Operations",
    instruction() {
        return "Calculate each answer. Remember negative results are possible.";
    },
    printTitle() {
        return "Negative Number Operations";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}

function formatOp(op) {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    return op;
}

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
    const ops = ["+", "-", "*"];
    const op = ops[randInt(rand, 0, 2)];

    let a, b, answer;

    if (op === "+") {
        a = randInt(rand, -10, 10);
        answer = randInt(rand, -10, 10);
        b = answer - a;
    } else if (op === "-") {
        a = randInt(rand, -10, 10);
        answer = randInt(rand, -10, 10);
        b = a - answer;
    } else {
        // op === "*"
        a = randInt(rand, -5, 5);
        if (a === 0) a = 1;
        b = randInt(rand, -5, 5);
        if (b === 0) b = 1;
        answer = a * b;
    }

    const opStr = formatOp(op);
    const question = `${formatNum(a)} ${opStr} ${formatNum(b)} =`;

    return { question, answer: formatNum(answer) };
}

function generateNormal(rand) {
    const ops = ["+", "-", "*", "/"];
    const op = ops[randInt(rand, 0, 3)];

    let a, b, answer;

    if (op === "+") {
        a = randInt(rand, -20, 20);
        answer = randInt(rand, -20, 20);
        b = answer - a;
    } else if (op === "-") {
        a = randInt(rand, -20, 20);
        answer = randInt(rand, -20, 20);
        b = a - answer;
    } else if (op === "*") {
        a = randInt(rand, -6, 6);
        if (a === 0) a = 1;
        b = randInt(rand, -6, 6);
        if (b === 0) b = 1;
        answer = a * b;
    } else {
        // op === "/"
        answer = randInt(rand, -10, 10);
        if (answer === 0) answer = 1;
        b = randInt(rand, -5, 5);
        if (b === 0) b = 1;
        a = answer * b;
    }

    const opStr = formatOp(op);
    const question = `${formatNum(a)} ${opStr} ${formatNum(b)} =`;

    return { question, answer: formatNum(answer) };
}

function generateHard(rand) {
    const withBrackets = randInt(rand, 0, 1) === 0;

    let a, b, c, answer;

    if (withBrackets) {
        // (a + b) × c
        a = randInt(rand, -10, 10);
        b = randInt(rand, -10, 10);
        c = randInt(rand, -5, 5);
        if (c === 0) c = 1;
        answer = (a + b) * c;

        const question = `(${formatNum(a)} + ${formatNum(b)}) × ${formatNum(c)} =`;
        return { question, answer: formatNum(answer) };
    } else {
        // a + b × c
        b = randInt(rand, -5, 5);
        if (b === 0) b = 1;
        c = randInt(rand, -5, 5);
        if (c === 0) c = 1;
        const product = b * c;
        a = randInt(rand, -10, 10);
        answer = a + product;

        const question = `${formatNum(a)} + ${formatNum(b)} × ${formatNum(c)} =`;
        return { question, answer: formatNum(answer) };
    }
}
