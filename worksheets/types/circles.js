import {
    randInt, drawCircle,
    generateNumericDistracters
} from "./utils.js";

export default {
    id: "circles",
    label: "Circles: Area & Circumference",
    grades: [5, 6, 7],
    instruction() {
        return "For each circle, find what is asked. Use π = 3.14159... (round to 2 d.p.)";
    },
    printTitle() {
        return "Circles: Area & Circumference";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

const UNITS = {
    easy: ["cm", "m"],
    normal: ["cm", "m", "mm"],
    hard: ["cm", "m", "mm"],
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

// ─── EASY (Types A & B: radius, circumference/area) ─────────────

function generateEasy(rand) {
    const type = randInt(rand, 0, 1);
    const r = randInt(rand, 2, 15);
    const unit = UNITS.easy[randInt(rand, 0, UNITS.easy.length - 1)];

    if (type === 0) {
        // Circumference
        const C = (2 * Math.PI * r).toFixed(2);
        const numericC = parseFloat(C);
        return {
            questionHtml: `<div style="margin: 0; margin-bottom: 2px;"><strong>Find the circumference</strong></div>${drawCircle(r, "radius", unit)}`,
            question: `Circle with radius ${r} ${unit}. Find circumference.`,
            answer: `${C} ${unit}`,
            answerHtml: `${C} ${unit}`,
            wrongAnswers: generateNumericDistracters(numericC, rand),
        };
    } else {
        // Area
        const A = (Math.PI * r * r).toFixed(2);
        const numericA = parseFloat(A);
        return {
            questionHtml: `<div style="margin: 0; margin-bottom: 2px;"><strong>Find the area</strong></div>${drawCircle(r, "radius", unit)}`,
            question: `Circle with radius ${r} ${unit}. Find area.`,
            answer: `${A} ${unit}²`,
            answerHtml: `${A} ${unit}²`,
            wrongAnswers: generateNumericDistracters(numericA, rand),
        };
    }
}

// ─── NORMAL (Types A, B, C, D) ────────────────────────────────

function generateNormal(rand) {
    const type = randInt(rand, 0, 3);
    const unit = UNITS.normal[randInt(rand, 0, UNITS.normal.length - 1)];

    // Mix of integer and half-integer radii
    const rValue = randInt(rand, 6, 30);
    const r = rValue % 2 === 0 ? rValue / 2 : (rValue / 2).toFixed(1);

    if (type === 0 || type === 2) {
        // Type A/C: Circumference (from radius/diameter)
        const isRadius = type === 0;
        const measurement = isRadius ? r : 2 * r;
        const C = isRadius
            ? (2 * Math.PI * r).toFixed(2)
            : (Math.PI * measurement).toFixed(2);
        const numericC = parseFloat(C);

        return {
            questionHtml: `<div style="margin: 0; margin-bottom: 2px;"><strong>Find the circumference</strong></div>${drawCircle(r, isRadius ? "radius" : "diameter", unit)}`,
            question: `Circle with ${isRadius ? "radius" : "diameter"} ${measurement} ${unit}. Find circumference.`,
            answer: `${C} ${unit}`,
            answerHtml: `${C} ${unit}`,
            wrongAnswers: generateNumericDistracters(numericC, rand),
        };
    } else {
        // Type B/D: Area (from radius/diameter)
        const isRadius = type === 1;
        const radiusVal = isRadius ? r : r; // diameter already half in draw
        const A = (Math.PI * radiusVal * radiusVal).toFixed(2);
        const numericA = parseFloat(A);

        return {
            questionHtml: `<div style="margin: 0; margin-bottom: 2px;"><strong>Find the area</strong></div>${drawCircle(r, isRadius ? "radius" : "diameter", unit)}`,
            question: `Circle with ${isRadius ? "radius" : "diameter"} ${isRadius ? r : 2 * r} ${unit}. Find area.`,
            answer: `${A} ${unit}²`,
            answerHtml: `${A} ${unit}²`,
            wrongAnswers: generateNumericDistracters(numericA, rand),
        };
    }
}

// ─── HARD (Types A–F: includes reverse calculations) ──────────

function generateHard(rand) {
    const type = randInt(rand, 0, 5);
    const unit = UNITS.hard[randInt(rand, 0, UNITS.hard.length - 1)];

    if (type === 0) {
        // Type A: Circumference from radius
        const rValue = randInt(rand, 6, 40);
        const r = rValue % 2 === 0 ? rValue / 2 : (rValue / 2).toFixed(1);
        const C = (2 * Math.PI * r).toFixed(2);
        const numericC = parseFloat(C);
        return {
            questionHtml: `<div style="margin: 0; margin-bottom: 2px;"><strong>Find the circumference</strong></div>${drawCircle(r, "radius", unit)}`,
            question: `Circle with radius ${r} ${unit}. Find circumference.`,
            answer: `${C} ${unit}`,
            answerHtml: `${C} ${unit}`,
            wrongAnswers: generateNumericDistracters(numericC, rand),
        };
    } else if (type === 1) {
        // Type B: Area from radius
        const rValue = randInt(rand, 6, 40);
        const r = rValue % 2 === 0 ? rValue / 2 : (rValue / 2).toFixed(1);
        const A = (Math.PI * r * r).toFixed(2);
        const numericA = parseFloat(A);
        return {
            questionHtml: `<div style="margin: 0; margin-bottom: 2px;"><strong>Find the area</strong></div>${drawCircle(r, "radius", unit)}`,
            question: `Circle with radius ${r} ${unit}. Find area.`,
            answer: `${A} ${unit}²`,
            answerHtml: `${A} ${unit}²`,
            wrongAnswers: generateNumericDistracters(numericA, rand),
        };
    } else if (type === 2) {
        // Type C: Circumference from diameter
        const dValue = randInt(rand, 6, 40);
        const d = dValue % 2 === 0 ? dValue / 2 : (dValue / 2).toFixed(1);
        const r = d / 2;
        const C = (Math.PI * d).toFixed(2);
        const numericC = parseFloat(C);
        return {
            questionHtml: `<div style="margin: 0; margin-bottom: 2px;"><strong>Find the circumference</strong></div>${drawCircle(r, "diameter", unit)}`,
            question: `Circle with diameter ${d} ${unit}. Find circumference.`,
            answer: `${C} ${unit}`,
            answerHtml: `${C} ${unit}`,
            wrongAnswers: generateNumericDistracters(numericC, rand),
        };
    } else if (type === 3) {
        // Type D: Area from diameter
        const dValue = randInt(rand, 6, 40);
        const d = dValue % 2 === 0 ? dValue / 2 : (dValue / 2).toFixed(1);
        const r = d / 2;
        const A = (Math.PI * r * r).toFixed(2);
        const numericA = parseFloat(A);
        return {
            questionHtml: `<div style="margin: 0; margin-bottom: 2px;"><strong>Find the area</strong></div>${drawCircle(r, "diameter", unit)}`,
            question: `Circle with diameter ${d} ${unit}. Find area.`,
            answer: `${A} ${unit}²`,
            answerHtml: `${A} ${unit}²`,
            wrongAnswers: generateNumericDistracters(numericA, rand),
        };
    } else if (type === 4) {
        // Type E: Find radius from circumference
        const rValue = randInt(rand, 5, 20);
        const r = rValue % 2 === 0 ? rValue / 2 : (rValue / 2).toFixed(1);
        const C = (2 * Math.PI * r).toFixed(2);
        const radiusAnswer = r.toString();
        const numericR = parseFloat(r);
        return {
            questionHtml: `<div style="margin: 0; margin-bottom: 2px;"><strong>Find the radius</strong></div><div style="margin: 0;">A circle has circumference ${C} ${unit}.</div>`,
            question: `Circumference ${C} ${unit}. Find radius.`,
            answer: `${radiusAnswer} ${unit}`,
            answerHtml: `${radiusAnswer} ${unit}`,
            wrongAnswers: generateNumericDistracters(numericR, rand),
        };
    } else {
        // Type F: Find radius from area
        const rValue = randInt(rand, 5, 20);
        const r = rValue % 2 === 0 ? rValue / 2 : (rValue / 2).toFixed(1);
        const A = (Math.PI * r * r).toFixed(2);
        const radiusAnswer = r.toString();
        const numericR = parseFloat(r);
        return {
            questionHtml: `<div style="margin: 0; margin-bottom: 2px;"><strong>Find the radius</strong></div><div style="margin: 0;">A circle has area ${A} ${unit}².</div>`,
            question: `Area ${A} ${unit}². Find radius.`,
            answer: `${radiusAnswer} ${unit}`,
            answerHtml: `${radiusAnswer} ${unit}`,
            wrongAnswers: generateNumericDistracters(numericR, rand),
        };
    }
}

