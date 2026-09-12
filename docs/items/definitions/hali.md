# hali — Kanonik Item

Migration öncesi tam envanter: [current-system/hali](../current-system/hali.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > FLOOR_ITEMS.hali` kanonik itemKey/name/type sahibidir. Tekil Item. `itemKey = floorType = hali`. Type `floor`. Katalog kartı yoktur. `defaultColor=#8b8f94`. `paintable=true`. Standı kaplayan zemin olduğu için oturum alanı ölçü uydurulmadı. Unit / BOM uydurulmadı.

## Oluşturma, state ve kalıcılık
`currentStand.floorType = hali`. Halı repeat `0.7 m` renderer ölçeğidir.

## Regresyon
`test/floorItemsContract.test.js`; E2E `e2e/floor-items-contract.spec.mjs`.
