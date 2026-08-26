# Fair Stand — FAZ 4 Roadmap

> **Tek kaynak:** Bu belge FAZ 4'ün detaylı uygulama planıdır. `ROADMAP.md` yalnız üst seviye durum/özet tutar. Maliyet, miktar ve gerçek üretim BOM'u `ROADMAP_PHASE_5_6.md` içindedir.

## FAZ 4 ana hedefi

FAZ 4'ün görevi Fair Stand'i parametrik ve yapısal olarak güvenilir bir editöre dönüştürmektir:

- base/custom/instance ayrımını kurmak,
- ortak Rule Engine oluşturmak,
- custom modül üretmek ve yeniden düzenlemek,
- gerçek anchor/connection graph kurmak,
- proje save/load sırasında parametrik ve yapısal state'i kaybetmemek,
- FAZ 5–6'nın ihtiyaç duyacağı metadata'yı eksiksiz taşımak.

**FAZ 4'te yapılmayacaklar:** nihai malzeme listesi/BOM hesabı, shared-part deduction, maliyet/fiyat hesabı, fire/işçilik, Fair CRM fiyatlandırması. Bunlar FAZ 5–6 kapsamıdır.

---

# Temel mimari kuralları

- Mevcut base modüller read-only referans modül olarak korunur.
- Custom definition ile scene instance birbirinden ayrılır; instance değişikliği base/custom definition'ı sessizce mutate etmez.
- Wizard ve sahne içi düzenleme aynı parametrik model ve aynı Rule Engine'i kullanır.
- Parametrik sistem serbest CAD değildir; tanımlı constraint ve üretim kuralları içinde çalışır.
- Üretim metadata'sı Three.js mesh isimlerine bağlanmaz.
- Connection graph koordinat yakınlığı değil açık `sourceAnchor -> targetAnchor` ilişkisi taşır.
- Business logic doğrudan localStorage/backend API'sine bağlanmaz; repository contract kullanır.

---

# Uygulama sırası

## Sprint 1 — Parametrik Core / Rule Engine

**Hedef:** UI ve Three.js'ten mümkün olduğunca ayrılmış ortak parametrik çekirdek.

- [ ] `ParametricModuleDefinition` / eşdeğer ortak veri modeli.
- [ ] `BaseDefinition`, `CustomDefinition`, `SceneInstance` ayrımı.
- [ ] Stabil `definitionId`, `baseDefinitionId`, `instanceId`.
- [ ] `schemaVersion` / migration metadata'sı.
- [ ] Ana parametrik ölçüler varsayılan 50–500 cm ve 50 cm katları; modül tipi daha dar constraint tanımlayabilir.
- [ ] Validation sonucu `valid/invalid` yanında kural kodu ve kullanıcıya açıklanabilir neden döndürür.
- [ ] Ölçü, placement/collision ve modül-spesifik kurallar tek Rule Engine'de toplanır.
- [ ] Aynı parametrik input aynı deterministik geometry/state çıktısını üretir.
- [ ] Parametrik config save/load ve ileride BOM recipe tekrar hesabına uygun saklanır.
- [ ] Fiziksel panel/yüzeylerin stabil yüz kimliği ve gerçek ölçü metadata'sını taşıyabileceği model hazırlanır.
- [ ] Üretim/catalog referansları geometri implementation'ından bağımsız tutulur.
- [ ] Unit testler.

**Sprint çıkışı:** UI olmadan bir parametrik definition doğrulanabilir ve deterministik scene state üretilebilir.

---

## Sprint 2 — Custom Modül Wizard + Raflı Duvar pilotu

### Custom Modül Wizard

- [ ] Base modülden `Custom oluştur` akışı.
- [ ] Sadece seçilen modül tipinin izin verdiği parametreler gösterilir.
- [ ] Sayısal alanlarda anlık constraint doğrulaması.
- [ ] Live/ghost preview.
- [ ] Geçersiz config kaydedilemez; nedeni açık gösterilir.
- [ ] Kaydedilmiş custom modül tekrar açılıp düzenlenebilir.
- [ ] `Sadece bu instance'ı düzenle` ile `custom definition'ı düzenle` ayrımı açık olur.

### İlk parametrik referans: Raflı Duvar

- [ ] Raflı duvar ayrı base geometri değil, duvarın parametrik varyasyonudur.
- [ ] Parametreler: başlangıç yüksekliği, raf aralığı, raf adedi.
- [ ] Raf zemine/en alt profile veya en üst profile doğrudan yerleşemez.
- [ ] Raflar arasında minimum 50 cm / 1 panel mesafe.
- [ ] `lighting: none | led` ile tek modelde ışıklı/ışıksız seçenek.
- [ ] LED state'i preview, save/load ve custom definition içinde korunur.
- [ ] LED için gelecekte BOM'a dönüşebilecek semantic metadata tutulur; **adet/fiyat hesabı FAZ 4'te yapılmaz**.
- [ ] Raflı duvar renk, görsel, cam, seçim, drag/drop, snap ve placement davranışlarında base duvarla uyumlu kalır.

**Sprint çıkışı:** Kullanıcı kod yazmadan raflı duvar varyasyonu oluşturabilir; Wizard ve sahne aynı Rule Engine'i kullanır.

---

## Sprint 3 — Anchor / Connection Graph

**Hedef:** Modüllerin sadece yakınlığını değil, gerçek yapısal ilişkisini bilmek.

- [ ] Duvar, separatör ve yapısal profiller tipli anchor/connection point üretir.
- [ ] Anchor dünya konumu, yön/normal, tip ve izin verilen hedef tiplerini taşır.
- [ ] Magnetic snap uyumlu anchor'lar üzerinden çalışır.
- [ ] Bağlantı state'i gerçek `sourceAnchor -> targetAnchor` referansı saklar.
- [ ] Modül taşınır/döndürülürse bağlantı yeniden hesaplanır veya açık invalid-state oluşur.
- [ ] Save/load sonrasında aynı connection graph geri kurulur.

### FAZ 6 için korunacak üretim semantiği

FAZ 4 burada **malzeme saymaz**; yalnız daha sonra BOM motorunun kullanacağı gerçek bağlantı semantiğini tespit eder ve saklar.

- [ ] `INNER_CORNER`: standın içine doğru 90° yapısal birleşim.
- [ ] `INLINE_JOIN`: aynı doğrultuda iki ayrı modülün yapısal birleşimi.
- [ ] Standart panel dizisi içi bağlantı ile modüller arası bağlantı birbirinden ayrılır.
- [ ] `START_OF_RUN` / panel dizisi başlangıcı gibi reçeteyi etkileyen semantic flag'ler gerekirse state'te tutulabilir.
- [ ] Ayrı bir `OUTER_CORNER` üretim sınıfı varsayılan olarak oluşturulmaz; gerçek üretim ihtiyacı doğrulanırsa eklenir.
- [ ] İç köşe/inline sınıflandırması görsel tahminle değil anchor yönleri ve sahne geometrisi üzerinden deterministik yapılır.

**Önemli sınır:** `INNER_CORNER -> hangi panel SKU`, `kaç köşe aparatı`, `kaç çiftli aparat` gibi gerçek parça seçimi ve adet hesabı **FAZ 6 BOM Recipe** işidir. FAZ 4 yalnız bunu mümkün kılan semantiği eksiksiz sağlar.

**Sprint çıkışı:** Havrano benzeri bir projede sistem manuel işaretleme olmadan gerçek bağlantı graph'ını ve iç köşe/inline semantiğini deterministik çıkarabilir.

---

## Sprint 4 — İki Noktalı Kayıt / Profil Aracı

- [ ] İlk geçerli anchor başlangıç noktası olur.
- [ ] `Shift + ikinci anchor` bitişi belirler.
- [ ] İkinci seçim yapılana kadar ghost çizgi/profil preview gösterilir.
- [ ] `Esc` işlemi iptal eder.
- [ ] Profil uzunluğu, yönü ve transform'u iki anchor'dan otomatik türetilir.
- [ ] Profil tipi/kesiti desteklenen katalog tanımından seçilebilir.
- [ ] Min/max uzunluk, collision ve stand sınırı Rule Engine'den doğrulanır.
- [ ] Profil iki gerçek anchor referansını state'te saklar.
- [ ] Bağlı modül hareketinde profil yeniden hesaplanır veya açık invalid-state oluşur.

**Sprint çıkışı:** Profil koordinat hack'iyle değil gerçek iki anchor ilişkisiyle üretilir.

---

## Sprint 5 — Custom Module Library / Yaşam Döngüsü

- [ ] Create / edit / duplicate / rename / delete.
- [ ] Ad, kategori, açıklama, base module referansı ve parametrik config.
- [ ] Base modüller read-only kalır.
- [ ] `Base Modüller` / `Custom Modüller` katalog ayrımı.
- [ ] `CustomModuleRepository` contract.
- [ ] Local/browser persistence adapter.
- [ ] Business logic doğrudan storage API'sine bağlanmaz.
- [ ] Custom definition silinse/değişse bile mevcut proje instance'ı snapshot/version üzerinden açılabilir.

**Sprint çıkışı:** Custom modüller local adapter ile kalıcı yönetilebilir; backend entegrasyonu olmadan çekirdek tamamlanır.

---

## Sprint 6 — Project Save/Load + Versioning

- [ ] Definition ile scene instance ayrımı proje dosyasında korunur.
- [ ] Parametrik instance snapshot saklanır.
- [ ] Parametrik schema version proje state'ine yazılır.
- [ ] Migration/fallback stratejisi.
- [ ] Silinmiş/değişmiş custom definition'a rağmen eski proje mümkün olduğunca render edilir.
- [ ] Anchor/connection graph save/load round-trip sonrasında kaybolmaz.
- [ ] Connection semantics (`INNER_CORNER`, `INLINE_JOIN` vb.) export/import sonrasında aynı kalır.
- [ ] Fiziksel panel/yüzey kimliği ve gerçek ölçü metadata'sı kaybolmaz.

**Sprint çıkışı:** Save → close/reload → load sonrasında aynı parametrik ve yapısal state geri gelir.

---

## Sprint 7 — Regresyon + BOM-readiness + FAZ 4 kapanışı

### Test kapsamı

- [ ] Ölçü constraint / validation testleri.
- [ ] Raflı duvar ve LED state testleri.
- [ ] Wizard/live preview testleri.
- [ ] Anchor compatibility / snap testleri.
- [ ] İç köşe sınıflandırma testleri.
- [ ] Inline/modül birleşim testleri.
- [ ] İki noktalı profil testleri.
- [ ] Custom library lifecycle testleri.
- [ ] Project save/load round-trip testleri.
- [ ] Mevcut base modüllerde renk, görsel, cam, selection, drag/drop, snap ve placement regresyonu olmayacak.
- [ ] `npm test` ve `npm run build` temiz olmadan FAZ 4 kapanmayacak.

### FAZ 4 kapanış kabulü

Sistem bir projeyi açtığında aşağıdaki bilgiyi deterministik ve kayıpsız sunabilmeli:

- modül definition/instance kimlikleri,
- parametrik config ve gerçek fiziksel ölçü metadata'sı,
- panel/yüzey kimlikleri,
- `sourceAnchor -> targetAnchor` connection graph,
- iç köşe / inline gibi üretim semantiği,
- ileride BOM recipe ve Fair CRM eşlemesine bağlanabilecek stabil part/catalog referans alanları.

**FAZ 4 kapanışında malzeme listesi veya fiyat sonucu zorunlu değildir.** Bunlar FAZ 5–6'nın sorumluluğudur.

---

# FAZ 4 dışında kalan işler

Aşağıdakiler bilinçli olarak bu fazdan çıkarılmıştır:

- Gerçek BOM Recipe ve malzeme adetleri → **FAZ 6**.
- Normal/köşe panel SKU seçimi ve aparat adet hesabı → **FAZ 6**.
- Shared upright/profile/aparat deduction → **FAZ 6**.
- Elle çıkarılmış Excel malzeme listesini otomatik BOM ile doğrulama → **FAZ 6**.
- Hazır obje/yüzey miktarlarının ticari breakdown'ı → **FAZ 5**.
- m², fire, işçilik, nakliye ve ek maliyet → **FAZ 5**.
- Fair CRM fiyat/catalog source-of-truth entegrasyonu → **FAZ 5**.
- Fair CRM/Kyrox Core production ownership/auth entegrasyonu → **FAZ 5 platform entegrasyon adımı**; FAZ 4 yalnız repository contract'ını hazırlar.

---

# Sonraki fazlara devredilecek doğrulanmış üretim verileri

Bu veriler bugün gerçek üretim bilgisi olarak doğrulanmıştır; **hesaplama FAZ 6'da uygulanacaktır**.

## Fiziksel standartlar

- Alüminyum dikme kalınlığı: **8 cm**.
- Default dikme uzunluğu: **346.5 cm**.
- Panel yüksekliği: **47 cm**.
- Panel kalınlığı/derinliği: **0.8 cm**.

## Düz panel ailesi

| Nominal modül | Panel |
| --- | --- |
| 50 cm | 48.5 × 47 × 0.8 cm |
| 100 cm | 98 × 47 × 0.8 cm |
| 150 cm | 147.5 × 47 × 0.8 cm |
| 200 cm | 197 × 47 × 0.8 cm |

## İç-köşe panel ailesi

| Nominal modül | Panel |
| --- | --- |
| 50 cm | 42.5 × 47 × 0.8 cm |
| 100 cm | 92 × 47 × 0.8 cm |
| 150 cm | 142.5 × 47 × 0.8 cm |
| 200 cm | 192 × 47 × 0.8 cm |

## Üst/alt profil uzunlukları

| Nominal modül | Profil uzunluğu |
| --- | --- |
| 50 cm | 41.5 cm |
| 100 cm | 91 cm |
| 150 cm | 140.5 cm |
| 200 cm | 190 cm |

## Doğrulanmış düz duvar reçetesi

50 cm düz duvar:

- 2 × 41.5 cm üst/alt profil,
- 2 × 346.5 cm dikme,
- 7 × 48.5 × 47 × 0.8 cm panel,
- 2 × başlangıç aparatı,
- 13 × tekli/düz bağlantı aparatı.

100 / 150 / 200 cm düz duvarda adetler aynı; yalnız profil ve panel genişliği yukarıdaki tabloya göre değişir.

## Doğrulanmış aparat semantiği

- Panel dizisi içindeki standart bağlantı: **tekli/düz bağlantı aparatı**.
- Standın içine doğru 90° yapısal birleşim: **köşe bağlantı aparatı**.
- Aynı doğrultuda iki ayrı modül birleşimi: **çiftli bağlantı aparatı**.
- Panel dizisi başlangıcı: **başlangıç aparatı**; yalnız başlangıçta kullanılır.

Köşe ve modül-birleşimlerinin nihai aparat/panel **adet reçeteleri**, gerçek Excel/üretim verisi tamamlanmadan varsayım olarak kodlanmayacaktır.
