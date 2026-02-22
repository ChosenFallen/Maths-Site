import { randInt } from "./utils.js";

// Formats an amount with the chosen context unit
const CONTEXTS = [
    { fmt: n => `£${n}` },
    { fmt: n => `${n} cm` },
    { fmt: n => `${n} m` },
    { fmt: n => `${n} kg` },
];

function pickContext(rand) {
    return CONTEXTS[randInt(rand, 0, CONTEXTS.length - 1)];
}

// Pick answer first: generate k parts each of size k, total = k*(a+b)
function twoPart(rand, maxPart, maxK) {
    const a = randInt(rand, 1, maxPart);
    const b = randInt(rand, 1, maxPart);
    const k = randInt(rand, 2, maxK);
    return { parts: [a, b], total: k * (a + b), shares: [k * a, k * b] };
}

function threePart(rand, maxPart, maxK) {
    const a = randInt(rand, 1, maxPart);
    const b = randInt(rand, 1, maxPart);
    const c = randInt(rand, 1, maxPart);
    const k = randInt(rand, 2, maxK);
    return { parts: [a, b, c], total: k * (a + b + c), shares: [k * a, k * b, k * c] };
}

function makeProblem(parts, total, shares, fmt) {
    const ratio = parts.join(":");
    const last = shares.length - 1;
    const answerParts = shares.map((s, i) => (i < last ? `${fmt(s)},` : `and ${fmt(s)}`));
    // For 2-part: "£24 and £36". For 3-part: "£12, £20 and £28"
    const answer = shares.length === 2
        ? `${fmt(shares[0])} and ${fmt(shares[1])}`
        : `${shares.slice(0, -1).map(s => fmt(s)).join(", ")} and ${fmt(shares[last])}`;
    return {
        question: `Share ${fmt(total)} in the ratio ${ratio}.`,
        answer,
    };
}

export default {
    id: "ratio-sharing",
    label: "Sharing in a Ratio",
    instruction() {
        return "Share each amount in the given ratio.";
    },
    printTitle() {
        return "Sharing in a Ratio";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(generateProblem(rand, difficulty));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty) {
    const f = pickContext(rand);

    if (difficulty === "easy") {
        // 2-part only, small numbers
        const { parts, total, shares } = twoPart(rand, 4, 6);
        return makeProblem(parts, total, shares, f.fmt);
    }

    if (difficulty === "normal") {
        // 50/50: larger 2-part or smaller 3-part
        if (randInt(rand, 0, 1) === 0) {
            const { parts, total, shares } = twoPart(rand, 6, 12);
            return makeProblem(parts, total, shares, f.fmt);
        }
        const { parts, total, shares } = threePart(rand, 3, 6);
        return makeProblem(parts, total, shares, f.fmt);
    }

    // hard: 3-part with larger numbers
    const { parts, total, shares } = threePart(rand, 5, 12);
    return makeProblem(parts, total, shares, f.fmt);
}
