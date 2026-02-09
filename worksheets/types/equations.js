import equation1 from "./equation1.js";
import equation2 from "./equation2.js";
import { randInt } from "./utils.js";

export default {
    id: "equations",
    label: "Solving Equations",
    generate(rand, difficulty, count, options = {}) {
        const problems = [];
        const mode = options.equationMode || "mixed";

        for (let i = 0; i < count; i++) {
            const useTwoStep =
                mode === "two"
                    ? true
                    : mode === "one"
                      ? false
                      : randInt(rand, 0, 1) === 0;

            const [problem] = useTwoStep
                ? equation2.generate(rand, difficulty, 1)
                : equation1.generate(rand, difficulty, 1);

            problems.push(problem);
        }

        return problems;
    },
};
