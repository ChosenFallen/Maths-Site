import { randInt } from "./utils.js";

export default {
    id: "equations-both-sides",
    label: "Equations: Letters on Both Sides",
    instruction() {
        return "Solve each equation, where letters appear on both sides.";
    },
    printTitle() {
        return "Equations: Letters on Both Sides";
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
    let question = "";
    let answer = "";

    if (difficulty === "easy") {
        // ax = bx + c form
        // x(a - b) = c, so x = c / (a - b)
        const x = randInt(rand, 1, 9);
        const a = randInt(rand, 3, 8);
        const b = randInt(rand, 1, a - 1);
        const c = x * (a - b);

        const aSign = a >= 0 ? "" : "−";
        const bSign = b >= 0 ? "+" : "−";
        const bAbs = Math.abs(b);
        const cSign = c >= 0 ? "+" : "−";
        const cAbs = Math.abs(c);

        question = `${a}x = ${bAbs}x ${cSign} ${cAbs}`;
        answer = `x = ${x}`;
    } else if (difficulty === "normal") {
        // ax + b = cx + d
        // x(a - c) = d - b, so x = (d - b) / (a - c)
        const x = randInt(rand, 1, 9);
        const a = randInt(rand, 2, 7);
        const c = randInt(rand, 1, a - 1);
        const b = randInt(rand, 1, 9);
        const d = b + x * (a - c);

        const bSign = b >= 0 ? "+" : "−";
        const bAbs = Math.abs(b);
        const cSign = c >= 0 ? "+" : "−";
        const cAbs = Math.abs(c);
        const dSign = d >= 0 ? "+" : "−";
        const dAbs = Math.abs(d);

        question = `${a}x ${bSign} ${bAbs} = ${cAbs}x ${dSign} ${dAbs}`;
        answer = `x = ${x}`;
    } else {
        // Hard: a(bx + c) = dx + e
        // abx + ac = dx + e
        // x(ab - d) = e - ac, so x = (e - ac) / (ab - d)
        const x = randInt(rand, 1, 8);
        const a = randInt(rand, 2, 4);
        const b = randInt(rand, 2, 4);
        const ab = a * b;
        const d = randInt(rand, 1, ab - 1);
        const c = randInt(rand, 1, 5);
        const ac = a * c;
        const e = x * (ab - d) + ac;

        const bSign = b >= 0 ? "+" : "−";
        const bAbs = Math.abs(b);
        const cSign = c >= 0 ? "+" : "−";
        const cAbs = Math.abs(c);
        const eSign = e >= 0 ? "+" : "−";
        const eAbs = Math.abs(e);

        question = `${a}(${bAbs}x ${cSign} ${cAbs}) = ${d}x ${eSign} ${eAbs}`;
        answer = `x = ${x}`;
    }

    return { question, answer };
}
