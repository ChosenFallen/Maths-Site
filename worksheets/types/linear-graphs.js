import {
    randInt, formatCoeff, formatSignValue,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "linear-graphs",
    label: "Linear Graphs (y = mx + c)",
    grades: [4, 5, 6],
    instruction() {
        return "Answer the questions about linear graphs.";
    },
    printTitle() {
        return "Linear Graphs (y = mx + c)";
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

// ─── EASY (Types A & B) ────────────────────────────────────────

function generateEasy(rand) {
    const type = randInt(rand, 0, 1);
    if (type === 0) return typeA_IdentifyGradientIntercept(rand, 1, 5, -5, 8);
    return typeB_WriteEquation(rand, 1, 5, -5, 8);
}

// ─── NORMAL (Types A, B, C, D) ────────────────────────────────

function generateNormal(rand) {
    const type = randInt(rand, 0, 3);
    if (type === 0) return typeA_IdentifyGradientIntercept(rand, -6, 6, -10, 10);
    if (type === 1) return typeB_WriteEquation(rand, -6, 6, -10, 10);
    if (type === 2) return typeC_FindY(rand, -6, 6, -10, 10);
    return typeD_PointOnLine(rand, -6, 6, -10, 10);
}

// ─── HARD (Types A, B, C, D, E) ────────────────────────────

function generateHard(rand) {
    const type = randInt(rand, 0, 4);
    if (type === 0) return typeA_IdentifyGradientIntercept(rand, -6, 6, -10, 10);
    if (type === 1) return typeB_WriteEquation(rand, -6, 6, -10, 10);
    if (type === 2) return typeC_FindY(rand, -6, 6, -10, 10);
    if (type === 3) return typeD_PointOnLine(rand, -6, 6, -10, 10);
    return typeE_ParallelLine(rand, -6, 6, -10, 10);
}

// ─── TYPE A: IDENTIFY GRADIENT AND Y-INTERCEPT ─────────────────

function typeA_IdentifyGradientIntercept(rand, minM, maxM, minC, maxC) {
    let m = randInt(rand, minM, maxM);
    while (m === 0) m = randInt(rand, minM, maxM);
    const c = randInt(rand, minC, maxC);

    const mxCoeff = formatCoeff(m, "x");
    const { sign, abs } = formatSignValue(c, true);

    const questionHtml = `For the line y = ${mxCoeff} ${sign} ${abs}, write down the gradient and y-intercept.`;

    return {
        questionHtml,
        answer: `m = ${m}, c = ${c}`,
        answerHtml: `m = ${m}, c = ${c}`,
    };
}

// ─── TYPE B: WRITE EQUATION FROM M AND C ──────────────────────

function typeB_WriteEquation(rand, minM, maxM, minC, maxC) {
    let m = randInt(rand, minM, maxM);
    while (m === 0) m = randInt(rand, minM, maxM);
    const c = randInt(rand, minC, maxC);

    const mxCoeff = formatCoeff(m, "x");
    const { sign, abs } = formatSignValue(c, true);

    const questionHtml = `Write the equation of a line with gradient ${m} and y-intercept ${c}.`;

    const answerText = `y = ${mxCoeff} ${sign} ${abs}`;

    return {
        questionHtml,
        answer: answerText,
        answerHtml: answerText,
    };
}

// ─── TYPE C: FIND Y GIVEN X ───────────────────────────────────

function typeC_FindY(rand, minM, maxM, minC, maxC) {
    let m = randInt(rand, minM, maxM);
    while (m === 0) m = randInt(rand, minM, maxM);
    const c = randInt(rand, minC, maxC);
    const x = randInt(rand, -5, 5);
    const y = m * x + c;

    const mxCoeff = formatCoeff(m, "x");
    const { sign, abs } = formatSignValue(c, true);

    const questionHtml = `For the line y = ${mxCoeff} ${sign} ${abs}, find y when x = ${x}.`;

    return {
        questionHtml,
        answer: `${y}`,
        answerHtml: `y = ${y}`,
        wrongAnswers: generateNumericDistracters(y, rand),
    };
}

// ─── TYPE D: DOES POINT LIE ON LINE? ──────────────────────────

function typeD_PointOnLine(rand, minM, maxM, minC, maxC) {
    let m = randInt(rand, minM, maxM);
    while (m === 0) m = randInt(rand, minM, maxM);
    const c = randInt(rand, minC, maxC);

    // Generate a random x and compute y
    const x = randInt(rand, -5, 5);
    const yCorrect = m * x + c;

    // 50% chance to give correct point or incorrect point
    let y;
    let isOnLine;
    if (randInt(rand, 0, 1) === 0) {
        y = yCorrect;
        isOnLine = true;
    } else {
        // Generate a wrong y value
        const offset = randInt(rand, 1, 3);
        y = yCorrect + (randInt(rand, 0, 1) === 0 ? offset : -offset);
        isOnLine = false;
    }

    const mxCoeff = formatCoeff(m, "x");
    const { sign, abs } = formatSignValue(c, true);

    const questionHtml = `Does the point (${x}, ${y}) lie on the line y = ${mxCoeff} ${sign} ${abs}?`;
    const answer = isOnLine ? "Yes" : "No";

    return {
        questionHtml,
        answer,
        answerHtml: answer,
    };
}

// ─── TYPE E: PARALLEL LINES ───────────────────────────────────

function typeE_ParallelLine(rand, minM, maxM, minC, maxC) {
    // Parallel lines have the same gradient
    let m = randInt(rand, minM, maxM);
    while (m === 0) m = randInt(rand, minM, maxM);

    // Given point on the new line (always y-intercept for simplicity)
    const x0 = 0;
    const y0 = randInt(rand, minC, maxC);

    // The new line has same m but different c = y0
    const newC = y0;

    // The original line has same m but different c
    let originalC = randInt(rand, minC, maxC);
    while (originalC === newC) originalC = randInt(rand, minC, maxC);

    const mxCoeff = formatCoeff(m, "x");
    const { sign: sign1, abs: abs1 } = formatSignValue(originalC, true);

    const questionHtml = `Write the equation of a line parallel to y = ${mxCoeff} ${sign1} ${abs1} that passes through (${x0}, ${y0}).`;

    const mxCoeffAnswer = formatCoeff(m, "x");
    const { sign: sign2, abs: abs2 } = formatSignValue(newC, true);
    const answerText = `y = ${mxCoeffAnswer} ${sign2} ${abs2}`;

    return {
        questionHtml,
        answer: answerText,
        answerHtml: answerText,
    };
}
