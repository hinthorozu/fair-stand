# A17 — Performance / bundle / render lifecycle audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Baseline

- `scene3d.js` is ~259 KB source and remains the largest application source unit.
- `main.js` is ~77 KB source.
- `public/` is ~64.91 MiB at baseline.
- at least ~30.64 MiB of that public footprint is parked/unreferenced deployment payload under F-033.
- Three.js is intentionally split into a stable `three-vendor` build chunk and Vite chunk warning limit is configured to 650 KB.
- editor pixel ratio is capped (1.0 coarse pointers, 1.5 otherwise); directional shadow map is 2048².

## Lifecycle observations

- scene is created once at application initialization; project switches rebuild stage/wall state rather than creating another top-level renderer.
- exhibition-hall rebuild explicitly disposes replaced geometry.
- ground helper disposal removes geometry/materials.
- fabric image replacement disposes previous texture maps/source textures on inspected paths.
- model loader promises intentionally cache templates per model/file to avoid repeated GLB fetch/parse.
- no concrete project-switch duplicate-listener accumulation was identified in the inspected architecture.

This audit did not establish a reproducible Three.js leak in add/delete/rebuild paths, so no speculative leak finding is opened. Browser memory profiling is still part of the missing E2E/performance instrumentation gap.

## Checklist results

- A17.01 build/public footprint baseline: `GAP` — public footprint recorded, but CI does not publish/retain a production build-size budget/report.
- A17.02 largest JS modules: `AUDITED_OK` inventory-wise; architecture concentration is F-010/F-011/F-017.
- A17.03 largest public assets: `GAP` — F-033.
- A17.04 repeated add/delete resource leaks: `DECISION_REQUIRED` — source contains disposal paths; browser memory regression proof is absent.
- A17.05 project switching handler/object accumulation: `AUDITED_OK` at source architecture level; one scene instance.
- A17.06 autosave write rate: `AUDITED_OK` for controller debounce/watch design; durability issue is F-020.
- A17.07 large image/model handling: `GAP` — F-033/F-037.
- A17.08 render/update loops bounded: `AUDITED_OK` for inspected continuous loop/config choices; no extra per-project renderer loop found.
- A17.09 measurable performance regression guard: `GAP` — no automated browser perf/memory budget.

Section audit status: **GAP**.
