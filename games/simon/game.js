const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let playerIndex = 0;
let acceptingInput = false;

const statusText = document.getElementById("status");
const startButton = document.getElementById("start");
const buttons = document.querySelectorAll(".simon-btn");

startButton.addEventListener("click", startGame);

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!acceptingInput) return;
    handlePlayerInput(btn.dataset.color);
  });
});

function startGame() {
  sequence = [];
  playerIndex = 0;
  statusText.textContent = "Watch closely...";
  nextRound();
}

function nextRound() {
  acceptingInput = false;
  playerIndex = 0;

  sequence.push(randomColor());
  playSequence();
}

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function playSequence() {
  let delay = 0;

  sequence.forEach((color) => {
    setTimeout(() => flash(color), delay);
    delay += 800;
  });

  setTimeout(() => {
    acceptingInput = true;
    statusText.textContent = "Your turn!";
  }, delay);
}

function handlePlayerInput(color) {
  flash(color);

  if (color !== sequence[playerIndex]) {
    statusText.textContent = "❌ Wrong! Tap Start to try again.";
    acceptingInput = false;
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
  btn.classList.add("active");
  setTimeout(() => btn.classList.remove("active"), 300);
}
