import { randInt } from "./utils.js";

export default {
    id: "prime-factorization",
    label: "Prime Factorization",
    instruction(options = {}) {
        const mode = options.primeFactorMode || "index";
        if (mode === "full") return "Write each number as a product of prime factors (e.g., 12 = 2 × 2 × 3).";
        if (mode === "index") return "Write each number as a product of prime factors using index notation (e.g., 12 = 2² × 3).";
        return "Write each number as a product of prime factors.";
    },
    printTitle() {
        return "Prime Factorization";
    },
    options: [
        {
            id: "primeFactorMode",
            label: "Answer format:",
            type: "select",
            default: "index",
            values: [
                { value: "index", label: "Index notation (e.g., 2² × 3)" },
                { value: "full", label: "Full form (e.g., 2 × 2 × 3)" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.primeFactorMode || "index";

        for (let i = 0; i < count; i++) {
            const number = generateNumber(rand, difficulty);
            const primeFactors = getPrimeFactorization(number);

            const question = `${number}`;
            const answerFull = formatPrimeFactorsFull(primeFactors);
            const answerIndex = formatPrimeFactorsIndex(primeFactors);

            const answer = mode === "full" ? answerFull : answerIndex;

            problems.push({
                question,
                questionHtml: question,
                answer,
                answerHtml: answer,
            });
        }

        return problems;
    },
};

function generateNumber(rand, difficulty) {
    let min, max;

    if (difficulty === "easy") {
        min = 12;
        max = 100;
    } else if (difficulty === "normal") {
        min = 50;
        max = 500;
    } else {
        min = 100;
        max = 1000;
    }

    let number;
    do {
        number = randInt(rand, min, max);
    } while (isPrime(number)); // Avoid prime numbers

    return number;
}

function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function getPrimeFactorization(n) {
    const factors = [];
    let num = n;

    // Check for factor 2
    while (num % 2 === 0) {
        factors.push(2);
        num = num / 2;
    }

    // Check for odd factors from 3 onwards
    for (let i = 3; i * i <= num; i += 2) {
        while (num % i === 0) {
            factors.push(i);
            num = num / i;
        }
    }

    // If num > 1, then it's a prime factor
    if (num > 1) {
        factors.push(num);
    }

    return factors;
}

function formatPrimeFactorsFull(factors) {
    return factors.join(" × ");
}

function formatPrimeFactorsIndex(factors) {
    // Count occurrences of each prime
    const counts = {};
    for (const factor of factors) {
        counts[factor] = (counts[factor] || 0) + 1;
    }

    // Format with indices
    const parts = [];
    for (const prime in counts) {
        const count = counts[prime];
        if (count === 1) {
            parts.push(prime);
        } else {
            parts.push(`${prime}${exponentToSuperscript(count)}`);
        }
    }

    return parts.join(" × ");
}

function exponentToSuperscript(exp) {
    const superscriptDigits = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };

    return exp.toString().split('').map(char => superscriptDigits[char] || char).join('');
}
