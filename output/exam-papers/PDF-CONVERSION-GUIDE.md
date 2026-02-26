# PDF Conversion Guide

This guide explains how to convert the markdown exam papers to professionally formatted PDFs with proper spacing, answer boxes, and working areas.

## Requirements

### Windows (Recommended Setup)
1. **Pandoc** - Document converter
   - Download: https://pandoc.org/installing.html
   - Install to default location

2. **MiKTeX** or **TeX Live** - LaTeX distribution
   - MiKTeX (Windows-friendly): https://miktex.org/download
   - Or TeX Live: https://www.tug.org/texlive/

3. **Python 3** (optional, for batch processing)

### macOS / Linux
```bash
# Install via Homebrew (macOS)
brew install pandoc
brew install mactex  # or miktex

# Install via package manager (Linux)
sudo apt-get install pandoc texlive-full
```

## Quick Start (Windows)

### Option 1: Using PowerShell Script (Easiest)

```powershell
cd C:\path\to\exam-papers\series-1

# Convert all papers
$papers = @(
    "foundation\paper-1-noncalc.md",
    "foundation\paper-2-calc.md",
    "foundation\paper-3-calc.md",
    "higher\paper-1-noncalc.md",
    "higher\paper-2-calc.md",
    "higher\paper-3-calc.md"
)

foreach ($paper in $papers) {
    $output = $paper -replace "\.md$", ".pdf"
    Write-Host "Converting: $paper"
    pandoc "$paper" `
        --pdf-engine=xelatex `
        -V geometry:margin=1.5cm `
        -V geometry:top=2cm `
        -V geometry:bottom=2cm `
        -V fontsize=12pt `
        --standalone `
        -o "$output"
}
```

### Option 2: Individual Commands

```bash
# Foundation Papers
pandoc series-1/foundation/paper-1-noncalc.md -o series-1/foundation/paper-1-noncalc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V fontsize=12pt

pandoc series-1/foundation/paper-2-calc.md -o series-1/foundation/paper-2-calc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V fontsize=12pt

pandoc series-1/foundation/paper-3-calc.md -o series-1/foundation/paper-3-calc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V fontsize=12pt

# Higher Papers
pandoc series-1/higher/paper-1-noncalc.md -o series-1/higher/paper-1-noncalc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V fontsize=12pt

pandoc series-1/higher/paper-2-calc.md -o series-1/higher/paper-2-calc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V fontsize=12pt

pandoc series-1/higher/paper-3-calc.md -o series-1/higher/paper-3-calc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V fontsize=12pt
```

### Option 3: Bash Script (macOS / Linux)

Save as `convert-all.sh` and run: `bash convert-all.sh`

```bash
#!/bin/bash

cd series-1

# Function to convert paper
convert_paper() {
    local input="$1"
    local output="${input%.md}.pdf"
    echo "Converting: $input → $output"

    pandoc "$input" \
        --pdf-engine=xelatex \
        -V geometry:margin=1.5cm \
        -V geometry:top=2cm \
        -V geometry:bottom=2cm \
        -V fontsize=12pt \
        --standalone \
        -o "$output"
}

# Convert all papers
convert_paper "foundation/paper-1-noncalc.md"
convert_paper "foundation/paper-2-calc.md"
convert_paper "foundation/paper-3-calc.md"
convert_paper "higher/paper-1-noncalc.md"
convert_paper "higher/paper-2-calc.md"
convert_paper "higher/paper-3-calc.md"

echo "✓ All papers converted successfully!"
```

## Advanced Formatting Options

### Custom Styling
```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=1.5cm \
  -V geometry:top=2cm \
  -V geometry:bottom=2cm \
  -V fontsize=12pt \
  -V linestretch=1.1 \
  -V pagestyle=headings \
  --standalone
```

### Adding Header/Footer
```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V header-includes='\usepackage{fancyhdr}' \
  -V header-includes='\pagestyle{fancy}' \
  -V header-includes='\lhead{GCSE Mathematics}' \
  -V header-includes='\rhead{Practice Paper}' \
  --standalone
```

### With Custom Template
```bash
pandoc input.md \
  --template=latex-template.tex \
  --pdf-engine=xelatex \
  -o output.pdf \
  --standalone
```

## Formatting Features

### Automatic Features Included

1. **Page Numbers** - Displayed at bottom of each page
2. **Header/Footer** - Shows exam type and page information
3. **Line Spacing** - 1.1 line spacing for readability
4. **Margins** - 1.5cm sides, 2cm top/bottom for annotations
5. **Font Size** - 12pt for easy reading

### Manual Features to Add (if needed)

#### Adding Answer Boxes
For answers that need boxes, we've used standard markdown spaces that Pandoc converts to blank lines in PDF. To add more space:

1. Each `(X mark)` is preserved in the PDF
2. Blank lines provide working space
3. Teachers can print and students write in answers

#### Adding Diagrams

Several questions reference diagrams. To add actual diagrams:

**Option 1: Insert images manually**
- After conversion to PDF
- Use PDF editor (Adobe, Preview on Mac)
- Insert image at diagram location

**Option 2: Create TikZ diagrams**
- Add to markdown: `![](diagram.png)`
- Place actual image files in same directory
- Pandoc includes them automatically

**Option 3: Leave as placeholders**
- Current setup shows "[Diagram space - see question paper]"
- Teachers can print and draw/add diagrams

## PDF Organization

### Recommended Output Structure
```
series-1/
├── foundation/
│   ├── paper-1-noncalc.md
│   ├── paper-1-noncalc.pdf    ← Generated
│   ├── paper-2-calc.md
│   ├── paper-2-calc.pdf       ← Generated
│   ├── paper-3-calc.md
│   └── paper-3-calc.pdf       ← Generated
├── higher/
│   ├── paper-1-noncalc.md
│   ├── paper-1-noncalc.pdf    ← Generated
│   ├── paper-2-calc.md
│   ├── paper-2-calc.pdf       ← Generated
│   ├── paper-3-calc.md
│   └── paper-3-calc.pdf       ← Generated
└── answer-schemes/
    └── [Answer schemes PDF or separate documents]
```

## Quality Assurance Checklist

After creating PDFs, verify:

- [ ] All pages display correctly
- [ ] Math equations render properly
- [ ] Page breaks occur in appropriate places
- [ ] Headers and footers are visible
- [ ] Questions are numbered sequentially
- [ ] Mark allocations are clear
- [ ] Tables display correctly
- [ ] Questions fit appropriately with space below

## Troubleshooting

### Problem: "pandoc not found"
**Solution**:
- Check Pandoc installation path
- Add to system PATH or use full path: `C:\Program Files\Pandoc\pandoc.exe`

### Problem: "xelatex not found"
**Solution**:
- Install TeX Live or MiKTeX
- Or use: `--pdf-engine=pdflatex` instead of `xelatex`

### Problem: Math equations don't render
**Solution**:
- Ensure LaTeX is installed properly
- Check equation syntax (use `$...$` for inline, `$$...$$` for display)
- Try: `pandoc --version` to verify LaTeX support

### Problem: Wrong page breaks
**Solution**:
- Add `\pagebreak` or `---` in markdown before questions
- Adjust margins with `-V geometry:margin=`

### Problem: Spacing issues
**Solution**:
- Adjust `linestretch`: `-V linestretch=1.2` (try 1.0-1.5)
- Adjust margins for more space
- Check table formatting

## Batch Processing with Python

### automated-convert.py
```python
#!/usr/bin/env python3
import os
import subprocess
import sys

papers = [
    "series-1/foundation/paper-1-noncalc",
    "series-1/foundation/paper-2-calc",
    "series-1/foundation/paper-3-calc",
    "series-1/higher/paper-1-noncalc",
    "series-1/higher/paper-2-calc",
    "series-1/higher/paper-3-calc",
]

for paper in papers:
    input_file = f"{paper}.md"
    output_file = f"{paper}.pdf"

    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found")
        continue

    print(f"Converting: {input_file}...")

    cmd = [
        "pandoc",
        input_file,
        "-o", output_file,
        "--pdf-engine=xelatex",
        "-V", "geometry:margin=1.5cm",
        "-V", "geometry:top=2cm",
        "-V", "geometry:bottom=2cm",
        "-V", "fontsize=12pt",
        "--standalone"
    ]

    result = subprocess.run(cmd)

    if result.returncode == 0:
        print(f"✓ Created: {output_file}\n")
    else:
        print(f"✗ Error creating {output_file}\n")
        sys.exit(1)

print("✓ All papers converted successfully!")
```

Run with: `python automated-convert.py`

## Final Notes

- PDFs are fully editable by adding printed annotations
- Diagrams can be added manually by teachers
- Answer schemes should be kept separate
- Consider password-protecting answer scheme PDFs
- Test print quality before distributing to students

## Support

For issues with Pandoc: https://pandoc.org/
For LaTeX help: https://www.overleaf.com/
For MiKTeX: https://miktex.org/documentation
