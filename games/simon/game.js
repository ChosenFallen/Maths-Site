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
const startButton = document.getElementById("start");
const buttons = document.querySelectorAll(".simon-btn");

const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");

const gameOverText = document.getElementById("game-over-text");

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
    statusText.textContent = "Watch closely...";
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
        statusText.textContent = "Your turn!";
    }, delay);
}

function handlePlayerInput(color) {
    flash(color);

    if (color !== sequence[playerIndex]) {
        acceptingInput = false;
        statusText.textContent = "❌ Wrong!";

        gameOverText.textContent = `You reached Round ${round}`;
        gameOverText.classList.remove("hidden");

        setTimeout(() => {
            gameScreen.classList.add("hidden");
            menuScreen.classList.remove("hidden");
        }, 1200);

        return;
    }

    playerIndex++;

    if (playerIndex === sequence.length) {
        statusText.textContent = "✅ Well done!";
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

function updateRoundDisplay() {
    document.getElementById("round-display").textContent = `Round: ${round}`;
}
