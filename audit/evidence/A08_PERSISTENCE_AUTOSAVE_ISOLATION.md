# A08 — Persistence / autosave / project isolation audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Persistence path

- Project snapshot: `main.js:buildProjectSnapshot()`
- Project storage: `src/projectStore.js`
- Asset storage: `src/assetStore.js`
- Autosave lifecycle: `src/autosaveController.js`
- Restore/switch: `main.js:restoreProject()` / `openStoredProject()`

## Findings

### F-020 — P1 — pending autosave can be discarded during project switch/open

Autosave observes changes, waits 5 seconds, then persists. `restoreProject()` begins by calling `autosaveController.disable()`, and `disable()` clears the pending timeout.

The project dropdown/open flow does **not** flush/persist the currently active project before opening the target project. Therefore a user can:

1. edit a saved project,
2. trigger an autosave-pending state,
3. switch/open another project before the 5-second timer fires,
4. have the pending save cancelled by `restoreProject()`.

The switch confirmation currently confirms navigation only; it does not guarantee pending edits are saved. Existing dropdown integration tests check confirm/open wiring but not this durability case.

Impact: recent edits to the project being left can be lost from persistent storage.

### F-021 — P2 — project `version` exists but no schema validation/migration path consumes it

Snapshots write `version:1`; `saveProject()` preserves any numeric version (or defaults to 1). `restoreProject()` does not inspect project version and has no migration/normalization pipeline before copying `stand`/`modules` into runtime state.

Thus the version field currently behaves as metadata rather than an enforced compatibility contract. Missing/legacy fields are handled ad hoc by renderer defaults and `catalogKey` repair.

This root finding also owns the project-schema compatibility issue in A14; do not duplicate there unless archive-specific behavior is independent.

### F-022 — P2 — persistence round-trip is not contract-tested across all special module families

Current unit/integration tests cover state factories, project UI/switch, selected persistence behaviors and asset flows, but there is no table-driven contract proving that every 45+1 module family survives:

`factory/current state -> save snapshot -> load -> restore -> equivalent behavior/identity`

Special fields at risk include model metadata, catalog identity, shelf lighting, video-wall geometry, illuminated-foam asset/halo state, fabric/glass/image transforms and special placement metadata.

This is a test-coverage finding; it does not assert all current round trips are broken.

### F-023 — P2 — project deletion is not atomic across project and asset stores

Deletion sequence in main is:

1. `deleteProjectImageAssets(projectId)`
2. `deleteProject(projectId)`

These are separate IndexedDB transactions/open calls. If asset deletion succeeds and project deletion fails, the project record remains but its referenced assets are gone. The UI catches the error and reports deletion failure, but the surviving project may already be partially destroyed.

This is an atomicity/isolation gap. Image deletion for a single asset uses the safer opposite ordering (persist references first, then delete blob), but whole-project deletion is not transactional across both stores.

## Checklist results

- **A08.01 complete intended state:** `AUDITED_OK` for current snapshot shape; image blobs intentionally live in separate asset store.
- **A08.02 equivalent runtime behavior:** `GAP` — F-021/F-022 and F-013 for ambiguous catalog identity.
- **A08.03 autosave deterministic debounce:** `AUDITED_OK` inside controller: one watch interval, one pending timer, explicit clear/disable/markSaved lifecycle.
- **A08.04 wrong project overwrite:** `GAP` — F-020 is primarily lost-update, not evidence of writing the old state into the new project. Controller does cancel old timer, which protects against cross-project overwrite but currently sacrifices pending edits.
- **A08.05 clean new project:** `AUDITED_OK` — autosave disabled, new project id/time created, assets cleared, modules reset before new scene composition.
- **A08.06 switch transient cleanup:** `AUDITED_OK` for inspected paths — menus close, assets/object URLs reset, scene/stage rebuilt, autosave baseline reset. A09/A10 inspect renderer selection/focus details.
- **A08.07 delete behavior:** `GAP` — F-023.
- **A08.08 every special module round-trip:** `GAP` — F-022.
- **A08.09 failure paths:** `GAP` — project delete atomicity F-023; import failure handling is A14.
- **A08.10 schema/version upgrade:** `GAP` — F-021.

## Storage schema note

Project and asset modules duplicate IndexedDB database/version/store constants and each implements its own `openDb()`. They currently agree (`fair-stand-configurator`, DB v2), but this is a drift risk. A13 owns whether to record it separately after storage-layer cross-check.

Section audit status: **GAP**.
Next audit section: **A09 — Renderer / scene / runtime-derived behavior**.
