import { randInt } from "./utils.js";

export default {
    id: "area-rectangle",
    label: "Area of Rectangles",
    instruction() {
        return "Calculate the area of each rectangle using Area = length × width.";
    },
    printTitle() {
        return "Area of Rectangles";
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
    hard: ["cm", "m", "mm", "km"],
};

function fmt(n) {
    return n % 1 === 0 ? String(n) : n.toFixed(1);
}

function generateProblem(rand, difficulty) {
    let width, height;

    if (difficulty === "easy") {
        width = randInt(rand, 2, 8);
        height = randInt(rand, 2, 8);
    } else if (difficulty === "normal") {
        if (Math.random() < 0.5) {
            width = randInt(rand, 4, 12);
            height = randInt(rand, 4, 12);
        } else {
            width = fmt(randInt(rand, 5, 15) / 2);
            height = randInt(rand, 4, 10);
        }
    } else {
        const type = randInt(rand, 0, 2);
        if (type === 0) {
            width = fmt(randInt(rand, 10, 25) / 2);
            height = fmt(randInt(rand, 10, 20) / 2);
        } else if (type === 1) {
            width = randInt(rand, 8, 15);
            height = fmt(randInt(rand, 10, 25) / 2);
        } else {
            width = fmt(randInt(rand, 15, 30) / 2);
            height = randInt(rand, 6, 12);
        }
    }

    const unitList = UNITS[difficulty];
    const unit = unitList[randInt(rand, 0, unitList.length - 1)];

    const area = parseFloat(width) * parseFloat(height);
    const areaStr = area % 1 === 0 ? `${area}` : area.toFixed(2);
    const answer = `${areaStr} ${unit}²`;

    const questionHtml = drawRectangle(width, height, unit);

    return {
        questionHtml,
        question: `Rectangle: ${width} ${unit} × ${height} ${unit}. Area = ?`,
        answer,
        answerHtml: answer,
    };
}

function drawRectangle(width, height, unit) {
    const svgWidth = 280;

    // Scale factor to fit in SVG
    const maxDim = Math.max(parseFloat(width), parseFloat(height));
    const scale = 75 / maxDim;

    const rectWidth = parseFloat(width) * scale;
    const rectHeight = parseFloat(height) * scale;

    const startX = (svgWidth - rectWidth) / 2;
    const startY = 6;

    // Dynamic height: top pad + rect + arrow offset + label + bottom pad
    const svgHeight = Math.ceil(startY + rectHeight + 30);

    return `
        <svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="max-width: 280px; display: block;">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto-start-reverse">
                    <polygon points="0 0, 10 3, 0 6" fill="#666"/>
                </marker>
            </defs>
            <!-- Rectangle -->
            <rect
                x="${startX}"
                y="${startY}"
                width="${rectWidth}"
                height="${rectHeight}"
                fill="none"
                stroke="#0066cc"
                stroke-width="2.5"
            />

            <!-- Width label (bottom) -->
            <line
                x1="${startX}"
                y1="${startY + rectHeight + 12}"
                x2="${startX + rectWidth}"
                y2="${startY + rectHeight + 12}"
                stroke="#666"
                stroke-width="1"
                marker-end="url(#arrowhead)"
                marker-start="url(#arrowhead)"
            />
            <text
                x="${startX + rectWidth / 2}"
                y="${startY + rectHeight + 28}"
                text-anchor="middle"
                font-size="14"
                font-weight="bold"
                fill="#333"
            >
                ${width} ${unit}
            </text>

            <!-- Height label (right) -->
            <line
                x1="${startX + rectWidth + 12}"
                y1="${startY}"
                x2="${startX + rectWidth + 12}"
                y2="${startY + rectHeight}"
                stroke="#666"
                stroke-width="1"
                marker-end="url(#arrowhead)"
                marker-start="url(#arrowhead)"
            />
            <text
                x="${startX + rectWidth + 28}"
                y="${startY + rectHeight / 2}"
                text-anchor="start"
                dominant-baseline="middle"
                font-size="14"
                font-weight="bold"
                fill="#333"
            >
                ${height} ${unit}
            </text>
        </svg>
    `;
}
