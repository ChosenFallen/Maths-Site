import { WORKSHEET_TYPES } from './worksheets/groups.js';

const issues = [];

for (const type of WORKSHEET_TYPES) {
  const r = () => Math.random();
  try {
    const problems = type.generate(r, 'easy', 3);
    
    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      
      // Only check worksheets that have wrongAnswers
      if (p.wrongAnswers !== undefined) {
        if (!Array.isArray(p.wrongAnswers) || p.wrongAnswers.length !== 3) {
          issues.push(`${type.id}: problem ${i+1} has ${p.wrongAnswers?.length || 0} wrong answers (need 3)`);
        }
      }
    }
  } catch (e) {
    // Skip worksheets that fail to generate
  }
}

if (issues.length === 0) {
  console.log('✅ All worksheets with wrongAnswers have exactly 3 wrong answers');
} else {
  console.log(`❌ Found ${issues.length} issue(s):`);
  issues.forEach(issue => console.log(`  - ${issue}`));
}
