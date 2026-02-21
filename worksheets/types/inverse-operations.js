import { randInt } from "./utils.js";

export default {
    id: "inverse-operations",
    label: "Using Calculations (Inverse Operations)",
    instruction() {
        return "Use inverse operations to find the missing value.";
    },
    printTitle() {
        return "Using Calculations (Inverse Operations)";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}

function generateProblem(rand, difficulty) {
    if (difficulty === "easy") {
        // Simple addition/subtraction with one operation
        const type = randInt(rand, 0, 1);
        
        if (type === 0) {
            // Addition: a + ? = c, find ?
            const a = randInt(rand, 5, 30);
            const c = randInt(rand, 20, 60);
            const b = c - a;
            
            const question = `${a} + ? = ${c}`;
            const answer = `${b}`;
            return { question, answer };
        } else {
            // Subtraction: a - ? = c, find ?
            const a = randInt(rand, 20, 60);
            const c = randInt(rand, 5, 30);
            const b = a - c;
            
            const question = `${a} − ? = ${c}`;
            const answer = `${b}`;
            return { question, answer };
        }
    } else if (difficulty === "normal") {
        // Mix of operations: multiplication, division
        const type = randInt(rand, 0, 2);
        
        if (type === 0) {
            // Multiplication: ? × b = c, find ?
            const b = randInt(rand, 2, 12);
            const a = randInt(rand, 3, 20);
            const c = a * b;
            
            const question = `? × ${b} = ${c}`;
            const answer = `${a}`;
            return { question, answer };
        } else if (type === 1) {
            // Division: c ÷ b = ?, find ?
            const b = randInt(rand, 2, 10);
            const a = randInt(rand, 3, 20);
            const c = a * b;
            
            const question = `${c} ÷ ${b} = ?`;
            const answer = `${a}`;
            return { question, answer };
        } else {
            // Two-step: (a + b) × c = ?, find a
            const b = randInt(rand, 5, 15);
            const c = randInt(rand, 2, 8);
            const a = randInt(rand, 2, 15);
            const result = (a + b) * c;
            
            const question = `(? + ${b}) × ${c} = ${result}`;
            const answer = `${a}`;
            return { question, answer };
        }
    } else {
        // Hard: multi-step problems with negative numbers
        const type = randInt(rand, 0, 2);
        
        if (type === 0) {
            // Two operations: a × b + c = ?, find a
            const b = randInt(rand, 2, 8);
            const c = randInt(rand, 10, 50);
            const a = randInt(rand, 5, 20);
            const result = (a * b) + c;
            
            const question = `? × ${b} + ${c} = ${result}`;
            const answer = `${a}`;
            return { question, answer };
        } else if (type === 1) {
            // Negative numbers: a − ? = c, with negative result
            const a = randInt(rand, 20, 50);
            const c = randInt(rand, -30, 10);
            const b = a - c;
            
            const question = `${a} − ? = ${formatNum(c)}`;
            const answer = `${b}`;
            return { question, answer };
        } else {
            // Division with remainder handling: ? ÷ b = c
            const b = randInt(rand, 3, 12);
            const c = randInt(rand, 5, 30);
            const a = c * b;
            
            const question = `? ÷ ${b} = ${c}`;
            const answer = `${a}`;
            return { question, answer };
        }
    }
}
