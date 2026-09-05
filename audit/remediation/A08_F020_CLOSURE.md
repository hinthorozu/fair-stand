# A08 F-020 closure

Finding: **F-020 — Pending autosave can be cancelled/lost during project switch/open**

Status: **CLOSED / POST-MERGE VERIFIED**

## Root cause

Autosave used a 5-second debounce. When a project switch/open started before that timer fired, the restore flow disabled autosave and cleared the pending timer. The active project's most recent edits therefore had a lost-update window: they could disappear from persistent storage even though the user had already made the edit in the current session.

## Remediation

Implementation PR **#70 — Fix F-020 save-before-project-actions durability** removed that window by making project-changing actions persist the active project first.

The remediation:

- added an immediate autosave-controller `flush()` path that follows the same save lifecycle as the existing Save action,
- added one save-before-action guard used by project Open/switch, Export, Import and Create Stage,
- waits for the active-project save to succeed before continuing the requested action,
- aborts the requested action when the save fails,
- preserves the requested target project across the save-triggered project-list refresh,
- preserves browser user activation for Import by starting the save from the click path and awaiting that save before archive processing,
- keeps the existing 5-second autosave debounce for normal background autosave behavior.

No persisted schema, Item/BOM, placement, renderer or catalog behavior was changed.

## Verification

Final implementation PR head: `5e428f2aa372be3cc9eda43d2dff970ff489241b`.

PR CI run **#298 / run `33996235671`** completed successfully:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

Targeted coverage includes autosave flush behavior, project-action ordering/failure behavior, dropdown switch/import integration, and a Chromium regression proving an edit inside the autosave debounce window is persisted before switching projects.

PR #70 merged into `ROG` as `2d8da33e1e0a2ccd709cfd2165822dc5e6bca6e5`.

Post-merge `ROG` CI run **#299 / run `33996363950`** completed successfully:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

## Result

Project actions that can switch, replace, import, export or recreate project state no longer discard a pending autosave. The current project is persisted first, and the requested action proceeds only after that save succeeds.

A08 remains a broader `GAP` section because F-021, F-022 and F-023 are separate open persistence findings.

**F-020 is CLOSED.**
