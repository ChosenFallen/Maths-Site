import { randInt, shuffle } from "./utils.js";

export default {
    id: "ordering-numbers",
    label: "Ordering Numbers",

    instruction() {
        return "Order these numbers from smallest to largest.";
    },

    printTitle() {
        return "Ordering Numbers";
    },

    generate(rand, difficulty, count) {
        const problems = [];

        for (let i = 0; i < count; i++) {
            const problem = generateOrderingProblem(rand, difficulty);
            problems.push(problem);
        }

        return problems;
    },
};

function generateOrderingProblem(rand, difficulty) {
    // Determine number count and range based on difficulty
    let numberCount, minValue, maxValue;

    if (difficulty === "easy") {
        numberCount = randInt(rand, 4, 5); // 4-5 numbers
        minValue = 1;
        maxValue = 100;
    } else if (difficulty === "normal") {
        numberCount = randInt(rand, 5, 6); // 5-6 numbers
        minValue = -50;
        maxValue = 100;
    } else {
        numberCount = randInt(rand, 6, 7); // 6-7 numbers
        minValue = -100;
        maxValue = 100;
    }

    // Generate unique random numbers
    const numbers = [];
    const seen = new Set();

    while (numbers.length < numberCount) {
        const num = randInt(rand, minValue, maxValue);
        if (!seen.has(num)) {
            numbers.push(num);
            seen.add(num);
        }
    }

    // Shuffle the numbers for the question
    const shuffledNumbers = [...numbers];
    shuffle(rand, shuffledNumbers);

    // Sort for the answer
    const sortedNumbers = [...numbers].sort((a, b) => a - b);

    return {
        question: shuffledNumbers.join(", "),
        answer: sortedNumbers.join(", "),
    };
}
