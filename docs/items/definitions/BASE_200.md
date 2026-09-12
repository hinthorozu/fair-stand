# BASE_200 — Canonical Item

Migration öncesi tam envanter: [current-system/BASE_200](../current-system/BASE_200.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.BASE_200` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `itemKey = BASE_200`. Tek type ailesi `base`; genişlik varyantı 200 cm. Doğrulanmış ölçüler: `widthCm=200`, `depthCm=50`, `heightCm=50`. Parent üzerinde unit uydurulmadı.

## Composition / BOM
`composition.mode=recipe`, `moduleType=base`, `nominalWidthCm=200`. Miktar SoT: `src/moduleRecipes.js` → `base:200`. `wall_base_200` ayrı type/recipe (`base-wall:200`); aynı `base_top_206_50` satırını paylaşır — reçete/quantity bu migration’da değişmez.

## Factory, state ve persistence
`createBaseModuleState` Item’dan default üretir; `itemKey` damgalar; üç editable face parity korunur. Load hydrate: `itemKey`. Alias yok. `getCommercialItemForType('base')` yok.

## Behavior ve renderer sınırı
Type `base` ortak behavior (free, 50 cm snap, footprint, logical-fixture). Procedural renderer kalınlık/overhang business SoT değildir.

## Regression
`test/baseItemsContract.test.js`, mevcut base recipe/module/tops testleri; E2E `e2e/base-items-contract.spec.mjs`.
