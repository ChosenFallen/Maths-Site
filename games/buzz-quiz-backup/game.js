// Game settings
let selectedMode = "buzzer";
let selectedDifficulty = "normal";
let totalQuestions = 10;
let isKeyboardMode = false;
let isHubMode = false; // True if all controllers are in one gamepad

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
const endGameBtn = document.getElementById("end-game-btn");

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
endGameBtn.addEventListener("click", endGame);

// Controller detection
function updateControllerStatus() {
    const gps = navigator.getGamepads();
    gamepads = Array.from(gps).filter((gp) => gp !== null);

    const countDiv = document.getElementById("controller-count");

    if (isKeyboardMode) {
        countDiv.textContent = "Keyboard Mode (2-4 Players)";
        countDiv.style.color = "#ff9800";
        startBtn.disabled = false;
        startBtn.textContent = "Start Game";
        numPlayers = 4;
        updatePlayerReadyDisplay();
        return;
    }

    // Check for hub mode: single gamepad with 20 buttons (4 controllers × 5 buttons)
    if (gamepads.length === 1 && gamepads[0].buttons.length >= 20) {
        isHubMode = true;
        numPlayers = Math.min(4, Math.floor(gamepads[0].buttons.length / 5));
        countDiv.textContent = `Buzz Hub Detected (${numPlayers} Players)`;
        countDiv.style.color = "#4caf50";
        startBtn.disabled = false;
        startBtn.textContent = "Start Game";
        updatePlayerReadyDisplay();
    }
    // Check for separate gamepads (2-4 individual controllers)
    else if (gamepads.length >= 2 && gamepads.length <= 4) {
        isHubMode = false;
        numPlayers = gamepads.length;
        countDiv.textContent = `${numPlayers} Controller${numPlayers > 1 ? "s" : ""}`;
        countDiv.style.color = "#4caf50";
        startBtn.disabled = false;
        startBtn.textContent = "Start Game";
        updatePlayerReadyDisplay();
    }
    // Single gamepad but not enough buttons for hub mode
    else if (gamepads.length === 1) {
        isHubMode = false;
        numPlayers = 1;
        countDiv.textContent = "1 Controller (Need 2-4)";
        countDiv.style.color = "#ff9800";
        startBtn.disabled = true;
        startBtn.textContent = "Connect more controllers";
    }
    // No controllers
    else {
        isHubMode = false;
        numPlayers = 0;
        countDiv.textContent = "No Controllers";
        countDiv.style.color = "#f44336";
        startBtn.disabled = true;
        startBtn.textContent = "Waiting for controllers...";
    }

    // Initialize button states
    if (isHubMode && previousButtonStates.length === 0) {
        // For hub mode, track buttons for the single gamepad
        previousButtonStates = [[]];
    } else if (!isHubMode && previousButtonStates.length !== numPlayers) {
        previousButtonStates = [];
        for (let i = 0; i < numPlayers; i++) {
            previousButtonStates[i] = [];
        }
    }

    // Update start button state
    if (numPlayers >= 2 || isKeyboardMode) {
        updateStartButton();
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

    // Initialize playerReady array if needed
    if (playerReady.length !== count) {
        playerReady = new Array(count).fill(false);
    }

    for (let i = 0; i < count; i++) {
        const item = document.createElement("div");
        item.className = `player-ready-item player-${i} ${playerReady[i] ? "ready" : "not-ready"}`;
        item.textContent = `Player ${i + 1} ${playerReady[i] ? "✓" : "○"}`;
        list.appendChild(item);
    }

    // Update start button based on ready count
    updateStartButton();
}

function updateStartButton() {
    const readyCount = playerReady.filter(r => r).length;

    if (readyCount >= 2) {
        startBtn.disabled = false;
        startBtn.textContent = `Start Game (${readyCount} Players Ready)`;
    } else if (numPlayers >= 2 || isKeyboardMode) {
        startBtn.disabled = true;
        startBtn.textContent = `Need at least 2 ready players (${readyCount} ready)`;
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
    // Get only ready players
    const readyPlayerIndices = [];
    for (let i = 0; i < playerReady.length; i++) {
        if (playerReady[i]) {
            readyPlayerIndices.push(i);
        }
    }

    if (readyPlayerIndices.length < 2) {
        alert("At least 2 players must be ready to start!");
        return;
    }

    // activePlayers contains the original controller indices of ready players
    activePlayers = readyPlayerIndices;
    const count = activePlayers.length;

    // Initialize game state
    currentQuestion = 1;
    playerScores = new Array(count).fill(0);
    playerCorrect = new Array(count).fill(0);
    playerAnswers = new Array(count).fill(null);

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
        const controllerIndex = activePlayers[i]; // Original controller number
        const panel = document.createElement("div");
        panel.className = `player-panel player-${controllerIndex}`;
        panel.style.background = playerColors[controllerIndex].bg;
        panel.style.color = playerColors[controllerIndex].text;
        panel.style.borderColor = playerColors[controllerIndex].border;

        panel.innerHTML = `
            <div class="player-name">Player ${controllerIndex + 1}</div>
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
        const indicator = panel.querySelector(".answer-indicator");
        indicator.textContent = "";
        indicator.classList.remove("buzzer-active");
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

    // Show big pulsing red buzzer indicator
    panels[playerIndex].querySelector(".player-status").textContent = "🔴 Select your answer!";
    const indicator = panels[playerIndex].querySelector(".answer-indicator");
    indicator.textContent = "🔴";
    indicator.classList.add("buzzer-active");

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

    // Remove buzzer animation
    const indicator = panel.querySelector(".answer-indicator");
    indicator.classList.remove("buzzer-active");

    if (isCorrect) {
        playerScores[playerIndex] += 10;
        playerCorrect[playerIndex]++;
        panel.querySelector(".player-status").textContent = "✓ Correct!";
        indicator.textContent = "✓";
    } else {
        panel.querySelector(".player-status").textContent = "✗ Wrong";
        indicator.textContent = "✗";
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
    const results = activePlayers.map((controllerIndex, i) => ({
        controllerIndex: controllerIndex, // Original controller number
        activePlayerIndex: i, // Index in activePlayers array
        score: playerScores[i],
        correct: playerCorrect[i],
    }));

    results.sort((a, b) => b.score - a.score);

    results.forEach((result, rank) => {
        const card = document.createElement("div");
        card.className = `result-card player-${result.controllerIndex}`;
        card.style.background = playerColors[result.controllerIndex].bg;
        card.style.color = playerColors[result.controllerIndex].text;
        card.style.borderColor = playerColors[result.controllerIndex].border;

        const accuracy = Math.round((result.correct / totalQuestions) * 100);

        card.innerHTML = `
            <div class="result-rank rank-${rank + 1}">${rank + 1}</div>
            <div class="result-player-name">Player ${result.controllerIndex + 1}</div>
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
        <h3>🏆 Player ${winner.controllerIndex + 1} Wins!</h3>
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

// Setup screen polling for player ready status
let setupPollingActive = true;

function pollSetupGamepads() {
    if (!setupPollingActive) return;
    if (!setupScreen.classList.contains("hidden")) {
        const gps = navigator.getGamepads();

        if (isHubMode) {
            const gp = gps[0];
            if (gp) {
                // Initialize button state for hub mode
                if (!previousButtonStates[0]) {
                    previousButtonStates[0] = [];
                }

                for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
                    const buttonOffset = playerIndex * 5;
                    const buzzerBtnIndex = buttonOffset + 0; // Buzzer is button 0

                    if (gp.buttons[buzzerBtnIndex]) {
                        const pressed = gp.buttons[buzzerBtnIndex].pressed;
                        const wasPressedBefore = previousButtonStates[0][buzzerBtnIndex];

                        if (pressed && !wasPressedBefore) {
                            // Toggle ready status
                            playerReady[playerIndex] = !playerReady[playerIndex];
                            updatePlayerReadyDisplay();
                        }

                        previousButtonStates[0][buzzerBtnIndex] = pressed;
                    }
                }
            }
        } else if (!isKeyboardMode) {
            // Separate gamepad mode
            for (let i = 0; i < numPlayers; i++) {
                const gp = gps[i];
                if (!gp) continue;

                // Initialize button state if needed
                if (!previousButtonStates[i]) {
                    previousButtonStates[i] = [];
                }

                // Check for buzzer button press (try multiple indices)
                const buzzerButtons = [0, 4, 5, 6, 7, 8, 9];
                for (const btnIndex of buzzerButtons) {
                    if (gp.buttons[btnIndex]) {
                        const pressed = gp.buttons[btnIndex].pressed;
                        const wasPressedBefore = previousButtonStates[i][btnIndex];

                        if (pressed && !wasPressedBefore) {
                            // Toggle ready status
                            playerReady[i] = !playerReady[i];
                            updatePlayerReadyDisplay();
                            break; // Only process first buzzer button
                        }

                        previousButtonStates[i][btnIndex] = pressed;
                    }
                }
            }
        }
    }

    requestAnimationFrame(pollSetupGamepads);
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

    if (isHubMode) {
        // Hub mode: single gamepad with buttons mapped to players
        // Player 0: buttons 0-4, Player 1: buttons 5-9, Player 2: buttons 10-14, Player 3: buttons 15-19
        // Button mapping per player: 0=Buzzer, 1=Yellow(D), 2=Green(C), 3=Orange(B), 4=Blue(A)
        const gp = gps[0];
        if (!gp) {
            requestAnimationFrame(pollGamepads);
            return;
        }

        // Initialize button state if needed
        if (!previousButtonStates[0]) {
            previousButtonStates[0] = [];
        }

        for (let i = 0; i < activePlayers.length; i++) {
            const controllerIndex = activePlayers[i]; // Original controller number (0-3)
            const buttonOffset = controllerIndex * 5;

            // Check buzzer button (button 0 in each player's set)
            const buzzerBtnIndex = buttonOffset + 0;
            if (gp.buttons[buzzerBtnIndex]) {
                const pressed = gp.buttons[buzzerBtnIndex].pressed;
                const wasPressedBefore = previousButtonStates[0][buzzerBtnIndex];

                if (pressed && !wasPressedBefore) {
                    handleBuzzerPress(i); // i is the active player index
                }

                previousButtonStates[0][buzzerBtnIndex] = pressed;
            }

            // Check colored answer buttons
            // Map: Blue(btn 4)→A(0), Orange(btn 3)→B(1), Green(btn 2)→C(2), Yellow(btn 1)→D(3)
            const buttonMapping = [
                { btnOffset: 4, answerIndex: 0 }, // Blue → A
                { btnOffset: 3, answerIndex: 1 }, // Orange → B
                { btnOffset: 2, answerIndex: 2 }, // Green → C
                { btnOffset: 1, answerIndex: 3 }, // Yellow → D
            ];

            for (const mapping of buttonMapping) {
                const btnIndex = buttonOffset + mapping.btnOffset;
                if (gp.buttons[btnIndex]) {
                    const pressed = gp.buttons[btnIndex].pressed;
                    const wasPressedBefore = previousButtonStates[0][btnIndex];

                    if (pressed && !wasPressedBefore) {
                        if (selectedMode === "buzzer") {
                            handleBuzzerAnswer(i, mapping.answerIndex); // i is the active player index
                        } else {
                            handleAllAnswer(i, mapping.answerIndex); // i is the active player index
                        }
                    }

                    previousButtonStates[0][btnIndex] = pressed;
                }
            }
        }
    } else {
        // Separate gamepad mode: each player has their own gamepad
        // activePlayers contains the controller indices that are ready
        for (let i = 0; i < activePlayers.length; i++) {
            const controllerIndex = activePlayers[i];
            const gp = gps[controllerIndex];
            if (!gp) continue;

            // Initialize button state if needed
            if (!previousButtonStates[controllerIndex]) {
                previousButtonStates[controllerIndex] = [];
            }

            // Check buzzer button (button 4 or higher index buttons)
            // Try multiple button indices as different controllers may vary
            const buzzerButtons = [4, 5, 6, 7, 8, 9];
            for (const btnIndex of buzzerButtons) {
                if (gp.buttons[btnIndex]) {
                    const pressed = gp.buttons[btnIndex].pressed;
                    const wasPressedBefore = previousButtonStates[controllerIndex][btnIndex];

                    if (pressed && !wasPressedBefore) {
                        handleBuzzerPress(i); // i is the active player index
                    }

                    previousButtonStates[controllerIndex][btnIndex] = pressed;
                }
            }

            // Check colored answer buttons (0-3 for A, B, C, D)
            for (let b = 0; b < 4; b++) {
                if (gp.buttons[b]) {
                    const pressed = gp.buttons[b].pressed;
                    const wasPressedBefore = previousButtonStates[controllerIndex][b];

                    if (pressed && !wasPressedBefore) {
                        if (selectedMode === "buzzer") {
                            handleBuzzerAnswer(i, b); // i is the active player index
                        } else {
                            handleAllAnswer(i, b); // i is the active player index
                        }
                    }

                    previousButtonStates[controllerIndex][b] = pressed;
                }
            }
        }
    }

    requestAnimationFrame(pollGamepads);
}

// Keyboard fallback
document.addEventListener("keydown", (e) => {
    if (!isKeyboardMode) return;

    const key = e.key.toLowerCase();

    // Handle player ready on setup screen
    if (!setupScreen.classList.contains("hidden")) {
        if (key === " ") {
            e.preventDefault();
            playerReady[0] = !playerReady[0];
            updatePlayerReadyDisplay();
        } else if (key === "enter") {
            e.preventDefault();
            playerReady[1] = !playerReady[1];
            updatePlayerReadyDisplay();
        } else if (key === "shift") {
            e.preventDefault();
            playerReady[2] = !playerReady[2];
            updatePlayerReadyDisplay();
        } else if (key === "control") {
            e.preventDefault();
            playerReady[3] = !playerReady[3];
            updatePlayerReadyDisplay();
        }
        return;
    }

    // Map controller indices to active player indices
    const getActivePlayerIndex = (controllerIndex) => {
        return activePlayers.indexOf(controllerIndex);
    };

    // Player 1 (Controller 0): Q/W/E/R for ABCD, Space for buzzer
    const p0Index = getActivePlayerIndex(0);
    if (p0Index !== -1) {
        if (key === " ") {
            e.preventDefault();
            handleBuzzerPress(p0Index);
        } else if (key === "q") handleAnswer(p0Index, 0);
        else if (key === "w") handleAnswer(p0Index, 1);
        else if (key === "e") handleAnswer(p0Index, 2);
        else if (key === "r") handleAnswer(p0Index, 3);
    }

    // Player 2 (Controller 1): U/I/O/P for ABCD, Enter for buzzer
    const p1Index = getActivePlayerIndex(1);
    if (p1Index !== -1) {
        if (key === "enter") {
            e.preventDefault();
            handleBuzzerPress(p1Index);
        } else if (key === "u") handleAnswer(p1Index, 0);
        else if (key === "i") handleAnswer(p1Index, 1);
        else if (key === "o") handleAnswer(p1Index, 2);
        else if (key === "p") handleAnswer(p1Index, 3);
    }

    // Player 3 (Controller 2): A/S/D/F for ABCD, Shift for buzzer
    const p2Index = getActivePlayerIndex(2);
    if (p2Index !== -1) {
        if (key === "shift") {
            e.preventDefault();
            handleBuzzerPress(p2Index);
        } else if (key === "a") handleAnswer(p2Index, 0);
        else if (key === "s") handleAnswer(p2Index, 1);
        else if (key === "d") handleAnswer(p2Index, 2);
        else if (key === "f") handleAnswer(p2Index, 3);
    }

    // Player 4 (Controller 3): J/K/L/; for ABCD, Ctrl for buzzer
    const p3Index = getActivePlayerIndex(3);
    if (p3Index !== -1) {
        if (key === "control") {
            e.preventDefault();
            handleBuzzerPress(p3Index);
        } else if (key === "j") handleAnswer(p3Index, 0);
        else if (key === "k") handleAnswer(p3Index, 1);
        else if (key === "l") handleAnswer(p3Index, 2);
        else if (key === ";") handleAnswer(p3Index, 3);
    }
});

function handleAnswer(playerIndex, answerIndex) {
    if (selectedMode === "buzzer") {
        handleBuzzerAnswer(playerIndex, answerIndex);
    } else {
        handleAllAnswer(playerIndex, answerIndex);
    }
}

// Debug panel
let debugPanelVisible = false;

document.getElementById("toggle-debug-btn").addEventListener("click", () => {
    debugPanelVisible = !debugPanelVisible;
    const debugInfo = document.getElementById("debug-info");
    const toggleBtn = document.getElementById("toggle-debug-btn");

    if (debugPanelVisible) {
        debugInfo.classList.remove("hidden");
        toggleBtn.textContent = "🔧 Hide Controller Debug Info";
        startDebugPolling();
    } else {
        debugInfo.classList.add("hidden");
        toggleBtn.textContent = "🔧 Show Controller Debug Info";
    }
});

function startDebugPolling() {
    if (!debugPanelVisible) return;

    updateDebugInfo();
    requestAnimationFrame(startDebugPolling);
}

function updateDebugInfo() {
    const debugOutput = document.getElementById("debug-output");
    const gps = navigator.getGamepads();

    let html = "";

    if (isHubMode) {
        // Hub mode: show single hub with player sections
        const gp = gps[0];
        if (gp) {
            html += `
                <div class="gamepad-debug">
                    <h4>Buzz Controller Hub</h4>
                    <div class="gamepad-name">ID: ${gp.id}</div>
                    <div class="gamepad-name">Total Buttons: ${gp.buttons.length} | Axes: ${gp.axes.length}</div>
                    <div style="margin-top: 15px; color: #81c784;">Player Button Mapping:</div>
            `;

            // Show each player's section
            for (let p = 0; p < numPlayers; p++) {
                const playerColor = playerColors[p];
                const buttonStart = p * 5;
                const buttonEnd = buttonStart + 4;

                html += `
                    <div style="margin: 15px 0; padding: 10px; background: ${playerColor.bg}; border-left: 4px solid ${playerColor.border}; border-radius: 5px;">
                        <div style="color: ${playerColor.text}; font-weight: bold; margin-bottom: 5px;">
                            Player ${p + 1} (${playerColor.name}) - Buttons ${buttonStart}-${buttonEnd}
                        </div>
                        <div class="button-grid">
                `;

                for (let b = 0; b < 5; b++) {
                    const btnIndex = buttonStart + b;
                    const pressed = gp.buttons[btnIndex].pressed;
                    const value = gp.buttons[btnIndex].value.toFixed(2);

                    let btnLabel = "BTN " + btnIndex;
                    if (b === 0) btnLabel += " 🔴";
                    else if (b === 1) btnLabel += " 🟡";
                    else if (b === 2) btnLabel += " 🟢";
                    else if (b === 3) btnLabel += " 🟠";
                    else if (b === 4) btnLabel += " 🔵";

                    // Keep buzzer lit if this player buzzed in and hasn't answered yet
                    // activePlayer is an index into activePlayers, so get the controller index
                    const activeControllerIndex = activePlayer >= 0 ? activePlayers[activePlayer] : -1;
                    const isBuzzerLit = (b === 0 && selectedMode === "buzzer" && activeControllerIndex === p && buzzerPressed);
                    const isPressed = pressed || isBuzzerLit;

                    html += `
                        <div class="button-state ${isPressed ? "pressed" : ""}">
                            <div class="button-number">${btnLabel}</div>
                            <div class="button-value">${value}</div>
                        </div>
                    `;
                }

                html += `
                        </div>
                    </div>
                `;
            }

            html += `
                </div>
            `;
        } else {
            html += `
                <div class="gamepad-debug" style="opacity: 0.5; border-left-color: #f44336;">
                    <h4>Buzz Controller Hub</h4>
                    <div class="gamepad-name">Not connected</div>
                    <div style="color: #ef5350; margin-top: 10px;">
                        Connect Buzz controller hub and press any button
                    </div>
                </div>
            `;
        }
    } else {
        // Separate gamepad mode: show each gamepad separately
        for (let i = 0; i < 4; i++) {
            const gp = gps[i];

            if (gp) {
                html += `
                    <div class="gamepad-debug">
                        <h4>Gamepad ${i + 1}</h4>
                        <div class="gamepad-name">ID: ${gp.id}</div>
                        <div class="gamepad-name">Buttons: ${gp.buttons.length} | Axes: ${gp.axes.length}</div>
                        <div class="button-grid">
                `;

                // Show all buttons
                for (let b = 0; b < gp.buttons.length; b++) {
                    const pressed = gp.buttons[b].pressed;
                    const value = gp.buttons[b].value.toFixed(2);
                    html += `
                        <div class="button-state ${pressed ? "pressed" : ""}">
                            <div class="button-number">BTN ${b}</div>
                            <div class="button-value">${value}</div>
                        </div>
                    `;
                }

                html += `
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="gamepad-debug" style="opacity: 0.5; border-left-color: #f44336;">
                        <h4>Gamepad ${i + 1}</h4>
                        <div class="gamepad-name">Not connected</div>
                        <div style="color: #ef5350; margin-top: 10px;">
                            Press any button on gamepad ${i + 1} to activate it
                        </div>
                    </div>
                `;
            }
        }
    }

    debugOutput.innerHTML = html;
}

// Initialize
updateControllerStatus();
setInterval(updateControllerStatus, 1000);
pollSetupGamepads(); // Start polling for player ready status

// Prevent right-click menu
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});
