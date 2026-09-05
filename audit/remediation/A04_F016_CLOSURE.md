# A04 F-016 closure

Finding: **F-016 — Right-wall corner orientation conflict: 90° helper vs 270° active placement/reflow**

Status: **CLOSED / POST-MERGE VERIFIED**

## Root cause

`src/cornerPlacement.js` still encoded right-wall placement at `90°`, while the active continuous-wall placement/reflow path in `src/wallReflow.js` used the canonical inward-facing right-wall orientation of `270°`. The stale helper had its own regression test that also expected `90°`, so repository tests preserved a rule that no longer matched the active application behavior.

## Remediation

Implementation PR **#65 — Fix F-016 right-wall orientation conflict** aligned the stale helper and tests with the active canonical rule:

- left wall remains `90°`,
- back wall remains `0°`,
- right wall is `270°`,
- stale right-wall fixtures in `test/cornerPlacement.test.js` were updated,
- `test/rightWallOrientation.test.js` was added to assert that `cornerPlacement` and `wallReflow` agree on the same `270°` right-wall orientation.

The active runtime path already used `270°`; this remediation removed the conflicting alternate rule rather than changing intended product behavior.

## Verification

Final PR head: `f0270a5158469d23977ac8d9ce4eb64b5147c6e5`.

PR CI run **#286 / run `33993408626`** completed successfully:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

PR #65 merged into `ROG` as `e1e37d8211d4a20aa5a4b0575134ee103609d8c0`.

Post-merge `ROG` CI run **#288 / run `33993672871`** completed successfully:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

## Result

The repository no longer carries contradictory right-wall orientation expectations between the alternate corner-placement helper and the active wall-reflow path. Runtime and regression coverage now agree on the canonical `270°` right-wall orientation.

**F-016 is CLOSED.**
