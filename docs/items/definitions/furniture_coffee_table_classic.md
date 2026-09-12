# furniture_coffee_table_classic — Kanonik Item

Migration öncesi tam envanter: [current-system/furniture_coffee_table_classic](../current-system/furniture_coffee_table_classic.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > FURNITURE_ITEMS.furniture_coffee_table_classic` kanonik itemKey/name/type/dimensions sahibidir. Tekil Item; `itemKey = furniture_coffee_table_classic`. Type `coffee-table-classic`; oturum alanı 60×42×38 cm. `glass_table` değildir. ModelFile yok; renderer prosedürel sehpa. Unit / BOM uydurulmadı (`decision-required`).

## Oluşturma, state ve kalıcılık
`createCoffeeTableClassicModuleState` Item’dan default üretir; `itemKey` damgalar; surface yok (`free-model-fixed`). Yüklemede `normalizeModuleItemState` doldurur; takma ad yok.

## Davranış ve renderer sınırı
`moduleBehavior.js > coffee-table-classic`: free, snap 10, rotation step 90°, default rotation 0°, `collision: none`, `magneticSnap: none`, boundary `stand-edge`. Tabla/sap/taban ayrı Item değildir. `furniture_sofa_set_classic` bu Item’ın parent kümesidir (`1 × furniture_sofa_double_classic` + `2 × furniture_sofa_single_classic` + `1 × furniture_coffee_table_classic`).

## Regresyon
`test/furnitureItemsContract.test.js`; `test/sofaClassicPiecesContract.test.js`; E2E `e2e/furniture-items-contract.spec.mjs`.
