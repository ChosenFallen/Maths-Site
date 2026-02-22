import { randInt } from "./utils.js";

export default {
    id: "sequences-quadratic",
    label: "Quadratic Sequences",
    instruction() {
        return "Find an expression for the nth term of each quadratic sequence.";
    },
    printTitle() {
        return "Quadratic Sequences";
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
    let a, b, c;

    if (difficulty === "easy") {
        // 2nd difference = 2 (a = 1), simple b and c to keep terms manageable
        a = 1;
        b = randInt(rand, -2, 4);
        c = randInt(rand, 0, 8);
    } else if (difficulty === "normal") {
        a = randInt(rand, 1, 3);
        b = randInt(rand, -4, 4);
        c = randInt(rand, -5, 8);
    } else {
        a = randInt(rand, 1, 5);
        b = randInt(rand, -6, 6);
        c = randInt(rand, -10, 12);
    }

    // nth term = an² + bn + c → terms for n = 1..5
    const terms = [1, 2, 3, 4, 5].map(n => a * n * n + b * n + c);
    const question = terms.map(formatNum).join(", ") + ", ...   Find the nth term.";
    const answer = formatNthTerm(a, b, c);

    return { question, answer };
}

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}

function formatNthTerm(a, b, c) {
    let result = "";

    // an² part
    if (a === 1) result += "n²";
    else if (a === -1) result += "−n²";
    else if (a > 0) result += `${a}n²`;
    else result += `−${Math.abs(a)}n²`;

    // bn part
    if (b === 1) result += " + n";
    else if (b === -1) result += " − n";
    else if (b > 0) result += ` + ${b}n`;
    else if (b < 0) result += ` − ${Math.abs(b)}n`;

    // c part
    if (c > 0) result += ` + ${c}`;
    else if (c < 0) result += ` − ${Math.abs(c)}`;

    return result;
}
