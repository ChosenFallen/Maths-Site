import { randInt, gcd } from "./utils.js";

export default {
    id: "reverse-percentages",
    label: "Reverse Percentages",
    instruction(options = {}) {
        const mode = options.changeType || "mixed";
        if (mode === "increase") return "Find the original value before the percentage increase.";
        if (mode === "decrease") return "Find the original value before the percentage decrease.";
        return "Find the original value before the percentage change.";
    },
    printTitle(options = {}) {
        const mode = options.changeType || "mixed";
        if (mode === "increase") return "Reverse Percentages (Increase)";
        if (mode === "decrease") return "Reverse Percentages (Decrease)";
        return "Reverse Percentages";
    },
    options: [
        {
            id: "changeType",
            label: "Type:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "increase", label: "Increase" },
                { value: "decrease", label: "Decrease" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.changeType || "mixed";

        for (let i = 0; i < count; i++) {
            let changeType;
            if (mode === "mixed") {
                changeType = randInt(rand, 0, 1) === 0 ? "increase" : "decrease";
            } else {
                changeType = mode;
            }

            problems.push(generateProblem(rand, difficulty, changeType));
        }

        return problems;
    },
};

function generateProblem(rand, difficulty, changeType) {
    let question = "";
    let answer = "";
    let percent, originalBase, multiple, original, change, newValue;

    if (difficulty === "easy") {
        const percentPool = [10, 20, 25, 50];
        percent = percentPool[randInt(rand, 0, percentPool.length - 1)];
        originalBase = randInt(rand, 1, 10);
        multiple = 10000 / gcd(percent * 100, 10000);
        original = originalBase * multiple;
        change = Math.round(original * percent / 100);
        newValue = changeType === "increase" ? original + change : Math.max(1, original - change);
    } else if (difficulty === "normal") {
        const percentPool = [5, 10, 15, 20, 25, 30, 40, 50];
        percent = percentPool[randInt(rand, 0, percentPool.length - 1)];
        originalBase = randInt(rand, 4, 40);
        multiple = 10000 / gcd(percent * 100, 10000);
        original = originalBase * multiple;
        change = Math.round(original * percent / 100);
        newValue = changeType === "increase" ? original + change : Math.max(1, original - change);
    } else {
        const percentPool = [1, 2, 5, 10, 12.5, 15, 17.5, 20, 25, 30, 33.333, 40, 50, 60, 75];
        percent = percentPool[randInt(rand, 0, percentPool.length - 1)];
        originalBase = randInt(rand, 5, 100);
        multiple = 10000 / gcd(Math.round(percent * 100), 10000);
        original = originalBase * multiple;
        change = Math.round(original * percent / 100);
        newValue = changeType === "increase" ? original + change : Math.max(1, original - change);
    }

    const changeWord = changeType === "increase" ? "increase" : "decrease";
    question = `After a ${percent}% ${changeWord}, the value is ${newValue}. Find the original.`;
    answer = original.toString();

    return {
        question,
        questionHtml: question,
        answer,
        answerHtml: answer,
    };
}
