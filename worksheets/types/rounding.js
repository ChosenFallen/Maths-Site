import { randInt } from "./utils.js";

export default {
    id: "rounding",
    label: "Rounding",
    instruction(options = {}) {
        const mode = options.roundingMode || "mixed";
        if (mode === "dp") return "Round each number to the specified number of decimal places.";
        if (mode === "sf") return "Round each number to the specified number of significant figures.";
        if (mode === "place") return "Round each number to the specified place value.";
        return "Round each number to the specified number of decimal places (dp), significant figures (sf), or place value.";
    },
    printTitle(options = {}) {
        const mode = options.roundingMode || "mixed";
        if (mode === "dp") return "Rounding to Decimal Places";
        if (mode === "sf") return "Rounding to Significant Figures";
        if (mode === "place") return "Rounding to Place Values";
        return "Rounding";
    },
    options: [
        {
            id: "roundingMode",
            label: "Rounding type:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed (DP, SF & Place)" },
                { value: "dp", label: "Decimal places only" },
                { value: "sf", label: "Significant figures only" },
                { value: "place", label: "Place values only" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.roundingMode || "mixed";

        for (let i = 0; i < count; i++) {
            let roundingType;
            if (mode === "mixed") {
                const r = randInt(rand, 0, 2);
                roundingType = r === 0 ? "dp" : r === 1 ? "sf" : "place";
            } else {
                roundingType = mode;
            }

            const { number, places, placeValue } = generateNumber(rand, difficulty, roundingType);
            const question = formatQuestion(number, places, roundingType, placeValue);
            const answer = roundNumber(number, places, roundingType, placeValue);

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
    let number, places, placeValue;

    if (difficulty === "easy") {
        // Simple numbers
        if (roundingType === "dp") {
            const whole = randInt(rand, 0, 99);
            const decimal = randInt(rand, 100, 9999) / 10000;
            number = whole + decimal;
            places = randInt(rand, 1, 2);
        } else if (roundingType === "sf") {
            number = randInt(rand, 100, 9999) + randInt(rand, 0, 999) / 1000;
            places = randInt(rand, 1, 2);
        } else {
            // Place value rounding: round to whole number or 10
            number = randInt(rand, 10, 999);
            placeValue = randInt(rand, 0, 1) === 0 ? 1 : 10; // whole number (1) or 10s
        }
    } else if (difficulty === "normal") {
        // Medium numbers, 1-3 dp/sf
        if (roundingType === "dp") {
            const whole = randInt(rand, 0, 999);
            const decimal = randInt(rand, 10000, 999999) / 1000000;
            number = whole + decimal;
            places = randInt(rand, 1, 3);
        } else if (roundingType === "sf") {
            number = randInt(rand, 1000, 99999) + randInt(rand, 0, 9999) / 10000;
            places = randInt(rand, 2, 3);
        } else {
            // Place value rounding: whole, 10s, or 100s
            number = randInt(rand, 100, 9999);
            const pvChoice = randInt(rand, 0, 2);
            placeValue = pvChoice === 0 ? 1 : pvChoice === 1 ? 10 : 100;
        }
    } else {
        // Large numbers or very precise decimals, 1-4 dp/sf
        if (roundingType === "dp") {
            const whole = randInt(rand, 0, 9999);
            const decimal = randInt(rand, 100000, 9999999) / 10000000;
            number = whole + decimal;
            places = randInt(rand, 1, 4);
        } else if (roundingType === "sf") {
            // Include some very large and very small numbers for SF
            if (randInt(rand, 0, 2) === 0) {
                // Large number
                number = randInt(rand, 10000, 9999999) + randInt(rand, 0, 99999) / 100000;
            } else {
                // Small decimal
                number = randInt(rand, 1, 999) / Math.pow(10, randInt(rand, 2, 4));
            }
            places = randInt(rand, 1, 4);
        } else {
            // Place value rounding: 10s, 100s, 1000s
            number = randInt(rand, 1000, 99999);
            const pvChoice = randInt(rand, 0, 2);
            placeValue = pvChoice === 0 ? 10 : pvChoice === 1 ? 100 : 1000;
        }
    }

    return { number, places, placeValue };
}

function formatQuestion(number, places, roundingType, placeValue) {
    if (roundingType === "dp") {
        return `Round ${number.toFixed(Math.max(places + 3, 6))} to ${places} dp`;
    } else if (roundingType === "sf") {
        return `Round ${number.toFixed(Math.max(places + 3, 6))} to ${places} sf`;
    } else {
        // Place value rounding
        const placeLabels = {
            1: "the nearest whole number",
            10: "the nearest 10",
            100: "the nearest 100",
            1000: "the nearest 1000"
        };
        const label = placeLabels[placeValue] || "the nearest whole number";
        return `Round ${Math.round(number * 100) / 100} to ${label}`;
    }
}

function roundNumber(number, places, roundingType, placeValue) {
    if (roundingType === "dp") {
        return parseFloat(number.toFixed(places));
    } else if (roundingType === "sf") {
        // Significant figures
        if (number === 0) return 0;

        const magnitude = Math.floor(Math.log10(Math.abs(number)));
        const scale = Math.pow(10, magnitude - places + 1);
        return parseFloat((Math.round(number / scale) * scale).toPrecision(places));
    } else {
        // Place value rounding
        return Math.round(number / placeValue) * placeValue;
    }
}
