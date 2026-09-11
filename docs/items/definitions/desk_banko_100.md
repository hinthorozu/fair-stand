# desk_banko_100 — Canonical Item

Migration öncesi tam envanter: [current-system/desk_banko_100](../current-system/desk_banko_100.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.desk_banko_100` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `catalogKey = itemKey = desk_banko_100`. Type ailesi `counter`; straight genişlik 100 cm. Doğrulanmış ölçüler: `widthCm=100`, `depthCm=50`, `heightCm=100`. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=counter`, `nominalWidthCm=100`. Miktar SoT: `src/moduleRecipes.js` → `counter:100`. Child satırları Item kartında kopyalanmaz; mevcut recipe miktarları bu migration’da değişmez.

## Factory, state ve persistence
`src/designState.js > createCounterModuleState` `getItem(itemKey|catalogKey|width+shape)` ile canonical Item’dan default üretir; `itemKey`/`catalogKey` damgalar; 6 editable face parity korunur. Load’da `normalizeModuleItemState` `catalogKey → itemKey` hydrate eder; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > counter`: free, 50 cm snap; straight 100/150/200 için rotation step 45°. Davranış type bazlıdır. Procedural renderer business SoT değildir.

## Regression
`test/deskBankoItemsContract.test.js`, `test/counterModule.test.js`, `test/counterRecipes.test.js`; E2E `e2e/desk-banko-items-contract.spec.mjs`.
