# desk_banko_100_L — Kanonik Item

Migration öncesi tam envanter: [current-system/desk_banko_100_L](../current-system/desk_banko_100_L.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > COMPOSITE_ITEMS.desk_banko_100_L` kanonik itemKey/name/type/shape/dimensions sahibidir. Bileşik Item; `itemKey = desk_banko_100_L`. Type ailesi `counter`; `shape=L`; ölçü 100×100×100 cm. Üst öğe üzerinde unit uydurulmadı.

## Bileşim / BOM
`composition.mode=recipe`, `moduleType=counter`, `nominalWidthCm=100`, `options.shape=L`. Miktar tek kaynak: `src/moduleRecipes.js` → `counter-l:100`. Alt satırları Item kartında kopyalanmaz; mevcut recipe miktarları bu migration’da değişmez.

## Oluşturma, state ve kalıcılık
`createCounterModuleState` Item’dan default üretir; 8 editable face. Load hydrate `itemKey`; takma ad yok.

## Davranış ve renderer sınırı
Type `counter` + shape L: default rotation 270°, rotation step 90°. `createLCounterModule` prosedürel; iş tek kaynağı değildir.

## Regresyon
`test/deskBankoItemsContract.test.js`, `test/lCounter100Contract.test.js`; E2E `e2e/desk-banko-items-contract.spec.mjs`.
