// Worksheet to Sparx Topic Code Mappings
// Maps each worksheet to relevant Sparx curriculum topic codes
// Topics are organized by category: main topics and building blocks

export const WORKSHEET_SPARX_MAPPINGS = {
    // ==================== NUMBER & PLACE VALUE ====================
    'place-value': ['M704', 'M522'],
    'ordering-numbers': ['M704', 'M527'],
    'negative-numbers': ['M527'],
    'negative-numbers-ordering': ['M527'],
    'rounding': ['M229'],
    'estimation': ['M229'],

    // ==================== INTEGERS & OPERATIONS ====================
    'addition': ['M928'],
    'subtraction': ['M347'],
    'multiplication': ['M113'],
    'division': ['M462'],
    'negative-numbers': ['M346'],
    'odd-even-numbers': ['M342'],

    // ==================== DECIMALS ====================
    'decimal-add-sub': ['M429', 'M152'],
    'decimal-compare': ['M522'],
    'decimal-mul-div': ['M803', 'M873'],

    // ==================== FACTORS, MULTIPLES & PRIMES ====================
    'factors-multiples': ['M369'],
    'prime-factorization': ['M411'],
    'hcf-lcm': ['M738'],
    'hcf-lcm-primes': ['M738'],

    // ==================== FRACTIONS ====================
    'simplify-fractions': ['M405'],
    'equivalent-fractions': ['M405'],
    'fraction-compare': ['M405'],
    'fraction-add-sub': ['M607'],
    'fraction-mul-div': ['M669'],
    'fraction-of-amount': ['M639'],
    'mixed': ['M405'],
    'mixed-numbers': ['M405'],
    'recurring-decimals': ['M406'],
    'recurring-decimals-to-fractions': ['M406'],

    // ==================== FRACTIONS-DECIMALS-PERCENTAGES ====================
    'fdp-decimal-to-fraction': ['M406'],
    'fdp-fraction-to-decimal': ['M406'],
    'fdp-decimal-to-percent': ['M407'],
    'fdp-percent-to-decimal': ['M407'],
    'fdp-fraction-to-percent': ['M407'],
    'fdp-percent-to-fraction': ['M407'],

    // ==================== PERCENTAGES ====================
    'percentage-of-amount': ['M470'],
    'percentages-as-percentage': ['M407'],
    'percentage-change': ['M619'],
    'percentages-multipliers': ['M619'],
    'percentages-repeated': ['M619'],
    'reverse-percentages': ['M619'],
    'best-buys': ['M471'],

    // ==================== INDICES & POWERS ====================
    'square-numbers': ['M410'],
    'cube-numbers': ['M410'],
    'indices': ['M410'],
    'advanced-indices': ['M410'],
    'index-laws': ['M410'],
    'standard-form': ['M411'],
    'standard-form-multiply-divide': ['M411'],
    'standard-form-operations': ['M411'],

    // ==================== SURDS ====================
    'simplify-surds': ['M412'],
    'surds-add-sub': ['M412'],
    'surds-expand': ['M412'],
    'surds-rationalise': ['M412'],

    // ==================== ALGEBRA - MANIPULATION ====================
    'collecting-like-terms': ['M604'],
    'multiplying-terms': ['M605'],
    'expanding-brackets': ['M605'],
    'factorising': ['M606'],
    'difference-of-two-squares': ['M606'],
    'factorising-quadratics': ['M747'],
    'simplify-algebraic-fractions': ['M608'],
    'algebraic-fractions-add-sub': ['M608'],
    'algebraic-fractions-mul-div': ['M608'],
    'algebraic-fractions-equations': ['M608'],

    // ==================== ALGEBRA - EQUATIONS ====================
    'equations': ['M611'],
    'equations-both-sides': ['M611'],
    'equations-fractions': ['M611'],
    'inverse-operations': ['M611'],
    'rearranging-formulae': ['M612'],
    'substitution': ['M603'],
    'solving-inequalities': ['M613'],
    'compound-inequalities': ['M613'],

    // ==================== QUADRATICS ====================
    'quadratic-equations': ['M748'],
    'quadratic-equations-ctq': ['M748'],
    'completing-the-square': ['M748'],
    'quadratic-formula': ['M748'],
    'quadratic-inequalities': ['M749'],

    // ==================== SIMULTANEOUS EQUATIONS ====================
    'simultaneous-equations': ['M763'],

    // ==================== SEQUENCES ====================
    'sequences-continue': ['M691'],
    'sequences-term-to-term': ['M691'],
    'sequences-missing-term': ['M691'],
    'sequences-nth-term': ['M692'],
    'sequences-nth-term-fractions': ['M692'],
    'sequences-patterns': ['M691'],
    'sequences-quadratic': ['M693'],
    'sequences-fibonacci': ['M691'],
    'sequences-geometric': ['M693'],
    'triangular-numbers': ['M691'],

    // ==================== LINEAR GRAPHS ====================
    'linear-graphs': ['M779'],

    // ==================== RATIO & PROPORTION ====================
    'ratio-simplify': ['M618'],
    'ratio-sharing': ['M618'],
    'direct-proportion': ['M764'],
    'inverse-proportion': ['M765'],

    // ==================== GEOMETRY - ANGLES & PROPERTIES ====================
    // (Note: Most geometry topics require visual worksheets - may have limited automated generation)

    // ==================== GEOMETRY - LENGTH & AREA ====================
    'perimeter': ['M268'],
    'area-rectangle': ['M269'],
    'area-triangle': ['M269'],
    'circles': ['M270'],

    // ==================== GEOMETRY - 3D & MEASURES ====================
    'density-mass-volume': ['M791'],
    'speed-distance-time': ['M776'],

    // ==================== TRIGONOMETRY ====================
    'trigonometry': ['M781'],
    'pythagoras': ['M777'],

    // ==================== PROBABILITY ====================
    'basic-probability': ['M714'],
    'systematic-listing': ['M712'],

    // ==================== TIMES TABLES & FLUENCY ====================
    'times-tables-speed': ['M114'],
    'times-tables-mixed-drill': ['M114'],
    'times-tables-missing-factor': ['M114'],
    'times-tables-division-facts': ['M114'],
    'times-tables-negative': ['M114'],

    // ==================== MISSING-NUMBER & INVERSE OPS ====================
    'missing-number': ['M611'],
};

/**
 * Get all Sparx topic codes for a worksheet
 * @param {string} worksheetId
 * @returns {string[]} Array of Sparx topic codes
 */
export function getTopicCodesForWorksheet(worksheetId) {
    return WORKSHEET_SPARX_MAPPINGS[worksheetId] || [];
}

/**
 * Get all worksheets that cover a specific Sparx topic code
 * @param {string} topicCode - Sparx topic code (e.g., 'M928')
 * @returns {string[]} Array of worksheet IDs
 */
export function getWorksheetsForTopicCode(topicCode) {
    return Object.keys(WORKSHEET_SPARX_MAPPINGS).filter(
        worksheetId => WORKSHEET_SPARX_MAPPINGS[worksheetId].includes(topicCode)
    );
}

/**
 * Check if a worksheet covers a topic
 * @param {string} worksheetId
 * @param {string} topicCode
 * @returns {boolean}
 */
export function worksheetCoversTopic(worksheetId, topicCode) {
    const codes = WORKSHEET_SPARX_MAPPINGS[worksheetId] || [];
    return codes.includes(topicCode);
}

/**
 * Get building block worksheets for a topic
 * These are worksheets that cover the prerequisite skills
 * @param {object} topic - Sparx topic object
 * @returns {string[]} Array of worksheet IDs for building blocks
 */
export function getBuildingBlockWorksheetsForTopic(topic) {
    if (!topic || !topic.buildingBlockCodes || topic.buildingBlockCodes.length === 0) {
        return [];
    }

    const worksheets = new Set();
    for (const blockCode of topic.buildingBlockCodes) {
        const wsForCode = getWorksheetsForTopicCode(blockCode);
        wsForCode.forEach(ws => worksheets.add(ws));
    }

    return Array.from(worksheets);
}

/**
 * Get worksheets for a specific topic code
 * Main topic worksheets are returned
 * @param {object} topic - Sparx topic object
 * @returns {string[]} Array of worksheet IDs for the main topic
 */
export function getMainTopicWorksheetsForTopic(topic) {
    if (!topic) return [];
    return getWorksheetsForTopicCode(topic.code);
}

/**
 * Get worksheets for a previous topic (for Do Now revision questions)
 * @param {object} allTopics - Array of all topics
 * @param {number} topicSequence - Sequence number of current topic
 * @param {number} offset - How many topics back (1 for immediate previous, 2 for two back)
 * @returns {string[]} Array of worksheet IDs for the previous topic
 */
export function getPreviousTopicWorksheetsForTopic(allTopics, topicSequence, offset = 1) {
    const index = topicSequence - offset;
    if (index < 0 || index >= allTopics.length) {
        return [];
    }

    const previousTopic = allTopics[index];
    if (!previousTopic) return [];

    return getWorksheetsForTopicCode(previousTopic.code);
}
