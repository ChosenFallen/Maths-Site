import {
    randInt,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "ordering-numbers",
    label: "Ordering Numbers",
    grades: [2, 3, 4],  // [easy, normal, hard]
    instruction() {
        return "Order the numbers from smallest to largest.";
    },
    printTitle() {
        return "Ordering Numbers";
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
    let numbers = [];
    let maxRange;

    if (difficulty === "easy") {
        maxRange = 100;
        const count = 4;
        for (let i = 0; i < count; i++) {
            numbers.push(randInt(rand, 1, maxRange));
        }
    } else if (difficulty === "normal") {
        maxRange = 500;
        const count = 5;
        for (let i = 0; i < count; i++) {
            numbers.push(randInt(rand, 1, maxRange));
        }
    } else {
        maxRange = 1000;
        const count = 6;
        for (let i = 0; i < count; i++) {
            numbers.push(randInt(rand, 1, maxRange));
        }
    }

    // Ensure no duplicates
    numbers = [...new Set(numbers)];
    while (numbers.length < (difficulty === "easy" ? 4 : difficulty === "normal" ? 5 : 6)) {
        numbers.push(randInt(rand, 1, maxRange));
        numbers = [...new Set(numbers)];
    }

    const originalOrder = numbers.join(", ");
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const sortedOrder = sortedNumbers.join(", ");

    const question = `Order from smallest to largest: ${originalOrder}`;
    const answer = sortedOrder;

    // Wrong answers: common ordering mistakes
    const wrongAnswers = [];
    // Mistake 1: reverse order (largest to smallest)
    const reversedOrder = [...sortedNumbers].reverse().join(", ");
    wrongAnswers.push(reversedOrder);
    // Mistake 2: swap first two
    const swapped = [...sortedNumbers];
    if (swapped.length > 1) {
        [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
        wrongAnswers.push(swapped.join(", "));
    }
    // Mistake 3: keep original order
    wrongAnswers.push(originalOrder);

    return { question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
}
