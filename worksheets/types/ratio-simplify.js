import { randInt, gcd } from "./utils.js";

export default {
    id: "ratio-simplify",
    label: "Simplifying Ratios",

    instruction() {
        return "Simplify each ratio to its simplest form.";
    },

    printTitle() {
        return "Simplifying Ratios";
    },

    generate(rand, difficulty, count) {
        const problems = [];

        for (let i = 0; i < count; i++) {
            const problem = generateRatio(rand, difficulty);
            problems.push(problem);
        }

        return problems;
    },
};

function generateRatio(rand, difficulty) {
    // Determine max values based on difficulty
    let maxSimplified, maxFactor;

    if (difficulty === "easy") {
        maxSimplified = 12; // Simplified parts up to 12
        maxFactor = 5; // Common factors 2-5
    } else if (difficulty === "normal") {
        maxSimplified = 20; // Simplified parts up to 20
        maxFactor = 8; // Common factors 2-8
    } else {
        maxSimplified = 30; // Simplified parts up to 30
        maxFactor = 12; // Common factors 2-12
    }

    // Generate the simplified ratio (this is the answer)
    const simplifiedA = randInt(rand, 1, maxSimplified);
    const simplifiedB = randInt(rand, 1, maxSimplified);

    // Choose a common factor to multiply by
    const factor = randInt(rand, 2, maxFactor);

    // Create the unsimplified ratio (this is the question)
    const unsimplifiedA = simplifiedA * factor;
    const unsimplifiedB = simplifiedB * factor;

    // Verify they share this common factor
    const g = gcd(unsimplifiedA, unsimplifiedB);

    // Calculate the actual simplified form
    const finalA = unsimplifiedA / g;
    const finalB = unsimplifiedB / g;

    return {
        question: `${unsimplifiedA} : ${unsimplifiedB}`,
        answer: `${finalA} : ${finalB}`,
    };
}
