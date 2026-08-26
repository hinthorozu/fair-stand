# Fair Stand — FAZ 4 Uygulama Roadmap'i

> Bu belge FAZ 4 için güncel ve sıralı uygulama planıdır. Mevcut `ROADMAP.md` içindeki 4.1–4.9 kapsamını korur; 26 Ağustos 2026'da netleştirilen gerçek üretim/malzeme ve bağlantı kurallarını plana dahil eder. FAZ 5 ve FAZ 6 kaldırılmamıştır; maliyet ve gerçek üretim BOM kapsamı `ROADMAP_PHASE_5_6.md` içinde devam eder.

## FAZ 4 ana hedefi

Mevcut base modülleri bozmadan parametrik/custom modül altyapısını kurmak; sahnedeki modüllerin gerçek yapısal bağlantılarını bilmesini sağlamak ve FAZ 5–6'da malzeme/maliyet hesabı yapılabilmesi için gerekli üretim metadata'sını kaybetmeden üretmek.

FAZ 4'te fiyat hesabı yapılmayacaktır. Ancak sahne state'i, connection graph ve parametrik tanımlar ileride BOM/maliyet motorunun tekrar geometri tahmini yapmak zorunda kalmayacağı kadar açık olacaktır.

---

# Uygulama sırası

## Sprint 1 — 4.1 Parametrik Core / Rule Engine

**Hedef:** Three.js ve UI'dan mümkün olduğunca ayrılmış ortak parametrik veri modeli.

- [ ] `ParametricModuleDefinition` / eşdeğer ortak model.
- [ ] Base definition, custom definition ve scene instance ayrımı.
- [ ] Stabil `definitionId`, `baseDefinitionId`, `instanceId` ve schema/version metadata'sı.
- [ ] Ana parametrik ölçüler varsayılan olarak 50–500 cm ve 50 cm katları; modül tipi daha dar constraint tanımlayabilir.
- [ ] Validation yalnız true/false dönmeyecek; ihlal edilen kural ve nedeni açıklanacak.
- [ ] Ölçü, placement/collision ve modül-spesifik kurallar ortak Rule Engine'de birleşecek.
- [ ] Aynı parametrik girdi aynı geometri/state çıktısını deterministik üretmeli.
- [ ] Unit testler.

### FAZ 5–6 için zorunlu metadata temeli

- [ ] Üretim parçası/catalog referansları Three.js mesh isimlerinden bağımsız tutulacak.
- [ ] Fiziksel panel/yüzey kimlikleri ve gerçek ölçüleri state'te korunabilecek.
- [ ] Parametrik config, ileride BOM recipe'nin tekrar hesaplanabileceği biçimde saklanacak.

**Sprint çıkışı:** UI olmadan parametrik bir definition doğrulanabilmeli ve deterministik geometry/state üretilebilmeli.

---

## Sprint 2 — 4.2 Custom Modül Wizard + 4.3 Raflı Duvar pilotu

### Custom Modül Wizard

- [ ] Base modülden `Custom oluştur` akışı.
- [ ] Sadece seçilen modül tipinin izin verdiği parametreler gösterilecek.
- [ ] Sayısal alanlarda anlık constraint doğrulaması.
- [ ] Live/ghost preview.
- [ ] Geçersiz konfigürasyon kaydedilemeyecek ve nedeni açık gösterilecek.
- [ ] Kaydedilmiş custom modül tekrar açılıp düzenlenebilecek.
- [ ] Instance düzenleme ile kayıtlı custom definition düzenleme birbirinden açıkça ayrılacak.

### İlk parametrik referans: Raflı Duvar

- [ ] Raflı sistem ayrı base geometri olmayacak; duvarın parametrik varyasyonu olacak.
- [ ] Parametreler: başlangıç yüksekliği + raf aralığı + raf adedi.
- [ ] Raf zemine/en alt profile veya en üst profile doğrudan yerleşemeyecek.
- [ ] Raflar arasında minimum 50 cm / 1 panel mesafe.
- [ ] `lighting: none | led` ile ışıklı/ışıksız tek model.
- [ ] LED durumu preview, save/load ve custom definition içinde korunacak.
- [ ] LED şerit/profil/difüzör/kablo/driver gibi ileride BOM'a dönüşecek metadata taşınacak; fiyat hesabı yapılmayacak.
- [ ] Raflı duvar renk, görsel, cam, selection, drag/drop ve placement davranışlarında base duvarla uyumlu kalacak.

**Sprint çıkışı:** Kullanıcı kod yazmadan geçerli raflı duvar varyasyonu oluşturabilecek; Wizard ve sahne aynı Rule Engine'i kullanacak.

---

## Sprint 3 — 4.4 Anchor / Connection Graph + üretim bağlantı semantiği

**Hedef:** Modüllerin yalnız koordinat olarak yakın olduğunu değil, gerçekten nereden ve nasıl bağlandığını bilmek.

- [ ] Duvar, separatör ve yapısal profiller tipli anchor/connection point üretecek.
- [ ] Anchor dünya konumu, yön/normal, bağlantı tipi ve izin verilen hedef tiplerini taşıyacak.
- [ ] Magnetic snap uyumlu anchor'lar üzerinden çalışacak; uyumsuz bağlantılar reddedilecek.
- [ ] State yalnız koordinat değil gerçek `sourceAnchor -> targetAnchor` ilişkisi saklayacak.
- [ ] Modül taşınır/döndürülürse bağlantı yeniden hesaplanacak veya açık invalid-state üretilecek.
- [ ] Save/load sonrasında aynı connection graph geri kurulacak.

### Gerçek üretim bağlantı sınıfları

Bu sınıflar görsel isimlendirme değil, BOM/assembly anlamı taşır:

- [ ] `INNER_CORNER`: standın içine doğru 90° birleşim. **Köşe bağlantı aparatı** kullanır.
- [ ] `INLINE_JOIN`: aynı doğrultuda iki ayrı modülün birleşimi. **Çiftli bağlantı aparatı** kullanır.
- [ ] Standart panel dizisi içindeki normal bağlantılar **tekli/düz bağlantı aparatı** kullanır.
- [ ] **Başlangıç aparatı** bağlantı sınıfı değildir; panel dizisinin yalnız başlangıç reçetesidir.
- [ ] Ayrı bir `OUTER_CORNER` üretim sınıfı oluşturulmayacak; ihtiyaç yoksa standart bağlantı semantiğiyle çözülecek.

### Panel ölçüsünü bağlantı semantiğinden türetme

Normal/düz panel ailesi:

| Nominal modül | Panel ölçüsü |
| --- | --- |
| 50 cm | 48.5 × 47 × 0.8 cm |
| 100 cm | 98 × 47 × 0.8 cm |
| 150 cm | 147.5 × 47 × 0.8 cm |
| 200 cm | 197 × 47 × 0.8 cm |

İç-köşe panel ailesi:

| Nominal modül | İç-köşe panel ölçüsü |
| --- | --- |
| 50 cm | 42.5 × 47 × 0.8 cm |
| 100 cm | 92 × 47 × 0.8 cm |
| 150 cm | 142.5 × 47 × 0.8 cm |
| 200 cm | 192 × 47 × 0.8 cm |

- [ ] Sistem yalnız `wallWidth` değerinden panel SKU/ölçüsü seçmeyecek; connection semantics de hesaba katılacak.
- [ ] Örneğin 200 cm duvarda sistem bağlantı durumuna göre 197 × 47 veya 192 × 47 panel gereksinimini deterministik seçebilecek.
- [ ] Bu seçim görsel mesh tahminiyle değil gerçek anchor/connection graph üzerinden yapılacak.

### Bilinen standart üretim ölçüleri

- Alüminyum dikme kalınlığı: **8 cm**.
- Default dikme uzunluğu: **346.5 cm**.
- Panel yüksekliği: **47 cm**.
- Panel kalınlığı/derinliği: **0.8 cm**.
- 50 cm modül üst/alt profil uzunluğu: **41.5 cm**.
- 100 cm modül üst/alt profil uzunluğu: **91 cm**.
- 150 cm modül üst/alt profil uzunluğu: **140.5 cm**.
- 200 cm modül üst/alt profil uzunluğu: **190 cm**.

### İlk doğrulanmış düz duvar reçetesi

50 cm düz duvar:

- 2 × 41.5 cm üst/alt profil.
- 2 × 346.5 cm dikme.
- 7 × 48.5 × 47 × 0.8 cm panel.
- 2 × başlangıç aparatı.
- 13 × tekli/düz bağlantı aparatı.

100 / 150 / 200 cm düz duvarlarda bu doğrulanmış reçetede adetler aynı kalır; yalnız profil ve panel genişliği yukarıdaki ölçü tablosuna göre değişir.

**Not:** Köşe ve modül-birleşim reçetelerinin nihai adetleri gerçek üretim Excel/verisiyle doğrulanmadan varsayım olarak kodlanmayacak.

**Sprint çıkışı:** Sistem içe 90° köşeyi ve aynı doğrultudaki modül birleşimini otomatik sınıflandırabilecek; state'te gerçek connection semantics saklanacak.

---

## Sprint 4 — 4.5 İki Noktalı Kayıt / Profil Aracı

- [ ] İlk geçerli anchor seçimi başlangıç noktası olacak.
- [ ] `Shift + ikinci anchor` bitişi belirleyecek.
- [ ] İkinci seçim yapılana kadar ghost çizgi/profil preview.
- [ ] `Esc` iptal.
- [ ] Profil uzunluğu, yönü ve transform'u iki anchor'dan otomatik türetilecek.
- [ ] Profil tipi/kesiti katalogdan seçilebilecek.
- [ ] Min/max uzunluk ve collision/stand sınırı Rule Engine'den doğrulanacak.
- [ ] Profil connection graph içinde iki gerçek anchor referansını saklayacak.
- [ ] Bağlı modül hareket ettiğinde profil yeniden hesaplanacak veya açık invalid-state oluşacak.

**Sprint çıkışı:** Profil koordinat hack'iyle değil gerçek iki anchor üzerinden üretilecek ve state'te ilişki korunacak.

---

## Sprint 5 — 4.6 Custom Module Library / yaşam döngüsü

- [ ] Create / edit / duplicate / rename / delete.
- [ ] Ad, kategori, açıklama, base module referansı ve parametrik config.
- [ ] Base modüller read-only.
- [ ] `Base Modüller` / `Custom Modüller` katalog ayrımı.
- [ ] `CustomModuleRepository` contract.
- [ ] Local/browser persistence adapter; business logic doğrudan `localStorage` API'sine bağlanmayacak.
- [ ] Custom definition silinse/değişse bile sahnedeki eski instance'ların açılabilmesi için snapshot/version yaklaşımı.

**Sprint çıkışı:** Custom modüller local adapter üzerinden kalıcı yönetilebilecek ve repository implementasyonu değiştirilebilir olacak.

---

## Sprint 6 — 4.8 Project Save/Load + Versioning

- [ ] Definition ile scene instance ayrımı proje dosyasında korunacak.
- [ ] Parametrik instance snapshot saklanacak.
- [ ] Schema version proje state'ine yazılacak.
- [ ] Migration/fallback stratejisi.
- [ ] Custom definition silinmiş/değişmiş olsa bile eski proje mümkün olduğunca render edilecek.
- [ ] Anchor/connection graph save/load round-trip sonrasında kaybolmayacak.
- [ ] Connection semantics (`INNER_CORNER`, `INLINE_JOIN`, vb.) export/import sonrasında aynı kalacak.
- [ ] Panel/yüzey gerçek ölçü metadata'sı kaybolmayacak.

**Sprint çıkışı:** Parametrik/custom proje save → close/reload → load sonrasında aynı yapısal state ve bağlantıları koruyacak.

---

## Sprint 7 — 4.9 Regresyon + BOM-readiness + FAZ 4 kapanışı

### Test kapsamı

- [ ] Ölçü constraint ve validation testleri.
- [ ] Raflı duvar ve LED state testleri.
- [ ] Wizard/live preview/save-load regresyonu.
- [ ] Anchor compatibility ve snap testleri.
- [ ] İç köşe tespit testleri.
- [ ] Inline/modül birleşimi tespit testleri.
- [ ] Tekli / köşe / çiftli bağlantı semantiği testleri.
- [ ] Normal panel / iç-köşe panel ölçü seçimi testleri.
- [ ] İki noktalı profil testleri.
- [ ] Custom library lifecycle testleri.
- [ ] Project save/load round-trip testleri.
- [ ] Mevcut base modüllerde renk, görsel, cam, selection, drag/drop, snap ve placement regresyonu olmayacak.
- [ ] `npm test` ve `npm run build` temiz olmadan FAZ 4 kapanmayacak.

### Gerçek üretim doğrulaması

- [ ] Elle çıkarılmış gerçek malzeme Excel'i source-of-truth kabul edilerek seçili gerçek projeler otomatik sonuçla karşılaştırılacak.
- [ ] Sistem Excel'e uydurulmayacak; fark varsa bağlantı/recipe algoritması incelenecek.
- [ ] Havrano gibi gerçek bir projede sistem manuel köşe işaretlemesi olmadan bağlantı tiplerini çözebilmeli.
- [ ] Sistem doğru panel ailesini/ölçüsünü connection graph üzerinden seçebilmeli.

### FAZ 4 kapanış kabulü

Sistem bir projeyi açtığında en azından aşağıdaki üretim bilgisini kayıpsız ve deterministik sunabilecek durumda olmalı:

- Modül instance kimliği ve parametrik ölçüleri.
- Gerçek panel/yüzey ölçüleri.
- `sourceAnchor -> targetAnchor` connection graph.
- İç köşe / inline birleşim gibi üretim semantiği.
- Gelecekte BOM recipe'nin çalışması için gereken part/catalog referansları.

FAZ 4'te nihai fiyat/maliyet hesabı yapılmaz.

---

# 4.7 — FAZ 4 sonrası entegrasyon kapısı: Fair CRM / Kyrox Core

4.7 bilinçli olarak çekirdek Sprint 1–7 sonrasındadır.

- Authentication/session kaynağı Kyrox Core.
- Fair Stand içinde ikinci login/kullanıcı/organizasyon sistemi kurulmayacak.
- Custom module ownership backend'de Core/Fair CRM kimliğiyle ilişkilendirilecek.
- `CustomModuleRepository` local adapter yerine production backend adapter kullanabilecek.
- Ownership/authorization server-side doğrulanacak.
- Organization/permission gerekiyorsa mevcut Kyrox Core modeli kullanılacak.
- Local ve backend repository adapter arasında contract testleri olacak.

---

# FAZ 5 ve FAZ 6 devamı

FAZ 4 bütün ürün/maliyet işini kendi içine çekmez. Sonraki fazlar korunur:

## FAZ 5 — Otomatik miktar ve maliyet çıkarma

- Sahne objeleri ve yüzeylerden ticari miktar üretimi.
- Fair CRM catalog ID eşlemesi.
- `adet`, `m`, `m²`, `kg`, `set` vb. birimler.
- Fire, minimum sipariş, işçilik ve proje seviyesi ek maliyet kuralları.
- Fair CRM'den fiyat/maliyet alarak costing output üretimi.

## FAZ 6 — Assembly-aware gerçek üretim BOM'u

- BOM Recipe modeli.
- Instance bazlı Raw BOM.
- Connection graph üzerinden ortak dikme/profil/aparat analizi.
- Shared-part deduction / merge.
- Kesim/ölçü normalization.
- Final BOM ve traceability.
- Panel yüzeyi / baskı / kaplama ilişkisi.
- Fair CRM'e revision-aware BOM aktarımı.

FAZ 5–6 ayrıntılı planı: `ROADMAP_PHASE_5_6.md`.

---

# Kısa referans — yürütme sırası

1. **4.1 — Parametrik Core / Rule Engine**
2. **4.2 + 4.3 — Custom Wizard + Raflı Duvar pilotu**
3. **4.4 — Anchor / Connection Graph + gerçek bağlantı semantiği**
4. **4.5 — İki Noktalı Kayıt/Profil aracı**
5. **4.6 — Custom Module Library + repository contract**
6. **4.8 — Project Save/Load + versioning + connection persistence**
7. **4.9 — Regresyon + gerçek proje/Excel doğrulaması + BOM-readiness**
8. **4.7 — Fair CRM / Kyrox Core entegrasyon kapısı**
9. **FAZ 5 — Miktar / costing**
10. **FAZ 6 — Assembly-aware production BOM**
