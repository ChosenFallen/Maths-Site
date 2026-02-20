import { randInt, formatPower } from "./utils.js";

export default {
    id: "indices",
    label: "Indices (Powers)",
    instruction() {
        return "Evaluate the powers.";
    },
    printTitle() {
        return "Indices (Powers)";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            const { base, power } = pickBaseAndPower(rand, difficulty);
            const questionHtml = `${formatPower(base, power)} =`;
            const answer = Math.pow(base, power);
            problems.push({ questionHtml, answer });
        }
        return problems;
    },
};

function pickBaseAndPower(rand, difficulty) {
    switch (difficulty) {
        case "easy":
            return {
                base: randInt(rand, 2, 9),
                power: 2,
            };
        case "normal":
            return {
                base: randInt(rand, 2, 12),
                power: randInt(rand, 2, 3),
            };
        case "hard":
            return {
                base: randInt(rand, 2, 12),
                power: randInt(rand, 2, 3),
            };
        default:
            return {
                base: randInt(rand, 2, 9),
                power: 2,
            };
    }
}
