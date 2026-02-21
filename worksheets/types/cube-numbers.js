import { randInt } from "./utils.js";

export default {
    id: "cube-numbers",
    label: "Cube Numbers & Cube Roots",
    instruction() {
        return "Calculate the cube or cube root of each number.";
    },
    printTitle() {
        return "Cube Numbers & Cube Roots";
    },
    generate(rand, difficulty, count) {
        const pool = buildPool(difficulty);

        // Fisher-Yates shuffle using seeded PRNG, repeating pool if needed
        let all = [...pool];
        while (all.length < count) all = all.concat([...pool]);
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }

        return all.slice(0, count).map(({ base, isNegative, isCube }) => {
            const signedBase = isNegative ? -base : base;
            return makeProblem(signedBase, isCube);
        });
    },
};

function buildPool(difficulty) {
    const pool = [];
    if (difficulty === "easy") {
        // bases 1–10, positive only, cube and cube-root → 20 unique
        for (let base = 1; base <= 10; base++) {
            pool.push({ base, isNegative: false, isCube: true });
            pool.push({ base, isNegative: false, isCube: false });
        }
    } else if (difficulty === "normal") {
        // bases 1–8, positive and negative → 32 unique
        for (let base = 1; base <= 8; base++) {
            for (const isNegative of [false, true]) {
                pool.push({ base, isNegative, isCube: true });
                pool.push({ base, isNegative, isCube: false });
            }
        }
    } else {
        // bases 1–12, positive and negative → 48 unique
        for (let base = 1; base <= 12; base++) {
            for (const isNegative of [false, true]) {
                pool.push({ base, isNegative, isCube: true });
                pool.push({ base, isNegative, isCube: false });
            }
        }
    }
    return pool;
}

function renderKatex(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

function formatNum(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}

function makeProblem(signedBase, isCube) {
    if (isCube) {
        const answer = signedBase * signedBase * signedBase;
        const latex = signedBase < 0 ? `(${signedBase})^3` : `${signedBase}^3`;
        const questionHtml = renderKatex(latex) || `${signedBase}³`;
        return { questionHtml, answer: formatNum(answer) };
    } else {
        const radicand = signedBase * signedBase * signedBase;
        const latex = `\\sqrt[3]{${radicand}}`;
        const questionHtml = renderKatex(latex) || `∛(${radicand})`;
        return { questionHtml, answer: formatNum(signedBase) };
    }
}
