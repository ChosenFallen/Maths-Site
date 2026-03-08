import {
    randInt,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "factors-multiples",
    label: "Factors and Multiples",
    grades: [4, 5, 5],  // [easy, normal, hard]
    instruction() {
        return "Find all factors of a number, or find multiples of a number.";
    },
    printTitle() {
        return "Factors and Multiples";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function findFactors(n) {
    const factors = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) {
            factors.push(i);
        }
    }
    return factors;
}

function generateProblem(rand, difficulty) {
    const type = randInt(rand, 0, 1); // 0 = factors, 1 = multiples

    if (type === 0) {
        // Find factors
        let num;
        if (difficulty === "easy") {
            num = randInt(rand, 10, 50);
        } else if (difficulty === "normal") {
            num = randInt(rand, 20, 100);
        } else {
            num = randInt(rand, 30, 150);
        }

        const factors = findFactors(num);
        const answer = factors.join(", ");
        const question = `List all factors of ${num}.`;

        // Wrong answers: common mistakes
        const wrongAnswers = [];
        const seen = new Set([answer]);
        const candidates = [];

        // Mistake 1: missing the last factor
        if (factors.length > 1) {
            const missingLast = factors.slice(0, -1);
            candidates.push(missingLast.join(", "));
        }

        // Mistake 2: include one extra number that's not a factor
        const nonFactor = Math.max(...factors) + 1;
        if (nonFactor <= num) {
            const withNonFactor = [...factors, nonFactor];
            candidates.push(withNonFactor.join(", "));
        }

        // Mistake 3: only prime factors
        const primeOnlyFactors = factors.filter(f => {
            if (f < 2) return false;
            for (let i = 2; i < f; i++) if (f % i === 0) return false;
            return true;
        });
        if (primeOnlyFactors.length > 0 && primeOnlyFactors.length < factors.length) {
            candidates.push(primeOnlyFactors.join(", "));
        }

        // Mistake 4: missing first factor (skip 1)
        if (factors.length > 2 && factors[0] === 1) {
            const skipOne = factors.slice(1);
            candidates.push(skipOne.join(", "));
        }

        // Mistake 5: only up to sqrt (incomplete list)
        const halfway = Math.floor(factors.length / 2);
        if (halfway > 0 && halfway < factors.length) {
            candidates.push(factors.slice(0, halfway).join(", "));
        }

        // Collect unique candidates
        for (const wa of candidates) {
            if (!seen.has(wa)) {
                wrongAnswers.push(wa);
                seen.add(wa);
                if (wrongAnswers.length === 3) break;
            }
        }

        // Fallback: ensure we have 3
        while (wrongAnswers.length < 3) {
            const len = factors.length;
            const fallback = wrongAnswers.length === 1
                ? factors.slice(0, Math.max(1, len - 2)).join(", ")
                : wrongAnswers.length === 2
                ? factors.reverse().join(", ")
                : `${factors[0]}, ${factors[len-1]}`;
            if (!seen.has(fallback)) {
                wrongAnswers.push(fallback);
                seen.add(fallback);
            }
        }

        return { question, answer, wrongAnswers: wrongAnswers.slice(0, 3) };
    } else {
        // Find multiples
        let num, count;
        if (difficulty === "easy") {
            num = randInt(rand, 2, 10);
            count = randInt(rand, 5, 8);
        } else if (difficulty === "normal") {
            num = randInt(rand, 5, 15);
            count = randInt(rand, 5, 10);
        } else {
            num = randInt(rand, 8, 20);
            count = randInt(rand, 8, 12);
        }

        const multiples = [];
        for (let i = 1; i <= count; i++) {
            multiples.push(num * i);
        }
        const answer = multiples.join(", ");
        const question = `List the first ${count} multiples of ${num}.`;

        // Wrong answers: common mistakes
        const wrongAnswers = [];
        const seen = new Set([answer]);

        // Generate multiple wrong answer candidates
        const candidates = [];

        // Mistake 1: missing the last multiple
        const missingOne = multiples.slice(0, -1);
        if (missingOne.length > 0) {
            candidates.push(missingOne.join(", "));
        }

        // Mistake 2: multiples of num+1
        const wrongNum1 = num + 1;
        const wrongMultiples1 = [];
        for (let i = 1; i <= count; i++) {
            wrongMultiples1.push(wrongNum1 * i);
        }
        candidates.push(wrongMultiples1.join(", "));

        // Mistake 3: multiples of num-1 (if num > 1)
        if (num > 1) {
            const wrongNum2 = num - 1;
            const wrongMultiples2 = [];
            for (let i = 1; i <= count; i++) {
                wrongMultiples2.push(wrongNum2 * i);
            }
            candidates.push(wrongMultiples2.join(", "));
        }

        // Mistake 4: multiples of 2*num
        const wrongNum3 = num * 2;
        const wrongMultiples3 = [];
        for (let i = 1; i <= count; i++) {
            wrongMultiples3.push(wrongNum3 * i);
        }
        candidates.push(wrongMultiples3.join(", "));

        // Mistake 5: starting from 0
        const startFromZero = [0, ...multiples];
        candidates.push(startFromZero.slice(0, count).join(", "));

        // Mistake 6: powers of num instead
        const powerList = [];
        for (let i = 1; i <= count; i++) {
            powerList.push(Math.pow(num, i));
        }
        candidates.push(powerList.join(", "));

        // Mistake 7: skip first (start from num*2)
        const skipFirst = multiples.slice(1);
        if (skipFirst.length > 0) {
            while (skipFirst.length < count) skipFirst.push(skipFirst[skipFirst.length - 1] + num);
            candidates.push(skipFirst.join(", "));
        }

        // Collect unique ones
        for (const wa of candidates) {
            if (!seen.has(wa)) {
                wrongAnswers.push(wa);
                seen.add(wa);
                if (wrongAnswers.length === 3) break;
            }
        }

        // Ensure we have at least 3
        if (wrongAnswers.length < 3) {
            const fallbackNum = num === 2 ? 3 : num === 1 ? 2 : 1;
            const fallbackMultiples = [];
            for (let i = 1; i <= count; i++) {
                fallbackMultiples.push(fallbackNum * i);
            }
            const fallback = fallbackMultiples.join(", ");
            if (!seen.has(fallback)) {
                wrongAnswers.push(fallback);
            }
        }

        return { question, answer, wrongAnswers: wrongAnswers.slice(0, 3) };
    }
}
