import {
    randInt, shuffle,
    generateNumericDistracters
} from "./utils.js";

// Generate n integers in [min, max] that sum exactly to `total`.
// Bounds each pick so the final value is always valid.
function sumTo(rand, n, total, min, max) {
    for (let attempt = 0; attempt < 200; attempt++) {
        const vals = [];
        let rem = total;
        let ok = true;
        for (let i = 0; i < n - 1; i++) {
            const lo = Math.max(min, rem - (n - 1 - i) * max);
            const hi = Math.min(max, rem - (n - 1 - i) * min);
            if (lo > hi) { ok = false; break; }
            const v = randInt(rand, lo, hi);
            vals.push(v);
            rem -= v;
        }
        if (!ok) continue;
        if (rem >= min && rem <= max) {
            vals.push(rem);
            return vals;
        }
    }
    // Should never reach here given reasonable inputs
    return Array(n).fill(Math.round(total / n));
}

function fmt(n) {
    return n % 1 === 0 ? `${n}` : n.toFixed(1);
}

// ── Mean ──────────────────────────────────────────────────────────────────────

function genMean(rand, difficulty) {
    let n, mean, vals;
    if (difficulty === "easy") {
        n    = 5;
        mean = randInt(rand, 3, 8);
        vals = sumTo(rand, n, mean * n, 1, 12);
    } else if (difficulty === "normal") {
        n    = 6;
        mean = randInt(rand, 4, 15);
        vals = sumTo(rand, n, mean * n, 1, 25);
    } else {
        n = randInt(rand, 7, 9);
        // Allow non-integer mean by picking a total not divisible by n
        const total = randInt(rand, n * 4, n * 12);
        mean = total / n;
        vals = sumTo(rand, n, total, 1, 30);
    }
    shuffle(rand, vals);
    return { vals, answer: fmt(mean), numericAnswer: mean };
}

// ── Median ────────────────────────────────────────────────────────────────────

function genMedian(rand, difficulty) {
    let vals, median;

    if (difficulty === "easy") {
        // 5 numbers (odd), whole-number median
        median      = randInt(rand, 3, 9);
        const lows  = [randInt(rand, 1, median - 1), randInt(rand, 1, median - 1)];
        const highs = [randInt(rand, median + 1, median + 6), randInt(rand, median + 1, median + 6)];
        vals = [...lows, median, ...highs];
    } else if (difficulty === "normal") {
        if (randInt(rand, 0, 1) === 0) {
            // 7 numbers (odd), whole-number median
            median      = randInt(rand, 5, 15);
            const lows  = Array.from({ length: 3 }, () => randInt(rand, 1, median - 1));
            const highs = Array.from({ length: 3 }, () => randInt(rand, median + 1, median + 10));
            vals = [...lows, median, ...highs];
        } else {
            // 6 numbers (even), median = (m1 + m2) / 2
            const m1    = randInt(rand, 5, 14);
            const m2    = m1 + randInt(rand, 0, 2);
            median      = (m1 + m2) / 2;
            const lows  = [randInt(rand, 1, m1 - 1), randInt(rand, 1, m1 - 1)];
            const highs = [randInt(rand, m2 + 1, m2 + 10), randInt(rand, m2 + 1, m2 + 10)];
            vals = [...lows, m1, m2, ...highs];
        }
    } else {
        if (randInt(rand, 0, 1) === 0) {
            // 9 numbers (odd)
            median      = randInt(rand, 8, 20);
            const lows  = Array.from({ length: 4 }, () => randInt(rand, 1, median - 1));
            const highs = Array.from({ length: 4 }, () => randInt(rand, median + 1, median + 15));
            vals = [...lows, median, ...highs];
        } else {
            // 8 numbers (even)
            const m1    = randInt(rand, 8, 20);
            const m2    = m1 + randInt(rand, 0, 3);
            median      = (m1 + m2) / 2;
            const lows  = Array.from({ length: 3 }, () => randInt(rand, 1, m1 - 1));
            const highs = Array.from({ length: 3 }, () => randInt(rand, m2 + 1, m2 + 15));
            vals = [...lows, m1, m2, ...highs];
        }
    }

    shuffle(rand, vals);
    return { vals, answer: fmt(median), numericAnswer: median };
}

// ── Mode ──────────────────────────────────────────────────────────────────────

function genMode(rand, difficulty) {
    let mode, freq, n, maxVal;
    if (difficulty === "easy") {
        mode = randInt(rand, 2, 9);  freq = 2;  n = 5;  maxVal = 10;
    } else if (difficulty === "normal") {
        mode = randInt(rand, 2, 15); freq = 2;  n = randInt(rand, 6, 7); maxVal = 20;
    } else {
        mode = randInt(rand, 3, 20); freq = 3;  n = 8;  maxVal = 25;
    }

    // Fill remaining slots with distinct values ≠ mode
    const pool = new Set();
    while (pool.size < n - freq) {
        const v = randInt(rand, 1, maxVal);
        if (v !== mode) pool.add(v);
    }
    const vals = [...Array(freq).fill(mode), ...[...pool]];
    shuffle(rand, vals);
    return { vals, answer: `${mode}`, numericAnswer: mode };
}

// ── Range ─────────────────────────────────────────────────────────────────────

function genRange(rand, difficulty) {
    let min, rangeVal, totalNums, maxVal;
    if (difficulty === "easy") {
        min = randInt(rand, 1, 6);  rangeVal = randInt(rand, 3, 8);  totalNums = 5;
    } else if (difficulty === "normal") {
        min = randInt(rand, 1, 10); rangeVal = randInt(rand, 5, 20); totalNums = 6;
    } else {
        min = randInt(rand, 1, 15); rangeVal = randInt(rand, 10, 35); totalNums = 7;
    }
    const max = min + rangeVal;
    const middles = Array.from({ length: totalNums - 2 }, () => randInt(rand, min + 1, max - 1));
    const vals = [min, max, ...middles];
    shuffle(rand, vals);
    return { vals, answer: `${rangeVal}`, numericAnswer: rangeVal };
}

// ── Worksheet export ──────────────────────────────────────────────────────────

const MEASURES = ["mean", "median", "mode", "range"];
const LABELS   = { mean: "Mean", median: "Median", mode: "Mode", range: "Range" };

export default {
    id: "mean-median-mode-range",
    label: "Mean, Median, Mode & Range",
    grades: [4, 5, 6],  // [easy, normal, hard]
    instruction(options = {}) {
        const m = options.measure || "mixed";
        if (m === "mean")   return "Find the mean of each set of numbers.";
        if (m === "median") return "Find the median of each set of numbers.";
        if (m === "mode")   return "Find the mode of each set of numbers.";
        if (m === "range")  return "Find the range of each set of numbers.";
        return "Find the mean, median, mode or range shown for each set of numbers.";
    },
    printTitle(options = {}) {
        const m = options.measure || "mixed";
        if (m === "mean")   return "Mean";
        if (m === "median") return "Median";
        if (m === "mode")   return "Mode";
        if (m === "range")  return "Range";
        return "Mean, Median, Mode & Range";
    },
    options: [
        {
            id: "measure",
            label: "Calculate:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed",  label: "Mixed" },
                { value: "mean",   label: "Mean" },
                { value: "median", label: "Median" },
                { value: "mode",   label: "Mode" },
                { value: "range",  label: "Range" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const measure = options.measure || "mixed";
        const isMixed = measure === "mixed";
        const problems = [];
        for (let i = 0; i < count; i++) {
            const m = isMixed ? MEASURES[randInt(rand, 0, 3)] : measure;
            problems.push(generateProblem(rand, difficulty, m, isMixed));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, measure, isMixed) {
    let result;
    switch (measure) {
        case "mean":   result = genMean(rand, difficulty);   break;
        case "median": result = genMedian(rand, difficulty); break;
        case "mode":   result = genMode(rand, difficulty);   break;
        case "range":  result = genRange(rand, difficulty);  break;
    }

    const label  = LABELS[measure];
    const numStr = result.vals.join(", ");

    // Plain-text question used for dedup keying
    const question = `${label}: ${numStr}`;

    // Two-line HTML: measure label on first line, numbers on second
    const questionHtml = `<span style="display:block;font-size:0.8em;font-weight:600;color:#555;margin-bottom:3px;">${label}</span><span>${numStr}</span>`;

    return {
        question,
        questionHtml,
        answer: result.answer,
        answerPrefix: `${label} = `,
        wrongAnswers: generateNumericDistracters(result.numericAnswer, rand),
    };
}
