# furniture_table_chair_set_eames — Canonical Item

Migration öncesi tam envanter: [current-system/furniture_table_chair_set_eames](../current-system/furniture_table_chair_set_eames.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > FURNITURE_ITEMS.furniture_table_chair_set_eames` canonical itemKey/name/type/dimensions sahibidir. Item kümesi; `catalogKey = itemKey = furniture_table_chair_set_eames`. Type `table-chair-set-eames`; footprint 150×150×82 cm. Üyelik aynı Item’dadır: `1 × glass_table` + `4 × chair_eames`. `moduleRecipes.js` kullanılmaz. Parent unit / BOM uydurulmadı (`decision-required`).

## Factory, state ve persistence
`createEamesTableChairSetModuleState` Item’dan default üretir; `itemKey`/`catalogKey` damgalar; `chairCount` küme üyeliğinden 4 gelir; editable `surface` korunur (`free-model-color`). Load’da `normalizeModuleItemState` hydrate eder; alias yok. Sahne tek modül kalır.

## Behavior ve renderer sınırı
`moduleBehavior.js > table-chair-set-eames`: free, snap 10, `collision: none`, `magneticSnap: none`, boundary `stand-edge` (çöp kutusu ile aynı serbestlik; stand dışına çıkmaz). Masa geometrisi `glass_table` Item’dan; sandalye GLB mevcut `eames_chair.glb`. GLB/material hedefi business SoT değildir.

## Regression
`test/furnitureItemsContract.test.js`; `test/chairEamesContract.test.js`; E2E `e2e/furniture-items-contract.spec.mjs`.
