import { randInt } from "./utils.js";

const UNIT_NAMES = {
    mm: "millimetres", cm: "centimetres", m: "metres", km: "kilometres",
    g: "grams", kg: "kilograms", t: "tonnes",
    ml: "millilitres", cl: "centilitres", l: "litres",
    s: "seconds", min: "minutes", h: "hours", days: "days",
};

// factor: answer = input * factor
// tier: minimum difficulty required for this conversion to appear
// pool: all candidate input values (easy filters to those giving whole-number answers)
const CONVERSIONS = [
    // ── Length ──────────────────────────────────────────────────────────────────
    { cat: "length", from: "mm", to: "cm", factor: 0.1, tier: "easy",
      pool: [10,20,30,40,50,60,70,80,90,100,120,150,200,250,300,15,25,35,45,55,65,75,85] },
    { cat: "length", from: "cm", to: "mm", factor: 10,  tier: "easy",
      pool: [1,2,3,4,5,6,7,8,9,10,12,15,20,25,30,1.5,2.5,3.5,4.5,7.5,8.5,11.5] },
    { cat: "length", from: "cm", to: "m",  factor: 0.01, tier: "easy",
      pool: [100,200,300,400,500,600,700,800,900,1000,150,250,350,450,750,1500,2000] },
    { cat: "length", from: "m",  to: "cm", factor: 100,  tier: "easy",
      pool: [1,2,3,4,5,6,7,8,9,10,1.5,2.5,3.5,4.5,7.5,12,15,20] },
    { cat: "length", from: "m",  to: "km", factor: 0.001, tier: "easy",
      pool: [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,500,1500,2500,3500] },
    { cat: "length", from: "km", to: "m",  factor: 1000,  tier: "easy",
      pool: [1,2,3,4,5,6,7,8,9,10,0.5,1.5,2.5,3.5,7.5,12,15,20] },
    { cat: "length", from: "mm", to: "m",  factor: 0.001, tier: "normal",
      pool: [1000,2000,3000,4000,5000,500,1500,2500,3500,7500,1200,1800,2700,3600] },
    { cat: "length", from: "m",  to: "mm", factor: 1000,  tier: "normal",
      pool: [1,2,3,4,5,0.5,1.5,2.5,3.5,7.5,1.2,1.8,2.7,3.6] },
    { cat: "length", from: "km", to: "cm", factor: 100000, tier: "hard",
      pool: [0.1,0.2,0.3,0.4,0.5,1,1.5,2,0.05,0.25] },

    // ── Mass ────────────────────────────────────────────────────────────────────
    { cat: "mass", from: "g",  to: "kg", factor: 0.001, tier: "easy",
      pool: [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,500,1500,2500,3500] },
    { cat: "mass", from: "kg", to: "g",  factor: 1000,  tier: "easy",
      pool: [1,2,3,4,5,6,7,8,9,10,0.5,1.5,2.5,3.5,7.5,12,15,20] },
    { cat: "mass", from: "kg", to: "t",  factor: 0.001, tier: "normal",
      pool: [1000,2000,3000,4000,5000,500,1500,2500,3500,7500,1200,1800,2700,3600] },
    { cat: "mass", from: "t",  to: "kg", factor: 1000,  tier: "normal",
      pool: [1,2,3,4,5,0.5,1.5,2.5,3.5,7.5,1.2,1.8,2.7,3.6] },
    { cat: "mass", from: "g",  to: "t",  factor: 1e-6,  tier: "hard",
      pool: [500000,1000000,1500000,2000000,2500000,3000000] },

    // ── Capacity ────────────────────────────────────────────────────────────────
    { cat: "capacity", from: "ml", to: "l",  factor: 0.001, tier: "easy",
      pool: [1000,2000,3000,4000,5000,500,1500,2500,3500,7500] },
    { cat: "capacity", from: "l",  to: "ml", factor: 1000,  tier: "easy",
      pool: [1,2,3,4,5,0.5,1.5,2.5,3.5,7.5] },
    { cat: "capacity", from: "cl", to: "l",  factor: 0.01,  tier: "normal",
      pool: [100,200,300,400,500,50,150,250,350,750,125,175,225] },
    { cat: "capacity", from: "l",  to: "cl", factor: 100,   tier: "normal",
      pool: [1,2,3,4,5,0.5,1.5,2.5,3.5,1.25,1.75,2.25,3.75] },
    { cat: "capacity", from: "ml", to: "cl", factor: 0.1,   tier: "normal",
      pool: [10,20,30,40,50,100,5,15,25,35,75,150,12,18,23,37] },
    { cat: "capacity", from: "cl", to: "ml", factor: 10,    tier: "normal",
      pool: [1,2,3,4,5,10,0.5,1.5,2.5,3.5,7.5,15,1.2,1.8,2.3] },

    // ── Time ────────────────────────────────────────────────────────────────────
    { cat: "time", from: "s",   to: "min", factor: 1/60, tier: "easy",
      pool: [60,120,180,240,300,360,420,480,30,90,150,600,900] },
    { cat: "time", from: "min", to: "s",   factor: 60,   tier: "easy",
      pool: [1,2,3,4,5,6,7,8,10,0.5,1.5,2.5,15] },
    { cat: "time", from: "min", to: "h",   factor: 1/60, tier: "easy",
      pool: [60,120,180,240,300,30,90,150,45] },
    { cat: "time", from: "h",   to: "min", factor: 60,   tier: "easy",
      pool: [1,2,3,4,5,0.5,1.5,2.5,3.5] },
    { cat: "time", from: "h",   to: "days", factor: 1/24, tier: "easy",
      pool: [24,48,72,96,120,12,36,6] },
    { cat: "time", from: "days", to: "h",  factor: 24,   tier: "easy",
      pool: [1,2,3,4,5,7,0.5,1.5,2.5] },
    { cat: "time", from: "s",   to: "h",   factor: 1/3600, tier: "normal",
      pool: [3600,7200,10800,1800,5400,9000] },
    { cat: "time", from: "h",   to: "s",   factor: 3600, tier: "normal",
      pool: [1,2,3,0.5,1.5,2.5] },
    { cat: "time", from: "min", to: "days", factor: 1/1440, tier: "hard",
      pool: [1440,2880,4320,720] },
    { cat: "time", from: "days", to: "min", factor: 1440, tier: "hard",
      pool: [1,2,3,0.5,1.5] },
];

const TIER_ORDER = { easy: 0, normal: 1, hard: 2 };
const ALL_CATS = ["length", "mass", "capacity", "time"];

function isWholeNumber(n) {
    return Math.abs(n - Math.round(n)) < 1e-9;
}

function fmtNum(n) {
    return parseFloat(n.toPrecision(10)).toString();
}

function getActiveCategories(options) {
    const checked = ALL_CATS.filter(c => options[c]);
    // If none or all are ticked, include everything
    return (checked.length === 0 || checked.length === ALL_CATS.length) ? ALL_CATS : checked;
}

function getAvailableConversions(categories, difficulty) {
    const maxTier = TIER_ORDER[difficulty];
    return CONVERSIONS.filter(c =>
        categories.includes(c.cat) && TIER_ORDER[c.tier] <= maxTier
    );
}

function getInputPool(conv, difficulty) {
    if (difficulty === "easy") {
        return conv.pool.filter(v => isWholeNumber(v * conv.factor));
    }
    return conv.pool;
}

function genDistracters(answer, input, factor) {
    const seen = new Set([answer]);
    const wrong = [];

    function tryAdd(v) {
        const r = parseFloat(v.toPrecision(10));
        if (!wrong.includes(r) && isFinite(r) && r > 0 && !seen.has(r)) {
            seen.add(r);
            wrong.push(r);
        }
    }

    tryAdd(answer * 10);
    tryAdd(answer / 10);
    tryAdd(input);
    const reversed = input / factor;
    if (reversed < 1e9) tryAdd(reversed);
    tryAdd(answer * 100);
    tryAdd(answer / 100);

    // Fallback: numeric neighbours
    let k = 1;
    while (wrong.length < 3) {
        tryAdd(answer + k * (answer > 10 ? 5 : 0.5));
        tryAdd(answer - k * (answer > 10 ? 5 : 0.5));
        k++;
    }

    return wrong.slice(0, 3);
}

function generateProblem(rand, difficulty, categories) {
    const available = getAvailableConversions(categories, difficulty);
    const conv = available[randInt(rand, 0, available.length - 1)];
    const pool = getInputPool(conv, difficulty);

    if (pool.length === 0) return generateProblem(rand, "easy", categories);

    const input = pool[randInt(rand, 0, pool.length - 1)];
    const answer = parseFloat((input * conv.factor).toPrecision(10));

    const answerText = `${fmtNum(answer)} ${conv.to}`;
    const wrongAnswers = genDistracters(answer, input, conv.factor)
        .map(w => `${fmtNum(w)} ${conv.to}`);

    return {
        question: `Convert ${fmtNum(input)} ${conv.from} to ${UNIT_NAMES[conv.to]}.`,
        answer: answerText,
        answerHtml: answerText,
        wrongAnswers,
    };
}

const CAT_LABELS = {
    length:   "length",
    mass:     "mass",
    capacity: "capacity",
    time:     "time",
};

export default {
    id: "metric-units",
    label: "Metric Unit Conversions",
    grades: [3, 4, 5],
    options: [
        { id: "length",   label: "Length (mm, cm, m, km)",  type: "checkbox", default: false },
        { id: "mass",     label: "Mass (g, kg, t)",          type: "checkbox", default: false },
        { id: "capacity", label: "Capacity (ml, cl, l)",     type: "checkbox", default: false },
        { id: "time",     label: "Time (s, min, h, days)",   type: "checkbox", default: false },
    ],
    instruction(options = {}) {
        const cats = getActiveCategories(options);
        if (cats.length === ALL_CATS.length) {
            return "Convert between metric units of length, mass, capacity, and time.";
        }
        const names = cats.map(c => CAT_LABELS[c]);
        return `Convert between metric units of ${names.join(", ")}.`;
    },
    printTitle(options = {}) {
        const cats = getActiveCategories(options);
        if (cats.length === ALL_CATS.length) return "Metric Unit Conversions";
        const labels = { length: "Length", mass: "Mass", capacity: "Capacity", time: "Time" };
        return `Metric Unit Conversions: ${cats.map(c => labels[c]).join(", ")}`;
    },
    generate(rand, difficulty, count, options = {}) {
        const categories = getActiveCategories(options);
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty, categories));
        }
        return problems;
    },
};
