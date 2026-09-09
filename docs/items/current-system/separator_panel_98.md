# separator_panel_98 — Current System Inventory

Bu belge güncel `Version2` runtime'ını Item Contract checklist'inin 18 alanına göre kaydeder.

## 1. Identity / type — VAR
- `itemKey = separator_panel_98`
- `name = Separatör Paneli 98 × 47 cm`
- `type = separator-panel`
- `unit = adet`
- Canonical source: `src/productionParts.js`.

## 2. Intrinsic properties — VAR
- `widthCm = 98`
- `heightCm = 47`
- `thicknessCm = 0.8`
- `material = mdf`
- `defaultColor = 0xc79b63`
- `nominalModuleWidthCm = 100`
- MDF product decision is user-confirmed. Separator default color is the existing separator-specific runtime default formerly held by `DEFAULT_SEPARATOR_COLOR`.

## 3. Default state — VAR / parent-owned
The leaf production Item has no independent project state. `createSeparatorModuleState(100)` creates the parent separator surface and now derives its initial `#c79b63` color from this canonical Item default.

## 4. Factory / creation — UYGULANMIYOR at leaf
No `separator_panel_98` instance factory exists. Parent `separator` state is created through `createSeparatorModuleState()` / `MODULE_STATE_FACTORIES`.

## 5. Placement — UYGULANMIYOR at leaf
Placement belongs to the parent `separator` module. `moduleBehavior.js` maps `separator` to `WALL_BEHAVIOR`.

## 6. Move — UYGULANMIYOR at leaf
Parent separator uses wall behavior, including the existing wall move snap policy. Leaf Item has no move state.

## 7. Rotation — UYGULANMIYOR at leaf
Parent separator uses existing wall rotation behavior. Leaf Item has no independent rotation.

## 8. Snap / collision / connection — UYGULANMIYOR at leaf
Owned by parent separator wall behavior (`segment` collision, standard magnetic snap/connection semantics). No production-panel-specific placement logic exists.

## 9. Selection / drag — UYGULANMIYOR at leaf
Selection and drag operate on module/surface runtime objects, not on a persisted `separator_panel_98` instance.

## 10. Context menu — UYGULANMIYOR at leaf
Module context-menu actions are parent-module actions. The leaf production Item has no separate context menu.

## 11. Delete / duplicate / keyboard — UYGULANMIYOR at leaf
Delete/duplicate operate on separator module state. `duplicateModuleState()` duplicates the parent surface state and preserves overrides.

## 12. Persistence — UYGULANMIYOR as separate entity
Project persistence stores separator module state including its current surface color. No separate production Item instance is serialized.

## 13. Relationships / reflow — UYGULANMIYOR at leaf
Wall insertion/reflow belongs to the parent separator module. No leaf relationship graph is present.

## 14. BOM / composition — VAR
- `separator:50` contains `separator_panel_98 × 3`.
- `separator:100` contains `separator_panel_98 × 7`.
- Quantity ownership remains in `src/moduleRecipes.js`.
- Recipe expansion resolves metadata through canonical `itemKey` → `getProductionItem()`.

## 15. Renderer / asset / override boundary — VAR
`createSeparatorModule()` renders procedural rails/slats and consumes `surfaceState.color`. The renderer does not use this Item's dimensions as geometry source-of-truth. Runtime/user color changes are explicit state/render overrides and do not mutate the canonical Item default.

## 16. Runtime owners — VAR
- product metadata/defaults: `src/productionParts.js`
- parent default state: `src/designState.js` (consumes Item `defaultColor`)
- behavior: `src/moduleBehavior.js`
- BOM quantity/composition: `src/moduleRecipes.js`
- renderer: `src/scene3d.js`
- persistence: parent project/module state

## 17. Regression — VAR
`test/separatorPanelsItemContract.test.js` verifies identity, exact `98 × 47 × 0.8`, `material = mdf`, `defaultColor = 0xc79b63`, state default-color consumption, both recipe quantities and expanded metadata.

## 18. Open state / decisions / completion
No unresolved Item property remains in this batch. Canonical Item owns verified intrinsic properties/defaults; parent state consumes the canonical default; specialized renderer/state overrides remain allowed.
