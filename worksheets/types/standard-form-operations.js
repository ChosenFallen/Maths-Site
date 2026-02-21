import { randInt } from "./utils.js";

export default {
    id: "standard-form-operations",
    label: "Standard Form: Addition and Subtraction",
    instruction() {
        return "Add or subtract numbers in standard form.";
    },
    printTitle() {
        return "Standard Form: Addition and Subtraction";
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
        // Same powers of 10, simple numbers
        const power = randInt(rand, 2, 4);
        const a = randInt(rand, 1, 9);
        const b = randInt(rand, 1, 9);
        const operation = randInt(rand, 0, 1) === 0 ? "+" : "−";
        
        const isAdd = operation === "+";
        const resultCoeff = isAdd ? a + b : Math.abs(a - b);
        let resultPower = power;
        
        if (resultCoeff >= 10) {
            resultPower += 1;
            const resultCoeffAdjusted = (resultCoeff / 10).toFixed(1);
            const answer = `${resultCoeffAdjusted} × 10^${resultPower}`;
            const question = `${a} × 10^${power} ${operation} ${b} × 10^${power} =`;
            return { question, answer };
        } else {
            const answer = `${resultCoeff} × 10^${power}`;
            const question = `${a} × 10^${power} ${operation} ${b} × 10^${power} =`;
            return { question, answer };
        }
    } else if (difficulty === "normal") {
        // Same powers, decimal coefficients
        const power = randInt(rand, 2, 6);
        const a = (randInt(rand, 10, 99) / 10).toFixed(1);
        const b = (randInt(rand, 10, 99) / 10).toFixed(1);
        const operation = randInt(rand, 0, 1) === 0 ? "+" : "−";
        
        const isAdd = operation === "+";
        const aNum = parseFloat(a);
        const bNum = parseFloat(b);
        const resultCoeff = isAdd ? aNum + bNum : Math.abs(aNum - bNum);
        const resultCoeffStr = resultCoeff.toFixed(1);
        
        let resultPower = power;
        if (resultCoeff >= 10) {
            resultPower += 1;
            const adjusted = (resultCoeff / 10).toFixed(1);
            const answer = `${adjusted} × 10^${resultPower}`;
            const question = `${a} × 10^${power} ${operation} ${b} × 10^${power} =`;
            return { question, answer };
        } else {
            const answer = `${resultCoeffStr} × 10^${power}`;
            const question = `${a} × 10^${power} ${operation} ${b} × 10^${power} =`;
            return { question, answer };
        }
    } else {
        // Different powers, need to convert
        const power1 = randInt(rand, 3, 6);
        const power2 = power1 - 1;
        const a = randInt(rand, 1, 5);
        const b = randInt(rand, 10, 99);
        
        // Convert b to same power as a
        // b × 10^(power2) = (b/10) × 10^(power1)
        const bConverted = b / 10;
        
        const operation = "+";
        const resultCoeff = a + bConverted;
        
        let resultPower = power1;
        let resultCoeffStr;
        
        if (resultCoeff >= 10) {
            resultPower += 1;
            resultCoeffStr = (resultCoeff / 10).toFixed(1);
        } else {
            resultCoeffStr = resultCoeff.toFixed(1);
        }
        
        const answer = `${resultCoeffStr} × 10^${resultPower}`;
        const question = `${a} × 10^${power1} + ${b} × 10^${power2} =`;
        return { question, answer };
    }
}
