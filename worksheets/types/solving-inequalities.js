import { randInt } from "./utils.js";

const SIGNS = [">", "<", "≥", "≤"];

export default {
    id: "solving-inequalities",
    label: "Solving Inequalities",
    instruction() {
        return "Solve each inequality.";
    },
    printTitle() {
        return "Solving Inequalities";
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
    const sign = SIGNS[randInt(rand, 0, 3)];

    if (difficulty === "easy") {
        // 50/50: x + a ○ b or ax ○ b
        if (randInt(rand, 0, 1) === 0) {
            // Type A: x + a ○ b → x ○ b - a
            const a = randInt(rand, 1, 10);
            const answerVal = randInt(rand, -5, 10);
            const b = answerVal + a;

            const question = `x + ${a} ${sign} ${b}`;
            const answer = `x ${sign} ${answerVal}`;

            return { question, answer };
        } else {
            // Type B: ax ○ b → x ○ b/a
            const a = randInt(rand, 2, 5);
            const answerVal = randInt(rand, 1, 8);
            const b = a * answerVal;

            const question = `${a}x ${sign} ${b}`;
            const answer = `x ${sign} ${answerVal}`;

            return { question, answer };
        }
    } else if (difficulty === "normal") {
        // ax + c ○ b
        const a = randInt(rand, 2, 5);
        const cMag = randInt(rand, 1, 8);
        const isNegativeC = randInt(rand, 0, 1) === 0;
        const c = isNegativeC ? -cMag : cMag;
        const answerVal = randInt(rand, -2, 8);
        const b = a * answerVal + c;

        const cSign = c >= 0 ? "+" : "−";
        const question = `${a}x ${cSign} ${Math.abs(c)} ${sign} ${b}`;
        const answer = `x ${sign} ${answerVal}`;

        return { question, answer };
    } else {
        // Hard: ax + c ○ dx + e (a > d, no sign flip)
        const diff = randInt(rand, 1, 3);
        const d = randInt(rand, 1, 3);
        const a = d + diff;
        const c = randInt(rand, 1, 8);
        const answerVal = randInt(rand, -2, 6);
        const e = answerVal * diff + c;

        // Build question with proper signs
        let rightSide = `${d}x`;
        if (e > 0) {
            rightSide += ` + ${e}`;
        } else if (e < 0) {
            rightSide += ` − ${Math.abs(e)}`;
        }

        const question = `${a}x + ${c} ${sign} ${rightSide}`;
        const answer = `x ${sign} ${answerVal}`;

        return { question, answer };
    }
}
