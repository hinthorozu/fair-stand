# A03 F-012 closure

Finding: **F-012 — Stand scene-surround rule duplicated between setup and renderer**

Status: **CLOSED / POST-MERGE VERIFIED**

## Remediation

- `src/sceneDimensions.js` is now the canonical owner of the physical scene surround rule as `SCENE_SURROUND_M = 1`.
- `src/standSetup.js` consumes `SCENE_SURROUND_M` instead of owning `STAND_SURROUND_M`.
- `src/scene3d.js` consumes the same `SCENE_SURROUND_M` instead of owning `STAGE_SURROUND_M`.
- All setup and renderer surround calculations therefore read one named value from one source.
- The physical value remains exactly **1 metre**. No scene dimension, grid extent, camera framing formula, placement arithmetic or product geometry was intentionally changed.
- `src/sceneDimensions.js` is classified in the change-gate ownership map so future changes remain impact-reviewed.

## Regression evidence

Targeted coverage includes:

- `test/sceneSurroundSingleSource.test.js` — verifies one canonical surround constant and protects against reintroducing independent setup/renderer ownership.
- `test/standSetup.test.js` — protects stand setup scene dimension arithmetic using the unchanged 1 metre surround.
- `e2e/smoke.spec.mjs` — Chromium stage-creation smoke verifies the renderer import path and real application stage setup continue to load and run.

The full unit/integration suite and production build also passed before and after merge.

## Full-system impact review

The accepted F-012 change contract ran under schemaVersion 2 full-system impact discovery. Broad dependents of `scene3d.js`, setup, renderer and architecture surfaces were explicitly reviewed.

- F-010 and F-011 remain closed and were not regressed.
- F-013 and all A04+ findings remain independent; this remediation does not close them.
- The new canonical file changes ownership only. It does not change the 1 metre physical rule.

## CI and merge evidence

- implementation PR: **#52 — Close F-012: centralize scene surround constant**
- final implementation head: `5e4a29b414f5c6b46fa17cc36e2875bdd93b819f`
- PR CI: **#216 / run `33973111841` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- merged to `ROG` as `1ca9f6e386a6cbdb7377ce35bf22a26b75e4ba80`
- post-merge `ROG` CI: **#221 / run `33974468120` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success

## Result

F-012 satisfies the repository closure rule: implementation, targeted regression, full suite, build, PR CI, merge, and post-merge verification are complete.

**F-012 is CLOSED.** It was the final A03-owned finding.
