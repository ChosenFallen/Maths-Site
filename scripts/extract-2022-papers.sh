#!/bin/bash

PAPERS_DIR="real past papers"

declare -a PAPERS=("1fjune2022" "1fnov2022" "2fjune2022" "2fnov2022" "3fjune2022" "3fnov2022" "1hjune2022" "1hnov2022" "2hjune2022" "2hnov2022" "3hjune2022" "3hnov2022")

for paper in "${PAPERS[@]}"; do
  if [ -f "$PAPERS_DIR/${paper}.pdf" ]; then
    echo "Extracting $paper..."
    pdftotext "$PAPERS_DIR/${paper}.pdf" "/tmp/${paper}.txt"
    echo "✓ Extracted $paper"
  fi
done
