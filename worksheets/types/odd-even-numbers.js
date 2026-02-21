import { randInt } from "./utils.js";

export default {
    id: "odd-even-numbers",
    label: "Odd and Even Numbers",
    instruction() {
        return "Determine if each number is odd or even.";
    },
    printTitle() {
        return "Odd and Even Numbers";
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
    let num;

    if (difficulty === "easy") {
        num = randInt(rand, 1, 50);
    } else if (difficulty === "normal") {
        num = randInt(rand, 1, 200);
    } else {
        num = randInt(rand, 1, 1000);
    }

    const isOdd = num % 2 === 1;
    const answer = isOdd ? "Odd" : "Even";
    const question = `Is ${num} odd or even?`;

    return { question, answer };
}
