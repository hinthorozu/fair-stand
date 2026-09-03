# A14 — Import / export / archive / project schema audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Current archive flow

Export builds a JSZip archive containing `project.json` plus `assets/<asset-id><ext>`. Import loads the full archive, validates basic manifest presence/shape, prepares all blobs, remaps asset IDs, then persists the imported project and assets. Failure after storage mutation attempts rollback of assets and project.

## Findings

### F-035 — P2 — archive version/schema has no canonical owner

`archiveVersion: 1` is written as a literal in the export handler and independently checked as literal `1` in the import handler. There is no shared archive schema/version module or migration registry. This is archive-specific and complements project-schema F-021.

### F-036 — P1 — imported project state is persisted without structural domain validation

Import validates that `manifest.project` is an object and has a non-empty string id, but then spreads the supplied project object and persists it. It does not validate before storage/restore that:

- `stand` matches a supported stand schema/range,
- `modules` is an array,
- module types/catalog identities are supported,
- placement fields are valid,
- dimensions/rotations are finite and within intended constraints,
- persisted special fields obey module/state contracts,
- project version is supported/migratable.

A malformed or future/foreign archive can therefore enter persistent storage before renderer/runtime code encounters it.

### F-037 — P1 — ZIP/image import paths have no explicit resource limits or content policy

The current import path has no configured limit for archive size, asset count, individual uncompressed asset size or total uncompressed bytes. Each manifest asset is expanded via `entry.async('blob')` and retained in `preparedAssets` before persistence. Normal image upload similarly relies on `accept="image/*"` and stores the supplied Blob without a repository-level size/content whitelist.

This is primarily an availability/storage-hardening gap, not evidence of remote code execution.

## Positive controls

- Required `project.json` is checked before storage mutation.
- `archiveVersion` is checked.
- asset list must be an array when present.
- duplicate manifest asset IDs are rejected.
- each listed asset path must resolve to a ZIP file entry.
- imported assets receive fresh IDs and all `imageAssetId` references are recursively remapped.
- archive is fully prepared before project save.
- post-save failures trigger cleanup attempts for imported assets + project.
- current JSZip 3.10.1 is newer than the 3.8.0 path-traversal fix line.

## Checklist results

- A14.01 canonical archive schema/version owner: `GAP` — F-035.
- A14.02 export intended project/assets: `AUDITED_OK` for current snapshot + owned assets.
- A14.03 pre-mutation archive/file preparation: `AUDITED_OK` for current basic checks.
- A14.04 project schema/IDs/paths: `GAP` — F-036.
- A14.05 failed import cleanup: `AUDITED_OK` at handler contract level; cleanup itself is separate multi-store operations.
- A14.06 duplicate project ID: `AUDITED_OK` — fresh project ID assigned.
- A14.07 round-trip fidelity: `GAP` — F-022; no real browser round-trip contract for every module/asset family.
- A14.08 archive/asset limits: `GAP` — F-037.
- A14.09 path traversal/weird filenames: `AUDITED_OK` for the library version's path sanitization baseline; application still trusts manifest path-to-entry mapping inside the in-memory ZIP.
- A14.10 backward compatibility/migration: `GAP` — F-021/F-035.

Section audit status: **GAP**.
