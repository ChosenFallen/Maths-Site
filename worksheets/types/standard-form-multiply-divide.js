import { randInt } from "./utils.js";

export default {
    id: "standard-form-multiply-divide",
    label: "Standard Form: Multiplication and Division",
    instruction() {
        return "Multiply or divide numbers in standard form.";
    },
    printTitle() {
        return "Standard Form: Multiplication and Division";
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
        // Simple multiplication with small coefficients
        const a = randInt(rand, 2, 5);
        const power1 = randInt(rand, 2, 4);
        const b = randInt(rand, 2, 5);
        const power2 = randInt(rand, 2, 4);
        
        // (a × 10^p1) × (b × 10^p2) = (a × b) × 10^(p1+p2)
        const resultCoeff = a * b;
        const resultPower = power1 + power2;
        
        let resultCoeffStr;
        let resultPowerAdjusted = resultPower;
        
        if (resultCoeff >= 10) {
            resultCoeffStr = (resultCoeff / 10).toFixed(1);
            resultPowerAdjusted = resultPower + 1;
        } else {
            resultCoeffStr = resultCoeff;
        }
        
        const answer = `${resultCoeffStr} × 10^${resultPowerAdjusted}`;
        const question = `(${a} × 10^${power1}) × (${b} × 10^${power2}) =`;
        return { question, answer };
    } else if (difficulty === "normal") {
        // Mix of multiplication and division with decimal coefficients
        const type = randInt(rand, 0, 1);
        
        if (type === 0) {
            // Multiplication
            const a = (randInt(rand, 10, 50) / 10).toFixed(1);
            const power1 = randInt(rand, 2, 5);
            const b = (randInt(rand, 10, 40) / 10).toFixed(1);
            const power2 = randInt(rand, 2, 5);
            
            const aNum = parseFloat(a);
            const bNum = parseFloat(b);
            const resultCoeff = aNum * bNum;
            const resultPower = power1 + power2;
            
            let resultCoeffStr;
            let resultPowerAdjusted = resultPower;
            
            if (resultCoeff >= 10) {
                resultCoeffStr = (resultCoeff / 10).toFixed(1);
                resultPowerAdjusted = resultPower + 1;
            } else {
                resultCoeffStr = resultCoeff.toFixed(1);
            }
            
            const answer = `${resultCoeffStr} × 10^${resultPowerAdjusted}`;
            const question = `(${a} × 10^${power1}) × (${b} × 10^${power2}) =`;
            return { question, answer };
        } else {
            // Division
            const a = (randInt(rand, 20, 80) / 10).toFixed(1);
            const power1 = randInt(rand, 3, 6);
            const b = (randInt(rand, 10, 40) / 10).toFixed(1);
            const power2 = randInt(rand, 1, 3);
            
            const aNum = parseFloat(a);
            const bNum = parseFloat(b);
            const resultCoeff = aNum / bNum;
            const resultPower = power1 - power2;
            
            let resultCoeffStr;
            let resultPowerAdjusted = resultPower;
            
            if (resultCoeff < 1) {
                resultCoeffStr = (resultCoeff * 10).toFixed(1);
                resultPowerAdjusted = resultPower - 1;
            } else {
                resultCoeffStr = resultCoeff.toFixed(1);
            }
            
            const answer = `${resultCoeffStr} × 10^${resultPowerAdjusted}`;
            const question = `(${a} × 10^${power1}) ÷ (${b} × 10^${power2}) =`;
            return { question, answer };
        }
    } else {
        // Hard: larger numbers and more complex operations
        const a = (randInt(rand, 30, 99) / 10).toFixed(1);
        const power1 = randInt(rand, 3, 8);
        const b = (randInt(rand, 15, 50) / 10).toFixed(1);
        const power2 = randInt(rand, 1, 4);
        
        const aNum = parseFloat(a);
        const bNum = parseFloat(b);
        const resultCoeff = aNum / bNum;
        const resultPower = power1 - power2;
        
        let resultCoeffStr;
        let resultPowerAdjusted = resultPower;
        
        if (resultCoeff < 1) {
            resultCoeffStr = (resultCoeff * 10).toFixed(2);
            resultPowerAdjusted = resultPower - 1;
        } else if (resultCoeff >= 10) {
            resultCoeffStr = (resultCoeff / 10).toFixed(2);
            resultPowerAdjusted = resultPower + 1;
        } else {
            resultCoeffStr = resultCoeff.toFixed(1);
        }
        
        const answer = `${resultCoeffStr} × 10^${resultPowerAdjusted}`;
        const question = `(${a} × 10^${power1}) ÷ (${b} × 10^${power2}) =`;
        return { question, answer };
    }
}
