# wall_shelf_3_100 — Kanonik Item

Migration öncesi tam envanter: [current-system/wall_shelf_3_100](../current-system/wall_shelf_3_100.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_shelf_3_100` kanonik itemKey/name/type/shelfCount/dimensions sahibidir. Bileşik Item; `itemKey = wall_shelf_3_100`. Type ailesi `shelf`; genişlik 100 cm; `shelfCount = 3`. Üst öğe üzerinde unit uydurulmadı. Production `shelf_100` board Item'ından ayrıdır.

## Bileşim / BOM
`composition.mode=recipe`, `moduleType=shelf`, `nominalWidthCm=100`, `options.shelfCount=3`. Miktar tek kaynak: `src/moduleRecipes.js` `shelf:100:3`. Alt satırları Item kartında kopyalanmaz; mevcut recipe miktarları değişmez. Raw BOM UI dokunulmadı.

## Oluşturma, state ve kalıcılık
`createShelfModuleState` Item'dan default üretir; `itemKey` damgalar; 7 strip + `shelfLightingOn=false`. Yüklemede hydrate; takma ad yok. Composite ayrımı `composition.moduleType=shelf` ile production board'dan ayrılır.

## Davranış ve renderer sınırı
`moduleBehavior.js > shelf`: `WALL_BEHAVIOR`. Prosedürel renderer iş tek kaynağı değildir.

## Regresyon
`test/wallShelfItemsContract.test.js`; E2E `e2e/wall-shelf-items-contract.spec.mjs`.
