#!/usr/bin/env node
/**
 * Worksheet Verification Tool
 *
 * Usage: node verify-worksheet.mjs "iuzhny7f|equations-both-sides|normal|20|includeNegativeCoefficients=1"
 *
 * Replace the seed code with your actual worksheet code.
 */

import { WORKSHEET_TYPES } from "./worksheets/groups.js";

const code = process.argv[2] || "iuzhny7f|equations-both-sides|normal|20|includeNegativeCoefficients=1";

const parts = code.split("|");
const seedStr = parts[0];
const worksheetId = parts[1];
const difficulty = parts[2];
const count = parseInt(parts[3]) || 20;
const optionsStr = parts[4];

function seedToNumber(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function evaluateExpression(expr, xValue) {
    try {
        let result = expr;
        result = result.replace(/−/g, "-");
        result = result.replace(/(\d)\(/g, "$1*(");
        result = result.replace(/(\d)x/g, "$1*" + xValue);
        result = result.replace(/-x/g, "-" + xValue);
        result = result.replace(/\+x/g, "+" + xValue);
        result = result.replace(/^x(?![0-9])/, "" + xValue);
        result = result.replace(/\s+x(?![0-9])/g, "*" + xValue);
        const func = new Function("return " + result);
        return func();
    } catch {
        return null;
    }
}

const options = {};
if (optionsStr) {
    const [key, value] = optionsStr.split("=");
    options[key] = value === "1" || value === "true";
}

const seed = seedToNumber(seedStr);
console.log(`\n📋 Worksheet Verification\n`);
console.log(`  Seed: ${seedStr}`);
console.log(`  Type: ${worksheetId}`);
console.log(`  Difficulty: ${difficulty}`);
console.log(`  Count: ${count}`);
console.log(`  Options: ${JSON.stringify(options)}\n`);

const worksheet = WORKSHEET_TYPES.find(t => t.id === worksheetId);
if (!worksheet) {
    console.log("❌ Worksheet not found!");
    process.exit(1);
}

const rand = mulberry32(seed);
const problems = worksheet.generate(rand, difficulty, count, options);

console.log("=".repeat(70) + "\n");

let wrongCount = 0;
const wrongProblems = [];

problems.forEach((p, i) => {
    const question = p.question.replace(/−/g, "-");
    const answerMatch = p.answer.match(/x\s*=\s*([-\d.]+)/);

    if (!answerMatch) {
        console.log(`#${i+1}: ${question}`);
        console.log(`     ${p.answer} (could not parse)\n`);
        return;
    }

    const x = parseFloat(answerMatch[1]);
    const [leftStr, rightStr] = question.split("=").map(s => s.trim());
    const leftVal = evaluateExpression(leftStr, x);
    const rightVal = evaluateExpression(rightStr, x);

    const isCorrect = leftVal !== null && rightVal !== null && Math.abs(leftVal - rightVal) < 0.0001;

    if (isCorrect) {
        console.log(`#${i+1}: ${question}`);
        console.log(`     x = ${x} ✓\n`);
    } else {
        wrongCount++;
        wrongProblems.push({num: i+1, question, x, leftVal, rightVal});
        console.log(`#${i+1}: ${question}`);
        console.log(`     x = ${x} ✗ WRONG (${leftVal} ≠ ${rightVal})\n`);
    }
});

console.log("=".repeat(70));
console.log(`\n📊 Result: ${problems.length - wrongCount}/${problems.length} correct\n`);

if (wrongCount > 0) {
    console.log(`⚠️  FOUND ${wrongCount} INCORRECT ANSWERS:\n`);
    wrongProblems.forEach(wp => {
        console.log(`#${wp.num}: ${wp.question}`);
        console.log(`   Your answer: x = ${wp.x}`);
        console.log(`   Left side: ${wp.leftVal}`);
        console.log(`   Right side: ${wp.rightVal}`);
        console.log();
    });
} else {
    console.log(`✅ All answers are mathematically correct!\n`);
}
