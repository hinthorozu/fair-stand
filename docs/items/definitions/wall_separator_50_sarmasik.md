# wall_separator_50_sarmasik — Canonical Item

Migration öncesi tam envanter: [current-system/wall_separator_50_sarmasik](../current-system/wall_separator_50_sarmasik.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_separator_50_sarmasik` canonical itemKey/name/type/modelFile/dimensions sahibidir. Bileşik Item; `catalogKey = itemKey = wall_separator_50_sarmasik`. Type ailesi `separator`; genişlik 50 cm; `modelFile = wall_separator_50_sarmasik.glb`. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=separator`, `nominalWidthCm=50`. Miktar SoT: aynı `separator:50` (düz 50 ile paylaşır). Recipe miktarları değişmez. Raw BOM UI dokunulmadı.

## Factory, state ve persistence
`createSeparatorModuleState` Item’dan default üretir; `modelFile` damgalanır. Catalog ayrımı `modelFile` ile. Load’da hydrate; alias yok.

## Behavior ve renderer sınırı
`WALL_BEHAVIOR`. GLB vine mesh’leri renderer detayıdır; business SoT değildir.

## Regression
`test/wallSeparatorItemsContract.test.js`; E2E `e2e/wall-separator-items-contract.spec.mjs`.
