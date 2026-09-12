# A01 / F-001 Düzeltme Kapanışı

Bulgu: `F-001 — stale SYSTEM_MODULE_CATALOG.md`
Önem: P1
Dal: `remediation/a01-f001-catalog-doc`
PR: `#36`
Başlangıç ROG: `5b03cc8f7d3ad6f18381803ae76506e1300ae38f`

## Düzeltme

- Eski 28-modül referansı, güncel 45-key katalog anlık görüntüsüyle değiştirildi.
- Belgeden yinelenen modül başına üretim miktarları/ölçüleri kaldırıldı; kanonik reçete/parça verisi kod sahiplerinde kalır.
- Güncel sözleşme-türevli BOM politika özeti belgelendi: 29 reçete destekli katalog girişi, 16 karar gerektiren katalog girişi ve katalog dışı `illuminated-foam` karar gerektiren olarak.
- Katalog key/sıra ve özet-sayı sapmasının test paketini düşürmesi için `test/systemModuleCatalogDoc.test.js` eklendi.

## Doğrulama

PR head uygulama commit'i: `6ffe18264b10f4c8eaae1a9f4ac4925ce329a55f`
PR CI çalıştırması: `#89 / 33798955367`

- Change contract gate: passed
- npm ci: passed
- npm test: passed (yeni hedefli katalog-belge regresyonunu içerir)
- npm run build: passed

## Sonuç

`F-001: CLOSED`

F-002'ye geçmeden önce birleştirme sonrası ROG CI hâlâ gereklidir.
