# A03 F-010 closure

Finding: **F-010 — `main.js` contains a parallel/hidden runtime module-state construction registry**

Status: **CLOSED / POST-MERGE VERIFIED**

## Remediation

- `src/designState.js` now owns the canonical runtime module-state construction registry and `createModuleStateFromDescriptor(...)` entry point.
- `src/main.js` delegates catalog construction to that canonical constructor instead of owning a module-type → factory dispatcher or direct module factory imports.
- automatic wall, automatic depot and illuminated-foam construction paths use the canonical constructor while preserving their existing runtime state shapes and placement semantics.
- catalog identity can be attached through `catalogKey`, and placement preservation remains explicit through the constructor options.

## Regression evidence

Targeted unit/integration coverage includes:

- `test/moduleStateConstructionRegistry.test.js` — proves all 45 catalog keys construct through the canonical registry, preserves type/catalog identity, covers placement preservation, non-catalog illuminated foam, and protects the `main.js` ownership boundary.
- `test/coatRackModule.test.js` and `test/indoorPlants.test.js` — stale implementation-location assertions were corrected so they validate the current ownership architecture rather than requiring direct factories in `main.js`.
- `test/illuminatedFoamModule.test.js`, `test/automaticWall.test.js`, and `tests/autoDepot.test.js` — protect the non-catalog and automatic construction paths affected by the ownership move.
- `test/systemChangeGateLocalDiff.test.js` — remains part of the targeted governance regression set after the full-system impact sweep identified it as an affected gate test.
- `e2e/f010-module-construction.spec.mjs` — Chromium regression proves both automatic-wall construction and catalog construction through the real UI, then verifies the resulting module state persists in IndexedDB.

The E2E catalog flow uses a valid real-wall path: Sırt Duvar → Duvarı temizle → katalogdan `wall_100` ekle → picker kapanışı → kaydet → persisted state verification. Earlier invalid Ada Stand append assumptions were removed rather than weakening production validation.

## Full-system impact review

The accepted F-010 change contract reviewed runtime/code dependents, affected tests, documentation/contracts and linked finding candidates under the schemaVersion 2 full-system impact gate.

- **F-028 remains OPEN.** The canonical constructor now supports the illuminated-foam path used by reset-all-features, but F-028 is an independent user-visible finding and requires its own acceptance/regression/closure evidence.
- **F-011 and F-012 remain OPEN.** They are the remaining A03 architecture findings and were not silently folded into F-010.
- No independent A04+ finding is closed by this remediation.

## CI and merge evidence

- implementation PR: **#46 — Close F-010: centralize module state construction**
- final implementation head: `3a9a289b478f6a9fc1e610c9f73c4c99d634ac37`
- PR CI: **#176 / run `33850183969` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- merged to `ROG` as `f45cbe55030e8bc4361d4e2ce2a4d6a6d86e0a89`
- post-merge `ROG` CI: **#177 / run `33852027783` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success

## Result

F-010 satisfies the repository closure rule: implementation, targeted regression, full suite, build, PR CI, merge, and post-merge verification are all complete.

**F-010 is CLOSED.** A03 remains in progress with **F-011** next, followed by **F-012**.
