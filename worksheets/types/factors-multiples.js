import { randInt } from "./utils.js";

export default {
    id: "factors-multiples",
    label: "Factors and Multiples",
    instruction() {
        return "Find all factors of a number, or find multiples of a number.";
    },
    printTitle() {
        return "Factors and Multiples";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function findFactors(n) {
    const factors = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) {
            factors.push(i);
        }
    }
    return factors;
}

function generateProblem(rand, difficulty) {
    const type = randInt(rand, 0, 1); // 0 = factors, 1 = multiples

    if (type === 0) {
        // Find factors
        let num;
        if (difficulty === "easy") {
            num = randInt(rand, 10, 50);
        } else if (difficulty === "normal") {
            num = randInt(rand, 20, 100);
        } else {
            num = randInt(rand, 30, 150);
        }

        const factors = findFactors(num);
        const answer = factors.join(", ");
        const question = `List all factors of ${num}.`;

        return { question, answer };
    } else {
        // Find multiples
        let num, count;
        if (difficulty === "easy") {
            num = randInt(rand, 2, 10);
            count = randInt(rand, 5, 8);
        } else if (difficulty === "normal") {
            num = randInt(rand, 5, 15);
            count = randInt(rand, 5, 10);
        } else {
            num = randInt(rand, 8, 20);
            count = randInt(rand, 8, 12);
        }

        const multiples = [];
        for (let i = 1; i <= count; i++) {
            multiples.push(num * i);
        }
        const answer = multiples.join(", ");
        const question = `List the first ${count} multiples of ${num}.`;

        return { question, answer };
    }
}
