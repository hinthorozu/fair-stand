# A13 F-032 kapanışı

Bulgu: **F-032 — IndexedDB şema/migration sahipliği store’lar arasında kopyalı**

Durum: **CLOSED**

## Düzeltme

- `src/configuratorDb.js` tek `openConfiguratorDb` / `onupgradeneeded` sahibidir.
- DB adı `fair-stand-configurator`, sürüm **2**, depolar `projects` + `image-assets`, dizin `projectId` — değişmedi.
- `projectStore.js` ve `assetStore.js` bu açıcıyı tüketir; ikinci şema kopyası yok.
- BOM/miktar yok.

## Regresyon

- `test/f032ConfiguratorDb.test.js`
- `test/projectAtomicDeletion.test.js`
- `e2e/f023-atomic-project-delete.spec.mjs`
- `e2e/f020-save-before-project-actions.spec.mjs`
