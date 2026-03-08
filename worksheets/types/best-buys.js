import { randInt, generateNumericDistracters } from "./utils.js";

export default {
    id: "best-buys",
    label: "Best Buys and Unit Pricing",
    grades: [5, 6, 7],  // [easy, normal, hard]
    instruction() {
        return "Calculate unit price or cost per item to find the best value.";
    },
    printTitle() {
        return "Best Buys and Unit Pricing";
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
        // Simple calculation: cost per item
        const cost = randInt(rand, 10, 50);
        const quantity = randInt(rand, 2, 10);

        const costPerItem = cost / quantity;
        const answer = `£${costPerItem.toFixed(2)}`;

        const question = `${quantity} items cost £${cost}. What is the cost per item?`;

        // Wrong answers: common mistakes with deduplication
        const wrongAnswers = [];
        const seen = new Set([answer]);
        const candidates = [
            `£${cost.toFixed(2)}`, // forgot to divide
            `£${(costPerItem * 2).toFixed(2)}`, // calculated double
            `£${Math.round(costPerItem)}.00`, // rounded wrong
            `£${quantity.toFixed(2)}`, // used quantity instead
            `£${(costPerItem / 2).toFixed(2)}`, // halved
        ];
        for (const wa of candidates) {
            if (!seen.has(wa)) {
                wrongAnswers.push(wa);
                seen.add(wa);
                if (wrongAnswers.length === 3) break;
            }
        }

        return { question, answer, wrongAnswers };
    } else if (difficulty === "normal") {
        // Compare two options
        const cost1 = randInt(rand, 20, 60);
        const qty1 = randInt(rand, 3, 8);

        const cost2 = randInt(rand, 20, 60);
        const qty2 = randInt(rand, 3, 8);

        const unitPrice1 = cost1 / qty1;
        const unitPrice2 = cost2 / qty2;

        const cheaperOption = unitPrice1 < unitPrice2 ? "Option A" : "Option B";
        const expensiveOption = unitPrice1 < unitPrice2 ? "Option B" : "Option A";

        const question = `Option A: £${cost1} for ${qty1} items. Option B: £${cost2} for ${qty2} items. Which is better value?`;
        const answer = cheaperOption;

        // Wrong answers with deduplication
        const wrongAnswers = [];
        const seen = new Set([answer]);
        const candidates = [
            expensiveOption, // picked more expensive
            "Option C", // made up option
            "They are the same", // when they're not
            "Not enough information",
            "Option A and Option B",
        ];
        for (const wa of candidates) {
            if (!seen.has(wa)) {
                wrongAnswers.push(wa);
                seen.add(wa);
                if (wrongAnswers.length === 3) break;
            }
        }

        return { question, answer, wrongAnswers };
    } else {
        // More complex scenario
        const type = randInt(rand, 0, 1);

        if (type === 0) {
            // Cost per unit for 3 items
            const cost1 = randInt(rand, 30, 70);
            const qty1 = randInt(rand, 4, 10);

            const cost2 = randInt(rand, 30, 70);
            const qty2 = randInt(rand, 4, 10);

            const cost3 = randInt(rand, 30, 70);
            const qty3 = randInt(rand, 4, 10);

            const unitPrice1 = (cost1 / qty1).toFixed(2);
            const unitPrice2 = (cost2 / qty2).toFixed(2);
            const unitPrice3 = (cost3 / qty3).toFixed(2);

            const prices = [
                { price: parseFloat(unitPrice1), label: "A" },
                { price: parseFloat(unitPrice2), label: "B" },
                { price: parseFloat(unitPrice3), label: "C" }
            ];

            const sorted = prices.sort((a, b) => a.price - b.price);
            const bestValue = sorted[0].label;
            const secondBest = sorted[1].label;
            const worst = sorted[2].label;

            const question = `Which is best value? A: £${cost1}/${qty1}, B: £${cost2}/${qty2}, C: £${cost3}/${qty3}`;
            const answer = `Option ${bestValue}`;

            // Wrong answers with deduplication
            const wrongAnswers = [];
            const seen = new Set([answer]);
            const candidates = [
                `Option ${worst}`, // picked worst value
                `Option ${secondBest}`, // picked middle option
                "Option D", // non-existent option
                `Option ${bestValue}`, // duplicate check
                "They are all the same",
                "Not enough information",
            ];

            for (const wa of candidates) {
                if (!seen.has(wa)) {
                    wrongAnswers.push(wa);
                    seen.add(wa);
                    if (wrongAnswers.length === 3) break;
                }
            }

            return { question, answer, wrongAnswers };
        } else {
            // Cost for a specific quantity
            const costPer = randInt(rand, 1, 5);
            const quantity = randInt(rand, 10, 50);

            const totalCost = costPer * quantity;

            const question = `If an item costs £${costPer} each, what is the total cost for ${quantity} items?`;
            const answer = `£${totalCost}`;

            // Wrong answers with diverse strategies
            const wrongAnswers = [];
            const seen = new Set([answer]);

            // Create candidates with completely different values
            const wrongCandidates = [];
            wrongCandidates.push(`£${costPer}`); // forgot to multiply
            wrongCandidates.push(`£${quantity}`); // swapped with quantity
            wrongCandidates.push(`£${totalCost - costPer}`); // subtraction
            wrongCandidates.push(`£${totalCost + costPer}`); // addition
            wrongCandidates.push(`£${totalCost * 2}`); // doubled
            wrongCandidates.push(`£${Math.max(costPer, quantity)}`); // took max
            wrongCandidates.push(`£${costPer * 100}`); // multiplied wrong
            wrongCandidates.push(`£${totalCost / 2}`); // halved
            wrongCandidates.push(`£${totalCost + quantity}`); // add quantity
            wrongCandidates.push(`£${costPer + quantity}`); // add both

            // Filter and collect unique ones
            for (const wa of wrongCandidates) {
                if (!seen.has(wa)) {
                    wrongAnswers.push(wa);
                    seen.add(wa);
                    if (wrongAnswers.length === 3) break;
                }
            }

            // Ensure we have at least 3 with fallback values
            if (wrongAnswers.length < 3) {
                const fallbackCandidates = [
                    `£${Math.round(totalCost * 1.5)}`,
                    `£${Math.round(totalCost / 1.5)}`,
                    `£${costPer + quantity}`,
                    `£${Math.max(costPer, quantity) * 2}`,
                    `£${totalCost + 1}`,
                    `£${Math.abs(totalCost - 1)}`,
                    `£${costPer * quantity * 2}`,
                    `£${costPer + costPer}`,
                ];

                for (const fb of fallbackCandidates) {
                    if (wrongAnswers.length >= 3) break;
                    if (!seen.has(fb)) {
                        wrongAnswers.push(fb);
                        seen.add(fb);
                    }
                }
            }

            // Last resort: guarantee exactly 3 by using forced unique values
            if (wrongAnswers.length < 3) {
                wrongAnswers.push(`£${totalCost + 100}`);
            }
            if (wrongAnswers.length < 3) {
                wrongAnswers.push(`£${totalCost - 100}`);
            }

            return { question, answer, wrongAnswers: wrongAnswers.slice(0, 3) };
        }
    }
}
