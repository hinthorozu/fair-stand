# wall_shelf_2_150 — Canonical Item

Migration öncesi tam envanter: [current-system/wall_shelf_2_150](../current-system/wall_shelf_2_150.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_shelf_2_150` canonical itemKey/name/type/shelfCount/dimensions sahibidir. Bileşik Item; `catalogKey = itemKey = wall_shelf_2_150`. Type ailesi `shelf`; genişlik 150 cm; `shelfCount = 2`. Parent üzerinde unit uydurulmadı. Production `shelf_150` board Item'ından ayrıdır.

## Composition / BOM
`composition.mode=recipe`, `moduleType=shelf`, `nominalWidthCm=150`, `options.shelfCount=2`. Miktar SoT: `src/moduleRecipes.js` `shelf:150:2`. Child satırları Item kartında kopyalanmaz; mevcut recipe miktarları değişmez. Raw BOM UI dokunulmadı.

## Factory, state ve persistence
`createShelfModuleState` Item'dan default üretir; `itemKey`/`catalogKey` damgalar; 7 strip + `shelfLightingOn=false`. Load'da hydrate; alias yok. Composite ayrımı `composition.moduleType=shelf` ile production board'dan ayrılır.

## Behavior ve renderer sınırı
`moduleBehavior.js > shelf`: `WALL_BEHAVIOR`. Procedural renderer business SoT değildir.

## Regression
`test/wallShelfItemsContract.test.js`; E2E `e2e/wall-shelf-items-contract.spec.mjs`.
