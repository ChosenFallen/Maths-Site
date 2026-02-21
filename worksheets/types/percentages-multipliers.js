import { randInt } from "./utils.js";

export default {
    id: "percentages-multipliers",
    label: "Percentages: Multipliers",
    instruction() {
        return "Use multipliers to calculate the new amount after a percentage change.";
    },
    printTitle() {
        return "Percentages: Multipliers";
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
    if (difficulty === "easy") {
        return generateEasy(rand);
    } else if (difficulty === "normal") {
        return generateNormal(rand);
    } else {
        return generateHard(rand);
    }
}

function generateEasy(rand) {
    // Pick from easy percentages: 10, 20, 25, 50
    const percentages = [10, 20, 25, 50];
    const percent = percentages[randInt(rand, 0, percentages.length - 1)];

    // Pick whether it's increase or decrease
    const isIncrease = randInt(rand, 0, 1) === 0;

    // Pick starting value (10-100)
    const startValue = randInt(rand, 10, 100);

    // Calculate multiplier
    const multiplier = isIncrease ? (1 + percent / 100) : (1 - percent / 100);

    // Calculate result
    const result = startValue * multiplier;

    // Build question
    const changeDir = isIncrease ? "increase" : "decrease";
    const question = `${startValue} × ${multiplier.toFixed(2)} =`;
    const answer = `${result}`;

    return { question, answer };
}

function generateNormal(rand) {
    // Pick from normal percentages: 5, 10, 15, 20, 25, 30, 40, 50
    const percentages = [5, 10, 15, 20, 25, 30, 40, 50];
    const percent = percentages[randInt(rand, 0, percentages.length - 1)];

    // Pick whether it's increase or decrease
    const isIncrease = randInt(rand, 0, 1) === 0;

    // Pick starting value (20-200)
    const startValue = randInt(rand, 20, 200);

    // Calculate multiplier
    const multiplier = isIncrease ? (1 + percent / 100) : (1 - percent / 100);

    // Calculate result
    const result = startValue * multiplier;

    // Build question
    const changeDir = isIncrease ? "increase" : "decrease";
    const question = `${startValue} × ${multiplier.toFixed(2)} =`;
    const answer = `${result}`;

    return { question, answer };
}

function generateHard(rand) {
    // Pick from harder percentages: 3, 5, 8, 12, 18, 22, 35, 45, 60, 75
    const percentages = [3, 5, 8, 12, 18, 22, 35, 45, 60, 75];
    const percent = percentages[randInt(rand, 0, percentages.length - 1)];

    // Pick whether it's increase or decrease
    const isIncrease = randInt(rand, 0, 1) === 0;

    // Pick starting value (30-300)
    const startValue = randInt(rand, 30, 300);

    // Calculate multiplier
    const multiplier = isIncrease ? (1 + percent / 100) : (1 - percent / 100);

    // Calculate result
    const result = startValue * multiplier;

    // Build question
    const changeDir = isIncrease ? "increase" : "decrease";
    const question = `${startValue} × ${multiplier.toFixed(2)} =`;
    const answer = `${result}`;

    return { question, answer };
}
