# A13 F-033 closure

Finding: **F-033 — ~30.64 MiB parked/unreferenced assets under `public/` ship with production**

Status: **CLOSED / POST-MERGE VERIFIED**

## Root cause

Three large files remained under `public/` even though they were not active runtime inputs. Because Vite copies the `public/` tree into the production output, these parked assets were still shipped with every production build:

- `public/models/indoor_plants2.glb` — 22,018,072 bytes,
- `public/models/bar_chair2.glb` — 2,451,300 bytes,
- `public/textures/exhibition-floor.jpg` — 7,662,003 bytes.

Combined payload: 32,131,375 bytes, approximately **30.64 MiB**. The active `public/textures/exhibition-floor-optimized.jpg` asset was not part of the finding and remained in place.

## Remediation

Implementation PR **#76 — chore: remove unused F-033 production assets** removed all three parked production assets.

The remediation also updated the existing regression expectations so the repository now asserts that:

- `indoor_plants2.glb` is absent,
- `bar_chair2.glb` is absent,
- `exhibition-floor.jpg` is absent,
- the active optimized floor texture remains present,
- Yapay Çiçek 1 remains the only active artificial-plant runtime path.

No catalog, placement, persisted state, renderer selection or import/export behavior was intentionally changed.

## Verification

Final PR head: `6afc3eade2feb74aea2e75857acc800f21287962`.

PR CI run **#323 / run `33998906089`** completed successfully:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

PR #76 merged into `ROG` as `e44f326a95f9790b801bcfe08d9e2ec943fa57be`.

Post-merge `ROG` CI run **#324 / run `33998982007`** completed successfully:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

## Result

The three audited parked assets no longer exist in the production `public/` tree, removing approximately **30.64 MiB** of unused deployment payload while preserving the active optimized floor texture and active indoor-plant runtime path.

**F-033 is CLOSED.**
