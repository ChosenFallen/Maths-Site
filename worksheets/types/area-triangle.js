import { randInt } from "./utils.js";

export default {
    id: "area-triangle",
    label: "Area of Triangles",
    instruction() {
        return "Calculate the area of each triangle using Area = ½ × base × height.";
    },
    printTitle() {
        return "Area of Triangles";
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
    let base, height;

    if (difficulty === "easy") {
        base = randInt(rand, 4, 10);
        height = randInt(rand, 2, 8);
    } else if (difficulty === "normal") {
        if (Math.random() < 0.5) {
            base = randInt(rand, 6, 12);
            height = randInt(rand, 4, 10);
        } else {
            base = fmt(randInt(rand, 8, 16) / 2);
            height = randInt(rand, 4, 10);
        }
    } else {
        const type = randInt(rand, 0, 2);
        if (type === 0) {
            base = fmt(randInt(rand, 12, 20) / 2);
            height = fmt(randInt(rand, 10, 16) / 2);
        } else if (type === 1) {
            base = randInt(rand, 8, 14);
            height = fmt(randInt(rand, 10, 20) / 2);
        } else {
            base = fmt(randInt(rand, 14, 24) / 2);
            height = randInt(rand, 6, 12);
        }
    }

    const unitList = UNITS[difficulty];
    const unit = unitList[randInt(rand, 0, unitList.length - 1)];

    const area = (parseFloat(base) * parseFloat(height)) / 2;
    const areaStr = area % 1 === 0 ? `${area}` : area.toFixed(2);
    const answer = `${areaStr} ${unit}²`;

    const questionHtml = drawTriangle(base, height, unit);

    return {
        questionHtml,
        question: `Triangle: base ${base} ${unit}, height ${height} ${unit}. Area = ?`,
        answer,
        answerHtml: answer,
    };
}

function drawTriangle(base, height, unit) {
    const svgWidth = 280;

    // Scale factor to fit in SVG
    const maxDim = Math.max(parseFloat(base), parseFloat(height));
    const scale = 60 / maxDim;

    const baseWidth = parseFloat(base) * scale;
    const heightPixels = parseFloat(height) * scale;

    const startX = (svgWidth - baseWidth) / 2;

    // Dynamic height: top pad + triangle + arrow offset + label + bottom pad
    const svgHeight = Math.ceil(6 + heightPixels + 38);
    const startY = svgHeight - 30;

    // Triangle vertices: base at bottom, apex at top center
    const baseLeftX = startX;
    const baseRightX = startX + baseWidth;
    const baseY = startY;
    const apexX = startX + baseWidth / 2;
    const apexY = startY - heightPixels;

    return `
        <svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="max-width: 280px; display: block;">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto-start-reverse">
                    <polygon points="0 0, 10 3, 0 6" fill="#666"/>
                </marker>
            </defs>

            <!-- Triangle -->
            <polygon
                points="${baseLeftX},${baseY} ${baseRightX},${baseY} ${apexX},${apexY}"
                fill="none"
                stroke="#0066cc"
                stroke-width="2.5"
            />

            <!-- Base label (bottom) -->
            <line
                x1="${baseLeftX}"
                y1="${baseY + 12}"
                x2="${baseRightX}"
                y2="${baseY + 12}"
                stroke="#666"
                stroke-width="1"
                marker-end="url(#arrowhead)"
                marker-start="url(#arrowhead)"
            />
            <text
                x="${apexX}"
                y="${baseY + 28}"
                text-anchor="middle"
                font-size="14"
                font-weight="bold"
                fill="#333"
            >
                ${base} ${unit}
            </text>

            <!-- Height label (dashed line from apex perpendicular to base, with arrows) -->
            <line
                x1="${apexX}"
                y1="${apexY}"
                x2="${apexX}"
                y2="${baseY}"
                stroke="#666"
                stroke-width="1"
                stroke-dasharray="4,2"
                marker-end="url(#arrowhead)"
                marker-start="url(#arrowhead)"
            />
            <text
                x="${apexX + 28}"
                y="${apexY + heightPixels / 2}"
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
