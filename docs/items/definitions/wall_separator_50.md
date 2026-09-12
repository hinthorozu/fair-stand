# wall_separator_50 — Canonical Item

Migration öncesi tam envanter: [current-system/wall_separator_50](../current-system/wall_separator_50.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_separator_50` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `itemKey = wall_separator_50`. Type ailesi `separator`; genişlik 50 cm; `modelFile` yok. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=separator`, `nominalWidthCm=50`. Miktar SoT: `src/moduleRecipes.js` `separator:50`. Child satırları Item kartında kopyalanmaz; mevcut recipe miktarları değişmez. Raw BOM UI dokunulmadı.

## Factory, state ve persistence
`createSeparatorModuleState` Item’dan default üretir; `itemKey` damgalar; tek `surface.color` (image yok). Default renk child `separator_panel_48_5` üzerinden. Load’da hydrate; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > separator`: `WALL_BEHAVIOR`. Procedural renderer / GLB business SoT değildir.

## Regression
`test/wallSeparatorItemsContract.test.js`; E2E `e2e/wall-separator-items-contract.spec.mjs`.
