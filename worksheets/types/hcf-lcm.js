import { randInt, gcd, lcm } from "./utils.js";

export default {
    id: "hcf-lcm",
    label: "HCF & LCM",
    instruction(options = {}) {
        const mode = options.hcfLcmMode || "mixed";
        if (mode === "hcf") return "Find the Highest Common Factor (HCF) of each pair of numbers.";
        if (mode === "lcm") return "Find the Lowest Common Multiple (LCM) of each pair of numbers.";
        return "Find the HCF or LCM as indicated for each question.";
    },
    printTitle(options = {}) {
        const mode = options.hcfLcmMode || "mixed";
        if (mode === "hcf") return "Highest Common Factor (HCF)";
        if (mode === "lcm") return "Lowest Common Multiple (LCM)";
        return "HCF & LCM";
    },
    options: [
        {
            id: "hcfLcmMode",
            label: "Question type:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed", label: "Mixed (HCF & LCM)" },
                { value: "hcf", label: "HCF only" },
                { value: "lcm", label: "LCM only" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.hcfLcmMode || "mixed";

        for (let i = 0; i < count; i++) {
            let questionType;
            if (mode === "mixed") {
                questionType = randInt(rand, 0, 1) === 0 ? "hcf" : "lcm";
            } else {
                questionType = mode;
            }

            const numbers = generateNumbers(rand, difficulty);
            const question = formatQuestion(numbers, questionType);
            const answer = questionType === "hcf"
                ? calculateHCF(numbers)
                : calculateLCM(numbers);

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

function generateNumbers(rand, difficulty) {
    let min, max, useThreeNumbers;

    if (difficulty === "easy") {
        min = 2;
        max = 20;
        useThreeNumbers = false;
    } else if (difficulty === "normal") {
        min = 10;
        max = 50;
        useThreeNumbers = randInt(rand, 0, 4) === 0; // 20% chance of 3 numbers
    } else {
        min = 20;
        max = 100;
        useThreeNumbers = randInt(rand, 0, 2) === 0; // 33% chance of 3 numbers
    }

    const count = useThreeNumbers ? 3 : 2;
    const numbers = [];

    for (let i = 0; i < count; i++) {
        numbers.push(randInt(rand, min, max));
    }

    return numbers;
}

function formatQuestion(numbers, type) {
    const typeLabel = type.toUpperCase();
    const numbersList = numbers.join(", ");
    return `${typeLabel}(${numbersList})`;
}

function calculateHCF(numbers) {
    if (numbers.length === 2) {
        return gcd(numbers[0], numbers[1]);
    } else {
        // For 3 numbers: HCF(a, b, c) = HCF(HCF(a, b), c)
        const hcfAB = gcd(numbers[0], numbers[1]);
        return gcd(hcfAB, numbers[2]);
    }
}

function calculateLCM(numbers) {
    if (numbers.length === 2) {
        return lcm(numbers[0], numbers[1]);
    } else {
        // For 3 numbers: LCM(a, b, c) = LCM(LCM(a, b), c)
        const lcmAB = lcm(numbers[0], numbers[1]);
        return lcm(lcmAB, numbers[2]);
    }
}

