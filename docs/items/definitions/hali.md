# hali — Canonical Item

Migration öncesi tam envanter: [current-system/hali](../current-system/hali.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > FLOOR_ITEMS.hali` canonical itemKey/name/type sahibidir. Tekil Item. `itemKey = floorType = hali`. Type `floor`. Katalog kartı yoktur. `defaultColor=#8b8f94`. `paintable=true`. Standı kaplayan zemin olduğu için footprint ölçü uydurulmadı. Unit / BOM uydurulmadı.

## Factory, state ve persistence
`currentStand.floorType = hali`. Halı repeat `0.7 m` renderer ölçeğidir.

## Regression
`test/floorItemsContract.test.js`; E2E `e2e/floor-items-contract.spec.mjs`.
