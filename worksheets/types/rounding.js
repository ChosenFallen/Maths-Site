import { randInt } from "./utils.js";

export default {
    id: "rounding",
    label: "Rounding",
    instruction(options = {}) {
        const mode = options.roundingMode || "mixed";
        if (mode === "dp") return "Round each number to the specified number of decimal places.";
        if (mode === "sf") return "Round each number to the specified number of significant figures.";
        return "Round each number to the specified number of decimal places (dp) or significant figures (sf).";
    },
    printTitle(options = {}) {
        const mode = options.roundingMode || "mixed";
        if (mode === "dp") return "Rounding to Decimal Places";
        if (mode === "sf") return "Rounding to Significant Figures";
        return "Rounding";
    },
    options: [
        {
            id: "roundingMode",
            label: "Rounding type:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed (DP & SF)" },
                { value: "dp", label: "Decimal places only" },
                { value: "sf", label: "Significant figures only" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.roundingMode || "mixed";

        for (let i = 0; i < count; i++) {
            let roundingType;
            if (mode === "mixed") {
                roundingType = randInt(rand, 0, 1) === 0 ? "dp" : "sf";
            } else {
                roundingType = mode;
            }

            const { number, places } = generateNumber(rand, difficulty, roundingType);
            const question = formatQuestion(number, places, roundingType);
            const answer = roundNumber(number, places, roundingType);

            problems.push({
                question,
                questionHtml: question,
                answer: answer.toString(),
                answerHtml: answer.toString(),
            });
        }

        return problems;
    },
};

function generateNumber(rand, difficulty, roundingType) {
    let number, places;

    if (difficulty === "easy") {
        // Simple decimals, round to 1 or 2 dp/sf
        if (roundingType === "dp") {
            const whole = randInt(rand, 0, 99);
            const decimal = randInt(rand, 100, 9999) / 10000;
            number = whole + decimal;
            places = randInt(rand, 1, 2);
        } else {
            number = randInt(rand, 100, 9999) + randInt(rand, 0, 999) / 1000;
            places = randInt(rand, 1, 2);
        }
    } else if (difficulty === "normal") {
        // Medium numbers, 1-3 dp/sf
        if (roundingType === "dp") {
            const whole = randInt(rand, 0, 999);
            const decimal = randInt(rand, 10000, 999999) / 1000000;
            number = whole + decimal;
            places = randInt(rand, 1, 3);
        } else {
            number = randInt(rand, 1000, 99999) + randInt(rand, 0, 9999) / 10000;
            places = randInt(rand, 2, 3);
        }
    } else {
        // Large numbers or very precise decimals, 1-4 dp/sf
        if (roundingType === "dp") {
            const whole = randInt(rand, 0, 9999);
            const decimal = randInt(rand, 100000, 9999999) / 10000000;
            number = whole + decimal;
            places = randInt(rand, 1, 4);
        } else {
            // Include some very large and very small numbers for SF
            if (randInt(rand, 0, 2) === 0) {
                // Large number
                number = randInt(rand, 10000, 9999999) + randInt(rand, 0, 99999) / 100000;
            } else {
                // Small decimal
                number = randInt(rand, 1, 999) / Math.pow(10, randInt(rand, 2, 4));
            }
            places = randInt(rand, 1, 4);
        }
    }

    return { number, places };
}

function formatQuestion(number, places, roundingType) {
    const typeLabel = roundingType === "dp" ? "dp" : "sf";
    return `Round ${number.toFixed(Math.max(places + 3, 6))} to ${places} ${typeLabel}`;
}

function roundNumber(number, places, roundingType) {
    if (roundingType === "dp") {
        return parseFloat(number.toFixed(places));
    } else {
        // Significant figures
        if (number === 0) return 0;

        const magnitude = Math.floor(Math.log10(Math.abs(number)));
        const scale = Math.pow(10, magnitude - places + 1);
        return parseFloat((Math.round(number / scale) * scale).toPrecision(places));
    }
}
