# A10 — UI controls / inputs / menus / shortcuts / feedback audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Static UI inventory

### Global/sidebar
- sidebar toggle
- collapsible `<details>` sections

### Project
- rename
- saved project select
- save
- open
- export ZIP
- import ZIP + hidden file input
- delete project
- project status/loading overlay

### Stand setup
- 5 stand type buttons
- X / Y number inputs
- floor select
- auto-depot enabled checkbox
- depot size select
- depot contents checkbox
- create stage

### Module/editor
- open module catalog
- clear wall
- color picker
- apply color
- HEX/RGB/CMYK inputs
- illuminated-foam halo color
- image upload
- asset library tiles
- image cover/contain/remove
- reset all module features
- render current view

## Dynamic UI inventory

- module context menu: delete, duplicate left/right, resize foam, glass, lightbox fabric, mesh, fabric light, shelf light, add left/right
- module catalog picker + selection queue/reorder
- drag-sidebar/catalog preview
- asset context menu: illuminated foam / delete
- project naming dialog
- illuminated-foam dimension dialog
- help guide
- view cube / scene interaction controls
- selection/status feedback observers
- **raw BOM debug panel** currently injected at runtime

## Findings

### F-025 — P1 — production entrypoint loads visible raw BOM debug UI

`index.html` unconditionally imports `/src/rawBomDebug.js`. That module immediately injects an open sidebar card named **“Üretim Listesi · Debug”** and derives BOM by parsing human-facing `selection-info` text.

Consequences:

- debug UI is part of normal production bundle/runtime,
- user-facing UI exposes an internal/incomplete BOM surface,
- behavior depends on parsing presentation strings rather than canonical selected-module identity,
- debug code can drift independently from actual module selection/contracts.

This is not merely dead code; it executes on every normal app load.

### F-026 — P2 — user-visible standards/feature facts are duplicated as static HTML text

The `Standartlar` panel hard-codes product values already owned by canonical runtime sources (height, depth, strip count/height, widths, grid, stand surround, max dimensions). Auto-depot helper text also hard-codes the generated contents list.

These values agree with current runtime, but UI is an independent copy. A canonical change can leave the user reading stale rules while runtime behaves differently.

This is distinct from F-003 (roadmap/docs duplication): F-026 is active product UI drift.

### F-027 — P1 — “Duvarı temizle” action deletes all scene modules, not only the wall

UI label: `Duvarı temizle`.
Confirmation describes deleting the current wall/panel colors/images.
Implementation performs:

`currentModules = []`

then clears the wall scene. Since `currentModules` also contains free furniture, depot equipment, TV/overlays and top fixtures, the control can remove substantially more than its label/confirmation tells the user.

This is a destructive-action scope mismatch.

### F-028 — P1 — “Tüm Özellikleri Kaldır” cannot operate when illuminated-foam exists

Reset maps every current module through `createCatalogModuleState(module,{preservePlacement:true})` and aborts if any result is null.

`createCatalogModuleState()` handles catalog runtime types but not the non-catalog `illuminated-foam` type. Therefore the presence of an illuminated-foam module causes the entire reset operation to fail with “Bazı modül türleri ... döndürülemedi.”

This is a direct consequence of the parallel factory dispatcher root gap F-010, but it is an independent user-visible bug and receives its own finding.

## Other checklist results

- **DOM control without handler:** no orphan static control identified among current index selectors.
- **handler without control:** no missing static target identified; dynamic controls are created before binding in their owning modules.
- **hidden/disabled state:** stage-dependent controls are explicitly enabled/disabled; auto-depot dependent fields synchronize from checkbox/state.
- **destructive confirmations:** project delete, module delete, clear wall, reset and new-project replacement use confirmation; F-027 identifies incorrect declared scope.
- **project actions:** busy/loading status exists for save/open/import/export; delete has catch/status.
- **module context capabilities:** glass/fabric/mesh/shelf/foam controls are conditionally shown by context; side insertion fails behavior enforcement under F-015.
- **catalog identity across UI paths:** context-picker vs drag-sidebar identity mismatch is F-013.
- **keyboard interaction:** source-level mapping exists and editable targets are excluded for view shortcuts; full conflict/focus/accessibility audit is A16.
- **dynamic UI tests:** several controllers have unit/source integration tests, but complete end-user coverage is A18/A19.

Section audit status: **GAP**.
Next audit section: **A11 — Feature + scene composition / automation**.
