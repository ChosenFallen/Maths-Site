let num1;
let num2;

function generateQuestion() {
  num1 = Math.floor(Math.random() * 10);
  num2 = Math.floor(Math.random() * 10);

  document.getElementById("question").textContent =
    `What is ${num1} + ${num2}?`;

  document.getElementById("answer").value = "";
  document.getElementById("result").textContent = "";
}

function checkAnswer() {
  const userAnswer = Number(document.getElementById("answer").value);

  if (userAnswer === num1 + num2) {
    document.getElementById("result").textContent = "✅ Correct!";
    generateQuestion();
  } else {
    document.getElementById("result").textContent = "❌ Try again!";
  }
}

document.getElementById("submit").addEventListener("click", checkAnswer);

generateQuestion();
