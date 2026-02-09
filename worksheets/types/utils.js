export function randInt(rand, min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
}

export function difficultyRange(difficulty) {
    switch (difficulty) {
        case "easy":
            return [1, 10];
        case "normal":
            return [1, 50];
        case "hard":
            return [1, 100];
        default:
            return [1, 10];
    }
}

export function applyOp(x, y, op) {
    switch (op) {
        case "+":
            return x + y;
        case "−":
            return x - y;
        case "×":
            return x * y;
        case "÷":
            return x / y;
        default:
            return x + y;
    }
}

export function isHighPrecedence(op) {
    return op === "×" || op === "÷";
}

export function getRandomFactor(value, rand) {
    const absValue = Math.abs(value);
    if (absValue <= 1) return 1;
    const factors = [];
    for (let i = 1; i <= absValue; i++) {
        if (absValue % i === 0) factors.push(i);
    }
    return factors[randInt(rand, 0, factors.length - 1)];
}
