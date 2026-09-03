# A01 / F-001 Remediation Closure

Finding: `F-001 — stale SYSTEM_MODULE_CATALOG.md`
Severity: P1
Branch: `remediation/a01-f001-catalog-doc`
PR: `#36`
Starting ROG: `5b03cc8f7d3ad6f18381803ae76506e1300ae38f`

## Fix

- Replaced the stale 28-module reference with the current 45-key catalog snapshot.
- Removed duplicated per-module production quantities/dimensions from the document; canonical recipe/part data stays in code owners.
- Documented current contract-derived BOM policy summary: 29 recipe-backed catalog entries, 16 decision-required catalog entries, plus non-catalog `illuminated-foam` as decision-required.
- Added `test/systemModuleCatalogDoc.test.js` so catalog key/order and summary-count drift fail the test suite.

## Verification

PR head implementation commit: `6ffe18264b10f4c8eaae1a9f4ac4925ce329a55f`
PR CI run: `#89 / 33798955367`

- Change contract gate: passed
- npm ci: passed
- npm test: passed (includes new targeted catalog-document regression)
- npm run build: passed

## Result

`F-001: CLOSED`

Post-merge ROG CI is still required before proceeding to F-002.
