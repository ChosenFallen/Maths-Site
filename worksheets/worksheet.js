const generateBtn = document.getElementById("generate-btn");
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

function buildWorksheetId(baseId, type, difficulty, numProblems) {
    return `${baseId}|${type}|${difficulty}|${numProblems}`;
}

function parseWorksheetId(id) {
    const parts = id.split("|");
    if (parts.length !== 4) return null;
    const [baseId, type, difficulty, numProblemsRaw] = parts;
    const numProblems = parseInt(numProblemsRaw, 10);
    if (!baseId || Number.isNaN(numProblems)) return null;
    return { baseId, type, difficulty, numProblems };
}

function generateWorksheet() {
    // Determine seed
    let id = worksheetIdInput.value.trim();
    let type = problemTypeSelect.value;
    let difficulty = difficultySelect.value;
    let numProblems = parseInt(numProblemsInput.value);

    if (!id) {
        const baseId = Math.random().toString(36).substring(2, 10); // random 8-char ID
        id = buildWorksheetId(baseId, type, difficulty, numProblems);
    } else {
        const parsed = parseWorksheetId(id);
        if (parsed) {
            type = parsed.type;
            difficulty = parsed.difficulty;
            numProblems = parsed.numProblems;
            problemTypeSelect.value = type;
            difficultySelect.value = difficulty;
            numProblemsInput.value = numProblems;
        } else {
            id = buildWorksheetId(id, type, difficulty, numProblems);
        }
    }

    worksheetIdInput.value = id;
    generatedIdText.textContent = `Worksheet ID: ${id}`;
    copyStatus.textContent = "";
    setActionButtonsEnabled(true);

    const seed = stringToSeed(id);
    const rand = mulberry32(seed); // deterministic RNG function

    const problems = [];

    for (let i = 0; i < numProblems; i++) {
        let a, b;

        switch (difficulty) {
            case "easy":
                a = Math.floor(rand() * 10) + 1;
                b = Math.floor(rand() * 10) + 1;
                break;
            case "normal":
                a = Math.floor(rand() * 50) + 1;
                b = Math.floor(rand() * 50) + 1;
                break;
            case "hard":
                a = Math.floor(rand() * 100) + 1;
                b = Math.floor(rand() * 100) + 1;
                break;
        }

        if (type === "division") {
            b = Math.max(1, b);
            a = a * b;
        }
        if (type === "subtraction" && a < b) {
            const temp = a;
            a = b;
            b = temp;
        }

        const answer = calculateAnswer(a, b, type);
        problems.push({ a, b, type, answer });
    }

    renderWorksheet(problems);
}

function calculateAnswer(a, b, type) {
    switch (type) {
        case "addition":
            return a + b;
        case "subtraction":
            return a - b;
        case "multiplication":
            return a * b;
        case "division":
            return a / b;
    }
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
        cell1.textContent = `${i + 1}) ${p.a} ${symbol(p.type)} ${p.b} = `;
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
        li.textContent = `${p.a} ${symbol(p.type)} ${p.b} = ${p.answer}`;
        answerList.appendChild(li);
    });

    answerDiv.appendChild(answerList);
    answerDiv.classList.add("answers");
    answerDiv.style.display = "none"; // hidden on screen
    output.appendChild(answerDiv);

    answerDivGlobal = answerDiv; // store for toggle button
}

function symbol(type) {
    switch (type) {
        case "addition":
            return "+";
        case "subtraction":
            return "−";
        case "multiplication":
            return "×";
        case "division":
            return "÷";
    }
}

// Event listeners
generateBtn.addEventListener("click", generateWorksheet);
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
