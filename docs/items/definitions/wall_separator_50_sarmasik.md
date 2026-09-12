# wall_separator_50_sarmasik — Kanonik Item

Migration öncesi tam envanter: [current-system/wall_separator_50_sarmasik](../current-system/wall_separator_50_sarmasik.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_separator_50_sarmasik` kanonik itemKey/name/type/modelFile/dimensions sahibidir. Bileşik Item; `itemKey = wall_separator_50_sarmasik`. Type ailesi `separator`; genişlik 50 cm; `modelFile = wall_separator_50_sarmasik.glb`. Üst öğe üzerinde unit uydurulmadı.

## Bileşim / BOM
`composition.mode=recipe`, `moduleType=separator`, `nominalWidthCm=50`. Miktar tek kaynak: aynı `separator:50` (düz 50 ile paylaşır). Recipe miktarları değişmez. Raw BOM UI dokunulmadı.

## Oluşturma, state ve kalıcılık
`createSeparatorModuleState` Item’dan default üretir; `modelFile` damgalanır. Catalog ayrımı `modelFile` ile. Yüklemede hydrate; takma ad yok.

## Davranış ve renderer sınırı
`WALL_BEHAVIOR`. GLB vine mesh’leri renderer detayıdır; iş tek kaynağı değildir.

## Regresyon
`test/wallSeparatorItemsContract.test.js`; E2E `e2e/wall-separator-items-contract.spec.mjs`.
