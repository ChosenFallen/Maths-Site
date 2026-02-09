import addition from "./types/addition.js";
import subtraction from "./types/subtraction.js";
import multiplication from "./types/multiplication.js";
import division from "./types/division.js";
import mixed from "./types/mixed.js";
import indices from "./types/indices.js";
import simplifyFractions from "./types/simplify-fractions.js";
import equivalentFractions from "./types/equivalent-fractions.js";
import fractionAddSub from "./types/fraction-add-sub.js";
import equations from "./types/equations.js";
import fractionMulDiv from "./types/fraction-mul-div.js";
import mixedNumbers from "./types/mixed-numbers.js";
import fdpFractionToDecimal from "./types/fdp-fraction-to-decimal.js";
import fdpDecimalToFraction from "./types/fdp-decimal-to-fraction.js";
import fdpFractionToPercent from "./types/fdp-fraction-to-percent.js";
import fdpPercentToFraction from "./types/fdp-percent-to-fraction.js";
import fdpDecimalToPercent from "./types/fdp-decimal-to-percent.js";
import fdpPercentToDecimal from "./types/fdp-percent-to-decimal.js";

const WORKSHEET_TYPES = [
    addition,
    subtraction,
    multiplication,
    division,
    mixed,
    indices,
    simplifyFractions,
    equivalentFractions,
    fractionAddSub,
    fractionMulDiv,
    mixedNumbers,
    fdpFractionToDecimal,
    fdpDecimalToFraction,
    fdpFractionToPercent,
    fdpPercentToFraction,
    fdpDecimalToPercent,
    fdpPercentToDecimal,
    equations,
];

const WORKSHEET_GROUPS = [
    {
        label: "Arithmetic",
        types: ["addition", "subtraction", "multiplication", "division", "mixed"],
    },
    {
        label: "Fractions",
        types: [
            "simplify-fractions",
            "equivalent-fractions",
            "fraction-add-sub",
            "fraction-mul-div",
            "mixed-numbers",
        ],
    },
    {
        label: "FDP (Fractions/Decimals/Percentages)",
        types: [
            "fdp-fraction-to-decimal",
            "fdp-decimal-to-fraction",
            "fdp-fraction-to-percent",
            "fdp-percent-to-fraction",
            "fdp-decimal-to-percent",
            "fdp-percent-to-decimal",
        ],
    },
    { label: "Powers", types: ["indices"] },
    { label: "Algebra", types: ["equations"] },
];

const generateBtn = document.getElementById("generate-btn");
const newRandomBtn = document.getElementById("new-random-btn");
const printBtn = document.getElementById("print-btn");
const toggleAnswersBtn = document.getElementById("toggle-answers-btn");
const copyIdBtn = document.getElementById("copy-id-btn");
const output = document.getElementById("worksheet-output");

let answerDivGlobal; // store reference to answer key for toggling

const worksheetIdInput = document.getElementById("worksheet-id");
const generatedIdText = document.getElementById("generated-id-text");
const copyStatus = document.getElementById("copy-status");
const problemTypeSelect = document.getElementById("problem-type");
const difficultySelect = document.getElementById("difficulty");
const numProblemsInput = document.getElementById("num-problems");
const mixedOptions = document.getElementById("mixed-options");
const includePowersInput = document.getElementById("include-powers");
const fractionOptions = document.getElementById("fraction-options");
const denominatorModeSelect = document.getElementById("denominator-mode");
const fractionMulDivOptions = document.getElementById(
    "fraction-mul-div-options",
);
const fractionMulDivModeSelect = document.getElementById(
    "fraction-mul-div-mode",
);
const mixedNumberOptions = document.getElementById("mixed-number-options");
const mixedNumberModeSelect = document.getElementById("mixed-number-mode");
const equationOptions = document.getElementById("equation-options");
const equationModeSelect = document.getElementById("equation-mode");
const uniquenessNote = document.getElementById("uniqueness-note");
const printTitle = document.getElementById("print-title");
const worksheetInstruction = document.getElementById("worksheet-instruction");

function setActionButtonsEnabled(enabled) {
    printBtn.disabled = !enabled;
    toggleAnswersBtn.disabled = !enabled;
    copyIdBtn.disabled = !enabled;
}

setActionButtonsEnabled(false);

function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function stringToSeed(str) {
    // simple hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // convert to 32-bit int
    }
    return hash;
}

function buildWorksheetId(baseId, type, difficulty, numProblems, options) {
    const optionsPart = encodeOptions(options);
    return `${baseId}|${type}|${difficulty}|${numProblems}${
        optionsPart ? `|${optionsPart}` : ""
    }`;
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

function generateWorksheet() {
    generateWorksheetInternal(false);
}

function generateNewRandomWorksheet() {
    generateWorksheetInternal(true);
}

function generateWorksheetInternal(forceNewId) {
    // Determine seed
    let id = worksheetIdInput.value.trim();
    let type = problemTypeSelect.value;
    let difficulty = difficultySelect.value;
    let numProblems = parseInt(numProblemsInput.value);
    let options = readOptionsFromUI(type);

    if (forceNewId || !id) {
        const baseId = Math.random().toString(36).substring(2, 10); // random 8-char ID
        id = buildWorksheetId(baseId, type, difficulty, numProblems, options);
    } else {
        const parsed = parseWorksheetId(id);
        if (parsed) {
            type = parsed.type;
            difficulty = parsed.difficulty;
            numProblems = parsed.numProblems;
            options = parsed.options || {};
            if (type === "equation1") {
                type = "equations";
                options.equationMode = "one";
            } else if (type === "equation2") {
                type = "equations";
                options.equationMode = "two";
            }
            problemTypeSelect.value = type;
            difficultySelect.value = difficulty;
            numProblemsInput.value = numProblems;
            applyOptionsToUI(type, options);
        } else {
            id = buildWorksheetId(id, type, difficulty, numProblems, options);
        }
    }

    if (!getWorksheetType(type)) {
        type = WORKSHEET_TYPES[0].id;
        problemTypeSelect.value = type;
        id = buildWorksheetId(
            id.split("|")[0],
            type,
            difficulty,
            numProblems,
            options,
        );
    }

    worksheetIdInput.value = id;
    generatedIdText.textContent = `Worksheet ID: ${id}`;
    copyStatus.textContent = "";
    uniquenessNote.textContent = "";
    setActionButtonsEnabled(true);

    const seed = stringToSeed(id);
    const rand = mulberry32(seed); // deterministic RNG function

    const worksheetType = getWorksheetType(type);
    const result = generateUniqueProblems(
        worksheetType,
        rand,
        difficulty,
        numProblems,
        options,
    );
    if (result.truncated) {
        uniquenessNote.textContent =
            "Note: Range too small to avoid all duplicates.";
    }

    setPrintTitle(worksheetType, options);
    setInstructionText(worksheetType, options);
    renderWorksheet(result.problems);
}

function renderWorksheet(problems) {
    output.innerHTML = "";

    // Problem table
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    problems.forEach((p, i) => {
        const row = document.createElement("tr");

        const cell1 = document.createElement("td");
        cell1.style.padding = "8px";
        if (p.questionHtml) {
            cell1.innerHTML = `${i + 1}) ${p.questionHtml}`;
        } else {
            cell1.textContent = `${i + 1}) ${p.question}`;
        }
        row.appendChild(cell1);

        table.appendChild(row);
    });

    output.appendChild(table);

    // Answer key section
    const answerDiv = document.createElement("div");
    answerDiv.style.marginTop = "30px";
    answerDiv.innerHTML = "<h3>Answer Key</h3>";

    const answerList = document.createElement("ol");
    problems.forEach((p) => {
        const li = document.createElement("li");
        const prefix = p.answerPrefix || "";
        if (p.questionHtml && p.answerHtml) {
            li.innerHTML = `${p.questionHtml} ${prefix}${p.answerHtml}`;
        } else if (p.questionHtml) {
            li.innerHTML = `${p.questionHtml} ${prefix}${p.answer}`;
        } else {
            li.innerHTML = `${p.question} ${prefix}${p.answer}`;
        }
        answerList.appendChild(li);
    });

    answerDiv.appendChild(answerList);
    answerDiv.classList.add("answers");
    answerDiv.style.display = "none"; // hidden on screen
    output.appendChild(answerDiv);

    answerDivGlobal = answerDiv; // store for toggle button
}

// Event listeners
generateBtn.addEventListener("click", generateWorksheet);
newRandomBtn.addEventListener("click", generateNewRandomWorksheet);
printBtn.addEventListener("click", () => window.print());

toggleAnswersBtn.addEventListener("click", () => {
    if (!answerDivGlobal) return;
    if (answerDivGlobal.style.display === "none")
        answerDivGlobal.style.display = "block";
    else answerDivGlobal.style.display = "none";
});

copyIdBtn.addEventListener("click", async () => {
    const id = worksheetIdInput.value.trim();
    if (!id) return;

    try {
        await navigator.clipboard.writeText(id);
        copyStatus.textContent = "Copied!";
    } catch {
        copyStatus.textContent = "Copy failed. Select and copy manually.";
    }
});

function clearIdOnSettingsChange() {
    worksheetIdInput.value = "";
    generatedIdText.textContent = "";
    copyStatus.textContent = "";
    // Keep print/toggle enabled if a worksheet is already rendered
    const hasWorksheet = output.hasChildNodes();
    printBtn.disabled = !hasWorksheet;
    toggleAnswersBtn.disabled = !hasWorksheet;
    copyIdBtn.disabled = true;
}

problemTypeSelect.addEventListener("change", clearIdOnSettingsChange);
difficultySelect.addEventListener("change", clearIdOnSettingsChange);
numProblemsInput.addEventListener("input", clearIdOnSettingsChange);
includePowersInput.addEventListener("change", clearIdOnSettingsChange);
denominatorModeSelect.addEventListener("change", clearIdOnSettingsChange);
fractionMulDivModeSelect.addEventListener("change", clearIdOnSettingsChange);
mixedNumberModeSelect.addEventListener("change", clearIdOnSettingsChange);
equationModeSelect.addEventListener("change", clearIdOnSettingsChange);

function getWorksheetType(typeId) {
    return WORKSHEET_TYPES.find((type) => type.id === typeId);
}

function populateWorksheetTypes() {
    problemTypeSelect.innerHTML = "";
    const typeMap = new Map(WORKSHEET_TYPES.map((t) => [t.id, t]));
    const added = new Set();

    WORKSHEET_GROUPS.forEach((group) => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = group.label;

        group.types.forEach((typeId) => {
            const type = typeMap.get(typeId);
            if (!type || added.has(type.id)) return;
            const option = document.createElement("option");
            option.value = type.id;
            option.textContent = type.label;
            optgroup.appendChild(option);
            added.add(type.id);
        });

        if (optgroup.children.length > 0) {
            problemTypeSelect.appendChild(optgroup);
        }
    });

    // Add any ungrouped types at the end
    WORKSHEET_TYPES.forEach((type) => {
        if (added.has(type.id)) return;
        const option = document.createElement("option");
        option.value = type.id;
        option.textContent = type.label;
        problemTypeSelect.appendChild(option);
    });
}

populateWorksheetTypes();
syncOptionsVisibility();

function syncOptionsVisibility() {
    const type = problemTypeSelect.value;
    const showMixed = type === "mixed";
    const showFractions = type === "fraction-add-sub";
    const showFractionMulDiv = type === "fraction-mul-div";
    const showMixedNumbers = type === "mixed-numbers";
    const showEquations = type === "equations";
    mixedOptions.classList.toggle("hidden", !showMixed);
    fractionOptions.classList.toggle("hidden", !showFractions);
    fractionMulDivOptions.classList.toggle("hidden", !showFractionMulDiv);
    mixedNumberOptions.classList.toggle("hidden", !showMixedNumbers);
    equationOptions.classList.toggle("hidden", !showEquations);
}

problemTypeSelect.addEventListener("change", () => {
    syncOptionsVisibility();
});

function readOptionsFromUI(type) {
    if (type === "mixed") {
        return { includePowers: includePowersInput.checked };
    }
    if (type === "fraction-add-sub") {
        return { denominatorMode: denominatorModeSelect.value };
    }
    if (type === "fraction-mul-div") {
        return { fractionMulDivMode: fractionMulDivModeSelect.value };
    }
    if (type === "mixed-numbers") {
        return { mixedNumberMode: mixedNumberModeSelect.value };
    }
    if (type === "equations") {
        return { equationMode: equationModeSelect.value };
    }
    return {};
}

function applyOptionsToUI(type, options) {
    if (type === "mixed") {
        includePowersInput.checked = !!options.includePowers;
    } else {
        includePowersInput.checked = false;
    }
    if (type === "fraction-add-sub") {
        denominatorModeSelect.value = options.denominatorMode || "mixed";
    } else {
        denominatorModeSelect.value = "mixed";
    }
    if (type === "fraction-mul-div") {
        fractionMulDivModeSelect.value = options.fractionMulDivMode || "mixed";
    } else {
        fractionMulDivModeSelect.value = "mixed";
    }
    if (type === "mixed-numbers") {
        mixedNumberModeSelect.value = options.mixedNumberMode || "mixed";
    } else {
        mixedNumberModeSelect.value = "mixed";
    }
    if (type === "equations") {
        equationModeSelect.value = options.equationMode || "mixed";
    } else {
        equationModeSelect.value = "mixed";
    }
}

function setPrintTitle(worksheetType, options) {
    if (!worksheetType) {
        printTitle.textContent = "";
        return;
    }
    let title = worksheetType.label;
    if (worksheetType.id === "equations") {
        const mode = options.equationMode || "mixed";
        if (mode === "one") title = "One-Step Equations";
        if (mode === "two") title = "Two-Step Equations";
    }
    if (worksheetType.id === "fraction-add-sub") {
        const mode = options.denominatorMode || "mixed";
        if (mode === "like") title = "Add/Subtract Fractions (Same Denominators)";
        if (mode === "unlike")
            title = "Add/Subtract Fractions (Different Denominators)";
    }
    if (worksheetType.id === "fraction-mul-div") {
        const mode = options.fractionMulDivMode || "mixed";
        if (mode === "multiply") title = "Multiply Fractions";
        if (mode === "divide") title = "Divide Fractions";
    }
    if (worksheetType.id === "mixed-numbers") {
        const mode = options.mixedNumberMode || "mixed";
        if (mode === "to-improper") title = "Mixed to Improper Fractions";
        if (mode === "to-mixed") title = "Improper to Mixed Fractions";
    }
    if (worksheetType.id === "mixed") {
        title = "Mixed Operations";
    }
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

function encodeOptions(options) {
    if (!options || Object.keys(options).length === 0) return "";
    return Object.entries(options)
        .map(([key, value]) => {
            if (typeof value === "boolean") {
                return `${key}=${value ? 1 : 0}`;
            }
            return `${key}=${encodeURIComponent(String(value))}`;
        })
        .join(",");
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

function generateUniqueProblems(type, rand, difficulty, count, options) {
    const problems = [];
    const seen = new Set();
    const maxAttempts = Math.max(50, count * 10);
    let attempts = 0;
    let truncated = false;

    while (problems.length < count && attempts < maxAttempts) {
        attempts++;
        const [problem] = type.generate(rand, difficulty, 1, options);
        if (!problem) continue;
        const key = buildProblemKey(problem);
        if (seen.has(key)) continue;
        seen.add(key);
        problems.push(problem);
    }

    // If uniqueness is hard (small ranges), fill remaining with whatever we can
    if (problems.length < count) {
        truncated = true;
        const fallback = type.generate(
            rand,
            difficulty,
            count - problems.length,
            options,
        );
        fallback.forEach((p) => problems.push(p));
    }

    return { problems, truncated };
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
