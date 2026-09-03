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

Merge: PR #4

---

## P1 — Catalog → module behavior contract coverage

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #5

---

## P1 — README güncellemesi

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #6

---

## P1 — Kayıpsız dokümantasyon sınıflandırması

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #7

Merge commit: `0f99b8cfa58fd14cf6bb5a992e52e2d0f2b89eb5`

- `PRODUCT_FUTURE.md`, `LEGACY_TRASH.md`, `RENDER_FUTURE_BACKLOG.md` oluşturuldu.
- `MILESTONES.md` tarihsel kayıt olarak netleştirildi.

---

## P1 — Roadmap implementation reconciliation

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #8

Merge commit: `537622c6bdf5384be7e12456866a20ab58014ef3`

---

## P1 — `main.js` sorumluluk azaltma / project naming extraction

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #9

Merge commit: `fa8e12f877bc27e91d67e9c59a8a8772fe02c28d`

- `src/projectNaming.js` ve `test/projectNaming.test.js` eklendi.
- Project naming/modal sorumlulukları `main.js` dışına taşındı.

---

## P1 — Autosave controller contract

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #10

Merge commit: `006917a74c9e9b24db3ae056efd984a4c5f126b2`

- `src/autosaveController.js` eklendi.
- 5 saniye debounce / 1 saniye watch contract'ı testlerle sabitlendi.

---

## P1 — Autosave controller integration

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #11

Merge commit: `fa8f518825d9efd2a15c548f078e316cef0e4502`

- `main.js` autosave lifecycle'ı `createAutosaveController()` üzerinden çalışıyor.
- Legacy autosave globals ve duplicate timer loop kaldırıldı.
- Create/restore/manual-save/rename/asset-delete coordination noktaları korundu.
- `test/autosaveMainIntegration.test.js` legacy döngünün geri gelmesini engelliyor.
- `docs/AUTOSAVE_INTEGRATION_NOTES.md` davranış invariant'larını kaydediyor.

---

## P1 — Project UI helper extraction

Durum: **UYGULANDI — PR/CANONICAL CI BEKLİYOR**

Branch: `refactor/extract-project-ui-helpers`

Amaç: `main.js` içindeki düşük riskli, generic project UI yardımcılarını state/storage davranışına dokunmadan ayırmak.

Yapılanlar:

- `src/projectUi.js` oluşturuldu.
- `setButtonBusy()` `main.js` dışına taşındı; idle label, disabled state ve `aria-busy` davranışı birebir korundu.
- Proje loading overlay show/hide davranışı `createProjectLoadingController()` içine taşındı.
- `main.js` yalnız DOM elementlerini controller'a bağlıyor.
- `test/projectUi.test.js` ile busy-button ve loading overlay kontratları test edildi.
- `test/projectUiMainIntegration.test.js` ile legacy helper fonksiyonlarının `main.js` içine geri dönmesi engelleniyor.
- Guarded patch + full `npm test` + `npm run build` başarılı geçti.
- Geçici extraction workflow final branch tree'sinden kaldırıldı.

## Sıradaki İş

1. Project UI helper extraction için PR aç.
2. Latest-head canonical CI'da `npm ci`, `npm test`, `npm run build` başarılarını doğrula.
3. Başarılıysa ROG'a merge et.
4. Sonraki düşük riskli `main.js` sorumluluğu için color editor ile asset library gruplarını coupling açısından karşılaştır.
