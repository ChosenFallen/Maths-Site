import { randInt } from "./utils.js";

export default {
    id: "percentages-repeated",
    label: "Percentages: Repeated Percentage Change",
    instruction() {
        return "Calculate the final amount after applying multiple percentage changes.";
    },
    printTitle() {
        return "Percentages: Repeated Percentage Change";
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
    // Two easy percentage changes
    const percentages = [10, 20, 25, 50];
    const percent1 = percentages[randInt(rand, 0, percentages.length - 1)];
    const percent2 = percentages[randInt(rand, 0, percentages.length - 1)];

    // Pick whether each is increase or decrease
    const isIncrease1 = randInt(rand, 0, 1) === 0;
    const isIncrease2 = randInt(rand, 0, 1) === 0;

    // Pick starting value (10-100)
    const startValue = randInt(rand, 10, 100);

    // Calculate first change
    const mult1 = isIncrease1 ? (1 + percent1 / 100) : (1 - percent1 / 100);
    const afterFirst = startValue * mult1;

    // Calculate second change
    const mult2 = isIncrease2 ? (1 + percent2 / 100) : (1 - percent2 / 100);
    const finalResult = afterFirst * mult2;

    // Build question
    const change1 = isIncrease1 ? `+${percent1}%` : `−${percent1}%`;
    const change2 = isIncrease2 ? `+${percent2}%` : `−${percent2}%`;
    const question = `Start with ${startValue}. After a ${change1} change, then a ${change2} change, the new amount is?`;
    const answer = `${finalResult}`;

    return { question, answer };
}

function generateNormal(rand) {
    // Two normal percentage changes
    const percentages = [5, 10, 15, 20, 25, 30];
    const percent1 = percentages[randInt(rand, 0, percentages.length - 1)];
    const percent2 = percentages[randInt(rand, 0, percentages.length - 1)];

    // Pick whether each is increase or decrease
    const isIncrease1 = randInt(rand, 0, 1) === 0;
    const isIncrease2 = randInt(rand, 0, 1) === 0;

    // Pick starting value (20-200)
    const startValue = randInt(rand, 20, 200);

    // Calculate first change
    const mult1 = isIncrease1 ? (1 + percent1 / 100) : (1 - percent1 / 100);
    const afterFirst = startValue * mult1;

    // Calculate second change
    const mult2 = isIncrease2 ? (1 + percent2 / 100) : (1 - percent2 / 100);
    const finalResult = afterFirst * mult2;

    // Build question
    const change1 = isIncrease1 ? `+${percent1}%` : `−${percent1}%`;
    const change2 = isIncrease2 ? `+${percent2}%` : `−${percent2}%`;
    const question = `Start with ${startValue}. After a ${change1} change, then a ${change2} change, the new amount is?`;
    const answer = `${finalResult}`;

    return { question, answer };
}

function generateHard(rand) {
    // Three changes for hard difficulty
    const percentages = [5, 10, 12, 15, 20, 25];
    const percent1 = percentages[randInt(rand, 0, percentages.length - 1)];
    const percent2 = percentages[randInt(rand, 0, percentages.length - 1)];
    const percent3 = percentages[randInt(rand, 0, percentages.length - 1)];

    // Pick whether each is increase or decrease
    const isIncrease1 = randInt(rand, 0, 1) === 0;
    const isIncrease2 = randInt(rand, 0, 1) === 0;
    const isIncrease3 = randInt(rand, 0, 1) === 0;

    // Pick starting value (30-300)
    const startValue = randInt(rand, 30, 300);

    // Calculate all changes
    const mult1 = isIncrease1 ? (1 + percent1 / 100) : (1 - percent1 / 100);
    const afterFirst = startValue * mult1;

    const mult2 = isIncrease2 ? (1 + percent2 / 100) : (1 - percent2 / 100);
    const afterSecond = afterFirst * mult2;

    const mult3 = isIncrease3 ? (1 + percent3 / 100) : (1 - percent3 / 100);
    const finalResult = afterSecond * mult3;

    // Build question
    const change1 = isIncrease1 ? `+${percent1}%` : `−${percent1}%`;
    const change2 = isIncrease2 ? `+${percent2}%` : `−${percent2}%`;
    const change3 = isIncrease3 ? `+${percent3}%` : `−${percent3}%`;
    const question = `Start with ${startValue}. After a ${change1} change, then a ${change2} change, then a ${change3} change, the new amount is?`;
    const answer = `${finalResult}`;

    return { question, answer };
}
