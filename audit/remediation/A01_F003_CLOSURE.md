# A01 / F-003 Remediation Closure

Finding: `F-003 — roadmaps duplicate canonical production dimensions/recipe facts`
Severity: P2
Branch: `remediation/a01-f003-roadmap-source-truth`
PR: `#38`
Starting ROG: `d19118d38a8330546fdba4037ebf2bcc56b0b7bf`

## Fix

- Removed duplicated physical production measurements and fixed recipe quantities from `ROADMAP.md`.
- Removed the duplicated production dataset from `ROADMAP_PHASE_4.md` while preserving planning/status/acceptance intent.
- Both roadmaps now explicitly point physical production metadata to `src/productionParts.js`, recipe quantities/part references to `src/moduleRecipes.js`, and BOM policy to `src/moduleContracts.js`.
- Added `test/roadmapProductionSourceOfTruth.test.js` to reject known duplicated production-dataset markers in roadmaps and require canonical owner references.

## Verification

Implementation head: `8775359518c99410b49e03c9d47ef9ee4a6e6b14`
PR CI: `#97 / 33799825728`

- change contract gate: passed
- npm ci: passed
- npm test: passed (includes roadmap source-of-truth regression)
- npm run build: passed

## Result

`F-003: CLOSED`

Post-merge ROG CI is required before proceeding to F-004.
