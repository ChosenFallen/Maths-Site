import { randInt } from "./utils.js";

export default {
    id: "recurring-decimals-to-fractions",
    label: "Recurring Decimals to Fractions",
    instruction() {
        return "Convert each recurring decimal to a fraction in its simplest form. Brackets show the repeating part, e.g. 0.(3) = 0.333…";
    },
    printTitle() {
        return "Recurring Decimals to Fractions";
    },
    generate(rand, difficulty, count) {
        const pool = getPool(difficulty);

        let all = [...pool];
        while (all.length < count) all = all.concat([...pool]);
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }

        return all.slice(0, count).map(({ question, answer }) => ({ question, answer }));
    },
};

function getPool(difficulty) {
    if (difficulty === "easy") {
        // /9 fractions (one-digit repeating, bracket notation) — 8 unique
        // /11 fractions (two-digit repeating)                  — 10 unique
        // /33 fractions (two-digit repeating, different start) — 2 unique
        // Total: 20 unique
        return [
            { question: "0.(1) =", answer: "1/9" },
            { question: "0.(2) =", answer: "2/9" },
            { question: "0.(3) =", answer: "1/3" },
            { question: "0.(4) =", answer: "4/9" },
            { question: "0.(5) =", answer: "5/9" },
            { question: "0.(6) =", answer: "2/3" },
            { question: "0.(7) =", answer: "7/9" },
            { question: "0.(8) =", answer: "8/9" },
            { question: "0.(09) =", answer: "1/11" },
            { question: "0.(18) =", answer: "2/11" },
            { question: "0.(27) =", answer: "3/11" },
            { question: "0.(36) =", answer: "4/11" },
            { question: "0.(45) =", answer: "5/11" },
            { question: "0.(54) =", answer: "6/11" },
            { question: "0.(63) =", answer: "7/11" },
            { question: "0.(72) =", answer: "8/11" },
            { question: "0.(81) =", answer: "9/11" },
            { question: "0.(90) =", answer: "10/11" },
            { question: "0.(12) =", answer: "4/33" },
            { question: "0.(21) =", answer: "7/33" },
        ];
    } else if (difficulty === "normal") {
        // /7 (6-digit repeating): 6 unique
        // /6 and /12 (mixed):     6 unique
        // /15 (mixed):            5 unique
        // /30 (mixed):            5 unique
        // Total: 22 unique
        return [
            { question: "0.(142857) =", answer: "1/7" },
            { question: "0.(285714) =", answer: "2/7" },
            { question: "0.(428571) =", answer: "3/7" },
            { question: "0.(571428) =", answer: "4/7" },
            { question: "0.(714285) =", answer: "5/7" },
            { question: "0.(857142) =", answer: "6/7" },
            { question: "0.1(6) =", answer: "1/6" },
            { question: "0.8(3) =", answer: "5/6" },
            { question: "0.08(3) =", answer: "1/12" },
            { question: "0.41(6) =", answer: "5/12" },
            { question: "0.58(3) =", answer: "7/12" },
            { question: "0.91(6) =", answer: "11/12" },
            { question: "0.1(3) =", answer: "2/15" },
            { question: "0.2(6) =", answer: "4/15" },
            { question: "0.4(6) =", answer: "7/15" },
            { question: "0.5(3) =", answer: "8/15" },
            { question: "0.7(3) =", answer: "11/15" },
            { question: "0.0(3) =", answer: "1/30" },
            { question: "0.2(3) =", answer: "7/30" },
            { question: "0.3(6) =", answer: "11/30" },
            { question: "0.4(3) =", answer: "13/30" },
            { question: "0.5(6) =", answer: "17/30" },
        ];
    } else {
        // Hard: mix of /7, /11, /12, /13, /14 and tricky mixed patterns
        // Total: 22 unique
        return [
            { question: "0.(142857) =", answer: "1/7" },
            { question: "0.(285714) =", answer: "2/7" },
            { question: "0.(571428) =", answer: "4/7" },
            { question: "0.(714285) =", answer: "5/7" },
            { question: "0.(857142) =", answer: "6/7" },
            { question: "0.(076923) =", answer: "1/13" },
            { question: "0.(153846) =", answer: "2/13" },
            { question: "0.(230769) =", answer: "3/13" },
            { question: "0.(307692) =", answer: "4/13" },
            { question: "0.(384615) =", answer: "5/13" },
            { question: "0.(09) =", answer: "1/11" },
            { question: "0.(18) =", answer: "2/11" },
            { question: "0.(27) =", answer: "3/11" },
            { question: "0.(45) =", answer: "5/11" },
            { question: "0.(63) =", answer: "7/11" },
            { question: "0.08(3) =", answer: "1/12" },
            { question: "0.41(6) =", answer: "5/12" },
            { question: "0.58(3) =", answer: "7/12" },
            { question: "0.91(6) =", answer: "11/12" },
            { question: "0.07(142857) =", answer: "1/14" },
            { question: "0.2(142857) =", answer: "3/14" },
            { question: "0.3(571428) =", answer: "5/14" },
        ];
    }
}
