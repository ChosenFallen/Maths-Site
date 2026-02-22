import { randInt } from "./utils.js";

export default {
    id: "sequences-geometric",
    label: "Geometric Sequences",
    instruction() {
        return "Find the next two terms of each geometric sequence.";
    },
    printTitle() {
        return "Geometric Sequences";
    },
    generate(rand, difficulty, count) {
        const pool = buildPool(difficulty);
        let all = [...pool];
        while (all.length < count) all = all.concat([...pool]);
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }
        return all.slice(0, count).map(makeProblem);
    },
};

function buildPool(difficulty) {
    const pool = [];

    if (difficulty === "easy") {
        // r ∈ {2, 3}, a₁ ∈ [1, 10] → 20 unique
        for (const r of [2, 3]) {
            for (let a1 = 1; a1 <= 10; a1++) {
                pool.push({ a1, r });
            }
        }
    } else if (difficulty === "normal") {
        // r ∈ {2, 3, 4}, a₁ ∈ [1, 8] → 24 unique
        for (const r of [2, 3, 4]) {
            for (let a1 = 1; a1 <= 8; a1++) {
                pool.push({ a1, r });
            }
        }
    } else {
        // r ∈ {2, 3, 4, 5}, a₁ ∈ [1, 5] → 20 unique
        for (const r of [2, 3, 4, 5]) {
            for (let a1 = 1; a1 <= 5; a1++) {
                pool.push({ a1, r });
            }
        }
        // Halving sequences: r = 0.5, a₁ divisible by 32 so all 6 terms are integers
        for (const a1 of [32, 64, 96, 128, 160, 192]) {
            pool.push({ a1, r: 0.5 });
        }
        // Total: 26 unique
    }

    return pool;
}

function makeProblem({ a1, r }) {
    const terms = [a1, a1 * r, a1 * r ** 2, a1 * r ** 3];
    const next = [a1 * r ** 4, a1 * r ** 5];

    const question = terms.map(n => `${n}`).join(", ") + ", ___, ___";
    const answer = next.map(n => `${n}`).join(", ");
    return { question, answer };
}
