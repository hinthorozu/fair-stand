# upright_346_5 — Item Contract

## Canonical identity
- `itemKey`: `upright_346_5`
- `name`: `Dikme 346,5 cm`
- `type`: `upright`
- `unit`: `adet`
- structure: Tekil Item

## Canonical intrinsic properties
- `dimensions.lengthCm = 346.5`
- `dimensions.thicknessCm = 8`
- `material = 'alüminyum'`
- `defaultColor = 0xd0d3d4`

These values are product defaults owned by the Item. Explicit project/runtime/render overrides may replace presentation where applicable without changing the canonical default.

## Composition / BOM
The Item is a leaf BOM component. It is consumed by 18 verified parent recipes, quantity `2` in each. Parent recipes own quantity; `src/productionParts.js` owns product metadata.

## Behavior / state / persistence
Standalone placement, move, rotation, snap/collision, selection, context-menu, delete/duplicate, factory, persistence and reflow are `UYGULANMIYOR` for this leaf Item. Those capabilities are owned by parent module runtime where applicable.

## Renderer override boundary
Renderer creates procedural frame/post geometry and does not use `upright_346_5` as a mesh identity. Production dimensions and canonical default color/material remain Item truth; specialized renderer geometry/material/color may override visual representation explicitly.

## Regression contract
`test/upright3465ItemContract.test.js` protects canonical identity/dimensions and 18 recipe quantities. `test/uprightIntrinsicProperties.test.js` protects `material='alüminyum'` and `defaultColor=0xd0d3d4`.

## Completion
Canonical product contract is complete for the currently verified system. No renderer/state/persistence migration is introduced by this property decision.
