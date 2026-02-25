#!/bin/bash

PAPERS_DIR="real past papers"

declare -a PAPERS=("1fjune2019" "2fjune2019" "3fjune2019" "1hjune2019" "2hjune2019" "3hjune2019")

for paper in "${PAPERS[@]}"; do
  if [ -f "$PAPERS_DIR/${paper}.pdf" ]; then
    echo "Extracting $paper..."
    pdftotext "$PAPERS_DIR/${paper}.pdf" "/tmp/${paper}.txt"
    size=$(wc -c < "/tmp/${paper}.txt")
    if [ "$size" -gt 5000 ]; then
      echo "✓ Extracted $paper ($size bytes)"
    else
      echo "✗ $paper extraction failed (only $size bytes)"
    fi
  fi
done
