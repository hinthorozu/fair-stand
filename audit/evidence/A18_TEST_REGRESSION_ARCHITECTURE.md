# A18 — Tests / regression architecture audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Test architecture observed

- canonical script is `node --test`.
- a large `test/` suite covers catalog, contracts, state factories, recipes, placement, reflow, UI/controller helpers, scene source contracts and many module-specific regressions.
- two legacy tests remain under `tests/` (`autoDepot.test.js`, `moduleBehavior.test.js`).
- system development/change contract tests enforce catalog contract and CI wiring.
- latest canonical ROG CI reports `npm test` success.

## Finding

### F-040 — P1 — no real browser E2E harness covers critical user workflows

The repository has no Playwright/Cypress/Puppeteer/browser automation dependency or E2E runner in `package.json`, and the repository tree has no browser-E2E suite. Several files named `*Integration.test.js` validate wiring by reading source text and regex-matching handlers/imports. These are useful regression guards, but they do not prove DOM/browser/IndexedDB/WebGL behavior end-to-end.

This root finding owns A19. It also limits confidence in persistence/import/render/focus/performance workflows where browser APIs matter.

## Cross-linked coverage gaps

- F-022: no table-driven save/load round-trip for every special module family.
- F-020: pending-autosave-before-project-switch durability case untested.
- F-023: multi-store delete atomicity cannot be proven by current unit tests.
- F-024: model load failure/user fallback not browser-tested.
- F-036/F-037: malformed/large import hardening lacks browser/integration proof.

## Checklist results

- A18.01 test inventory: `AUDITED_OK`.
- A18.02 catalog/module contract coverage: `AUDITED_OK`.
- A18.03 behavior/placement regression coverage: `AUDITED_OK` broadly; hidden policy inventory F-011 remains.
- A18.04 state factory coverage: `AUDITED_OK` for factories; cross-layer round-trip F-022.
- A18.05 persistence round-trip: `GAP` — F-022/F-040.
- A18.06 import/export regression: `GAP` — current tests are source-flow assertions, not browser archive round-trip.
- A18.07 BOM drift/unknown parts: `AUDITED_OK` for recipe-backed modules; final/relationship BOM missing F-030/F-031.
- A18.08 UI/controller helper tests: `AUDITED_OK` at unit/source level.
- A18.09 renderer behavior: `GAP` — many source-contract tests, no real WebGL/browser render regression.
- A18.10 browser smoke/E2E: `GAP` — F-040.
- A18.11 full suite deterministic in CI: `AUDITED_OK` at current baseline run.
- A18.12 test organization: `GAP/P2` — `test/` plus legacy `tests/`; change-gate test-path issue already F-007, no duplicate finding opened.

Section audit status: **GAP**.
