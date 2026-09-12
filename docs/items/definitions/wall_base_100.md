# wall_base_100 — Canonical Item

Migration öncesi tam envanter: [current-system/wall_base_100](../current-system/wall_base_100.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_base_100` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `itemKey = wall_base_100`. Type ailesi `base-wall`; ölçü `100 × 50 × 350 cm` (katalog/envanter). Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=base-wall`, `nominalWidthCm=100`. Miktar SoT: `src/moduleRecipes.js` `base-wall:100` (`base-wall-100`). Child satırları Item kartında kopyalanmaz; mevcut recipe miktarları bu migration’da değişmez. Raw BOM UI dokunulmadı.

## Factory, state ve persistence
`createBaseWallModuleState` Item’dan default üretir; `itemKey` damgalar; 7 strip + `faces.front/left/right` parity korunur. Load’da `normalizeModuleItemState` `itemKey` hydrate eder; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > base-wall`: `WALL_BEHAVIOR` + `collisionDepth: wall-backbone`. Wall placement, 50 cm snap, 90° rotation. Procedural `createBaseWallModule` business SoT değildir.

## Regression
`test/wallBaseItemsContract.test.js`; E2E `e2e/wall-base-items-contract.spec.mjs`.
