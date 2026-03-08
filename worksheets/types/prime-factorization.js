import { randInt, exponentToSuperscript } from "./utils.js";

export default {
    id: "prime-factorization",
    label: "Prime Factorization",
    grades: [5, 6, 7],  // [easy, normal, hard]
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

            // Generate wrong answers (common prime factorization mistakes)
            const wrongAnswers = [];

            if (primeFactors.length > 0) {
                // Mistake 1: remove last factor
                const missingLastFactor = primeFactors.slice(0, -1);
                const wrongFull1 = missingLastFactor.length > 0 ? formatPrimeFactorsFull(missingLastFactor) : "1";
                const wrongIndex1 = missingLastFactor.length > 0 ? formatPrimeFactorsIndex(missingLastFactor) : "1";
                wrongAnswers.push(mode === "full" ? wrongFull1 : wrongIndex1);

                // Mistake 2: double one of the factors
                const withDoubledFactor = [...primeFactors];
                if (withDoubledFactor.length > 0) {
                    const idxToDouble = randInt(rand, 0, withDoubledFactor.length - 1);
                    withDoubledFactor.push(withDoubledFactor[idxToDouble]);
                    const wrongFull2 = formatPrimeFactorsFull(withDoubledFactor);
                    const wrongIndex2 = formatPrimeFactorsIndex(withDoubledFactor);
                    wrongAnswers.push(mode === "full" ? wrongFull2 : wrongIndex2);
                }

                // Mistake 3: replace a factor with its double
                if (primeFactors.length > 0) {
                    const factorsCopy = [...primeFactors];
                    const idxToDouble2 = 0;
                    if (idxToDouble2 < factorsCopy.length) {
                        factorsCopy[idxToDouble2] = factorsCopy[idxToDouble2] * 2;
                        const wrongFull3 = formatPrimeFactorsFull(factorsCopy);
                        const wrongIndex3 = formatPrimeFactorsIndex(factorsCopy);
                        wrongAnswers.push(mode === "full" ? wrongFull3 : wrongIndex3);
                    }
                }
            }

            problems.push({
                question,
                questionHtml: question,
                answer,
                answerHtml: answer,
                wrongAnswers: wrongAnswers.filter(wa => wa !== answer).slice(0, 3),
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

