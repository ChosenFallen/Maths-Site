// Game settings
let selectedMode = "buzzer";
let selectedDifficulty = "normal";
let totalQuestions = 10;
let isKeyboardMode = false;

// Game state
let gamepads = [];
let numPlayers = 0;
let playerReady = [];
let currentQuestion = 1;
let currentQuestionData = null;
let playerScores = [];
let playerCorrect = [];
let playerAnswers = [];
let activePlayers = [];

// Buzzer mode state
let buzzerPressed = false;
let activePlayer = -1;

// All-answer mode state
let timerInterval = null;
let timeLeft = 0;
let allAnswered = false;

// Button state tracking for debouncing
let previousButtonStates = [];

// UI elements
const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const resultsScreen = document.getElementById("results-screen");
const startBtn = document.getElementById("start-btn");
const keyboardModeBtn = document.getElementById("keyboard-mode-btn");
const playAgainBtn = document.getElementById("play-again-btn");

// Difficulty settings
const difficultySettings = {
    easy: {
        addition: { min: 1, max: 10 },
        subtraction: { min: 1, max: 10 },
        multiplication: { min: 1, max: 5 },
        division: { min: 1, max: 5 },
    },
    normal: {
        addition: { min: 1, max: 50 },
        subtraction: { min: 1, max: 50 },
        multiplication: { min: 2, max: 12 },
        division: { min: 2, max: 12 },
    },
    hard: {
        addition: { min: 10, max: 100 },
        subtraction: { min: 10, max: 100 },
        multiplication: { min: 5, max: 20 },
        division: { min: 5, max: 20 },
    },
};

const operations = ["addition", "subtraction", "multiplication", "division"];

// Player colors
const playerColors = [
    { bg: "#ffebee", text: "#d32f2f", border: "#d32f2f", name: "Red" },
    { bg: "#e3f2fd", text: "#1976d2", border: "#1976d2", name: "Blue" },
    { bg: "#e8f5e9", text: "#388e3c", border: "#388e3c", name: "Green" },
    { bg: "#fffde7", text: "#f57f17", border: "#f57f17", name: "Yellow" },
];

// Utility functions
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

// Menu button handlers
document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const parent = btn.parentElement;
        parent.querySelectorAll(".option-btn").forEach((b) =>
            b.classList.remove("active"),
        );
        btn.classList.add("active");

        if (btn.dataset.mode) selectedMode = btn.dataset.mode;
        if (btn.dataset.difficulty) selectedDifficulty = btn.dataset.difficulty;
        if (btn.dataset.questions)
            totalQuestions = parseInt(btn.dataset.questions);
    });
});

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", resetToSetup);
keyboardModeBtn.addEventListener("click", enableKeyboardMode);

// Controller detection
function updateControllerStatus() {
    const gps = navigator.getGamepads();
    gamepads = Array.from(gps).filter((gp) => gp !== null);
    numPlayers = gamepads.length;

    const countDiv = document.getElementById("controller-count");

    if (isKeyboardMode) {
        countDiv.textContent = "Keyboard Mode (2-4 Players)";
        countDiv.style.color = "#ff9800";
        startBtn.disabled = false;
        startBtn.textContent = "Start Game";
        updatePlayerReadyDisplay();
    } else if (numPlayers >= 2 && numPlayers <= 4) {
        countDiv.textContent = `${numPlayers} Controller${numPlayers > 1 ? "s" : ""}`;
        countDiv.style.color = "#4caf50";
        startBtn.disabled = false;
        startBtn.textContent = "Start Game";
        updatePlayerReadyDisplay();
    } else if (numPlayers === 1) {
        countDiv.textContent = "1 Controller (Need 2-4)";
        countDiv.style.color = "#ff9800";
        startBtn.disabled = true;
        startBtn.textContent = "Connect more controllers";
    } else {
        countDiv.textContent = "No Controllers";
        countDiv.style.color = "#f44336";
        startBtn.disabled = true;
        startBtn.textContent = "Waiting for controllers...";
    }

    // Initialize button states
    if (previousButtonStates.length !== numPlayers) {
        previousButtonStates = [];
        for (let i = 0; i < numPlayers; i++) {
            previousButtonStates[i] = [];
        }
    }
}

function updatePlayerReadyDisplay() {
    const section = document.getElementById("player-ready-section");
    const list = document.getElementById("player-ready-list");

    const count = isKeyboardMode ? 4 : numPlayers;

    if (count < 2) {
        section.classList.add("hidden");
        return;
    }

    section.classList.remove("hidden");
    list.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const item = document.createElement("div");
        item.className = `player-ready-item player-${i} ${playerReady[i] ? "ready" : "not-ready"}`;
        item.textContent = `Player ${i + 1} ${playerReady[i] ? "✓" : "○"}`;
        list.appendChild(item);
    }
}

function enableKeyboardMode() {
    isKeyboardMode = true;
    numPlayers = 4; // Default to 4 players for keyboard
    playerReady = [false, false, false, false];
    updateControllerStatus();
}

// Gamepad events
window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected:", e.gamepad);
    updateControllerStatus();
});

window.addEventListener("gamepaddisconnected", (e) => {
    console.log("Gamepad disconnected:", e.gamepad);
    updateControllerStatus();
});

// Start game
function startGame() {
    const count = isKeyboardMode ? 4 : numPlayers;

    if (count < 2 || count > 4) {
        alert("Connect 2-4 Buzz controllers to play, or use keyboard mode");
        return;
    }

    // Initialize game state
    currentQuestion = 1;
    playerScores = new Array(count).fill(0);
    playerCorrect = new Array(count).fill(0);
    playerAnswers = new Array(count).fill(null);
    activePlayers = Array.from({ length: count }, (_, i) => i);

    setupScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    resultsScreen.classList.add("hidden");

    setupPlayerPanels();
    startRound();

    if (!isKeyboardMode) {
        startGamepadPolling();
    }
}

function setupPlayerPanels() {
    const panelsContainer = document.getElementById("player-panels");
    panelsContainer.innerHTML = "";

    for (let i = 0; i < activePlayers.length; i++) {
        const panel = document.createElement("div");
        panel.className = `player-panel player-${i}`;
        panel.style.background = playerColors[i].bg;
        panel.style.color = playerColors[i].text;
        panel.style.borderColor = playerColors[i].border;

        panel.innerHTML = `
            <div class="player-name">Player ${i + 1}</div>
            <div class="player-score">${playerScores[i]}</div>
            <div class="player-status"></div>
            <div class="answer-indicator"></div>
        `;

        panelsContainer.appendChild(panel);
    }
}

function startRound() {
    // Reset round state
    playerAnswers = new Array(activePlayers.length).fill(null);
    buzzerPressed = false;
    activePlayer = -1;
    allAnswered = false;

    // Update question number
    document.getElementById("question-num").textContent = currentQuestion;
    document.getElementById("total-questions").textContent = totalQuestions;

    // Generate question
    generateQuestion();

    // Clear player statuses
    document.querySelectorAll(".player-panel").forEach((panel) => {
        panel.classList.remove("active", "correct", "wrong");
        panel.querySelector(".player-status").textContent = "";
        panel.querySelector(".answer-indicator").textContent = "";
    });

    // Clear answer highlights
    document.querySelectorAll(".answer-option").forEach((opt) => {
        opt.classList.remove("correct", "wrong", "selected");
    });

    // Set up mode-specific UI
    if (selectedMode === "buzzer") {
        setupBuzzerMode();
    } else {
        setupAllAnswerMode();
    }
}

// Question generation
function generateQuestion() {
    const operation = operations[randInt(0, operations.length - 1)];
    const settings = difficultySettings[selectedDifficulty][operation];

    let num1, num2, correctAnswer, questionText, symbol;

    switch (operation) {
        case "addition":
            num1 = randInt(settings.min, settings.max);
            num2 = randInt(settings.min, settings.max);
            correctAnswer = num1 + num2;
            symbol = "+";
            break;
        case "subtraction":
            num1 = randInt(settings.min, settings.max);
            num2 = randInt(settings.min, num1);
            correctAnswer = num1 - num2;
            symbol = "−";
            break;
        case "multiplication":
            num1 = randInt(settings.min, settings.max);
            num2 = randInt(settings.min, settings.max);
            correctAnswer = num1 * num2;
            symbol = "×";
            break;
        case "division":
            num2 = randInt(settings.min, settings.max);
            correctAnswer = randInt(settings.min, settings.max);
            num1 = num2 * correctAnswer;
            symbol = "÷";
            break;
    }

    questionText = `${num1} ${symbol} ${num2}`;

    // Generate wrong answers
    const wrongAnswers = generateWrongAnswers(correctAnswer, operation);
    const allAnswers = shuffle([correctAnswer, ...wrongAnswers]);

    currentQuestionData = {
        question: questionText,
        answers: allAnswers,
        correctIndex: allAnswers.indexOf(correctAnswer),
        correctAnswer: correctAnswer,
    };

    // Display question
    document.getElementById("question-text").textContent = questionText + " = ?";

    // Display answers
    allAnswers.forEach((answer, index) => {
        document.getElementById(`answer-${index}`).textContent = answer;
    });
}

function generateWrongAnswers(correct, operation) {
    const wrong = new Set();

    // Strategy 1: Off by a small amount
    wrong.add(correct + randInt(1, 5));
    wrong.add(correct - randInt(1, 5));

    // Strategy 2: Common mistakes
    if (operation === "multiplication") {
        wrong.add(correct + randInt(5, 10));
    } else if (operation === "division") {
        wrong.add(correct + 1);
        wrong.add(correct - 1);
    }

    // Strategy 3: Random nearby values
    while (wrong.size < 10) {
        const offset = randInt(-10, 10);
        if (offset !== 0) {
            wrong.add(correct + offset);
        }
    }

    // Remove negative answers and the correct answer
    const validWrong = Array.from(wrong).filter((a) => a > 0 && a !== correct);

    // Return 3 random wrong answers
    return shuffle(validWrong).slice(0, 3);
}

// Buzzer mode
function setupBuzzerMode() {
    const statusDiv = document.getElementById("game-status");
    statusDiv.textContent = "🔴 First to buzz in!";
    statusDiv.className = "game-status buzzer-waiting";

    const timerContainer = document.getElementById("timer-container");
    timerContainer.classList.add("hidden");
}

function handleBuzzerPress(playerIndex) {
    if (selectedMode !== "buzzer") return;
    if (buzzerPressed) return;

    buzzerPressed = true;
    activePlayer = playerIndex;

    // Highlight active player
    const panels = document.querySelectorAll(".player-panel");
    panels[playerIndex].classList.add("active", "buzz-animation");

    panels[playerIndex].querySelector(".player-status").textContent = "Your turn!";

    // Update status
    const statusDiv = document.getElementById("game-status");
    statusDiv.textContent = `Player ${playerIndex + 1} buzzed in! Select your answer...`;
    statusDiv.className = "game-status buzzer-locked";
}

function handleBuzzerAnswer(playerIndex, answerIndex) {
    if (selectedMode !== "buzzer") return;
    if (!buzzerPressed || playerIndex !== activePlayer) return;
    if (playerAnswers[playerIndex] !== null) return;

    playerAnswers[playerIndex] = answerIndex;

    checkBuzzerAnswer(playerIndex, answerIndex);
}

function checkBuzzerAnswer(playerIndex, answerIndex) {
    const isCorrect = answerIndex === currentQuestionData.correctIndex;

    // Highlight answer
    const answerOptions = document.querySelectorAll(".answer-option");
    answerOptions[answerIndex].classList.add(
        isCorrect ? "correct" : "wrong",
    );
    answerOptions[currentQuestionData.correctIndex].classList.add("correct");

    // Update player panel
    const panel = document.querySelectorAll(".player-panel")[playerIndex];
    panel.classList.remove("active");
    panel.classList.add(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
        playerScores[playerIndex] += 10;
        playerCorrect[playerIndex]++;
        panel.querySelector(".player-status").textContent = "✓ Correct!";
        panel.querySelector(".answer-indicator").textContent = "✓";
    } else {
        panel.querySelector(".player-status").textContent = "✗ Wrong";
        panel.querySelector(".answer-indicator").textContent = "✗";
    }

    // Update score display
    panel.querySelector(".player-score").textContent = playerScores[playerIndex];

    // Next round after delay
    setTimeout(() => {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            startRound();
        } else {
            endGame();
        }
    }, 2000);
}

// All-answer mode
function setupAllAnswerMode() {
    const statusDiv = document.getElementById("game-status");
    statusDiv.textContent = "Select your answers!";
    statusDiv.className = "game-status";

    const timerContainer = document.getElementById("timer-container");
    timerContainer.classList.remove("hidden");

    timeLeft = 15;
    startTimer();
}

function startTimer() {
    const timerBar = document.getElementById("timer-bar");
    const timerText = document.getElementById("timer-text");

    timerBar.style.width = "100%";
    timerBar.classList.remove("warning", "danger");
    timerText.textContent = `${timeLeft}s`;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = `${timeLeft}s`;

        const percentage = (timeLeft / 15) * 100;
        timerBar.style.width = percentage + "%";

        if (timeLeft <= 5) {
            timerBar.classList.add("danger");
        } else if (timeLeft <= 10) {
            timerBar.classList.add("warning");
        }

        if (timeLeft <= 0 || allAnswered) {
            clearInterval(timerInterval);
            timerInterval = null;
            revealAnswers();
        }
    }, 1000);
}

function handleAllAnswer(playerIndex, answerIndex) {
    if (selectedMode !== "all-answer") return;
    if (playerAnswers[playerIndex] !== null) return;

    playerAnswers[playerIndex] = answerIndex;

    // Show checkmark
    const panel = document.querySelectorAll(".player-panel")[playerIndex];
    panel.querySelector(".answer-indicator").textContent = "✓";
    panel.querySelector(".player-status").textContent = "Answered";

    // Check if all answered
    allAnswered = playerAnswers.every((a) => a !== null);
    if (allAnswered && timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        setTimeout(revealAnswers, 500);
    }
}

function revealAnswers() {
    // Highlight correct answer
    const answerOptions = document.querySelectorAll(".answer-option");
    answerOptions[currentQuestionData.correctIndex].classList.add("correct");

    // Check each player's answer
    playerAnswers.forEach((answerIndex, playerIndex) => {
        if (answerIndex === null) return;

        const isCorrect = answerIndex === currentQuestionData.correctIndex;
        const panel = document.querySelectorAll(".player-panel")[playerIndex];

        panel.classList.add(isCorrect ? "correct" : "wrong");

        if (isCorrect) {
            playerScores[playerIndex] += 10;
            playerCorrect[playerIndex]++;
            panel.querySelector(".player-status").textContent = "✓ Correct!";
            panel.querySelector(".answer-indicator").textContent = "✓";
        } else {
            panel.querySelector(".player-status").textContent = "✗ Wrong";
            panel.querySelector(".answer-indicator").textContent = "✗";
            answerOptions[answerIndex].classList.add("wrong");
        }

        panel.querySelector(".player-score").textContent =
            playerScores[playerIndex];
    });

    // Next round after delay
    setTimeout(() => {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            startRound();
        } else {
            endGame();
        }
    }, 3000);
}

// End game and show results
function endGame() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    gameScreen.classList.add("hidden");
    resultsScreen.classList.remove("hidden");

    displayResults();
    saveHighScore();
}

function displayResults() {
    const podium = document.getElementById("results-podium");
    const statsDiv = document.getElementById("results-stats");

    podium.innerHTML = "";

    // Create results with rankings
    const results = activePlayers.map((_, i) => ({
        playerIndex: i,
        score: playerScores[i],
        correct: playerCorrect[i],
    }));

    results.sort((a, b) => b.score - a.score);

    results.forEach((result, rank) => {
        const card = document.createElement("div");
        card.className = `result-card player-${result.playerIndex}`;
        card.style.background = playerColors[result.playerIndex].bg;
        card.style.color = playerColors[result.playerIndex].text;
        card.style.borderColor = playerColors[result.playerIndex].border;

        const accuracy = Math.round((result.correct / totalQuestions) * 100);

        card.innerHTML = `
            <div class="result-rank rank-${rank + 1}">${rank + 1}</div>
            <div class="result-player-name">Player ${result.playerIndex + 1}</div>
            <div class="result-score">${result.score}</div>
            <div class="result-stats">
                ${result.correct}/${totalQuestions} correct (${accuracy}%)
            </div>
        `;

        podium.appendChild(card);
    });

    // Winner announcement
    const winner = results[0];
    statsDiv.innerHTML = `
        <h3>🏆 Player ${winner.playerIndex + 1} Wins!</h3>
        <p>Final Score: ${winner.score} points</p>
        <p>Mode: ${selectedMode === "buzzer" ? "Buzzer Race" : "All Answer"}</p>
        <p>Difficulty: ${selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}</p>
    `;
}

function saveHighScore() {
    const key = `buzz-quiz-${selectedMode}-${selectedDifficulty}`;
    const existingScores = JSON.parse(localStorage.getItem(key) || "[]");

    existingScores.push({
        scores: playerScores,
        topScore: Math.max(...playerScores),
        date: new Date().toISOString(),
    });

    existingScores.sort((a, b) => b.topScore - a.topScore);
    const topScores = existingScores.slice(0, 5);

    localStorage.setItem(key, JSON.stringify(topScores));
}

function resetToSetup() {
    resultsScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");
    playerReady = [];
    updateControllerStatus();
}

// Gamepad polling
let pollingActive = false;

function startGamepadPolling() {
    if (pollingActive) return;
    pollingActive = true;
    pollGamepads();
}

function pollGamepads() {
    if (!pollingActive) return;

    const gps = navigator.getGamepads();

    for (let i = 0; i < activePlayers.length; i++) {
        const gp = gps[i];
        if (!gp) continue;

        // Initialize button state if needed
        if (!previousButtonStates[i]) {
            previousButtonStates[i] = [];
        }

        // Check buzzer button (button 4 or higher index buttons)
        // Try multiple button indices as different controllers may vary
        const buzzerButtons = [4, 5, 6, 7, 8, 9];
        for (const btnIndex of buzzerButtons) {
            if (gp.buttons[btnIndex]) {
                const pressed = gp.buttons[btnIndex].pressed;
                const wasPressedBefore = previousButtonStates[i][btnIndex];

                if (pressed && !wasPressedBefore) {
                    handleBuzzerPress(i);
                }

                previousButtonStates[i][btnIndex] = pressed;
            }
        }

        // Check colored answer buttons (0-3 for A, B, C, D)
        for (let b = 0; b < 4; b++) {
            if (gp.buttons[b]) {
                const pressed = gp.buttons[b].pressed;
                const wasPressedBefore = previousButtonStates[i][b];

                if (pressed && !wasPressedBefore) {
                    if (selectedMode === "buzzer") {
                        handleBuzzerAnswer(i, b);
                    } else {
                        handleAllAnswer(i, b);
                    }
                }

                previousButtonStates[i][b] = pressed;
            }
        }
    }

    requestAnimationFrame(pollGamepads);
}

// Keyboard fallback
document.addEventListener("keydown", (e) => {
    if (!isKeyboardMode) return;
    if (setupScreen.classList.contains("hidden") === false) return;

    const key = e.key.toLowerCase();

    // Player 1: Q/W/E/R for ABCD, Space for buzzer
    if (key === " ") {
        e.preventDefault();
        handleBuzzerPress(0);
    } else if (key === "q") handleAnswer(0, 0);
    else if (key === "w") handleAnswer(0, 1);
    else if (key === "e") handleAnswer(0, 2);
    else if (key === "r") handleAnswer(0, 3);
    // Player 2: U/I/O/P for ABCD, Enter for buzzer
    else if (key === "enter") {
        e.preventDefault();
        handleBuzzerPress(1);
    } else if (key === "u") handleAnswer(1, 0);
    else if (key === "i") handleAnswer(1, 1);
    else if (key === "o") handleAnswer(1, 2);
    else if (key === "p") handleAnswer(1, 3);
    // Player 3: A/S/D/F for ABCD, Shift for buzzer
    else if (key === "shift") {
        e.preventDefault();
        handleBuzzerPress(2);
    } else if (key === "a") handleAnswer(2, 0);
    else if (key === "s") handleAnswer(2, 1);
    else if (key === "d") handleAnswer(2, 2);
    else if (key === "f") handleAnswer(2, 3);
    // Player 4: J/K/L/; for ABCD, Ctrl for buzzer
    else if (key === "control") {
        e.preventDefault();
        handleBuzzerPress(3);
    } else if (key === "j") handleAnswer(3, 0);
    else if (key === "k") handleAnswer(3, 1);
    else if (key === "l") handleAnswer(3, 2);
    else if (key === ";") handleAnswer(3, 3);
});

function handleAnswer(playerIndex, answerIndex) {
    if (selectedMode === "buzzer") {
        handleBuzzerAnswer(playerIndex, answerIndex);
    } else {
        handleAllAnswer(playerIndex, answerIndex);
    }
}

// Initialize
updateControllerStatus();
setInterval(updateControllerStatus, 1000);

// Prevent right-click menu
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});
