import { formatMixedNum, formatFrac, formatFracOrWhole, randInt, gcd } from "./utils.js";

export default {
    id: "mixed-numbers",
    label: "Mixed Numbers/Improper Fractions",
    grades: [4, 5, 6],  // [easy, normal, hard]
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

    const mixedHtml = formatMixedNum(whole, num, den);
    const improperNum = whole * den + num;
    const improper = formatFracOrWhole(improperNum, den);
    const improperHtml = improper.html;

    if (toImproper) {
        // Converting mixed to improper: a b/c = (ac+b)/c
        const wrongAnswers = [];
        const seen = new Set([improper.text]);

        // Mistake 1: forgot the whole part
        const onlyFrac = formatFracOrWhole(num, den);
        if (!seen.has(onlyFrac.text)) {
            wrongAnswers.push(onlyFrac.html);
            seen.add(onlyFrac.text);
        }

        // Mistake 2: multiplied wrong (e.g., added instead of multiplied)
        const wrongNum2 = whole + num;
        const wrong2 = formatFracOrWhole(wrongNum2, den);
        if (!seen.has(wrong2.text)) {
            wrongAnswers.push(wrong2.html);
            seen.add(wrong2.text);
        }

        // Mistake 3: off by one
        const wrongNum3 = improperNum - 1;
        const wrong3 = formatFracOrWhole(wrongNum3, den);
        if (!seen.has(wrong3.text)) {
            wrongAnswers.push(wrong3.html);
            seen.add(wrong3.text);
        }

        // Fallback
        if (wrongAnswers.length < 3) {
            const fallback = formatFracOrWhole(improperNum + 1, den);
            wrongAnswers.push(fallback.html);
        }

        return {
            questionHtml: `${mixedHtml} =`,
            answerHtml: improperHtml,
            answer: improper.text,
            wrongAnswers: wrongAnswers.slice(0, 3),
        };
    }

    // Converting improper to mixed: a/b = c d/e where c = floor(a/b), d = a mod b
    const wrongAnswers = [];
    const seen = new Set([`${whole} ${num}/${den}`]);

    // Mistake 1: didn't convert (just returned original improper)
    if (!seen.has(improper.text)) {
        wrongAnswers.push(improperHtml);
        seen.add(improper.text);
    }

    // Mistake 2: wrong whole part (off by one)
    const wrongWhole = whole - 1;
    const wrong2Text = wrongWhole > 0 ? `${wrongWhole} ${num}/${den}` : `${num}/${den}`;
    if (!seen.has(wrong2Text)) {
        const wrong2Html = wrongWhole > 0 ? formatMixedNum(wrongWhole, num, den) : formatFrac(num, den);
        wrongAnswers.push(wrong2Html);
        seen.add(wrong2Text);
    }

    // Mistake 3: swapped numerator and whole
    const wrong3Text = `${num} ${whole}/${den}`;
    if (!seen.has(wrong3Text)) {
        const wrong3Html = formatMixedNum(num, whole, den);
        wrongAnswers.push(wrong3Html);
        seen.add(wrong3Text);
    }

    // Fallback
    if (wrongAnswers.length < 3) {
        const fallbackHtml = formatMixedNum(whole, num, den + 1);
        wrongAnswers.push(fallbackHtml);
    }

    return {
        questionHtml: `${improperHtml} =`,
        answerHtml: mixedHtml,
        answer: `${whole} ${num}/${den}`,
        wrongAnswers: wrongAnswers.slice(0, 3),
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

function utilFormatFrac(numerator, denominator) {
    return `<span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span>`;
}


function utilFormatMixedNum(whole, numerator, denominator) {
    return `<span class="mixed"><span class="whole">${whole}</span>${utilFormatFrac(
        numerator,
        denominator,
    )}</span>`;
}
