import {
    randInt,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "negative-numbers-ordering",
    label: "Ordering Negative Numbers",
    grades: [3, 4, 4],  // [easy, normal, hard]
    instruction() {
        return "Order the numbers (including negative numbers) from smallest to largest.";
    },
    printTitle() {
        return "Ordering Negative Numbers";
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

function generateProblem(rand, difficulty) {
    let numbers = [];
    let count, maxRange;

    if (difficulty === "easy") {
        count = 4;
        maxRange = 30;
        for (let i = 0; i < count; i++) {
            const num = randInt(rand, -maxRange, maxRange);
            numbers.push(num);
        }
    } else if (difficulty === "normal") {
        count = 5;
        maxRange = 100;
        for (let i = 0; i < count; i++) {
            const num = randInt(rand, -maxRange, maxRange);
            numbers.push(num);
        }
    } else {
        count = 6;
        maxRange = 200;
        for (let i = 0; i < count; i++) {
            const num = randInt(rand, -maxRange, maxRange);
            numbers.push(num);
        }
    }

    // Ensure no duplicates
    numbers = [...new Set(numbers)];
    while (numbers.length < count) {
        const num = randInt(rand, -maxRange, maxRange);
        numbers.push(num);
        numbers = [...new Set(numbers)];
    }

    const originalOrder = numbers.map(formatNum).join(", ");
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const sortedOrder = sortedNumbers.map(formatNum).join(", ");

    const question = `Order from smallest to largest: ${originalOrder}`;
    const answer = sortedOrder;

    return { question, answer };
}
