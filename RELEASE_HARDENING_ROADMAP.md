# Fair Stand — Release Hardening Roadmap

> Amaç: FAZ 4/5/6 ürün geliştirmesine devam etmeden önce mevcut çalışan ürünü kullanıcı testine ve satışa daha güvenli hale getirmek.
>
> Bu dosya yeni feature roadmap'i değildir. Mevcut sistemde doğrulanmış runtime/UI kusurları, production kalıntıları, repository hijyeni ve release güvenlik kapılarını takip eder.

## Başlangıç durumu — 3 Eylül 2026

- `ROG` canonical CI yeşil.
- Canonical CI: `npm ci` → `npm test` → `npm run build`.
- Açık PR/issue yok.
- Mevcut Node test paketi geniş regresyon coverage sağlıyor.
- Büyük `main.js` / `scene3d.js` refactorları release hardening sırasında yapılmayacak; yalnız düşük riskli ve doğrulanmış düzeltmeler yapılacak.

---

# P0 — Kullanıcı testi / satış öncesi kapatılacaklar

## 1. Initial selection-state contract'ını düzelt

Durum: **AÇIK**

Problem:

- `index.html` içindeki başlangıç `#selection-info` metni ile `selectionFeedback.js` içindeki canonical `DEFAULT_SELECTION_HINT` aynı değil.
- `uiFeedback.js` seçim durumunu metni canonical hint ile karşılaştırarak belirlediği için ilk açılışta yanlış `has-selection` state'i oluşabilir.

Yapılacak:

- Başlangıç selection hint tek source-of-truth ile eşleştirilecek.
- Regression testi eklenecek.
- Kullanıcıya görünen seçim davranışı dışında değişiklik yapılmayacak.

## 2. Production'daki Raw BOM debug panelini kaldır / DEV-only yap

Durum: **AÇIK**

Problem:

- `index.html`, `src/rawBomDebug.js` dosyasını production bundle içinde doğrudan yüklüyor.
- Kullanıcı arayüzüne `Üretim Listesi · Debug` paneli ekleniyor.
- Debug kodu gerçek module state contract'ı yerine `selection-info` içindeki Türkçe UI metnini regex ile okuyarak modül/reçete tahmini yapıyor.
- UI metni değişirse debug BOM sessizce yanlış veya eksik çalışabilir.

Yapılacak:

- Production girişinden çıkarılacak veya açık DEV flag arkasına alınacak.
- Raw BOM gerçek ürün özelliğine dönüşecekse ileride state/recipe contract'ına doğrudan bağlanacak; UI mesajı parse edilmeyecek.

## 3. Selection feedback ownership sızıntısını kapat

Durum: **AÇIK**

Problem:

- Selection mesajlarının canonical formatter'ı `selectionFeedback.js` içine taşındı.
- Ancak Işıklı Strafor ışık rengi değişiminde `main.js` aynı seçim mesajını tekrar elle oluşturuyor.

Yapılacak:

- Mesaj üretimi tek formatter katmanından geçirilecek.
- `main.js` yalnız state/UI wiring yapacak.
- Başka `main.js` refactorı bu işin içine alınmayacak.

## 4. Critical browser smoke test ekle

Durum: **AÇIK**

Problem:

- Mevcut testler `node --test` tabanlı ve güçlü regression coverage sağlıyor.
- Fakat gerçek tarayıcıda temel kullanıcı yolunu otomatik doğrulayan E2E/smoke katmanı yok.

Minimum smoke akışı:

1. Stand tipi ve ölçü gir.
2. Sahneyi oluştur.
3. Katalogdan modül ekle.
4. Modülü seç / taşı / döndür.
5. Renk veya görsel uygula.
6. Projeyi kaydet.
7. Kayıtlı projeyi tekrar aç.
8. ZIP export/import round-trip kontrol et.

Tercih: Playwright ile küçük, stabil bir release smoke suite.

---

# P1 — Release güvenliği ve repository hijyeni

## 5. Doğrulanmış dead code'u kaldır

Durum: **AÇIK**

İlk doğrulanmış örnek:

- `main.js` içindeki `syncWallLengthFromSetup()` kapasite hesaplıyor fakat sonucu kullanmadan bitiyor; aktif kullanım bulunmadı.

Kural:

- Yalnız gerçekten kullanılmadığı source/test ile doğrulanan kod kaldırılacak.
- Bu başlık genel refactor bahanesine çevrilmeyecek.

## 6. ROG branch protection / required CI

Durum: **AÇIK**

Mevcut durum:

- `ROG` protected değil.
- Canonical CI var fakat merge/push için zorunlu gate değil.

Hedef:

- PR üzerinden değişiklik.
- `CI / verify` required status check.
- Force push kapalı.
- Core branch'e doğrudan yanlış push riski azaltılmış olacak.

## 7. Merge edilmiş branch kalıntılarını temizle

Durum: **AÇIK**

Mevcut durum:

- Çok sayıda eski `feature/`, `fix/`, `refactor/`, `docs/`, `cleanup/` branch'i merge sonrası duruyor.
- Repository ayarında merge sonrası branch otomatik silme kapalı.

Yapılacak:

- ROG'a tamamen merge edilmiş branch'ler doğrulanıp silinecek.
- Uygunsa merge sonrası otomatik branch silme açılacak.

## 8. Legacy patch / trigger scriptlerini sınıflandır ve temizle

Durum: **AÇIK**

Doğrulanacak örnekler:

- `scripts/add-tv-sizes.py`
- `scripts/add-video-wall-2x2.py`
- `scripts/fix-tv-screen-face.py`
- `scripts/patch-video-wall-2x2.cjs`
- `scripts/patch-video-wall-single-image.cjs`
- `scripts/video-wall-build-trigger.txt`

Not:

- `scripts/install-server.sh` gerçek operasyon/deploy scriptidir; legacy patch dosyalarıyla aynı şekilde ele alınmayacak.
- Tarihsel değer varsa Git history zaten korur; runtime/release tree'sinde gereksiz kalıntı bırakılmayacak.

## 9. Test klasörü standardını tekleştir

Durum: **AÇIK**

Mevcut durum:

- Hem `test/` hem `tests/` klasörü bulunuyor.

Yapılacak:

- İçerikler duplicate mi yoksa ayrı contract mı doğrulanacak.
- Tek canonical test klasörü standardına taşınacak.
- `npm test` coverage kaybetmeden devam edecek.

## 10. Stale audit/cleanup dokümanlarını historical hale getir

Durum: **AÇIK**

Problem:

- `REPOSITORY_CLEANUP_PROGRESS.md` güncel merge seviyesinin gerisinde.
- `FRESH_REPOSITORY_REVIEW.md` geçmiş snapshot olmasına rağmen adı/formatı güncel audit gibi algılanabiliyor.

Yapılacak:

- Aktif source-of-truth olmadıkları açıkça işaretlenecek veya history klasörüne taşınacak.
- Güncel release hardening takibi bu dosyada yapılacak.

## 11. Public repository / license kararını kesinleştir

Durum: **KARAR GEREKİYOR**

Mevcut durum:

- Repository public.
- Repository seviyesinde lisans tanımlı görünmüyor.

Karar:

- Ticari kaynak kodun public olması bilinçli ise bunu koru ve lisans politikasını netleştir.
- Kapalı kaynak olması gerekiyorsa satıştan önce repository visibility/deployment akışını buna göre düzenle.

## 12. Kullanılmayan büyük public assetleri temizle

Durum: **AÇIK**

Doğrulanmış/şüpheli örnekler:

- `public/models/indoor_plants2.glb` — runtime'dan kaldırılmış model, gelecekte kullanım için parked.
- `public/textures/exhibition-floor.jpg` — runtime optimized sürümü kullanıyor.
- Diğer alternatif/parked GLB'ler source referanslarıyla tek tek doğrulanacak.

Yapılacak:

- Kullanılmayan assetler production `public/` ağacından çıkarılacak veya ayrı archive/source alanına taşınacak.
- Kullanılan büyük GLB'ler için gerekiyorsa optimize/lazy-load değerlendirmesi yapılacak.

## 13. Minimal static quality gate ekle

Durum: **AÇIK**

Hedef:

- ESLint veya eşdeğer statik kontrol.
- İlk aşamada büyük style/format churn yaratmadan gerçek hata sınıflarını yakalayan küçük kural seti.
- CI hedefi: static check → test → build.

## 14. Deploy akışını explicit release SHA/branch ile sabitle

Durum: **AÇIK**

Mevcut `install-server.sh` bulunduğu checkout üzerinde `git pull --ff-only` + `npm ci` + `npm run build` çalıştırıyor.

Hedef:

- Deploy kaynağı explicit `ROG` veya release tag/SHA olsun.
- Mümkünse yalnız canonical CI'dan geçmiş SHA deploy edilsin.
- Production deploy öncesi minimum doğrulama kapısı belirlensin.

---

# P2 — Release sonrasına bırakılabilecek teknik borç

## 15. `main.js` sorumluluk azaltmaya kontrollü devam

Durum: **RELEASE SONRASI**

- Tek seferde büyük refactor yapılmayacak.
- Yalnız bağımsız, testlenebilir, davranış değiştirmeyen küçük sorumluluklar çıkarılacak.

## 16. `scene3d.js` renderer ayrıştırması

Durum: **RELEASE SONRASI**

- `scene3d.js` büyük ve module-specific renderer sorumluluğu yüksek.
- Ancak kullanıcı testi öncesi geniş refactor yapılmayacak.
- Renderer extraction işi ayrı regression testleriyle küçük PR'lara bölünecek.

---

# Uygulama sırası

1. Initial selection-state düzeltmesi.
2. Raw BOM debug production temizliği.
3. Işıklı Strafor selection feedback duplicate'ını kaldır.
4. Browser smoke suite.
5. Dead code doğrulama/temizliği.
6. ROG branch protection + required CI.
7. Merge edilmiş branch temizliği.
8. Legacy scripts + test klasörü temizliği.
9. Stale audit dokümanlarının historical sınıflandırması.
10. Büyük/unused public asset temizliği.
11. Minimal static quality gate.
12. Deploy hardening.
13. Public/private + license kararının kesinleştirilmesi.
14. Release gate tamamlandıktan sonra aktif ürün roadmap'ine geri dön.

---

# Release gate

Aşağıdakiler tamamlanmadan `release hardening tamamlandı` denmez:

- [ ] Canonical CI yeşil.
- [ ] Initial selection-state bug kapalı.
- [ ] Production debug paneli kapalı veya DEV-only.
- [ ] Critical browser smoke suite yeşil.
- [ ] ROG için required CI gate aktif.
- [ ] Doğrulanmış legacy branch/script kalıntıları temiz.
- [ ] Kullanılmayan büyük public assetler sınıflandırılmış/temizlenmiş.
- [ ] Deploy kaynağı explicit ve tekrar üretilebilir.
- [ ] Public/private ve license kararı bilinçli olarak verilmiş.

Bu maddeler release stabilizasyonu içindir; FAZ 4/5/6 kapsamındaki parametrik sistem, Final BOM ve Fair CRM/Costing işleri bu dosyanın kapsamı dışındadır.
