import { randInt } from "./utils.js";

const HARD_FORMULAS = [
    { q: "v = u + at, make u the subject", a: "u = v − at" },
    { q: "v = u + at, make a the subject", a: "a = (v − u) / t" },
    { q: "v = u + at, make t the subject", a: "t = (v − u) / a" },
    { q: "F = ma, make m the subject", a: "m = F / a" },
    { q: "F = ma, make a the subject", a: "a = F / m" },
    { q: "P = 2l + 2w, make l the subject", a: "l = (P − 2w) / 2" },
    { q: "P = 2l + 2w, make w the subject", a: "w = (P − 2l) / 2" },
    { q: "A = ½bh, make b the subject", a: "b = 2A / h" },
    { q: "A = ½bh, make h the subject", a: "h = 2A / b" },
    { q: "E = ½mv², make m the subject", a: "m = 2E / v²" },
    { q: "C = 2πr, make r the subject", a: "r = C / (2π)" },
    { q: "v = d / t, make d the subject", a: "d = vt" },
    { q: "v = d / t, make t the subject", a: "t = d / v" },
    { q: "W = Fd, make F the subject", a: "F = W / d" },
    { q: "W = Fd, make d the subject", a: "d = W / F" },
    { q: "P = IV, make I the subject", a: "I = P / V" },
    { q: "P = IV, make V the subject", a: "V = P / I" },
    { q: "R = V / I, make V the subject", a: "V = IR" },
    { q: "R = V / I, make I the subject", a: "I = V / R" },
    { q: "D = M / V, make M the subject", a: "M = DV" },
    { q: "D = M / V, make V the subject", a: "V = M / D" },
    { q: "p = F / A, make F the subject", a: "F = pA" },
    { q: "p = F / A, make A the subject", a: "A = F / p" },
    { q: "y = mx + c, make x the subject", a: "x = (y − c) / m" },
    { q: "y = mx + c, make m the subject", a: "m = (y − c) / x" },
];

export default {
    id: "rearranging-formulae",
    label: "Rearranging Formulae",
    instruction() {
        return "Rearrange each formula to make the indicated variable the subject.";
    },
    printTitle() {
        return "Rearranging Formulae";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty) {
    if (difficulty === "easy") {
        // 4 template types: pick one randomly
        const type = randInt(rand, 0, 3);
        const a = randInt(rand, 2, 12);

        if (type === 0) {
            // y = x + a, make x the subject
            return {
                question: `y = x + ${a}, make x the subject`,
                answer: `x = y − ${a}`,
            };
        } else if (type === 1) {
            // y = x − a, make x the subject
            return {
                question: `y = x − ${a}, make x the subject`,
                answer: `x = y + ${a}`,
            };
        } else if (type === 2) {
            // y = ax, make x the subject
            return {
                question: `y = ${a}x, make x the subject`,
                answer: `x = y / ${a}`,
            };
        } else {
            // y = x / a, make x the subject
            return {
                question: `y = x / ${a}, make x the subject`,
                answer: `x = ${a}y`,
            };
        }
    } else if (difficulty === "normal") {
        // 4 template types: pick one randomly
        const type = randInt(rand, 0, 3);
        const a = randInt(rand, 2, 8);
        const b = randInt(rand, 1, 10);

        if (type === 0) {
            // y = ax + b, make x the subject
            return {
                question: `y = ${a}x + ${b}, make x the subject`,
                answer: `x = (y − ${b}) / ${a}`,
            };
        } else if (type === 1) {
            // y = ax − b, make x the subject
            return {
                question: `y = ${a}x − ${b}, make x the subject`,
                answer: `x = (y + ${b}) / ${a}`,
            };
        } else if (type === 2) {
            // y = a(x + b), make x the subject
            return {
                question: `y = ${a}(x + ${b}), make x the subject`,
                answer: `x = y / ${a} − ${b}`,
            };
        } else {
            // y = a(x − b), make x the subject
            return {
                question: `y = ${a}(x − ${b}), make x the subject`,
                answer: `x = y / ${a} + ${b}`,
            };
        }
    } else {
        // Hard: pick from named formula list
        const idx = randInt(rand, 0, HARD_FORMULAS.length - 1);
        const formula = HARD_FORMULAS[idx];
        return {
            question: formula.q,
            answer: formula.a,
        };
    }
}
