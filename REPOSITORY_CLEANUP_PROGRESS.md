# Fair Stand — Repository Cleanup Progress

Bu dosya, fresh repository incelemesi sonrasında nerede kalındığını ve sıradaki işleri takip etmek için oluşturulmuştur.

## Başlangıç Durumu

Repository baştan sona fresh gözle incelendi. Ayrıntılı teknik rapor şu dosyada tutuluyor:

- `FRESH_REPOSITORY_REVIEW.md`

İnceleme sonucunda ana problem alanları:

- eski tek-seferlik GitHub Actions workflow/scriptlerinin repository içinde kalması,
- `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md` ve `MODULE_BEHAVIOR_STANDARD.md` arasında contract drift,
- CI workflow'unun sadeleştirilmesi ihtiyacı,
- README / ROADMAP / CHANGELOG dokümantasyonunun güncel runtime seviyesinin gerisinde kalması,
- `main.js` ve `scene3d.js` dosyalarının giderek fazla sorumluluk taşıması,
- yeni module type'lar için behavior registry contract'ının daha sıkı hale getirilmesi ihtiyacı.

## Kararlaştırılan Öncelik Sırası

### P0 — Önce yapılacaklar

1. `.github/workflows` ve `.github/scripts` içindeki eski tek-seferlik patch/fix/inspect workflow ve scriptlerini temizle.
2. Tek canonical CI workflow bırak.
3. CI dependency kurulumunda `npm ci` kullan.
4. CI içinde `npm test` + `npm run build` zorunlu olsun.
5. `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md`, `MODULE_BEHAVIOR_STANDARD.md` çelişkilerini temizle.

### P1 — P0 sonrasında

1. README'yi mevcut ürün seviyesine göre yeniden yaz.
2. ROADMAP'i gerçek implementasyon durumuyla eşleştir.
3. Catalog → module behavior coverage testi ekle.
4. `main.js` içine yeni sorumluluk eklememeye başla; yeni controller'ları ayrı dosyalara çıkar.

### P2 / P3 — Daha sonra

- `scene3d.js` renderer sorumluluklarını kademeli böl.
- `SYSTEM_MODULE_CATALOG.md` dokümanını koddan generate etmeyi değerlendir.
- ESLint / Prettier / JSDoc contract desteği ekle.
- `src/` ve `test/` yapısını domain bazlı düzenle.

## PROJECT_RULES Kararı

`PROJECT_RULES.md` doğrudan silinmeyecek.

Hedef:

- yalnız gerçekten global product invariant'ları bırakmak,
- module-specific rotation / snap / collision gibi runtime davranışlarını `moduleBehavior.js` + testlere devretmek,
- aynı davranışı birden fazla Markdown dosyasında tekrar tarif etmemek.

## P0 — GitHub Actions temizliği

Durum: **TAMAMLANDI**

Yapılanlar:

- Eski tek-seferlik `add-*`, `fix-*`, `inspect-*`, `rename-*` ve video-wall patch workflow'ları kaldırıldı.
- `.github/scripts` altındaki geçmiş patch scriptleri kaldırıldı.
- Eski `build.yml` kaldırıldı.
- Tek kalıcı workflow olarak `.github/workflows/ci.yml` bırakıldı.
- Canonical CI Node 22 kullanıyor.
- Dependency kurulumu `npm ci` ile deterministik hale getirildi.
- `npm test` ve `npm run build` zorunlu CI adımlarıdır.
- Temizlik doğrulamasında 349 test geçti ve production build başarılı oldu.
- Uygulama kaynak koduna bu adımda dokunulmadı.

Not: İlk otomatik cleanup denemesinde GitHub App workflow dosyası yazma yetkisi olmadığı için push reddedildi. Temizlik bunun yerine ayrı `cleanup/github-actions` branch'inde GitHub API üzerinden hazırlanıp PR/CI ile birleştirilecek şekilde düzeltildi.

## Sıradaki İş

**P0 contract cleanup:**

`PROJECT_RULES.md`, `ARCHITECTURE_RULES.md` ve `MODULE_BEHAVIOR_STANDARD.md` arasındaki çelişkileri gerçek runtime davranışıyla karşılaştır ve canonical source sınırlarını netleştir.
