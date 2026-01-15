# LaTeX Documentation

This directory contains the complete LaTeX documentation for the GrocARy project.

## Building the Documentation

### Quick Start (Docker - No Installation Required)

If you don't have LaTeX installed, you can use Docker to compile the document:

```bash
cd docs/latex && docker run --rm -v "$(pwd)/../..":/project -w /project/docs/latex texlive/texlive:latest sh -c "pdflatex -interaction=nonstopmode -jobname=GrocARyDocumentation main.tex && pdflatex -interaction=nonstopmode -jobname=GrocARyDocumentation main.tex"
```

This command:

- Uses the official TeX Live Docker image
- Mounts the project root directory (parent of `docs`) as `/project`
- Sets working directory to `/project/docs/latex`
- Runs `pdflatex` twice for proper cross-references
- Automatically removes the container after compilation (`--rm`)
- Outputs `GrocARyDocumentation.pdf` in the `docs/latex/` directory

**Note**: The first run will download the Docker image (~3GB), but subsequent builds will be fast.

### Prerequisites (Local Installation)

If you prefer to install LaTeX locally:

- **Linux**: `texlive-full` or `texlive-most`
- **macOS**: MacTeX
- **Windows**: MiKTeX or TeX Live

### Build Commands (Local Installation)

#### Using pdflatex (Recommended)

```bash
cd docs/latex
pdflatex -jobname=GrocARyDocumentation main.tex
pdflatex -jobname=GrocARyDocumentation main.tex  # Run twice for proper cross-references
```

#### Using latexmk (Automated)

```bash
cd docs/latex
latexmk -pdf -jobname=GrocARyDocumentation main.tex
```

This will automatically run pdflatex multiple times until all references are resolved.

#### Clean Build Artifacts

```bash
cd docs/latex
latexmk -c  # Clean auxiliary files
# Or manually:
rm -f *.aux *.log *.out *.toc *.fdb_latexmk *.fls *.synctex.gz
```

## Document Structure

The LaTeX document includes:

1. **Introduction** - Overview, motivation, and project journey
2. **Architecture** - System architecture with flow diagrams
3. **Technology Stack** - Components and libraries
4. **Implementation** - Detailed implementation analysis
5. **Challenges** - Technical hurdles and solutions

## Images

The document references images from:

- `../../docs/assets/`

## Notes

- The document uses TikZ for diagrams.
- Images are centered using `\centering` and `[H]` float placement.
- Code listings use the `listings` package with syntax highlighting.
