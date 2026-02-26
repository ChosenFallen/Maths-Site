# Quick Start: Convert Papers to PDF

## Step 1: Install Required Software (First Time Only)

### Install Pandoc
1. Go to: https://pandoc.org/installing.html
2. Download the Windows installer
3. Run the installer (keep default settings)
4. Restart your computer

### Check You Have LaTeX
You have **MiKTeX 2.9** installed ✓ (needed for PDF generation)

## Step 2: Convert Papers (Easy Method)

### Option A: Use the Provided PowerShell Script (Recommended)

1. **Open PowerShell** in the exam-papers directory:
   - Navigate to: `e:\OneDrive\Coding\Javascript\Maths Site\exam-papers`
   - Hold **Shift + Right Click** → "Open PowerShell window here"

2. **Copy and paste this command**:
```powershell
$papers = @(
    "series-1\foundation\paper-1-noncalc.md",
    "series-1\foundation\paper-2-calc.md",
    "series-1\foundation\paper-3-calc.md",
    "series-1\higher\paper-1-noncalc.md",
    "series-1\higher\paper-2-calc.md",
    "series-1\higher\paper-3-calc.md"
)

foreach ($paper in $papers) {
    $output = $paper -replace "\.md$", ".pdf"
    $folder = Split-Path $output
    if (!(Test-Path $folder)) { New-Item -ItemType Directory -Path $folder -Force | Out-Null }
    Write-Host "Converting: $paper to $output"
    & pandoc "$paper" -o "$output" --pdf-engine=xelatex -V geometry:margin=1.5cm -V geometry:top=2cm -V geometry:bottom=2cm -V fontsize=12pt
    Write-Host "✓ Done`n"
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "All papers converted successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
```

3. **Press Enter** and wait for the conversion to complete (takes ~30 seconds per paper)

### Option B: Manual Command (Command Prompt)

Open **Command Prompt** in the exam-papers directory and run:

```cmd
REM Foundation Papers
pandoc series-1\foundation\paper-1-noncalc.md -o series-1\foundation\paper-1-noncalc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V geometry:top=2cm -V fontsize=12pt

pandoc series-1\foundation\paper-2-calc.md -o series-1\foundation\paper-2-calc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V geometry:top=2cm -V fontsize=12pt

pandoc series-1\foundation\paper-3-calc.md -o series-1\foundation\paper-3-calc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V geometry:top=2cm -V fontsize=12pt

REM Higher Papers
pandoc series-1\higher\paper-1-noncalc.md -o series-1\higher\paper-1-noncalc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V geometry:top=2cm -V fontsize=12pt

pandoc series-1\higher\paper-2-calc.md -o series-1\higher\paper-2-calc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V geometry:top=2cm -V fontsize=12pt

pandoc series-1\higher\paper-3-calc.md -o series-1\higher\paper-3-calc.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V geometry:top=2cm -V fontsize=12pt
```

## Step 3: Check Your PDFs

After conversion completes, you'll have:

```
series-1/
├── foundation/
│   ├── paper-1-noncalc.pdf    ✓
│   ├── paper-2-calc.pdf       ✓
│   ├── paper-3-calc.pdf       ✓
└── higher/
    ├── paper-1-noncalc.pdf    ✓
    ├── paper-2-calc.pdf       ✓
    └── paper-3-calc.pdf       ✓
```

## PDF Features Included

✅ **Professional Formatting**
- 12pt font for readability
- 1.5cm margins for annotations
- 1.1 line spacing for clarity

✅ **Answer Spaces**
- Questions have clear mark allocations
- Blank space below each question for working
- Designated answer area

✅ **Working Space**
- Adequate space between questions
- Room for calculations
- Space for explanations

✅ **Structure**
- Page numbers at bottom
- Header with exam details
- Professional layout

## Customization Options

### Add More Space for Working
Replace `fontsize=12pt` with `fontsize=11pt` for more space, or `geometry:margin=1cm` for smaller margins.

### Add Diagram Placeholders
Diagrams are marked with spaces in the PDF. You can:
1. Print the PDF
2. Add diagrams by hand or photograph
3. Re-scan and save as new PDF

### Custom Paper Size
Add: `-V geometry:papersize=a3` for larger paper (A3 instead of A4)

## Troubleshooting

### Error: "pandoc is not recognized"
1. Restart your computer after installing Pandoc
2. If still not working, use full path:
```powershell
& "C:\Program Files\Pandoc\pandoc.exe" paper-1.md -o paper-1.pdf
```

### Error: "xelatex not found"
- You have MiKTeX installed. Try running:
```powershell
& "C:\Program Files\MiKTeX 2.9\miktex\bin\x64\xelatex.exe" --version
```
- If not found, install TeX Live: https://www.tug.org/texlive/

### PDFs Look Wrong
1. Check that Pandoc and LaTeX installed correctly
2. Try using `pdflatex` instead: `--pdf-engine=pdflatex`
3. Reduce complexity: add `-V colorlinks:false`

## Next Steps

1. ✅ Convert papers to PDF (above)
2. 📋 Review the PDFs for:
   - Question clarity
   - Spacing adequacy
   - Diagram placement
3. 🎨 (Optional) Add diagrams manually:
   - Print PDFs
   - Add diagrams by hand
   - Scan back to PDF
4. 📚 Use with students:
   - Print for practice
   - Monitor student annotations
   - Collect and assess

## Full Documentation

For more advanced options, see:
- `PDF-CONVERSION-GUIDE.md` - Comprehensive guide
- `FORMATTING.md` - All formatting options
- `INDEX.md` - Paper overview and usage

## Questions?

If conversions fail:
1. Check Pandoc installation: `pandoc --version`
2. Check LaTeX: `xelatex --version`
3. Verify file paths exist
4. Try a single paper first before all 6

Good luck! The PDFs should be ready to use within minutes! 🎉
