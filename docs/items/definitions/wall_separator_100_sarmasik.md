# wall_separator_100_sarmasik — Canonical Item

Migration öncesi tam envanter: [current-system/wall_separator_100_sarmasik](../current-system/wall_separator_100_sarmasik.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_separator_100_sarmasik` canonical itemKey/name/type/modelFile/dimensions sahibidir. Bileşik Item; `itemKey = wall_separator_100_sarmasik`. Type ailesi `separator`; genişlik 100 cm; `modelFile = wall_separator_100_sarmasik.glb`. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=separator`, `nominalWidthCm=100`. Miktar SoT: aynı `separator:100` (düz 100 ile paylaşır). Recipe miktarları değişmez. Raw BOM UI dokunulmadı.

## Factory, state ve persistence
`createSeparatorModuleState` Item’dan default üretir; `modelFile` damgalanır. Catalog ayrımı `modelFile` ile. Load’da hydrate; alias yok.

## Behavior ve renderer sınırı
`WALL_BEHAVIOR`. GLB vine mesh’leri renderer detayıdır; business SoT değildir.

## Regression
`test/wallSeparatorItemsContract.test.js`; E2E `e2e/wall-separator-items-contract.spec.mjs`.
