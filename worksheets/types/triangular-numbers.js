import { randInt } from "./utils.js";

export default {
    id: "triangular-numbers",
    label: "Triangular Numbers",
    instruction() {
        return "Find triangular numbers or identify properties of triangular number sequences.";
    },
    printTitle() {
        return "Triangular Numbers";
    },
    generate(rand, difficulty, count) {
        const pool = buildPool(difficulty);

        let all = [...pool];
        while (all.length < count) all = all.concat([...pool]);
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }

        return all.slice(0, count).map(p => makeProblem(p));
    },
};

function triangularNumber(n) {
    return (n * (n + 1)) / 2;
}

function buildPool(difficulty) {
    const pool = [];

    if (difficulty === "easy") {
        // "What is the nth triangular number?" for n = 1..20 → 20 unique
        for (let n = 1; n <= 20; n++) {
            pool.push({ type: "find", n });
        }
    } else if (difficulty === "normal") {
        // Find nth for n = 1..25 → 25 unique
        for (let n = 1; n <= 25; n++) {
            pool.push({ type: "find", n });
        }
    } else {
        // Hard: mix "find nth" (n = 10..30) and "find position" (n = 5..25)
        for (let n = 10; n <= 30; n++) {
            pool.push({ type: "find", n });
        }
        for (let n = 5; n <= 25; n++) {
            pool.push({ type: "position", n });
        }
    }

    return pool;
}

function makeProblem({ type, n }) {
    if (type === "find") {
        const answer = triangularNumber(n);
        const ordinal = toOrdinal(n);
        const question = n <= 10
            ? `What is the ${ordinal} triangular number?`
            : `Find the ${ordinal} triangular number.`;
        return { question, answer: `${answer}` };
    } else {
        // type === "position"
        const number = triangularNumber(n);
        const question = `What position is the triangular number ${number}?`;
        return { question, answer: `${n}` };
    }
}

function toOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
