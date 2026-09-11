# desk_banko_100_L — Canonical Item

Migration öncesi tam envanter: [current-system/desk_banko_100_L](../current-system/desk_banko_100_L.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.desk_banko_100_L` canonical itemKey/name/type/shape/dimensions sahibidir. Bileşik Item; `catalogKey = itemKey = desk_banko_100_L`. Type ailesi `counter`; `shape=L`; ölçü 100×100×100 cm. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=counter`, `nominalWidthCm=100`, `options.shape=L`. Miktar SoT: `src/moduleRecipes.js` → `counter-l:100`. Child satırları Item kartında kopyalanmaz; mevcut recipe miktarları bu migration’da değişmez.

## Factory, state ve persistence
`createCounterModuleState` Item’dan default üretir; 8 editable face. Load hydrate `catalogKey → itemKey`; alias yok.

## Behavior ve renderer sınırı
Type `counter` + shape L: default rotation 270°, rotation step 90°. `createLCounterModule` procedural; business SoT değildir.

## Regression
`test/deskBankoItemsContract.test.js`, `test/lCounter100Contract.test.js`; E2E `e2e/desk-banko-items-contract.spec.mjs`.
