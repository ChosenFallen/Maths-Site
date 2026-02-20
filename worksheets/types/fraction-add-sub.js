import { randInt, gcd, lcm, formatFrac, formatFracOrWhole } from "./utils.js";

export default {
    id: "fraction-add-sub",
    label: "Add/Subtract Fractions",
    instruction(options = {}) {
        const mode = options.denominatorMode || "mixed";
        if (mode === "like")
            return "Add or subtract fractions with the same denominators and simplify.";
        if (mode === "unlike")
            return "Add or subtract fractions with different denominators and simplify.";
        return "Add or subtract and simplify your answers.";
    },
    printTitle(options = {}) {
        const mode = options.denominatorMode || "mixed";
        if (mode === "like") return "Add/Subtract Fractions (Same Denominators)";
        if (mode === "unlike")
            return "Add/Subtract Fractions (Different Denominators)";
        return "Add/Subtract Fractions";
    },
    options: [
        {
            id: "denominatorMode",
            label: "Denominators:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "like", label: "Same" },
                { value: "unlike", label: "Different" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.denominatorMode || "mixed";
        for (let i = 0; i < count; i++) {
            const like =
                mode === "like"
                    ? true
                    : mode === "unlike"
                      ? false
                      : randInt(rand, 0, 1) === 0;
            problems.push(generateProblem(rand, difficulty, like));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, like) {
    const [minDen, maxDen] = denominatorRange(difficulty);

    let d1 = randInt(rand, minDen, maxDen);
    let d2 = like ? d1 : randInt(rand, minDen, maxDen);
    if (!like) {
        while (d2 === d1) d2 = randInt(rand, minDen, maxDen);
    }

    let n1 = randInt(rand, 1, d1 - 1);
    let n2 = randInt(rand, 1, d2 - 1);

    const doSub = randInt(rand, 0, 1) === 1;

    let resultNum;
    let resultDen;

    if (like) {
        resultDen = d1;
        resultNum = doSub ? n1 - n2 : n1 + n2;
        if (doSub && resultNum < 0) {
            const t = n1;
            n1 = n2;
            n2 = t;
            resultNum = n1 - n2;
        }
    } else {
        const common = lcm(d1, d2);
        const a = n1 * (common / d1);
        const b = n2 * (common / d2);
        resultDen = common;
        resultNum = doSub ? a - b : a + b;
        if (doSub && resultNum < 0) {
            const tn = n1;
            const td = d1;
            n1 = n2;
            d1 = d2;
            n2 = tn;
            d2 = td;
            const a2 = n1 * (common / d1);
            const b2 = n2 * (common / d2);
            resultNum = a2 - b2;
        }
    }

    const divisor = gcd(Math.abs(resultNum), resultDen);
    const simpNum = resultNum / divisor;
    const simpDen = resultDen / divisor;

    const left = formatFrac(n1, d1);
    const right = formatFrac(n2, d2);
    const op = doSub ? "−" : "+";
    const questionHtml = `${left} ${op} ${right} =`;
    const formatted = formatFractionOrWhole(simpNum, simpDen);
    const answerHtml = formatted.html;
    const answer = formatted.text;

    return { questionHtml, answerHtml, answer };
}

function denominatorRange(difficulty) {
    switch (difficulty) {
        case "easy":
            return [2, 8];
        case "normal":
            return [2, 12];
        case "hard":
            return [3, 15];
        default:
            return [2, 8];
    }
}
