import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Discover worksheet types dynamically from worksheets/types directory
async function discoverWorksheets() {
    const worksheetsDir = join(projectRoot, "worksheets", "types");
    const files = fs.readdirSync(worksheetsDir).filter(file => {
        return file.endsWith(".js") && file !== "utils.js" && file !== "index.js";
    });

    const worksheets = [];
    for (const file of files) {
        try {
            const modulePath = join(worksheetsDir, file);
            const module = await import(`file://${modulePath}`);
            if (module.default) {
                worksheets.push(module.default);
            }
        } catch (error) {
            console.warn(`⚠️  Failed to import ${file}: ${error.message}`);
        }
    }

    // Sort by id for consistent output
    worksheets.sort((a, b) => (a.id || "").localeCompare(b.id || ""));
    return worksheets;
}

const TYPES = await discoverWorksheets();

const SAMPLE_COUNT = 50;
const MAX_ABS_ANSWER = 999;
const MAX_BY_TYPE = {
    multiplication: 10000,
    equations: 10000,
    equation1: 2500,
    equation2: 2500,
    mixed: Number.POSITIVE_INFINITY,
    indices: 5000,
};
const DUPLICATE_TOLERANCE = {
    "advanced-indices": 45,
    "cube-numbers": 40,
    "index-laws": 15,
    indices: 40,
    "square-numbers": 40,
    "odd-even-numbers": 10,
    "place-value": 30,
    "ordering-numbers": 20,
    "triangular-numbers": 40,
    "negative-numbers-ordering": 15,
    "factors-multiples": 30,
    "estimation": 20,
    "hcf-lcm-primes": 25,
    "standard-form-operations": 25,
    "standard-form-multiply-divide": 25,
    "best-buys": 20,
    "inverse-operations": 15,
    "percentages-as-percentage": 25,
    "percentages-multipliers": 20,
    "percentages-repeated": 30,
    "recurring-decimals-to-fractions": 45,
    "simplify-fractions": 10,
    "fraction-add-sub": 10,
    "mixed-numbers": 15,
    "equivalent-fractions": 8,
    "recurring-decimals": 40,
    "fraction-compare": 10,
    "ratio-simplify": 10,
    "percentage-change": 15,
    "prime-factorization": 10,
    "multiplying-terms": 15,
    "factorising-quadratics": 10,
    "equations-fractions": 10,
    "difference-of-two-squares": 25,
    "simplify-algebraic-fractions": 20,
    "simplify-surds": 30,
    "surds-add-sub": 20,
    "surds-expand": 20,
    "surds-rationalise": 25,
    "rearranging-formulae": 30,
    "quadratic-equations": 15,
    "quadratic-inequalities": 25,
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
    const errors = [];

    // Test 1: Check required properties
    if (!type.id || typeof type.id !== "string") {
        errors.push("Missing or invalid id property.");
    }
    if (!type.label || typeof type.label !== "string") {
        errors.push("Missing or invalid label property.");
    }
    if (typeof type.generate !== "function") {
        errors.push("Missing generate() function.");
    }

    const rand = mulberry32(123456);
    const optionsList = [undefined];

    // Test worksheet options
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
    if (type.id === "missing-number")
        optionsList.push({ operation: "addition" }, { operation: "subtraction" });
    if (type.id === "percentage-change")
        optionsList.push({ changeType: "increase" }, { changeType: "decrease" });
    if (type.id === "substitution")
        optionsList.push({ variableMode: "one" }, { variableMode: "two" });
    if (type.id === "expanding-brackets")
        optionsList.push({ bracketMode: "single" }, { bracketMode: "double" });
    if (type.id === "multiplying-terms")
        optionsList.push({ multiplyingTermsMode: "multiply" }, { multiplyingTermsMode: "divide" });
    if (type.id === "rounding")
        optionsList.push({ roundingMode: "dp" }, { roundingMode: "sf" }, { roundingMode: "place" });
    if (type.id === "reverse-percentages")
        optionsList.push({ changeType: "increase" }, { changeType: "decrease" });

    // Test 2: Check instruction function
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

        // Check all problems have required fields
        for (const p of problems) {
            if (!p.question && !p.questionHtml) {
                errors.push("Problem missing both question and questionHtml.");
            }
            if (p.answer === undefined && !p.answerHtml) {
                errors.push("Problem missing both answer and answerHtml.");
            }
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

    // Test 3: Determinism check (same seed = same problems)
    const rand1 = mulberry32(99999);
    const rand2 = mulberry32(99999);
    const problems1 = type.generate(rand1, "easy", 5, {});
    const problems2 = type.generate(rand2, "easy", 5, {});

    for (let i = 0; i < Math.min(problems1.length, problems2.length); i++) {
        const q1 = problems1[i].question || problems1[i].questionHtml;
        const q2 = problems2[i].question || problems2[i].questionHtml;
        if (q1 !== q2) {
            errors.push("Determinism check failed: same seed produced different problems.");
            break;
        }
    }

    // Test 4: All difficulty levels work
    ["easy", "normal", "hard"].forEach((difficulty) => {
        try {
            const testRand = mulberry32(789);
            const testProblems = type.generate(testRand, difficulty, 3, {});
            if (!Array.isArray(testProblems) || testProblems.length === 0) {
                errors.push(`Difficulty "${difficulty}" generated no problems.`);
            }
        } catch (err) {
            errors.push(`Difficulty "${difficulty}" threw error: ${err.message}`);
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
    if (typeId === "missing-number") {
        const mode = options?.operation || "mixed";
        if (mode === "mixed") return "Missing Number";
        const names = { addition: "Addition", subtraction: "Subtraction", multiplication: "Multiplication", division: "Division" };
        return `Missing Number (${names[mode]})`;
    }
    if (typeId === "percentage-change") {
        const mode = options?.changeType || "mixed";
        if (mode === "increase") return "Percentage Increase";
        if (mode === "decrease") return "Percentage Decrease";
        return "Percentage Change";
    }
    if (typeId === "substitution") {
        const mode = options?.variableMode || "one";
        if (mode === "one") return "Substitution (One Variable)";
        return "Substitution (Two Variables)";
    }
    if (typeId === "expanding-brackets") {
        const mode = options?.bracketMode || "mixed";
        if (mode === "single") return "Expanding Single Brackets";
        if (mode === "double") return "Expanding Double Brackets";
        return "Expanding Brackets";
    }
    if (typeId === "multiplying-terms") {
        const mode = options?.multiplyingTermsMode || "mixed";
        if (mode === "multiply") return "Multiplying Terms";
        if (mode === "divide") return "Dividing Terms";
        return "Multiplying and Dividing Terms";
    }
    if (typeId === "rounding") {
        const mode = options?.roundingMode || "mixed";
        if (mode === "dp") return "Rounding to Decimal Places";
        if (mode === "sf") return "Rounding to Significant Figures";
        if (mode === "place") return "Rounding to Place Values";
        return "Rounding";
    }
    if (typeId === "reverse-percentages") {
        const mode = options?.changeType || "mixed";
        if (mode === "increase") return "Reverse Percentages (Increase)";
        if (mode === "decrease") return "Reverse Percentages (Decrease)";
        return "Reverse Percentages";
    }
    if (typeId === "equations-both-sides") return "Equations: Letters on Both Sides";
    if (typeId === "equations-fractions") return "Equations with Fractions";
    if (typeId === "factorising") return "Factorising Expressions";
    if (typeId === "factorising-quadratics") return "Factorising Quadratics";
    if (typeId === "difference-of-two-squares") return "Difference of Two Squares";
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
