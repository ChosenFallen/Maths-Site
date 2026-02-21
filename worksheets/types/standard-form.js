import { randInt, exponentToSuperscript } from "./utils.js";

export default {
    id: "standard-form",
    label: "Standard Form",
    instruction(options = {}) {
        const mode = options.standardFormMode || "mixed";
        if (mode === "to") return "Write each number in standard form (e.g., 3000 = 3 × 10³).";
        if (mode === "from") return "Write each number as an ordinary number.";
        return "Convert between ordinary numbers and standard form.";
    },
    printTitle() {
        return "Standard Form";
    },
    options: [
        {
            id: "standardFormMode",
            label: "Conversion type:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed" },
                { value: "to", label: "To standard form" },
                { value: "from", label: "From standard form" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.standardFormMode || "mixed";

        for (let i = 0; i < count; i++) {
            let conversionType;
            if (mode === "mixed") {
                conversionType = randInt(rand, 0, 1) === 0 ? "to" : "from";
            } else {
                conversionType = mode;
            }

            const { number, standardForm } = generateNumber(rand, difficulty);

            if (conversionType === "to") {
                // Convert TO standard form
                const question = number.toString();
                const answer = standardForm;
                problems.push({
                    question,
                    questionHtml: question,
                    answer,
                    answerHtml: answer,
                });
            } else {
                // Convert FROM standard form
                const question = standardForm;
                const answer = number.toString();
                problems.push({
                    question,
                    questionHtml: standardFormToHtml(standardForm),
                    answer,
                    answerHtml: answer,
                });
            }
        }

        return problems;
    },
};

function generateNumber(rand, difficulty) {
    let number, coefficient, exponent;

    if (difficulty === "easy") {
        // Numbers like 3000, 45000, 0.004, 0.056
        const useSmall = randInt(rand, 0, 1) === 0;
        if (useSmall) {
            // Small decimals: use integer significand
            exponent = -randInt(rand, 3, 4);
            const significand = randInt(rand, 10, 99);
            coefficient = significand / 10;
            number = significand * Math.pow(10, exponent + 1);
        } else {
            // Large numbers: use integer significand
            exponent = randInt(rand, 3, 4);
            const significand = randInt(rand, 10, 99);
            coefficient = significand / 10;
            number = significand * Math.pow(10, exponent - 1);
        }
    } else if (difficulty === "normal") {
        // Wider range
        const useSmall = randInt(rand, 0, 1) === 0;
        if (useSmall) {
            // Very small
            exponent = -randInt(rand, 4, 6);
            const significand = randInt(rand, 10, 99);
            coefficient = significand / 10;
            number = significand * Math.pow(10, exponent + 1);
        } else {
            // Large
            exponent = randInt(rand, 4, 6);
            const significand = randInt(rand, 10, 99);
            coefficient = significand / 10;
            number = significand * Math.pow(10, exponent - 1);
        }
    } else {
        // Very large or very small numbers
        const useSmall = randInt(rand, 0, 1) === 0;
        if (useSmall) {
            // Extremely small
            exponent = -randInt(rand, 6, 10);
            const significand = randInt(rand, 10, 99);
            coefficient = significand / 10;
            number = significand * Math.pow(10, exponent + 1);
        } else {
            // Extremely large
            exponent = randInt(rand, 7, 12);
            const significand = randInt(rand, 10, 99);
            coefficient = significand / 10;
            number = significand * Math.pow(10, exponent - 1);
        }
    }

    // Round to avoid floating point issues
    // Limit to 10 significant digits
    const roundedNumber = parseFloat(number.toPrecision(10));

    // Format standard form notation
    const standardForm = `${coefficient} × 10${exponentToSuperscript(exponent)}`;

    return { number: roundedNumber, standardForm };
}


function standardFormToHtml(standardForm) {
    // Convert "3.5 × 10⁴" to HTML with proper superscript
    return standardForm;
}
