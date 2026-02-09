import addition from "../worksheets/types/addition.js";
import subtraction from "../worksheets/types/subtraction.js";
import multiplication from "../worksheets/types/multiplication.js";
import division from "../worksheets/types/division.js";
import mixed from "../worksheets/types/mixed.js";
import indices from "../worksheets/types/indices.js";
import simplifyFractions from "../worksheets/types/simplify-fractions.js";
import equivalentFractions from "../worksheets/types/equivalent-fractions.js";
import fractionAddSub from "../worksheets/types/fraction-add-sub.js";
import fractionMulDiv from "../worksheets/types/fraction-mul-div.js";
import mixedNumbers from "../worksheets/types/mixed-numbers.js";
import fdpFractionToDecimal from "../worksheets/types/fdp-fraction-to-decimal.js";
import fdpDecimalToFraction from "../worksheets/types/fdp-decimal-to-fraction.js";
import fdpFractionToPercent from "../worksheets/types/fdp-fraction-to-percent.js";
import fdpPercentToFraction from "../worksheets/types/fdp-percent-to-fraction.js";
import fdpDecimalToPercent from "../worksheets/types/fdp-decimal-to-percent.js";
import fdpPercentToDecimal from "../worksheets/types/fdp-percent-to-decimal.js";
import equations from "../worksheets/types/equations.js";

const TYPES = [
    addition,
    subtraction,
    multiplication,
    division,
    mixed,
    indices,
    simplifyFractions,
    equivalentFractions,
    fractionAddSub,
    fractionMulDiv,
    mixedNumbers,
    fdpFractionToDecimal,
    fdpDecimalToFraction,
    fdpFractionToPercent,
    fdpPercentToFraction,
    fdpDecimalToPercent,
    fdpPercentToDecimal,
    equations,
];

const SAMPLE_COUNT = 50;
const MAX_ABS_ANSWER = 999;
const MAX_BY_TYPE = {
    multiplication: 10000,
    equations: 10000,
    mixed: Number.POSITIVE_INFINITY,
    indices: 5000,
};
const DUPLICATE_TOLERANCE = {
    indices: 40,
    "simplify-fractions": 10,
    "fraction-add-sub": 10,
    "mixed-numbers": 15,
    "equivalent-fractions": 8,
};

function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function checkType(type) {
    const rand = mulberry32(123456);
    const optionsList = [undefined];

    if (type.id === "mixed") optionsList.push({ includePowers: true });
    if (type.id === "fraction-add-sub")
        optionsList.push({ denominatorMode: "like" }, { denominatorMode: "unlike" });
    if (type.id === "fraction-mul-div")
        optionsList.push({ fractionMulDivMode: "multiply" }, { fractionMulDivMode: "divide" });
    if (type.id === "fraction-compare")
        optionsList.push({ fractionCompareMode: "no-equals" });
    if (type.id === "mixed-numbers")
        optionsList.push({ mixedNumberMode: "to-improper" }, { mixedNumberMode: "to-mixed" });
    if (type.id === "equations")
        optionsList.push({ equationMode: "one" }, { equationMode: "two" });

    const errors = [];

    if (typeof type.instruction !== "function") {
        errors.push("Missing instruction() for worksheet type.");
    }
    if (type.options) {
        if (!Array.isArray(type.options)) {
            errors.push("Options must be an array.");
        } else {
            type.options.forEach((opt) => {
                if (!opt.id || !opt.type) {
                    errors.push("Option missing id or type.");
                }
                if (opt.type === "select" && !Array.isArray(opt.values)) {
                    errors.push(`Option "${opt.id}" missing values.`);
                }
                if (opt.default === undefined) {
                    errors.push(`Option "${opt.id}" missing default.`);
                } else if (opt.type === "select") {
                    const valid = opt.values.some((v) => v.value === opt.default);
                    if (!valid) {
                        errors.push(`Option "${opt.id}" default not in values.`);
                    }
                }
            });
        }
    }

    optionsList.forEach((options) => {
        const problems = type.generate(rand, "normal", SAMPLE_COUNT, options);
        if (!Array.isArray(problems) || problems.length === 0) {
            errors.push("No problems generated.");
            return;
        }

        if (type.instruction) {
            const instruction = type.instruction(options || {});
            if (!instruction || !instruction.trim()) {
                errors.push("Instruction returned empty text.");
            }
        }

        if (typeof type.printTitle !== "function") {
            errors.push("Missing printTitle() for worksheet type.");
        } else {
            const expectedTitle = expectedPrintTitle(type, options || {});
            const actualTitle = type.printTitle(options || {});
            if (actualTitle !== expectedTitle) {
                errors.push(
                    `Print title mismatch: expected "${expectedTitle}", got "${actualTitle}".`,
                );
            }
        }

        const seen = new Set();
        let duplicates = 0;
        for (const p of problems) {
            const key = p.questionHtml || p.question || JSON.stringify(p);
            if (seen.has(key)) duplicates++;
            seen.add(key);

            if (Number.isNaN(p.answer)) errors.push("Answer is NaN.");

            if (typeof p.answer === "number") {
                const max = MAX_BY_TYPE[type.id] ?? MAX_ABS_ANSWER;
                if (Math.abs(p.answer) > max) {
                    errors.push(`Answer too large: ${p.answer}.`);
                }
            }

            if (typeof p.answer === "string") {
                const match = p.answer.match(/^(-?\d+)\/(\d+)$/);
                if (match) {
                    const den = parseInt(match[2], 10);
                    if (den === 1) errors.push("Fraction answer denominator is 1.");
                }
            }

            const html = `${p.questionHtml || ""} ${p.answerHtml || ""}`;
            if (/class="bottom">1<\/span>/.test(html)) {
                errors.push("Fraction HTML contains denominator 1.");
            }
        }

        const isFdp = type.id.startsWith("fdp-");
        const tolerance = DUPLICATE_TOLERANCE[type.id] ?? 5;
        if (!isFdp && duplicates > tolerance) {
            errors.push(`High duplicates: ${duplicates}/${problems.length}.`);
        }
    });

    return errors;
}

function expectedPrintTitle(type, options) {
    const typeId = type.id;
    if (typeId === "equations") {
        const mode = options?.equationMode || "mixed";
        if (mode === "one") return "One-Step Equations";
        if (mode === "two") return "Two-Step Equations";
        return "Solving Equations";
    }
    if (typeId === "fraction-add-sub") {
        const mode = options?.denominatorMode || "mixed";
        if (mode === "like") return "Add/Subtract Fractions (Same Denominators)";
        if (mode === "unlike")
            return "Add/Subtract Fractions (Different Denominators)";
        return "Add/Subtract Fractions";
    }
    if (typeId === "fraction-mul-div") {
        const mode = options?.fractionMulDivMode || "mixed";
        if (mode === "multiply") return "Multiply Fractions";
        if (mode === "divide") return "Divide Fractions";
        return "Multiply/Divide Fractions";
    }
    if (typeId === "mixed-numbers") {
        const mode = options?.mixedNumberMode || "mixed";
        if (mode === "to-improper") return "Mixed to Improper Fractions";
        if (mode === "to-mixed") return "Improper to Mixed Fractions";
        return "Mixed Numbers/Improper Fractions";
    }
    if (typeId === "mixed") return "Mixed Operations";
    return type.label;
}

let totalErrors = 0;
for (const type of TYPES) {
    const errors = checkType(type);
    if (errors.length) {
        totalErrors += errors.length;
        console.log(`❌ ${type.id}:`);
        errors.forEach((e) => console.log(`   - ${e}`));
    } else {
        console.log(`✅ ${type.id}: OK`);
    }
}

if (totalErrors > 0) {
    console.log(`\nFound ${totalErrors} issue(s).`);
    process.exitCode = 1;
} else {
    console.log("\nAll checks passed.");
}
