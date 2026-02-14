// Game settings
let selectedOperation = "addition";
let selectedDifficulty = "normal";
let selectedMode = "practice";

// Game state
let score = 0;
let streak = 0;
let bestStreak = 0;
let questionsAnswered = 0;
let correctAnswers = 0;
let currentQuestion = {};
let timerInterval = null;
let timeLeft = 60;

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

// Menu button handlers
document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const parent = btn.parentElement;
        parent.querySelectorAll(".option-btn").forEach((b) =>
            b.classList.remove("active"),
        );
        btn.classList.add("active");

        if (btn.dataset.operation) selectedOperation = btn.dataset.operation;
        if (btn.dataset.difficulty) selectedDifficulty = btn.dataset.difficulty;
        if (btn.dataset.mode) selectedMode = btn.dataset.mode;
    });
});

startBtn.addEventListener("click", startGame);
finishBtn.addEventListener("click", () => endGame(true));

function startGame() {
    score = 0;
    streak = 0;
    bestStreak = 0;
    questionsAnswered = 0;
    correctAnswers = 0;
    timeLeft = 60;

    menuScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameOverText.classList.add("hidden");

    updateStats();

    if (selectedMode === "timed") {
        startTimer();
        finishBtn.classList.add("hidden");
    } else {
        document.getElementById("timer-display").textContent = "";
        finishBtn.classList.remove("hidden");
    }

    generateQuestion();
}

function startTimer() {
    const timerDisplay = document.getElementById("timer-display");
    timerDisplay.textContent = `⏱️ ${timeLeft}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `⏱️ ${timeLeft}s`;

        if (timeLeft <= 10) {
            timerDisplay.style.color = "#f44336";
        }

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function generateQuestion() {
    const operation =
        selectedOperation === "mixed"
            ? ["addition", "subtraction", "multiplication", "division"][
                  Math.floor(Math.random() * 4)
              ]
            : selectedOperation;

    const settings = difficultySettings[selectedDifficulty][operation];
    let num1, num2, answer, questionText, symbol;

    switch (operation) {
        case "addition":
            num1 = randInt(settings.min, settings.max);
            num2 = randInt(settings.min, settings.max);
            answer = num1 + num2;
            symbol = "+";
            break;
        case "subtraction":
            num1 = randInt(settings.min, settings.max);
            num2 = randInt(settings.min, num1);
            answer = num1 - num2;
            symbol = "−";
            break;
        case "multiplication":
            num1 = randInt(settings.min, settings.max);
            num2 = randInt(settings.min, settings.max);
            answer = num1 * num2;
            symbol = "×";
            break;
        case "division":
            num2 = randInt(settings.min, settings.max);
            answer = randInt(settings.min, settings.max);
            num1 = num2 * answer;
            symbol = "÷";
            break;
    }

    questionText = `${num1} ${symbol} ${num2}`;

    currentQuestion = {
        text: questionText,
        answer: answer,
        operation: operation,
    };

    document.getElementById("question").textContent = questionText + " = ?";
    generateAnswerButtons(answer);
    document.getElementById("feedback").textContent = "";
}

function generateAnswerButtons(correctAnswer) {
    const container = document.getElementById("answers");
    container.innerHTML = "";

    let answers = new Set();
    answers.add(correctAnswer);

    const range = selectedDifficulty === "easy" ? 5 : 10;

    while (answers.size < 4) {
        const offset = Math.floor(Math.random() * range) - Math.floor(range / 2);
        const candidate = correctAnswer + offset;
        if (candidate >= 0 && candidate !== correctAnswer) {
            answers.add(candidate);
        }
    }

    [...answers]
        .sort(() => Math.random() - 0.5)
        .forEach((answer) => {
            const btn = document.createElement("button");
            btn.className = "answer-btn";
            btn.textContent = answer;
            btn.addEventListener("click", () => checkAnswer(answer));
            container.appendChild(btn);
        });
}

function checkAnswer(selected) {
    questionsAnswered++;
    const feedback = document.getElementById("feedback");

    if (selected === currentQuestion.answer) {
        correctAnswers++;
        score += 10 + streak * 2;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        feedback.textContent = "✅ Correct!";
        feedback.className = "feedback correct";
        updateStats();
        setTimeout(generateQuestion, 500);
    } else {
        streak = 0;
        feedback.textContent = `❌ Wrong! The answer was ${currentQuestion.answer}`;
        feedback.className = "feedback wrong";
        updateStats();
    }
}

function updateStats() {
    document.getElementById("score").textContent = score;
    document.getElementById("streak").textContent = streak;

    const streakElement = document.querySelector(".streak");
    if (streak >= 5) {
        streakElement.style.background = "#ff9800";
        streakElement.style.color = "white";
    } else {
        streakElement.style.background = "";
        streakElement.style.color = "";
    }
}

function endGame(manualFinish = false) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const accuracy =
        questionsAnswered > 0
            ? Math.round((correctAnswers / questionsAnswered) * 100)
            : 0;

    // Save high score
    saveHighScore();

    const message = selectedMode === "timed"
        ? `Time's up! Score: ${score} | Questions: ${questionsAnswered} | Accuracy: ${accuracy}% | Best Streak: ${bestStreak}`
        : `Great work! Score: ${score} | Questions: ${questionsAnswered} | Accuracy: ${accuracy}% | Best Streak: ${bestStreak}`;

    gameOverText.textContent = message;
    gameOverText.classList.remove("hidden");

    updateHighScoresDisplay();

    // Shorter delay when manually finished, longer for timed mode completion
    const delay = manualFinish ? 1200 : 2500;

    setTimeout(() => {
        gameScreen.classList.add("hidden");
        menuScreen.classList.remove("hidden");
    }, delay);
}

function saveHighScore() {
    const key = `maths-challenge-${selectedMode}-${selectedOperation}-${selectedDifficulty}`;
    const currentHigh = localStorage.getItem(key);

    if (!currentHigh || score > parseInt(currentHigh)) {
        localStorage.setItem(key, score.toString());
    }
}

function updateHighScoresDisplay() {
    const scores = [];

    ["practice", "timed"].forEach((mode) => {
        ["addition", "subtraction", "multiplication", "division", "mixed"].forEach(
            (op) => {
                ["easy", "normal", "hard"].forEach((diff) => {
                    const key = `maths-challenge-${mode}-${op}-${diff}`;
                    const score = localStorage.getItem(key);
                    if (score) {
                        scores.push({
                            mode,
                            operation: op,
                            difficulty: diff,
                            score: parseInt(score),
                        });
                    }
                });
            },
        );
    });

    if (scores.length === 0) {
        highScoresBox.classList.add("hidden");
        return;
    }

    scores.sort((a, b) => b.score - a.score);

    scoresList.innerHTML = scores
        .slice(0, 5)
        .map(
            (s) =>
                `<p>${getOperationEmoji(s.operation)} ${capitalizeFirst(s.operation)} (${capitalizeFirst(s.difficulty)}, ${capitalizeFirst(s.mode)}): ${s.score}</p>`,
        )
        .join("");

    highScoresBox.classList.remove("hidden");
}

function getOperationEmoji(op) {
    const emojis = {
        addition: "➕",
        subtraction: "➖",
        multiplication: "✖️",
        division: "➗",
        mixed: "🔀",
    };
    return emojis[op] || "";
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize
updateHighScoresDisplay();

// Prevent right-click menu
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});
