# desk_banko_150_L — Canonical Item

Migration öncesi tam envanter: [current-system/desk_banko_150_L](../current-system/desk_banko_150_L.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.desk_banko_150_L` canonical itemKey/name/type/shape/dimensions sahibidir. Bileşik Item; `catalogKey = itemKey = desk_banko_150_L`. Type ailesi `counter`; `shape=L`; ölçü 150×150×100 cm. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=counter`, `nominalWidthCm=150`, `options.shape=L`. Miktar SoT: `src/moduleRecipes.js` → `counter-l:150`. Mevcut recipe miktarları değişmez.

## Factory, state ve persistence
`createCounterModuleState` Item’dan default üretir; 8 face. Load hydrate; alias yok.

## Behavior ve renderer sınırı
Type `counter` + shape L: default rotation 270°, step 90°. Procedural L renderer business SoT değildir.

## Regression
`test/deskBankoItemsContract.test.js`, `test/lCounter150Contract.test.js`; E2E `e2e/desk-banko-items-contract.spec.mjs`.
