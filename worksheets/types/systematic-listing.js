import { randInt } from "./utils.js";

export default {
    id: "systematic-listing",
    label: "Systematic Listing: Counting Outcomes",
    instruction() {
        return "Count the total number of possible outcomes by systematic listing.";
    },
    printTitle() {
        return "Systematic Listing: Counting Outcomes";
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
    const type = randInt(rand, 0, 2);

    if (difficulty === "easy") {
        return generateEasyProblem(rand, type);
    } else if (difficulty === "normal") {
        return generateNormalProblem(rand, type);
    } else {
        return generateHardProblem(rand, type);
    }
}

function generateEasyProblem(rand, type) {
    if (type === 0) {
        // 2-digit numbers from small digit set
        const digits = randInt(rand, 3, 4);
        const answer = digits * (digits - 1); // n × (n-1) for no repeats
        const question = `How many 2-digit numbers can you make using ${digits} different digits (no repeats)?`;
        return { question, answer: `${answer}` };
    } else if (type === 1) {
        // Arrangements of items
        const items = randInt(rand, 2, 4);
        const factorial = [1, 1, 2, 6, 24][items]; // factorial lookup
        const question = `In how many ways can you arrange ${items} different colored balls in a line?`;
        return { question, answer: `${factorial}` };
    } else {
        // Simple coin/dice outcomes
        const coins = randInt(rand, 1, 3);
        const answer = Math.pow(2, coins);
        const question = `How many different outcomes are there when flipping ${coins} coin${coins > 1 ? "s" : ""}?`;
        return { question, answer: `${answer}` };
    }
}

function generateNormalProblem(rand, type) {
    if (type === 0) {
        // Selections/combinations
        const total = randInt(rand, 4, 6);
        const choose = randInt(rand, 2, total - 1);
        const answer = calculateCombinations(total, choose);
        const question = `How many ways can you choose ${choose} items from ${total} available items?`;
        return { question, answer: `${answer}` };
    } else if (type === 1) {
        // Permutations with larger sets
        const total = randInt(rand, 4, 6);
        const choose = randInt(rand, 2, Math.min(4, total));
        const answer = calculatePermutations(total, choose);
        const question = `How many ways can you arrange ${choose} items chosen from ${total} different items?`;
        return { question, answer: `${answer}` };
    } else {
        // Multiple events outcomes
        const event1 = randInt(rand, 2, 4);
        const event2 = randInt(rand, 2, 4);
        const answer = event1 * event2;
        const question = `A restaurant offers ${event1} main dishes and ${event2} desserts. How many different meals (main + dessert) can you choose?`;
        return { question, answer: `${answer}` };
    }
}

function generateHardProblem(rand, type) {
    if (type === 0) {
        // More complex combinations
        const total = randInt(rand, 5, 7);
        const choose = randInt(rand, 2, 4);
        const answer = calculateCombinations(total, choose);
        const question = `In how many ways can you choose ${choose} students from a group of ${total}?`;
        return { question, answer: `${answer}` };
    } else if (type === 1) {
        // Complex multi-step outcomes
        const choices1 = randInt(rand, 3, 5);
        const choices2 = randInt(rand, 3, 5);
        const choices3 = randInt(rand, 2, 4);
        const answer = choices1 * choices2 * choices3;
        const question = `You choose: a shirt (${choices1} options), pants (${choices2} options), and shoes (${choices3} options). How many different outfits are possible?`;
        return { question, answer: `${answer}` };
    } else {
        // Arrangements with restrictions
        const total = randInt(rand, 4, 6);
        const arrange = randInt(rand, 3, Math.min(4, total));
        const answer = calculatePermutations(total, arrange);
        const question = `How many different ways can you arrange ${arrange} books from a shelf of ${total} different books?`;
        return { question, answer: `${answer}` };
    }
}

function calculateCombinations(n, r) {
    // C(n, r) = n! / (r! × (n-r)!)
    if (r > n) return 0;
    if (r === 0 || r === n) return 1;
    if (r > n - r) r = n - r; // optimize

    let result = 1;
    for (let i = 0; i < r; i++) {
        result *= (n - i);
        result /= (i + 1);
    }
    return Math.round(result);
}

function calculatePermutations(n, r) {
    // P(n, r) = n! / (n-r)!
    if (r > n) return 0;

    let result = 1;
    for (let i = 0; i < r; i++) {
        result *= (n - i);
    }
    return result;
}
