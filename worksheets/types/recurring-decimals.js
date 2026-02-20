import { formatFrac, formatFracOrWhole, gcd, renderKatex } from "./utils.js";

export default {
    id: "recurring-decimals",
    label: "Recurring Decimals",
    instruction() {
        return "Convert each fraction to a recurring decimal. Use a dot above the first and last repeating digit.";
    },
    printTitle() {
        return "Recurring Decimals";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        const baseFractions = getFractionsForDifficulty(difficulty);

        // Create enough fractions by repeating and shuffling
        let fractions = [];
        while (fractions.length < count) {
            fractions = fractions.concat([...baseFractions]);
        }

        // Shuffle using Fisher-Yates
        for (let i = fractions.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [fractions[i], fractions[j]] = [fractions[j], fractions[i]];
        }

        // Take only the number we need
        fractions = fractions.slice(0, count);

        for (let i = 0; i < count; i++) {
            const fraction = fractions[i];
            const decimal = fractionToRecurringDecimal(fraction.n, fraction.d);

            const questionHtml = formatFrac(fraction.n, fraction.d);
            const question = `${fraction.n}/${fraction.d}`;
            const answer = decimal.notation;
            const answerHtml = decimal.html;

            problems.push({
                questionHtml,
                question,
                answerHtml,
                answer
            });
        }

        return problems;
    },
};

function getFractionsForDifficulty(difficulty) {
    if (difficulty === "easy") {
        // Simple recurring decimals with one repeating digit
        return [
            { n: 1, d: 3 },  // 0.3̇
            { n: 2, d: 3 },  // 0.6̇
            { n: 1, d: 9 },  // 0.1̇
            { n: 2, d: 9 },  // 0.2̇
            { n: 4, d: 9 },  // 0.4̇
            { n: 5, d: 9 },  // 0.5̇
            { n: 7, d: 9 },  // 0.7̇
            { n: 8, d: 9 },  // 0.8̇
            { n: 1, d: 27 }, // 0.037̇
            { n: 2, d: 27 }, // 0.074̇
            { n: 4, d: 27 }, // 0.148̇
            { n: 5, d: 27 }, // 0.185̇
        ];
    } else if (difficulty === "normal") {
        // Mixed terminating and recurring with non-repeating parts
        return [
            { n: 1, d: 6 },  // 0.16̇
            { n: 5, d: 6 },  // 0.83̇
            { n: 1, d: 12 }, // 0.083̇
            { n: 5, d: 12 }, // 0.416̇
            { n: 7, d: 12 }, // 0.583̇
            { n: 11, d: 12 }, // 0.916̇
            { n: 2, d: 15 }, // 0.13̇
            { n: 4, d: 15 }, // 0.26̇
            { n: 7, d: 15 }, // 0.46̇
            { n: 8, d: 15 }, // 0.53̇ (from Corbett Maths)
            { n: 11, d: 15 }, // 0.73̇
            { n: 1, d: 30 }, // 0.03̇ (from Corbett Maths)
            { n: 7, d: 30 }, // 0.23̇
            { n: 11, d: 30 }, // 0.36̇
            { n: 13, d: 30 }, // 0.43̇
        ];
    } else {
        // Complex recurring patterns
        return [
            { n: 1, d: 7 },  // 0.1̇4̇2̇8̇5̇7̇ (from Corbett Maths)
            { n: 2, d: 7 },  // 0.2̇8̇5̇7̇1̇4̇
            { n: 3, d: 7 },  // 0.4̇2̇8̇5̇7̇1̇
            { n: 4, d: 7 },  // 0.5̇7̇1̇4̇2̇8̇
            { n: 5, d: 7 },  // 0.7̇1̇4̇2̇8̇5̇
            { n: 6, d: 7 },  // 0.8̇5̇7̇1̇4̇2̇ (from Corbett Maths)
            { n: 1, d: 11 }, // 0.0̇9̇
            { n: 2, d: 11 }, // 0.1̇8̇
            { n: 3, d: 11 }, // 0.2̇7̇ (from Corbett Maths)
            { n: 4, d: 11 }, // 0.3̇6̇
            { n: 5, d: 11 }, // 0.4̇5̇
            { n: 6, d: 11 }, // 0.5̇4̇
            { n: 7, d: 11 }, // 0.6̇3̇
            { n: 8, d: 11 }, // 0.7̇2̇
            { n: 9, d: 11 }, // 0.8̇1̇
            { n: 10, d: 11 }, // 0.9̇0̇
            { n: 1, d: 13 }, // 0.0̇7̇6̇9̇2̇3̇
            { n: 2, d: 13 }, // 0.1̇5̇3̇8̇4̇6̇
            { n: 3, d: 13 }, // 0.2̇3̇0̇7̇6̇9̇
            { n: 4, d: 13 }, // 0.3̇0̇7̇6̇9̇2̇
            { n: 5, d: 13 }, // 0.3̇8̇4̇6̇1̇5̇
            { n: 1, d: 22 }, // 0.04̇5̇ (from Corbett Maths)
            { n: 3, d: 22 }, // 0.13̇6̇
            { n: 5, d: 22 }, // 0.22̇7̇
            { n: 7, d: 22 }, // 0.31̇8̇
        ];
    }
}

function fractionToRecurringDecimal(numerator, denominator) {
    // Simplify the fraction first
    const g = gcd(numerator, denominator);
    const n = numerator / g;
    const d = denominator / g;

    // Perform long division to find the recurring part
    const result = longDivision(n, d);

    return {
        notation: result.notation,
        html: result.html
    };
}

function longDivision(numerator, denominator) {
    let quotient = "";
    let remainder = numerator % denominator;
    const wholeNumber = Math.floor(numerator / denominator);

    quotient = wholeNumber.toString();

    if (remainder === 0) {
        // Terminating decimal
        return { notation: quotient, html: quotient };
    }

    quotient += ".";

    const remainders = new Map();
    const digits = [];
    let position = 0;

    while (remainder !== 0 && !remainders.has(remainder)) {
        remainders.set(remainder, position);
        remainder *= 10;
        const digit = Math.floor(remainder / denominator);
        digits.push(digit);
        remainder = remainder % denominator;
        position++;
    }

    if (remainder === 0) {
        // Terminating decimal
        quotient += digits.join("");
        return { notation: quotient, html: quotient };
    }

    // Recurring decimal
    const recurringStart = remainders.get(remainder);
    const nonRecurring = digits.slice(0, recurringStart).join("");
    const recurring = digits.slice(recurringStart).join("");

    // Create notation using bracket notation for plain text
    const notation = wholeNumber + "." + nonRecurring + "(" + recurring + ")";

    // Create KaTeX notation with dots above first and last repeating digits
    let katexRecurring;
    if (recurring.length === 1) {
        // Single repeating digit: put dot above it
        katexRecurring = `\\dot{${recurring}}`;
    } else {
        // Multiple repeating digits: dot above first and last only
        const firstDigit = recurring[0];
        const lastDigit = recurring[recurring.length - 1];
        const middleDigits = recurring.slice(1, -1);
        katexRecurring = `\\dot{${firstDigit}}${middleDigits}\\dot{${lastDigit}}`;
    }

    const katexNotation = `${wholeNumber}.${nonRecurring}${katexRecurring}`;
    const katexHtml = renderKatex(katexNotation);

    // Use KaTeX if available, otherwise fallback to bracket notation
    const html = katexHtml || notation;

    return {
        notation,
        html
    };
}
