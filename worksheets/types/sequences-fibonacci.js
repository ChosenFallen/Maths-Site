import { randInt } from "./utils.js";

export default {
    id: "sequences-fibonacci",
    label: "Fibonacci-type Sequences",
    instruction() {
        return "Each term is the sum of the two previous terms. Find the next two terms.";
    },
    printTitle() {
        return "Fibonacci-type Sequences";
    },
    generate(rand, difficulty, count) {
        if (difficulty === "easy") {
            // Pool-based: a∈[1,5], b∈[1,5] → 25 unique
            const pool = [];
            for (let a = 1; a <= 5; a++) {
                for (let b = 1; b <= 5; b++) {
                    pool.push({ a, b });
                }
            }
            let all = [...pool];
            while (all.length < count) all = all.concat([...pool]);
            for (let i = all.length - 1; i > 0; i--) {
                const j = Math.floor(rand() * (i + 1));
                [all[i], all[j]] = [all[j], all[i]];
            }
            return all.slice(0, count).map(makeProblem);
        }

        const problems = [];
        for (let i = 0; i < count; i++) {
            let a, b;
            if (difficulty === "normal") {
                a = randInt(rand, 1, 8);
                b = randInt(rand, 1, 8);
            } else {
                // Hard: starting values can include negatives and zero
                a = randInt(rand, -3, 8);
                b = randInt(rand, -3, 8);
            }
            problems.push(makeProblem({ a, b }));
        }
        return problems;
    },
};

function makeProblem({ a, b }) {
    const terms = [a, b];
    for (let i = 2; i < 8; i++) {
        terms.push(terms[i - 1] + terms[i - 2]);
    }

    const shown = terms.slice(0, 6);
    const next = terms.slice(6, 8);
    const question = shown.map(formatNum).join(", ") + ", ___, ___";
    const answer = next.map(formatNum).join(", ");
    return { question, answer };
}

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}
