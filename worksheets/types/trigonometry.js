import { randInt } from "./utils.js";

// ── SVG Triangle with angle ───────────────────────────────────────────────────

function drawTrigTriangle(opposite, adjacent, angle, findWhat, unit) {
    const maxDim = Math.max(opposite, adjacent);
    const scale = 90 / maxDim;

    const adjPixels = adjacent * scale;
    const oppPixels = opposite * scale;

    const startX = 50;
    const startY = 20;
    const svgWidth = startX + adjPixels + 60;
    const svgHeight = startY + oppPixels + 50;

    // Vertices: right angle at bottom-left
    const x1 = startX;                  // bottom-left (right angle)
    const y1 = startY + oppPixels;
    const x2 = startX + adjPixels;      // bottom-right (angle θ)
    const y2 = y1;
    const x3 = startX;                  // top-left
    const y3 = startY;

    const sqSize = 6;
    const KNOWN = "#333";
    const UNKNOWN = "#cc3300";

    // Labels
    const adjLabel = findWhat === "adjacent" ? "?" : `${adjacent} ${unit}`;
    const oppLabel = findWhat === "opposite" ? "?" : `${opposite} ${unit}`;

    const adjCol = findWhat === "adjacent" ? UNKNOWN : KNOWN;
    const oppCol = findWhat === "opposite" ? UNKNOWN : KNOWN;

    return `
        <svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="max-width: ${svgWidth}px; display: block;">
            <!-- Triangle -->
            <polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="none" stroke="#0066cc" stroke-width="2"/>

            <!-- Right angle square -->
            <path d="M ${x1 + sqSize},${y1} L ${x1 + sqSize},${y1 - sqSize} L ${x1},${y1 - sqSize}" fill="none" stroke="#666" stroke-width="1"/>

            <!-- Adjacent (bottom) -->
            <text x="${(x1 + x2) / 2}" y="${y1 + 26}" text-anchor="middle" font-size="13" font-weight="bold" fill="${adjCol}">${adjLabel}</text>

            <!-- Opposite (left) -->
            <text x="${x1 - 12}" y="${(y1 + y3) / 2}" text-anchor="end" dominant-baseline="middle" font-size="13" font-weight="bold" fill="${oppCol}">${oppLabel}</text>

            <!-- Angle at bottom-right -->
            <path d="M ${x2 - 16},${y2} A 16,16 0 0,1 ${x2 - 13},${y2 - 8}" fill="none" stroke="#666" stroke-width="1.5"/>
            <text x="${x2 - 22}" y="${y2 - 12}" text-anchor="middle" font-size="12" fill="#666">${angle}°</text>
        </svg>
    `;
}

// ── Easy: Find side using sin/cos/tan, special angles (30, 45, 60) ────────────

function genEasy(rand) {
    const angles = [30, 45, 60];
    const angle = angles[randInt(rand, 0, 2)];

    // sin(30)=0.5, cos(30)=√3/2, tan(30)=1/√3
    // sin(45)=1/√2, cos(45)=1/√2, tan(45)=1
    // sin(60)=√3/2, cos(60)=0.5, tan(60)=√3

    const trigType = randInt(rand, 0, 2);  // 0=sin (find opposite), 1=cos (find adjacent), 2=tan
    let opposite, adjacent, findWhat, answer;

    if (angle === 30) {
        if (trigType === 0) {
            // sin(30) = opp/hyp = 0.5 → opp = hyp/2
            const hyp = randInt(rand, 4, 8) * 2;  // even, so opp is integer
            opposite = hyp / 2;
            adjacent = Math.round(Math.sqrt(hyp * hyp - opposite * opposite));
            findWhat = "opposite";
            answer = `${opposite} cm`;
        } else if (trigType === 1) {
            // cos(30) = adj/hyp = √3/2 → adj = hyp·√3/2, but not integer typically
            // Instead: use tan(30) = opp/adj = 1/√3 → adj = opp·√3
            // For integer: pick adj, opp = adj/√3... not clean
            // Let's use: find hyp given opposite
            opposite = randInt(rand, 2, 6);
            const hyp = opposite * 2;  // since sin(30) = 1/2
            adjacent = Math.round(Math.sqrt(hyp * hyp - opposite * opposite));
            findWhat = "hypotenuse (use sin)";
            answer = `${hyp} cm`;
        } else {
            // tan(30) = opp/adj = 1/√3 → not clean for integers
            // Skip: use cos instead
            const hyp = randInt(rand, 4, 8) * 2;
            const adj = Math.round(hyp * Math.sqrt(3) / 2);
            opposite = hyp / 2;
            adjacent = adj;
            findWhat = "opposite";
            answer = `${opposite} cm`;
        }
    } else if (angle === 45) {
        // sin(45) = cos(45) = 1/√2 → legs are equal
        const leg = randInt(rand, 3, 8);
        opposite = leg;
        adjacent = leg;
        findWhat = randInt(rand, 0, 1) === 0 ? "opposite" : "adjacent";
        answer = `${leg} cm`;
    } else {
        // angle === 60
        if (trigType === 0) {
            // sin(60) = opp/hyp = √3/2 → not clean
            // Instead: cos(60) = adj/hyp = 0.5 → adj = hyp/2
            const hyp = randInt(rand, 4, 8) * 2;
            adjacent = hyp / 2;
            opposite = Math.round(Math.sqrt(hyp * hyp - adjacent * adjacent));
            findWhat = "adjacent";
            answer = `${adjacent} cm`;
        } else if (trigType === 1) {
            // cos(60) = adj/hyp = 0.5 → adj = hyp/2
            const hyp = randInt(rand, 4, 8) * 2;
            adjacent = hyp / 2;
            opposite = Math.round(Math.sqrt(hyp * hyp - adjacent * adjacent));
            findWhat = "adjacent";
            answer = `${adjacent} cm`;
        } else {
            // tan(60) = opp/adj = √3 → opp = adj·√3, not integer
            const hyp = randInt(rand, 4, 8) * 2;
            adjacent = hyp / 2;
            opposite = Math.round(Math.sqrt(hyp * hyp - adjacent * adjacent));
            findWhat = "opposite";
            answer = `${opposite} cm`;
        }
    }

    const unit = "cm";
    const svg = drawTrigTriangle(opposite, adjacent, angle, findWhat, unit);

    return {
        questionHtml: svg,
        question: `Right-angled triangle with angle ${angle}°. Find the ${findWhat} side.`,
        answer,
        answerHtml: answer,
    };
}

// ── Normal: Find side, general angles, decimal answer ───────────────────────

function genNormal(rand) {
    const angle = randInt(rand, 20, 80);
    const hyp = randInt(rand, 5, 15);

    const radians = (angle * Math.PI) / 180;
    const opposite = Math.round(hyp * Math.sin(radians) * 10) / 10;
    const adjacent = Math.round(hyp * Math.cos(radians) * 10) / 10;

    const findWhat = randInt(rand, 0, 1) === 0 ? "opposite" : "adjacent";
    const toFind = findWhat === "opposite" ? opposite : adjacent;

    const unit = "cm";
    const svg = drawTrigTriangle(opposite, adjacent, angle, findWhat, unit);

    return {
        questionHtml: svg,
        question: `Right-angled triangle with angle ${angle}°, hypotenuse ${hyp} cm. Find the ${findWhat === "opposite" ? "opposite" : "adjacent"} side (to 1 d.p.).`,
        answer: `${toFind} cm`,
        answerHtml: `${toFind} cm`,
    };
}

// ── Hard: Find angle, given two sides ──────────────────────────────────────

function genHard(rand) {
    const opposite = randInt(rand, 3, 12);
    const adjacent = randInt(rand, 3, 12);

    const radians = Math.atan(opposite / adjacent);
    const angle = Math.round((radians * 180) / Math.PI * 10) / 10;

    const unit = "cm";
    const svg = drawTrigTriangle(opposite, adjacent, angle, "angle", unit);

    return {
        questionHtml: svg,
        question: `Right-angled triangle with opposite side ${opposite} cm and adjacent side ${adjacent} cm. Find angle θ (to 1 d.p.).`,
        answer: `${angle}°`,
        answerHtml: `${angle}°`,
    };
}

// ── Worksheet export ──────────────────────────────────────────────────────────

export default {
    id: "trigonometry",
    label: "Trigonometry (sin, cos, tan)",
    grades: [8, 9, 9],  // [easy, normal, hard]
    instruction() {
        return "Use trigonometry (sin, cos, tan) to find missing sides and angles in right-angled triangles.";
    },
    printTitle() {
        return "Trigonometry (sin, cos, tan)";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            if (difficulty === "easy")   problems.push(genEasy(rand));
            else if (difficulty === "normal") problems.push(genNormal(rand));
            else problems.push(genHard(rand));
        }
        return problems;
    },
};
