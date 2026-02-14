const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let playerIndex = 0;
let acceptingInput = false;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const soundMap = {
    green: 261.6, // C4
    red: 329.6, // E4
    yellow: 392.0, // G4
    blue: 523.3, // C5
};

const difficultySettings = {
    easy: {
        startFlash: 800,
        speedUp: 30,
    },
    normal: {
        startFlash: 600,
        speedUp: 40,
    },
    hard: {
        startFlash: 450,
        speedUp: 60,
    },
};

let currentDifficulty = "normal";

let flashDuration = 600;
let pauseBetweenFlashes = 200;
let speedUpAmount = 40;
let minimumFlashDuration = 200;

let round = 0;

const statusText = document.getElementById("status");
const buttons = document.querySelectorAll(".simon-btn");

const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");

const gameOverText = document.getElementById("game-over-text");

const bestRoundsBox = document.getElementById("best-rounds");

const bestEasyToday = document.getElementById("best-easy-today");
const bestNormalToday = document.getElementById("best-normal-today");
const bestHardToday = document.getElementById("best-hard-today");

const bestEasyAlltime = document.getElementById("best-easy-alltime");
const bestNormalAlltime = document.getElementById("best-normal-alltime");
const bestHardAlltime = document.getElementById("best-hard-alltime");

document.querySelectorAll(".difficulty-buttons button").forEach((btn) => {
    btn.addEventListener("click", () => {
        currentDifficulty = btn.dataset.difficulty;
        startGame();
    });
});

buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (!acceptingInput) return;
        handlePlayerInput(btn.dataset.color);
    });
});

function startGame() {
    audioContext.resume();

    const settings = difficultySettings[currentDifficulty];

    sequence = [];
    playerIndex = 0;
    round = 0;

    flashDuration = settings.startFlash;
    pauseBetweenFlashes = 200;
    speedUpAmount = settings.speedUp;

    gameOverText.classList.add("hidden");

    menuScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    updateRoundDisplay();
    statusText.textContent = "👀 Watch closely...";
    statusText.className = "watching";
    nextRound();
}

function nextRound() {
    acceptingInput = false;
    playerIndex = 0;

    round++;
    updateRoundDisplay();

    sequence.push(randomColor());

    flashDuration = Math.max(
        minimumFlashDuration,
        flashDuration - speedUpAmount,
    );

    playSequence();
}

function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function playSequence() {
    let delay = 0;

    sequence.forEach((color) => {
        setTimeout(() => flash(color), delay);
        delay += flashDuration + pauseBetweenFlashes;
    });

    setTimeout(() => {
        acceptingInput = true;
        statusText.textContent = "👆 Your turn!";
        statusText.className = "your-turn";
    }, delay);
}

function handlePlayerInput(color) {
    flash(color);

    if (color !== sequence[playerIndex]) {
        acceptingInput = false;
        statusText.textContent = "❌ Wrong!";
        statusText.className = "wrong";

        // Play buzzer and shake screen
        playWrongSound();
        gameScreen.classList.add("shake");
        setTimeout(() => gameScreen.classList.remove("shake"), 500);

        // Show final round for this difficulty
        const bestToday = getBestRoundsToday();
        if (round > bestToday[currentDifficulty]) {
            bestToday[currentDifficulty] = round;
            setBestRoundsToday(bestToday);
        }

        const bestAlltime = getBestRoundsAlltime();
        if (round > bestAlltime[currentDifficulty]) {
            bestAlltime[currentDifficulty] = round;
            setBestRoundsAlltime(bestAlltime);
        }

        updateBestRoundsDisplay();
        gameOverText.textContent = `You reached Round ${round}`;
        gameOverText.classList.remove("hidden");

        // Go back to menu after short delay
        setTimeout(() => {
            gameScreen.classList.add("hidden");
            menuScreen.classList.remove("hidden");
        }, 1200);

        return;
    }

    playerIndex++;

    if (playerIndex === sequence.length) {
        statusText.textContent = "✅ Perfect!";
        statusText.className = "correct";
        setTimeout(nextRound, 1000);
    }
}

function flash(color) {
    const btn = document.querySelector(`.${color}`);

    playSound(color);

    btn.classList.add("active");
    setTimeout(() => btn.classList.remove("active"), flashDuration);
}

function playSound(color) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = soundMap[color];

    gainNode.gain.value = 0.3;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    setTimeout(() => {
        oscillator.stop();
    }, 300);
}

function playWrongSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "square"; // buzzy sound
    oscillator.frequency.value = 120; // low pitch
    gainNode.gain.value = 0.4;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setTimeout(() => oscillator.stop(), 400);
}

function updateRoundDisplay() {
    const difficultyLabel = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
    document.getElementById("round-display").textContent = `Round: ${round} (${difficultyLabel})`;
}

function updateBestRoundsDisplay() {
    const bestToday = getBestRoundsToday();
    const bestAlltime = getBestRoundsAlltime();

    console.log("Best rounds today:", bestToday);
    console.log("Best rounds all-time:", bestAlltime);

    bestEasyToday.textContent = `Easy: ${bestToday.easy || "–"}`;
    bestNormalToday.textContent = `Normal: ${bestToday.normal || "–"}`;
    bestHardToday.textContent = `Hard: ${bestToday.hard || "–"}`;

    bestEasyAlltime.textContent = `Easy: ${bestAlltime.easy || "–"}`;
    bestNormalAlltime.textContent = `Normal: ${bestAlltime.normal || "–"}`;
    bestHardAlltime.textContent = `Hard: ${bestAlltime.hard || "–"}`;

    if (bestToday.easy || bestToday.normal || bestToday.hard ||
        bestAlltime.easy || bestAlltime.normal || bestAlltime.hard) {
        bestRoundsBox.classList.remove("hidden");
    } else {
        bestRoundsBox.classList.add("hidden");
    }
}

function getTodayKey() {
    const today = new Date().toISOString().split("T")[0];
    return `simon-best-${today}`;
}

function getBestRoundsToday() {
    const data = localStorage.getItem(getTodayKey());

    if (!data) {
        return { easy: 0, normal: 0, hard: 0 };
    }

    try {
        return JSON.parse(data);
    } catch {
        return { easy: 0, normal: 0, hard: 0 };
    }
}

function setBestRoundsToday(bestRounds) {
    localStorage.setItem(getTodayKey(), JSON.stringify(bestRounds));
}

function getBestRoundsAlltime() {
    const data = localStorage.getItem("simon-best-alltime");

    if (!data) {
        return { easy: 0, normal: 0, hard: 0 };
    }

    try {
        return JSON.parse(data);
    } catch {
        return { easy: 0, normal: 0, hard: 0 };
    }
}

function setBestRoundsAlltime(bestRounds) {
    localStorage.setItem("simon-best-alltime", JSON.stringify(bestRounds));
}

updateBestRoundsDisplay();

// Prevent right-click context menu
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});
