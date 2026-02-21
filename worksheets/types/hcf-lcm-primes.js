import { randInt } from "./utils.js";

export default {
    id: "hcf-lcm-primes",
    label: "HCF and LCM using Product of Primes",
    instruction() {
        return "Find the HCF or LCM using prime factorization.";
    },
    printTitle() {
        return "HCF and LCM using Product of Primes";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function primeFactorize(n) {
    const factors = [];
    let d = 2;
    while (d * d <= n) {
        while (n % d === 0) {
            factors.push(d);
            n /= d;
        }
        d++;
    }
    if (n > 1) factors.push(n);
    return factors;
}

function calculateHCF(factors1, factors2) {
    let hcf = 1;
    const allFactors = [...new Set([...factors1, ...factors2])];
    
    for (const prime of allFactors) {
        const count1 = factors1.filter(f => f === prime).length;
        const count2 = factors2.filter(f => f === prime).length;
        const minCount = Math.min(count1, count2);
        
        for (let i = 0; i < minCount; i++) {
            hcf *= prime;
        }
    }
    return hcf;
}

function calculateLCM(factors1, factors2) {
    let lcm = 1;
    const allFactors = [...new Set([...factors1, ...factors2])];
    
    for (const prime of allFactors) {
        const count1 = factors1.filter(f => f === prime).length;
        const count2 = factors2.filter(f => f === prime).length;
        const maxCount = Math.max(count1, count2);
        
        for (let i = 0; i < maxCount; i++) {
            lcm *= prime;
        }
    }
    return lcm;
}

function generateProblem(rand, difficulty) {
    let num1, num2;

    if (difficulty === "easy") {
        // Simple numbers with obvious prime factors
        num1 = randInt(rand, 10, 50);
        num2 = randInt(rand, 10, 50);
    } else if (difficulty === "normal") {
        // Medium complexity
        num1 = randInt(rand, 20, 100);
        num2 = randInt(rand, 20, 100);
    } else {
        // Larger numbers
        num1 = randInt(rand, 50, 200);
        num2 = randInt(rand, 50, 200);
    }

    const factors1 = primeFactorize(num1);
    const factors2 = primeFactorize(num2);

    const type = randInt(rand, 0, 1);

    if (type === 0) {
        // Find HCF
        const hcf = calculateHCF(factors1, factors2);
        const question = `Find the HCF of ${num1} and ${num2} using prime factorization.`;
        const answer = `${hcf}`;
        return { question, answer };
    } else {
        // Find LCM
        const lcm = calculateLCM(factors1, factors2);
        const question = `Find the LCM of ${num1} and ${num2} using prime factorization.`;
        const answer = `${lcm}`;
        return { question, answer };
    }
}
