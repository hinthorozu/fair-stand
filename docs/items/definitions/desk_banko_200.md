# desk_banko_200 — Canonical Item

Migration öncesi tam envanter: [current-system/desk_banko_200](../current-system/desk_banko_200.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.desk_banko_200` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `itemKey = desk_banko_200`. Type ailesi `counter`; straight genişlik 200 cm. Doğrulanmış ölçüler: `widthCm=200`, `depthCm=50`, `heightCm=100`. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=counter`, `nominalWidthCm=200`. Miktar SoT: `src/moduleRecipes.js` → `counter:200`. Child satırları Item kartında kopyalanmaz; mevcut recipe miktarları bu migration’da değişmez.

## Factory, state ve persistence
`createCounterModuleState` Item’dan default üretir; `itemKey` damgalar; 6 face. Load hydrate `itemKey`; alias yok.

## Behavior ve renderer sınırı
Type `counter` free/50 cm snap; straight rotation step 45°. Procedural renderer business SoT değildir.

## Regression
`test/deskBankoItemsContract.test.js`, `test/counterModule.test.js`, `test/counterRecipes.test.js`; E2E `e2e/desk-banko-items-contract.spec.mjs`.
