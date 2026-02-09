import { randInt, gcd } from "./utils.js";

export default {
    id: "mixed-numbers",
    label: "Mixed Numbers/Improper Fractions",
    instruction(options = {}) {
        const mode = options.mixedNumberMode || "mixed";
        if (mode === "to-improper") return "Convert to improper fractions.";
        if (mode === "to-mixed") return "Convert to mixed numbers.";
        return "Convert between mixed and improper fractions.";
    },
    printTitle(options = {}) {
        const mode = options.mixedNumberMode || "mixed";
        if (mode === "to-improper") return "Mixed to Improper Fractions";
        if (mode === "to-mixed") return "Improper to Mixed Fractions";
        return "Mixed Numbers/Improper Fractions";
    },
    options: [
        {
            id: "mixedNumberMode",
            label: "Direction:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "to-improper", label: "Mixed → Improper" },
                { value: "to-mixed", label: "Improper → Mixed" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.mixedNumberMode || "mixed";
        for (let i = 0; i < count; i++) {
            const toImproper =
                mode === "to-improper"
                    ? true
                    : mode === "to-mixed"
                      ? false
                      : randInt(rand, 0, 1) === 0;
            problems.push(generateProblem(rand, difficulty, toImproper));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, toImproper) {
    const [minDen, maxDen, minWhole, maxWhole] = ranges(difficulty);
    let den = randInt(rand, minDen, maxDen);
    let num = randInt(rand, 1, den - 1);
    const divisor = gcd(num, den);
    num = num / divisor;
    den = den / divisor;
    const whole = randInt(rand, minWhole, maxWhole);

    const mixedHtml = formatMixedNumber(whole, num, den);
    const improperNum = whole * den + num;
    const improper = formatFractionOrWhole(improperNum, den);
    const improperHtml = improper.html;

    if (toImproper) {
        return {
            questionHtml: `${mixedHtml} =`,
            answerHtml: improperHtml,
            answer: improper.text,
        };
    }

    return {
        questionHtml: `${improperHtml} =`,
        answerHtml: mixedHtml,
        answer: `${whole} ${num}/${den}`,
    };
}

function ranges(difficulty) {
    switch (difficulty) {
        case "easy":
            return [2, 9, 1, 5];
        case "normal":
            return [2, 12, 1, 8];
        case "hard":
            return [3, 15, 2, 12];
        default:
            return [2, 9, 1, 5];
    }
}

function formatFraction(numerator, denominator) {
    return `<span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span>`;
}

function formatFractionOrWhole(numerator, denominator) {
    if (denominator === 1) {
        return { html: `${numerator}`, text: `${numerator}` };
    }
    return {
        html: formatFraction(numerator, denominator),
        text: `${numerator}/${denominator}`,
    };
}

function formatMixedNumber(whole, numerator, denominator) {
    return `<span class="mixed"><span class="whole">${whole}</span>${formatFraction(
        numerator,
        denominator,
    )}</span>`;
}
