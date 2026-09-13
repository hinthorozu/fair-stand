# A11 F-029 kapanışı

Bulgu: **F-029 — Aktif otomatik-duvar bileşiminin açık özellik sözleşmesi yok**

Durum: **CLOSED**

## Düzeltme

- `FEATURE_CONTRACTS.automaticWall` (`id: automatic-wall`) `src/automaticWall.js` sahibidir.
- Tetik: ada olmayan sahne kurulum (`main.js` `standType !== 'island'`).
- Girdiler: `lengthCm`, `standType`, `standXCm`, `standYCm` — `composeAutomaticStandWall` imzası.
- Çıktı: `flat-panel` modülleri; yerleştirme `planContinuousWallLayout` (`wallReflow.js`).
- Depo sözleşmesi `contentCatalogKeys`: `MINI_FRIDGE_AVANTI`, `KETTLE`, `COAT_RACK`, `PLASTIC_TRASH_BIN` — `contentKinds` ile `getCommercialItemForType` eşleşmesi. BOM miktarı yok.

## Regresyon

- `test/systemDevelopmentContract.test.js`
- `test/automaticWall.test.js`
- `e2e/f010-module-construction.spec.mjs`
- `e2e/commercial-items-contract.spec.mjs`
