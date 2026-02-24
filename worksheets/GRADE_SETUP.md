# Adding Grades to Worksheets

Each worksheet should include a `grades` property that defines the UK curriculum grade (1-9) for each difficulty level. This allows the teacher questions page to filter by grade range.

## How to Add Grades

Add a `grades` property to each worksheet's `export default` object:

```javascript
export default {
    id: "my-worksheet",
    label: "My Worksheet Title",
    grades: [5, 6, 7],  // [easy, normal, hard]
    instruction() {
        // ...
    },
    // ... rest of worksheet
}
```

## Grade Format

`grades` is an array of three numbers: `[easyGrade, normalGrade, hardGrade]`

- **easy**: Grade for the "easy" difficulty level
- **normal**: Grade for the "normal" difficulty level
- **hard**: Grade for the "hard" difficulty level

Each value should be 1-9 (UK GCSE grades).

## Examples

**Addition (very basic):**
```javascript
grades: [1, 2, 2]
```

**Equations (middle school):**
```javascript
grades: [5, 6, 6]
```

**Trigonometry (advanced):**
```javascript
grades: [8, 9, 9]
```

**Quadratic Formula (highest):**
```javascript
grades: [8, 9, 9]
```

## Grade Mapping Reference

Use this to help assign grades to new worksheets:

| Grade | Topics |
|-------|--------|
| 1-2 | Basic operations (add, subtract), odd/even, place value |
| 3-4 | Times tables, fractions, estimation, area/perimeter basics |
| 5-6 | Equations, simple algebra, harder fractions, ratios, sequences |
| 7-8 | Quadratics, factorising, inequalities, trigonometry basics |
| 8-9 | Advanced algebra, surds, trigonometry, complex inequalities |

## Accessing Grades in Teacher Page

The teacher questions page (`teacher-questions.html`) automatically reads grades from worksheets:

1. Filters worksheets by grade range
2. Randomly selects from eligible worksheets
3. Auto-chooses difficulty level appropriate for selected grades
4. Displays grade with each question

**No other configuration needed** — just add the `grades` property and the system auto-detects it.

## When to Update

- When adding a new worksheet: add `grades` property immediately
- When modifying difficulty ranges: update the `grades` array
- No need to update any other files — the teacher page reads directly from worksheet exports
