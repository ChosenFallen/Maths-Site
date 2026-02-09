let num1, num2;
let correctAnswer;

function generateQuestion() {
  num1 = Math.floor(Math.random() * 10);
  num2 = Math.floor(Math.random() * 10);
  correctAnswer = num1 + num2;

  document.getElementById("question").textContent =
    `What is ${num1} + ${num2}?`;

  generateAnswerButtons();
  document.getElementById("result").textContent = "";
}

function generateAnswerButtons() {
  const container = document.getElementById("answers");
  container.innerHTML = "";

  let answers = new Set();
  answers.add(correctAnswer);

  while (answers.size < 4) {
    answers.add(correctAnswer + Math.floor(Math.random() * 5) - 2);
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
  if (selected === correctAnswer) {
    document.getElementById("result").textContent = "✅ Correct!";
    setTimeout(generateQuestion, 800);
  } else {
    document.getElementById("result").textContent = "❌ Try again!";
  }
}

generateQuestion();
