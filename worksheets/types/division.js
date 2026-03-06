import {
    randInt,
    difficultyRange,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "division",
    label: "Division",
    grades: [1, 2, 3],  // [easy, normal, hard]
    instruction() {
        return "Solve the following.";
    },
    printTitle() {
        return "Division";
    },
    generate(rand, difficulty, count) {
        const [min, max] = difficultyRange(difficulty);
        const problems = [];
        for (let i = 0; i < count; i++) {
            let b = randInt(rand, min, max);
            b = Math.max(1, b);
            let a = randInt(rand, min, max);
            a = a * b;
            const answer = a / b;
            problems.push({
                question: `${a} ÷ ${b} =`,
                answer,
                answerHtml: answer,
                wrongAnswers: generateNumericDistracters(answer, rand).map(wa => wa),
            });
        }
        return problems;
    },
};
