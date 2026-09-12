# furniture_bar_stool_classic — Kanonik Item

Migration öncesi tam envanter: [current-system/furniture_bar_stool_classic](../current-system/furniture_bar_stool_classic.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > FURNITURE_ITEMS.furniture_bar_stool_classic` kanonik itemKey/name/type/dimensions sahibidir. Tekil Item; `itemKey = furniture_bar_stool_classic`. Type `bar-stool`; oturum alanı 60×55×121 cm. Katalogda modelFile yoktu; renderer `bar_chair.glb` hardcode eder. Üst birim / BOM uydurulmadı (`decision-required`).

## Oluşturma, state ve kalıcılık
`createBarStoolModuleState` Item’dan default üretir; `itemKey` damgalar; editable `surface` korunur (`free-model-color`). Yüklemede `normalizeModuleItemState` doldurur; takma ad yok.

## Davranış ve renderer sınırı
`moduleBehavior.js > bar-stool`: free, snap 10, rotation step 45°, default rotation 270°, `collision: none`, `magneticSnap: none`, boundary `stand-edge`. GLB/material hedefi iş tek kaynağı değildir.

## Regresyon
`test/furnitureItemsContract.test.js`; E2E `e2e/furniture-items-contract.spec.mjs`.
