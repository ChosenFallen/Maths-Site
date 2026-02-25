import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const analysisDir = path.join(__dirname, '../past-paper-analysis');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m',
};

function getStatus(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const firstLine = content.split('\n')[0];

    if (firstLine.includes('✅ Complete')) {
      return { status: '✅ Complete', isComplete: true };
    } else if (firstLine.includes('❌ Not Started')) {
      return { status: '❌ Not Started', isComplete: false };
    } else if (firstLine.includes('Status:')) {
      return { status: firstLine.replace('Status: ', ''), isComplete: false };
    }
  } catch (err) {
    return { status: '⚠️  Error reading', isComplete: false };
  }
  return { status: '⚠️  Unknown', isComplete: false };
}

function organize(papers) {
  const completed = [];
  const notStarted = [];

  papers.forEach(paper => {
    if (paper.isComplete) {
      completed.push(paper);
    } else {
      notStarted.push(paper);
    }
  });

  // Sort each group by filename
  completed.sort((a, b) => a.filename.localeCompare(b.filename));
  notStarted.sort((a, b) => a.filename.localeCompare(b.filename));

  return { completed, notStarted };
}

// Read all files
const files = fs.readdirSync(analysisDir)
  .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
  .sort();

const papers = files.map(filename => {
  const filePath = path.join(analysisDir, filename);
  const { status, isComplete } = getStatus(filePath);
  return { filename, status, isComplete };
});

const { completed, notStarted } = organize(papers);

// Display results
console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.blue}📊 Past Paper Analysis Status${colors.reset}`);
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

if (completed.length > 0) {
  console.log(`${colors.green}✅ COMPLETED (${completed.length})${colors.reset}`);
  completed.forEach(paper => {
    console.log(`   ${colors.green}${paper.status}${colors.reset} ${paper.filename}`);
  });
  console.log();
}

if (notStarted.length > 0) {
  console.log(`${colors.red}❌ NOT STARTED (${notStarted.length})${colors.reset}`);
  notStarted.forEach(paper => {
    console.log(`   ${colors.red}${paper.status}${colors.reset} ${paper.filename}`);
  });
  console.log();
}

// Summary
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.gray}Progress: ${completed.length}/${papers.length} papers analyzed${colors.reset}`);
const percentage = papers.length > 0 ? Math.round((completed.length / papers.length) * 100) : 0;
console.log(`${colors.gray}Completion: ${percentage}%${colors.reset}`);
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
