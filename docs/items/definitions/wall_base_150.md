# wall_base_150 — Kanonik Item

Migration öncesi tam envanter: [current-system/wall_base_150](../current-system/wall_base_150.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_base_150` kanonik itemKey/name/type/dimensions sahibidir. Bileşik Item; `itemKey = wall_base_150`. Type ailesi `base-wall`; ölçü `150 × 50 × 350 cm` (katalog/envanter). Üst öğe üzerinde unit uydurulmadı.

## Bileşim / BOM
`composition.mode=recipe`, `moduleType=base-wall`, `nominalWidthCm=150`. Miktar tek kaynak: `src/moduleRecipes.js` `base-wall:150` (`base-wall-150`). Alt satırları Item kartında kopyalanmaz; mevcut recipe miktarları bu migration’da değişmez. Raw BOM UI dokunulmadı.

## Oluşturma, state ve kalıcılık
`createBaseWallModuleState` Item’dan default üretir; `itemKey` damgalar; 7 strip + `faces.front/left/right` aynı yapı korunur. Yüklemede `normalizeModuleItemState` `itemKey` doldurur; takma ad yok.

## Davranış ve renderer sınırı
`moduleBehavior.js > base-wall`: `WALL_BEHAVIOR` + `collisionDepth: wall-backbone`. Duvar yerleşimi, 50 cm snap, 90° rotation. Prosedürel `createBaseWallModule` iş tek kaynağı değildir.

## Regresyon
`test/wallBaseItemsContract.test.js`; E2E `e2e/wall-base-items-contract.spec.mjs`.
