# upright_346_5 — Current System Inventory

## 1. Identity / type — VAR
Canonical source `src/productionParts.js`: `itemKey=upright_346_5`, `type=upright`, `unit=adet`, name `Dikme 346,5 cm`. Legacy `partId` is not the canonical identity.

## 2. Intrinsic properties — VAR
Canonical Item properties: `lengthCm=346.5`, `thicknessCm=8`, `material='alüminyum'`, `defaultColor=0xd0d3d4`. Material/color are product defaults; specialized renderer values may explicitly override them without changing the Item default.

## 3. Default state — UYGULANMIYOR
There is no standalone upright project state. Parent module state owns editor/runtime state.

## 4. Factory / creation — UYGULANMIYOR
No standalone upright factory exists; creation happens through parent modules/catalog descriptors.

## 5. Placement — UYGULANMIYOR
The leaf Item is not placed independently; parent module placement owns placement.

## 6. Move — UYGULANMIYOR
No independent upright move behavior; parent module behavior owns movement.

## 7. Rotation — UYGULANMIYOR
No independent upright rotation behavior; parent module behavior owns rotation.

## 8. Snap / collision / connection — UYGULANMIYOR
No leaf snap/collision identity exists. Parent module placement/relationship logic owns these concerns.

## 9. Selection / drag — UYGULANMIYOR
The upright is not independently selectable/draggable in project state.

## 10. Context menu — UYGULANMIYOR
Context-menu actions operate on the parent module, not the production leaf Item.

## 11. Delete / duplicate / keyboard — UYGULANMIYOR
These actions operate on parent module instances.

## 12. Persistence — UYGULANMIYOR
Projects persist parent module state; no separate `upright_346_5` instance is persisted.

## 13. Relationships / reflow — UYGULANMIYOR
No independent leaf relationship/reflow state. Parent modules own relationships.

## 14. BOM / composition — VAR
`upright_346_5` is a leaf BOM Item used in 18 verified parent recipes, quantity `2` in every occurrence. Parent recipes own quantity; recipe expansion resolves metadata through canonical `itemKey` → `getProductionItem()`.

## 15. Renderer / asset / override boundary — VAR
Renderer builds procedural parent-module frame/post meshes and does not use `upright_346_5` as mesh identity. Production `346.5 cm / 8 cm` is not forced onto renderer geometry. Visual renderer constants remain explicit specialized render overrides; they are not a second product source of truth.

## 16. Runtime owners — VAR
Product metadata: `src/productionParts.js`; quantity/composition: `src/moduleRecipes.js`; module behavior/state/persistence: parent module runtime; renderer: `src/scene3d.js`.

## 17. Regression — VAR
`test/upright3465ItemContract.test.js` protects identity, dimensions and 18 recipe quantities. `test/uprightIntrinsicProperties.test.js` protects `material='alüminyum'` and `defaultColor=0xd0d3d4` for the upright family.

## 18. Open state / decisions / completion — VAR
Product decision confirmed: upright material is aluminum and canonical default color is `#D0D3D4`. No renderer/state/placement/persistence migration is required for this property change.
