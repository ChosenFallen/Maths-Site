# Markdown Formatting Guide for PDF Conversion

These exam papers are written in Markdown with LaTeX formatting for mathematical expressions. They can be converted to PDF using various tools.

## LaTeX Math Formatting Used

### Inline Math (within text)
Use `$...$` for inline expressions:
- `$x = 5$` renders as: x = 5
- `$\frac{3}{4}$` renders as: 3/4
- `$2x^2 - 3x + 1$` renders as: 2x² - 3x + 1

### Display Math (centered, on separate line)
Use `$$...$$` for display equations:
```
$$y = 2x^2 - 4x + 1$$
```

### Common LaTeX Commands Used
- `\frac{a}{b}` - fractions (a/b)
- `x^2` - exponents/powers
- `\sqrt{x}` - square root
- `\times` - multiplication sign ×
- `\div` - division sign ÷
- `\le` - less than or equal ≤
- `\ge` - greater than or equal ≥
- `\pm` - plus-minus ±
- `\approx` - approximately ≈
- `\degree` - degree symbol °
- `\pi` - pi symbol π
- `\infty` - infinity ∞

## Converting Markdown to PDF

### Option 1: Pandoc (Recommended)
```bash
pandoc paper-1-noncalc.md -o paper-1-noncalc.pdf \
  --pdf-engine=xelatex \
  --template=eisvogel \
  -V geometry:margin=2cm
```

### Option 2: Markdown to PDF Online Tools
- Dillinger.io
- Markdown2PDF
- StackEdit

### Option 3: LaTeX Direct Conversion
Convert markdown to LaTeX first:
```bash
pandoc paper-1-noncalc.md -o paper-1-noncalc.tex
# Then compile with pdflatex or xelatex
```

## Markdown Structure

Each paper follows this structure:

```markdown
# Title
**Metadata** (Exam Board, Tier, Duration, Marks, Calculator)

---

## Instructions
[Instructions for students]

---

## Questions

### Question 1
[Question text with LaTeX math]
**Answer:** [Space for answer] ([Mark count])

---

## Answer Scheme
[Table with answers and marking]
```

## Tables in Markdown

Tables use standard markdown format:
```markdown
| Column 1 | Column 2 | Column 3 |
|---|---|---|
| Data 1 | Data 2 | Data 3 |
```

## Diagrams and Figures

Currently marked with:
- `*[Description] diagram would be shown*`
- `*Diagram to be completed*`
- `*Graph paper space*`

These should be replaced with actual diagrams when converting to PDF, or left as-is for digital completion.

## Next Steps

1. All 6 Series 1 papers will follow this format
2. When complete, run Pandoc to convert all to PDF
3. Can add header/footer with exam details
4. Can customize styling with LaTeX templates

## Additional Resources

- Pandoc Documentation: https://pandoc.org/
- LaTeX Math Mode: https://en.wikibooks.org/wiki/LaTeX/Mathematics
- Eisvogel Template: https://github.com/Wandmalfarbe/pandoc-latex-template
