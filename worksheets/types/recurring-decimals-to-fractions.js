import { randInt } from "./utils.js";

export default {
    id: "recurring-decimals-to-fractions",
    label: "Recurring Decimals to Fractions",
    instruction() {
        return "Convert each recurring decimal to a fraction in simplest form.";
    },
    printTitle() {
        return "Recurring Decimals to Fractions";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

// GCD function for simplifying fractions
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function simplifyFraction(num, denom) {
    const g = gcd(Math.abs(num), Math.abs(denom));
    return { num: num / g, denom: denom / g };
}

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
    // Easy recurring decimals: simple one-digit repeating
    // Examples: 0.111... = 1/9, 0.222... = 2/9, 0.333... = 3/9 = 1/3, etc.
    const numerators = [1, 2, 4, 5, 7, 8]; // exclude 3, 6 (simplify nicely)
    const num = numerators[randInt(rand, 0, numerators.length - 1)];

    const question = `0.${num}̄ =`;
    const simplified = simplifyFraction(num, 9);
    const answer = `${simplified.num}/${simplified.denom}`;

    return { question, answer };
}

function generateNormal(rand) {
    // Normal: mix of purely repeating and mixed
    const type = randInt(rand, 0, 1);

    if (type === 0) {
        // Purely repeating with two digits
        // Examples: 0.142857̄ = 1/7, 0.090909̄ = 1/11, etc.
        const options = [
            { decimal: "142857", num: 1, denom: 7 },
            { decimal: "090909", num: 1, denom: 11 },
            { decimal: "181818", num: 2, denom: 11 },
            { decimal: "272727", num: 3, denom: 11 },
            { decimal: "090909", num: 1, denom: 11 },
        ];
        const option = options[randInt(rand, 0, options.length - 1)];
        const question = `0.${option.decimal}̄ =`;
        const answer = `${option.num}/${option.denom}`;
        return { question, answer };
    } else {
        // Mixed repeating (non-repeating then repeating)
        // Examples: 0.1̄6̄ = 1/6, 0.8̄3̄ = 5/6, etc.
        const options = [
            { decimal: "16̄", num: 1, denom: 6 },
            { decimal: "83̄", num: 5, denom: 6 },
            { decimal: "25̄", num: 23, denom: 90 },
            { decimal: "75̄", num: 68, denom: 90 },
        ];
        const option = options[randInt(rand, 0, options.length - 1)];
        const question = `0.${option.decimal} =`;
        const answer = `${option.num}/${option.denom}`;
        return { question, answer };
    }
}

function generateHard(rand) {
    // Hard: mix of various recurring patterns
    const options = [
        { decimal: "142857̄", num: 1, denom: 7 },
        { decimal: "142857̄", num: 2, denom: 14 }, // same as 1/7
        { decimal: "090909̄", num: 1, denom: 11 },
        { decimal: "272727̄", num: 3, denom: 11 },
        { decimal: "363636̄", num: 4, denom: 11 },
        { decimal: "454545̄", num: 5, denom: 11 },
        { decimal: "16̄", num: 1, denom: 6 },
        { decimal: "83̄", num: 5, denom: 6 },
        { decimal: "3̄", num: 1, denom: 3 },
        { decimal: "6̄", num: 2, denom: 3 },
    ];
    const option = options[randInt(rand, 0, options.length - 1)];
    const question = `0.${option.decimal} =`;
    const answer = `${option.num}/${option.denom}`;
    return { question, answer };
}
