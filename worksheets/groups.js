import addition from "./types/addition.js";
import subtraction from "./types/subtraction.js";
import multiplication from "./types/multiplication.js";
import division from "./types/division.js";
import mixed from "./types/mixed.js";
import oddEvenNumbers from "./types/odd-even-numbers.js";
import placeValue from "./types/place-value.js";
import orderingNumbers from "./types/ordering-numbers.js";
import triangularNumbers from "./types/triangular-numbers.js";
import negativeNumbersOrdering from "./types/negative-numbers-ordering.js";
import negativeNumbers from "./types/negative-numbers.js";
import indices from "./types/indices.js";
import cubeNumbers from "./types/cube-numbers.js";
import squareNumbers from "./types/square-numbers.js";
import indexLaws from "./types/index-laws.js";
import advancedIndices from "./types/advanced-indices.js";
import simplifyFractions from "./types/simplify-fractions.js";
import equivalentFractions from "./types/equivalent-fractions.js";
import fractionAddSub from "./types/fraction-add-sub.js";
import equations from "./types/equations.js";
import fractionMulDiv from "./types/fraction-mul-div.js";
import mixedNumbers from "./types/mixed-numbers.js";
import fdpFractionToDecimal from "./types/fdp-fraction-to-decimal.js";
import fdpDecimalToFraction from "./types/fdp-decimal-to-fraction.js";
import fdpFractionToPercent from "./types/fdp-fraction-to-percent.js";
import fdpPercentToFraction from "./types/fdp-percent-to-fraction.js";
import fdpDecimalToPercent from "./types/fdp-decimal-to-percent.js";
import fdpPercentToDecimal from "./types/fdp-percent-to-decimal.js";
import decimalAddSub from "./types/decimal-add-sub.js";
import fractionCompare from "./types/fraction-compare.js";
import decimalMulDiv from "./types/decimal-mul-div.js";
import decimalCompare from "./types/decimal-compare.js";
import percentageOfAmount from "./types/percentage-of-amount.js";
import fractionOfAmount from "./types/fraction-of-amount.js";
import recurringDecimals from "./types/recurring-decimals.js";
import ratioSimplify from "./types/ratio-simplify.js";
import hcfLcm from "./types/hcf-lcm.js";
import hcfLcmPrimes from "./types/hcf-lcm-primes.js";
import factorsMultiples from "./types/factors-multiples.js";
import estimation from "./types/estimation.js";
import standardFormOperations from "./types/standard-form-operations.js";
import standardFormMultiplyDivide from "./types/standard-form-multiply-divide.js";
import bestBuys from "./types/best-buys.js";
import inverseOperations from "./types/inverse-operations.js";
import rounding from "./types/rounding.js";
import standardForm from "./types/standard-form.js";
import primeFactorization from "./types/prime-factorization.js";
import missingNumber from "./types/missing-number.js";
import percentageChange from "./types/percentage-change.js";
import substitution from "./types/substitution.js";
import collectingLikeTerms from "./types/collecting-like-terms.js";
import expandingBrackets from "./types/expanding-brackets.js";
import multiplyingTerms from "./types/multiplying-terms.js";
import equationsBothSides from "./types/equations-both-sides.js";
import factorising from "./types/factorising.js";
import factorisingQuadratics from "./types/factorising-quadratics.js";
import reversePercentages from "./types/reverse-percentages.js";
import percentagesAsPercentage from "./types/percentages-as-percentage.js";
import percentagesMultipliers from "./types/percentages-multipliers.js";
import percentagesRepeated from "./types/percentages-repeated.js";
import equationsFractions from "./types/equations-fractions.js";
import recurringDecimalsToFractions from "./types/recurring-decimals-to-fractions.js";
import differenceOfTwoSquares from "./types/difference-of-two-squares.js";
import simplifyAlgebraicFractions from "./types/simplify-algebraic-fractions.js";
import simplifySurds from "./types/simplify-surds.js";
import surdsAddSub from "./types/surds-add-sub.js";
import surdsExpand from "./types/surds-expand.js";
import surdsRationalise from "./types/surds-rationalise.js";
import solvingInequalities from "./types/solving-inequalities.js";
import rearrangingFormulae from "./types/rearranging-formulae.js";
import quadraticEquations from "./types/quadratic-equations.js";
import compoundInequalities from "./types/compound-inequalities.js";
import quadraticInequalities from "./types/quadratic-inequalities.js";
import timesTablesSpeed from "./types/times-tables-speed.js";
import timesTablesMissingFactor from "./types/times-tables-missing-factor.js";
import timesTablesDivisionFacts from "./types/times-tables-division-facts.js";
import timesTablesMixedDrill from "./types/times-tables-mixed-drill.js";
import timesTablesNegative from "./types/times-tables-negative.js";
import systematicListing from "./types/systematic-listing.js";
import areaRectangle from "./types/area-rectangle.js";
import areaTriangle from "./types/area-triangle.js";
import sequencesContinue from "./types/sequences-continue.js";
import sequencesNthTerm from "./types/sequences-nth-term.js";
import sequencesNthTermFractions from "./types/sequences-nth-term-fractions.js";
import sequencesGeometric from "./types/sequences-geometric.js";
import sequencesQuadratic from "./types/sequences-quadratic.js";
import sequencesMissingTerm from "./types/sequences-missing-term.js";
import sequencesFibonacci from "./types/sequences-fibonacci.js";
import sequencesTermToTerm from "./types/sequences-term-to-term.js";
import sequencesPatterns from "./types/sequences-patterns.js";

export const WORKSHEET_TYPES = [
    addition,
    subtraction,
    multiplication,
    division,
    mixed,
    oddEvenNumbers,
    placeValue,
    orderingNumbers,
    triangularNumbers,
    negativeNumbersOrdering,
    negativeNumbers,
    indices,
    cubeNumbers,
    squareNumbers,
    indexLaws,
    advancedIndices,
    simplifyFractions,
    equivalentFractions,
    fractionAddSub,
    equations,
    fractionMulDiv,
    mixedNumbers,
    fdpFractionToDecimal,
    fdpDecimalToFraction,
    fdpFractionToPercent,
    fdpPercentToFraction,
    fdpDecimalToPercent,
    fdpPercentToDecimal,
    decimalAddSub,
    fractionCompare,
    decimalMulDiv,
    decimalCompare,
    percentageOfAmount,
    fractionOfAmount,
    recurringDecimals,
    ratioSimplify,
    hcfLcm,
    hcfLcmPrimes,
    factorsMultiples,
    estimation,
    standardFormOperations,
    standardFormMultiplyDivide,
    bestBuys,
    inverseOperations,
    rounding,
    standardForm,
    primeFactorization,
    missingNumber,
    percentageChange,
    substitution,
    collectingLikeTerms,
    expandingBrackets,
    multiplyingTerms,
    equationsBothSides,
    factorising,
    factorisingQuadratics,
    reversePercentages,
    percentagesAsPercentage,
    percentagesMultipliers,
    percentagesRepeated,
    equationsFractions,
    recurringDecimalsToFractions,
    differenceOfTwoSquares,
    simplifyAlgebraicFractions,
    simplifySurds,
    surdsAddSub,
    surdsExpand,
    surdsRationalise,
    solvingInequalities,
    rearrangingFormulae,
    quadraticEquations,
    compoundInequalities,
    quadraticInequalities,
    timesTablesSpeed,
    timesTablesMissingFactor,
    timesTablesDivisionFacts,
    timesTablesMixedDrill,
    timesTablesNegative,
    systematicListing,
    areaRectangle,
    areaTriangle,
    sequencesContinue,
    sequencesNthTerm,
    sequencesNthTermFractions,
    sequencesGeometric,
    sequencesQuadratic,
    sequencesMissingTerm,
    sequencesFibonacci,
    sequencesTermToTerm,
    sequencesPatterns,
];

export const WORKSHEET_GROUPS = [
    {
        label: "Arithmetic",
        types: [
            "addition",
            "subtraction",
            "multiplication",
            "division",
            "mixed",
            "negative-numbers",
            "negative-numbers-ordering",
            "missing-number",
            "inverse-operations",
            "odd-even-numbers",
            "ordering-numbers",
            "place-value",
            "estimation",
        ],
    },
    {
        label: "Fractions",
        types: [
            "simplify-fractions",
            "equivalent-fractions",
            "fraction-add-sub",
            "fraction-mul-div",
            "mixed-numbers",
            "fraction-compare",
            "fraction-of-amount",
        ],
    },
    {
        label: "Decimals",
        types: ["decimal-add-sub", "decimal-mul-div", "decimal-compare", "recurring-decimals", "recurring-decimals-to-fractions"],
    },
    {
        label: "Percentages",
        types: ["percentage-of-amount", "percentage-change", "reverse-percentages", "percentages-as-percentage", "percentages-multipliers", "percentages-repeated"],
    },
    {
        label: "FDP (Fractions/Decimals/Percentages)",
        types: [
            "fdp-fraction-to-decimal",
            "fdp-decimal-to-fraction",
            "fdp-fraction-to-percent",
            "fdp-percent-to-fraction",
            "fdp-decimal-to-percent",
            "fdp-percent-to-decimal",
        ],
    },
    { label: "Powers", types: ["indices", "cube-numbers", "square-numbers", "index-laws", "advanced-indices"] },
    { label: "Times Tables", types: ["times-tables-speed", "times-tables-missing-factor", "times-tables-division-facts", "times-tables-mixed-drill", "times-tables-negative", "systematic-listing"] },
    {
        label: "Algebra",
        types: [
            "equations",
            "equations-both-sides", "equations-fractions",
            "substitution", "collecting-like-terms", "expanding-brackets", "multiplying-terms",
            "factorising", "factorising-quadratics", "difference-of-two-squares", "simplify-algebraic-fractions",
            "solving-inequalities", "rearranging-formulae",
            "quadratic-equations", "compound-inequalities", "quadratic-inequalities",
        ],
    },
    { label: "Ratio & Proportion", types: ["ratio-simplify", "best-buys"] },
    {
        label: "Number Theory",
        types: ["hcf-lcm", "hcf-lcm-primes", "factors-multiples", "triangular-numbers", "rounding", "standard-form", "standard-form-operations", "standard-form-multiply-divide", "prime-factorization"],
    },
    { label: "Surds", types: ["simplify-surds", "surds-add-sub", "surds-expand", "surds-rationalise"] },
    { label: "Sequences", types: ["sequences-continue", "sequences-nth-term", "sequences-nth-term-fractions", "sequences-geometric", "sequences-quadratic", "sequences-missing-term", "sequences-fibonacci", "sequences-term-to-term", "sequences-patterns"] },
    { label: "Measurement & Geometry", types: ["area-rectangle", "area-triangle"] },
];
