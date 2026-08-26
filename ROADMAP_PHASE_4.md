# Fair Stand — FAZ 4 Roadmap

> **Tek kaynak:** Bu belge FAZ 4'ün detaylı uygulama planıdır. `ROADMAP.md` yalnız üst seviye durum/özet tutar. Nihai sahne BOM'u ve maliyet işleri `ROADMAP_PHASE_5_6.md` içindedir.

## FAZ 4 ana hedefi

FAZ 4'ün görevi yalnız parametrik geometri üretmek değildir. Önce modüllerin **gerçek fiziksel reçetesini** tanımlamak, sonra bu reçeteyi parametrik/custom yapıya bağlamak ve sahnedeki gerçek bağlantıları güvenilir biçimde saklamaktır.

FAZ 4 sonunda bir modül kendi başına şu sorulara cevap verebilmelidir:

- Kaç panel içeriyor?
- Kaç dikme içeriyor?
- Hangi üst/alt profilleri kullanıyor?
- Hangi başlangıç / tekli / köşe / çiftli aparat kurallarına sahip?
- Parametre değişirse kendi Raw BOM / module recipe çıktısı nasıl değişiyor?
- Sahnedeki başka modüllere nereden ve nasıl bağlı?

**FAZ 4'te yapılmayacaklar:** tüm sahnenin ortak parça düşümü/normalization sonucu olan Final BOM, fiyat/maliyet, fire, işçilik, Fair CRM fiyatlandırması.

---

# Temel mimari kuralları

- Üretim reçetesi geometri kodundan bağımsız bir veri modeli olur.
- Three.js mesh isimleri hiçbir zaman üretim parçası kimliği olmaz.
- Base definition, custom definition ve scene instance birbirinden ayrılır.
- Custom modülün geometry ve Raw BOM çıktısı aynı parametrik config'ten deterministik üretilir.
- Wizard ve sahne içi düzenleme aynı Rule Engine ve aynı recipe motorunu kullanır.
- Connection graph koordinat yakınlığı değil açık `sourceAnchor -> targetAnchor` ilişkisi taşır.
- Nihai sahne BOM'u ancak FAZ 5'te connection graph üzerinden normalize edilir.

---

# Sprint 1 — Üretim Parça Modeli + Standart Modül Reçeteleri

**Hedef:** Önce panel, dikme, profil ve aparat sistemini gerçek üretim verisiyle oturtmak.

## 1.1 — Part / Material Definition

- [ ] Stabil `partId` / `materialId` modeli.
- [ ] Parça kategorileri en az: `panel`, `upright`, `profile`, `connector`, `shelf`, `lighting`.
- [ ] Birimler: en az `adet`, `m`, `m²`, `set`.
- [ ] Gerçek fiziksel ölçüler metadata olarak tutulur.
- [ ] Opsiyonel `catalogRef` alanı ileride Fair CRM eşlemesi için hazır olur.
- [ ] Üretim parçası kimliği Three.js implementation'ından bağımsızdır.

## 1.2 — Doğrulanmış fiziksel standartlar

- Alüminyum dikme kalınlığı: **8 cm**.
- Default dikme uzunluğu: **346.5 cm**.
- Panel yüksekliği: **47 cm**.
- Panel kalınlığı/derinliği: **0.8 cm**.

### Düz panel ailesi

| Nominal modül | Panel |
| --- | --- |
| 50 cm | 48.5 × 47 × 0.8 cm |
| 100 cm | 98 × 47 × 0.8 cm |
| 150 cm | 147.5 × 47 × 0.8 cm |
| 200 cm | 197 × 47 × 0.8 cm |

### İç-köşe panel ailesi

| Nominal modül | Panel |
| --- | --- |
| 50 cm | 42.5 × 47 × 0.8 cm |
| 100 cm | 92 × 47 × 0.8 cm |
| 150 cm | 142.5 × 47 × 0.8 cm |
| 200 cm | 192 × 47 × 0.8 cm |

### Üst/alt profil uzunlukları

| Nominal modül | Profil |
| --- | --- |
| 50 cm | 41.5 cm |
| 100 cm | 91 cm |
| 150 cm | 140.5 cm |
| 200 cm | 190 cm |

## 1.3 — Aparat sözlüğü

- [ ] Başlangıç aparatı.
- [ ] Tekli / düz bağlantı aparatı.
- [ ] Köşe bağlantı aparatı.
- [ ] Çiftli bağlantı aparatı.

Doğrulanmış semantik:

- Panel dizisi başlangıcı → **başlangıç aparatı**, yalnız başlangıçta.
- Standart panel dizisi içi bağlantı → **tekli/düz bağlantı aparatı**.
- Standın içine doğru 90° birleşim → **köşe bağlantı aparatı**.
- Aynı doğrultuda iki ayrı modül birleşimi → **çiftli bağlantı aparatı**.

## 1.4 — Doğrulanmış düz duvar reçetesi

50 cm düz duvar:

- 2 × 41.5 cm üst/alt profil,
- 2 × 346.5 cm dikme,
- 7 × 48.5 × 47 × 0.8 cm panel,
- 2 × başlangıç aparatı,
- 13 × tekli/düz bağlantı aparatı.

100 / 150 / 200 cm düz duvarda adetler aynıdır; yalnız panel ve profil genişliği ilgili standart ölçüye göre değişir.

**Kural:** Köşe ve modül birleşimlerinin adet reçeteleri gerçek üretim Excel/verisiyle doğrulanmadan tahmin edilip kodlanmaz.

**Sprint çıkışı:** 50/100/150/200 standart duvar için fiziksel parça sözlüğü ve doğrulanmış module recipe sistemi hazır olur.

---

# Sprint 2 — Module Recipe / Raw BOM Motoru

**Hedef:** Her modülün kendi başına hangi fiziksel parçalardan oluştuğunu deterministik hesaplamak.

- [ ] `ModuleRecipeDefinition` / eşdeğer model.
- [ ] Sabit adet + parametrik formül desteği.
- [ ] Recipe çıktısı en az `partId`, `quantity`, `unit`, `dimensions`, `catalogRef` alanlarını taşıyabilir.
- [ ] Her scene instance bağımsız **Raw BOM** üretebilir.
- [ ] Raw BOM hangi instance/recipe'den geldiğini izlenebilir tutar.
- [ ] Parametre değişince Raw BOM otomatik değişir.
- [ ] Geometry ve Raw BOM aynı parametrik config'ten türetilir.
- [ ] Aynı input aynı geometry + aynı Raw BOM çıktısını verir.
- [ ] Unit testler.

**Sprint çıkışı:** Bir modülü sahneye koymadan bile `bu modül = şu parçalar` sonucu deterministik alınabilir.

---

# Sprint 3 — Parametrik Core / Rule Engine

**Hedef:** Üretim reçetesi bilen modülü parametrik hale getirmek.

- [ ] `ParametricModuleDefinition` ortak modeli.
- [ ] `BaseDefinition`, `CustomDefinition`, `SceneInstance` ayrımı.
- [ ] Stabil `definitionId`, `baseDefinitionId`, `instanceId`.
- [ ] `schemaVersion` / migration metadata'sı.
- [ ] Ana ölçüler varsayılan 50–500 cm ve 50 cm katları; modül tipi daha dar constraint tanımlayabilir.
- [ ] Validation sonucu yalnız true/false değil, kural kodu ve açıklanabilir neden döndürür.
- [ ] Ölçü, placement/collision ve modül-spesifik kurallar tek Rule Engine'de birleşir.
- [ ] Parametrik config hem geometry hem Raw BOM üretiminde kullanılır.
- [ ] Unit testler.

**Sprint çıkışı:** Parametrik bir definition değiştiğinde geometry ve modül reçetesi birlikte ve tutarlı yeniden üretilebilir.

---

# Sprint 4 — Custom Modül Wizard + Raflı Duvar Pilotu

## Custom Modül Wizard

- [ ] Base modülden `Custom oluştur` akışı.
- [ ] Yalnız izin verilen parametreler gösterilir.
- [ ] Anlık constraint doğrulaması.
- [ ] Live/ghost preview.
- [ ] Geçersiz config kaydedilemez; nedeni açık gösterilir.
- [ ] Raw BOM / module recipe preview ileride UI'da gösterilebilir olacak şekilde hazır tutulur.
- [ ] Kaydedilmiş custom modül tekrar açılıp düzenlenebilir.
- [ ] `Sadece bu instance'ı düzenle` ile `custom definition'ı düzenle` ayrımı açık olur.

## Raflı Duvar pilotu

- [ ] Raflı duvar ayrı base geometri değil, duvarın parametrik varyasyonudur.
- [ ] Parametreler: başlangıç yüksekliği, raf aralığı, raf adedi.
- [ ] Raf zemine/en alt profile veya en üst profile doğrudan yerleşemez.
- [ ] Raflar arasında minimum 50 cm / 1 panel mesafe.
- [ ] `lighting: none | led` ile tek modelde ışıklı/ışıksız seçenek.
- [ ] LED state'i geometry, Raw BOM metadata, preview ve save/load içinde korunur.
- [ ] LED için ileride gerçek parçalara dönüşecek semantic metadata tutulur.

**Sprint çıkışı:** Custom modül yalnız görsel değil, kendi fiziksel reçetesini de bilen parametrik varyasyon olur.

---

# Sprint 5 — Anchor / Connection Graph

**Hedef:** Modüllerin sahnedeki gerçek yapısal ilişkisini bilmek.

- [ ] Duvar, separatör ve yapısal profiller tipli anchor/connection point üretir.
- [ ] Anchor dünya konumu, yön/normal, tip ve izin verilen hedef tiplerini taşır.
- [ ] Magnetic snap uyumlu anchor'lar üzerinden çalışır.
- [ ] Bağlantı state'i gerçek `sourceAnchor -> targetAnchor` referansı saklar.
- [ ] Modül taşınır/döndürülürse bağlantı yeniden hesaplanır veya invalid-state oluşur.
- [ ] Save/load sonrasında aynı connection graph geri kurulur.

## Üretim semantiği

- [ ] `INNER_CORNER`: standın içine doğru 90° yapısal birleşim.
- [ ] `INLINE_JOIN`: aynı doğrultuda iki ayrı modül birleşimi.
- [ ] Standart panel dizisi içi bağlantı ile modüller arası bağlantı ayrılır.
- [ ] `START_OF_RUN` gibi reçeteyi etkileyen semantic flag'ler desteklenebilir.
- [ ] Ayrı `OUTER_CORNER` sınıfı gerçek üretim ihtiyacı doğrulanmadan oluşturulmaz.
- [ ] Sınıflandırma görsel tahminle değil anchor yönleri ve geometri üzerinden deterministik yapılır.

**Önemli sınır:** Connection graph, modülün Raw BOM'unu ve bağlantı tipini bilir; ancak tüm sahnedeki ortak dikme/aparat düşümü ve Final BOM hesabı FAZ 5'tedir.

**Sprint çıkışı:** Havrano benzeri projede sistem manuel işaretleme olmadan iç köşe ve inline birleşimleri tespit edebilir.

---

# Sprint 6 — İki Noktalı Kayıt / Profil Aracı

- [ ] İlk anchor başlangıç noktası.
- [ ] `Shift + ikinci anchor` bitiş noktası.
- [ ] Ghost preview.
- [ ] `Esc` iptal.
- [ ] Uzunluk, yön ve transform iki anchor'dan otomatik hesaplanır.
- [ ] Profil tipi/kesiti desteklenen katalog tanımından seçilebilir.
- [ ] Min/max uzunluk, collision ve stand sınırı Rule Engine'den doğrulanır.
- [ ] Profil iki anchor referansını state'te saklar.
- [ ] Bağlı modül hareketinde profil yeniden hesaplanır veya invalid-state oluşur.
- [ ] Profil kendi Raw BOM/part metadata'sını taşıyabilir.

---

# Sprint 7 — Custom Module Library + Project Save/Load / Versioning

## Custom Module Library

- [ ] Create / edit / duplicate / rename / delete.
- [ ] Ad, kategori, açıklama, base module referansı ve parametrik config.
- [ ] Base modüller read-only.
- [ ] `Base Modüller` / `Custom Modüller` ayrımı.
- [ ] `CustomModuleRepository` contract.
- [ ] Local/browser persistence adapter.
- [ ] Business logic storage API'sine doğrudan bağlanmaz.

## Project Save/Load + Versioning

- [ ] Definition / instance ayrımı proje dosyasında korunur.
- [ ] Parametrik instance snapshot saklanır.
- [ ] Schema version state'e yazılır.
- [ ] Migration/fallback stratejisi.
- [ ] Raw BOM üretmek için gereken recipe/config metadata kaybolmaz.
- [ ] Anchor/connection graph round-trip sonrasında aynı kalır.
- [ ] Connection semantics export/import sonrasında korunur.

---

# Sprint 8 — Regresyon + FAZ 4 Kapanışı

- [ ] Standart 50/100/150/200 duvar recipe testleri.
- [ ] Raw BOM determinism testleri.
- [ ] Parametric config değişiminde geometry + Raw BOM birlikte değişim testleri.
- [ ] Wizard/live preview testleri.
- [ ] Raflı duvar/LED state testleri.
- [ ] Anchor compatibility / snap testleri.
- [ ] İç köşe / inline sınıflandırma testleri.
- [ ] İki noktalı profil testleri.
- [ ] Custom library lifecycle testleri.
- [ ] Project save/load round-trip testleri.
- [ ] Mevcut base modüllerde renk, görsel, cam, selection, drag/drop, snap ve placement regresyonu olmayacak.
- [ ] `npm test` ve `npm run build` temiz olmadan FAZ 4 kapanmayacak.

## FAZ 4 kapanış kabulü

Bir modül ve bir proje için sistem aşağıdakileri kayıpsız ve deterministik sunabilmeli:

- modül/instance kimlikleri,
- parametrik config,
- gerçek fiziksel panel/dikme/profil/aparat tanımları,
- modül seviyesinde doğru Raw BOM / recipe,
- `sourceAnchor -> targetAnchor` connection graph,
- `INNER_CORNER`, `INLINE_JOIN` gibi üretim semantiği,
- save/load sonrası aynı recipe + bağlantı state'i.

**FAZ 4 kapanışında Final BOM veya maliyet zorunlu değildir.**