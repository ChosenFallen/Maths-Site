import {
    randInt,
    renderKatex,
    formatQuadraticLatex,
    formatQuadraticText,
    formatBound,
    INEQUALITY_SIGNS_STRICT,
    INEQUALITY_SIGNS_ALL,
} from "./utils.js";

// Determine the answer region based on roots, coefficient, and sign
function buildAnswer(r1, r2, a, sign) {
    // Determine if we need the "outside" region (x < r1 or x > r2) or "inside" region (r1 < x < r2)
    const isOutside = (a > 0 && (sign === ">" || sign === "≥")) ||
                      (a < 0 && (sign === "<" || sign === "≤"));
    const isStrict = sign === ">" || sign === "<";
    const innerSign = isStrict ? "<" : "≤";
    const outerRightSign = isStrict ? ">" : "≥";

    if (isOutside) {
        return `x ${innerSign} ${formatBound(r1)} or x ${outerRightSign} ${formatBound(r2)}`;
    } else {
        return `${formatBound(r1)} ${innerSign} x ${innerSign} ${formatBound(r2)}`;
    }
}

export default {
    id: "quadratic-inequalities",
    label: "Quadratic Inequalities",
    instruction() {
        return "Solve each quadratic inequality.";
    },
    printTitle() {
        return "Quadratic Inequalities";
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
        // Monic (a=1), non-zero distinct roots from [-3,3], strict signs only (> or <)
        const sign = INEQUALITY_SIGNS_STRICT[randInt(rand, 0, 1)];

        let r1, r2;
        do {
            r1 = randInt(rand, -3, 3);
        } while (r1 === 0);
        do {
            r2 = randInt(rand, -3, 3);
        } while (r2 === 0 || r2 === r1);

        // Ensure r1 < r2 for consistency
        if (r1 > r2) [r1, r2] = [r2, r1];

        const a = 1;
        const b = -(r1 + r2);
        const c = r1 * r2;

        const questionHtml = renderKatex(formatQuadraticLatex(a, b, c, sign)) || formatQuadraticText(a, b, c, sign);
        const answer = buildAnswer(r1, r2, a, sign);

        return {
            questionHtml,
            question: formatQuadraticText(a, b, c, sign),
            answer,
        };

    } else if (difficulty === "normal") {
        // Monic (a=1), distinct roots from [-5,5], all four signs
        const sign = INEQUALITY_SIGNS_ALL[randInt(rand, 0, 3)];

        let r1 = randInt(rand, -5, 5);
        let r2;
        do {
            r2 = randInt(rand, -5, 5);
        } while (r2 === r1);

        // Ensure r1 < r2 for consistency
        if (r1 > r2) [r1, r2] = [r2, r1];

        const a = 1;
        const b = -(r1 + r2);
        const c = r1 * r2;

        const questionHtml = renderKatex(formatQuadraticLatex(a, b, c, sign)) || formatQuadraticText(a, b, c, sign);
        const answer = buildAnswer(r1, r2, a, sign);

        return {
            questionHtml,
            question: formatQuadraticText(a, b, c, sign),
            answer,
        };

    } else {
        // Hard: non-monic (a=2 or 3), non-zero distinct roots from [-4,4], all four signs
        const sign = INEQUALITY_SIGNS_ALL[randInt(rand, 0, 3)];
        const a = randInt(rand, 2, 3);

        let r1, r2;
        do {
            r1 = randInt(rand, -4, 4);
        } while (r1 === 0);
        do {
            r2 = randInt(rand, -4, 4);
        } while (r2 === 0 || r2 === r1);

        // Ensure r1 < r2 for consistency
        if (r1 > r2) [r1, r2] = [r2, r1];

        // Expand a(x - r1)(x - r2) = ax^2 - a(r1+r2)x + a*r1*r2
        const b = -a * (r1 + r2);
        const c = a * r1 * r2;

        const questionHtml = renderKatex(formatQuadraticLatex(a, b, c, sign)) || formatQuadraticText(a, b, c, sign);
        const answer = buildAnswer(r1, r2, a, sign);

        return {
            questionHtml,
            question: formatQuadraticText(a, b, c, sign),
            answer,
        };
    }
}
