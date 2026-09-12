# illuminated-foam — Canonical Item

Migration öncesi tam envanter: [current-system/illuminated-foam](../current-system/illuminated-foam.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > NON_CATALOG_ITEMS['illuminated-foam']` canonical itemKey/name/type/dimensions sahibidir. Tekil Item. `itemKey = type = illuminated-foam`. Katalog kartı yoktur (`MODULE_CATALOG` dışı; `NON_CATALOG_MODULE_CONTRACTS`). Factory default ölçü: width `200`, height `50`, depth `3.5`, `wallGapCm=1.5`. Dialog limitleri mevcut UI’dadır (`10..5000` / `5..350`). Unit / BOM uydurulmadı (`decision-required`).

## Factory, state ve persistence
Oluşturma yolu SVG asset sağ tık `Işıklı Strafora Dönüştür`. `createIlluminatedFoamModuleState` Item defaultlarını ve `itemKey` damgasını yazar. `imageAssetId` zorunludur. `haloColor` default `#ffffff`. Load hydrate `itemKey` doldurur. `Tüm Özellikleri Kaldır` bu type’ı sahneden çıkarır.

## Behavior ve renderer sınırı
`overlayBehavior()`: `wall-overlay`, snap `10 cm`, rotation `90°`. SVG extrude + halo renderer temsilidir.

## Regression
`test/lightingItemsContract.test.js`; `test/illuminatedFoamModule.test.js`; `test/moduleStateConstructionRegistry.test.js`; E2E `e2e/lighting-items-contract.spec.mjs` (katalogda olmadığını doğrular) ve mevcut `e2e/f028-reset-features.spec.mjs`.
