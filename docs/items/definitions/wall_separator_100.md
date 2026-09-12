# wall_separator_100 — Canonical Item

Migration öncesi tam envanter: [current-system/wall_separator_100](../current-system/wall_separator_100.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.wall_separator_100` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `itemKey = wall_separator_100`. Type ailesi `separator`; genişlik 100 cm; `modelFile` yok. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=separator`, `nominalWidthCm=100`. Miktar SoT: `src/moduleRecipes.js` `separator:100`. Child satırları Item kartında kopyalanmaz; mevcut recipe miktarları değişmez. Raw BOM UI dokunulmadı.

## Factory, state ve persistence
`createSeparatorModuleState` Item’dan default üretir; `itemKey` damgalar; tek `surface.color` (image yok). Default renk child `separator_panel_98` üzerinden. Load’da hydrate; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > separator`: `WALL_BEHAVIOR`. Procedural renderer / GLB business SoT değildir.

## Regression
`test/wallSeparatorItemsContract.test.js`; E2E `e2e/wall-separator-items-contract.spec.mjs`.
