import { randInt } from "./utils.js";

export default {
    id: "estimation",
    label: "Estimation and Sensible Estimates",
    instruction() {
        return "Round the numbers and estimate the result.";
    },
    printTitle() {
        return "Estimation and Sensible Estimates";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function roundToNearestTen(n) {
    return Math.round(n / 10) * 10;
}

function roundToNearestHundred(n) {
    return Math.round(n / 100) * 100;
}

function generateProblem(rand, difficulty) {
    if (difficulty === "easy") {
        // Simple two-number addition
        const a = randInt(rand, 20, 100);
        const b = randInt(rand, 20, 100);
        const aRounded = roundToNearestTen(a);
        const bRounded = roundToNearestTen(b);
        const estimate = aRounded + bRounded;

        const question = `Estimate: ${a} + ${b}`;
        const answer = `${estimate}`;

        return { question, answer };
    } else if (difficulty === "normal") {
        // Two-number multiplication or three-number addition
        const type = randInt(rand, 0, 1);

        if (type === 0) {
            // Multiplication
            const a = randInt(rand, 20, 100);
            const b = randInt(rand, 20, 100);
            const aRounded = roundToNearestTen(a);
            const bRounded = roundToNearestTen(b);
            const estimate = aRounded * bRounded;

            const question = `Estimate: ${a} × ${b}`;
            const answer = `${estimate}`;

            return { question, answer };
        } else {
            // Three-number addition
            const a = randInt(rand, 100, 300);
            const b = randInt(rand, 100, 300);
            const c = randInt(rand, 100, 300);
            const aRounded = roundToNearestHundred(a);
            const bRounded = roundToNearestHundred(b);
            const cRounded = roundToNearestHundred(c);
            const estimate = aRounded + bRounded + cRounded;

            const question = `Estimate: ${a} + ${b} + ${c}`;
            const answer = `${estimate}`;

            return { question, answer };
        }
    } else {
        // Hard: mix of operations with larger numbers
        const type = randInt(rand, 0, 2);

        if (type === 0) {
            // Larger multiplication
            const a = randInt(rand, 50, 200);
            const b = randInt(rand, 20, 80);
            const aRounded = roundToNearestHundred(a);
            const bRounded = roundToNearestTen(b);
            const estimate = aRounded * bRounded;

            const question = `Estimate: ${a} × ${b}`;
            const answer = `${estimate}`;

            return { question, answer };
        } else if (type === 1) {
            // Division
            const a = randInt(rand, 200, 1000);
            const b = randInt(rand, 10, 50);
            const aRounded = roundToNearestHundred(a);
            const bRounded = roundToNearestTen(b);
            const estimate = Math.round(aRounded / bRounded);

            const question = `Estimate: ${a} ÷ ${b}`;
            const answer = `${estimate}`;

            return { question, answer };
        } else {
            // Complex: multiple operations
            const a = randInt(rand, 100, 300);
            const b = randInt(rand, 100, 300);
            const aRounded = roundToNearestHundred(a);
            const bRounded = roundToNearestHundred(b);
            const estimate = aRounded + bRounded;

            const question = `Estimate: ${a} + ${b}`;
            const answer = `${estimate}`;

            return { question, answer };
        }
    }
}
