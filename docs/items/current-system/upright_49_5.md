# upright_49_5 — Current System Inventory

## 1. Identity / type — VAR
Canonical source `src/productionParts.js`: `itemKey=upright_49_5`, `type=upright`, `unit=adet`, name `Dikme 49,5 cm`.

## 2. Intrinsic properties — VAR
Canonical Item properties: `lengthCm=49.5`, `thicknessCm=8`, `material='alüminyum'`, `defaultColor=0xd0d3d4`. Renderer may explicitly override visual representation without changing the Item default.

## 3. Default state — UYGULANMIYOR
No standalone upright project state; base/base-wall parent state owns runtime/editor state.

## 4. Factory / creation — UYGULANMIYOR
No standalone upright factory; parent base/base-wall modules create runtime state.

## 5. Placement — UYGULANMIYOR
Leaf upright is not independently placed.

## 6. Move — UYGULANMIYOR
Parent module owns movement.

## 7. Rotation — UYGULANMIYOR
Parent module owns rotation.

## 8. Snap / collision / connection — UYGULANMIYOR
Parent module placement/relationship logic owns these concerns.

## 9. Selection / drag — UYGULANMIYOR
No independent upright selection/drag identity.

## 10. Context menu — UYGULANMIYOR
Context menu operates on parent module instances.

## 11. Delete / duplicate / keyboard — UYGULANMIYOR
These actions operate on parent module instances.

## 12. Persistence — UYGULANMIYOR
Projects persist parent module state; no separate `upright_49_5` instance is persisted.

## 13. Relationships / reflow — UYGULANMIYOR
No leaf relationship/reflow state; parent module owns relationships.

## 14. BOM / composition — VAR
Six verified recipes consume this Item: `base-wall:100/150/200` use quantity `2`; `base:100/150/200` use quantity `4`. Parent recipes own quantity and canonical `itemKey` resolves metadata through `getProductionItem()`.

## 15. Renderer / asset / override boundary — VAR
Base/base-wall renderers create procedural post geometry and do not use `upright_49_5` as mesh identity. Production `49.5 cm / 8 cm` is not forced onto renderer geometry. Visual renderer constants remain explicit specialized render overrides.

## 16. Runtime owners — VAR
Product metadata: `src/productionParts.js`; quantities/composition: `src/moduleRecipes.js`; state/behavior/persistence: parent module runtime; renderer: `src/scene3d.js`.

## 17. Regression — VAR
`test/upright99And495ItemContract.test.js` protects identity, dimensions and six recipe quantities. `test/uprightIntrinsicProperties.test.js` protects aluminum material and `0xd0d3d4` canonical default color.

## 18. Open state / decisions / completion — VAR
Product decision confirmed: upright material is aluminum and canonical default color is `#D0D3D4`. No renderer/state/placement/persistence migration is required for this change.
