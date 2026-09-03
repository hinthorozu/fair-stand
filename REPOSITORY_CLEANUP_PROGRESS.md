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

1. `.github/workflows` ve `.github/scripts` içindeki eski tek-seferlik patch/fix/inspect workflow ve scriptlerini incele.
2. Gerçekten gerekli olan kalıcı workflow'ları ayır.
3. Artık görevi olmayan workflow/scriptler için silinecekler listesini çıkar.
4. Kullanıcıya listeyi göster; onay sonrası temizliği uygula.
5. Tek canonical CI workflow bırak.
6. CI dependency kurulumunu `npm install` yerine `npm ci` kullanacak şekilde düzelt.
7. CI içinde en az `npm test` + `npm run build` zorunlu olsun.
8. `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md`, `MODULE_BEHAVIOR_STANDARD.md` çelişkilerini temizle.

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

## Şu Anki Checkpoint

Henüz cleanup/refactor uygulanmadı.

Şu ana kadar yalnız:

1. Repository fresh incelemesi tamamlandı.
2. `FRESH_REPOSITORY_REVIEW.md` oluşturuldu.
3. Temizlik için öncelik sırası belirlendi.
4. İlk uygulanacak iş olarak **GitHub Actions workflow/script envanteri ve temizlik listesi** seçildi.

## Sıradaki İş

**`.github/workflows` ve `.github/scripts` envanterini çıkar.**

Her dosya için şu sınıflandırmayı yap:

- `KORU` — kalıcı CI/deploy görevi var.
- `SİL` — tek-seferlik geçmiş patch/fix/inspect işi; artık gerekli değil.
- `İNCELE` — görevi belirsiz veya başka workflow ile çakışıyor.

Önce raporla; çalışan uygulama koduna dokunma ve liste onaylanmadan toplu silme yapma.
