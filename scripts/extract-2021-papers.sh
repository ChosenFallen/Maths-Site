#!/bin/bash

PAPERS_DIR="real past papers"

declare -a PAPERS=("1fnov2021" "2fnov2021" "3fnov2021" "1hnov2021" "2hnov2021" "3hnov2021")

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
