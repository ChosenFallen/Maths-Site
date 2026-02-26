# Maths Site: Interactive Worksheets & GCSE Exam Papers

A comprehensive mathematics education platform featuring 67+ interactive worksheets and complete GCSE exam paper series.

## 📋 Quick Navigation

### 🎓 For Students & Teachers
- **[Worksheets](worksheets/)** - 67 interactive worksheets covering GCSE curriculum
- **[Teacher Questions](worksheets/teacher-questions.html)** - Mixed-topic question generator
- **[Exam Papers](output/exam-papers/)** - Complete practice exam papers (Series 1)

### 📚 Documentation
- **[Curriculum Mapping](docs/curriculum/GCSE-CURRICULUM.md)** - Full GCSE curriculum breakdown
- **[Project Guide](docs/guides/PROJECT.md)** - Comprehensive project overview
- **[Past Paper Analysis](docs/analysis/)** - Analysis of 54 official GCSE papers (2017-2024)

### 📊 Resources
- **[Example PDFs](output/pdfs/)** - Generated worksheet PDFs (60+)
- **[Papers Analysis](output/papers-analysis.html)** - Interactive visualization of past papers
- **[Archive](archive/)** - Historical materials and reference papers

## 🚀 Getting Started

### View Worksheets
1. Open `index.html` in a web browser
2. Select a worksheet category
3. Choose difficulty level (Easy/Normal/Hard)
4. Generate questions with a specific seed for reproducibility

### Generate Exam Papers
See [Exam Papers Guide](output/exam-papers/QUICK-START-PDF.md) for PDF conversion instructions.

### Run Tests
```bash
npm test              # Validate all worksheets
npm run generate-pdfs # Create PDF examples
npm run check-papers  # Verify paper structure
```

## 📁 Project Structure

```
.
├── worksheets/                  # Interactive worksheet system
│   ├── types/                  # 67 individual worksheet definitions
│   ├── groups.js              # Worksheet registry
│   ├── utils.js               # Shared utilities
│   ├── worksheet.js           # Browser entry point
│   ├── worksheet.css          # Styling
│   └── teacher-questions.html # Mixed-topic generator
│
├── output/                    # Generated outputs
│   ├── exam-papers/          # GCSE exam paper series
│   │   ├── README.md         # Overview
│   │   ├── QUICK-START-PDF.md # PDF conversion guide
│   │   ├── series-1/         # Series 1 papers (6 complete)
│   │   └── latex-template.tex # PDF formatting template
│   ├── pdfs/                 # Worksheet PDFs
│   └── papers-analysis.html  # Past papers analysis tool
│
├── docs/                      # Documentation
│   ├── curriculum/           # GCSE curriculum references
│   ├── analysis/            # Past paper analysis (54 papers)
│   └── guides/              # Project guides
│
├── scripts/                   # Build & validation scripts
├── css/                       # Stylesheets
├── js/                        # Frontend JavaScript
├── games/                     # Interactive games
├── archive/                   # Historical materials
└── index.html                 # Main entry point
```

## 📊 What's Included

### Worksheets (67 total)
- **Number** - 15 worksheets (place value, fractions, percentages, indices, etc.)
- **Algebra** - 22 worksheets (expressions, equations, sequences, functions, graphs)
- **Ratio & Proportion** - 10 worksheets (ratios, proportions, best buys, etc.)
- **Geometry** - 11 worksheets (shapes, area, volume, transformations, trigonometry)
- **Probability** - 4 worksheets (outcomes, rules, diagrams)
- **Statistics** - 5 worksheets (data handling, presentation, analysis)

### Features
✅ Seeded random generation (reproducible questions)
✅ Difficulty levels (Easy/Normal/Hard with UK GCSE grades 1-9)
✅ LaTeX/KaTeX rendering for mathematical expressions
✅ PDF export capability
✅ Teacher question generator with grid/list views
✅ Complete GCSE curriculum alignment

### Exam Papers
- 6 complete papers (3 Foundation, 3 Higher)
- 142 questions across 480 marks
- Based on analysis of 54 official GCSE papers
- Answer schemes and marking guides included

## 🔧 Development

### Add a New Worksheet
1. Create `worksheets/types/[id].js` with generation function
2. Import in `worksheets/groups.js`
3. Add to `WORKSHEET_TYPES` array
4. Run `npm test` to validate

### Validation & Testing
```bash
npm test  # Checks for:
          # - Duplicate questions (per DUPLICATE_TOLERANCE)
          # - Answer quality
          # - Registry coverage
```

## 📝 Key Technologies
- **Frontend**: Vanilla JavaScript, KaTeX (math rendering)
- **PDF Generation**: Puppeteer + Pandoc
- **Random Generation**: Seeded PRNG (Mulberry32) for reproducibility
- **Testing**: Node.js validation scripts

## 📖 Learning Resources

- [GCSE Curriculum Reference](docs/curriculum/GCSE-CURRICULUM.md)
- [Topic Mapping Guide](docs/curriculum/TOPIC-MAPPING.md)
- [Past Paper Trends](docs/analysis/) - 54 papers analyzed (2017-2024)
- [Grade Research](docs/curriculum/grade-research.md) - Grade distribution analysis

## 🤝 Contributing

To add a worksheet:
1. Ensure it follows the problem generation pattern (pick answer first)
2. Include `grades: [easy, normal, hard]` property with UK GCSE 1-9 ratings
3. Use KaTeX for mathematical expressions with plaintext fallback
4. Test with `npm test`

## 📄 License

This project is designed for educational purposes.

---

**Last Updated**: February 2026
**Status**: Series 1 Exam Papers Complete ✅ | 67 Worksheets Validated ✅
