import { randInt, formatPower } from "./utils.js";

export default {
    id: "indices",
    label: "Indices (Powers)",
    instruction() {
        return "Evaluate the powers.";
    },
    printTitle() {
        return "Indices (Powers)";
    },
    generate(rand, difficulty, count) {
        const pool = buildPool(difficulty);

        let all = [...pool];
        while (all.length < count) all = all.concat([...pool]);
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }

        return all.slice(0, count).map(({ base, power }) => ({
            questionHtml: `${formatPower(base, power)} =`,
            answer: Math.pow(base, power),
        }));
    },
};

function buildPool(difficulty) {
    const pool = [];

    if (difficulty === "easy") {
        // base² for bases 2–21 → 20 unique, all answers ≤ 441 (well within limit)
        for (let base = 2; base <= 21; base++) {
            pool.push({ base, power: 2 });
        }
    } else if (difficulty === "normal") {
        // base² and base³ for bases 2–12 → 22 unique
        for (let base = 2; base <= 12; base++) {
            pool.push({ base, power: 2 });
            pool.push({ base, power: 3 });
        }
    } else {
        // Hard: base²/³ for 2–12 + base⁴ for 2–7 (7⁴=2401 ≤ 5000)
        for (let base = 2; base <= 12; base++) {
            pool.push({ base, power: 2 });
            pool.push({ base, power: 3 });
        }
        for (let base = 2; base <= 7; base++) {
            pool.push({ base, power: 4 });
        }
    }

    return pool;
}
