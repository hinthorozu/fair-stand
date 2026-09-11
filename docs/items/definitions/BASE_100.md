# BASE_100 — Canonical Item

Migration öncesi tam envanter: [current-system/BASE_100](../current-system/BASE_100.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMPOSITE_ITEMS.BASE_100` canonical itemKey/name/type/dimensions sahibidir. Bileşik Item; `catalogKey = itemKey = BASE_100`. Tek type ailesi `base`; genişlik varyantı 100 cm. Doğrulanmış ölçüler: `widthCm=100`, `depthCm=50`, `heightCm=50`. Parent üzerinde unit uydurulmadı; child unit’ler production Item’lardadır.

## Composition / BOM
`composition.mode=recipe`, `moduleType=base`, `nominalWidthCm=100`. Miktar SoT: `src/moduleRecipes.js` → `base:100`. Child satırları Item kartında kopyalanmaz. `wall_base_100` ayrı type/recipe (`base-wall:100`); aynı `base_top_107_50` satırını paylaşır — bu migration reçete/quantity değiştirmez.

## Factory, state ve persistence
`src/designState.js > createBaseModuleState` `getItem(catalogKey|itemKey|BASE_${width})` ile canonical Item’dan default üretir; `itemKey`/`catalogKey` damgalar; `faces.front|left|right` editable parity korunur. `getCommercialItemForType('base')` kullanılmaz. Load’da `normalizeModuleItemState` `catalogKey → itemKey` hydrate eder; alias yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > base`: free, 50 cm snap, footprint, `logical-fixture`. Davranış type bazlıdır; itemKey override yok. `createBaseModule()` procedural renderer; top thickness/overhang görsel temsildir, business SoT değildir.

## Regression
`test/baseItemsContract.test.js`, `test/baseModule.test.js`, `test/baseRecipes.test.js`, `test/baseTopsItemContract.test.js`; E2E `e2e/base-items-contract.spec.mjs`.
