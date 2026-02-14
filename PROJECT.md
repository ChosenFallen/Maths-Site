# Maths Site - Project Documentation

## Project Overview

This is an educational mathematics web application that generates printable worksheets with customizable difficulty levels and deterministic random number generation. The site also includes interactive math games.

**Key Features:**
- 28+ different worksheet types covering arithmetic, fractions, decimals, percentages, algebra, and more
- Three difficulty levels: Easy, Normal, Hard
- Deterministic worksheet generation using seeded random numbers
- Shareable worksheet IDs for reproducible problem sets
- Print-friendly formatting with answer keys
- Interactive math games (Simon, Target Number, Maths Challenge, Buzz Quiz)

## Project Structure

```
Maths Site/
├── worksheets/               # Main worksheet generator application
│   ├── index.html           # Worksheet generator UI
│   ├── worksheet.js         # Core worksheet logic (main controller)
│   ├── worksheet.css        # Worksheet styling
│   └── types/               # Individual worksheet type modules
│       ├── utils.js         # Shared utility functions (randInt, gcd, lcm, etc.)
│       ├── addition.js      # Addition worksheets
│       ├── subtraction.js   # Subtraction worksheets
│       ├── multiplication.js
│       ├── division.js
│       ├── mixed.js         # Mixed operations (BODMAS)
│       ├── indices.js       # Powers and roots
│       ├── simplify-fractions.js
│       ├── equivalent-fractions.js
│       ├── fraction-add-sub.js
│       ├── fraction-mul-div.js
│       ├── fraction-compare.js
│       ├── fraction-of-amount.js
│       ├── mixed-numbers.js # Mixed/improper fractions
│       ├── fdp-*.js         # Fraction/Decimal/Percentage conversions (6 files)
│       ├── decimal-add-sub.js
│       ├── decimal-mul-div.js
│       ├── decimal-compare.js
│       ├── percentage-of-amount.js
│       ├── equations.js     # Two-step equations
│       └── recurring-decimals.js
├── games/                   # Interactive math games
│   ├── simon/              # Memory game
│   ├── target-number/      # Number puzzle game
│   ├── maths-challenge/    # Timed math problems
│   └── buzz-quiz/          # Quiz game with buzzer
├── css/                    # Global styles
├── index.html              # Main landing page
└── worksheets-ideas.md     # Future worksheet ideas

```

## Architecture

### Core Concepts

#### 1. **Deterministic Random Number Generation**

The system uses a **seeded random number generator** (Mulberry32 algorithm) to ensure that the same worksheet ID always produces identical problems.

**Why this matters:**
- Teachers can share worksheet IDs with students
- Students get the same problems from the same ID
- Reproducible for grading and verification

**Implementation:**
```javascript
// In worksheet.js
function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
```

A worksheet ID is constructed from:
- Base ID (random 8-character string)
- Worksheet type (e.g., "addition")
- Difficulty (easy/normal/hard)
- Number of problems
- Optional parameters (encoded as key=value pairs)

Format: `baseId|type|difficulty|numProblems|options`
Example: `abc12345|addition|normal|20`

#### 2. **Worksheet Type Modules**

Each worksheet type is a self-contained ES6 module that exports an object with this structure:

```javascript
export default {
    id: "worksheet-id",           // Unique identifier
    label: "Display Name",         // Human-readable name

    // Optional: Function returning instruction text
    instruction(options) {
        return "Instructions for students";
    },

    // Optional: Function returning print title
    printTitle(options) {
        return "Title for Printed Sheet";
    },

    // Optional: Configuration options for the worksheet
    options: [
        {
            id: "option-id",
            label: "Option Label",
            type: "checkbox" | "select",
            default: value,
            values: [{ value: "val", label: "Label" }] // for select only
        }
    ],

    // Required: Generate problems
    generate(rand, difficulty, count, options) {
        // rand: seeded random function (call it instead of Math.random)
        // difficulty: "easy" | "normal" | "hard"
        // count: number of problems to generate
        // options: object with option values

        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push({
                question: "Problem text",           // Plain text question
                questionHtml: "<span>...</span>",  // HTML version (optional)
                answer: "Answer value",             // Plain text answer
                answerHtml: "<span>...</span>",    // HTML version (optional)
                answerKeyHtml: "<span>...</span>", // Custom answer key (optional)
                answerPrefix: "= "                  // Prefix for answer (optional)
            });
        }
        return problems;
    }
};
```

**Key Points:**
- Always use the `rand` function instead of `Math.random()` for determinism
- Return an array of problem objects
- Use `questionHtml` for formatted questions (fractions, special symbols)
- Use `answerHtml` for formatted answers
- Difficulty levels typically map to number ranges (see utils.js)

#### 3. **Difficulty Levels**

Standard difficulty ranges (from `utils.js`):
```javascript
function difficultyRange(difficulty) {
    switch (difficulty) {
        case "easy":   return [1, 10];
        case "normal": return [1, 50];
        case "hard":   return [1, 100];
    }
}
```

**However**, each worksheet type can define custom difficulty logic:
- `recurring-decimals.js` uses different fractions per difficulty
- `indices.js` uses different exponent ranges
- `equations.js` varies equation complexity

#### 4. **Uniqueness Checking**

The system attempts to generate unique problems:
- Builds a "key" from each problem (question text or HTML)
- Tracks seen problems in a Set
- Retries generation if duplicate detected
- Falls back to allowing duplicates if range is too small

```javascript
function generateUniqueProblems(type, rand, difficulty, count, options) {
    const problems = [];
    const seen = new Set();
    const maxAttempts = Math.max(50, count * 10);

    while (problems.length < count && attempts < maxAttempts) {
        const [problem] = type.generate(rand, difficulty, 1, options);
        const key = buildProblemKey(problem);
        if (!seen.has(key)) {
            seen.add(key);
            problems.push(problem);
        }
    }
    // ... fallback logic
}
```

## Utility Functions (utils.js)

### Number Generation
- `randInt(rand, min, max)` - Generate random integer in range
- `difficultyRange(difficulty)` - Get min/max for difficulty level

### Mathematical Operations
- `applyOp(x, y, op)` - Apply operator (+, −, ×, ÷)
- `isHighPrecedence(op)` - Check if operator is × or ÷
- `getRandomFactor(value, rand)` - Get a random factor of a number
- `gcd(a, b)` - Greatest common divisor
- `lcm(a, b)` - Least common multiple
- `ensureNonUnitDenominator(numerator, denominator)` - Prevent whole numbers in fraction problems

## HTML Formatting Conventions

### Fractions
Use the `.frac` class with top/bottom spans:
```javascript
questionHtml: `<span class="frac"><span class="top">3</span><span class="bottom">4</span></span>`
```

CSS handles the fraction rendering:
```css
.frac {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
}
.frac .top, .frac .bottom {
    display: block;
}
.frac .top {
    border-bottom: 1px solid;
}
```

### Recurring Decimals
Use positioned dots above digits:
```javascript
html += `<span style="position: relative; display: inline-block;">
    ${digit}
    <span style="position: absolute; top: -0.6em; left: 50%; transform: translateX(-50%);">·</span>
</span>`;
```

### Special Characters
- Use Unicode: × (multiply), ÷ (divide), − (minus sign)
- Avoid HTML entities in question strings (use in HTML only)

## Worksheet Groups

Worksheets are organized into logical groups in the UI:

```javascript
const WORKSHEET_GROUPS = [
    { label: "Arithmetic", types: ["addition", "subtraction", "multiplication", "division", "mixed"] },
    { label: "Fractions", types: [...] },
    { label: "Decimals", types: [...] },
    { label: "Percentages", types: [...] },
    { label: "FDP (Fractions/Decimals/Percentages)", types: [...] },
    { label: "Powers", types: ["indices"] },
    { label: "Algebra", types: ["equations"] }
];
```

## Adding a New Worksheet Type

### Step 1: Create the Module

Create a new file in `worksheets/types/`, e.g., `ratio-simplify.js`:

```javascript
import { randInt, gcd } from "./utils.js";

export default {
    id: "ratio-simplify",
    label: "Simplifying Ratios",

    instruction() {
        return "Simplify each ratio to its simplest form.";
    },

    printTitle() {
        return "Simplifying Ratios";
    },

    generate(rand, difficulty, count) {
        const problems = [];
        const maxVal = difficulty === "easy" ? 20 : difficulty === "normal" ? 50 : 100;

        for (let i = 0; i < count; i++) {
            // Generate a common factor
            const factor = randInt(rand, 2, 10);
            // Generate the simplified ratio
            const a = randInt(rand, 1, maxVal / factor);
            const b = randInt(rand, 1, maxVal / factor);
            // Multiply by factor to create unsimplified ratio
            const unsimplifiedA = a * factor;
            const unsimplifiedB = b * factor;

            problems.push({
                question: `${unsimplifiedA} : ${unsimplifiedB}`,
                answer: `${a} : ${b}`
            });
        }

        return problems;
    }
};
```

### Step 2: Import and Register

In `worksheets/worksheet.js`:

1. Add import at top:
```javascript
import ratioSimplify from "./types/ratio-simplify.js";
```

2. Add to `WORKSHEET_TYPES` array:
```javascript
const WORKSHEET_TYPES = [
    // ... existing types
    ratioSimplify,
];
```

3. Add to appropriate group in `WORKSHEET_GROUPS`:
```javascript
{
    label: "Ratio & Proportion",
    types: ["ratio-simplify"]
}
```

### Step 3: Test

1. Open `worksheets/index.html` in a browser
2. Select your new worksheet type
3. Generate worksheets at each difficulty level
4. Verify problems are correct and unique
5. Test with same ID to ensure determinism

## Code Conventions

### Random Number Usage
❌ **WRONG:**
```javascript
const a = Math.floor(Math.random() * 10) + 1;
```

✅ **CORRECT:**
```javascript
const a = randInt(rand, 1, 10);
```

### Difficulty Handling
Different approaches are acceptable:

**Approach 1: Use difficultyRange**
```javascript
const [min, max] = difficultyRange(difficulty);
const a = randInt(rand, min, max);
```

**Approach 2: Custom logic**
```javascript
const maxVal = difficulty === "easy" ? 10 : difficulty === "normal" ? 50 : 100;
```

**Approach 3: Different problem types**
```javascript
if (difficulty === "easy") {
    // Simple fractions like 1/3, 2/3
    return easyFractions;
} else if (difficulty === "normal") {
    // Mixed fractions like 1/6, 5/12
    return normalFractions;
} else {
    // Complex fractions like 1/7, 1/13
    return hardFractions;
}
```

### Preventing Division by Zero
```javascript
let divisor = randInt(rand, min, max);
if (divisor === 0) divisor = 1;
// Or use a range that excludes zero:
let divisor = randInt(rand, 1, max);
```

### Fraction Simplification
Always simplify fractions before presenting:
```javascript
const g = gcd(numerator, denominator);
const n = numerator / g;
const d = denominator / g;
```

### Answer Key Formatting
- Use `answerPrefix` for equals signs: `answerPrefix: "= "`
- Use `answerKeyHtml` for complex formatting with question included
- Use `answerHtml` for just the answer with HTML

## Common Patterns

### Pattern 1: Basic Arithmetic
```javascript
generate(rand, difficulty, count) {
    const [min, max] = difficultyRange(difficulty);
    const problems = [];

    for (let i = 0; i < count; i++) {
        const a = randInt(rand, min, max);
        const b = randInt(rand, min, max);
        const answer = a + b; // or -, *, /

        problems.push({
            question: `${a} + ${b} =`,
            answer: answer
        });
    }

    return problems;
}
```

### Pattern 2: Fractions with HTML
```javascript
generate(rand, difficulty, count) {
    const problems = [];

    for (let i = 0; i < count; i++) {
        const numerator = randInt(rand, 1, 10);
        const denominator = randInt(rand, 2, 10);

        const questionHtml = `<span class="frac"><span class="top">${numerator}</span><span class="bottom">${denominator}</span></span>`;
        const decimal = numerator / denominator;

        problems.push({
            questionHtml: questionHtml,
            question: `${numerator}/${denominator}`,
            answer: decimal.toFixed(2)
        });
    }

    return problems;
}
```

### Pattern 3: Pre-defined Problem Sets
```javascript
generate(rand, difficulty, count) {
    const problems = [];
    const baseFractions = getFractionsForDifficulty(difficulty);

    // Shuffle and select
    let fractions = [];
    while (fractions.length < count) {
        fractions = fractions.concat([...baseFractions]);
    }

    // Fisher-Yates shuffle
    for (let i = fractions.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [fractions[i], fractions[j]] = [fractions[j], fractions[i]];
    }

    fractions = fractions.slice(0, count);

    // Generate problems from selected fractions
    // ...

    return problems;
}
```

### Pattern 4: Options Handling
```javascript
export default {
    id: "equations",
    label: "Equations",

    options: [
        {
            id: "equationMode",
            label: "Equation Type",
            type: "select",
            default: "mixed",
            values: [
                { value: "one", label: "One-step equations (x + a = b)" },
                { value: "two", label: "Two-step equations (ax + b = c)" },
                { value: "mixed", label: "Mixed" }
            ]
        }
    ],

    generate(rand, difficulty, count, options) {
        const mode = options.equationMode || "mixed";

        if (mode === "one") {
            // Generate one-step equations
        } else if (mode === "two") {
            // Generate two-step equations
        } else {
            // Generate mixed
        }
    }
};
```

## Print Functionality

The worksheet is print-optimized:
- Answer key is hidden on screen (`display: none`)
- But visible when printed (CSS `@media print` rules)
- Clean layout without UI controls
- Page breaks handled automatically

## Technical Notes

### Browser Compatibility
- Uses ES6 modules (requires modern browser)
- Uses `navigator.clipboard` API for copying
- No build step required - runs directly in browser

### File Organization
- All worksheet types are independent modules
- Shared utilities in `utils.js`
- Main controller in `worksheet.js`
- No external dependencies (vanilla JS)

### State Management
- State is encoded in the worksheet ID
- No client-side storage needed
- Worksheet regenerates from ID

## Future Development

See `worksheets-ideas.md` for planned worksheet types:
- Ratio & Proportion (simplifying, sharing, direct/inverse proportion)
- Sequences (linear, quadratic, Fibonacci)
- Rounding (decimal places, significant figures)
- Statistics (mean, median, mode, range)
- Algebra (expanding brackets, factorizing, substitution)
- Geometry (angles, area, perimeter, volume)
- And 150+ more topics

## Troubleshooting

### Worksheet ID doesn't reproduce same problems
- Check that you're using `rand()` instead of `Math.random()`
- Ensure all randomization happens in `generate()` function
- Verify no external state affects generation

### Fractions not rendering correctly
- Check HTML structure: `<span class="frac"><span class="top">...</span><span class="bottom">...</span></span>`
- Ensure CSS is loaded
- Verify no conflicting styles

### Duplicates appearing
- Small number ranges for the difficulty level
- Consider expanding the range or reducing max problems
- System will show "Note: Range too small to avoid all duplicates"

## Contact & Contribution

This is an educational project for generating math worksheets. When adding new worksheet types:
1. Follow the module pattern
2. Use seeded random numbers
3. Test at all difficulty levels
4. Verify uniqueness
5. Check print layout
6. Update WORKSHEET_GROUPS if adding new category

---

*Last Updated: February 2026*
