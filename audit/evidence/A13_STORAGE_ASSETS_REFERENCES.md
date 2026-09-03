# A13 — Storage / assets / references audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Storage map

- `src/projectStore.js`: IndexedDB project records.
- `src/assetStore.js`: IndexedDB image blobs.
- Database: `fair-stand-configurator`, DB version 2.
- Stores: `projects`, `image-assets`; asset index: `projectId`.
- Normal asset IDs are generated; imported assets receive fresh IDs and project state references are remapped.

## Findings

### F-032 — P2 — IndexedDB schema/migration ownership is duplicated

`projectStore.js` and `assetStore.js` each define the same DB name/version/store names and each owns an independent `openDb()` / `onupgradeneeded` implementation. They currently agree, but a future schema change can update one module without the other and produce order-dependent migration behavior.

### F-033 — P2 — ~30.64 MiB of parked/unreferenced public assets ship with production

Repository `public/` footprint at the baseline tree is about **64.91 MiB**. Three large assets are not active runtime inputs at this baseline:

- `public/models/indoor_plants2.glb` — 22,018,072 bytes; tests explicitly classify it as parked for possible future use.
- `public/models/bar_chair2.glb` — 2,451,300 bytes; no active source reference found.
- `public/textures/exhibition-floor.jpg` — 7,662,003 bytes; no active source reference found.

Combined: 32,131,375 bytes ≈ **30.64 MiB**. Because Vite copies `public/` content to the production output, parked files are deployment payload even when lazy/unreferenced. `exhibition-floor-optimized.jpg` is **not** included in this finding: `scene3d.js` actively loads it.

### F-034 — P2 — public asset provenance/license inventory is incomplete

Repository metadata includes attribution files for Bar Stool, Coat Rack, Eames Chair and Kettle. Several other active model families have no adjacent attribution/provenance record in the repository tree (for example mini fridge, sofa, indoor plant/long-planter and sarmaşık separator assets). This audit does not assert a license violation; it records that repository-level provenance cannot currently be proven uniformly.

## Checklist results

- A13.01 DB stores/index/version: `AUDITED_OK` for current shape; ownership duplication is F-032.
- A13.02 project/asset ownership: `AUDITED_OK` on inspected CRUD paths; asset reads/deletes use projectId ownership.
- A13.03 collision across imports: `AUDITED_OK` for current import path; assets are remapped to fresh IDs.
- A13.04 missing asset behavior: `GAP` via renderer/model failure feedback F-024 and image-reference absence not globally surfaced.
- A13.05 orphan cleanup: `DECISION_REQUIRED`; whole-project cleanup exists, global orphan reconciliation does not.
- A13.06 public inventory: `AUDITED_OK` — complete tree inspected.
- A13.07 public asset classification: `GAP` — F-033.
- A13.08 case-sensitive runtime paths: `AUDITED_OK` for active references inspected.
- A13.09 large-asset deployment policy: `GAP` — F-033.
- A13.10 attribution/license metadata: `GAP/DECISION_REQUIRED` — F-034.

Section audit status: **GAP**.
