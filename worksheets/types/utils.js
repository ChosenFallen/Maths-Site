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

export function gcd(a, b) {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x;
}

export function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
}

export function ensureNonUnitDenominator(numerator, denominator) {
    if (denominator !== 1) return { numerator, denominator };
    return { numerator: numerator * 2, denominator: 2 };
}

// KaTeX-based math rendering
function renderKatex(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

export function formatFrac(numerator, denominator) {
    const rendered = renderKatex(`\\frac{${numerator}}{${denominator}}`);
    if (rendered) return rendered;
    // CSS fallback
    return `<span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span>`;
}

export function formatFracOrWhole(numerator, denominator) {
    if (denominator === 1) {
        return { html: `${numerator}`, text: `${numerator}` };
    }
    return {
        html: formatFrac(numerator, denominator),
        text: `${numerator}/${denominator}`,
    };
}

export function formatMixedNum(whole, numerator, denominator) {
    const rendered = renderKatex(`${whole}\\frac{${numerator}}{${denominator}}`);
    if (rendered) return rendered;
    // CSS fallback
    return `<span class="mixed"><span class="whole">${whole}</span><span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span></span>`;
}

export function formatPower(base, exponent) {
    const rendered = renderKatex(`${base}^{${exponent}}`);
    if (rendered) return rendered;
    // HTML fallback
    return `${base}<sup>${exponent}</sup>`;
}
