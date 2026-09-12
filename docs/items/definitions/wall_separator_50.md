# wall_separator_50 — Kanonik Item

Migration öncesi tam envanter: [current-system/wall_separator_50](../current-system/wall_separator_50.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_separator_50` kanonik itemKey/name/type/dimensions sahibidir. Bileşik Item; `itemKey = wall_separator_50`. Type ailesi `separator`; genişlik 50 cm; `modelFile` yok. Üst öğe üzerinde unit uydurulmadı.

## Bileşim / BOM
`composition.mode=recipe`, `moduleType=separator`, `nominalWidthCm=50`. Miktar tek kaynak: `src/moduleRecipes.js` `separator:50`. Alt satırları Item kartında kopyalanmaz; mevcut recipe miktarları değişmez. Raw BOM UI dokunulmadı.

## Oluşturma, state ve kalıcılık
`createSeparatorModuleState` Item’dan default üretir; `itemKey` damgalar; tek `surface.color` (image yok). Default renk child `separator_panel_48_5` üzerinden. Yüklemede hydrate; takma ad yok.

## Davranış ve renderer sınırı
`moduleBehavior.js > separator`: `WALL_BEHAVIOR`. Prosedürel renderer / GLB iş tek kaynağı değildir.

## Regresyon
`test/wallSeparatorItemsContract.test.js`; E2E `e2e/wall-separator-items-contract.spec.mjs`.
