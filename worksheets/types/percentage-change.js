import {
    randInt, gcd,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "percentage-change",
    label: "Percentage Change",
    grades: [5, 6, 7],  // [easy, normal, hard]
    instruction(options = {}) {
        const mode = options.changeType || "mixed";
        if (mode === "mixed") return "Calculate the percentage change from the original to the new value.";
        if (mode === "increase") return "Calculate the percentage increase.";
        return "Calculate the percentage decrease.";
    },
    printTitle(options = {}) {
        const mode = options.changeType || "mixed";
        if (mode === "increase") return "Percentage Increase";
        if (mode === "decrease") return "Percentage Decrease";
        return "Percentage Change";
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
        const mode = options.changeType || "mixed";
        const problems = [];
        for (let i = 0; i < count; i++) {
            const changeType = mode === "mixed"
                ? (randInt(rand, 0, 1) === 0 ? "increase" : "decrease")
                : mode;
            problems.push(generateProblem(rand, difficulty, changeType));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, changeType) {
    // Percent pools
    const percentPools = {
        easy: [10, 20, 25, 50],
        normal: [5, 10, 15, 20, 25, 30, 40, 50],
        hard: [1, 2, 5, 10, 12.5, 15, 17.5, 20, 25, 30, 33.333, 40, 50, 60, 75],
    };

    const percents = percentPools[difficulty] || percentPools.easy;
    const percent = percents[randInt(rand, 0, percents.length - 1)];

    // Pick original value that gives clean arithmetic
    // Original should be a multiple of 100/gcd(percent*100, 100)
    const percentAsInt = Math.round(percent * 100); // e.g., 12.5% → 1250
    const divisor = gcd(percentAsInt, 10000);
    const multiple = 10000 / divisor;

    const originalBase = difficulty === "easy"
        ? randInt(rand, 1, 10)
        : difficulty === "normal"
        ? randInt(rand, 1, 20)
        : randInt(rand, 1, 30);

    const original = originalBase * multiple;

    // Calculate change
    const change = Math.round(original * percent / 100);
    const newValue = changeType === "increase"
        ? original + change
        : Math.max(1, original - change);

    // Format question and answer
    const question = `Original: ${original},  New: ${newValue}`;
    const percentStr = percent === Math.floor(percent) ? percent.toString() : percent.toFixed(1);
    const answer = changeType === "increase"
        ? `${percentStr}% increase`
        : `${percentStr}% decrease`;

    // Wrong answers: common percentage change mistakes
    const wrongAnswers = [];
    // Mistake 1: wrong direction (increase vs decrease)
    const oppositeDir = changeType === "increase" ? "decrease" : "increase";
    wrongAnswers.push(`${percentStr}% ${oppositeDir}`);
    // Mistake 2: off by 5% (or 1% for hard mode)
    const offsetPercent = difficulty === "hard" ? (percent - 1) : (percent - 5);
    const offsetPercentStr = offsetPercent === Math.floor(offsetPercent) ? offsetPercent.toString() : offsetPercent.toFixed(1);
    wrongAnswers.push(`${offsetPercentStr}% ${changeType === "increase" ? "increase" : "decrease"}`);
    // Mistake 3: decimal point error (e.g., 20 instead of 2, or vice versa)
    const altPercent = percent < 10 ? (percent * 10) : (percent / 10);
    const altPercentStr = altPercent === Math.floor(altPercent) ? altPercent.toString() : altPercent.toFixed(1);
    wrongAnswers.push(`${altPercentStr}% ${changeType === "increase" ? "increase" : "decrease"}`);

    return { question, answer, wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3) };
}
