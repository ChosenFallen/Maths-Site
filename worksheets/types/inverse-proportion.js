import { randInt } from "./utils.js";

// Find all values w in [minW, maxW] such that:
//   - w divides k exactly
//   - w !== exclude
//   - k/w >= minResult (answer is a reasonable number of days/hours)
function validWorkers(k, exclude, minW, maxW, minResult = 2) {
    const result = [];
    for (let w = minW; w <= maxW; w++) {
        if (w !== exclude && k % w === 0 && k / w >= minResult) {
            result.push(w);
        }
    }
    return result;
}

// Pick answer first: choose (workers2, days2), derive a valid (workers1, days1)
function workersDays(rand, w2Range, d2Range, maxWorkers = 20) {
    const workers2 = randInt(rand, w2Range[0], w2Range[1]);
    const days2    = randInt(rand, d2Range[0], d2Range[1]);
    const k        = workers2 * days2;

    const options = validWorkers(k, workers2, 2, maxWorkers);
    if (options.length === 0) return null;

    const workers1 = options[randInt(rand, 0, options.length - 1)];
    const days1    = k / workers1;
    return { workers1, days1, workers2, days2 };
}

export default {
    id: "inverse-proportion",
    label: "Inverse Proportion",
    instruction() {
        return "Use inverse proportion to solve each problem.";
    },
    printTitle() {
        return "Inverse Proportion";
    },
    generate(rand, difficulty, count) {
        const problems = [];
        let attempts = 0;
        while (problems.length < count && attempts < count * 20) {
            attempts++;
            const p = generateProblem(rand, difficulty);
            if (p) problems.push(p);
        }
        return problems;
    },
};

function generateProblem(rand, difficulty) {
    if (difficulty === "easy") {
        const r = workersDays(rand, [3, 6], [3, 8]);
        if (!r) return null;
        const { workers1, days1, workers2, days2 } = r;
        return {
            question: `${workers1} workers take ${days1} days to complete a job. How long would ${workers2} workers take?`,
            answer: `${days2} days`,
        };
    }

    if (difficulty === "normal") {
        // Workers/days or pipes/hours
        const usePipes = randInt(rand, 0, 1) === 0;
        const r = workersDays(rand, [2, 8], [2, 12]);
        if (!r) return null;
        const { workers1, days1, workers2, days2 } = r;

        if (usePipes) {
            return {
                question: `${workers1} pipes fill a tank in ${days1} hours. How long would ${workers2} pipes take?`,
                answer: `${days2} hours`,
            };
        }
        return {
            question: `${workers1} workers take ${days1} days to complete a job. How long would ${workers2} workers take?`,
            answer: `${days2} days`,
        };
    }

    // hard: workers/days, pipes/hours, or speed/time
    const type = randInt(rand, 0, 2);

    if (type === 0) {
        const r = workersDays(rand, [3, 10], [3, 15]);
        if (!r) return null;
        const { workers1, days1, workers2, days2 } = r;
        return {
            question: `${workers1} workers take ${days1} days to complete a job. How long would ${workers2} workers take?`,
            answer: `${days2} days`,
        };
    }

    if (type === 1) {
        const r = workersDays(rand, [2, 8], [3, 15]);
        if (!r) return null;
        const { workers1: pipes1, days1: hours1, workers2: pipes2, days2: hours2 } = r;
        return {
            question: `${pipes1} pipes fill a tank in ${hours1} hours. How long would ${pipes2} pipes take?`,
            answer: `${hours2} hours`,
        };
    }

    // Speed/time: distance = speed × time is constant
    // Pick answer first: speed2, time2 → distance → find speed1 that divides distance cleanly
    const SPEEDS = [20, 30, 40, 50, 60, 80, 90, 100];
    const speed2 = SPEEDS[randInt(rand, 0, SPEEDS.length - 1)];
    const time2  = randInt(rand, 1, 4);
    const distance = speed2 * time2;

    const validSpeeds = SPEEDS.filter(s => s !== speed2 && distance % s === 0 && distance / s >= 1 && distance / s <= 12);
    if (validSpeeds.length === 0) return null;

    const speed1 = validSpeeds[randInt(rand, 0, validSpeeds.length - 1)];
    const time1  = distance / speed1;
    return {
        question: `A car travelling at ${speed1} km/h takes ${time1} ${time1 === 1 ? "hour" : "hours"} for a journey. How long does the same journey take at ${speed2} km/h?`,
        answer: `${time2} ${time2 === 1 ? "hour" : "hours"}`,
    };
}
