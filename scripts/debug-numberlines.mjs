import { WORKSHEET_TYPES } from "../worksheets/groups.js";

function mulberry32(seed) {
    let s = seed >>> 0;
    return function() {
        s += 0x6D2B79F5; let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const ws = WORKSHEET_TYPES.find(w => w.id === 'number-lines');

for (const type of ['midpoint', 'missing', 'add', 'mark']) {
    console.log(`\n=== ${type} ===`);
    const rand = mulberry32(99);
    const problems = ws.generate(rand, 'normal', 2, { questionType: type });
    for (const p of problems) {
        console.log(`  Q: ${p.question}`);
        console.log(`  A: ${p.answer}`);
        console.log(`  HTML:\n${p.questionHtml}\n`);
    }
}
