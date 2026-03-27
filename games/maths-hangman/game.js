const WORDS = [
    // Number
    { word: "INTEGER",        hint: "A whole number, positive or negative" },
    { word: "DECIMAL",        hint: "A number containing a decimal point" },
    { word: "FRACTION",       hint: "A part of a whole, written as one number over another" },
    { word: "NUMERATOR",      hint: "The top number in a fraction" },
    { word: "DENOMINATOR",    hint: "The bottom number in a fraction" },
    { word: "PERCENTAGE",     hint: "A fraction expressed as parts per hundred" },
    { word: "PRIME",          hint: "A number with exactly two factors: 1 and itself" },
    { word: "FACTOR",         hint: "A number that divides exactly into another" },
    { word: "MULTIPLE",       hint: "The result of multiplying a number by an integer" },
    { word: "RECIPROCAL",     hint: "One divided by a number (flip a fraction)" },
    { word: "SURD",           hint: "An irrational root that cannot be simplified" },
    { word: "RATIONAL",       hint: "A number that can be written as a fraction" },
    { word: "IRRATIONAL",     hint: "A number that cannot be written as a fraction" },
    { word: "ROUNDING",       hint: "Approximating to a given degree of accuracy" },
    { word: "ESTIMATION",     hint: "Finding a rough approximate answer" },
    { word: "STANDARD",       hint: "A way of writing very large or small numbers using powers of ten" },
    // Algebra
    { word: "ALGEBRA",        hint: "Branch of maths using letters to represent unknowns" },
    { word: "EQUATION",       hint: "A mathematical statement showing two things are equal" },
    { word: "VARIABLE",       hint: "A letter that represents an unknown value" },
    { word: "COEFFICIENT",    hint: "The number multiplied by a variable" },
    { word: "EXPRESSION",     hint: "A combination of numbers, letters and operations" },
    { word: "QUADRATIC",      hint: "An equation or expression involving x squared" },
    { word: "INEQUALITY",     hint: "A statement using < > ≤ or ≥ instead of equals" },
    { word: "SIMULTANEOUS",   hint: "Two or more equations solved together" },
    { word: "SUBSTITUTION",   hint: "Replacing a variable with a numerical value" },
    { word: "FACTORISING",    hint: "Writing an expression as a product of its factors" },
    { word: "EXPANDING",      hint: "Multiplying out brackets in an expression" },
    { word: "SEQUENCE",       hint: "An ordered list of numbers following a rule" },
    { word: "GRADIENT",       hint: "The steepness or slope of a line" },
    { word: "INTERCEPT",      hint: "Where a line crosses an axis on a graph" },
    { word: "ASYMPTOTE",      hint: "A line that a curve approaches but never reaches" },
    { word: "PARABOLA",       hint: "The U-shaped curve of a quadratic graph" },
    { word: "LOGARITHM",      hint: "The power to which a base must be raised" },
    { word: "EXPONENTIAL",    hint: "Involving a rapidly growing power or index" },
    // Geometry
    { word: "POLYGON",        hint: "A 2D shape with straight sides" },
    { word: "QUADRILATERAL",  hint: "A polygon with four sides" },
    { word: "TRIANGLE",       hint: "A polygon with three sides" },
    { word: "ISOSCELES",      hint: "A triangle with exactly two equal sides" },
    { word: "EQUILATERAL",    hint: "A triangle with all sides equal" },
    { word: "SCALENE",        hint: "A triangle where all sides are different lengths" },
    { word: "PERPENDICULAR",  hint: "Lines that meet at a right angle" },
    { word: "PARALLEL",       hint: "Lines that are always the same distance apart" },
    { word: "HYPOTENUSE",     hint: "The longest side of a right-angled triangle" },
    { word: "PERIMETER",      hint: "The total distance around the outside of a shape" },
    { word: "CIRCUMFERENCE",  hint: "The perimeter of a circle" },
    { word: "DIAMETER",       hint: "A chord passing through the centre of a circle" },
    { word: "RADIUS",         hint: "The distance from the centre to the edge of a circle" },
    { word: "TANGENT",        hint: "A line that touches a circle at exactly one point" },
    { word: "RHOMBUS",        hint: "A parallelogram with all sides equal" },
    { word: "TRAPEZIUM",      hint: "A quadrilateral with one pair of parallel sides" },
    { word: "PARALLELOGRAM",  hint: "A quadrilateral with two pairs of parallel sides" },
    { word: "SYMMETRY",       hint: "When a shape looks the same on both sides" },
    { word: "CONGRUENT",      hint: "Shapes that are identical in shape and size" },
    { word: "SIMILAR",        hint: "Shapes with the same angles but different sizes" },
    { word: "ENLARGEMENT",    hint: "A transformation that changes the size of a shape" },
    { word: "TRANSLATION",    hint: "Sliding a shape without rotating or reflecting it" },
    { word: "ROTATION",       hint: "Turning a shape around a fixed point" },
    { word: "REFLECTION",     hint: "Flipping a shape in a mirror line" },
    { word: "BISECTOR",       hint: "A line that cuts an angle or segment exactly in half" },
    { word: "LOCUS",          hint: "A set of points satisfying a given condition" },
    { word: "OBTUSE",         hint: "An angle between 90 and 180 degrees" },
    { word: "ACUTE",          hint: "An angle less than 90 degrees" },
    { word: "REFLEX",         hint: "An angle greater than 180 degrees" },
    // Measure
    { word: "VOLUME",         hint: "The amount of space inside a 3D shape" },
    { word: "PYTHAGORAS",     hint: "Famous theorem: a² + b² = c² in right triangles" },
    { word: "TRIGONOMETRY",   hint: "The study of relationships between angles and sides" },
    { word: "SINE",           hint: "Trig ratio: opposite divided by hypotenuse" },
    { word: "COSINE",         hint: "Trig ratio: adjacent divided by hypotenuse" },
    // Statistics & Probability
    { word: "PROBABILITY",    hint: "The likelihood of an event happening, between 0 and 1" },
    { word: "MEDIAN",         hint: "The middle value in an ordered data set" },
    { word: "MEAN",           hint: "The sum of values divided by how many there are" },
    { word: "MODE",           hint: "The most frequently occurring value in a data set" },
    { word: "RANGE",          hint: "The difference between the highest and lowest values" },
    { word: "FREQUENCY",      hint: "How often a value appears in a data set" },
    { word: "HISTOGRAM",      hint: "A bar chart used to display frequency distributions" },
    { word: "CORRELATION",    hint: "A relationship or connection between two variables" },
    // Ratio & Proportion
    { word: "RATIO",          hint: "A comparison of two quantities" },
    { word: "PROPORTION",     hint: "When two ratios are equal" },
    { word: "VECTOR",         hint: "A quantity with both magnitude and direction" },
    { word: "MATRIX",         hint: "A rectangular grid of numbers" },
    { word: "THEOREM",        hint: "A mathematical statement that has been proved" },
    { word: "COORDINATE",     hint: "A pair of numbers that locate a point on a graph" },
];

const BODY_PARTS = ["h-head", "h-body", "h-larm", "h-rarm", "h-lleg", "h-rleg"];
const MAX_WRONG = 6;

let currentWord = "";
let currentHint = "";
let guessedLetters = new Set();
let wrongGuesses = 0;
let gameOver = false;
let usedWords = new Set();

function pickWord() {
    // Avoid repeating words until all have been used
    if (usedWords.size >= WORDS.length) usedWords.clear();
    let entry;
    do {
        entry = WORDS[Math.floor(Math.random() * WORDS.length)];
    } while (usedWords.has(entry.word));
    usedWords.add(entry.word);
    currentWord = entry.word;
    currentHint = entry.hint;
}

function startGame() {
    guessedLetters = new Set();
    wrongGuesses = 0;
    gameOver = false;
    pickWord();
    updateHangman();
    renderWord();
    renderKeyboard();
    const hintEl = document.getElementById("hint-text");
    hintEl.textContent = currentHint;
    hintEl.classList.add("hidden");
    document.getElementById("hint-btn").textContent = "💡 Show Hint";
    document.getElementById("wrong-letters").textContent = "";
    document.getElementById("wrong-count").textContent = "0 / 6 wrong";
    const msg = document.getElementById("game-message");
    msg.className = "game-message hidden";
    msg.textContent = "";
}

function renderWord() {
    const letters = currentWord.split("").map((l) =>
        guessedLetters.has(l)
            ? `<span class="letter revealed">${l}</span>`
            : `<span class="letter blank">_</span>`
    );
    document.getElementById("word-display").innerHTML = letters.join("");
}

function renderKeyboard() {
    const kb = document.getElementById("keyboard");
    kb.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const btn = document.createElement("button");
        btn.textContent = letter;
        btn.className = "key-btn";
        btn.dataset.letter = letter;
        btn.addEventListener("click", () => guess(letter));
        kb.appendChild(btn);
    }
}

function updateKeyboard() {
    document.querySelectorAll(".key-btn").forEach((btn) => {
        const letter = btn.dataset.letter;
        if (guessedLetters.has(letter)) {
            btn.disabled = true;
            btn.classList.add(currentWord.includes(letter) ? "key-correct" : "key-wrong");
        }
    });
}

function updateHangman() {
    BODY_PARTS.forEach((id, i) => {
        document.getElementById(id).classList.toggle("hidden", i >= wrongGuesses);
    });
}

function guess(letter) {
    if (gameOver || guessedLetters.has(letter)) return;
    guessedLetters.add(letter);

    if (!currentWord.includes(letter)) {
        wrongGuesses++;
    }

    updateHangman();
    updateKeyboard();
    renderWord();

    const wrongList = [...guessedLetters].filter((l) => !currentWord.includes(l));
    document.getElementById("wrong-count").textContent = `${wrongGuesses} / 6 wrong`;
    document.getElementById("wrong-letters").textContent =
        wrongList.length > 0 ? "Wrong letters: " + wrongList.join("  ") : "";

    checkEnd();
}

function checkEnd() {
    const won = currentWord.split("").every((l) => guessedLetters.has(l));
    const lost = wrongGuesses >= MAX_WRONG;
    if (!won && !lost) return;

    gameOver = true;
    document.querySelectorAll(".key-btn").forEach((btn) => (btn.disabled = true));

    const msg = document.getElementById("game-message");
    msg.classList.remove("hidden");
    if (won) {
        msg.className = "game-message win";
        msg.textContent = "🎉 Correct! Well done!";
    } else {
        msg.className = "game-message lose";
        msg.textContent = `❌ The word was ${currentWord}`;
        // Reveal full word
        document.getElementById("word-display").innerHTML = currentWord
            .split("")
            .map((l) => `<span class="letter revealed">${l}</span>`)
            .join("");
    }
}

document.addEventListener("keydown", (e) => {
    const letter = e.key.toUpperCase();
    if (letter.length === 1 && letter >= "A" && letter <= "Z") guess(letter);
});

document.getElementById("new-game-btn").addEventListener("click", startGame);

document.getElementById("hint-btn").addEventListener("click", () => {
    const hintEl = document.getElementById("hint-text");
    const btn = document.getElementById("hint-btn");
    hintEl.classList.remove("hidden");
    btn.classList.add("hidden");
});

startGame();
