import { renderKatex, formatFrac } from "./utils.js";

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

// Common differences (positive numerator, simplified)
const FRACS_EASY   = [{ p: 1, q: 2 }, { p: 1, q: 3 }, { p: 1, q: 4 }];
const FRACS_NORMAL = [{ p: 1, q: 2 }, { p: 1, q: 3 }, { p: 1, q: 4 }, { p: 2, q: 3 }, { p: 3, q: 4 }];
const FRACS_HARD   = [{ p: 1, q: 2 }, { p: 1, q: 3 }, { p: 1, q: 4 }, { p: 2, q: 3 }, { p: 3, q: 4 }, { p: 3, q: 2 }, { p: 5, q: 4 }];

// Integer constant c in nth term (dp/q)·n + c
// Pool sizes (per direction): easy 3×9=27, normal 5×12=60, hard 7×11=77
// Mixed direction doubles the pool: easy 54, normal 120, hard 154 (all ≥ 50 for check)
const C_EASY   = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const C_NORMAL = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
const C_HARD   = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

export default {
    id: "sequences-nth-term-fractions",
    label: "Sequences: Fractional nth Term",
    instruction(options = {}) {
        const dir = options.sequenceDirection || "mixed";
        const dirText = dir === "increasing" ? "increasing " : dir === "decreasing" ? "decreasing " : "";
        return `Find an expression for the nth term of each ${dirText}sequence.`;
    },
    printTitle() {
        return "Sequences: Fractional nth Term";
    },
    options: [
        {
            id: "sequenceDirection",
            label: "Direction:",
            type: "select",
            default: "mixed",
            values: [
                { value: "increasing", label: "Increasing only" },
                { value: "decreasing", label: "Decreasing only" },
                { value: "mixed", label: "Mixed" },
            ],
        },
    ],
    generate(rand, difficulty, count, options = {}) {
        const direction = options.sequenceDirection || "mixed";
        const pool = buildPool(difficulty, direction);
        let all = [...pool];
        while (all.length < count) all = all.concat([...pool]);
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }
        return all.slice(0, count);
    },
};

function buildPool(difficulty, direction) {
    const fracs  = difficulty === "easy" ? FRACS_EASY   : difficulty === "normal" ? FRACS_NORMAL : FRACS_HARD;
    const cVals  = difficulty === "easy" ? C_EASY       : difficulty === "normal" ? C_NORMAL     : C_HARD;
    const signs  = direction === "increasing" ? [1] : direction === "decreasing" ? [-1] : [1, -1];

    const pool = [];
    for (const { p, q } of fracs) {
        for (const sign of signs) {
            for (const c of cVals) {
                pool.push(makeProblem(p * sign, q, c));
            }
        }
    }
    return pool;
}

// Compute term at position n: (dp/q)·n + c, returned as simplified { num, den }
function computeTerm(n, dp, q, c) {
    const rawNum = n * dp + c * q;
    const g = gcd(Math.abs(rawNum), q);
    return { num: rawNum / g, den: q / g };
}

function termHtml(num, den) {
    if (den === 1) return num < 0 ? `−${Math.abs(num)}` : `${num}`;
    if (num < 0) return `−${formatFrac(Math.abs(num), den)}`;
    return formatFrac(num, den);
}

function termText(num, den) {
    if (den === 1) return num < 0 ? `−${Math.abs(num)}` : `${num}`;
    return `${num < 0 ? '−' : ''}${Math.abs(num)}/${den}`;
}

function makeProblem(dp, q, c) {
    const terms = [1, 2, 3, 4].map(n => computeTerm(n, dp, q, c));

    const question = terms.map(({ num, den }) => termText(num, den)).join(", ") + ", ...   Find the nth term.";
    const questionHtml = terms.map(({ num, den }) => termHtml(num, den)).join(", ") + ", …   Find the nth term.";

    const answer = formatNthTermText(dp, q, c);
    const answerHtml = renderKatex(formatNthTermLatex(dp, q, c)) || answer;

    return { questionHtml, question, answer, answerHtml };
}

function formatNthTermText(dp, q, c) {
    const sign = dp < 0 ? "−" : "";
    const absDp = Math.abs(dp);
    let coeff;
    if (absDp === 1 && q === 1) coeff = `${sign}n`;
    else if (q === 1)           coeff = `${sign}${absDp}n`;
    else if (absDp === 1)       coeff = `${sign}n/${q}`;
    else                        coeff = `${sign}${absDp}/${q}n`;

    if (c === 0) return coeff;
    if (c > 0)   return `${coeff} + ${c}`;
    return `${coeff} − ${Math.abs(c)}`;
}

function formatNthTermLatex(dp, q, c) {
    const sign = dp < 0 ? "-" : "";
    const absDp = Math.abs(dp);
    let coeff;
    if (absDp === 1 && q === 1) coeff = `${sign}n`;
    else if (q === 1)           coeff = `${sign}${absDp}n`;
    else if (absDp === 1)       coeff = `${sign}\\frac{n}{${q}}`;
    else                        coeff = `${sign}\\frac{${absDp}}{${q}}n`;

    if (c === 0) return coeff;
    if (c > 0)   return `${coeff} + ${c}`;
    return `${coeff} - ${Math.abs(c)}`;
}
