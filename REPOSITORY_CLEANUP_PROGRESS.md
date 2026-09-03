# Fair Stand — Repository Cleanup Progress

Bu dosya, fresh repository incelemesi sonrasında nerede kalındığını ve sıradaki işleri takip etmek için tutulur.

Ayrıntılı ilk teknik rapor: `FRESH_REPOSITORY_REVIEW.md`

## Öncelik sırası

### P0

1. GitHub Actions/workflow temizliği.
2. Tek canonical CI ve deterministik `npm ci` akışı.
3. `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md`, `MODULE_BEHAVIOR_STANDARD.md` contract drift temizliği.

### P1

1. README'yi mevcut ürün seviyesine göre yeniden yaz.
2. Dokümantasyonu kayıpsız sınıflandır; eski/uyumsuz bilgiyi sessizce silme.
3. ROADMAP'i gerçek implementasyon durumuyla eşleştir.
4. Catalog → module behavior coverage testi ekle.
5. `main.js` içine yeni sorumluluk eklememeye başla; yeni controller'ları ayrı dosyalara çıkar.

### P2 / P3

- `scene3d.js` renderer sorumluluklarını kademeli böl.
- `SYSTEM_MODULE_CATALOG.md` dokümanını koddan generate etmeyi değerlendir.
- ESLint / Prettier / JSDoc contract desteği ekle.
- `src/` ve `test/` yapısını domain bazlı düzenle.

---

## P0 — GitHub Actions temizliği

Durum: **TAMAMLANDI**

- Eski tek-seferlik workflow/scriptler kaldırıldı.
- Tek canonical `.github/workflows/ci.yml` bırakıldı.
- CI Node 22 + `npm ci` + `npm test` + `npm run build` kullanıyor.

Merge: PR #3

---

## P0 — Documentation / contract cleanup

Durum: **TAMAMLANDI / CI DOĞRULANDI**

- `PROJECT_RULES.md` global invariant'lara indirildi.
- `ARCHITECTURE_RULES.md` source-of-truth ve sistem katmanı sınırlarına odaklandı.
- `MODULE_BEHAVIOR_STANDARD.md` runtime behavior contract ile hizalandı.

Merge: PR #4

---

## P1 — Catalog → module behavior contract coverage

Durum: **TAMAMLANDI / CI DOĞRULANDI**

- Katalogdaki her module type explicit behavior contract'a bağlandı.
- `hasExplicitModuleBehavior()` eklendi.
- `test/moduleBehaviorContract.test.js` eklendi.
- Yeni catalog type behavior kaydı olmadan eklenirse CI kırılır.

Merge: PR #5

---

## P1 — README güncellemesi

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #6

- README mevcut ürün ve repository yapısını anlatacak şekilde yeniden yazıldı.
- Güncel katalog/modül aileleri, behavior registry, placement, state, renderer ve BOM katmanları özetlendi.
- Global 90° / 50 cm gibi artık doğru olmayan varsayımlar README'ye taşınmadı.

---

## P1 — Kayıpsız dokümantasyon sınıflandırması

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #7

Merge commit: `0f99b8cfa58fd14cf6bb5a992e52e2d0f2b89eb5`

- `PRODUCT_FUTURE.md` oluşturuldu.
- `LEGACY_TRASH.md` oluşturuldu.
- `RENDER_FUTURE_BACKLOG.md` oluşturuldu.
- `MILESTONES.md` tarihsel kayıt olarak netleştirildi.
- README içine current / future / legacy / history sınıflandırma haritası eklendi.

---

## P1 — Roadmap implementation reconciliation

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #8

Merge commit: `537622c6bdf5384be7e12456866a20ab58014ef3`

- `ROADMAP.md` ve `ROADMAP_PHASE_4.md` gerçek source/test durumuyla karşılaştırıldı.
- Production parts temelinin ve 50/100/150/200 düz duvar recipe'lerinin mevcut olduğu işaretlendi.
- Recipe registry ile scene-instance Raw BOM pipeline'ı birbirinden ayrıldı.
- Olmayan parametrik/custom/connection graph işleri tamamlanmış gösterilmedi.
- Hiçbir gelecek plan maddesi silinmedi.

---

## P1 — `main.js` sorumluluk azaltma / project naming extraction

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #9

Merge commit: `fa8e12f877bc27e91d67e9c59a8a8772fe02c28d`

- `src/projectNaming.js` oluşturuldu.
- Proje suffix üretimi, editable-name helper, normalize/sync ve create/rename modalı `main.js` dışına taşındı.
- `test/projectNaming.test.js` eklendi.
- Project state/storage davranışı değiştirilmedi.

---

## P1 — Autosave controller contract

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #10

Merge commit: `006917a74c9e9b24db3ae056efd984a4c5f126b2`

- `src/autosaveController.js` eklendi.
- Mevcut 5 saniye debounce / 1 saniye watch contract'ı controller seviyesinde tanımlandı.
- Değişiklik algılama, debounce replacement, başarılı/başarısız persist, disable cleanup ve external-save re-baseline testleri eklendi.
- PR #10'da canlı `main.js` autosave wiring'i değiştirilmedi.

---

## P1 — Autosave controller integration

Durum: **TAMAMLANDI / CI DOĞRULANDI — MERGE BEKLİYOR**

Branch: `refactor/integrate-autosave-controller`

PR: #11 — `Integrate tested autosave controller into main`

- `main.js` artık `createAutosaveController()` kullanıyor.
- Legacy `autosaveEnabled`, `autosaveTimer`, `autosaveObservedSignature`, 5s/1s local constants ve local `setInterval` autosave loop kaldırıldı.
- Yeni proje, restore, beforeunload ve save failure disable noktaları `autosaveController.disable()` üzerinden çalışıyor.
- Başarılı create/restore/manual-save/rename akışları `enableFromCurrentState()` ile baseline alıyor.
- Asset delete sırasında explicit persist sonrası `markSavedState()` ile signature yeniden baseline ediliyor.
- Manuel save/rename öncesi pending debounce `clearPending()` ile iptal ediliyor.
- `test/autosaveMainIntegration.test.js` legacy autosave globals/duplicate timer loop geri gelirse CI'ı kırıyor.
- `docs/AUTOSAVE_INTEGRATION_NOTES.md` korunması gereken davranış invariant'larını kaydediyor.
- Guarded patch'in ilk denemesi, beklenen disable-call sayısı yanlış olduğu için kodu commit etmeden fail-fast oldu; guard düzeltildikten sonra patch + full test + build başarılı geçti.
- Geçici integration workflow final branch tree'sinden kaldırıldı.
- PR #11 canonical CI: `npm ci` ✅ `npm test` ✅ `npm run build` ✅.

## Sıradaki İş

1. PR #11 latest-head canonical CI tekrar başarılı olduktan sonra ROG'a merge et.
2. Sonraki düşük riskli `main.js` sorumluluğu olarak project UI helpers / asset library / color editor gruplarını karşılaştır ve en az coupling'e sahip olanı seç.
