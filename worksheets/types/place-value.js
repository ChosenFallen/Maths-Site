import { randInt } from "./utils.js";

export default {
    id: "place-value",
    label: "Place Value",
    instruction() {
        return "Identify the place value or the value of a digit in a number.";
    },
    printTitle() {
        return "Place Value";
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
        // 2-3 digit numbers
        const num = randInt(rand, 10, 999);
        const digits = num.toString().split("").map(Number);
        const digitIndex = randInt(rand, 0, digits.length - 1);
        const digit = digits[digitIndex];
        const places = ["ones", "tens", "hundreds"];
        const place = places[digitIndex];
        const value = digit * Math.pow(10, digits.length - 1 - digitIndex);

        const question = `In ${num}, what is the value of the digit ${digit} in the ${place} place?`;
        const answer = `${value}`;

        return { question, answer };
    } else if (difficulty === "normal") {
        // 3-4 digit numbers
        const num = randInt(rand, 100, 9999);
        const digits = num.toString().split("").map(Number);
        const digitIndex = randInt(rand, 0, digits.length - 1);
        const digit = digits[digitIndex];
        const places = ["ones", "tens", "hundreds", "thousands"];
        const place = places[digitIndex];
        const value = digit * Math.pow(10, digits.length - 1 - digitIndex);

        const question = `In ${num}, what is the value of the digit ${digit}?`;
        const answer = `${value}`;

        return { question, answer };
    } else {
        // 4-5 digit numbers
        const num = randInt(rand, 1000, 99999);
        const digits = num.toString().split("").map(Number);
        const digitIndex = randInt(rand, 0, digits.length - 1);
        const digit = digits[digitIndex];
        const places = ["ones", "tens", "hundreds", "thousands", "ten thousands"];
        const place = places[digitIndex];
        const value = digit * Math.pow(10, digits.length - 1 - digitIndex);

        const question = `In ${num}, what is the value of the digit ${digit}?`;
        const answer = `${value}`;

        return { question, answer };
    }
}
