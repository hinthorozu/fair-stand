# A10 F-027 closure

Finding: **F-027 — “Duvarı temizle” deletes all modules beyond label/confirmation scope**

Status: **CLOSED / POST-MERGE VERIFIED**

## Root cause

The old `Duvarı temizle` action was presented as a wall-only destructive operation, but its implementation cleared the complete `currentModules` scene state. That scope included modules outside the wall itself, so the user-visible label and action semantics did not match the actual destructive effect.

## Remediation

Implementation PR **#77 — Fix F-027: reset scene from current setup controls** replaced the old wall-only wording and behavior with an explicit scene reset flow:

- the control is now labeled **`Sahneyi Sıfırla`**,
- reset reads the current visible stand setup controls,
- Stand Tipi, X, Y, Zemin, Depo, Depo ölçüsü and Depo içeriği are used as the reconstruction inputs,
- scene reconstruction uses the same scene-building path used by `Sahneyi Oluştur`,
- reset does not create or reopen a project,
- current project identity and image library are preserved,
- the prior ambiguous `currentModules = []` wall-clear action is no longer exposed as a wall-only operation.

No catalog dimensions, canonical module defaults, placement arithmetic, BOM policy, project schema or import/export format was intentionally changed by F-027.

## Regression evidence

Targeted coverage added for the remediation:

- `test/f027SceneReset.test.js` — source/integration contract for the reset label and shared scene-rebuild path,
- `e2e/f027-scene-reset.spec.mjs` — Chromium coverage verifies reset from the visible setup controls and persisted resulting project state,
- `e2e/f010-module-construction.spec.mjs` was updated so its setup no longer depends on the removed legacy clear-wall semantics.

The full test suite, production build and Chromium E2E suite passed on the final PR head and again after merge to `ROG`.

## CI and merge evidence

- implementation PR: **#77 — Fix F-027: reset scene from current setup controls**
- final implementation head: `d173e1ee63396aebc1f3f5ee0925bdb5ba76f328`
- final PR CI: **run #330 / `33999387201` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- merged to `ROG` as `3b4d85437be3af59c78ad5f11344a24d4caa3911`
- post-merge `ROG` CI: **run #331 / `33999469471` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success

## Result

F-027 satisfies the repository closure rule: implementation, targeted regression, full suite, build, PR CI, merge and post-merge verification are complete.

**F-027 is CLOSED.**

A10 remains a broader `GAP` section because F-025, F-026 and F-028 remain open UI findings.
