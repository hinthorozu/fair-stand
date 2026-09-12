# chair_eames — Kanonik Item

Migration öncesi tam envanter: [current-system/chair_eames](../current-system/chair_eames.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > FURNITURE_ITEMS.chair_eames` kanonik itemKey/name/type/dimensions sahibidir. Tekil Item; `itemKey = chair_eames`. Type `chair`; oturum alanı 46×58×82 cm. Katalogda modelFile yok; renderer mevcut `eames_chair.glb` yükler. Unit / BOM uydurulmadı (`decision-required`).

## Oluşturma, state ve kalıcılık
`createEamesChairModuleState` Item’dan default üretir; `itemKey` damgalar; editable `surface` korunur (`free-model-color`). Yüklemede `normalizeModuleItemState` doldurur; takma ad yok.

## Davranış ve renderer sınırı
`moduleBehavior.js > chair`: free, snap 10, rotation step 90°, default rotation 0°, `collision: none`, `magneticSnap: none`, boundary `stand-edge`. GLB/material hedefi iş tek kaynağı değildir. `furniture_table_chair_set_eames` bu Item’ın parent kümesidir (`1 × glass_table` + `4 × chair_eames`).

## Regresyon
`test/furnitureItemsContract.test.js`; `test/chairEamesContract.test.js`; E2E `e2e/furniture-items-contract.spec.mjs`.
