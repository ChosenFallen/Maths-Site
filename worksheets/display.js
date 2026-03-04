import { WORKSHEET_TYPES } from "./groups.js";

const codeInput = document.getElementById("worksheet-code");
const loadBtn = document.getElementById("load-worksheet-btn");
const output = document.getElementById("worksheet-output");
const printTitle = document.getElementById("print-title");
const worksheetInstruction = document.getElementById("worksheet-instruction");
const revealAllBtn = document.getElementById("reveal-all-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const colorButtons = document.getElementById("color-buttons");
const worksheetOptions = document.getElementById("worksheet-options");

let allAnswerBoxes = [];
let isFullscreen = false;

// Utility functions (from worksheet.js)
function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function stringToSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function parseWorksheetId(id) {
    const parts = id.split("|");
    if (parts.length < 4) return null;
    const [baseId, type, difficulty, numProblemsRaw] = parts;
    const numProblems = parseInt(numProblemsRaw, 10);
    if (!baseId || Number.isNaN(numProblems)) return null;
    const optionsPart = parts.slice(4).join("|");
    const options = decodeOptions(optionsPart);
    return { baseId, type, difficulty, numProblems, options };
}

function decodeOptions(optionsPart) {
    if (!optionsPart) return {};
    const options = {};
    optionsPart.split(",").forEach((pair) => {
        const [key, raw] = pair.split("=");
        if (!key) return;
        if (raw === "1") {
            options[key] = true;
        } else if (raw === "0") {
            options[key] = false;
        } else {
            options[key] = decodeURIComponent(raw || "");
        }
    });
    return options;
}

function getWorksheetType(typeId) {
    return WORKSHEET_TYPES.find((type) => type.id === typeId);
}

function setPrintTitle(worksheetType, options) {
    if (!worksheetType) {
        printTitle.textContent = "";
        return;
    }
    const title =
        typeof worksheetType.printTitle === "function"
            ? worksheetType.printTitle(options)
            : worksheetType.label;
    printTitle.textContent = title;
}

function setInstructionText(worksheetType, options) {
    if (!worksheetType) {
        worksheetInstruction.textContent = "";
        return;
    }
    const text =
        typeof worksheetType.instruction === "function"
            ? worksheetType.instruction(options)
            : "Solve the following.";
    worksheetInstruction.textContent = text;
}

function generateUniqueProblems(type, rand, difficulty, count, options) {
    const problems = [];
    const seen = new Set();
    const maxAttempts = Math.max(50, count * 10);
    let attempts = 0;

    while (problems.length < count && attempts < maxAttempts) {
        attempts++;
        const [problem] = type.generate(rand, difficulty, 1, options);
        if (!problem) continue;
        const key = buildProblemKey(problem);
        if (seen.has(key)) continue;
        seen.add(key);
        problems.push(problem);
    }

    return { problems, truncated: problems.length < count };
}

function buildProblemKey(problem) {
    if (problem.questionHtml) {
        return problem.questionHtml.replace(/\s+/g, " ").trim();
    }
    if (problem.question) {
        return problem.question.replace(/\s+/g, " ").trim();
    }
    return JSON.stringify(problem);
}

function renderWorksheet(problems) {
    output.innerHTML = "";
    allAnswerBoxes = [];

    // Problems grid
    const grid = document.createElement("div");
    grid.className = "problems-grid";

    problems.forEach((p, i) => {
        const item = document.createElement("div");
        item.className = "problem-item";
        item.style.cursor = "pointer";

        // Problem number
        const numberSpan = document.createElement("div");
        numberSpan.className = "problem-number";
        numberSpan.textContent = `Question ${i + 1}`;
        item.appendChild(numberSpan);

        // Question
        const questionDiv = document.createElement("div");
        questionDiv.className = "problem-question";
        if (p.questionHtml) {
            questionDiv.innerHTML = p.questionHtml;
        } else {
            questionDiv.textContent = p.question;
        }
        item.appendChild(questionDiv);

        // Answer box with answer displayed (hidden by default)
        const answerBox = document.createElement("div");
        answerBox.className = "problem-answer-box";
        answerBox.style.display = "none";
        answerBox.style.flexDirection = "column";
        answerBox.style.alignItems = "center";
        answerBox.style.justifyContent = "center";
        answerBox.style.fontSize = "24px";
        answerBox.style.fontWeight = "bold";
        answerBox.style.color = "#0066cc";

        const prefix = p.answerPrefix || "";
        if (p.answerKeyHtml) {
            answerBox.innerHTML = prefix ? `<div>${prefix}</div><div>${p.answerKeyHtml}</div>` : `<div>${p.answerKeyHtml}</div>`;
        } else if (p.answerHtml) {
            answerBox.innerHTML = prefix ? `<div>${prefix}</div><div>${p.answerHtml}</div>` : `<div>${p.answerHtml}</div>`;
        } else {
            const answerDiv = document.createElement("div");
            answerDiv.textContent = p.answer;
            answerBox.appendChild(answerDiv);
            if (prefix) {
                const prefixDiv = document.createElement("div");
                prefixDiv.textContent = prefix;
                answerBox.insertBefore(prefixDiv, answerDiv);
            }
        }
        item.appendChild(answerBox);
        allAnswerBoxes.push(answerBox);

        // Click handler to toggle answer visibility
        item.addEventListener("click", () => {
            if (answerBox.style.display === "none") {
                answerBox.style.display = "flex";
            } else {
                answerBox.style.display = "none";
            }
        });

        grid.appendChild(item);
    });

    output.appendChild(grid);
    revealAllBtn.style.display = "block";
    fullscreenBtn.style.display = "block";
    colorButtons.style.display = "flex";
}

function loadWorksheet() {
    const code = codeInput.value.trim();
    if (!code) {
        alert("Please enter a worksheet code");
        return;
    }

    const parsed = parseWorksheetId(code);
    if (!parsed) {
        alert("Invalid worksheet code format");
        return;
    }

    const { type, difficulty, numProblems, options } = parsed;

    const worksheetType = getWorksheetType(type);
    if (!worksheetType) {
        alert(`Unknown worksheet type: ${type}`);
        return;
    }

    const seed = stringToSeed(code);
    const rand = mulberry32(seed);

    const result = generateUniqueProblems(
        worksheetType,
        rand,
        difficulty,
        numProblems,
        options,
    );

    setPrintTitle(worksheetType, options);
    setInstructionText(worksheetType, options);
    renderWorksheet(result.problems);
}

// Event listeners
loadBtn.addEventListener("click", loadWorksheet);
codeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") loadWorksheet();
});

revealAllBtn.addEventListener("click", () => {
    const allHidden = allAnswerBoxes.every((box) => box.style.display === "none");
    if (allHidden) {
        allAnswerBoxes.forEach((box) => {
            box.style.display = "flex";
        });
        revealAllBtn.textContent = "Hide All Answers";
    } else {
        allAnswerBoxes.forEach((box) => {
            box.style.display = "none";
        });
        revealAllBtn.textContent = "Reveal All Answers";
    }
});

fullscreenBtn.addEventListener("click", () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
        // Enter fullscreen
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        worksheetOptions.style.display = "none";
        fullscreenBtn.textContent = "Exit Fullscreen";
        isFullscreen = true;
    } else {
        // Exit fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (document.webkitFullscreenElement) {
            document.webkitExitFullscreen();
        } else if (document.mozFullScreenElement) {
            document.mozCancelFullScreen();
        } else if (document.msFullscreenElement) {
            document.msExitFullscreen();
        }
        worksheetOptions.style.display = "block";
        fullscreenBtn.textContent = "Fullscreen";
        isFullscreen = false;
    }
});

// Handle fullscreen change events
document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        worksheetOptions.style.display = "block";
        fullscreenBtn.textContent = "Fullscreen";
        isFullscreen = false;
    }
});

document.addEventListener("webkitfullscreenchange", () => {
    if (!document.webkitFullscreenElement) {
        worksheetOptions.style.display = "block";
        fullscreenBtn.textContent = "Fullscreen";
        isFullscreen = false;
    }
});

// Color preset buttons
document.querySelectorAll(".color-preset").forEach((button) => {
    button.addEventListener("click", () => {
        const color = button.getAttribute("data-color");
        document.body.style.backgroundColor = color;
        document.documentElement.style.setProperty("--bg-color", color);
        const problemItems = document.querySelectorAll(".problem-item");
        problemItems.forEach((item) => {
            item.style.backgroundColor = color;
        });
    });
});

// Check if code is in URL query parameter
window.addEventListener("load", () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
        codeInput.value = code;
        loadWorksheet();
    }
});
