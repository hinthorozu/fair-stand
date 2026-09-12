# A13 F-033 kapanışı

Bulgu: **F-033 — ~30.64 MiB parked/unreferenced assets under `public/` ship with production**

Durum: **CLOSED / POST-MERGE VERIFIED**

## Kök neden

Üç büyük dosya, aktif runtime girdileri olmasa bile `public/` altında duruyordu. Vite `public/` ağacını üretim çıktısına kopyaladığı için bu bekletilen varlıklar her üretim derlemesiyle birlikte gönderiliyordu:

- `public/models/indoor_plants2.glb` — 22,018,072 bytes,
- `public/models/bar_chair2.glb` — 2,451,300 bytes,
- `public/textures/exhibition-floor.jpg` — 7,662,003 bytes.

Birleşik yük: 32,131,375 bytes, yaklaşık **30.64 MiB**. Aktif `public/textures/exhibition-floor-optimized.jpg` varlığı bulgunun parçası değildi ve yerinde kaldı.

## Düzeltme

Uygulama PR **#76 — chore: remove unused F-033 production assets** bekletilen üç üretim varlığının tümünü kaldırdı.

Düzeltme ayrıca mevcut regresyon beklentilerini güncelledi; depo artık şunları doğrular:

- `indoor_plants2.glb` yoktur,
- `bar_chair2.glb` yoktur,
- `exhibition-floor.jpg` yoktur,
- aktif optimize zemin dokusu yerinde kalır,
- Yapay Çiçek 1 tek aktif yapay-bitki runtime yolu olarak kalır.

Hiçbir katalog, yerleşim, kalıcı durum, renderer seçimi veya içe/dışa aktarma davranışı kasıtlı olarak değiştirilmedi.

## Doğrulama

Son PR head: `6afc3eade2feb74aea2e75857acc800f21287962`.

PR CI çalıştırması **#323 / run `33998906089`** başarıyla tamamlandı:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

PR #76, `e44f326a95f9790b801bcfe08d9e2ec943fa57be` olarak `ROG`'a birleştirildi.

Birleştirme sonrası `ROG` CI çalıştırması **#324 / run `33998982007`** başarıyla tamamlandı:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

## Sonuç

Denetlenen üç bekletilen varlık artık üretim `public/` ağacında yoktur; aktif optimize zemin dokusu ve aktif iç-bitki runtime yolu korunurken yaklaşık **30.64 MiB** kullanılmayan dağıtım yükü kaldırıldı.

**F-033 is CLOSED.**
