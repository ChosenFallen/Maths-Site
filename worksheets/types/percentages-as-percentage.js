import { randInt } from "./utils.js";

export default {
    id: "percentages-as-percentage",
    label: "Percentages: Expressing as a Percentage",
    instruction() {
        return "Express each amount as a percentage of the total.";
    },
    printTitle() {
        return "Percentages: Expressing as a Percentage";
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
    // Pick a clean percentage first (10, 20, 25, 30, 40, 50, 60, 75)
    const percentages = [10, 20, 25, 30, 40, 50, 60, 75];
    const percent = percentages[randInt(rand, 0, percentages.length - 1)];

    // Pick total (10-50)
    const total = randInt(rand, 10, 50);

    // Calculate part
    const part = (percent * total) / 100;

    const question = `${part} out of ${total} = ?%`;
    const answer = `${percent}%`;

    return { question, answer };
}

function generateNormal(rand) {
    // Pick a percentage (15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80)
    const percentages = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80];
    const percent = percentages[randInt(rand, 0, percentages.length - 1)];

    // Pick total (20-100)
    const total = randInt(rand, 20, 100);

    // Calculate part
    const part = (percent * total) / 100;

    const question = `${part} out of ${total} = ?%`;
    const answer = `${percent}%`;

    return { question, answer };
}

function generateHard(rand) {
    // Pick a harder percentage (12, 15, 18, 22, 28, 32, 35, 38, 42, 48, 55, 65, 72, 85)
    const percentages = [12, 15, 18, 22, 28, 32, 35, 38, 42, 48, 55, 65, 72, 85];
    const percent = percentages[randInt(rand, 0, percentages.length - 1)];

    // Pick total (25-150)
    const total = randInt(rand, 25, 150);

    // Calculate part
    const part = (percent * total) / 100;

    const question = `${part} out of ${total} = ?%`;
    const answer = `${percent}%`;

    return { question, answer };
}
