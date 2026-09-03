# Fair Stand — Repository Cleanup Progress

Bu dosya, fresh repository incelemesi sonrasında nerede kalındığını ve sıradaki işleri takip etmek için tutulur.

Ayrıntılı ilk teknik rapor:

- `FRESH_REPOSITORY_REVIEW.md`

## Öncelik sırası

### P0

1. GitHub Actions/workflow temizliği.
2. Tek canonical CI ve deterministik `npm ci` akışı.
3. `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md`, `MODULE_BEHAVIOR_STANDARD.md` contract drift temizliği.

### P1

1. README'yi mevcut ürün seviyesine göre yeniden yaz.
2. ROADMAP'i gerçek implementasyon durumuyla eşleştir.
3. Catalog → module behavior coverage testi ekle.
4. `main.js` içine yeni sorumluluk eklememeye başla; yeni controller'ları ayrı dosyalara çıkar.

### P2 / P3

- `scene3d.js` renderer sorumluluklarını kademeli böl.
- `SYSTEM_MODULE_CATALOG.md` dokümanını koddan generate etmeyi değerlendir.
- ESLint / Prettier / JSDoc contract desteği ekle.
- `src/` ve `test/` yapısını domain bazlı düzenle.

---

## P0 — GitHub Actions temizliği

Durum: **TAMAMLANDI**

Yapılanlar:

- Eski tek-seferlik `add-*`, `fix-*`, `inspect-*`, `rename-*` ve video-wall patch workflow'ları kaldırıldı.
- `.github/scripts` altındaki geçmiş patch scriptleri kaldırıldı.
- Eski `build.yml` kaldırıldı.
- Tek kalıcı workflow olarak `.github/workflows/ci.yml` bırakıldı.
- Canonical CI Node 22 + `npm ci` + `npm test` + `npm run build` kullanıyor.
- Temizlik doğrulamasında 349 test geçti ve production build başarılı oldu.
- Uygulama kaynak koduna dokunulmadı.

Merge: PR #3

---

## P0 — Documentation / contract cleanup

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #4

Yapılanlar:

- `PROJECT_RULES.md` yalnız gerçek global product invariant'larına indirildi.
- Module-specific 90° / 50 cm varsayımları global kurallardan çıkarıldı.
- `ARCHITECTURE_RULES.md` source-of-truth ve sistem katmanı sınırlarına odaklandı.
- `MODULE_BEHAVIOR_STANDARD.md` gerçek runtime behavior contract ile hizalandı.
- `wall-overlay` ve gerçek silhouette ghost contract dokümante edildi.
- Canonical CI başarılı geçti.

---

## P1 — Catalog → module behavior contract coverage

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Branch:

- `test/catalog-module-behavior-contract`

PR:

- #5 — `Enforce catalog module behavior contracts`

Yapılanlar:

- `src/moduleBehavior.js` içinde katalogda kullanılan standart wall module type'ları da explicit registry entry haline getirildi.
- Ortak wall davranışı `WALL_BEHAVIOR` üzerinden paylaşılır; runtime davranışı değiştirilmeden implicit fallback bağımlılığı kaldırıldı.
- `hasExplicitModuleBehavior()` helper'ı eklendi.
- `test/moduleBehaviorContract.test.js` eklendi.
- Test, `MODULE_CATALOG_KEYS` üzerinden tüm benzersiz katalog type'larını çıkarıp her birinin explicit behavior contract'a sahip olduğunu doğrular.
- Yeni bir catalog type davranış kaydı olmadan eklenirse CI artık kırılır.
- Unknown/non-catalog type fallback davranışının hâlâ korunduğu ayrıca test edilir.
- `MODULE_BEHAVIOR_STANDARD.md` bu yeni explicit catalog contract ile güncellendi.
- Canonical CI'da `npm ci`, `npm test` ve `npm run build` başarılı geçti.

## Sıradaki İş

Sonraki P1: **README ve ROADMAP güncelliğini gerçek repository durumu ile karşılaştır ve düzelt.**

Önce mevcut README/ROADMAP içeriğini gerçek catalog, scripts ve mevcut feature set ile karşılaştır; sonra yalnız doğrulanmış güncel bilgileri dokümante et.
