import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { WORKSHEET_TYPES } from "../worksheets/groups.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Mulberry32 PRNG for reproducibility
function mulberry32(a) {
    return function() {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

let output = "";
let worksheetsWithWrongAnswers = 0;

output += "# Sample Questions - Worksheets with Wrong Answers\n\n";
output += `Generated: ${new Date().toISOString()}\n\n`;
output += "---\n\n";

for (const worksheet of WORKSHEET_TYPES) {
    try {
        // Generate one problem
        const rand = mulberry32(12345);
        const problems = worksheet.generate(rand, "normal", 1);

        if (!problems || problems.length === 0) {
            continue;
        }

        const problem = problems[0];

        // Skip worksheets without wrong answers
        if (!problem.wrongAnswers || !Array.isArray(problem.wrongAnswers) || problem.wrongAnswers.length === 0) {
            continue;
        }

        worksheetsWithWrongAnswers++;

        output += `## ${worksheet.label || worksheet.id}\n`;
        output += `**ID**: ${worksheet.id}\n`;
        output += `**Grades**: Easy=${worksheet.grades[0]}, Normal=${worksheet.grades[1]}, Hard=${worksheet.grades[2]}\n\n`;

        // Display question
        output += "**Question**: ";
        if (problem.questionHtml) {
            output += `${problem.questionHtml}`;
        } else if (problem.question) {
            output += `${problem.question}`;
        } else {
            output += "(No question text)";
        }
        output += "\n\n";

        // Display answer
        output += "**Answer**: ";
        if (problem.answerHtml) {
            output += `${problem.answerHtml}`;
        } else if (problem.answer) {
            output += `${problem.answer}`;
        } else {
            output += "(No answer)";
        }
        output += "\n\n";

        // Display wrong answers
        output += "**Wrong Answers**:\n";
        problem.wrongAnswers.forEach((wa) => {
            output += `- ${wa}\n`;
        });

        output += "\n---\n\n";
    } catch (error) {
        // Skip worksheets that error
    }
}

// Write to file
const outputPath = join(projectRoot, "worksheet-samples.md");
fs.writeFileSync(outputPath, output, "utf-8");

console.log(`✅ Sample questions written to: ${outputPath}`);
console.log(`Worksheets with wrong answers: ${worksheetsWithWrongAnswers}/${WORKSHEET_TYPES.length}`);
