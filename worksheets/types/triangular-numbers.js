import { randInt } from "./utils.js";

export default {
    id: "triangular-numbers",
    label: "Triangular Numbers",
    instruction() {
        return "Find triangular numbers or identify properties of triangular number sequences.";
    },
    printTitle() {
        return "Triangular Numbers";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

// Calculate the nth triangular number
function triangularNumber(n) {
    return (n * (n + 1)) / 2;
}

function generateProblem(rand, difficulty) {
    if (difficulty === "easy") {
        // Find the nth triangular number for small n
        const n = randInt(rand, 1, 10);
        const answer = triangularNumber(n);
        const question = `What is the ${n}th triangular number?`;
        return { question, answer: `${answer}` };
    } else if (difficulty === "normal") {
        // Find the nth triangular number for medium n
        const n = randInt(rand, 1, 15);
        const answer = triangularNumber(n);
        const question = `Find the ${n}th triangular number.`;
        return { question, answer: `${answer}` };
    } else {
        // Find the nth triangular number for larger n, or find position of a triangular number
        const type = randInt(rand, 0, 1);
        
        if (type === 0) {
            // Find the nth triangular number
            const n = randInt(rand, 10, 20);
            const answer = triangularNumber(n);
            const question = `Calculate the ${n}th triangular number.`;
            return { question, answer: `${answer}` };
        } else {
            // Find position of a given triangular number
            const n = randInt(rand, 8, 15);
            const number = triangularNumber(n);
            const question = `What position is the triangular number ${number}?`;
            return { question, answer: `${n}` };
        }
    }
}
