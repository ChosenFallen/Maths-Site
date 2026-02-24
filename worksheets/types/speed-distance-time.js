import { randInt } from "./utils.js";

const CONTEXTS = [
    { subject: "A car",     verb: "travels" },
    { subject: "A train",   verb: "travels" },
    { subject: "A cyclist", verb: "cycles" },
    { subject: "A runner",  verb: "runs" },
    { subject: "A boat",    verb: "travels" },
    { subject: "A bus",     verb: "travels" },
    { subject: "A lorry",   verb: "travels" },
];

function pickContext(rand) {
    return CONTEXTS[randInt(rand, 0, CONTEXTS.length - 1)];
}

// Format a time value (in hours) as a human-readable string
function fmtTime(t) {
    const hours = Math.floor(t);
    const mins  = Math.round((t - hours) * 60);
    if (mins === 0) return hours === 1 ? "1 hour" : `${hours} hours`;
    const hPart = hours === 0 ? "" : (hours === 1 ? "1 hour " : `${hours} hours `);
    const mPart = mins === 1 ? "1 minute" : `${mins} minutes`;
    return `${hPart}${mPart}`;
}

// ── Find speed ────────────────────────────────────────────────────────────────

function genFindSpeed(rand, difficulty) {
    let speed, time;

    if (difficulty === "easy") {
        const speeds = [10, 20, 30, 40, 50, 60, 80];
        speed = speeds[randInt(rand, 0, speeds.length - 1)];
        time  = randInt(rand, 1, 5);
    } else if (difficulty === "normal") {
        const speeds = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80];
        speed = speeds[randInt(rand, 0, speeds.length - 1)];
        const times = [1, 1.5, 2, 2.5, 3, 4];
        time  = times[randInt(rand, 0, times.length - 1)];
    } else {
        const speeds = [12, 18, 25, 36, 45, 48, 54, 64, 75];
        speed = speeds[randInt(rand, 0, speeds.length - 1)];
        const times = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
        time  = times[randInt(rand, 0, times.length - 1)];
    }

    const distance = speed * time;
    const { subject, verb } = pickContext(rand);
    const timeStr = fmtTime(time);

    return {
        question: `${subject} ${verb} ${distance} km in ${timeStr}. What is the average speed?`,
        answer: `${speed} km/h`,
    };
}

// ── Find distance ─────────────────────────────────────────────────────────────

function genFindDistance(rand, difficulty) {
    let speed, time;

    if (difficulty === "easy") {
        const speeds = [10, 20, 30, 40, 50, 60];
        speed = speeds[randInt(rand, 0, speeds.length - 1)];
        time  = randInt(rand, 1, 5);
    } else if (difficulty === "normal") {
        const speeds = [20, 25, 30, 40, 50, 60, 70, 80];
        speed = speeds[randInt(rand, 0, speeds.length - 1)];
        const times = [1, 1.5, 2, 2.5, 3, 3.5, 4];
        time  = times[randInt(rand, 0, times.length - 1)];
    } else {
        const speeds = [15, 24, 36, 45, 48, 56, 72, 90];
        speed = speeds[randInt(rand, 0, speeds.length - 1)];
        const times = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];
        time  = times[randInt(rand, 0, times.length - 1)];
    }

    const distance = speed * time;
    const { subject, verb } = pickContext(rand);
    const timeStr = fmtTime(time);

    return {
        question: `${subject} ${verb} at ${speed} km/h for ${timeStr}. How far does it travel?`,
        answer: `${distance} km`,
    };
}

// ── Find time ─────────────────────────────────────────────────────────────────

function genFindTime(rand, difficulty) {
    let speed, time;

    if (difficulty === "easy") {
        const speeds = [10, 20, 30, 40, 50, 60];
        speed = speeds[randInt(rand, 0, speeds.length - 1)];
        time  = randInt(rand, 1, 5);
    } else if (difficulty === "normal") {
        const speeds = [20, 30, 40, 50, 60, 80];
        speed = speeds[randInt(rand, 0, speeds.length - 1)];
        const times = [1, 1.5, 2, 2.5, 3, 4];
        time  = times[randInt(rand, 0, times.length - 1)];
    } else {
        const speeds = [20, 30, 40, 48, 60, 72, 80, 90];
        speed = speeds[randInt(rand, 0, speeds.length - 1)];
        const times = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];
        time  = times[randInt(rand, 0, times.length - 1)];
    }

    const distance = speed * time;
    const { subject, verb } = pickContext(rand);

    return {
        question: `${subject} ${verb} ${distance} km at ${speed} km/h. How long does the journey take?`,
        answer: fmtTime(time),
    };
}

// ── Worksheet export ──────────────────────────────────────────────────────────

const FIND_LABELS = {
    speed:    "Speed",
    distance: "Distance",
    time:     "Time",
};

export default {
    id: "speed-distance-time",
    label: "Speed, Distance & Time",
    grades: [5, 6, 7],  // [easy, normal, hard]
    options: [
        {
            id: "find",
            label: "Find:",
            type: "select",
            default: "mixed",
            values: [
                { value: "mixed",    label: "Mixed" },
                { value: "speed",    label: "Speed" },
                { value: "distance", label: "Distance" },
                { value: "time",     label: "Time" },
            ],
        },
    ],
    instruction(options = {}) {
        const f = options.find || "mixed";
        if (f === "speed")    return "Use speed = distance ÷ time to find the speed in each problem.";
        if (f === "distance") return "Use distance = speed × time to find the distance in each problem.";
        if (f === "time")     return "Use time = distance ÷ speed to find the time in each problem.";
        return "Use the speed, distance and time formula to solve each problem.";
    },
    printTitle(options = {}) {
        const f = options.find || "mixed";
        if (FIND_LABELS[f]) return `Speed, Distance & Time: Find ${FIND_LABELS[f]}`;
        return "Speed, Distance & Time";
    },
    generate(rand, difficulty, count, options = {}) {
        const find = options.find || "mixed";
        const FINDS = ["speed", "distance", "time"];
        const problems = [];
        for (let i = 0; i < count; i++) {
            const f = find === "mixed" ? FINDS[randInt(rand, 0, 2)] : find;
            problems.push(generateProblem(rand, difficulty, f));
        }
        return problems;
    },
};

function generateProblem(rand, difficulty, find) {
    if (find === "speed")    return genFindSpeed(rand, difficulty);
    if (find === "distance") return genFindDistance(rand, difficulty);
    return genFindTime(rand, difficulty);
}
