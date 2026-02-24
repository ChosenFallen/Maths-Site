import { randInt } from "./utils.js";

// Pythagorean triples [a, b, c] — aspect ratios kept ≤ 3.5 for clean SVG display
const TRIPLES = [
    [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29],
    [6, 8, 10], [9, 12, 15], [12, 16, 20], [15, 20, 25], [10, 24, 26],
];

const PRIMITIVE = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];

const UNITS = ["cm", "m", "mm"];

function pickTriple(rand, difficulty) {
    if (difficulty === "easy") {
        const pool = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15], [8, 15, 17], [12, 16, 20], [15, 20, 25]];
        return pool[randInt(rand, 0, pool.length - 1)];
    }
    if (difficulty === "normal") {
        const triple = TRIPLES[randInt(rand, 0, TRIPLES.length - 1)];
        const isPrim = PRIMITIVE.some(p => p[0] === triple[0]);
        const k = isPrim ? randInt(rand, 1, 2) : 1;
        return triple.map(x => x * k);
    }
    // hard
    const triple = PRIMITIVE[randInt(rand, 0, PRIMITIVE.length - 1)];
    const k = randInt(rand, 1, 3);
    return triple.map(x => x * k);
}

// ── SVG ───────────────────────────────────────────────────────────────────────

// findSide: "hypotenuse" | "base" | "height"
// Right angle at bottom-left; base = horizontal leg, height = vertical leg.
function drawTriangle(a, b, c, unit, findSide) {
    const maxDim = Math.max(a, b);
    const scale = 100 / maxDim;

    const basePixels   = a * scale;
    const heightPixels = b * scale;

    const startX = 75;  // left margin for height label (text-anchor:end at x-16, ~50px text)
    const svgWidth = startX + basePixels + 20;
    const startY = 8;
    const svgHeight = Math.ceil(startY + heightPixels + 36);

    // Vertices
    const x1 = startX;                     // bottom-left (right angle)
    const y1 = startY + heightPixels;
    const x2 = startX + basePixels;        // bottom-right
    const y2 = y1;
    const x3 = startX;                     // top-left (apex)
    const y3 = startY;

    const sqSize = 8;

    const KNOWN   = "#333";
    const UNKNOWN = "#cc3300";

    const baseLabel   = findSide === "base"       ? "?" : `${a} ${unit}`;
    const heightLabel = findSide === "height"      ? "?" : `${b} ${unit}`;
    const hypLabel    = findSide === "hypotenuse"  ? "?" : `${c} ${unit}`;

    const baseCol   = findSide === "base"      ? UNKNOWN : KNOWN;
    const heightCol = findSide === "height"    ? UNKNOWN : KNOWN;
    const hypCol    = findSide === "hypotenuse"? UNKNOWN : KNOWN;

    return `
        <svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="max-width: ${svgWidth}px; display: block;">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto-start-reverse">
                    <polygon points="0 0, 10 3, 0 6" fill="#666"/>
                </marker>
            </defs>

            <!-- Triangle -->
            <polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="none" stroke="#0066cc" stroke-width="2.5"/>

            <!-- Right angle square -->
            <path d="M ${x1 + sqSize},${y1} L ${x1 + sqSize},${y1 - sqSize} L ${x1},${y1 - sqSize}" fill="none" stroke="#666" stroke-width="1.5"/>

            <!-- Base label (bottom) -->
            <line x1="${x1}" y1="${y1 + 12}" x2="${x2}" y2="${y2 + 12}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${(x1 + x2) / 2}" y="${y1 + 28}" text-anchor="middle" font-size="13" font-weight="bold" fill="${baseCol}">${baseLabel}</text>

            <!-- Height label (left) -->
            <line x1="${x1 - 12}" y1="${y1}" x2="${x3 - 12}" y2="${y3}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${x1 - 16}" y="${(y1 + y3) / 2}" text-anchor="end" dominant-baseline="middle" font-size="13" font-weight="bold" fill="${heightCol}">${heightLabel}</text>

            <!-- Hypotenuse label (right of midpoint) -->
            <text
                x="${(x2 + x3) / 2 + 12}"
                y="${(y2 + y3) / 2}"
                text-anchor="start"
                dominant-baseline="middle"
                font-size="13"
                font-weight="bold"
                fill="${hypCol}"
            >${hypLabel}</text>
        </svg>
    `;
}

// ── Problem generators ────────────────────────────────────────────────────────

function generateProblem(rand, difficulty, find) {
    let [a, b, c] = pickTriple(rand, difficulty);

    // Randomly swap the two legs for visual variety
    if (randInt(rand, 0, 1) === 0) [a, b] = [b, a];

    const unitList = UNITS;
    const unit = unitList[randInt(rand, 0, unitList.length - 1)];

    // Determine which side to find
    let findSide;
    if (find === "hypotenuse") {
        findSide = "hypotenuse";
    } else if (find === "leg") {
        findSide = randInt(rand, 0, 1) === 0 ? "base" : "height";
    } else {
        // mixed: easy only does hypotenuse; normal/hard do any
        findSide = difficulty === "easy"
            ? "hypotenuse"
            : ["hypotenuse", "base", "height"][randInt(rand, 0, 2)];
    }

    let answer, question;
    if (findSide === "hypotenuse") {
        answer   = `${c} ${unit}`;
        question = `Right-angled triangle: legs ${a} ${unit} and ${b} ${unit}. Find the hypotenuse.`;
    } else if (findSide === "base") {
        answer   = `${a} ${unit}`;
        question = `Right-angled triangle: hypotenuse ${c} ${unit}, one leg ${b} ${unit}. Find the missing side.`;
    } else {
        answer   = `${b} ${unit}`;
        question = `Right-angled triangle: hypotenuse ${c} ${unit}, one leg ${a} ${unit}. Find the missing side.`;
    }

    return {
        questionHtml: drawTriangle(a, b, c, unit, findSide),
        question,
        answer,
        answerHtml: answer,
    };
}

// ── Worksheet export ──────────────────────────────────────────────────────────

export default {
    id: "pythagoras",
    label: "Pythagoras' Theorem",
    grades: [8, 8, 9],  // [easy, normal, hard]
    options: [
        {
            id: "find",
            label: "Find:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed",      label: "Mixed" },
                { value: "hypotenuse", label: "Hypotenuse" },
                { value: "leg",        label: "Shorter Side" },
            ],
        },
    ],
    instruction(options = {}) {
        const f = options.find || "mixed";
        if (f === "hypotenuse") return "Use Pythagoras' theorem to find the hypotenuse of each right-angled triangle.";
        if (f === "leg")        return "Use Pythagoras' theorem to find the shorter side of each right-angled triangle.";
        return "Use Pythagoras' theorem to find the missing side of each right-angled triangle.";
    },
    printTitle(options = {}) {
        const f = options.find || "mixed";
        if (f === "hypotenuse") return "Pythagoras: Find the Hypotenuse";
        if (f === "leg")        return "Pythagoras: Find a Shorter Side";
        return "Pythagoras' Theorem";
    },
    generate(rand, difficulty, count, options = {}) {
        const find = options.find || "mixed";
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty, find));
        }
        return problems;
    },
};
