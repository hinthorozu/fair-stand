# furniture_sofa_double_classic — Canonical Item

Migration öncesi tam envanter: [current-system/furniture_sofa_double_classic](../current-system/furniture_sofa_double_classic.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > FURNITURE_ITEMS.furniture_sofa_double_classic` canonical itemKey/name/type/dimensions sahibidir. Tekil Item; `itemKey = furniture_sofa_double_classic`. Type `sofa-double-classic`; footprint 150×45×78 cm. Ölçüler koltuk takımı renderer’ındaki ikili koltuk genişliği ve derinlik sabitinden taşındı. `visualRotationYDeg=-45` (GLB sırt −Z, oturma sahne önü +Z; `rotationZDeg 0=ön`). Katalogda modelFile yok; renderer mevcut `bej_koltuk_1_ciftli_2_tekli.glb` içinden ikili mesh yükler. Unit / BOM uydurulmadı (`decision-required`).

## Factory, state ve persistence
`createSofaDoubleClassicModuleState` Item’dan default üretir; `itemKey` damgalar; editable `surface` korunur (`free-model-color`). Load’da `normalizeModuleItemState` hydrate eder; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > sofa-double-classic`: free, snap 10, rotation step 90°, default rotation 0°, `collision: none`, `magneticSnap: none`, boundary `stand-edge`. GLB/material hedefi business SoT değildir. `visualRotationYDeg` Item sahibidir; renderer state/Item’dan tüketir. `furniture_sofa_set_classic` bu Item’ın parent kümesidir (`1 × furniture_sofa_double_classic` + `2 × furniture_sofa_single_classic` + `1 × furniture_coffee_table_classic`).

## Regression
`test/furnitureItemsContract.test.js`; `test/sofaClassicPiecesContract.test.js`; E2E `e2e/furniture-items-contract.spec.mjs`.
