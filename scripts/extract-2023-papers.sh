#!/bin/bash

PAPERS_DIR="real past papers"
ANALYSIS_DIR="past-paper-analysis"

# Array of 2023 papers (excluding 1fnov2023 which is already done)
declare -a PAPERS=("2fnov2023" "3fnov2023" "1fmay2023" "2fjune2023" "3fjune2023" "1hnov2023" "2hnov2023" "3hnov2023" "1hmay2023" "2hjune2023" "3hjune2023")

for paper in "${PAPERS[@]}"; do
  if [ -f "$PAPERS_DIR/${paper}.pdf" ]; then
    echo "Extracting $paper..."
    pdftotext "$PAPERS_DIR/${paper}.pdf" "/tmp/${paper}.txt"
    echo "✓ Extracted $paper"
  fi
done
