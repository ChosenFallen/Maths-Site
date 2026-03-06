import {
    randInt,
    generateNumericDistracters
} from "./utils.js";

// Pythagorean triples (a, b, c) where c is the hypotenuse — all distinct primitives + common multiples
const PYTH_TRIPLES = [
    [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25],
    [20, 21, 29], [9, 40, 41], [6, 8, 10], [9, 12, 15],
    [12, 16, 20], [15, 20, 25], [10, 24, 26], [14, 48, 50],
];

function fmt(n) {
    return n % 1 === 0 ? String(n) : n.toFixed(1);
}

const UNITS = {
    easy: ["cm", "m"],
    normal: ["cm", "m", "mm"],
    hard: ["cm", "m", "mm"],
};

function generateProblem(rand, difficulty, shape) {
    if (shape === "rectangle") return genRectangle(rand, difficulty);
    if (shape === "triangle")  return genTriangle(rand);
    if (shape === "l-shape")   return genLShape(rand, difficulty);

    // mixed: difficulty-based defaults
    if (difficulty === "easy") {
        return genRectangle(rand, difficulty);
    }
    if (difficulty === "normal") {
        return randInt(rand, 0, 1) === 0
            ? genRectangle(rand, difficulty)
            : genTriangle(rand);
    }
    // hard: L-shape or triangle
    return randInt(rand, 0, 1) === 0
        ? genLShape(rand, difficulty)
        : genTriangle(rand);
}

// ── Rectangle ─────────────────────────────────────────────────────────────────

function genRectangle(rand, difficulty) {
    let w, h;
    if (difficulty === "easy") {
        w = randInt(rand, 2, 10);
        h = randInt(rand, 2, 10);
    } else {
        if (randInt(rand, 0, 1) === 0) {
            w = randInt(rand, 4, 14);
            h = randInt(rand, 4, 14);
        } else {
            w = fmt(randInt(rand, 5, 20) / 2);
            h = randInt(rand, 4, 12);
        }
    }
    const unitList = UNITS[difficulty];
    const unit = unitList[randInt(rand, 0, unitList.length - 1)];

    const wf = parseFloat(w);
    const hf = parseFloat(h);
    const perimeter = 2 * (wf + hf);
    const perimStr = perimeter % 1 === 0 ? `${perimeter}` : perimeter.toFixed(1);
    const answer = `${perimStr} ${unit}`;

    return {
        questionHtml: drawRectangle(w, h, unit),
        question: `Rectangle: ${w} ${unit} × ${h} ${unit}. Perimeter = ?`,
        answer,
        answerHtml: answer,
    };
}

function drawRectangle(width, height, unit) {
    const wf = parseFloat(width);
    const hf = parseFloat(height);
    const maxDim = Math.max(wf, hf);
    const scale = 70 / maxDim;
    const rw = wf * scale;
    const rh = hf * scale;

    const startX = 10;  // small left margin
    const svgWidth = startX + rw + 90;  // 90 for height label on right
    const startY = 8;
    const svgHeight = Math.ceil(startY + rh + 32);

    return `
        <svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="max-width: ${svgWidth}px; display: block;">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto-start-reverse">
                    <polygon points="0 0, 10 3, 0 6" fill="#666"/>
                </marker>
            </defs>
            <rect x="${startX}" y="${startY}" width="${rw}" height="${rh}" fill="none" stroke="#0066cc" stroke-width="2.5"/>

            <!-- Width label (bottom) -->
            <line x1="${startX}" y1="${startY + rh + 12}" x2="${startX + rw}" y2="${startY + rh + 12}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${startX + rw / 2}" y="${startY + rh + 28}" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">${width} ${unit}</text>

            <!-- Height label (right) -->
            <line x1="${startX + rw + 12}" y1="${startY}" x2="${startX + rw + 12}" y2="${startY + rh}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${startX + rw + 28}" y="${startY + rh / 2}" text-anchor="start" dominant-baseline="middle" font-size="13" font-weight="bold" fill="#333">${height} ${unit}</text>
        </svg>
    `;
}

// ── Right-angled triangle (Pythagorean triple) ─────────────────────────────────

function genTriangle(rand) {
    const triple = PYTH_TRIPLES[randInt(rand, 0, PYTH_TRIPLES.length - 1)];
    let [a, b, c] = triple;

    // Optionally scale by 2 or 3 for variety (only scale primitive triples to avoid huge numbers)
    const isPrimitive = [3,5,8,7,20,9].includes(triple[0]);
    const k = isPrimitive ? randInt(rand, 1, 3) : 1;
    a *= k; b *= k; c *= k;

    const unitList = ["cm", "m", "mm"];
    const unit = unitList[randInt(rand, 0, unitList.length - 1)];

    const perimeter = a + b + c;
    const answer = `${perimeter} ${unit}`;

    return {
        questionHtml: drawRightTriangle(a, b, c, unit),
        question: `Right-angled triangle: sides ${a} ${unit}, ${b} ${unit}, ${c} ${unit}. Perimeter = ?`,
        answer,
        answerHtml: answer,
    };
}

function drawRightTriangle(a, b, c, unit) {
    const maxDim = Math.max(a, b);
    const scale = 100 / maxDim;

    const basePixels = a * scale;
    const heightPixels = b * scale;

    const startX = 75;  // left margin for height label (text-anchor:end at x-16, ~50px text)
    const svgWidth = startX + basePixels + 20;
    const startY = 8;
    const svgHeight = Math.ceil(startY + heightPixels + 36);

    // Right angle at bottom-left: (startX, startY+heightPixels)
    const x1 = startX;                     // bottom-left (right angle)
    const y1 = startY + heightPixels;
    const x2 = startX + basePixels;        // bottom-right
    const y2 = startY + heightPixels;
    const x3 = startX;                     // top-left (apex)
    const y3 = startY;

    const sqSize = 8;

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
            <text x="${(x1 + x2) / 2}" y="${y1 + 28}" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">${a} ${unit}</text>

            <!-- Height label (left) -->
            <line x1="${x1 - 12}" y1="${y1}" x2="${x3 - 12}" y2="${y3}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${x1 - 16}" y="${(y1 + y3) / 2}" text-anchor="end" dominant-baseline="middle" font-size="13" font-weight="bold" fill="#333">${b} ${unit}</text>

            <!-- Hypotenuse label (slanted, placed to the right of midpoint) -->
            <text
                x="${(x2 + x3) / 2 + 12}"
                y="${(y2 + y3) / 2}"
                text-anchor="start"
                dominant-baseline="middle"
                font-size="13"
                font-weight="bold"
                fill="#333"
            >${c} ${unit}</text>
        </svg>
    `;
}

// ── L-shape (compound rectangle) ──────────────────────────────────────────────

function genLShape(rand, difficulty) {
    const unitList = UNITS[difficulty];
    const unit = unitList[randInt(rand, 0, unitList.length - 1)];

    // L-shape: outer W×H with a corner rectangle w×h cut out
    // Dimensions chosen so w < W and h < H
    const W = randInt(rand, 6, 14);
    const H = randInt(rand, 6, 14);
    const w = randInt(rand, 2, W - 2);   // cut-out width
    const h = randInt(rand, 2, H - 2);   // cut-out height

    // Perimeter of L-shape = perimeter of two rectangles minus 2 shared inner edges
    // = 2W + 2H (same as the outer rectangle, since removing a corner doesn't change perimeter)
    const perimeter = 2 * (W + H);
    const answer = `${perimeter} ${unit}`;

    // The 6 known sides of the L-shape:
    // Going clockwise from top-left:
    //   top = W, right = H, bottom-right = (W-w), inner-bottom = h, inner-left = (H-h), left = 0 (that's just the left edge = H actually)
    // Let me think more carefully:
    // Outer rectangle W wide, H tall.
    // Cut top-right corner: cut w wide, h tall.
    // The 6 sides clockwise from bottom-left:
    //   bottom = W, right = H-h, inner-horizontal = w, inner-vertical = h, top-remaining = W-w, left = H
    // But that gives perimeter = W + (H-h) + w + h + (W-w) + H = 2W + 2H ✓

    // Labeled dimensions shown: W (bottom), H (left), (W-w) (top), (H-h) (right), w (inner horiz), h (inner vert)
    const labelW  = W;
    const labelH  = H;
    const labelTW = W - w;   // top partial width
    const labelRH = H - h;   // right partial height
    const labelIW = w;       // inner horizontal
    const labelIH = h;       // inner vertical

    return {
        questionHtml: drawLShape(W, H, w, h, unit, labelW, labelH, labelTW, labelRH, labelIW, labelIH),
        question: `L-shape: outer ${W}×${H} ${unit}, cut-out ${w}×${h} ${unit}. Perimeter = ?`,
        answer,
        answerHtml: answer,
    };
}

function drawLShape(W, H, w, h, unit, labelW, labelH, labelTW, labelRH, labelIW, labelIH) {
    const svgWidth = 300;
    const maxDim = Math.max(W, H);
    const scale = 80 / maxDim;

    const W2 = W * scale;
    const H2 = H * scale;
    const w2 = w * scale;
    const h2 = h * scale;

    // Position the L-shape centered
    const ox = (svgWidth - W2) / 2;
    const oy = 8;
    const svgHeight = Math.ceil(oy + H2 + 36);

    // Vertices clockwise from bottom-left:
    // BL, BR, inner-right, inner-top, TL-offset, TL
    const pts = [
        [ox,         oy + H2],          // bottom-left
        [ox + W2,    oy + H2],          // bottom-right
        [ox + W2,    oy + h2],          // step right
        [ox + W2 - w2, oy + h2],        // step inner horizontal
        [ox + W2 - w2, oy],             // top of remaining
        [ox,         oy],               // top-left
    ].map(([x, y]) => `${x},${y}`).join(" ");

    // Arrow markers offset
    const off = 12;
    const off2 = 28;

    // Mid-points for labels
    const midBottom = [ox + W2 / 2,              oy + H2];
    const midLeft   = [ox,                        oy + H2 / 2];
    const midTop    = [ox + (W2 - w2) / 2,        oy];
    const midRight  = [ox + W2,                   oy + H2 / 2 + h2 / 2];
    const midIH     = [ox + W2 - w2 / 2,          oy + h2];    // inner horizontal
    const midIV     = [ox + W2 - w2,              oy + h2 / 2]; // inner vertical

    return `
        <svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="max-width: 300px; display: block;">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto-start-reverse">
                    <polygon points="0 0, 10 3, 0 6" fill="#666"/>
                </marker>
            </defs>

            <!-- L-shape outline -->
            <polygon points="${pts}" fill="none" stroke="#0066cc" stroke-width="2.5"/>

            <!-- Bottom label -->
            <line x1="${ox}" y1="${oy + H2 + off}" x2="${ox + W2}" y2="${oy + H2 + off}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${midBottom[0]}" y="${oy + H2 + off2}" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">${labelW} ${unit}</text>

            <!-- Left label -->
            <line x1="${ox - off}" y1="${oy}" x2="${ox - off}" y2="${oy + H2}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${ox - off2}" y="${midLeft[1]}" text-anchor="end" dominant-baseline="middle" font-size="12" font-weight="bold" fill="#333">${labelH} ${unit}</text>

            <!-- Top (partial) label -->
            <line x1="${ox}" y1="${oy - off}" x2="${ox + W2 - w2}" y2="${oy - off}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${midTop[0]}" y="${oy - off - 2}" text-anchor="middle" dominant-baseline="auto" font-size="12" font-weight="bold" fill="#333">${labelTW} ${unit}</text>

            <!-- Right (partial) label -->
            <line x1="${ox + W2 + off}" y1="${oy + h2}" x2="${ox + W2 + off}" y2="${oy + H2}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${ox + W2 + off2}" y="${midRight[1]}" text-anchor="start" dominant-baseline="middle" font-size="12" font-weight="bold" fill="#333">${labelRH} ${unit}</text>

            <!-- Inner horizontal label -->
            <line x1="${ox + W2 - w2}" y1="${oy + h2 + off}" x2="${ox + W2}" y2="${oy + h2 + off}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${midIH[0]}" y="${oy + h2 + off2}" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">${labelIW} ${unit}</text>

            <!-- Inner vertical label -->
            <line x1="${ox + W2 - w2 - off}" y1="${oy}" x2="${ox + W2 - w2 - off}" y2="${oy + h2}"
                stroke="#666" stroke-width="1" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)"/>
            <text x="${ox + W2 - w2 - off2}" y="${midIV[1]}" text-anchor="end" dominant-baseline="middle" font-size="12" font-weight="bold" fill="#333">${labelIH} ${unit}</text>
        </svg>
    `;
}

const SHAPE_LABELS = {
    rectangle: "Rectangles",
    triangle:  "Right-angled Triangles",
    "l-shape": "L-shapes",
};

export default {
    id: "perimeter",
    label: "Perimeter",
    grades: [4, 5, 6],  // [easy, normal, hard]
    options: [
        {
            id: "shape",
            label: "Shape:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed",     label: "Mixed" },
                { value: "rectangle", label: "Rectangles" },
                { value: "triangle",  label: "Right-angled Triangles" },
                { value: "l-shape",   label: "L-shapes" },
            ],
        },
    ],
    instruction(options = {}) {
        const s = options.shape || "mixed";
        if (s === "rectangle") return "Calculate the perimeter of each rectangle.";
        if (s === "triangle")  return "Calculate the perimeter of each right-angled triangle.";
        if (s === "l-shape")   return "Calculate the perimeter of each L-shape.";
        return "Calculate the perimeter of each shape.";
    },
    printTitle(options = {}) {
        const s = options.shape || "mixed";
        if (SHAPE_LABELS[s]) return `Perimeter: ${SHAPE_LABELS[s]}`;
        return "Perimeter";
    },
    generate(rand, difficulty, count, options = {}) {
        const shape = options.shape || "mixed";
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty, shape));
        }
        return problems;
    },
};
