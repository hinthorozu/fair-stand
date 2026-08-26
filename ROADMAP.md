# Fair Stand — Master Roadmap

> Bu dosya yalnız **üst seviye proje planını** tutar. Detaylı checklist ve teknik kararlar ilgili faz dosyalarındadır. Aynı iş iki roadmap içinde tekrar edilmez.

## Proje durumu

- **FAZ 1: KAPANDI — 10 Ağustos 2026**
- **FAZ 2: KAPANDI / YERLEŞİM MOTORU TEMELİ TAMAMLANDI**
- **FAZ 3: KAPANDI — 26 Ağustos 2026**
- **FAZ 4: AKTİF — Parametrik / Custom / Yapısal Editör**
- **FAZ 5: PLANLANDI — Assembly-Aware BOM / Gerçek Malzeme Listesi**
- **FAZ 6: PLANLANDI — Maliyet / Fair CRM Entegrasyonu**

---

# Mimari faz sınırı

## FAZ 4 — Parametrik ve Yapısal Editör

**Sahibi olduğu konular:**

- Parametrik Core / Rule Engine
- Base / Custom / Scene Instance ayrımı
- Custom Modül Wizard
- Raflı Duvar parametrik pilotu
- Anchor / Connection Graph
- İç köşe / inline birleşim gibi yapısal connection semantics
- İki nokta arasında kayıt/profil aracı
- Custom Module Library + repository contract
- Project save/load, snapshot, schema version, migration
- FAZ 5–6 için gerekli gerçek ölçü, yüz, part/catalog referansı ve connection metadata'sını kayıpsız taşıma

**FAZ 4'te yapılmaz:** nihai BOM/malzeme adedi, shared-part deduction, fiyat/maliyet, fire, işçilik.

Detaylı plan: **`ROADMAP_PHASE_4.md`**

---

## FAZ 5 — Assembly-Aware BOM / Gerçek Malzeme Listesi

**Sahibi olduğu konular:**

- Material/Part catalog contract
- BOM Recipe modeli
- 50/100/150/200 duvarların gerçek reçeteleri
- Düz panel / iç-köşe panel ailesi seçimi
- Tekli, köşe, çiftli ve başlangıç aparatlarının reçete hesabı
- Raw BOM
- Connection graph üzerinden gerçek parça seçimi
- Shared upright/profile/aparat normalization
- Final BOM
- Panel/yüzey m² miktarları
- Gerçek Excel ile otomatik BOM doğrulaması

**FAZ 5'te fiyat hesabı yapılmaz.** Çıktı doğru fiziksel malzeme ve miktar listesidir.

Detaylı plan: **`ROADMAP_PHASE_5_6.md`**

---

## FAZ 6 — Maliyet / Fair CRM Entegrasyonu

**Sahibi olduğu konular:**

- Fair CRM / Kyrox Core platform entegrasyonu
- Custom modül production ownership / authorization
- Fair CRM catalog ve fiyat source-of-truth entegrasyonu
- Hazır sahne objelerinin ticari miktarı
- Final BOM'un fiyatlandırılması
- Fire, minimum sipariş, işçilik, nakliye, kurulum, elektrik vb. ek maliyetler
- Costing engine
- Project/BOM/cost revision ve audit

**FAZ 6'nın girdisi FAZ 5 Final BOM'dur.** Doğru miktar tamamlanmadan nihai costing'e geçilmez.

Detaylı plan: **`ROADMAP_PHASE_5_6.md`**

---

# Aktif geliştirme sırası

1. **FAZ 4 / Sprint 1 — Parametrik Core + Rule Engine**
2. **FAZ 4 / Sprint 2 — Custom Wizard + Raflı Duvar**
3. **FAZ 4 / Sprint 3 — Anchor / Connection Graph**
4. **FAZ 4 / Sprint 4 — İki Noktalı Kayıt/Profil Aracı**
5. **FAZ 4 / Sprint 5 — Custom Module Library**
6. **FAZ 4 / Sprint 6 — Project Save/Load + Versioning**
7. **FAZ 4 / Sprint 7 — Regresyon + BOM-readiness kapanışı**
8. **FAZ 5 — BOM Recipe + Raw BOM + connection-based parça seçimi**
9. **FAZ 5 — Shared-part normalization + Final BOM + gerçek Excel doğrulaması**
10. **FAZ 6 — Fair CRM/Kyrox Core + catalog/fiyat entegrasyonu**
11. **FAZ 6 — Costing + fire/işçilik + revision/audit**

---

# Bugün doğrulanan üretim bilgileri

Aşağıdaki bilgiler artık ürün gereksinimi olarak kabul edilir; hesaplama implementasyonu FAZ 5'te yapılacaktır.

- Alüminyum dikme kalınlığı: **8 cm**
- Default dikme uzunluğu: **346.5 cm**
- Panel yüksekliği: **47 cm**
- Panel kalınlığı: **0.8 cm**
- Düz panel genişlikleri: **48.5 / 98 / 147.5 / 197 cm**
- İç-köşe panel genişlikleri: **42.5 / 92 / 142.5 / 192 cm**
- Üst/alt profil uzunlukları: **41.5 / 91 / 140.5 / 190 cm**
- Standın içine doğru 90° birleşim: **köşe bağlantı aparatı**
- Aynı doğrultuda iki ayrı modül birleşimi: **çiftli bağlantı aparatı**
- Standart panel dizisi bağlantısı: **tekli/düz bağlantı aparatı**
- Panel dizisi başlangıcı: **başlangıç aparatı**, yalnız başlangıçta kullanılır

Doğrulanmış 50 cm düz duvar reçetesi:

- 2 × 41.5 cm üst/alt profil
- 2 × 346.5 cm dikme
- 7 × 48.5 × 47 × 0.8 cm panel
- 2 × başlangıç aparatı
- 13 × tekli/düz bağlantı aparatı

100 / 150 / 200 cm düz duvarlarda adetler aynı; yalnız panel ve profil genişlikleri ilgili standart ölçülere göre değişir.

Köşe ve modül birleşimlerinin nihai adet reçeteleri gerçek üretim Excel'i tamamlanmadan varsayım olarak kodlanmaz.

---

# Kapanış checkpoint'i

FAZ 3 kapanış checkpoint commit'i:

`786672b5 — FAZ 3 Completed`

FAZ 4 geliştirmesi bu checkpoint sonrasından devam eder.
