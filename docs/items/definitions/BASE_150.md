# BASE_150 — Canonical Item

Migration öncesi tam envanter: [current-system/BASE_150](../current-system/BASE_150.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.BASE_150` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `catalogKey = itemKey = BASE_150`. Tek type ailesi `base`; genişlik varyantı 150 cm. Doğrulanmış ölçüler: `widthCm=150`, `depthCm=50`, `heightCm=50`. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=base`, `nominalWidthCm=150`. Miktar SoT: `src/moduleRecipes.js` → `base:150`. `wall_base_150` ayrı type/recipe (`base-wall:150`); aynı `base_top_157_50` satırını paylaşır — reçete/quantity bu migration’da değişmez.

## Factory, state ve persistence
`createBaseModuleState` Item’dan default üretir; `itemKey`/`catalogKey` damgalar; üç editable face parity korunur. Load hydrate: `catalogKey → itemKey`. Alias yok. `getCommercialItemForType('base')` yok.

## Behavior ve renderer sınırı
Type `base` ortak behavior (free, 50 cm snap, footprint, logical-fixture). Procedural renderer kalınlık/overhang business SoT değildir.

## Regression
`test/baseItemsContract.test.js`, mevcut base recipe/module/tops testleri; E2E `e2e/base-items-contract.spec.mjs`.
