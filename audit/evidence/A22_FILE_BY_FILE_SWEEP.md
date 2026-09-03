# A22 — File-by-file final source sweep

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Coverage

A03 mapped all **51 `src/` files** to a primary owner/domain. A22 re-used that complete map and cross-checked the remaining root/infra surfaces from the recursive repository tree:

- `index.html`
- `package.json` / lockfile
- `vite.config.js`
- `.github/workflows/ci.yml`
- `.github/change-contract.json`
- `scripts/**`
- `public/**`
- `test/**` and legacy `tests/**`
- canonical rule/contract/audit/roadmap documents.

No source family was intentionally excluded from the A00-A23 evidence chain.

## File-level conflicts confirmed

- `main.js`: parallel module-state construction registry — F-010; destructive UI scope/reset bugs — F-027/F-028; archive/schema trust gaps — F-035/F-036/F-037.
- `modulePlacement.js` / `scene3d.js` / `main.js`: hidden module-specific placement policy — F-011.
- `cornerPlacement.js` versus current canonical right-wall placement/reflow tests: 90° vs 270° convention conflict — F-016.
- `designState.js` versus catalog: structural/default dimension duplication — F-018/F-019.
- `scene3d.js`: direct persistent state mutation — F-017; model failure visibility — F-024.
- `projectStore.js` + `assetStore.js`: duplicated DB schema owner — F-032; multi-store atomicity F-023.
- `rawBomDebug.js` + `index.html`: production debug path — F-025.
- `automaticWall.js`: active multi-module composition without feature contract — F-029.
- `moduleRecipes.js` / `productionParts.js`: no project Final BOM / relationship connector pass — F-030/F-031.
- `scripts/install-server.sh`: deploy chain weaker than CI — F-042.
- historical source-rewrite scripts: F-045.
- public asset tree: F-033/F-034.

## TODO / FIXME / HACK / DEBUG sweep

Repository code search for TODO/FIXME returned zero indexed matches, but the GitHub code-search response marked results `incomplete`, so this audit does **not** make the stronger claim that no marker exists anywhere. Independently inspected core files did not reveal an unresolved TODO/FIXME marker driving a new runtime finding. `rawBomDebug.js` is a real debug surface and is already F-025.

## Orphan/dead-path classification

No new production-orphan source file is promoted to a separate finding without stronger import-graph proof. `cornerPlacement.js` remains specifically problematic because its verified behavior conflicts with the active placement convention (F-016), regardless of whether it is currently a primary runtime path. Parked public assets are explicitly handled under F-033 rather than being deleted or guessed obsolete.

## Checklist result

All files/directories required by A22 were inspected/classified through A00-A22 evidence or explicitly marked `DECISION_REQUIRED`; no A22 item remains `NOT_AUDITED`.

Section audit status: **GAP — sweep complete, findings cross-linked; no fix performed.**
