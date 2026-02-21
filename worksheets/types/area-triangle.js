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
            base = (randInt(rand, 8, 16) / 2).toFixed(1);
            height = randInt(rand, 4, 10);
        }
    } else {
        const type = randInt(rand, 0, 2);
        if (type === 0) {
            base = (randInt(rand, 12, 20) / 2).toFixed(1);
            height = (randInt(rand, 10, 16) / 2).toFixed(1);
        } else if (type === 1) {
            base = randInt(rand, 8, 14);
            height = (randInt(rand, 10, 20) / 2).toFixed(1);
        } else {
            base = (randInt(rand, 14, 24) / 2).toFixed(1);
            height = randInt(rand, 6, 12);
        }
    }

    const area = (parseFloat(base) * parseFloat(height)) / 2;
    const areaStr = area % 1 === 0 ? `${area}` : area.toFixed(2);

    const questionHtml = drawTriangle(base, height);

    return {
        questionHtml,
        question: `Triangle: base ${base} cm, height ${height} cm. Area = ?`,
        answer: areaStr,
        answerHtml: areaStr,
    };
}

function drawTriangle(base, height) {
    const svgWidth = 280;
    const svgHeight = 160;

    // Scale factor to fit in SVG
    const maxDim = Math.max(parseFloat(base), parseFloat(height));
    const scale = 60 / maxDim;

    const baseWidth = parseFloat(base) * scale;
    const heightPixels = parseFloat(height) * scale;

    const startX = (svgWidth - baseWidth) / 2;
    const startY = svgHeight - 40;

    // Triangle vertices: base at bottom, apex at top center
    const baseLeftX = startX;
    const baseRightX = startX + baseWidth;
    const baseY = startY;
    const apexX = startX + baseWidth / 2;
    const apexY = startY - heightPixels;

    return `
        <svg width="100%" height="160" viewBox="0 0 ${svgWidth} ${svgHeight}" style="max-width: 280px;">
            <defs>
                <marker id="arrowhead-start" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto">
                    <polygon points="10 0, 0 3, 10 6" fill="#666"/>
                </marker>
                <marker id="arrowhead-end" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
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
                marker-end="url(#arrowhead-end)"
                marker-start="url(#arrowhead-start)"
            />
            <text
                x="${apexX}"
                y="${baseY + 28}"
                text-anchor="middle"
                font-size="14"
                font-weight="bold"
                fill="#333"
            >
                ${base} cm
            </text>

            <!-- Height label (dashed line from apex perpendicular to base) -->
            <line
                x1="${apexX}"
                y1="${apexY}"
                x2="${apexX}"
                y2="${baseY}"
                stroke="#666"
                stroke-width="1"
                stroke-dasharray="4,2"
            />
            <line
                x1="${apexX - 6}"
                y1="${apexY + 12}"
                x2="${apexX + 6}"
                y2="${apexY + 12}"
                stroke="#666"
                stroke-width="1"
                marker-end="url(#arrowhead-end)"
                marker-start="url(#arrowhead-start)"
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
                ${height} cm
            </text>
        </svg>
        <div style="text-align: center; margin-top: 8px; font-size: 13px; color: #666;">
            <strong>Find the area</strong>
        </div>
    `;
}
