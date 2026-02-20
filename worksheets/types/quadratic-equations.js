import { randInt, renderKatex, formatQuadraticLatex, formatQuadraticText } from "./utils.js";

export default {
    id: "quadratic-equations",
    label: "Quadratic Equations",
    instruction() {
        return "Solve each quadratic equation.";
    },
    printTitle() {
        return "Quadratic Equations";
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
        // Monic quadratic with small integer roots (both non-zero)
        let r1, r2;
        do {
            r1 = randInt(rand, -4, 4);
        } while (r1 === 0);
        do {
            r2 = randInt(rand, -4, 4);
        } while (r2 === 0 || r2 === r1);

        const b = -(r1 + r2);
        const c = r1 * r2;

        const questionLatex = formatQuadraticLatex(1, b, c);
        const questionText = formatQuadraticText(1, b, c);

        // Sort roots for display
        const [root1, root2] = [r1, r2].sort((a, b) => a - b);
        const root1Str = root1 < 0 ? `−${Math.abs(root1)}` : root1.toString();
        const root2Str = root2 < 0 ? `−${Math.abs(root2)}` : root2.toString();
        const answer = `x = ${root1Str} or x = ${root2Str}`;

        const questionHtml = renderKatex(questionLatex) || questionText;

        return {
            questionHtml,
            question: questionText,
            answer,
        };
    } else if (difficulty === "normal") {
        // Monic quadratic with wider integer roots (0 allowed)
        let r1, r2;
        r1 = randInt(rand, -7, 7);
        do {
            r2 = randInt(rand, -7, 7);
        } while (r2 === r1);

        const b = -(r1 + r2);
        const c = r1 * r2;

        const questionLatex = formatQuadraticLatex(1, b, c);
        const questionText = formatQuadraticText(1, b, c);

        // Sort roots for display
        const [root1, root2] = [r1, r2].sort((a, b) => a - b);
        const root1Str = root1 < 0 ? `−${Math.abs(root1)}` : root1.toString();
        const root2Str = root2 < 0 ? `−${Math.abs(root2)}` : root2.toString();
        const answer = `x = ${root1Str} or x = ${root2Str}`;

        const questionHtml = renderKatex(questionLatex) || questionText;

        return {
            questionHtml,
            question: questionText,
            answer,
        };
    } else {
        // Hard: non-monic (ax + p)(x + q) = 0 with fractional root
        const a = randInt(rand, 2, 3);

        // Pick p such that gcd(|p|, a) = 1 (i.e., p is not divisible by a)
        let pMag = randInt(rand, 1, 5);
        while (pMag % a === 0) {
            pMag++;
        }

        const pSign = randInt(rand, 0, 1) === 0 ? 1 : -1;
        const p = pSign * pMag;

        let q;
        do {
            q = randInt(rand, -6, 6);
        } while (q === 0);

        // Expand (ax + p)(x + q) = ax² + aqx + px + pq
        const aCoeff = a;
        const bCoeff = a * q + p;
        const cCoeff = p * q;

        const questionLatex = formatQuadraticLatex(aCoeff, bCoeff, cCoeff);
        const questionText = formatQuadraticText(aCoeff, bCoeff, cCoeff);

        // Roots: x = -p/a and x = -q
        const fractionalRoot = (-p) / a;
        const integerRoot = -q;

        // Sort roots numerically
        const roots = [fractionalRoot, integerRoot].sort((a, b) => a - b);

        // Format roots for display
        function formatRoot(root) {
            // Check if it's the fractional or integer root
            if (root === integerRoot) {
                return root < 0 ? `−${Math.abs(root)}` : root.toString();
            } else {
                // Fractional root: -p/a
                const numerator = -p;
                const numeratorStr = numerator < 0 ? `−${Math.abs(numerator)}` : numerator.toString();
                return `${numeratorStr}/${a}`;
            }
        }

        const root1Str = formatRoot(roots[0]);
        const root2Str = formatRoot(roots[1]);
        const answer = `x = ${root1Str} or x = ${root2Str}`;

        const questionHtml = renderKatex(questionLatex) || questionText;

        return {
            questionHtml,
            question: questionText,
            answer,
        };
    }
}
