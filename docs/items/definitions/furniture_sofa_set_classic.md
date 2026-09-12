# furniture_sofa_set_classic — Canonical Item

Migration öncesi tam envanter: [current-system/furniture_sofa_set_classic](../current-system/furniture_sofa_set_classic.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > FURNITURE_ITEMS.furniture_sofa_set_classic` canonical itemKey/name/type/dimensions sahibidir. Item kümesi; `catalogKey = itemKey = furniture_sofa_set_classic`. Type `sofa-set-classic`; footprint 150×150×78 cm. Üyelik aynı Item’dadır: `1 × furniture_sofa_double_classic` + `2 × furniture_sofa_single_classic` + `1 × furniture_coffee_table_classic`. Miktarlar mevcut takım renderer yerleşiminden (1 ikili mesh + 2 tekli mesh + 1 sehpa). `moduleRecipes.js` kullanılmaz. Parent unit / BOM uydurulmadı (`decision-required`).

## Factory, state ve persistence
`createBeigeSofaSetModuleState` Item’dan default üretir; `itemKey`/`catalogKey` damgalar; editable `surface` korunur (`free-model-color`). Load’da `normalizeModuleItemState` hydrate eder; alias yok. Sahne tek modül kalır.

## Behavior ve renderer sınırı
`moduleBehavior.js > sofa-set-classic`: free, snap 10, boundary `wall-inner-face`. Takım yerleşim açıları mevcut renderer placements’tır; parça Item’ların tekil `visualRotationYDeg` değeri takımı değiştirmez. GLB/material hedefi business SoT değildir.

## Regression
`test/furnitureItemsContract.test.js`; `test/sofaClassicPiecesContract.test.js`; E2E `e2e/furniture-items-contract.spec.mjs`.
