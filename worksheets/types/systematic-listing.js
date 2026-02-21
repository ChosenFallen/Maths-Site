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
        if (difficulty === "easy") {
            // Use pool-based shuffle to guarantee uniqueness
            const pool = buildEasyPool();
            let all = [...pool];
            while (all.length < count) all = all.concat([...pool]);
            for (let i = all.length - 1; i > 0; i--) {
                const j = Math.floor(rand() * (i + 1));
                [all[i], all[j]] = [all[j], all[i]];
            }
            return all.slice(0, count).map(makeEasyProblem);
        }

        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty) {
    if (difficulty === "normal") {
        return generateNormalProblem(rand, randInt(rand, 0, 2));
    } else {
        return generateHardProblem(rand, randInt(rand, 0, 2));
    }
}

function buildEasyPool() {
    const pool = [];

    // Type 0: 2-digit numbers from N different digits (no repeats), N from 3–8 → 6 unique
    for (let digits = 3; digits <= 8; digits++) {
        pool.push({ type: 0, digits });
    }
    // Type 1: arrange N items in a line (factorial), N from 2–6 → 5 unique
    for (let items = 2; items <= 6; items++) {
        pool.push({ type: 1, items });
    }
    // Type 2: coin flip outcomes (2^N), N from 1–6 → 6 unique
    for (let coins = 1; coins <= 6; coins++) {
        pool.push({ type: 2, coins });
    }
    // Type 3: restaurant meals (starters × mains), starters ∈ [2,4], mains ∈ [2,5] → 12 unique
    for (let starters = 2; starters <= 4; starters++) {
        for (let mains = 2; mains <= 5; mains++) {
            pool.push({ type: 3, starters, mains });
        }
    }

    return pool; // 6 + 5 + 6 + 12 = 29 unique
}

function makeEasyProblem({ type, digits, items, coins, starters, mains }) {
    if (type === 0) {
        const answer = digits * (digits - 1);
        return {
            question: `How many 2-digit numbers can you make using ${digits} different digits (no repeats)?`,
            answer: `${answer}`,
        };
    } else if (type === 1) {
        const factorial = [1, 1, 2, 6, 24, 120, 720][items];
        return {
            question: `In how many ways can you arrange ${items} different items in a line?`,
            answer: `${factorial}`,
        };
    } else if (type === 2) {
        const answer = Math.pow(2, coins);
        return {
            question: `How many different outcomes are there when flipping ${coins} coin${coins > 1 ? "s" : ""}?`,
            answer: `${answer}`,
        };
    } else {
        const answer = starters * mains;
        return {
            question: `A restaurant offers ${starters} starters and ${mains} main dishes. How many different two-course meals can be chosen?`,
            answer: `${answer}`,
        };
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
