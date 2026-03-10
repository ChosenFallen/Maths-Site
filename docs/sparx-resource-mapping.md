# Sparx Resources to Our Worksheets Mapping

## Overview

This document maps Sparx Year 7 PDF resources to our 67 worksheets and Sparx curriculum topics.

### Structure

Each Sparx unit contains:
- **Building Blocks** - Foundation questions (prerequisites)
- **Example Pairs** - Worked examples with teacher and student versions
- **Deepen** - Enrichment activities
- **Assessment** - Formal assessment items
- **Revision** - Mixed review content

### Topic Code Reference

- **M-codes**: Key Stage 3 (Years 7-9) topics
- **U-codes**: GCSE (Years 10-11) topics

---

## Year 7 Mapping

### Term 1

#### Unit: Adding and Subtracting
**Sparx Topic Codes**: M704 (Integer place value), M522 (Decimal place value), M928 (Adding integers), M429 (Adding decimals), M347 (Subtracting integers), M152 (Subtracting decimals)

**Our Worksheets**:
- `addition.js` - Adding integers (M928)
- `subtraction.js` - Subtracting integers (M347)
- `decimal-addition.js` - Adding decimals (M429)
- `decimal-subtraction.js` - Subtracting decimals (M152)

**Sparx Files**:
- BuildingBlocks_Adding_and_Subtracting.pdf (11 pages)
- ExamplePairs_Adding_and_Subtracting.pdf (24 pages)
- Deepen_Adding_and_subtracting.pdf
- Assessment (multiple choice and extended response)

---

#### Unit: Multiplying
**Sparx Topic Codes**: M113, M911, M187, M803

**Our Worksheets**:
- `multiplication.js` - Multiplying integers
- `decimal-multiplication.js` - Multiplying decimals

**Sparx Files**:
- BuildingBlocks_Multiplying.pdf
- ExamplePairs_Multiplying.pdf
- Deepen_Multiplying.pdf

---

#### Unit: Dividing
**Sparx Topic Codes**: M462, M354, M873, M262, M491

**Our Worksheets**:
- `division.js` - Dividing integers
- `decimal-division.js` - Dividing decimals

**Sparx Files**:
- BuildingBlocks_Dividing.pdf
- ExamplePairs_Dividing.pdf
- Deepen_Dividing.pdf

---

## Implementation Strategy

### Phase 1: Index Creation
Create a JSON index mapping:
```json
{
  "sparx_resources": [
    {
      "filename": "Sparx_Year7_Term1_BuildingBlocks_Adding_and_Subtracting.pdf",
      "year": "Year 7",
      "term": 1,
      "type": "BuildingBlocks",
      "topic_codes": ["M704", "M522", "M928", "M429", "M347", "M152"],
      "worksheet_ids": ["addition", "subtraction", "decimal-addition", "decimal-subtraction"],
      "pages": 11,
      "content_description": "Integer place value, decimal place value, addition and subtraction of integers and decimals"
    }
  ]
}
```

### Phase 2: Question Extraction
For each resource type:
- **BuildingBlocks**: Extract foundation-level questions
- **ExamplePairs**: Extract worked examples for teaching
- **Deepen**: Extract extension/enrichment questions
- **Assessment**: Parse assessment items

### Phase 3: Integration with Do Now
When a teacher selects a Sparx topic in Do Now:
1. Look up the building block topic codes
2. Find corresponding Sparx resource files
3. Load questions from those PDFs
4. Fall back to our randomly-generated worksheets if available

### Phase 4: Database Structure
```javascript
{
  topicCode: "M928",
  topicName: "Adding integers",
  year: "Year 7",
  term: 1,
  buildingBlocks: ["M704"],
  resources: [
    {
      type: "BuildingBlocks",
      file: "Sparx_Year7_Term1_BuildingBlocks_Adding_and_Subtracting.pdf",
      pages: [2, 3, 4, 5]
    },
    {
      type: "ExamplePairs",
      file: "Sparx_Year7_Term1_ExamplePairs_Adding_and_Subtracting.pdf",
      pages: [1, 2, 3]
    }
  ],
  ourWorksheets: ["addition"]
}
```

---

## Next Steps

1. Create complete index of all Year 7 Sparx files with topic mappings
2. Extract sample questions from BuildingBlocks PDFs
3. Create OCR/parsing logic for question extraction
4. Link to our worksheet system
5. Test Do Now integration with Sparx resources

---

**Status**: Phase 1 - In Progress
**Last Updated**: [Current Date]
**Files Analyzed**: 3 samples
**Total Year 7 Files**: 98 (excluding blank versions)
