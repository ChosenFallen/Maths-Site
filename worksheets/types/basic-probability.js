import { randInt, gcd, formatFrac, formatFracOrWhole, renderKatex, shuffle } from "./utils.js";

export default {
    id: "basic-probability",
    label: "Basic Probability",
    grades: [3, 4, 5],
    instruction() {
        return "Find the probability. Give your answer as a fraction in its simplest form.";
    },
    printTitle() {
        return "Basic Probability";
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
        return generateEasy(rand);
    } else if (difficulty === "normal") {
        return generateNormal(rand);
    } else {
        return generateHard(rand);
    }
}

// ─── EASY (Types A & B) ───────────────────────────────────────────

function generateEasy(rand) {
    const type = randInt(rand, 0, 1);
    return type === 0 ? typeA_Balls(rand, 5, 10) : typeB_Spinner(rand, 6, 10);
}

// ─── NORMAL (Types A, B, C) ───────────────────────────────────────

function generateNormal(rand) {
    const type = randInt(rand, 0, 2);
    if (type === 0) return typeA_Balls(rand, 8, 20);
    if (type === 1) return typeB_Spinner(rand, 8, 20);
    return typeC_NumberCards(rand, 10, 20);
}

// ─── HARD (Types A, B, C, D) ──────────────────────────────────────

function generateHard(rand) {
    const type = randInt(rand, 0, 3);
    if (type === 0) return typeA_Balls(rand, 10, 30);
    if (type === 1) return typeB_Spinner(rand, 12, 30);
    if (type === 2) return typeC_NumberCards(rand, 15, 30);
    return typeD_Complement(rand);
}

// ─── TYPE A: COLOURED BALLS ───────────────────────────────────────

function typeA_Balls(rand, minTotal, maxTotal) {
    const total = randInt(rand, minTotal, maxTotal);
    const favorable = randInt(rand, 1, Math.floor(total / 3) * 2);
    const unfavorable = total - favorable;

    const colors = ["red", "blue"];
    const favoriteColor = randInt(rand, 0, 1) === 0 ? colors[0] : colors[1];
    const unfavoriteColor = favoriteColor === "red" ? "blue" : "red";

    const favoriteCount = randInt(rand, 0, 1) === 0 ? favorable : unfavorable;
    const unfavoriteCount = total - favoriteCount;

    const divisor = gcd(favoriteCount, total);
    const simpNum = favoriteCount / divisor;
    const simpDen = total / divisor;

    const questionHtml = `A bag contains ${favoriteCount} ${favoriteColor} and ${unfavoriteCount} ${unfavoriteColor} balls. One ball is chosen at random. What is the probability it is ${favoriteColor}?`;

    const formatted = formatFracOrWhole(simpNum, simpDen);

    return {
        questionHtml,
        answerHtml: formatted.html,
        answer: formatted.text,
    };
}

// ─── TYPE B: SPINNER ──────────────────────────────────────────────

function typeB_Spinner(rand, minSections, maxSections) {
    const total = randInt(rand, minSections, maxSections);
    const favorable = randInt(rand, 1, Math.floor(total / 3) * 2);

    const colors = ["red", "blue", "green", "yellow"];
    const selectedColor = colors[randInt(rand, 0, Math.min(3, colors.length - 1))];

    const divisor = gcd(favorable, total);
    const simpNum = favorable / divisor;
    const simpDen = total / divisor;

    const questionHtml = `A spinner has ${total} equal sections, ${favorable} of which are ${selectedColor}. What is the probability of landing on ${selectedColor}?`;

    const formatted = formatFracOrWhole(simpNum, simpDen);

    return {
        questionHtml,
        answerHtml: formatted.html,
        answer: formatted.text,
    };
}

// ─── TYPE C: NUMBER CARDS ─────────────────────────────────────────

function typeC_NumberCards(rand, minN, maxN) {
    const n = randInt(rand, minN, maxN);
    const conditions = [
        { name: "even", count: Math.floor(n / 2) },
        { name: "odd", count: Math.ceil(n / 2) },
        { name: "less than " + Math.ceil(n / 2), count: Math.floor(n / 2) },
        { name: "greater than " + Math.floor(n / 2), count: Math.ceil(n / 2) },
        { name: "a multiple of 3", count: Math.floor(n / 3) },
    ];

    const condition = conditions[randInt(rand, 0, conditions.length - 1)];
    const favorable = condition.count;

    const divisor = gcd(favorable, n);
    const simpNum = favorable / divisor;
    const simpDen = n / divisor;

    const questionHtml = `Cards numbered 1 to ${n} are shuffled. One card is picked at random. What is the probability it is ${condition.name}?`;

    const formatted = formatFracOrWhole(simpNum, simpDen);

    return {
        questionHtml,
        answerHtml: formatted.html,
        answer: formatted.text,
    };
}

// ─── TYPE D: COMPLEMENTARY PROBABILITY ────────────────────────────

function typeD_Complement(rand) {
    // Generate a "nice" fraction for P(A)
    const denominators = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    const den = denominators[randInt(rand, 0, denominators.length - 1)];
    const num = randInt(rand, 1, den - 1);

    // Complement: P(not A) = 1 - num/den = (den - num)/den
    const complementNum = den - num;
    const divisor = gcd(complementNum, den);
    const simpNum = complementNum / divisor;
    const simpDen = den / divisor;

    const color = ["red", "blue", "green"][randInt(rand, 0, 2)];
    const questionHtml = `The probability of picking a ${color} card is ${formatFrac(num, den)}. What is the probability of NOT picking a ${color} card?`;

    const formatted = formatFracOrWhole(simpNum, simpDen);

    return {
        questionHtml,
        answerHtml: formatted.html,
        answer: formatted.text,
    };
}
