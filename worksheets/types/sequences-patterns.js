import { renderKatex } from "./utils.js";

// ── Pattern definitions ──────────────────────────────────────────────────────
// Each pattern: id, nth(n) → count, bounds(n) → {cols, rows}, cells(n) → [[col,row],...]
// Cells use SVG coords: col increases right, row increases DOWN.

const PATTERNS = {
    "double-row": {
        label: "squares",
        nth: n => 2 * n,
        bounds: n => ({ cols: n, rows: 2 }),
        cells: n => {
            const c = [];
            for (let col = 0; col < n; col++) { c.push([col, 0]); c.push([col, 1]); }
            return c;
        },
        answerText: "2n",
        answerLatex: "2n",
    },
    "l-shape": {
        label: "squares",
        nth: n => 2 * n + 1,
        bounds: n => ({ cols: n + 1, rows: n + 1 }),
        cells: n => {
            const c = [];
            for (let row = 0; row <= n; row++) c.push([0, row]);   // vertical left column
            for (let col = 1; col <= n; col++) c.push([col, n]);   // horizontal bottom row
            return c;
        },
        answerText: "2n + 1",
        answerLatex: "2n + 1",
    },
    "three-row": {
        label: "squares",
        nth: n => 3 * n,
        bounds: n => ({ cols: n, rows: 3 }),
        cells: n => {
            const c = [];
            for (let col = 0; col < n; col++) { c.push([col, 0]); c.push([col, 1]); c.push([col, 2]); }
            return c;
        },
        answerText: "3n",
        answerLatex: "3n",
    },
    "frame": {
        label: "squares",
        nth: n => 4 * n,
        bounds: n => ({ cols: n + 1, rows: n + 1 }),
        cells: n => {
            const c = [], size = n + 1;
            for (let col = 0; col < size; col++)
                for (let row = 0; row < size; row++)
                    if (col === 0 || col === size - 1 || row === 0 || row === size - 1)
                        c.push([col, row]);
            return c;
        },
        answerText: "4n",
        answerLatex: "4n",
    },
    "cross": {
        label: "squares",
        nth: n => 4 * n + 1,
        bounds: n => ({ cols: 2 * n + 1, rows: 2 * n + 1 }),
        cells: n => {
            const c = [], mid = n;
            for (let col = 0; col <= 2 * n; col++) c.push([col, mid]);
            for (let row = 0; row <= 2 * n; row++) { if (row !== mid) c.push([mid, row]); }
            return c;
        },
        answerText: "4n + 1",
        answerLatex: "4n + 1",
    },
    "u-shape": {
        label: "squares",
        nth: n => 3 * n + 2,
        bounds: n => ({ cols: n + 2, rows: n + 1 }),
        cells: n => {
            const c = [];
            for (let col = 0; col < n + 2; col++) c.push([col, n]);     // bottom row
            for (let row = 0; row < n; row++) { c.push([0, row]); c.push([n + 1, row]); } // side columns
            return c;
        },
        answerText: "3n + 2",
        answerLatex: "3n + 2",
    },
    "t-shape": {
        label: "squares",
        nth: n => 3 * n + 1,
        bounds: n => ({ cols: 2 * n + 1, rows: n + 1 }),
        cells: n => {
            const c = [];
            for (let col = 0; col <= 2 * n; col++) c.push([col, 0]);   // top bar
            for (let row = 1; row <= n; row++) c.push([n, row]);        // downward stem
            return c;
        },
        answerText: "3n + 1",
        answerLatex: "3n + 1",
    },
    "square": {
        label: "squares",
        nth: n => n * n,
        bounds: n => ({ cols: n, rows: n }),
        cells: n => {
            const c = [];
            for (let col = 0; col < n; col++) for (let row = 0; row < n; row++) c.push([col, row]);
            return c;
        },
        answerText: "n²",
        answerLatex: "n^2",
    },
    "staircase": {
        label: "squares",
        nth: n => n * (n + 1) / 2,
        bounds: n => ({ cols: n, rows: n }),
        cells: n => {
            const c = [];
            for (let col = 0; col < n; col++)
                for (let h = 0; h <= col; h++) c.push([col, n - 1 - h]);
            return c;
        },
        answerText: "½n(n + 1)",
        answerLatex: "\\tfrac{1}{2}n(n+1)",
    },
    "rect": {
        label: "squares",
        nth: n => n * (n + 1),
        bounds: n => ({ cols: n + 1, rows: n }),
        cells: n => {
            const c = [];
            for (let col = 0; col < n + 1; col++) for (let row = 0; row < n; row++) c.push([col, row]);
            return c;
        },
        answerText: "n(n + 1)",
        answerLatex: "n(n+1)",
    },
};

const BY_DIFF = {
    easy:   ["double-row", "l-shape", "three-row"],
    normal: ["double-row", "l-shape", "three-row", "frame", "cross", "u-shape", "t-shape"],
    hard:   ["square", "staircase", "rect"],
};

// ── Worksheet export ─────────────────────────────────────────────────────────

export default {
    id: "sequences-patterns",
    label: "Pattern Sequences",
    instruction(options = {}) {
        const mode = options.questionMode || "nth-term";
        if (mode === "count") return "Study each pattern. Find the number of squares in the next pattern.";
        return "Study each pattern. Find an expression for the number of squares in Pattern n.";
    },
    printTitle() {
        return "Pattern Sequences";
    },
    options: [
        {
            id: "questionMode",
            label: "Question type:",
            type: "select",
            default: "nth-term",
            values: [
                { value: "nth-term", label: "Find the nth term" },
                { value: "count",    label: "Find the next count" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const mode = options.questionMode || "nth-term";
        const keys = BY_DIFF[difficulty] || BY_DIFF.normal;
        const problems = [];
        for (let i = 0; i < count; i++) {
            const key = keys[Math.floor(rand() * keys.length)];
            problems.push(makeProblem(PATTERNS[key], key, mode));
        }
        return problems;
    },
};

// ── Problem generator ────────────────────────────────────────────────────────

function makeProblem(pattern, patternId, mode) {
    const counts = [1, 2, 3].map(n => pattern.nth(n));
    const questionHtml = buildSvg(pattern, mode);

    // Plain-text question for dedup key
    const question = `${patternId}: ${counts.join(", ")}. ${mode === "count" ? "Next?" : "nth term?"}`;

    let answer, answerHtml;
    if (mode === "count") {
        answer = `${pattern.nth(4)}`;
        answerHtml = answer;
    } else {
        answer = pattern.answerText;
        answerHtml = renderKatex(pattern.answerLatex) || answer;
    }

    return { questionHtml, question, answer, answerHtml };
}

// ── SVG builder ──────────────────────────────────────────────────────────────

const SLOT_W   = 90;   // width of each pattern slot
const SLOT_GAP = 5;    // gap between slots
const DRAW_H   = 78;   // drawing area height per slot
const LABEL_H  = 18;   // height for "Pattern n" label below drawing
const TOTAL_W  = SLOT_W * 3 + SLOT_GAP * 2;  // 280
const TOTAL_H  = DRAW_H + LABEL_H;

const FILL_COLOUR   = "#4f9ef8";
const STROKE_COLOUR = "#1a56db";

function buildSvg(pattern, mode) {
    // Compute cell size to fit pattern 3 within the drawing slot
    const b3 = pattern.bounds(3);
    const cellSize = Math.min(
        Math.floor((SLOT_W - 8) / b3.cols),
        Math.floor((DRAW_H - 8) / b3.rows),
    );

    let inner = "";

    for (let n = 1; n <= 3; n++) {
        const slotX = (n - 1) * (SLOT_W + SLOT_GAP);
        const cells  = pattern.cells(n);
        const bn     = pattern.bounds(n);

        // Centre the pattern within the slot's drawing area
        const patW   = cellSize * bn.cols;
        const patH   = cellSize * bn.rows;
        const offX   = slotX + Math.round((SLOT_W - patW) / 2);
        const offY   = Math.round((DRAW_H - patH) / 2);

        for (const [col, row] of cells) {
            const x = offX + col * cellSize;
            const y = offY + row * cellSize;
            inner += `<rect x="${x + 1}" y="${y + 1}" width="${cellSize - 2}" height="${cellSize - 2}" fill="${FILL_COLOUR}" stroke="${STROKE_COLOUR}" stroke-width="0.5" rx="1"/>`;
        }

        // "Pattern n" label
        inner += `<text x="${slotX + SLOT_W / 2}" y="${DRAW_H + 13}" text-anchor="middle" font-size="11" fill="#555">Pattern ${n}</text>`;
    }

    // For "count" mode add a 4th slot showing "Pattern 4 = ?"
    let extraW = 0;
    if (mode === "count") {
        const slot4X = TOTAL_W + SLOT_GAP;
        extraW = SLOT_W + SLOT_GAP;
        // Dashed placeholder box
        inner += `<rect x="${slot4X + 10}" y="15" width="${SLOT_W - 20}" height="${DRAW_H - 25}" fill="none" stroke="#aaa" stroke-width="1.5" stroke-dasharray="4 3" rx="3"/>`;
        inner += `<text x="${slot4X + SLOT_W / 2}" y="${DRAW_H - 10}" text-anchor="middle" font-size="13" fill="#aaa">?</text>`;
        inner += `<text x="${slot4X + SLOT_W / 2}" y="${DRAW_H + 13}" text-anchor="middle" font-size="11" fill="#555">Pattern 4</text>`;
    }

    const svgW = TOTAL_W + extraW;
    return `<svg width="100%" viewBox="0 0 ${svgW} ${TOTAL_H}" style="max-width:${svgW}px;display:block;margin-bottom:4px;">${inner}</svg>`;
}
