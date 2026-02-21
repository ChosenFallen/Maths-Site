import { randInt } from "./utils.js";

export default {
    id: "best-buys",
    label: "Best Buys and Unit Pricing",
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
        const answer = costPerItem % 1 === 0 ? `£${costPerItem.toFixed(2)}` : `£${costPerItem.toFixed(2)}`;
        
        const question = `${quantity} items cost £${cost}. What is the cost per item?`;
        return { question, answer };
    } else if (difficulty === "normal") {
        // Compare two options
        const cost1 = randInt(rand, 20, 60);
        const qty1 = randInt(rand, 3, 8);
        
        const cost2 = randInt(rand, 20, 60);
        const qty2 = randInt(rand, 3, 8);
        
        const unitPrice1 = cost1 / qty1;
        const unitPrice2 = cost2 / qty2;
        
        const cheaperOption = unitPrice1 < unitPrice2 ? "Option A" : "Option B";
        
        const question = `Option A: £${cost1} for ${qty1} items. Option B: £${cost2} for ${qty2} items. Which is better value?`;
        const answer = cheaperOption;
        
        return { question, answer };
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
            
            const question = `Which is best value? A: £${cost1}/${qty1}, B: £${cost2}/${qty2}, C: £${cost3}/${qty3}`;
            const answer = `Option ${bestValue}`;
            
            return { question, answer };
        } else {
            // Cost for a specific quantity
            const costPer = randInt(rand, 1, 5);
            const quantity = randInt(rand, 10, 50);
            
            const totalCost = costPer * quantity;
            
            const question = `If an item costs £${costPer} each, what is the total cost for ${quantity} items?`;
            const answer = `£${totalCost}`;
            
            return { question, answer };
        }
    }
}
