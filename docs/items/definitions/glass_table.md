# glass_table — Canonical Item

Migration öncesi tam envanter: [current-system/glass_table](../current-system/glass_table.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > FURNITURE_ITEMS.glass_table` canonical itemKey/name/type/dimensions sahibidir. Tekil Item; `catalogKey = itemKey = glass_table`. Type `table-glass`; çap `tableDiameterCm=75`; footprint 75×75×74 cm. ModelFile yok; renderer procedural cam masa. Unit / BOM uydurulmadı (`decision-required`).

## Factory, state ve persistence
`createGlassTableModuleState` Item’dan default üretir; `itemKey`/`catalogKey` damgalar; surface yok (`free-model-fixed`). Load’da `normalizeModuleItemState` hydrate eder; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > table-glass`: free, snap 10, rotation step 90°, default rotation 0°, `collision: none`, `magneticSnap: none`, boundary `stand-edge`. Tabla/sap/taban ayrı Item değildir.

## Regression
`test/furnitureItemsContract.test.js`; `test/glassTableContract.test.js`; E2E `e2e/furniture-items-contract.spec.mjs`.
