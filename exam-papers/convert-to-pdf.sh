#!/bin/bash

# Convert all exam papers to PDF with proper formatting
# Requirements: pandoc, xelatex, pdflatex

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}GCSE Exam Papers - PDF Conversion${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Create output directories
mkdir -p "series-1/foundation/pdfs"
mkdir -p "series-1/higher/pdfs"

# Define papers to convert
declare -a FOUNDATION_PAPERS=(
    "series-1/foundation/paper-1-noncalc"
    "series-1/foundation/paper-2-calc"
    "series-1/foundation/paper-3-calc"
)

declare -a HIGHER_PAPERS=(
    "series-1/higher/paper-1-noncalc"
    "series-1/higher/paper-2-calc"
    "series-1/higher/paper-3-calc"
)

# Function to convert a single paper
convert_paper() {
    local input_file="$1"
    local output_file="${input_file//.md/.pdf}"

    echo -e "${YELLOW}Converting: $input_file${NC}"

    # Check if input file exists
    if [ ! -f "$input_file.md" ]; then
        echo -e "${RED}Error: $input_file.md not found${NC}"
        return 1
    fi

    # Convert markdown to PDF using Pandoc with custom settings
    pandoc "$input_file.md" \
        --pdf-engine=xelatex \
        --template="latex-template.tex" \
        -V geometry:margin=1.5cm \
        -V geometry:top=2cm \
        -V geometry:bottom=2cm \
        -V fontsize=12pt \
        -V linestretch=1.1 \
        -o "$output_file" \
        --variable=colorlinks:true \
        --variable=linkcolor:blue \
        --variable=citecolor:blue \
        --variable=urlcolor:blue

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully created: $output_file${NC}\n"
        return 0
    else
        echo -e "${RED}✗ Error converting $input_file${NC}\n"
        return 1
    fi
}

# Convert all Foundation papers
echo -e "\n${BLUE}Converting Foundation Tier Papers...${NC}\n"
for paper in "${FOUNDATION_PAPERS[@]}"; do
    convert_paper "$paper"
done

# Convert all Higher papers
echo -e "\n${BLUE}Converting Higher Tier Papers...${NC}\n"
for paper in "${HIGHER_PAPERS[@]}"; do
    convert_paper "$paper"
done

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}PDF Conversion Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo "Output files:"
echo "  Foundation: series-1/foundation/*.pdf"
echo "  Higher: series-1/higher/*.pdf"
echo ""
echo "Note: Ensure diagrams are added manually if needed"
echo "Review the FORMATTING.md file for additional options"
