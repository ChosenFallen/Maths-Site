import { randInt, gcd, lcm } from "./utils.js";

export default {
    id: "fraction-compare",
    label: "Compare Fractions",
    instruction() {
        return "Compare the fractions using >, <, or =.";
    },
    printTitle() {
        return "Compare Fractions";
    },
    options: [
        {
            id: "fractionCompareMode",
            label: "Comparison:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "no-equals", label: "No equals" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.fractionCompareMode || "mixed";
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty, mode));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, mode = "mixed") {
    const [minDen, maxDen] = denominatorRange(difficulty);
    let d1 = randInt(rand, minDen, maxDen);
    let d2 = randInt(rand, minDen, maxDen);
    let n1 = randInt(rand, 1, d1 - 1);
    let n2 = randInt(rand, 1, d2 - 1);

    // 20% chance to be equal (unless no-equals)
    if (mode !== "no-equals" && randInt(rand, 1, 100) <= 20) {
        const factor = randInt(rand, 2, 5);
        d2 = d1 * factor;
        n2 = n1 * factor;
    } else if (mode === "no-equals") {
        while (n1 * d2 === n2 * d1) {
            d2 = randInt(rand, minDen, maxDen);
            n2 = randInt(rand, 1, d2 - 1);
        }
    }

    const left = formatFraction(n1, d1);
    const right = formatFraction(n2, d2);
    const cmp = compareFractions(n1, d1, n2, d2);
    const answer = cmp === 0 ? "=" : cmp > 0 ? ">" : "<";
    const questionHtml = `${left}  ?  ${right}`;
    const answerKeyHtml = `${left} ${answer} ${right}`;
    return { questionHtml, answer, answerKeyHtml };
}

function compareFractions(n1, d1, n2, d2) {
    const common = lcm(d1, d2);
    const a = n1 * (common / d1);
    const b = n2 * (common / d2);
    return a - b;
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

function formatFraction(numerator, denominator) {
    const g = gcd(numerator, denominator);
    const n = numerator / g;
    const d = denominator / g;
    return `<span class="frac"><span class="top">${n}</span><span class="bottom">${d}</span></span>`;
}
