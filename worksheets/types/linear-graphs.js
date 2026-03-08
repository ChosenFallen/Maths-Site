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

    const answer = `m = ${m}, c = ${c}`;
    const wrongAnswers = [];
    const seen = new Set([answer]);

    // Mistake 1: swapped m and c
    const wrong1 = `m = ${c}, c = ${m}`;
    if (!seen.has(wrong1)) {
        wrongAnswers.push(wrong1);
        seen.add(wrong1);
    }

    // Mistake 2: wrong sign on c
    const wrong2 = `m = ${m}, c = ${-c}`;
    if (!seen.has(wrong2)) {
        wrongAnswers.push(wrong2);
        seen.add(wrong2);
    }

    // Mistake 3: off by one
    const wrong3 = `m = ${m + 1}, c = ${c}`;
    if (!seen.has(wrong3)) {
        wrongAnswers.push(wrong3);
        seen.add(wrong3);
    }

    // Fallback
    if (wrongAnswers.length < 3) {
        wrongAnswers.push(`m = ${m}, c = ${c + 1}`);
    }

    return {
        questionHtml,
        answer,
        answerHtml: answer,
        wrongAnswers: wrongAnswers.slice(0, 3),
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

    const wrongAnswers = [];
    const seen = new Set([answerText]);

    // Mistake 1: forgot the y =
    const wrong1 = `${mxCoeff} ${sign} ${abs}`;
    if (!seen.has(wrong1)) {
        wrongAnswers.push(wrong1);
        seen.add(wrong1);
    }

    // Mistake 2: swapped m and c positions
    const cCoeff = formatCoeff(c, "x");
    const { sign: signM, abs: absM } = formatSignValue(m, true);
    const wrong2 = `y = ${cCoeff} ${signM} ${absM}`;
    if (!seen.has(wrong2)) {
        wrongAnswers.push(wrong2);
        seen.add(wrong2);
    }

    // Mistake 3: wrong sign on c
    const { sign: wrongSign, abs: wrongAbs } = formatSignValue(-c, true);
    const wrong3 = `y = ${mxCoeff} ${wrongSign} ${wrongAbs}`;
    if (!seen.has(wrong3)) {
        wrongAnswers.push(wrong3);
        seen.add(wrong3);
    }

    // Fallback
    if (wrongAnswers.length < 3) {
        wrongAnswers.push(`y = ${formatCoeff(m + 1, "x")} ${sign} ${abs}`);
    }

    return {
        questionHtml,
        answer: answerText,
        answerHtml: answerText,
        wrongAnswers: wrongAnswers.slice(0, 3),
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
        wrongAnswers: generateNumericDistracters(y, rand).map(wa => `${wa}`),
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

    const wrongAnswers = [];
    const seen = new Set([answer]);

    // Mistake 1: gave opposite answer
    const wrong1 = isOnLine ? "No" : "Yes";
    if (!seen.has(wrong1)) {
        wrongAnswers.push(wrong1);
        seen.add(wrong1);
    }

    // Mistake 2: unclear answer
    const wrong2 = "Maybe";
    if (!seen.has(wrong2)) {
        wrongAnswers.push(wrong2);
        seen.add(wrong2);
    }

    // Fallback
    if (wrongAnswers.length < 3) {
        wrongAnswers.push("Unclear");
    }

    return {
        questionHtml,
        answer,
        answerHtml: answer,
        wrongAnswers: wrongAnswers.slice(0, 3),
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

    const wrongAnswers = [];
    const seen = new Set([answerText]);

    // Mistake 1: used original c instead of new c
    const wrong1 = `y = ${mxCoeffAnswer} ${sign1} ${abs1}`;
    if (!seen.has(wrong1)) {
        wrongAnswers.push(wrong1);
        seen.add(wrong1);
    }

    // Mistake 2: changed gradient instead of keeping it same
    const wrongM = m + 1;
    const wrongMCoeff = formatCoeff(wrongM, "x");
    const wrong2 = `y = ${wrongMCoeff} ${sign2} ${abs2}`;
    if (!seen.has(wrong2)) {
        wrongAnswers.push(wrong2);
        seen.add(wrong2);
    }

    // Mistake 3: perpendicular instead of parallel (negative reciprocal gradient)
    const perpM = m === 1 ? -1 : m === -1 ? 1 : -m;
    const perpMCoeff = formatCoeff(perpM, "x");
    const wrong3 = `y = ${perpMCoeff} ${sign2} ${abs2}`;
    if (!seen.has(wrong3)) {
        wrongAnswers.push(wrong3);
        seen.add(wrong3);
    }

    // Fallback
    if (wrongAnswers.length < 3) {
        wrongAnswers.push(`y = ${mxCoeffAnswer} ${sign2} ${Math.abs(newC) + 1}`);
    }

    return {
        questionHtml,
        answer: answerText,
        answerHtml: answerText,
        wrongAnswers: wrongAnswers.slice(0, 3),
    };
}
