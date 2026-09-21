# desk_banko_150_L — Kanonik Item

Migration öncesi tam envanter: [current-system/desk_banko_150_L](../current-system/desk_banko_150_L.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > COMPOSITE_ITEMS.desk_banko_150_L` kanonik itemKey/name/type/shape/dimensions sahibidir. Bileşik Item; `itemKey = desk_banko_150_L`. Type ailesi `counter`; `shape=L`; ölçü 150×150×100 cm. Üst öğe üzerinde unit uydurulmadı.

## Bileşim / BOM
`composition.mode=recipe`, `moduleType=counter`; recipe lookup `item.dimensions.widthCm=150`, `options.shape=L`. Miktar tek kaynak: `src/moduleRecipes.js` → `counter-l:150`. Mevcut recipe miktarları değişmez.

## Oluşturma, state ve kalıcılık
`createCounterModuleState` Item’dan default üretir; 8 face. Load hydrate; takma ad yok.

## Davranış ve renderer sınırı
Type `counter` placement/snap. Sahne Z Item kolonlarıdır (`docs/refactor/ROTATION.md`). Prosedürel L renderer iş tek kaynağı değildir.

## Regresyon
`test/deskBankoItemsContract.test.js`, `test/lCounter150Contract.test.js`; E2E `e2e/desk-banko-items-contract.spec.mjs`.
