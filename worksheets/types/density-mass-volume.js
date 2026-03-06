import {
    randInt,
    generateNumericDistracters
} from "./utils.js";

// Formula: density = mass / volume  →  mass = density × volume  →  volume = mass / density

const OBJECTS = [
    "a block of iron",
    "a block of copper",
    "a block of aluminium",
    "a block of lead",
    "a gold bar",
    "a silver bar",
    "a piece of oak",
    "a block of concrete",
    "a steel sphere",
    "a brass cylinder",
    "a plastic cube",
    "a block of tin",
];

function pickObject(rand) {
    return OBJECTS[randInt(rand, 0, OBJECTS.length - 1)];
}

function fmt(n) {
    return n % 1 === 0 ? `${n}` : n.toFixed(1);
}

// ── Find mass ─────────────────────────────────────────────────────────────────

function genFindMass(rand, difficulty) {
    let density, volume;

    if (difficulty === "easy") {
        const densities = [2, 3, 4, 5, 6, 8, 10];
        density = densities[randInt(rand, 0, densities.length - 1)];
        volume  = randInt(rand, 2, 10);
    } else if (difficulty === "normal") {
        const densities = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        density = densities[randInt(rand, 0, densities.length - 1)];
        volume  = randInt(rand, 2, 20);
    } else {
        const densities = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15];
        density = densities[randInt(rand, 0, densities.length - 1)];
        volume  = randInt(rand, 5, 50);
    }

    const mass = density * volume;
    const obj  = pickObject(rand);

    return {
        question: `${cap(obj)} has a density of ${density} g/cm³ and a volume of ${volume} cm³. What is its mass?`,
        answer: `${mass} g`,
    };
}

// ── Find density ──────────────────────────────────────────────────────────────

function genFindDensity(rand, difficulty) {
    let density, volume;

    if (difficulty === "easy") {
        const densities = [2, 3, 4, 5, 6, 8, 10];
        density = densities[randInt(rand, 0, densities.length - 1)];
        volume  = randInt(rand, 2, 10);
    } else if (difficulty === "normal") {
        const densities = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        density = densities[randInt(rand, 0, densities.length - 1)];
        volume  = randInt(rand, 2, 20);
    } else {
        // Allow half-integer densities for hard
        const densityHalves = [5, 7, 9, 11, 13, 15, 17, 19, 21, 25];
        density = densityHalves[randInt(rand, 0, densityHalves.length - 1)] / 2;
        volume  = randInt(rand, 2, 20) * 2; // even volume so mass stays integer
    }

    const mass = density * volume;
    const obj  = pickObject(rand);

    return {
        question: `${cap(obj)} has a mass of ${fmt(mass)} g and a volume of ${volume} cm³. What is its density?`,
        answer: `${fmt(density)} g/cm³`,
    };
}

// ── Find volume ───────────────────────────────────────────────────────────────

function genFindVolume(rand, difficulty) {
    let density, volume;

    if (difficulty === "easy") {
        const densities = [2, 3, 4, 5, 6, 8, 10];
        density = densities[randInt(rand, 0, densities.length - 1)];
        volume  = randInt(rand, 2, 10);
    } else if (difficulty === "normal") {
        const densities = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        density = densities[randInt(rand, 0, densities.length - 1)];
        volume  = randInt(rand, 2, 20);
    } else {
        const densities = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15];
        density = densities[randInt(rand, 0, densities.length - 1)];
        volume  = randInt(rand, 5, 50);
    }

    const mass = density * volume;
    const obj  = pickObject(rand);

    return {
        question: `${cap(obj)} has a density of ${density} g/cm³ and a mass of ${mass} g. What is its volume?`,
        answer: `${volume} cm³`,
    };
}

function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Worksheet export ──────────────────────────────────────────────────────────

const FIND_LABELS = {
    density: "Density",
    mass:    "Mass",
    volume:  "Volume",
};

export default {
    id: "density-mass-volume",
    label: "Density, Mass & Volume",
    grades: [6, 7, 8],  // [easy, normal, hard]
    options: [
        {
            id: "find",
            label: "Find:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed",   label: "Mixed" },
                { value: "density", label: "Density" },
                { value: "mass",    label: "Mass" },
                { value: "volume",  label: "Volume" },
            ],
        },
    ],
    instruction(options = {}) {
        const f = options.find || "mixed";
        if (f === "density") return "Use density = mass ÷ volume to find the density in each problem.";
        if (f === "mass")    return "Use mass = density × volume to find the mass in each problem.";
        if (f === "volume")  return "Use volume = mass ÷ density to find the volume in each problem.";
        return "Use the density, mass and volume formula to solve each problem.";
    },
    printTitle(options = {}) {
        const f = options.find || "mixed";
        if (FIND_LABELS[f]) return `Density, Mass & Volume: Find ${FIND_LABELS[f]}`;
        return "Density, Mass & Volume";
    },
    generate(rand, difficulty, count, options = {}) {
        const find = options.find || "mixed";
        const FINDS = ["density", "mass", "volume"];
        const problems = [];
        for (let i = 0; i < count; i++) {
            const f = find === "mixed" ? FINDS[randInt(rand, 0, 2)] : find;
            problems.push(generateProblem(rand, difficulty, f));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, find) {
    if (find === "density") return genFindDensity(rand, difficulty);
    if (find === "mass")    return genFindMass(rand, difficulty);
    return genFindVolume(rand, difficulty);
}
