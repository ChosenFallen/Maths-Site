import { randInt, generateNumericDistracters } from "./utils.js";

export default {
    id: "number-lines",
    label: "Number Lines",
    grades: [2, 3, 4],
    instruction(options = {}) {
        const mode = options.questionType || "mixed";
        if (mode === "midpoint") return "Find the midpoint between the two values shown.";
        if (mode === "missing")  return "Find the missing value on the number line.";
        if (mode === "add")      return "Start at the marked point and move along the number line.";
        if (mode === "read")     return "What value does the arrow point to?";
        return "Answer the number line question.";
    },
    printTitle() { return "Number Lines"; },
    options: [
        {
            id: "questionType",
            label: "Question type:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed",    label: "Mixed (all types)" },
                { value: "midpoint", label: "Find the midpoint" },
                { value: "missing",  label: "Missing value on scale" },
                { value: "add",      label: "Add / subtract along line" },
                { value: "read",     label: "Read a value off the line" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const mode = options.questionType || "mixed";
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty, mode));
        }
        return problems;
    },
};

// ─── Scale definitions ────────────────────────────────────────────────────────
// All scales produce clean tick values that are multiples of step.
// Ticks are always integers (or 0.5-step decimals in hard mode).

const SCALES = {
    easy: [
        { min: 0,  max: 10,  step: 1  },
        { min: 0,  max: 20,  step: 2  },
        { min: 0,  max: 50,  step: 5  },
        { min: 0,  max: 100, step: 10 },
    ],
    normal: [
        { min: 0,   max: 20,  step: 2  },
        { min: -10, max: 10,  step: 2  },
        { min: 0,   max: 50,  step: 5  },
        { min: 20,  max: 60,  step: 5  },
        { min: 0,   max: 100, step: 10 },
    ],
    hard: [
        { min: 0,  max: 5,  step: 0.5 },
        { min: 0,  max: 2,  step: 0.2 },
        { min: -2, max: 2,  step: 0.5 },
        { min: 1,  max: 4,  step: 0.5 },
        { min: 0,  max: 10, step: 0.5 },
    ],
};

function pickScale(rand, difficulty) {
    const list = SCALES[difficulty] || SCALES.normal;
    return list[randInt(rand, 0, list.length - 1)];
}

// Returns array of tick values for a scale, avoiding floating-point noise
function scaleTicks({ min, max, step }) {
    const n = Math.round((max - min) / step);
    return Array.from({ length: n + 1 }, (_, i) =>
        Math.round((min + i * step) * 10000) / 10000
    );
}

function formatNum(n) {
    if (Number.isInteger(n)) return String(n);
    return parseFloat(n.toFixed(2)).toString();
}

// ─── SVG renderer ─────────────────────────────────────────────────────────────

const SVG_W = 500;
const LINE_X1 = 36;
const LINE_X2 = 456; // 420px for the scale

function toX(value, min, max) {
    return LINE_X1 + ((value - min) / (max - min)) * (LINE_X2 - LINE_X1);
}

/**
 * Renders a number line as an inline SVG string.
 *
 * @param {number[]} ticks         All tick values (evenly spaced)
 * @param {object}   opts
 *   hiddenTick {number}     Show this tick as a "?" box instead of its value
 *   arcFrom   {number}      Draw a red curved arc starting here
 *   arcTo     {number}      …ending here (requires arcFrom)
 *   pointer   {number}      Draw a red downward arrow pointing to this value
 */
function renderLine(ticks, { hiddenTick = null, arcFrom = null, arcTo = null, pointer = null } = {}) {
    const min = ticks[0];
    const max = ticks[ticks.length - 1];

    const hasArc = arcFrom !== null && arcTo !== null;

    // Layout differs slightly for arc questions (labels go below line so arc has room above)
    const LINE_Y    = hasArc ? 52 : 46;
    const SVG_H     = hasArc ? 85 : (pointer !== null ? 82 : 70);
    const TICK_UP   = 8;
    const TICK_DOWN = 6;
    const LABEL_Y   = hasArc ? LINE_Y + TICK_DOWN + 14 : LINE_Y - TICK_UP - 6;
    // "?" box sits where the label would be
    const BOX_H     = 18;
    const BOX_Y     = hasArc
        ? LINE_Y + TICK_DOWN + 3
        : LINE_Y - TICK_UP - BOX_H + 2;

    // Arrow line
    const lineSvg = `
    <defs>
      <marker id="arr" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
        <path d="M0,0 L7,3 L0,6 Z" fill="#333"/>
      </marker>
      <marker id="rarc" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
        <path d="M0,0 L7,3 L0,6 Z" fill="#c0392b"/>
      </marker>
    </defs>
    <line x1="${LINE_X1}" y1="${LINE_Y}" x2="${LINE_X2}" y2="${LINE_Y}"
          stroke="#333" stroke-width="2" marker-end="url(#arr)"/>`;

    // Tick marks and labels
    const ticksSvg = ticks.map(v => {
        const x = toX(v, min, max);
        const isHidden = hiddenTick !== null && Math.abs(v - hiddenTick) < 0.00001;

        const tick = `<line x1="${x.toFixed(1)}" y1="${LINE_Y - TICK_UP}"
                            x2="${x.toFixed(1)}" y2="${LINE_Y + TICK_DOWN}"
                            stroke="#444" stroke-width="1.5"/>`;

        if (isHidden) {
            return `${tick}
    <rect x="${(x - 15).toFixed(1)}" y="${BOX_Y}" width="30" height="${BOX_H}" rx="3"
          fill="#fff" stroke="#555" stroke-width="1.5"/>
    <text x="${x.toFixed(1)}" y="${BOX_Y + 13}" text-anchor="middle"
          font-size="12" font-weight="bold" fill="#555">?</text>`;
        }

        return `${tick}
    <text x="${x.toFixed(1)}" y="${LABEL_Y}" text-anchor="middle"
          font-size="13" fill="#222">${formatNum(v)}</text>`;
    }).join("\n");

    // Curved arc for "add" questions (quadratic bezier, arcs above the line)
    let arcSvg = "";
    if (hasArc) {
        const x1 = toX(arcFrom, min, max);
        const x2 = toX(arcTo, min, max);
        const mx = (x1 + x2) / 2;
        const arcH = 30;
        arcSvg = `
    <path d="M ${x1.toFixed(1)},${LINE_Y} Q ${mx.toFixed(1)},${(LINE_Y - arcH).toFixed(1)} ${x2.toFixed(1)},${LINE_Y}"
          stroke="#c0392b" stroke-width="2.5" fill="none" marker-end="url(#rarc)"/>
    <circle cx="${x1.toFixed(1)}" cy="${LINE_Y}" r="5" fill="#c0392b"/>`;
    }

    // Downward arrow pointer for "read" questions
    let pointerSvg = "";
    if (pointer !== null) {
        const px = toX(pointer, min, max);
        const py1 = LINE_Y + TICK_DOWN + 4;
        const py2 = py1 + 16;
        pointerSvg = `
    <line x1="${px.toFixed(1)}" y1="${py1}" x2="${px.toFixed(1)}" y2="${py2}"
          stroke="#c0392b" stroke-width="2.5"/>
    <polygon points="${(px-7).toFixed(1)},${py2} ${(px+7).toFixed(1)},${py2} ${px.toFixed(1)},${py2+8}"
             fill="#c0392b"/>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_W}" height="${SVG_H}"
     style="display:block;max-width:100%;overflow:visible">
  ${lineSvg}
  ${ticksSvg}
  ${arcSvg}
  ${pointerSvg}
</svg>`;
}

// ─── Question generators ──────────────────────────────────────────────────────

function generateProblem(rand, difficulty, mode) {
    const type = mode === "mixed"
        ? ["midpoint", "missing", "add", "read"][randInt(rand, 0, 3)]
        : mode;
    if (type === "midpoint") return midpointProblem(rand, difficulty);
    if (type === "missing")  return missingProblem(rand, difficulty);
    if (type === "add")      return addProblem(rand, difficulty);
    return readProblem(rand, difficulty);
}

// ── midpoint: pick two ticks with an even index gap, hide the midpoint tick ───
function midpointProblem(rand, difficulty) {
    const scale = pickScale(rand, difficulty);
    const ticks = scaleTicks(scale);

    // idxB - idxA must be even (≥ 2) so the midpoint lands on a tick
    let idxA = randInt(rand, 0, ticks.length - 3);
    let gapOptions = [];
    for (let g = 2; g <= ticks.length - 1 - idxA; g += 2) gapOptions.push(g);
    if (gapOptions.length === 0) { idxA = 0; gapOptions = [2]; }
    const gap = gapOptions[randInt(rand, 0, gapOptions.length - 1)];
    const idxB = Math.min(idxA + gap, ticks.length - 1);
    const idxMid = (idxA + idxB) / 2;

    const a   = ticks[idxA];
    const b   = ticks[idxB];
    const mid = ticks[idxMid];

    const svg      = renderLine(ticks, { hiddenTick: mid });
    const question = `What number is halfway between ${formatNum(a)} and ${formatNum(b)}?`;
    const answer   = formatNum(mid);

    return {
        question,
        questionHtml: `<p style="margin:0 0 6px">${question}</p>${svg}`,
        answer,
        wrongAnswers: generateNumericDistracters(mid, rand, { allowNegative: a < 0 }),
    };
}

// ── missing: hide one middle tick on the scale ────────────────────────────────
function missingProblem(rand, difficulty) {
    const scale = pickScale(rand, difficulty);
    const ticks = scaleTicks(scale);

    const hiddenIdx = randInt(rand, 1, ticks.length - 2);
    const hidden    = ticks[hiddenIdx];

    const svg    = renderLine(ticks, { hiddenTick: hidden });
    const answer = formatNum(hidden);

    return {
        question:     "What is the missing value on the number line?",
        questionHtml: `<p style="margin:0 0 6px">What is the missing value on the number line?</p>${svg}`,
        answer,
        wrongAnswers: generateNumericDistracters(hidden, rand, { allowNegative: ticks[0] < 0 }),
    };
}

// ── add: start at a tick, jump 1–4 steps, show curved arc ─────────────────────
function addProblem(rand, difficulty) {
    const scale = pickScale(rand, difficulty);
    const ticks = scaleTicks(scale);

    // Pick a start index not at either extreme
    const startIdx = randInt(rand, 1, ticks.length - 2);

    // Decide direction: go right if possible, otherwise left
    const canRight = startIdx < ticks.length - 1;
    const canLeft  = startIdx > 0;
    const goRight  = canRight && (!canLeft || rand() > 0.35);
    const maxSteps = goRight ? (ticks.length - 1 - startIdx) : startIdx;
    const steps    = randInt(rand, 1, Math.min(4, maxSteps));
    const endIdx   = goRight ? startIdx + steps : startIdx - steps;

    const start = ticks[startIdx];
    const end   = ticks[endIdx];
    const move  = end - start;

    const dir      = move > 0 ? `move ${formatNum(move)} to the right` : `move ${formatNum(Math.abs(move))} to the left`;
    const question = `Starting at ${formatNum(start)}, ${dir}. Where do you land?`;
    const svg      = renderLine(ticks, { arcFrom: start, arcTo: end });

    return {
        question,
        questionHtml: `<p style="margin:0 0 6px">${question}</p>${svg}`,
        answer: formatNum(end),
        wrongAnswers: generateNumericDistracters(end, rand, { allowNegative: end < 0 }),
    };
}

// ── read: show a pointer between two labeled ticks ────────────────────────────
function readProblem(rand, difficulty) {
    const scale = pickScale(rand, difficulty);
    const ticks = scaleTicks(scale);

    // Pointer sits at the midpoint between two adjacent ticks
    const idx    = randInt(rand, 0, ticks.length - 2);
    const target = (ticks[idx] + ticks[idx + 1]) / 2;
    // Round to avoid floating-point string noise
    const rounded = Math.round(target * 10000) / 10000;

    const question = "What value does the arrow point to on the number line?";
    const svg      = renderLine(ticks, { pointer: rounded });

    return {
        question,
        questionHtml: `<p style="margin:0 0 6px">${question}</p>${svg}`,
        answer: formatNum(rounded),
        wrongAnswers: generateNumericDistracters(rounded, rand, { allowNegative: ticks[0] < 0 }),
    };
}
