# A01 / F-003 Düzeltme Kapanışı

Bulgu: `F-003 — roadmaps duplicate canonical production dimensions/recipe facts`
Önem: P2
Dal: `remediation/a01-f003-roadmap-source-truth`
PR: `#38`
Başlangıç ROG: `d19118d38a8330546fdba4037ebf2bcc56b0b7bf`

## Düzeltme

- `ROADMAP.md` içinden yinelenen fiziksel üretim ölçüleri ve sabit reçete miktarları kaldırıldı.
- Planlama/durum/kabul niyeti korunarak `ROADMAP_PHASE_4.md` içinden yinelenen üretim veri seti kaldırıldı.
- Her iki yol haritası artık fiziksel üretim üst verisini `src/productionParts.js`'e, reçete miktarları/parça referanslarını `src/moduleRecipes.js`'e ve BOM politikasını `src/moduleContracts.js`'e açıkça yönlendirir.
- Yol haritalarındaki bilinen yinelenen üretim-veri-seti işaretlerini reddetmek ve kanonik sahip referanslarını zorunlu kılmak için `test/roadmapProductionSourceOfTruth.test.js` eklendi.

## Doğrulama

Uygulama head: `8775359518c99410b49e03c9d47ef9ee4a6e6b14`
PR CI: `#97 / 33799825728`

- change contract gate: passed
- npm ci: passed
- npm test: passed (yol haritası tek-kaynak regresyonunu içerir)
- npm run build: passed

## Sonuç

`F-003: CLOSED`

F-004'e geçmeden önce birleştirme sonrası ROG CI gereklidir.
