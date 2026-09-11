# wall_200 — Canonical Item

Migration öncesi tam envanter: [current-system/wall_200](../current-system/wall_200.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_200` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `catalogKey = itemKey = wall_200`. Type ailesi `flat-panel`; genişlik 200 cm. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=wall`, `nominalWidthCm=200`. Miktar SoT: `src/moduleRecipes.js` straight-wall `200` (`wall-straight-200`). Mevcut recipe miktarları değişmez. Raw BOM UI dokunulmadı.

## Factory, state ve persistence
`createFlatPanelModuleState` Item’dan default üretir; 7 strip. Load hydrate; alias yok.

## Behavior ve renderer sınırı
`WALL_BEHAVIOR`: wall placement, 50 cm snap, 90° rotation. Procedural renderer business SoT değildir.

## Regression
`test/wallFlatPanelItemsContract.test.js`; E2E `e2e/wall-flat-panel-items-contract.spec.mjs`.
