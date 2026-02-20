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
import decimalAddSub from "./types/decimal-add-sub.js";
import fractionCompare from "./types/fraction-compare.js";
import decimalMulDiv from "./types/decimal-mul-div.js";
import decimalCompare from "./types/decimal-compare.js";
import percentageOfAmount from "./types/percentage-of-amount.js";
import fractionOfAmount from "./types/fraction-of-amount.js";
import recurringDecimals from "./types/recurring-decimals.js";
import ratioSimplify from "./types/ratio-simplify.js";
import hcfLcm from "./types/hcf-lcm.js";
import rounding from "./types/rounding.js";
import standardForm from "./types/standard-form.js";
import primeFactorization from "./types/prime-factorization.js";
import missingNumber from "./types/missing-number.js";
import percentageChange from "./types/percentage-change.js";
import substitution from "./types/substitution.js";
import collectingLikeTerms from "./types/collecting-like-terms.js";
import expandingBrackets from "./types/expanding-brackets.js";
import multiplyingTerms from "./types/multiplying-terms.js";
import equationsBothSides from "./types/equations-both-sides.js";
import factorising from "./types/factorising.js";
import factorisingQuadratics from "./types/factorising-quadratics.js";
import reversePercentages from "./types/reverse-percentages.js";
import equationsFractions from "./types/equations-fractions.js";
import differenceOfTwoSquares from "./types/difference-of-two-squares.js";
import simplifyAlgebraicFractions from "./types/simplify-algebraic-fractions.js";
import simplifySurds from "./types/simplify-surds.js";
import surdsAddSub from "./types/surds-add-sub.js";
import surdsExpand from "./types/surds-expand.js";
import surdsRationalise from "./types/surds-rationalise.js";

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
    decimalAddSub,
    decimalMulDiv,
    decimalCompare,
    percentageOfAmount,
    fractionOfAmount,
    fractionCompare,
    equations,
    recurringDecimals,
    ratioSimplify,
    hcfLcm,
    rounding,
    standardForm,
    primeFactorization,
    missingNumber,
    percentageChange,
    substitution,
    collectingLikeTerms,
    expandingBrackets,
    multiplyingTerms,
    equationsBothSides,
    factorising,
    factorisingQuadratics,
    reversePercentages,
    equationsFractions,
    differenceOfTwoSquares,
    simplifyAlgebraicFractions,
    simplifySurds,
    surdsAddSub,
    surdsExpand,
    surdsRationalise,
];

const WORKSHEET_GROUPS = [
    {
        label: "Arithmetic",
        types: [
            "addition",
            "subtraction",
            "multiplication",
            "division",
            "mixed",
            "missing-number",
        ],
    },
    {
        label: "Fractions",
        types: [
            "simplify-fractions",
            "equivalent-fractions",
            "fraction-add-sub",
            "fraction-mul-div",
            "mixed-numbers",
            "fraction-compare",
            "fraction-of-amount",
        ],
    },
    {
        label: "Decimals",
        types: ["decimal-add-sub", "decimal-mul-div", "decimal-compare", "recurring-decimals"],
    },
    {
        label: "Percentages",
        types: ["percentage-of-amount", "percentage-change", "reverse-percentages"],
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
    { label: "Algebra", types: ["equations", "equations-both-sides", "equations-fractions", "substitution", "collecting-like-terms", "expanding-brackets", "multiplying-terms", "factorising", "factorising-quadratics", "difference-of-two-squares", "simplify-algebraic-fractions"] },
    { label: "Ratio & Proportion", types: ["ratio-simplify"] },
    { label: "Number Theory", types: ["hcf-lcm", "rounding", "standard-form", "prime-factorization"] },
    { label: "Surds", types: ["simplify-surds", "surds-add-sub", "surds-expand", "surds-rationalise"] },
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
const dynamicOptions = document.getElementById("dynamic-options");
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
            renderOptions(getWorksheetType(type), options);
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

    // Problems grid
    const grid = document.createElement("div");
    grid.className = "problems-grid";

    problems.forEach((p, i) => {
        const item = document.createElement("div");
        item.className = "problem-item";

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

        // Answer box
        const answerBox = document.createElement("div");
        answerBox.className = "problem-answer-box";
        item.appendChild(answerBox);

        grid.appendChild(item);
    });

    output.appendChild(grid);

    // Answer key section
    const answerDiv = document.createElement("div");
    answerDiv.style.marginTop = "30px";
    answerDiv.innerHTML = "<h3>Answer Key</h3>";

    const answerList = document.createElement("ol");
    problems.forEach((p) => {
        const li = document.createElement("li");
        const prefix = p.answerPrefix || "";
        if (p.answerKeyHtml) {
            li.innerHTML = p.answerKeyHtml;
        } else if (p.answerHtml) {
            li.innerHTML = `${prefix}${p.answerHtml}`;
        } else {
            li.innerHTML = `${prefix}${p.answer}`;
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
renderOptions(getWorksheetType(problemTypeSelect.value), {});

// Worksheet search functionality
function setupWorksheetSearch() {
    const searchInput = document.getElementById("worksheet-search");
    const searchResults = document.getElementById("worksheet-search-results");

    if (!searchInput || !searchResults) return;

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (!query) {
            searchResults.classList.remove("active");
            return;
        }

        // Filter worksheets by name and category
        const results = [];
        const categoryMap = new Map();

        WORKSHEET_GROUPS.forEach((group) => {
            group.types.forEach((typeId) => {
                const type = WORKSHEET_TYPES.find(t => t.id === typeId);
                if (type) {
                    if (
                        type.label.toLowerCase().includes(query) ||
                        type.id.toLowerCase().includes(query)
                    ) {
                        results.push({ type, category: group.label });
                    }
                }
            });
        });

        // Render search results
        if (results.length === 0) {
            searchResults.innerHTML = '<div style="padding: 12px; color: #999; text-align: center;">No worksheets found</div>';
            searchResults.classList.add("active");
            return;
        }

        searchResults.innerHTML = results
            .map((result) => `
                <div class="worksheet-search-result-item" data-value="${result.type.id}">
                    <div>${result.type.label}</div>
                    <div class="worksheet-search-result-category">${result.category}</div>
                </div>
            `)
            .join("");

        searchResults.classList.add("active");

        // Add click handlers
        searchResults.querySelectorAll(".worksheet-search-result-item").forEach((item) => {
            item.addEventListener("click", () => {
                const value = item.getAttribute("data-value");
                problemTypeSelect.value = value;
                searchInput.value = "";
                searchResults.classList.remove("active");

                // Trigger change event
                problemTypeSelect.dispatchEvent(new Event("change"));
                renderOptions(getWorksheetType(value), {});
            });
        });
    });

    // Close search results when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove("active");
        }
    });
}

setupWorksheetSearch();

function readOptionsFromUI(type) {
    const worksheetType = getWorksheetType(type);
    if (!worksheetType || !Array.isArray(worksheetType.options)) return {};

    const options = {};
    worksheetType.options.forEach((opt) => {
        const el = dynamicOptions.querySelector(`[data-option-id="${opt.id}"]`);
        if (!el) return;
        if (opt.type === "checkbox") {
            options[opt.id] = el.checked;
        } else {
            options[opt.id] = el.value;
        }
    });
    return options;
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

function renderOptions(worksheetType, options) {
    dynamicOptions.innerHTML = "";
    if (!worksheetType || !Array.isArray(worksheetType.options)) return;

    worksheetType.options.forEach((opt) => {
        const group = document.createElement("div");
        group.className = "options-group";

        if (opt.type === "checkbox") {
            const label = document.createElement("label");
            label.className = "inline-option";

            const input = document.createElement("input");
            input.type = "checkbox";
            input.dataset.optionId = opt.id;
            input.checked =
                options[opt.id] !== undefined ? options[opt.id] : !!opt.default;
            input.addEventListener("change", clearIdOnSettingsChange);

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${opt.label}`));
            group.appendChild(label);
        } else if (opt.type === "select") {
            const label = document.createElement("label");
            label.textContent = opt.label;
            group.appendChild(label);

            const select = document.createElement("select");
            select.dataset.optionId = opt.id;
            opt.values.forEach((v) => {
                const option = document.createElement("option");
                option.value = v.value;
                option.textContent = v.label;
                select.appendChild(option);
            });
            select.value =
                options[opt.id] !== undefined ? options[opt.id] : opt.default;
            select.addEventListener("change", clearIdOnSettingsChange);
            group.appendChild(select);
        }

        dynamicOptions.appendChild(group);
    });
}

problemTypeSelect.addEventListener("change", () => {
    renderOptions(getWorksheetType(problemTypeSelect.value), {});
    clearIdOnSettingsChange();
});

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
