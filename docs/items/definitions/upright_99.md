# upright_99 — Item Contract

## Canonical identity
- `itemKey`: `upright_99`
- `name`: `Dikme 99 cm`
- `type`: `upright`
- `unit`: `adet`
- structure: Tekil Item

## Canonical intrinsic properties
- `dimensions.lengthCm = 99`
- `dimensions.thicknessCm = 8`
- `material = 'alüminyum'`
- `defaultColor = 0xd0d3d4`

These values are product defaults owned by the Item. Explicit project/runtime/render overrides may replace presentation where applicable without changing the canonical default.

## Composition / BOM
Leaf BOM Item. Straight counter recipes `100/150/200` consume quantity `4`; L-counter recipes `100/150/200` consume quantity `5`. Parent recipes own quantity; Item owns product metadata.

## Behavior / state / persistence
Standalone placement, move, rotation, snap/collision, selection, context-menu, delete/duplicate, factory, persistence and reflow are `UYGULANMIYOR`. Parent counter runtime owns those capabilities.

## Renderer override boundary
Renderer creates procedural counter posts and does not use `upright_99` as mesh identity. Production dimensions/material/defaultColor remain Item truth; specialized renderer geometry/material/color may explicitly override presentation.

## Regression contract
`test/upright99And495ItemContract.test.js` protects canonical identity/dimensions and six recipe quantities. `test/uprightIntrinsicProperties.test.js` protects `material='alüminyum'` and `defaultColor=0xd0d3d4`.

## Completion
Canonical product contract is complete for the currently verified system. No renderer/state/persistence migration is introduced by this property decision.
