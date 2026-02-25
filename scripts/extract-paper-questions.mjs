import fs from 'fs';
import path from 'path';
import PDFParse from 'pdf-parse';

async function extractPaperQuestions(pdfFilename) {
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

// Extract from first 2024 paper as a sample
const result = await extractPaperQuestions('1fmay2024.pdf');
if (result) {
  console.log(`=== ${result.filename} ===`);
  console.log(`Pages: ${result.pages}\n`);
  console.log('Content (first 3000 chars):\n');
  console.log(result.text.substring(0, 3000));
  console.log('\n...[truncated]...');
}
