const generateBtn = document.getElementById("generate-btn");
const printBtn = document.getElementById("print-btn");
const toggleAnswersBtn = document.getElementById("toggle-answers-btn");
const output = document.getElementById("worksheet-output");

let answerDivGlobal; // store reference to answer key for toggling

const worksheetIdInput = document.getElementById("worksheet-id");
const generatedIdText = document.getElementById("generated-id-text");

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

function generateWorksheet() {
    // Determine seed
    let id = worksheetIdInput.value;
    if (!id) {
        id = Math.random().toString(36).substring(2, 10); // random 8-char ID
        worksheetIdInput.value = id;
    }
    generatedIdText.textContent = `Worksheet ID: ${id}`;

    const seed = stringToSeed(id);
    const rand = mulberry32(seed); // deterministic RNG function

    const type = document.getElementById("problem-type").value;
    const difficulty = document.getElementById("difficulty").value;
    const numProblems = parseInt(document.getElementById("num-problems").value);

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
        cell1.textContent = `${i + 1}. ${p.a} ${symbol(p.type)} ${p.b} = `;
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
