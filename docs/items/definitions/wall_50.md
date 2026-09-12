# wall_50 — Canonical Item

Migration öncesi tam envanter: [current-system/wall_50](../current-system/wall_50.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_50` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `itemKey = wall_50`. Type ailesi `flat-panel`; genişlik 50 cm. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=wall`, `nominalWidthCm=50`. Miktar SoT: `src/moduleRecipes.js` straight-wall `50` (`wall-straight-50`). Child satırları Item kartında kopyalanmaz; mevcut recipe miktarları bu migration’da değişmez. Raw BOM UI dokunulmadı.

## Factory, state ve persistence
`createFlatPanelModuleState` `getItem(itemKey|width)` ile Item’dan default üretir; `itemKey` damgalar; 7 strip parity korunur. Load’da `normalizeModuleItemState` `itemKey` hydrate eder; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > flat-panel`: `WALL_BEHAVIOR` — wall placement, 50 cm snap, 90° rotation. Davranış type bazlıdır. Procedural `createFlatPanelModule` business SoT değildir.

## Regression
`test/wallFlatPanelItemsContract.test.js`; E2E `e2e/wall-flat-panel-items-contract.spec.mjs`.
