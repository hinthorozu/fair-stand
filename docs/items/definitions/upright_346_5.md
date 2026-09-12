# upright_346_5 — Item Contract

## Kanonik kimlik
- `itemKey`: `upright_346_5`
- `name`: `Dikme 346,5 cm`
- `type`: `upright`
- `unit`: `adet`
- structure: Tekil Item

## Kanonik ürüne özgü özellikler
- `dimensions.lengthCm = 346.5`
- `dimensions.thicknessCm = 8`
- `material = 'alüminyum'`
- `defaultColor = 0xd0d3d4`

These values are product defaults owned by the Item. Explicit project/runtime/render ezmes may replace presentation where applicable without changing the kanonik default.

## Bileşim / BOM
The Item is a leaf BOM component. It is consumed by 18 doğrulanmış parent recipes, quantity `2` in each. Parent recipes own quantity; `src/productionParts.js` owns product üstveri.

## Davranış / state / kalıcılık
Standalone yerleşim, move, rotation, snap/collision, selection, context-menu, delete/duplicate, oluşturucu, kalıcılık and reflow are `UYGULANMIYOR` for this leaf Item. Those yetenekler are owned by parent module runtime where applicable.

## Renderer ezme sınırı
Renderer creates prosedürel frame/post geometry and does not use `upright_346_5` as a mesh identity. Production dimensions and kanonik default color/material remain Item truth; specialized renderer geometry/material/color may ezme visual representation explicitly.

## Regresyon sözleşmesi
`test/upright3465ItemContract.test.js` protects kanonik identity/dimensions and 18 recipe quantities. `test/uprightIntrinsicProperties.test.js` protects `material='alüminyum'` and `defaultColor=0xd0d3d4`.

## Tamamlanma
Kanonik product contract is complete for the currently doğrulanmış system. No renderer/state/kalıcılık migration is introduced by this property decision.
