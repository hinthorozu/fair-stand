# A07 F-017 kapanışı

Bulgu: **F-017 — Renderer kalıcı düzenlenebilir state’i doğrudan değiştiriyor**

Durum: **CLOSED**

## Düzeltme

- Mesh `userData.surfaceState` artık kalıcı yüzey nesnesinin `structuredClone` kopyasıdır.
- Kalıcı nesne `userData.persistentSurfaceState` olarak bağlanır; kayıt ağacı (`designState` / `currentModules`) bu nesnedir.
- Renk, cam, kumaş ve görsel yazıları `writePersistentSurface` üzerinden kalıcıya gider; kopya `syncRendererSurfaceState` ile güncellenir.
- Duvar rebuild doku anahtarı nesne kimliği değil `surfaceId` kullanır (kopya her rebuild’de değişir).
- Yeni alan, BOM miktarı veya katalog öğesi eklenmedi.

## Regresyon kanıtı

- `test/surfaceStateBinding.test.js`
- `test/f017RendererSurfacePersist.test.js`
- `test/showcaseBodyColorRegression.test.js`
- `e2e/smoke.spec.mjs`
- `e2e/f020-save-before-project-actions.spec.mjs`
