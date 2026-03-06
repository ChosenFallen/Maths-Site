import {
    randInt,
    difficultyRange,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "addition",
    label: "Addition",
    grades: [1, 2, 2],  // [easy, normal, hard]
    instruction() {
        return "Solve the following.";
    },
    printTitle() {
        return "Addition";
    },
    generate(rand, difficulty, count) {
        const [min, max] = difficultyRange(difficulty);
        const problems = [];
        for (let i = 0; i < count; i++) {
            const a = randInt(rand, min, max);
            const b = randInt(rand, min, max);
            const answer = a + b;
            problems.push({
                question: `${a} + ${b} =`,
                answer,
                answerHtml: answer,
                wrongAnswers: generateNumericDistracters(answer, rand).map(wa => wa),
            });
        }
        return problems;
    },
};
