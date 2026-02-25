#!/usr/bin/env python3
"""
Standardize all past paper analysis topics to GCSE curriculum format.
Maps 725+ topic variations to 6 official GCSE categories.
"""

import os
import re
from pathlib import Path

# Topic mapping: current variations → standardized GCSE topic
TOPIC_MAP = {
    # Fix double-replacements
    "Algebra: Algebra: Quadratic Equations and Inequalities and Inequalities": "Algebra: Equations and Inequalities",
    "Algebra: Algebra: Quadratic Equations and Inequalities and Inequalities & Turning Points": "Algebra: Equations and Inequalities",
    "Algebra: Algebra: Quadratic Equations and Inequalities and Inequalities & Graphs": "Algebra: Functions and Graphs",
    "Geometry and Measures: Geometry and Measures: Vectors": "Geometry and Measures: Vectors",
    "3D Geometry & Geometry and Measures: Trigonometry": "Geometry and Measures: Trigonometry",

    # Already correct - keep as is
    "Algebra: Functions and Graphs": "Algebra: Functions and Graphs",
    "Algebra: Equations and Inequalities": "Algebra: Equations and Inequalities",
    "Algebra: Algebraic Fractions": "Algebra: Algebraic Fractions",
    "Algebra: Sequences and Series": "Algebra: Sequences and Series",
    "Algebra: Simultaneous Equations": "Algebra: Simultaneous Equations",
    "Geometry and Measures: Vectors": "Geometry and Measures: Vectors",
    "Geometry and Measures: Angles": "Geometry and Measures: Angles",
    "Geometry and Measures: Circle theorems": "Geometry and Measures: Circle theorems",
    "Probability: Conditional probability": "Probability: Conditional probability",
    "Statistics: Data presentation": "Statistics: Data presentation",
    "Statistics: Data analysis": "Statistics: Data analysis",

    # Old format conversions
    "Inequalities": "Algebra: Equations and Inequalities",
    "Number Theory": "Number: Prime factorization",
    "Ratio & Percentages": "Ratio, Proportion & Rates: Ratios",
    "Ratio & Probability": "Probability: Conditional probability",
    "Ratio, Proportion & Rates: Ratios and Proportions": "Ratio, Proportion & Rates: Ratios",
    "Ratio, Proportion & Rates: Proportionality": "Ratio, Proportion & Rates: Proportion",
    "Density & Ratio": "Ratio, Proportion & Rates: Compound measures",
    "Standard Form": "Number: Standard Form",
    "Prime Factorization": "Number: Prime factorization",
    "Geometry and Measures: Angles and Properties": "Geometry and Measures: Angles",
    "Geometry and Measures: Surface Area": "Geometry and Measures: Surface Area",
    "Geometry and Measures: Circle TheoremsProof": "Geometry and Measures: Circle theorems",
    "Graph Plotting": "Algebra: Functions and Graphs",
    "Solving Quadratics Graphically": "Algebra: Functions and Graphs",
    "Graph Interpretation": "Algebra: Functions and Graphs",
    "Recurring Decimals": "Number: Decimals",
    "Recurring Decimals & Fractions": "Number: Decimals",
    "Circle Properties": "Geometry and Measures: Circle theorems",
    "Indices & Fractions": "Number: Indices",
    "Indices & Algebra: Algebraic Fractions": "Number: Indices",
    "Algebraic Proof": "Algebra: Equations and inequalities",
    "Algebra & Proof": "Algebra: Equations and inequalities",
    "Algebra & Quadratics": "Algebra: Equations and Inequalities",
    "Algebra & Inequalities": "Algebra: Equations and Inequalities",
    "Quadratics & Completing Square": "Algebra: Equations and Inequalities",
    "Quadratic & Linear Simultaneous": "Algebra: Simultaneous Equations",
    "Geometry and Measures: Circle TheoremsSectors": "Geometry and Measures: Circle theorems",
    "Proportion": "Ratio, Proportion & Rates: Proportion",

    # Additional conversions
    "Addition": "Number: Place value",
    "Subtraction": "Number: Place value",
    "Multiplication": "Number: Place value",
    "Division": "Number: Place value",
    "3D Geometry": "Geometry and Measures: 3D shapes and volume",
    "3D Shapes": "Geometry and Measures: 3D shapes and volume",
    "3D Geometry & Mensuration": "Geometry and Measures: 3D shapes and volume",
    "3D Shapes & Visualization": "Geometry and Measures: 3D shapes and volume",
    "3D Volume Calculation": "Geometry and Measures: 3D shapes and volume",
    "Area": "Geometry and Measures: 2D shapes and area",
    "Perimeter": "Geometry and Measures: 2D shapes and area",
    "Volume": "Geometry and Measures: 3D shapes and volume",
    "Angles": "Geometry and Measures: Angles",
    "Angles in Polygons": "Geometry and Measures: Angles",
    "Angle Measurement": "Geometry and Measures: Angles",
    "Angles in Triangles": "Geometry and Measures: Angles",
    "Angles on a Line": "Geometry and Measures: Angles",
    "Angles on a Straight Line": "Geometry and Measures: Angles",
    "Trigonometry": "Geometry and Measures: Trigonometry",
    "Sine": "Geometry and Measures: Trigonometry",
    "Cosine": "Geometry and Measures: Trigonometry",
    "Tangent": "Geometry and Measures: Trigonometry",
    "Pythagoras": "Geometry and Measures: Pythagoras",
    "Bearings": "Geometry and Measures: Bearings",
    "Transformations": "Geometry and Measures: Transformations",
    "Reflection": "Geometry and Measures: Transformations",
    "Rotation": "Geometry and Measures: Transformations",
    "Translation": "Geometry and Measures: Transformations",
    "Enlargement": "Geometry and Measures: Transformations",
    "Similarity": "Geometry and Measures: Similarity",
    "Congruence": "Geometry and Measures: Similarity",
    "Linear Equations": "Algebra: Equations and Inequalities",
    "Quadratic Equations": "Algebra: Equations and Inequalities",
    "Simultaneous Equations": "Algebra: Simultaneous Equations",
    "Factorisation": "Algebra: Expressions and simplification",
    "Factorization": "Algebra: Expressions and simplification",
    "Expanding Brackets": "Algebra: Expressions and simplification",
    "Collecting Like Terms": "Algebra: Expressions and simplification",
    "Simplification": "Algebra: Expressions and simplification",
    "Indices": "Number: Indices",
    "Powers": "Number: Indices",
    "Roots": "Number: Indices",
    "Fractions": "Number: Fractions",
    "Decimals": "Number: Decimals",
    "Percentages": "Number: Percentages",
    "Rates": "Ratio, Proportion & Rates: Rates of change",
    "Speed": "Ratio, Proportion & Rates: Compound measures",
    "Distance": "Ratio, Proportion & Rates: Compound measures",
    "Time": "Ratio, Proportion & Rates: Compound measures",
    "Density": "Ratio, Proportion & Rates: Compound measures",
    "Money": "Number: Percentages",
    "Finance": "Ratio, Proportion & Rates: Compound measures",
    "Interest": "Ratio, Proportion & Rates: Compound measures",
    "Sequences": "Algebra: Sequences",
    "Arithmetic Sequence": "Algebra: Sequences",
    "Geometric Sequence": "Algebra: Sequences",
    "Probability": "Probability: Outcomes",
    "Tree Diagram": "Probability: Diagrams",
    "Venn Diagram": "Probability: Diagrams",
    "Independent Events": "Probability: Probability rules",
    "Mutually Exclusive": "Probability: Probability rules",
    "Statistics": "Statistics: Data analysis",
    "Mean": "Statistics: Data analysis",
    "Median": "Statistics: Data analysis",
    "Mode": "Statistics: Data analysis",
    "Range": "Statistics: Data analysis",
    "Standard Deviation": "Statistics: Data analysis",
    "Interquartile Range": "Statistics: Data analysis",
    "Quartiles": "Statistics: Data analysis",
    "Unit Conversion": "Ratio, Proportion & Rates: Compound measures",
    "Rearranging Formulas": "Algebra: Expressions and simplification",
    "Basic Arithmetic": "Number: Place value",
    "Rounding": "Number: Place value",
    "Rounding & Place Value": "Number: Place value",
    "Number: Arithmetic and Calculations": "Number: Place value",
    "Number: Fractions and Decimals": "Number: Fractions",
    "Geometry and Measures: Pythagoras": "Geometry and Measures: Pythagoras",
    "Algebra: Expressions and simplification": "Algebra: Expressions and simplification",
}

def smart_map_topic(topic):
    """Map a topic to GCSE standard format."""
    topic = topic.strip()

    # Exact match
    if topic in TOPIC_MAP:
        return TOPIC_MAP[topic]

    # Already in correct hybrid format
    if ":" in topic and not any(x in topic for x in ["Algebra: Algebra:", "Geometry and Measures: Geometry and Measures:"]):
        return topic

    # Fallback - return as is
    return topic

def process_file(filepath):
    """Process a single markdown file and standardize topics."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    updated = False
    new_lines = []

    for i, line in enumerate(lines):
        original_line = line

        # Process table rows
        if line.startswith('|') and ' | ' in line and not line.startswith('|---|'):
            parts = line.split('|')

            # For "Questions with Full Text" table: Q# | Question | Topic | Marks
            # Topic is in column 3 (index 3)
            if len(parts) >= 5:
                # Try to identify the column that has the topic
                # In Questions table, it's typically column 3 (index 3)
                for col_idx in [3, 1]:  # Try both possible positions
                    topic = parts[col_idx].strip()

                    if topic and topic not in ['Topic', '', 'Question', 'Questions', 'Total Marks', '% of Paper', 'Marks']:
                        # Check if it looks like a topic (not a numeric value)
                        if not topic.isdigit() and '%' not in topic and any(c.isalpha() for c in topic):
                            new_topic = smart_map_topic(topic)
                            if new_topic != topic:
                                parts[col_idx] = ' ' + new_topic + ' '
                                line = '|'.join(parts)
                                updated = True
                                break

        new_lines.append(line)

    if updated:
        new_content = '\n'.join(new_lines)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True

    return False

def main():
    papers_dir = Path("past-paper-analysis")

    print(f"Processing directory: {papers_dir.absolute()}")
    print(f"Directory exists: {papers_dir.exists()}\n")

    files = sorted(papers_dir.glob("*.md"))

    updated_count = 0
    for filepath in files:
        if filepath.name in ["README.md", "COMPLETION_SUMMARY.md", "TEMPLATE.md"]:
            continue

        if process_file(filepath):
            print(f"[UPDATED] {filepath.name}")
            updated_count += 1
        else:
            print(f"[SKIPPED] {filepath.name}")

    print(f"\n[RESULT] Total files updated: {updated_count}/{len([f for f in files if f.name not in ['README.md', 'COMPLETION_SUMMARY.md', 'TEMPLATE.md']])}")

if __name__ == "__main__":
    main()
