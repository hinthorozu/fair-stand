# EXTRA_LONG_PLANTER_100 — Canonical Item

Migration öncesi tam envanter: [current-system/EXTRA_LONG_PLANTER_100](../current-system/EXTRA_LONG_PLANTER_100.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > INDOOR_PLANT_ITEMS.EXTRA_LONG_PLANTER_100` canonical itemKey/name/type/dimensions/modelFile sahibidir. Tekil Item; `catalogKey = itemKey = EXTRA_LONG_PLANTER_100`. Type ailesi `indoor-plant-1`; ölçü 100×30×30 cm; `modelFile = saksi_bitkili_100x30x30.glb`; `modelRotationYDeg=90`; `preserveModelScale=true`. Parent unit / BOM uydurulmadı.

## Factory, state ve persistence
`createIndoorPlantModuleState` Item'dan default üretir; uzun saksıda `surface.color` vardır (`free-model-color`). Load hydrate; alias yok.

## Behavior ve renderer sınırı
`indoor-plant-1` free behavior. GLB görünümü business SoT değildir.

## Regression
`test/indoorPlantItemsContract.test.js`; E2E `e2e/indoor-plant-items-contract.spec.mjs`.
