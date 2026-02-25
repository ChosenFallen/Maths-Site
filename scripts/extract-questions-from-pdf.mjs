import fs from 'fs';
import path from 'path';
import PDFParse from 'pdf-parse';

async function extractQuestions(pdfFilename) {
  const pdfPath = path.join(process.cwd(), 'real past papers', pdfFilename);

  if (!fs.existsSync(pdfPath)) {
    console.error(`PDF not found: ${pdfPath}`);
    return null;
  }

  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await PDFParse(dataBuffer);
    return {
      filename: pdfFilename,
      pages: data.numpages,
      text: data.text,
    };
  } catch (error) {
    console.error(`Error reading ${pdfFilename}:`, error.message);
    return null;
  }
}

// Extract from a 2024 paper
const result = await extractQuestions('1fmay2024.pdf');
if (result) {
  console.log(`=== ${result.filename} ===`);
  console.log(`Pages: ${result.pages}\n`);

  // Clean up text
  const lines = result.text.split('\n').filter(l => l.trim());

  console.log('=== Extracted Questions (cleaned) ===\n');

  // Find question numbers and extract surrounding text
  let currentQuestion = '';
  let questionNum = '';

  for (let i = 0; i < Math.min(lines.length, 200); i++) {
    const line = lines[i].trim();

    // Look for question markers (1, 2, 3, etc. at start of line or after space)
    if (/^\d+\s+/.test(line) || /^\d+$/.test(line)) {
      if (currentQuestion) {
        console.log(`Q${questionNum}: ${currentQuestion.trim()}\n`);
      }
      questionNum = line.match(/^\d+/)[0];
      currentQuestion = line.replace(/^\d+\s*/, '');
    } else if (questionNum && line && !line.match(/^(Total|marks|Turn)/i)) {
      currentQuestion += ' ' + line;
    }
  }

  // Print last question
  if (currentQuestion) {
    console.log(`Q${questionNum}: ${currentQuestion.trim()}\n`);
  }
}
