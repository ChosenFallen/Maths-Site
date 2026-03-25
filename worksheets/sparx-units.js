// Sparx Curriculum — Unit Data (Y7–Y9)
// Ordered array of units; each entry has topicIds (Sparx topic codes) and
// worksheetIds (keys into WORKSHEET_TYPES) that cover that unit.
// sequence is 0-based across all years/terms.

export const SPARX_UNITS = [

  // ── Year 7 Term 1 ──────────────────────────────────────────────────────────

  {
    id: "Y7T1U1", year: 7, term: 1, unit: 1, sequence: 0,
    unitName: "Number Sense",
    topicIds: ["M763","M704","M522","M527","M111","M431"],
    worksheetIds: ["number-lines|normal|20","place-value|normal|20","ordering-numbers|normal|20","decimal-compare|normal|20","negative-numbers-ordering|normal|20","rounding|easy|20"],
  },
  {
    id: "Y7T1U2", year: 7, term: 1, unit: 2, sequence: 1,
    unitName: "Adding and Subtracting",
    topicIds: ["M928","M429","M347","M152"],
    worksheetIds: ["addition|normal|20","subtraction|normal|20","decimal-add-sub|normal|20"],
  },
  {
    id: "Y7T1U3", year: 7, term: 1, unit: 3, sequence: 2,
    unitName: "Multiplying",
    topicIds: ["M113","M911","M187","M803"],
    worksheetIds: ["multiplication|normal|20","decimal-mul-div|normal|20"],
  },
  {
    id: "Y7T1U4", year: 7, term: 1, unit: 4, sequence: 3,
    unitName: "Dividing",
    topicIds: ["M462","M354","M873","M262","M491"],
    worksheetIds: ["division|normal|20","decimal-mul-div|normal|20"],
  },
  {
    id: "Y7T1U5", year: 7, term: 1, unit: 5, sequence: 4,
    unitName: "Calculating with Negative Numbers",
    topicIds: ["M106","M288"],
    worksheetIds: ["negative-numbers|normal|20","negative-numbers-multiply|normal|20"],
  },
  {
    id: "Y7T1U6", year: 7, term: 1, unit: 6, sequence: 5,
    unitName: "Order of Operations",
    topicIds: ["M135","M521","M952","M409"],
    worksheetIds: [],
  },
  {
    id: "Y7T1U7", year: 7, term: 1, unit: 7, sequence: 6,
    unitName: "Expressions",
    topicIds: ["M813","M830","M795","M531","M949"],
    worksheetIds: ["collecting-like-terms|normal|20","multiplying-terms|normal|20"],
  },
  {
    id: "Y7T1U8", year: 7, term: 1, unit: 8, sequence: 7,
    unitName: "Substitution",
    topicIds: ["M417","M327","M208","M979"],
    worksheetIds: ["substitution|normal|20"],
  },
  {
    id: "Y7T1U9", year: 7, term: 1, unit: 9, sequence: 8,
    unitName: "Solving Equations",
    topicIds: ["M707","M634","M647"],
    worksheetIds: ["equations|normal|20"],
  },
  {
    id: "Y7T1U10", year: 7, term: 1, unit: 10, sequence: 9,
    unitName: "Time",
    topicIds: ["M515","M892","M627","M963","M747"],
    worksheetIds: [],
  },
  {
    id: "Y7T1U11", year: 7, term: 1, unit: 11, sequence: 10,
    unitName: "Measures",
    topicIds: ["M828","M774","M487"],
    worksheetIds: ["metric-units|normal|20"],
  },

  // ── Year 7 Term 2 ──────────────────────────────────────────────────────────

  {
    id: "Y7T2U1", year: 7, term: 2, unit: 1, sequence: 11,
    unitName: "Line and Shape Properties",
    topicIds: ["M814","M276","M523"],
    worksheetIds: [],
  },
  {
    id: "Y7T2U2", year: 7, term: 2, unit: 2, sequence: 12,
    unitName: "Perimeter",
    topicIds: ["M920","M635","M690"],
    worksheetIds: ["perimeter|normal|20"],
  },
  {
    id: "Y7T2U3", year: 7, term: 2, unit: 3, sequence: 13,
    unitName: "Area",
    topicIds: ["M900","M390","M269","M610","M996"],
    worksheetIds: ["area-rectangle|normal|20","area-triangle|normal|20"],
  },
  {
    id: "Y7T2U4", year: 7, term: 2, unit: 4, sequence: 14,
    unitName: "Coordinates and Shapes",
    topicIds: ["M618","M230"],
    worksheetIds: [],
  },
  {
    id: "Y7T2U5", year: 7, term: 2, unit: 5, sequence: 15,
    unitName: "Factors and Multiples",
    topicIds: ["M227","M823","M698"],
    worksheetIds: ["factors-multiples|normal|20"],
  },
  {
    id: "Y7T2U6", year: 7, term: 2, unit: 6, sequence: 16,
    unitName: "Primes",
    topicIds: ["M322","M108"],
    worksheetIds: ["hcf-lcm-primes|normal|20"],
  },
  {
    id: "Y7T2U7", year: 7, term: 2, unit: 7, sequence: 17,
    unitName: "Writing and Comparing Fractions",
    topicIds: ["M158","M939","M410","M671","M335","M601"],
    worksheetIds: ["equivalent-fractions|normal|20","simplify-fractions|normal|20","fraction-compare|normal|20","mixed-numbers|normal|20"],
  },
  {
    id: "Y7T2U8", year: 7, term: 2, unit: 8, sequence: 18,
    unitName: "Adding and Subtracting Fractions",
    topicIds: ["M835","M931"],
    worksheetIds: ["fraction-add-sub|normal|20"],
  },
  {
    id: "Y7T2U9", year: 7, term: 2, unit: 9, sequence: 19,
    unitName: "Single Brackets",
    topicIds: ["M637","M237","M792","M100"],
    worksheetIds: ["expanding-brackets|normal|20","factorising|normal|20"],
  },

  // ── Year 7 Term 3 ──────────────────────────────────────────────────────────

  {
    id: "Y7T3U1", year: 7, term: 3, unit: 1, sequence: 20,
    unitName: "Angles",
    topicIds: ["M502","M541","M780","M331"],
    worksheetIds: [],
  },
  {
    id: "Y7T3U2", year: 7, term: 3, unit: 2, sequence: 21,
    unitName: "Finding Unknown Angles",
    topicIds: ["M818","M163","M351"],
    worksheetIds: [],
  },
  {
    id: "Y7T3U3", year: 7, term: 3, unit: 3, sequence: 22,
    unitName: "Averages and Range",
    topicIds: ["M328","M934","M841","M940"],
    worksheetIds: ["mean-median-mode-range|normal|20"],
  },
  {
    id: "Y7T3U4", year: 7, term: 3, unit: 4, sequence: 23,
    unitName: "Tables and Charts",
    topicIds: ["M899","M597","M644","M460","M738"],
    worksheetIds: [],
  },
  {
    id: "Y7T3U5", year: 7, term: 3, unit: 5, sequence: 24,
    unitName: "Collecting and Presenting Data",
    topicIds: ["M945","M127","M440"],
    worksheetIds: [],
  },
  {
    id: "Y7T3U6", year: 7, term: 3, unit: 6, sequence: 25,
    unitName: "Proportion Word Problems",
    topicIds: ["M478"],
    worksheetIds: [],
  },
  {
    id: "Y7T3U7", year: 7, term: 3, unit: 7, sequence: 26,
    unitName: "Multiplying and Dividing Fractions",
    topicIds: ["M216","M157","M110","M197","M265"],
    worksheetIds: ["fraction-mul-div|normal|20"],
  },
  {
    id: "Y7T3U8", year: 7, term: 3, unit: 8, sequence: 27,
    unitName: "Fractions of Amounts",
    topicIds: ["M695","M684"],
    worksheetIds: ["fraction-of-amount|normal|20"],
  },
  {
    id: "Y7T3U9", year: 7, term: 3, unit: 9, sequence: 28,
    unitName: "Fractions, Decimals and Percentages",
    topicIds: ["M958","M264","M553","M235"],
    worksheetIds: ["fdp-fraction-to-decimal|normal|20","fdp-decimal-to-fraction|normal|20","fdp-fraction-to-percent|normal|20","fdp-percent-to-fraction|normal|20","fdp-decimal-to-percent|normal|20","fdp-percent-to-decimal|normal|20","percentages-as-percentage|normal|20"],
  },
  {
    id: "Y7T3U10", year: 7, term: 3, unit: 10, sequence: 29,
    unitName: "Theoretical Probability",
    topicIds: ["M655","M941","M938","M755","M718"],
    worksheetIds: ["basic-probability|normal|20"],
  },

  // ── Year 8 Term 1 ──────────────────────────────────────────────────────────

  {
    id: "Y8T1U1", year: 8, term: 1, unit: 1, sequence: 30,
    unitName: "Percentages of Amounts",
    topicIds: ["M437","M905"],
    worksheetIds: ["percentage-of-amount|normal|20"],
  },
  {
    id: "Y8T1U2", year: 8, term: 1, unit: 2, sequence: 31,
    unitName: "Percentage Change",
    topicIds: ["M476","M533"],
    worksheetIds: ["percentage-change|normal|20"],
  },
  {
    id: "Y8T1U3", year: 8, term: 1, unit: 3, sequence: 32,
    unitName: "Calculating with Money",
    topicIds: ["M681"],
    worksheetIds: ["best-buys|normal|20"],
  },
  {
    id: "Y8T1U4", year: 8, term: 1, unit: 4, sequence: 33,
    unitName: "Index Laws",
    topicIds: ["M608","M150","M120","M568"],
    worksheetIds: ["indices|normal|20","index-laws|normal|20","advanced-indices|normal|20","simplify-algebraic-fractions|normal|20"],
  },
  {
    id: "Y8T1U5", year: 8, term: 1, unit: 5, sequence: 34,
    unitName: "Solving Equations",
    topicIds: ["M401","M902","M554","M387","M957"],
    worksheetIds: ["equations|normal|20","equations-both-sides|normal|20","equations-fractions|normal|20"],
  },
  {
    id: "Y8T1U6", year: 8, term: 1, unit: 6, sequence: 35,
    unitName: "Term-to-Term Rules",
    topicIds: ["M381","M241"],
    worksheetIds: ["sequences-term-to-term|normal|20","sequences-continue|normal|20"],
  },
  {
    id: "Y8T1U7", year: 8, term: 1, unit: 7, sequence: 36,
    unitName: "Position-to-Term Rules",
    topicIds: ["M166","M991","M866"],
    worksheetIds: ["sequences-nth-term|normal|20","sequences-patterns|normal|20"],
  },
  {
    id: "Y8T1U8", year: 8, term: 1, unit: 8, sequence: 37,
    unitName: "Ratio",
    topicIds: ["M885","M543","M267","M801","M525"],
    worksheetIds: ["ratio-simplify|normal|20","ratio-sharing|normal|20"],
  },
  {
    id: "Y8T1U9", year: 8, term: 1, unit: 9, sequence: 38,
    unitName: "Scale Diagrams",
    topicIds: ["M112"],
    worksheetIds: [],
  },

  // ── Year 8 Term 2 ──────────────────────────────────────────────────────────

  {
    id: "Y8T2U1", year: 8, term: 2, unit: 1, sequence: 39,
    unitName: "Significant Figures",
    topicIds: ["M994","M131","M878"],
    worksheetIds: ["estimation|normal|20"],
  },
  {
    id: "Y8T2U2", year: 8, term: 2, unit: 2, sequence: 40,
    unitName: "Coordinates and Midpoints",
    topicIds: ["M622","M311"],
    worksheetIds: [],
  },
  {
    id: "Y8T2U3", year: 8, term: 2, unit: 3, sequence: 41,
    unitName: "Area and Units",
    topicIds: ["M291","M705","M728"],
    worksheetIds: [],
  },
  {
    id: "Y8T2U4", year: 8, term: 2, unit: 4, sequence: 42,
    unitName: "Area and Circumference of Circles",
    topicIds: ["M595","M169","M231"],
    worksheetIds: ["circles|normal|20"],
  },
  {
    id: "Y8T2U5", year: 8, term: 2, unit: 5, sequence: 43,
    unitName: "Standard Form",
    topicIds: ["M719","M678"],
    worksheetIds: ["standard-form|normal|20"],
  },
  {
    id: "Y8T2U6", year: 8, term: 2, unit: 6, sequence: 44,
    unitName: "Venn Diagrams",
    topicIds: ["M829","M419"],
    worksheetIds: [],
  },
  {
    id: "Y8T2U7", year: 8, term: 2, unit: 7, sequence: 45,
    unitName: "HCF and LCM using Prime Factors",
    topicIds: ["M365"],
    worksheetIds: ["hcf-lcm-primes|normal|20"],
  },
  {
    id: "Y8T2U8", year: 8, term: 2, unit: 8, sequence: 46,
    unitName: "Nets and Properties of 3D Shapes",
    topicIds: ["M767","M518"],
    worksheetIds: [],
  },
  {
    id: "Y8T2U9", year: 8, term: 2, unit: 9, sequence: 47,
    unitName: "Surface Area",
    topicIds: ["M884","M534","M661"],
    worksheetIds: [],
  },
  {
    id: "Y8T2U10", year: 8, term: 2, unit: 10, sequence: 48,
    unitName: "Volume",
    topicIds: ["M765","M722","M465"],
    worksheetIds: [],
  },

  // ── Year 8 Term 3 ──────────────────────────────────────────────────────────

  {
    id: "Y8T3U1", year: 8, term: 3, unit: 1, sequence: 49,
    unitName: "Plotting Graphs and Finding Equations",
    topicIds: ["M797","M932","M544"],
    worksheetIds: ["linear-graphs|normal|20"],
  },
  {
    id: "Y8T3U2", year: 8, term: 3, unit: 2, sequence: 50,
    unitName: "Transforming Shapes",
    topicIds: ["M139","M290"],
    worksheetIds: [],
  },
  {
    id: "Y8T3U3", year: 8, term: 3, unit: 3, sequence: 51,
    unitName: "Finding Unknown Angles",
    topicIds: ["M679","M319","M606","M393","M653"],
    worksheetIds: [],
  },
  {
    id: "Y8T3U4", year: 8, term: 3, unit: 4, sequence: 52,
    unitName: "Drawing and Interpreting Statistical Diagrams",
    topicIds: ["M574","M165","M140","M183","M648","M210","U854"],
    worksheetIds: [],
  },
  {
    id: "Y8T3U5", year: 8, term: 3, unit: 5, sequence: 53,
    unitName: "Linear Inequalities",
    topicIds: ["M384","M118"],
    worksheetIds: ["solving-inequalities|normal|20"],
  },
  {
    id: "Y8T3U6", year: 8, term: 3, unit: 6, sequence: 54,
    unitName: "Double Brackets",
    topicIds: ["M960"],
    worksheetIds: ["expanding-brackets|hard|20"],
  },
  {
    id: "Y8T3U7", year: 8, term: 3, unit: 7, sequence: 55,
    unitName: "Fractions Review",
    topicIds: ["M645","M619"],
    worksheetIds: ["fraction-add-sub|normal|20","fraction-mul-div|normal|20","mixed-numbers|normal|20"],
  },
  {
    id: "Y8T3U8", year: 8, term: 3, unit: 8, sequence: 56,
    unitName: "Algebraic Fractions",
    topicIds: ["M754","M336"],
    worksheetIds: ["algebraic-fractions-add-sub|normal|20","algebraic-fractions-mul-div|normal|20","simplify-algebraic-fractions|normal|20"],
  },
  {
    id: "Y8T3U9", year: 8, term: 3, unit: 9, sequence: 57,
    unitName: "Fractions and Recurring Decimals",
    topicIds: ["M701","M922"],
    worksheetIds: ["recurring-decimals|normal|20"],
  },

  // ── Year 9 Term 1 ──────────────────────────────────────────────────────────

  {
    id: "Y9T1U1", year: 9, term: 1, unit: 1, sequence: 58,
    unitName: "Fractions, Decimals and Percentages Review",
    topicIds: ["U888","U594","U881","U916","U554","U349"],
    worksheetIds: ["fdp-fraction-to-decimal|normal|20","fdp-decimal-to-percent|normal|20","fraction-of-amount|normal|20","percentage-of-amount|normal|20"],
  },
  {
    id: "Y9T1U2", year: 9, term: 1, unit: 2, sequence: 59,
    unitName: "Percentage Change",
    topicIds: ["U773","U671","U286","U278","U533"],
    worksheetIds: ["percentage-change|normal|20","reverse-percentages|normal|20"],
  },
  {
    id: "Y9T1U3", year: 9, term: 1, unit: 3, sequence: 60,
    unitName: "Theoretical and Experimental Probability",
    topicIds: ["U166","U580","U280"],
    worksheetIds: ["basic-probability|normal|20"],
  },
  {
    id: "Y9T1U4", year: 9, term: 1, unit: 4, sequence: 61,
    unitName: "Calculations with Standard Form",
    topicIds: ["U264","U290","U161"],
    worksheetIds: ["standard-form-multiply-divide|normal|20","standard-form-operations|normal|20"],
  },
  {
    id: "Y9T1U5", year: 9, term: 1, unit: 5, sequence: 62,
    unitName: "Linear Inequalities",
    topicIds: ["U738","U145","U337"],
    worksheetIds: ["solving-inequalities|normal|20","compound-inequalities|normal|20"],
  },
  {
    id: "Y9T1U6", year: 9, term: 1, unit: 6, sequence: 63,
    unitName: "Factorising and Solving Quadratic Equations",
    topicIds: ["U178","U963","U228"],
    worksheetIds: ["factorising-quadratics|normal|20","difference-of-two-squares|normal|20","quadratic-equations|normal|20"],
  },
  {
    id: "Y9T1U7", year: 9, term: 1, unit: 7, sequence: 64,
    unitName: "Rearranging Formulae",
    topicIds: ["U675","U181"],
    worksheetIds: ["rearranging-formulae|normal|20"],
  },
  {
    id: "Y9T1U8", year: 9, term: 1, unit: 8, sequence: 65,
    unitName: "Constructing Bisectors and Perpendicular Lines",
    topicIds: ["U787","U245"],
    worksheetIds: [],
  },
  {
    id: "Y9T1U9", year: 9, term: 1, unit: 9, sequence: 66,
    unitName: "Circles and Cylinders",
    topicIds: ["U221","U373","U464","U915"],
    worksheetIds: ["circles|normal|20"],
  },

  // ── Year 9 Term 2 ──────────────────────────────────────────────────────────

  {
    id: "Y9T2U1", year: 9, term: 2, unit: 1, sequence: 67,
    unitName: "Error Intervals",
    topicIds: ["U657","U108","U301"],
    worksheetIds: [],
  },
  {
    id: "Y9T2U2", year: 9, term: 2, unit: 2, sequence: 68,
    unitName: "Plans and Elevations",
    topicIds: ["U743"],
    worksheetIds: [],
  },
  {
    id: "Y9T2U3", year: 9, term: 2, unit: 3, sequence: 69,
    unitName: "Pythagoras' Theorem in 2D",
    topicIds: ["U385","U828"],
    worksheetIds: ["pythagoras|normal|20"],
  },
  {
    id: "Y9T2U4", year: 9, term: 2, unit: 4, sequence: 70,
    unitName: "Ratio",
    topicIds: ["U687","U577"],
    worksheetIds: ["ratio-simplify|normal|20","ratio-sharing|normal|20"],
  },
  {
    id: "Y9T2U5", year: 9, term: 2, unit: 5, sequence: 71,
    unitName: "Proportion Word Problems",
    topicIds: ["U721","U357","U610"],
    worksheetIds: ["direct-proportion|normal|20","inverse-proportion|normal|20"],
  },
  {
    id: "Y9T2U6", year: 9, term: 2, unit: 6, sequence: 72,
    unitName: "Linear Graphs — Plotting and Equations",
    topicIds: ["U741","U315","U669"],
    worksheetIds: ["linear-graphs|normal|20"],
  },
  {
    id: "Y9T2U7", year: 9, term: 2, unit: 7, sequence: 73,
    unitName: "Speed and Rates",
    topicIds: ["U151","U256"],
    worksheetIds: ["speed-distance-time|normal|20"],
  },
  {
    id: "Y9T2U8", year: 9, term: 2, unit: 8, sequence: 74,
    unitName: "Distance-Time Graphs",
    topicIds: ["U403","U914","U462"],
    worksheetIds: [],
  },

  // ── Year 9 Term 3 ──────────────────────────────────────────────────────────

  {
    id: "Y9T3U1", year: 9, term: 3, unit: 1, sequence: 75,
    unitName: "Quadratic Graphs",
    topicIds: ["U989","U667","U601"],
    worksheetIds: [],
  },
  {
    id: "Y9T3U2", year: 9, term: 3, unit: 2, sequence: 76,
    unitName: "Angles",
    topicIds: ["U655","U826","U329","U427"],
    worksheetIds: [],
  },
  {
    id: "Y9T3U3", year: 9, term: 3, unit: 3, sequence: 77,
    unitName: "Bearings",
    topicIds: ["U525","U107"],
    worksheetIds: [],
  },
  {
    id: "Y9T3U4", year: 9, term: 3, unit: 4, sequence: 78,
    unitName: "Transforming Shapes",
    topicIds: ["U196","U799","U696","U519","M881"],
    worksheetIds: [],
  },
  {
    id: "Y9T3U5", year: 9, term: 3, unit: 5, sequence: 79,
    unitName: "Similarity",
    topicIds: ["U551","U578"],
    worksheetIds: [],
  },
  {
    id: "Y9T3U6", year: 9, term: 3, unit: 6, sequence: 80,
    unitName: "Congruence",
    topicIds: ["U790","U866","U187"],
    worksheetIds: [],
  },
  {
    id: "Y9T3U7", year: 9, term: 3, unit: 7, sequence: 81,
    unitName: "Scatter Graphs",
    topicIds: ["U199","U277","U128"],
    worksheetIds: [],
  },
  {
    id: "Y9T3U8", year: 9, term: 3, unit: 8, sequence: 82,
    unitName: "Collecting and Presenting Data",
    topicIds: ["U322","U571","U520","U717"],
    worksheetIds: [],
  },
  {
    id: "Y9T3U9", year: 9, term: 3, unit: 9, sequence: 83,
    unitName: "Grouped Data",
    topicIds: ["U312","U877","U840"],
    worksheetIds: [],
  },
  {
    id: "Y9T3U10", year: 9, term: 3, unit: 10, sequence: 84,
    unitName: "Column Vectors",
    topicIds: ["U632","U903","U564","U660"],
    worksheetIds: [],
  },
];
