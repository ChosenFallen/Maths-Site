import { randInt } from "./utils.js";

export default {
    id: "square-numbers",
    label: "Square Numbers & Square Roots",
    instruction() {
        return "Calculate the square or square root of each number.";
    },
    printTitle() {
        return "Square Numbers & Square Roots";
    },
    generate(rand, difficulty, count) {
        const pool = buildPool(difficulty);

        let all = [...pool];
        while (all.length < count) all = all.concat([...pool]);
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }

        return all.slice(0, count).map(({ base, isNegative, isSquare }) => {
            const signedBase = isNegative ? -base : base;
            return makeProblem(signedBase, isSquare);
        });
    },
};

function buildPool(difficulty) {
    const pool = [];
    if (difficulty === "easy") {
        // bases 1–10, positive only, square and square-root → 20 unique
        for (let base = 1; base <= 10; base++) {
            pool.push({ base, isNegative: false, isSquare: true });
            pool.push({ base, isNegative: false, isSquare: false });
        }
    } else if (difficulty === "normal") {
        // bases 1–15, positive and negative → 60 unique
        for (let base = 1; base <= 15; base++) {
            for (const isNegative of [false, true]) {
                pool.push({ base, isNegative, isSquare: true });
                pool.push({ base, isNegative, isSquare: false });
            }
        }
    } else {
        // bases 1–20, positive and negative → 80 unique
        for (let base = 1; base <= 20; base++) {
            for (const isNegative of [false, true]) {
                pool.push({ base, isNegative, isSquare: true });
                pool.push({ base, isNegative, isSquare: false });
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

function makeProblem(signedBase, isSquare) {
    if (isSquare) {
        const answer = signedBase * signedBase;
        const latex = signedBase < 0 ? `(${signedBase})^2` : `${signedBase}^2`;
        const questionHtml = renderKatex(latex) || `${signedBase}²`;
        return { questionHtml, answer: formatNum(answer) };
    } else {
        const radicand = signedBase * signedBase;
        const answer = Math.abs(signedBase);
        const latex = `\\sqrt{${radicand}}`;
        const questionHtml = renderKatex(latex) || `√(${radicand})`;
        return { questionHtml, answer: formatNum(answer) };
    }
}
