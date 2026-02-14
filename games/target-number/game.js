// Game settings
let selectedLargeCount = 0;
let selectedDifficulty = "normal";

// Game state
let currentRound = 1;
let score = 0;
let roundsCompleted = 0;
let successfulRounds = 0;
let targetNumber = 0;
let availableNumbers = [];
let usedNumberIndices = [];
let expression = [];
let timerInterval = null;
let timeLeft = 0;

// UI elements
const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverText = document.getElementById("game-over-text");
const highScoresBox = document.getElementById("high-scores");
const scoresList = document.getElementById("scores-list");
const startBtn = document.getElementById("start-btn");
const finishBtn = document.getElementById("finish-btn");

// Difficulty settings
const difficultySettings = {
    easy: { targetMin: 10, targetMax: 50, timeLimit: 60 },
    normal: { targetMin: 100, targetMax: 500, timeLimit: 45 },
    hard: { targetMin: 100, targetMax: 999, timeLimit: 30 },
};

// Large and small number pools
const largeNumbers = [25, 50, 75, 100];
const smallNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Menu button handlers
document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const parent = btn.parentElement;
        parent.querySelectorAll(".option-btn").forEach((b) =>
            b.classList.remove("active"),
        );
        btn.classList.add("active");

        if (btn.dataset.large !== undefined)
            selectedLargeCount = parseInt(btn.dataset.large);
        if (btn.dataset.difficulty) selectedDifficulty = btn.dataset.difficulty;
    });
});

startBtn.addEventListener("click", startGame);
finishBtn.addEventListener("click", () => endGame(true));

// Utility function
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startGame() {
    currentRound = 1;
    score = 0;
    roundsCompleted = 0;
    successfulRounds = 0;

    menuScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameOverText.classList.add("hidden");

    startRound();
}

function startRound() {
    // Reset round state
    usedNumberIndices = [];
    expression = [];

    // Generate numbers
    generateNumbers();

    // Generate target
    const settings = difficultySettings[selectedDifficulty];
    targetNumber = randInt(settings.targetMin, settings.targetMax);
    document.getElementById("target").textContent = targetNumber;

    // Update UI
    updateRoundDisplay();
    updateScoreDisplay();
    updateExpressionDisplay();
    renderNumberButtons();

    // Reset feedback
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").className = "feedback";

    // Start timer
    timeLeft = settings.timeLimit;
    startTimer();
}

function generateNumbers() {
    availableNumbers = [];

    // Get large numbers
    const shuffledLarge = shuffle(largeNumbers);
    for (let i = 0; i < selectedLargeCount; i++) {
        availableNumbers.push(shuffledLarge[i]);
    }

    // Get small numbers
    const smallCount = 6 - selectedLargeCount;
    const shuffledSmall = shuffle(smallNumbers);
    for (let i = 0; i < smallCount; i++) {
        availableNumbers.push(shuffledSmall[i]);
    }

    // Shuffle the final array
    availableNumbers = shuffle(availableNumbers);
}

function renderNumberButtons() {
    const numbersGrid = document.getElementById("numbers-grid");
    numbersGrid.innerHTML = "";

    availableNumbers.forEach((num, index) => {
        const btn = document.createElement("button");
        btn.className = "number-btn";
        btn.textContent = num;
        btn.dataset.index = index;
        btn.addEventListener("click", () => addNumber(index));
        numbersGrid.appendChild(btn);
    });

    updateNumberButtons();
}

function updateNumberButtons() {
    document.querySelectorAll(".number-btn").forEach((btn) => {
        const index = parseInt(btn.dataset.index);
        btn.disabled = usedNumberIndices.includes(index);
    });
}

function startTimer() {
    const timerDisplay = document.getElementById("timer-display");
    timerDisplay.textContent = `⏱️ ${timeLeft}s`;
    timerDisplay.style.color = "";

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `⏱️ ${timeLeft}s`;

        if (timeLeft <= 10) {
            timerDisplay.style.color = "#f44336";
        }

        if (timeLeft <= 0) {
            endRound(false);
        }
    }, 1000);
}

function updateRoundDisplay() {
    document.getElementById("round").textContent = currentRound;
}

function updateScoreDisplay() {
    document.getElementById("score").textContent = score;
}

function updateExpressionDisplay() {
    const expressionDiv = document.getElementById("expression");
    const expressionValueSpan = document.getElementById("expression-value");

    if (expression.length === 0) {
        expressionDiv.textContent = "Click numbers and operations";
        expressionValueSpan.textContent = "?";
        return;
    }

    // Format expression with spaces
    expressionDiv.textContent = expression.join(" ");

    // Try to evaluate
    const result = evaluateExpression();
    if (result !== null) {
        expressionValueSpan.textContent = result;
    } else {
        expressionValueSpan.textContent = "?";
    }
}

// Expression building
function addNumber(index) {
    // Check if we should add a number (can't have two numbers in a row without an operator)
    if (expression.length > 0) {
        const last = expression[expression.length - 1];
        // If last element is a number or closing paren, we need an operator first
        if (!isOperator(last) && last !== "(") {
            return;
        }
    }

    expression.push(availableNumbers[index]);
    usedNumberIndices.push(index);
    updateNumberButtons();
    updateExpressionDisplay();
}

// Add operation buttons event listeners
document.querySelectorAll(".op-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        addOperation(btn.dataset.op);
    });
});

function addOperation(op) {
    // Opening parenthesis can go at start or after an operator or opening paren
    if (op === "(") {
        if (expression.length === 0) {
            expression.push(op);
            updateExpressionDisplay();
            return;
        }
        const last = expression[expression.length - 1];
        if (isOperator(last) || last === "(") {
            expression.push(op);
            updateExpressionDisplay();
        }
        return;
    }

    // Closing parenthesis needs matching opening paren
    if (op === ")") {
        if (canAddClosingParen()) {
            expression.push(op);
            updateExpressionDisplay();
        }
        return;
    }

    // Regular operators need a number or closing paren before them
    if (expression.length === 0) return;

    const last = expression[expression.length - 1];
    if (typeof last === "number" || last === ")") {
        expression.push(op);
        updateExpressionDisplay();
    }
}

function isOperator(item) {
    return ["+", "−", "×", "÷"].includes(item);
}

function canAddClosingParen() {
    let openCount = 0;
    let closeCount = 0;

    for (const item of expression) {
        if (item === "(") openCount++;
        if (item === ")") closeCount++;
    }

    // Can only add closing paren if there are more opens than closes
    // and the last element is a number or closing paren
    if (openCount <= closeCount) return false;

    const last = expression[expression.length - 1];
    return typeof last === "number" || last === ")";
}

function evaluateExpression() {
    if (expression.length === 0) return null;

    try {
        // Build JavaScript expression
        const jsExpr = expression
            .map((item) => {
                if (item === "×") return "*";
                if (item === "÷") return "/";
                if (item === "−") return "-";
                return item;
            })
            .join(" ");

        // Check for balanced parentheses
        let parenCount = 0;
        for (const item of expression) {
            if (item === "(") parenCount++;
            if (item === ")") parenCount--;
            if (parenCount < 0) return null;
        }
        if (parenCount !== 0) return null;

        // Evaluate
        const result = new Function("return " + jsExpr)();

        // Check for valid result
        if (!isFinite(result)) return null;

        return Math.round(result * 100) / 100; // Round to 2 decimal places
    } catch {
        return null;
    }
}

// Action buttons
document.getElementById("undo-btn").addEventListener("click", () => {
    if (expression.length === 0) return;

    const removed = expression.pop();

    // If it was a number, mark it as available again
    if (typeof removed === "number") {
        const index = availableNumbers.indexOf(removed);
        const usedIndex = usedNumberIndices.indexOf(index);
        if (usedIndex !== -1) {
            usedNumberIndices.splice(usedIndex, 1);
        }
        updateNumberButtons();
    }

    updateExpressionDisplay();
});

document.getElementById("clear-btn").addEventListener("click", () => {
    expression = [];
    usedNumberIndices = [];
    updateNumberButtons();
    updateExpressionDisplay();
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").className = "feedback";
});

document.getElementById("submit-btn").addEventListener("click", () => {
    const result = evaluateExpression();

    if (result === null) {
        showFeedback("Invalid expression!", "wrong");
        return;
    }

    roundsCompleted++;

    if (result === targetNumber) {
        // Correct!
        score += 10;
        successfulRounds++;
        showFeedback(`🎉 Correct! +10 points`, "correct");

        // Animate score
        const scoreSpan = document.getElementById("score");
        scoreSpan.classList.add("score-animation");
        setTimeout(() => scoreSpan.classList.remove("score-animation"), 500);

        updateScoreDisplay();

        // Next round after delay
        setTimeout(() => {
            currentRound++;
            startRound();
        }, 1500);
    } else {
        // Wrong
        showFeedback(
            `Not quite! You got ${result}, target was ${targetNumber}`,
            "wrong",
        );

        // Shake target
        const target = document.getElementById("target");
        target.classList.add("shake");
        setTimeout(() => target.classList.remove("shake"), 400);
    }
});

function showFeedback(message, type) {
    const feedback = document.getElementById("feedback");
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

function endRound(timeout = true) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    roundsCompleted++;

    if (timeout) {
        showFeedback(
            `⏱️ Time's up! Target was ${targetNumber}`,
            "timeout",
        );
    }

    // Move to next round or end game after delay
    setTimeout(() => {
        const shouldContinue = Math.random() > 0.3; // 70% chance to continue (or add specific logic)

        // For now, after 5 rounds or timeout, end the game
        if (currentRound >= 5 || timeout) {
            endGame(false);
        } else {
            currentRound++;
            startRound();
        }
    }, 2000);
}

function endGame(manualFinish = false) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const accuracy =
        roundsCompleted > 0
            ? Math.round((successfulRounds / roundsCompleted) * 100)
            : 0;

    // Save high score
    saveHighScore();

    const message = `Game Over! 🎯\n\nScore: ${score}\nRounds: ${roundsCompleted}\nSuccessful: ${successfulRounds}\nAccuracy: ${accuracy}%`;

    gameOverText.textContent = message;
    gameOverText.classList.remove("hidden");

    updateHighScoresDisplay();

    // Return to menu after delay
    const delay = manualFinish ? 1200 : 2500;

    setTimeout(() => {
        gameScreen.classList.add("hidden");
        menuScreen.classList.remove("hidden");
    }, delay);
}

function saveHighScore() {
    const key = `target-number-${selectedDifficulty}`;
    const existingScores = JSON.parse(localStorage.getItem(key) || "[]");

    const accuracy =
        roundsCompleted > 0
            ? Math.round((successfulRounds / roundsCompleted) * 100)
            : 0;

    existingScores.push({
        score: score,
        rounds: roundsCompleted,
        successful: successfulRounds,
        accuracy: accuracy,
        date: new Date().toISOString(),
    });

    // Sort by score (descending) and keep top 5
    existingScores.sort((a, b) => b.score - a.score);
    const topScores = existingScores.slice(0, 5);

    localStorage.setItem(key, JSON.stringify(topScores));
}

function updateHighScoresDisplay() {
    const allScores = [];

    ["easy", "normal", "hard"].forEach((diff) => {
        const key = `target-number-${diff}`;
        const scores = JSON.parse(localStorage.getItem(key) || "[]");

        scores.forEach((s) => {
            allScores.push({
                difficulty: diff,
                ...s,
            });
        });
    });

    if (allScores.length === 0) {
        highScoresBox.classList.add("hidden");
        return;
    }

    // Sort by score and take top 5
    allScores.sort((a, b) => b.score - a.score);

    scoresList.innerHTML = allScores
        .slice(0, 5)
        .map(
            (s) =>
                `<p>🎯 ${capitalizeFirst(s.difficulty)}: ${s.score} pts (${s.successful}/${s.rounds} - ${s.accuracy}%)</p>`,
        )
        .join("");

    highScoresBox.classList.remove("hidden");
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize
updateHighScoresDisplay();

// Prevent right-click menu
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});
