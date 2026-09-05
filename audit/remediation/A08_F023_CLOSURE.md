# A08 F-023 closure

Finding: **F-023 — Whole-project deletion not atomic across project and asset stores**

Status: **CLOSED / POST-MERGE VERIFIED**

## Root cause

Whole-project deletion removed project image assets and the project record through separate IndexedDB transactions. A failure between those operations could therefore leave persistence in a partially deleted state: assets could be removed while the project record survived, or cleanup behavior could otherwise diverge across the two stores.

## Remediation

Implementation PR **#73 — Fix F-023 atomic whole-project deletion** replaced that split flow with one canonical whole-project deletion operation.

The remediation:

- added `deleteProjectWithAssets(projectId)` in `src/projectStore.js`,
- opens one `readwrite` transaction spanning both `projects` and `image-assets`,
- deletes every image asset belonging to the target project and the project record inside that same transaction,
- makes user-triggered project deletion call that single atomic operation,
- makes failed-import rollback use the same atomic cleanup path,
- leaves single-image deletion and existing IndexedDB/schema versions unchanged.

No Item/BOM, placement, renderer, catalog, project-schema, or archive-format behavior was intentionally changed.

## Verification

Final implementation PR head: `a78d48ea570873d86899f762e1cf03e32f528349`.

PR CI run **#308 / run `33997615392`** completed successfully:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

Targeted coverage proves that whole-project deletion uses one cross-store transaction, the main deletion path and failed-import rollback both use the canonical atomic API, and Chromium removes the target project plus its assets without touching another project's data.

PR #73 merged into `ROG` as `c118c6d4269a335334972bb88e36a3fc7491c9bc`.

Post-merge `ROG` CI run **#309 / run `33997841213`** completed successfully:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

## Result

Whole-project deletion is now all-or-nothing across the project record and its image assets at the IndexedDB transaction boundary. If the transaction fails, the database does not commit a partial whole-project deletion.

A08 remains a broader `GAP` section because F-021 and F-022 are separate open persistence findings.

**F-023 is CLOSED.**
