import { randInt } from "./utils.js";

export default {
    id: "percentage-of-amount",
    label: "Percentage of an Amount",
    instruction() {
        return "Find the percentage of each amount.";
    },
    printTitle() {
        return "Percentage of an Amount";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const percents = percentSet(difficulty);
        for (let i = 0; i < count; i++) {
            const percent = percents[randInt(rand, 0, percents.length - 1)];
            const base = baseAmount(rand, difficulty, percent);
            const answer = (base * percent) / 100;
            const question = `${percent}% of ${base} =`;
            problems.push({ question, answer: formatNumber(answer) });
        }
        return problems;
    },
};

function percentSet(difficulty) {
    if (difficulty === "easy") return [10, 20, 25, 50];
    if (difficulty === "normal") return [5, 10, 12.5, 15, 20, 25, 50];
    return [1, 2.5, 5, 7.5, 10, 12.5, 15, 20, 25, 33.3, 50];
}

function baseAmount(rand, difficulty, percent) {
    const max = difficulty === "easy" ? 200 : difficulty === "normal" ? 500 : 1000;
    const step = percent === 12.5 || percent === 7.5 || percent === 2.5 ? 4 : 1;
    const value = randInt(rand, 10, max);
    return Math.max(step, Math.round(value / step) * step);
}

function formatNumber(value) {
    const rounded = Math.round(value * 100) / 100;
    return rounded.toString().replace(/\.?0+$/, "");
}
