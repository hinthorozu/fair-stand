# upright_49_5 — Item Contract

## Canonical identity
- `itemKey`: `upright_49_5`
- `name`: `Dikme 49,5 cm`
- `type`: `upright`
- `unit`: `adet`
- structure: Tekil Item

## Canonical intrinsic properties
- `dimensions.lengthCm = 49.5`
- `dimensions.thicknessCm = 8`
- `material = 'alüminyum'`
- `defaultColor = 0xd0d3d4`

These values are product defaults owned by the Item. Explicit project/runtime/render overrides may replace presentation where applicable without changing the canonical default.

## Composition / BOM
Leaf BOM Item. `base-wall:100/150/200` consume quantity `2`; `base:100/150/200` consume quantity `4`. Parent recipes own quantity; Item owns product metadata.

## Behavior / state / persistence
Standalone placement, move, rotation, snap/collision, selection, context-menu, delete/duplicate, factory, persistence and reflow are `UYGULANMIYOR`. Parent base/base-wall runtime owns those capabilities.

## Renderer override boundary
Renderer creates procedural base/base-wall posts and does not use `upright_49_5` as mesh identity. Production dimensions/material/defaultColor remain Item truth; specialized renderer geometry/material/color may explicitly override presentation.

## Regression contract
`test/upright99And495ItemContract.test.js` protects canonical identity/dimensions and six recipe quantities. `test/uprightIntrinsicProperties.test.js` protects `material='alüminyum'` and `defaultColor=0xd0d3d4`.

## Completion
Canonical product contract is complete for the currently verified system. No renderer/state/persistence migration is introduced by this property decision.
