import { formatFrac, formatFracOrWhole, randInt, gcd } from "./utils.js";

export default {
    id: "fraction-of-amount",
    label: "Fraction of an Amount",
    instruction() {
        return "Find the fraction of each amount.";
    },
    printTitle() {
        return "Fraction of an Amount";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            const { numerator, denominator } = fractionSet(rand, difficulty);
            const amount = amountForFraction(rand, difficulty, denominator);
            const answer = (amount * numerator) / denominator;
            const questionHtml = `${formatFrac(numerator, denominator)} of ${amount} =`;
            problems.push({ questionHtml, answer: formatNumber(answer) });
        }
        return problems;
    },
};

function fractionSet(rand, difficulty) {
    const choices =
        difficulty === "easy"
            ? [
                  [1, 2],
                  [1, 3],
                  [1, 4],
                  [1, 5],
              ]
            : difficulty === "normal"
              ? [
                    [1, 2],
                    [1, 3],
                    [2, 3],
                    [1, 4],
                    [3, 4],
                    [1, 5],
                    [2, 5],
                    [3, 5],
                ]
              : [
                    [1, 2],
                    [1, 3],
                    [2, 3],
                    [1, 4],
                    [3, 4],
                    [1, 5],
                    [2, 5],
                    [3, 5],
                    [1, 6],
                    [5, 6],
                    [1, 8],
                    [3, 8],
                    [5, 8],
                    [7, 8],
                ];
    const [n, d] = choices[randInt(rand, 0, choices.length - 1)];
    const g = gcd(n, d);
    return { numerator: n / g, denominator: d / g };
}

function amountForFraction(rand, difficulty, denominator) {
    const max = difficulty === "easy" ? 200 : difficulty === "normal" ? 500 : 1000;
    const value = randInt(rand, 10, max);
    return Math.max(denominator, Math.round(value / denominator) * denominator);
}

function formatNumber(value) {
    const rounded = Math.round(value * 100) / 100;
    return rounded.toString().replace(/\.?0+$/, "");
}
