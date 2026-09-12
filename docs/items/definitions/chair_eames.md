# chair_eames — Canonical Item

Migration öncesi tam envanter: [current-system/chair_eames](../current-system/chair_eames.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > FURNITURE_ITEMS.chair_eames` canonical itemKey/name/type/dimensions sahibidir. Tekil Item; `itemKey = chair_eames`. Type `chair`; footprint 46×58×82 cm. Katalogda modelFile yok; renderer mevcut `eames_chair.glb` yükler. Unit / BOM uydurulmadı (`decision-required`).

## Factory, state ve persistence
`createEamesChairModuleState` Item’dan default üretir; `itemKey` damgalar; editable `surface` korunur (`free-model-color`). Load’da `normalizeModuleItemState` hydrate eder; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > chair`: free, snap 10, rotation step 90°, default rotation 0°, `collision: none`, `magneticSnap: none`, boundary `stand-edge`. GLB/material hedefi business SoT değildir. `furniture_table_chair_set_eames` bu Item’ın parent kümesidir (`1 × glass_table` + `4 × chair_eames`).

## Regression
`test/furnitureItemsContract.test.js`; `test/chairEamesContract.test.js`; E2E `e2e/furniture-items-contract.spec.mjs`.
