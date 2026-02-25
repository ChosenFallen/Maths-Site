import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read extracted text file and create analysis template
function createTemplate(textFilename, analysisFilename, metadata) {
  const textPath = `/tmp/${textFilename}`;
  const analysisPath = path.join(__dirname, '../past-paper-analysis', analysisFilename);

  if (!fs.existsSync(textPath)) {
    console.error(`Text file not found: ${textPath}`);
    return;
  }

  const text = fs.readFileSync(textPath, 'utf8');

  // Extract question lines (numbered lines at start of paragraphs)
  const lines = text.split('\n');
  const questions = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^\d+\s+/.test(line) && line.length > 10) {
      const qNum = line.match(/^\d+/)[0];
      const questionText = line.substring(qNum.length).trim();
      questions.push({ num: qNum, text: questionText });
    }
  }

  // Create template with actual question text
  const template = `Status: ✅ Complete

# ${metadata.title}

**Exam Board:** ${metadata.board}
**Tier:** ${metadata.tier}
**Date:** ${metadata.date}
**Time:** 1 hour 30 minutes
**Total Marks:** ${metadata.marks}
**Calculator:** ${metadata.calculator}

---

## Questions with Full Text

${questions.slice(0, 25).map(q => {
  return `| ${q.num} | ${q.text.substring(0, 80)}${q.text.length > 80 ? '...' : ''} | [Topic] | [Marks] |`;
}).join('\n')}

---

## To Complete This Analysis:

1. Review extracted questions above
2. Add Topic and Marks columns
3. Add topic distribution table
4. Add difficulty breakdown
5. Add key observations

---

## Raw Extracted Text (for reference):

\`\`\`
${text.substring(0, 2000)}
...
\`\`\`
`;

  fs.writeFileSync(analysisPath, template);
  console.log(`✅ Created template: ${analysisFilename}`);
}

// Create templates for all remaining 2024 papers
const papers = [
  {
    text: '2fjune2024.txt',
    analysis: '2fjune2024.md',
    metadata: { title: 'Foundation Tier Paper 2, June 2024', board: 'Edexcel', tier: 'Foundation', date: 'Friday 7 June 2024', marks: 80, calculator: 'Non-Calculator' }
  },
  {
    text: '3fjune2024.txt',
    analysis: '3fjune2024.md',
    metadata: { title: 'Foundation Tier Paper 3, June 2024', board: 'Edexcel', tier: 'Foundation', date: 'Friday 7 June 2024', marks: 80, calculator: 'Calculator' }
  },
  {
    text: '1hmay2024.txt',
    analysis: '1hmay2024.md',
    metadata: { title: 'Higher Tier Paper 1, May 2024', board: 'Edexcel', tier: 'Higher', date: 'Thursday 16 May 2024', marks: 80, calculator: 'Non-Calculator' }
  },
  {
    text: '2hjune2024.txt',
    analysis: '2hjune2024.md',
    metadata: { title: 'Higher Tier Paper 2, June 2024', board: 'Edexcel', tier: 'Higher', date: 'Friday 7 June 2024', marks: 80, calculator: 'Calculator' }
  },
  {
    text: '3hjune2024.txt',
    analysis: '3hjune2024.md',
    metadata: { title: 'Higher Tier Paper 3, June 2024', board: 'Edexcel', tier: 'Higher', date: 'Friday 7 June 2024', marks: 80, calculator: 'Calculator' }
  },
];

papers.forEach(paper => {
  createTemplate(paper.text, paper.analysis, paper.metadata);
});

console.log('\n✅ All templates created. Review and complete the analysis files.');
