# desk_banko_150 — Canonical Item

Migration öncesi tam envanter: [current-system/desk_banko_150](../current-system/desk_banko_150.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.desk_banko_150` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `catalogKey = itemKey = desk_banko_150`. Type ailesi `counter`; straight genişlik 150 cm. Doğrulanmış ölçüler: `widthCm=150`, `depthCm=50`, `heightCm=100`. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=counter`, `nominalWidthCm=150`. Miktar SoT: `src/moduleRecipes.js` → `counter:150`. Child satırları Item kartında kopyalanmaz; mevcut recipe miktarları bu migration’da değişmez.

## Factory, state ve persistence
`createCounterModuleState` Item’dan default üretir; `itemKey`/`catalogKey` damgalar; 6 face. Load hydrate `catalogKey → itemKey`; alias yok.

## Behavior ve renderer sınırı
Type `counter` free/50 cm snap; straight rotation step 45°. Procedural renderer business SoT değildir.

## Regression
`test/deskBankoItemsContract.test.js`, `test/counterModule.test.js`, `test/counterRecipes.test.js`; E2E `e2e/desk-banko-items-contract.spec.mjs`.
