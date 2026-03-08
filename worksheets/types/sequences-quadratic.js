import {
    randInt,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "sequences-quadratic",
    label: "Quadratic Sequences",
    grades: [7, 8, 9],  // [easy, normal, hard]
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

    // Generate wrong answers
    const wrongAnswers = [];
    const seen = new Set([answer]);

    // Mistake 1: forgot the quadratic term (just bn + c)
    const wrong1 = formatNthTerm(0, b, c);
    if (!seen.has(wrong1)) {
        wrongAnswers.push(wrong1);
        seen.add(wrong1);
    }

    // Mistake 2: wrong coefficient on n² (off by one)
    const wrong2 = formatNthTerm(a + 1, b, c);
    if (!seen.has(wrong2)) {
        wrongAnswers.push(wrong2);
        seen.add(wrong2);
    }

    // Mistake 3: wrong sign on b
    const wrong3 = formatNthTerm(a, -b, c);
    if (!seen.has(wrong3)) {
        wrongAnswers.push(wrong3);
        seen.add(wrong3);
    }

    // Fallback: wrong sign on c
    if (wrongAnswers.length < 3) {
        const wrong4 = formatNthTerm(a, b, -c);
        wrongAnswers.push(wrong4);
    }

    return { question, answer, wrongAnswers: wrongAnswers.slice(0, 3) };
}

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}

function formatNthTerm(a, b, c) {
    let result = "";

    // an² part (skip if a === 0)
    if (a === 0) {
        // Skip the n² term
    } else if (a === 1) result += "n²";
    else if (a === -1) result += "−n²";
    else if (a > 0) result += `${a}n²`;
    else result += `−${Math.abs(a)}n²`;

    // bn part (skip if b === 0)
    if (b === 0) {
        // Skip the n term
    } else if (b === 1) result += result ? " + n" : "n";
    else if (b === -1) result += result ? " − n" : "−n";
    else if (b > 0) result += result ? ` + ${b}n` : `${b}n`;
    else if (b < 0) result += result ? ` − ${Math.abs(b)}n` : `−${Math.abs(b)}n`;

    // c part (skip if c === 0)
    if (c === 0) {
        // Skip the constant term
    } else if (c > 0) result += result ? ` + ${c}` : `${c}`;
    else if (c < 0) result += result ? ` − ${Math.abs(c)}` : `−${Math.abs(c)}`;

    return result;
}
