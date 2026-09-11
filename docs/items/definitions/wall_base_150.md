# wall_base_150 — Canonical Item

Migration öncesi tam envanter: [current-system/wall_base_150](../current-system/wall_base_150.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_base_150` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `catalogKey = itemKey = wall_base_150`. Type ailesi `base-wall`; ölçü `150 × 50 × 350 cm` (katalog/envanter). Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=base-wall`, `nominalWidthCm=150`. Miktar SoT: `src/moduleRecipes.js` `base-wall:150` (`base-wall-150`). Child satırları Item kartında kopyalanmaz; mevcut recipe miktarları bu migration’da değişmez. Raw BOM UI dokunulmadı.

## Factory, state ve persistence
`createBaseWallModuleState` Item’dan default üretir; `itemKey`/`catalogKey` damgalar; 7 strip + `faces.front/left/right` parity korunur. Load’da `normalizeModuleItemState` `catalogKey → itemKey` hydrate eder; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > base-wall`: `WALL_BEHAVIOR` + `collisionDepth: wall-backbone`. Wall placement, 50 cm snap, 90° rotation. Procedural `createBaseWallModule` business SoT değildir.

## Regression
`test/wallBaseItemsContract.test.js`; E2E `e2e/wall-base-items-contract.spec.mjs`.
