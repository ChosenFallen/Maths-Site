import { randInt } from "./utils.js";

const ITEMS = ["books", "pens", "apples", "oranges", "bottles", "tickets", "bags", "cans", "jars", "boxes"];
const INGREDIENTS = ["flour", "sugar", "butter", "rice", "oats", "cheese"];

function pickItem(rand) {
    return ITEMS[randInt(rand, 0, ITEMS.length - 1)];
}

function pickIngredient(rand) {
    return INGREDIENTS[randInt(rand, 0, INGREDIENTS.length - 1)];
}

// Format pence as money string: 50→"50p", 100→"£1", 150→"£1.50"
function fmtMoney(pence) {
    if (pence < 100) return `${pence}p`;
    const pounds = pence / 100;
    return pounds % 1 === 0 ? `£${pounds}` : `£${pounds.toFixed(2)}`;
}

// "X items cost £Y. How much do Z items cost?"
function shopping(rand, unitPrices, qty1Range, qty2Range) {
    const unitPrice = unitPrices[randInt(rand, 0, unitPrices.length - 1)];
    const qty1 = randInt(rand, qty1Range[0], qty1Range[1]);
    let qty2 = randInt(rand, qty2Range[0], qty2Range[1]);
    if (qty2 === qty1) qty2 = qty2 < qty2Range[1] ? qty2 + 1 : qty2 - 1;
    const item = pickItem(rand);
    return {
        question: `${qty1} ${item} cost ${fmtMoney(unitPrice * qty1)}. How much do ${qty2} ${item} cost?`,
        answer: fmtMoney(unitPrice * qty2),
    };
}

// "A recipe for X people needs Yg of flour. How much for Z people?"
function recipe(rand, gramsPerPerson, servings1Range, servings2Range) {
    const gpp = gramsPerPerson[randInt(rand, 0, gramsPerPerson.length - 1)];
    const s1 = randInt(rand, servings1Range[0], servings1Range[1]);
    let s2 = randInt(rand, servings2Range[0], servings2Range[1]);
    if (s2 === s1) s2 = s2 < servings2Range[1] ? s2 + 1 : s2 - 1;
    const ingredient = pickIngredient(rand);
    return {
        question: `A recipe for ${s1} people needs ${gpp * s1}g of ${ingredient}. How much ${ingredient} is needed for ${s2} people?`,
        answer: `${gpp * s2}g`,
    };
}

// "X items cost £Y. How many can you buy for £Z?" (reverse)
function shoppingReverse(rand, unitPrices, qty1Range, budgetMultiplierRange) {
    const unitPrice = unitPrices[randInt(rand, 0, unitPrices.length - 1)];
    const qty1 = randInt(rand, qty1Range[0], qty1Range[1]);
    const multiplier = randInt(rand, budgetMultiplierRange[0], budgetMultiplierRange[1]);
    const item = pickItem(rand);
    const cost1 = unitPrice * qty1;
    const budget = unitPrice * multiplier; // guarantees whole answer
    return {
        question: `${qty1} ${item} cost ${fmtMoney(cost1)}. How many ${item} can you buy for ${fmtMoney(budget)}?`,
        answer: `${multiplier}`,
    };
}

export default {
    id: "direct-proportion",
    label: "Direct Proportion",
    instruction() {
        return "Use the unitary method to solve each proportion problem.";
    },
    printTitle() {
        return "Direct Proportion";
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
        // Simple shopping, clean unit prices (50p–£5)
        const unitPrices = [50, 100, 150, 200, 250, 300, 500];
        return shopping(rand, unitPrices, [2, 5], [2, 8]);
    }

    if (difficulty === "normal") {
        // Shopping or recipe, 50/50
        if (randInt(rand, 0, 1) === 0) {
            const unitPrices = [150, 200, 250, 300, 400, 500, 600, 800];
            return shopping(rand, unitPrices, [3, 6], [4, 12]);
        }
        const gramsPerPerson = [50, 75, 100, 125, 150, 200];
        return recipe(rand, gramsPerPerson, [2, 4], [3, 8]);
    }

    // hard: shopping, recipe, or reverse-shopping
    const type = randInt(rand, 0, 2);
    if (type === 0) {
        const unitPrices = [175, 225, 350, 450, 750, 1000, 1250];
        return shopping(rand, unitPrices, [4, 8], [5, 15]);
    }
    if (type === 1) {
        const gramsPerPerson = [80, 120, 150, 175, 200, 250];
        return recipe(rand, gramsPerPerson, [3, 6], [5, 12]);
    }
    // Reverse: find the quantity
    const unitPrices = [100, 150, 200, 250, 300, 500];
    return shoppingReverse(rand, unitPrices, [2, 5], [6, 15]);
}
