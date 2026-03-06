# Multiple Choice Distractors Update Guide

## Status Summary

**Completed Updates** (12 files):
- ✅ addition.js
- ✅ subtraction.js
- ✅ multiplication.js
- ✅ division.js
- ✅ square-numbers.js
- ✅ cube-numbers.js
- ✅ times-tables-mixed-drill.js
- ✅ times-tables-division-facts.js
- ✅ times-tables-missing-factor.js
- ✅ times-tables-speed.js
- ✅ negative-numbers.js
- ✅ decimal-add-sub.js

## Remaining Files by Category

### Decimal & Comparison (3 files)
- decimal-compare.js
- decimal-mul-div.js
- rounding.js

**Update Pattern**: Add `generateNumericDistracters()` to import, wrap answer in wrongAnswers

### Integer/Ordering Comparison (4 files)
- ordering-numbers.js
- negative-numbers-ordering.js
- odd-even-numbers.js
- best-buys.js

**Update Pattern**: Same as numeric files - import and add wrongAnswers

### Times-Tables Variants (1 file)
- times-tables-negative.js

**Update Pattern**: Add generateNumericDistracters, wrap answer in wrongAnswers field

### Triangular & Systematic (2 files)
- triangular-numbers.js
- systematic-listing.js

**Update Pattern**: Convert string answers to numeric in distractor generation

### Indices & Powers (2 files)
- indices.js
- advanced-indices.js
- index-laws.js

**Update Pattern**: Numeric answers; use generateNumericDistracters()

### Estimation & Rounding (2 files)
- estimation.js
- rounding.js

**Update Pattern**: Numeric answers with generateNumericDistracters()

### Factors & Primes (3 files)
- factors-multiples.js
- hcf-lcm.js
- hcf-lcm-primes.js
- prime-factorization.js

**Update Pattern**: For numeric/count answers, use generateNumericDistracters()

### Fractions & FDP (12 files)
**Simple Numeric Fractions:**
- equivalent-fractions.js
- simplify-fractions.js
- mixed-numbers.js

**Pattern**: Use generateNumericDistracters() for numerator/denominator counts

**Add/Subtract/Multiply/Divide Fractions (4):**
- fraction-add-sub.js
- fraction-mul-div.js
- fraction-compare.js
- fraction-of-amount.js

**Pattern**: Custom fraction distractors (off-by-one in numerator, reciprocal, halved, doubled)

**FDP Conversions (6):**
- fdp-decimal-to-fraction.js
- fdp-decimal-to-percent.js
- fdp-fraction-to-decimal.js
- fdp-fraction-to-percent.js
- fdp-percent-to-decimal.js
- fdp-percent-to-fraction.js

**Pattern**: Numeric distractors for percentage/decimal conversion answers

**Other Fraction:**
- simplify-algebraic-fractions.js
- algebraic-fractions-add-sub.js
- algebraic-fractions-equations.js
- algebraic-fractions-mul-div.js

**Pattern**: Custom algebraic expression distractors

### Sequences (7 files)
- sequences-continue.js
- sequences-fibonacci.js
- sequences-geometric.js
- sequences-missing-term.js
- sequences-nth-term.js
- sequences-nth-term-fractions.js
- sequences-quadratic.js
- sequences-patterns.js

**Pattern**: Numeric/algebraic distractors based on answer type

### Algebra & Equations (15 files)
**Basic Equations:**
- equations.js (already analyzed)
- equations-both-sides.js
- equations-fractions.js
- inverse-operations.js
- missing-number.js

**Pattern**: Numeric answer (x value) → use generateNumericDistracters()

**Expanding/Factoring:**
- expanding-brackets.js
- factorising.js
- factorising-quadratics.js
- difference-of-two-squares.js

**Pattern**: Algebraic expression answers → custom distractor logic:
  - Wrong operation (+ instead of −)
  - Missing terms
  - Wrong coefficient
  - Incomplete factorization

**Advanced Equations:**
- quadratic-equations.js (has multi-answer handling)
- quadratic-equations-ctq.js
- quadratic-formula.js
- quadratic-inequalities.js
- simultaneous-equations.js

**Pattern**: Multi-answer or algebraic → custom logic

**Collecting/Substitution:**
- collecting-like-terms.js
- multiplying-terms.js
- substitution.js
- rearranging-formulae.js
- completing-the-square.js

**Pattern**: Algebraic expression answers → custom distractor logic

### Inequalities (2 files)
- solving-inequalities.js
- compound-inequalities.js

**Pattern**: Range/set answers → context-specific distractors

### Graphs & Functions (1 file)
- linear-graphs.js

**Pattern**: Coordinate/equation answers → custom logic

### Geometry & Measurement (9 files)
- area-rectangle.js
- area-triangle.js
- circles.js
- perimeter.js
- volume.js (if exists)
- density-mass-volume.js
- trigonometry.js
- pythagoras.js
- direct-proportion.js
- inverse-proportion.js

**Pattern**: Numeric answers with formula-based distractors
- Common mistakes: forgot to divide/multiply
- Wrong formula component
- Off-by-factor errors

### Speed, Distance, Time (1 file)
- speed-distance-time.js

**Pattern**: Numeric answer → generateNumericDistracters()

### Standard Form (3 files)
- standard-form.js
- standard-form-operations.js
- standard-form-multiply-divide.js

**Pattern**: Numeric/scientific notation answers

### Surds (3 files)
- surds-add-sub.js
- surds-expand.js
- surds-rationalise.js

**Pattern**: Surd expression answers → algebraic distractor logic

### Probability & Statistics (3 files)
- basic-probability.js
- mean-median-mode-range.js (if single answer)

**Pattern**: Numeric fraction/probability → numeric or fraction distractors

### Ratio & Proportion (3 files)
- ratio-simplify.js
- ratio-sharing.js
- percentage-change.js
- percentage-of-amount.js
- percentages-as-percentage.js
- percentages-multipliers.js
- percentages-repeated.js
- reverse-percentages.js

**Pattern**: Numeric percentage/ratio answers → generateNumericDistracters()

---

## Implementation Templates

### Template 1: Simple Numeric Distractors
```javascript
import { randInt, generateNumericDistracters } from "./utils.js";

// In generate function:
const answer = /* calculate answer */;
problems.push({
    question: questionStr,
    answer,
    wrongAnswers: generateNumericDistracters(answer, rand),
});
```

### Template 2: Fraction Distractors
```javascript
function generateFractionDistracters(numerator, denominator, rand) {
    const distractors = [];

    // Reciprocal
    distractors.push(`${denominator}/${numerator}`);

    // Off-by-one numerator
    if (numerator > 1) distractors.push(`${numerator-1}/${denominator}`);
    else distractors.push(`${numerator+1}/${denominator}`);

    // Doubled
    distractors.push(`${numerator*2}/${denominator}`);

    return distractors.slice(0, 3);
}
```

### Template 3: Algebraic Expression Distractors
```javascript
function generateAlgebraicDistracters(expression, rand) {
    // For collected terms like "3x + 2", create variations:
    // - Wrong sign: "-3x + 2"
    // - Missing term: "3x"
    // - Doubled: "6x + 4"
    // - Reciprocal coefficient: "x/3 + 2"
}
```

### Template 4: Multi-Answer (No distractors needed - set as empty array)
For equations with 2 answers (quadratic), sets (inequalities), etc.:
```javascript
problems.push({
    question: questionStr,
    answer: answerStr,
    wrongAnswers: [], // Multi-answer questions don't use wrongAnswers
});
```

---

## Guidelines for Each Category

### Numeric Answers (45 files)
Use `generateNumericDistracters(answer, rand)` - handles:
- Off by 1
- Off by 1 (negative)
- Doubled
- Halved
- Added to itself
- Sign flip
- 50% more
- Power of 10 additions

### Algebraic Expression Answers (20 files)
Create context-specific distractors based on common mistakes:
- Wrong sign (missing minus)
- Missing term (forgot to include constant, coefficient)
- Wrong operation (added instead of multiplied)
- Incomplete factorization
- Wrong variable power

### Fraction Answers (12 files)
Custom distractor patterns:
- Reciprocal: swap numerator/denominator
- Off-by-one: change numerator or denominator by 1
- Doubled/halved: multiply or divide numerator/denominator by 2
- Unsimplified version: multiply by common factor

### Multi-Answer Questions (8 files)
Leave `wrongAnswers` empty or set to `[]` - not applicable for:
- Quadratic equations (2 roots)
- Simultaneous equations (coordinate pair)
- Inequalities (set notation)
- Sets/ranges

---

## Testing After Updates

Run `npm test` to validate:
1. All worksheets generate without errors
2. Answer quality is maintained
3. Duplicate answer tolerance is respected

```bash
npm test
```

---

## Next Steps

1. Update remaining numeric answer files using Template 1
2. Update algebraic files using Template 3 with custom logic
3. Update fraction files using Template 2 or custom logic
4. Verify all files with `npm test`
5. Remove this guide once complete

**Last Updated**: 2026-03-06
**Files Updated**: 12/109
**Remaining**: 97 files (88% to complete)
