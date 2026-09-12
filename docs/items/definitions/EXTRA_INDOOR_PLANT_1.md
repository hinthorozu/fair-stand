# EXTRA_INDOOR_PLANT_1 — Canonical Item

Migration öncesi tam envanter: [current-system/EXTRA_INDOOR_PLANT_1](../current-system/EXTRA_INDOOR_PLANT_1.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > INDOOR_PLANT_ITEMS.EXTRA_INDOOR_PLANT_1` canonical itemKey/name/type/dimensions sahibidir. Tekil Item; `itemKey = EXTRA_INDOOR_PLANT_1`. Type ailesi `indoor-plant-1`; ölçü 60×60×120 cm. Katalogda modelFile yoktu; runtime default `indoor_plants.glb` factory tarafında uygulanır. Parent unit / BOM uydurulmadı (`decision-required`).

## Factory, state ve persistence
`createIndoorPlantModuleState` Item'dan default üretir; `itemKey` damgalar; editable surface yoktur (`free-model-fixed`). Load hydrate; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > indoor-plant-1`: free, snap 10, footprint, thin-wall-endpoint. GLB fit business SoT değildir.

## Regression
`test/indoorPlantItemsContract.test.js`; E2E `e2e/indoor-plant-items-contract.spec.mjs`.
