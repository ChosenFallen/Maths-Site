/**
 * Generates a random integer within a range using a seeded PRNG.
 * @param {Function} rand - Seeded random function (e.g., Mulberry32)
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer between min and max
 */
export function randInt(rand, min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
}

/**
 * Returns a numeric range suitable for a difficulty level.
 * @param {string} difficulty - One of "easy", "normal", or "hard"
 * @returns {number[]} [min, max] range for that difficulty level
 */
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

/**
 * Applies a mathematical operation to two numbers.
 * @param {number} x - First operand
 * @param {number} y - Second operand
 * @param {string} op - Operator: "+", "−" (Unicode), "×", or "÷"
 * @returns {number} Result of x op y
 */
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

/**
 * Checks if an operator has high precedence (multiplication/division).
 * @param {string} op - Operator to check
 * @returns {boolean} True if operator is × or ÷
 */
export function isHighPrecedence(op) {
    return op === "×" || op === "÷";
}

/**
 * Returns a random factor of a given value.
 * @param {number} value - Number to find a factor of
 * @param {Function} rand - Seeded random function
 * @returns {number} A random factor of value (or 1 if value <= 1)
 */
export function getRandomFactor(value, rand) {
    const absValue = Math.abs(value);
    if (absValue <= 1) return 1;
    const factors = [];
    for (let i = 1; i <= absValue; i++) {
        if (absValue % i === 0) factors.push(i);
    }
    return factors[randInt(rand, 0, factors.length - 1)];
}

/**
 * Calculates the greatest common divisor (GCD) using Euclidean algorithm.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} GCD of a and b
 */
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

/**
 * Calculates the least common multiple (LCM) of two numbers.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} LCM of a and b (or 0 if either is 0)
 */
export function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
}

/**
 * Ensures a fraction has a non-unit denominator (denominator > 1).
 * If denominator is 1, multiplies both by 2 to create 2/2.
 * @param {number} numerator - Numerator of fraction
 * @param {number} denominator - Denominator of fraction
 * @returns {Object} {numerator, denominator} with denominator > 1
 */
export function ensureNonUnitDenominator(numerator, denominator) {
    if (denominator !== 1) return { numerator, denominator };
    return { numerator: numerator * 2, denominator: 2 };
}

/**
 * Renders LaTeX math notation using KaTeX library.
 * Returns HTML string if KaTeX is available, otherwise null (caller should provide fallback).
 * @param {string} latex - LaTeX math notation string
 * @returns {string|null} HTML-rendered math or null if KaTeX unavailable
 */
export function renderKatex(latex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(latex, { throwOnError: false });
    }
    return null;
}

/**
 * Formats a fraction as HTML, using KaTeX if available or CSS fallback.
 * @param {number} numerator - Numerator of fraction
 * @param {number} denominator - Denominator of fraction
 * @returns {string} HTML string rendering the fraction
 */
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

/**
 * Formats a mixed number (e.g., 2¾) as HTML with KaTeX rendering or CSS fallback.
 * @param {number} whole - Whole number part
 * @param {number} numerator - Fraction numerator
 * @param {number} denominator - Fraction denominator
 * @returns {string} HTML string rendering the mixed number
 */
export function formatMixedNum(whole, numerator, denominator) {
    const rendered = renderKatex(`${whole}\\frac{${numerator}}{${denominator}}`);
    if (rendered) return rendered;
    // CSS fallback
    return `<span class="mixed"><span class="whole">${whole}</span><span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span></span>`;
}

/**
 * Formats a power expression (e.g., x²) using KaTeX or HTML superscript.
 * @param {string} base - Base expression
 * @param {string|number} exponent - Exponent
 * @returns {string} HTML-rendered power expression
 */
export function formatPower(base, exponent) {
    const rendered = renderKatex(`${base}^{${exponent}}`);
    if (rendered) return rendered;
    // HTML fallback
    return `${base}<sup>${exponent}</sup>`;
}

/**
 * Performs Fisher-Yates shuffle on an array using a seeded PRNG.
 * Mutates the input array in place.
 * @param {Function} rand - Seeded random function
 * @param {Array} array - Array to shuffle
 */
export function shuffle(rand, array) {
    // Fisher-Yates shuffle using provided rand function
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Formats a quadratic expression in LaTeX notation.
 * Handles signed coefficients and various inequality/equation signs.
 * Example: a=1, b=-3, c=2, sign=">" → "x^2 - 3x + 2 > 0"
 * @param {number} a - Coefficient of x²
 * @param {number} b - Coefficient of x
 * @param {number} c - Constant term
 * @param {string} sign - Ending sign: " = 0" (default), ">", "<", "≥", "≤"
 * @returns {string} LaTeX string for the quadratic expression
 */
export function formatQuadraticLatex(a, b, c, sign = " = 0") {
    const latexSign = {
        " = 0": " = 0",
        ">": ">",
        "<": "<",
        "≥": "\\geq",
        "≤": "\\leq",
    };
    let result = a === 1 ? "x^2" : `${a}x^2`;
    if (b === 1) result += " + x";
    else if (b === -1) result += " - x";
    else if (b > 0) result += ` + ${b}x`;
    else if (b < 0) result += ` - ${Math.abs(b)}x`;
    if (c > 0) result += ` + ${c}`;
    else if (c < 0) result += ` - ${Math.abs(c)}`;
    result += ` ${latexSign[sign]}`;
    return result;
}

/**
 * Formats a quadratic expression in plain text with Unicode characters.
 * Uses Unicode minus (−) for negatives and ² for superscript.
 * Example: a=1, b=-3, c=2, sign="= 0" → "x² − 3x + 2 = 0"
 * @param {number} a - Coefficient of x²
 * @param {number} b - Coefficient of x
 * @param {number} c - Constant term
 * @param {string} sign - Ending sign: " = 0" (default), ">", "<", "≥", "≤"
 * @returns {string} Plain text string for the quadratic expression
 */
export function formatQuadraticText(a, b, c, sign = " = 0") {
    let result = a === 1 ? "x²" : `${a}x²`;
    if (b === 1) result += " + x";
    else if (b === -1) result += " − x";
    else if (b > 0) result += ` + ${b}x`;
    else if (b < 0) result += ` − ${Math.abs(b)}x`;
    if (c > 0) result += ` + ${c}`;
    else if (c < 0) result += ` − ${Math.abs(c)}`;
    result += ` ${sign}`;
    return result;
}

/**
 * Formats a signed integer for display in inequality answers.
 * Negative numbers use Unicode minus (−) symbol.
 * Example: -5 → "−5", 3 → "3"
 * @param {number} n - Integer value
 * @returns {string} Formatted integer with appropriate sign
 */
export function formatBound(n) {
    return n < 0 ? `−${Math.abs(n)}` : `${n}`;
}

/**
 * Formats an algebraic coefficient with a variable.
 * Handles special cases: coefficient of 1 → just "x", coefficient of -1 → "−x".
 * Examples: formatCoeff(2, "x") → "2x", formatCoeff(-1, "y") → "−y"
 * @param {number} coeff - Coefficient value
 * @param {string} variable - Variable name (default "x")
 * @returns {string} Formatted coefficient with variable
 */
export function formatCoeff(coeff, variable = "x") {
    if (coeff === 1) return variable;
    if (coeff === -1) return `−${variable}`;
    return `${coeff}${variable}`;
}

/**
 * Formats a surd (square root) expression in LaTeX notation.
 * Handles coefficient of 1 specially (omits the "1").
 * Examples: formatSurdLatex(1, 2) → "\sqrt{2}", formatSurdLatex(3, 5) → "3\sqrt{5}"
 * @param {number} coeff - Coefficient in front of the surd
 * @param {number} k - Number under the radical
 * @returns {string} LaTeX representation of the surd
 */
export function formatSurdLatex(coeff, k) {
    if (coeff === 1) {
        return `\\sqrt{${k}}`;
    }
    return `${coeff}\\sqrt{${k}}`;
}

/**
 * Formats a surd (square root) expression in plain text with Unicode √ symbol.
 * Handles coefficient of 1 specially (omits the "1").
 * Examples: formatSurdText(1, 2) → "√2", formatSurdText(3, 5) → "3√5"
 * @param {number} coeff - Coefficient in front of the surd
 * @param {number} k - Number under the radical
 * @returns {string} Plain text representation of the surd
 */
export function formatSurdText(coeff, k) {
    if (coeff === 1) {
        return `√${k}`;
    }
    return `${coeff}√${k}`;
}

/**
 * Formats an answer combining an integer and a surd term.
 * Handles cases where integer is 0 (returns just surd).
 * Uses Unicode minus (−) for negative surds.
 * Examples: formatAnswerWithSurd(6, 3, 2) → "6 + 3√2", formatAnswerWithSurd(0, 2, 3) → "2√3"
 * @param {number} intPart - Integer part
 * @param {number} surdCoeff - Surd coefficient (can be negative)
 * @param {number} k - Number under the radical
 * @returns {string} Formatted combined expression
 */
export function formatAnswerWithSurd(intPart, surdCoeff, k) {
    const surdPart = formatSurdText(Math.abs(surdCoeff), k);
    if (intPart === 0) {
        return surdPart;
    }
    const sign = surdCoeff >= 0 ? "+" : "−";
    return `${intPart} ${sign} ${surdPart}`;
}

/**
 * Formats an answer combining an integer and a surd term in LaTeX notation.
 * Handles cases where integer is 0 (returns just surd).
 * Uses Unicode minus (−) for negative surds.
 * Examples: formatAnswerWithSurdLatex(6, 3, 2) → "6 + 3\sqrt{2}"
 * @param {number} intPart - Integer part
 * @param {number} surdCoeff - Surd coefficient (can be negative)
 * @param {number} k - Number under the radical
 * @returns {string} LaTeX-formatted combined expression
 */
export function formatAnswerWithSurdLatex(intPart, surdCoeff, k) {
    const surdPart = formatSurdLatex(Math.abs(surdCoeff), k);
    if (intPart === 0) {
        return surdPart;
    }
    const sign = surdCoeff >= 0 ? "+" : "−";
    return `${intPart} ${sign} ${surdPart}`;
}

/**
 * Formats a linear expression "(x + c)" in LaTeX notation.
 * Uses ASCII minus (-) for negative constants.
 * Examples: formatLinearLatex(3) → "x + 3", formatLinearLatex(-5) → "x - 5"
 * @param {number} c - Constant term
 * @returns {string} LaTeX linear expression
 */
export function formatLinearLatex(c) {
    if (c >= 0) return `x + ${c}`;
    return `x - ${Math.abs(c)}`;
}

/**
 * Formats a linear expression "(x + c)" in plain text notation.
 * Uses Unicode minus (−) for negative constants.
 * Examples: formatLinearText(3) → "x + 3", formatLinearText(-5) → "x − 5"
 * @param {number} c - Constant term
 * @returns {string} Plain text linear expression
 */
export function formatLinearText(c) {
    if (c >= 0) return `x + ${c}`;
    return `x − ${Math.abs(c)}`;
}

/**
 * Formats a signed value, returning both sign and absolute value components.
 * Centralizes the pattern of checking sign and computing absolute value.
 * Supports both Unicode minus (−) for display and ASCII minus (-) for LaTeX.
 *
 * Examples:
 *   formatSignValue(5) → { sign: "+", abs: 5 }
 *   formatSignValue(-3) → { sign: "−", abs: 3 } (Unicode)
 *   formatSignValue(-3, false) → { sign: "-", abs: 3 } (LaTeX/ASCII)
 *
 * @param {number} value - The signed value to format
 * @param {boolean} useUnicode - If true (default), use Unicode minus (−); if false, use ASCII minus (-)
 * @returns {Object} {sign: "+"/"-"/"−", abs: absolute value}
 */
export function formatSignValue(value, useUnicode = true) {
    const sign = value >= 0 ? "+" : (useUnicode ? "−" : "-");
    const abs = Math.abs(value);
    return { sign, abs };
}

/**
 * Inequality sign constants for use in worksheet generation.
 * INEQUALITY_SIGNS_STRICT: Strict inequalities (> and <)
 * INEQUALITY_SIGNS_ALL: All four inequality signs
 */
export const INEQUALITY_SIGNS_STRICT = [">", "<"];
export const INEQUALITY_SIGNS_ALL = [">", "<", "≥", "≤"];
