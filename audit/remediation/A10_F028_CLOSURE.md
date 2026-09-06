# A10 F-028 closure

Finding: **F-028 — “Tüm Özellikleri Kaldır” can fail when `illuminated-foam` exists**

Status: **CLOSED / POST-MERGE VERIFIED / USER VERIFIED**

## Root cause

The global `Tüm Özellikleri Kaldır` flow previously treated every scene module as a module that should be recreated through the normal reset path. `illuminated-foam` is a special runtime family, so this made the operation vulnerable to failing or retaining behavior that did not match the intended destructive reset semantics.

## Remediation

Implementation PR **#81 — fix: remove illuminated foam during feature reset** defines the intended behavior explicitly:

- every `illuminated-foam` module is removed from the scene during `Tüm Özellikleri Kaldır`,
- all remaining modules are reset through the existing canonical construction/reset path,
- existing placement is preserved for the remaining modules,
- unknown module families retain the existing fail-closed behavior,
- the confirmation text explicitly states when Işıklı Strafor will be removed,
- the selected illuminated-foam UI state is cleared consistently.

No catalog dimensions, module default dimensions, placement arithmetic, project schema, IndexedDB schema, BOM policy or import/export format was intentionally changed by F-028.

## Regression evidence

Targeted coverage added for the remediation:

- `test/f028FeatureReset.test.js` — verifies the reset policy removes `illuminated-foam` and resets remaining modules,
- `e2e/f028-reset-features.spec.mjs` — Chromium coverage verifies the real browser flow removes illuminated foam, preserves the remaining module layout and persists the resulting project state.

The final implementation PR passed the complete contract gate, all **492/492** unit/integration tests, production build and Chromium E2E suite.

## CI and merge evidence

- implementation PR: **#81 — fix: remove illuminated foam during feature reset**
- final implementation head: `1f5d615a0c7c8f6bcdd827c5cb660fffc1667c7e`
- final PR CI: **run #340 / `34000562593` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: 492/492 success
  - production build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- merged to `ROG` as `5b6022172a188996b213d69dc9ebefd4d49cf99d`
- post-merge `ROG` CI: **run #341 / `34000668828` / completed / success**
  - full canonical CI chain: success
- post-merge manual product verification: **confirmed by the user**; `Tüm Özellikleri Kaldır` behaved as intended in the tested application flow.

## Result

F-028 satisfies the repository closure rule: implementation, targeted regression, full suite, build, PR CI, merge, post-merge CI verification and manual user verification are complete.

**F-028 is CLOSED.**

A10 remains a broader `GAP` section because F-025 and F-026 remain open UI findings.
