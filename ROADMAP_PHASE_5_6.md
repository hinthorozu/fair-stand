# Fair Stand — FAZ 5–6 Roadmap

> **Tek kaynak:** Bu belge FAZ 5 ve FAZ 6'nın detaylı planıdır. FAZ 4 detayları `ROADMAP_PHASE_4.md` içindedir.

## Mimari sınır

Fazlar artık lineer ve çakışmasızdır:

1. **FAZ 4 — Parametrik ve Yapısal Editör:** doğru scene state, parametric config ve connection graph üretir.
2. **FAZ 5 — Assembly-Aware BOM / Malzeme Listesi:** FAZ 4 state'inden gerçek fiziksel parça ve miktar listesini üretir.
3. **FAZ 6 — Maliyet / Fair CRM Entegrasyonu:** FAZ 5'in kesin miktarlarını Fair CRM katalog/fiyat verisiyle fiyatlandırır.

Bu sıranın nedeni basittir: **doğru miktar bilinmeden doğru maliyet hesaplanamaz.**

Fair Stand geometriyi, bağlantıyı ve miktarı bilir. Fair CRM ürün/malzeme ana verisi, fiyat, maliyet ve ticari kuralların production source-of-truth'udur.

---

# FAZ 5 — ASSEMBLY-AWARE BOM / GERÇEK MALZEME LİSTESİ

## Amaç

Sahnedeki modülleri yalnız görsel objeler olarak değil gerçek üretim assembly'leri olarak okuyup; panel, dikme, yatay profil, raf, LED bileşeni ve bağlantı aparatlarının doğru fiziksel listesini üretmek.

FAZ 5'te **fiyat hesabı yapılmaz**. Çıktı doğru malzeme/miktar listesidir.

## 5.1 — Üretim Parçası / Material-Part Catalog Contract

- [ ] Stabil `partId` / `materialId` modeli.
- [ ] Birimler en az `adet`, `m`, `m²`, `kg`, `set`.
- [ ] Fiziksel ölçüler: uzunluk, genişlik, yükseklik/kalınlık gerektiği kadar açık metadata.
- [ ] İleride Fair CRM'e bağlanmak için opsiyonel `catalogRef` / external ID alanı.
- [ ] Three.js mesh adı hiçbir zaman üretim parçası kimliği olmaz.
- [ ] Aynı fiziksel parça farklı geometrik implementasyonlarda aynı `partId` ile temsil edilebilir.

## 5.2 — BOM Recipe modeli

- [ ] Üretilebilir base/parametrik modül bir `BOM Recipe` tanımlayabilir.
- [ ] Reçete sabit adet ve parametrik formülleri destekler.
- [ ] Recipe çıktısı en az `partId`, `quantity`, `unit`, `dimensions`, `catalogRef` ve connection/share semantics taşır.
- [ ] Profil gibi lineer parçalar gerçek kesim uzunluğu üretir.
- [ ] Panel gibi parçalar gerçek ölçü ve gerektiğinde m² üretir.
- [ ] Custom modül BOM'u base recipe + parametric config üzerinden deterministik hesaplanır.
- [ ] Aynı input aynı Raw BOM'u üretir.

## 5.3 — Doğrulanmış Duvar Üretim Verileri

Aşağıdaki bilgiler gerçek üretim verisi olarak doğrulanmıştır.

### Fiziksel standartlar

- Alüminyum dikme kalınlığı: **8 cm**.
- Default dikme uzunluğu: **346.5 cm**.
- Panel yüksekliği: **47 cm**.
- Panel derinliği/kalınlığı: **0.8 cm**.

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

### Doğrulanmış düz duvar reçetesi

50 cm düz duvar:

- 2 × 41.5 cm üst/alt profil,
- 2 × 346.5 cm dikme,
- 7 × 48.5 × 47 × 0.8 cm panel,
- 2 × başlangıç aparatı,
- 13 × tekli/düz bağlantı aparatı.

100 / 150 / 200 cm düz duvarda adetler aynıdır; yalnız profil ve panel genişliği ilgili tabloya göre değişir.

### Doğrulanmış aparat semantiği

- Standart panel dizisi bağlantısı → **tekli/düz bağlantı aparatı**.
- Standın içine doğru 90° yapısal birleşim → **köşe bağlantı aparatı**.
- Aynı doğrultuda iki ayrı modül birleşimi → **çiftli bağlantı aparatı**.
- Panel dizisi başlangıcı → **başlangıç aparatı**, yalnız başlangıçta kullanılır.

**Kural:** Köşe ve modül birleşimlerinin nihai adet reçeteleri gerçek üretim Excel/verisiyle doğrulanmadan tahmin edilip kodlanmaz.

## 5.4 — Raw BOM

- [ ] Her scene instance önce bağımsız Raw BOM üretir.
- [ ] Raw BOM hangi instance/recipe'den geldiğini izlenebilir tutar.
- [ ] Parametrik ölçü değiştiğinde Raw BOM otomatik değişir.
- [ ] Raflı duvar LED state'i LED şerit/profil/difüzör/kablo/driver gibi gerçek parçalara recipe üzerinden dönüşebilir.

## 5.5 — Connection Graph'tan Parça Seçimi

FAZ 4'ün `INNER_CORNER`, `INLINE_JOIN` ve anchor graph bilgisi burada gerçek malzeme kararına dönüşür.

- [ ] Sistem nominal duvar genişliğine tek başına bakarak panel seçmez.
- [ ] Connection semantics düz panel ile iç-köşe panel ailesi arasında doğru seçimi yaptırır.
- [ ] Örneğin 200 cm duvarda 197 × 47 veya 192 × 47 seçimi gerçek connection graph üzerinden yapılır.
- [ ] İç köşe için köşe bağlantı aparatı recipe'si uygulanır.
- [ ] Inline modül birleşiminde çiftli bağlantı aparatı recipe'si uygulanır.
- [ ] Standart panel dizisi içindeki bağlantılar tekli/düz aparat olarak hesaplanır.
- [ ] Başlangıç aparatı yalnız panel run başlangıcında hesaplanır.
- [ ] Görsel mesh görünümünden veya koordinat yakınlığı tahmininden BOM kararı verilmez.

## 5.6 — Shared-Part / Assembly Normalization

Pipeline:

`Scene Instances -> Raw BOM -> Connection Analysis -> Shared-Part Deduction/Merge -> Dimension Normalization -> Final BOM`

- [ ] Yan yana/köşe bağlantılarında gerçekten ortak kullanılan dikme/profil/aparat connection semantics üzerinden tespit edilir.
- [ ] Yalnız koordinatların yakın olması parça düşmek için yeterli değildir.
- [ ] `shared-upright`, `shared-connector`, `corner-joint`, `inline-joint`, `independent` gibi üretim semantiği gerektiği kadar tanımlanır.
- [ ] Ortak fiziksel parça yalnız bir kez sayılır.
- [ ] Paylaşım kuralı doğrulanmamışsa güvenli varsayımla ayrı sayılır; motor tahmin ederek eksiltmez.
- [ ] Aynı `partId` fakat farklı ölçüdeki parçalar yanlışlıkla merge edilmez.
- [ ] Aynı `partId + aynı üretim ölçüsü` uygun olduğunda aggregate edilir.
- [ ] Final miktar negatif olamaz.
- [ ] Raw → Final farkı açıklanabilir olur: ör. `8 raw dikme - 3 shared = 5 final dikme`.

## 5.7 — Yüzey / Panel Miktarları

- [ ] Fiziksel panel/yüzey gerçek ölçüsünden `areaM2` üretilebilir.
- [ ] Baskı/görsel uygulanan yüz `printAreaM2` üretebilir.
- [ ] Boya/kaplama için ayrı miktar kategorileri desteklenebilir.
- [ ] Tek yüz / çift yüz ayrımı korunur.
- [ ] Cam, standart panel, özel kaplama gibi yüzey tipleri ayrıştırılır.
- [ ] Hesap yalnız bounding box'a dayanmaz; gerçek yüz kimliği kullanılır.
- [ ] UI yuvarlaması ile motorun hassas miktarı ayrıdır.

## 5.8 — Gerçek Proje / Excel Doğrulaması

Elle çıkarılmış gerçek malzeme Excel'i üretim source-of-truth olarak kullanılacaktır.

- [ ] Seçilen gerçek proje state'i otomatik BOM ile hesaplanır.
- [ ] Aynı proje için elle hazırlanmış Excel ile satır satır karşılaştırılır.
- [ ] Fark varsa Excel'i sisteme uydurmak yerine connection/recipe/normalization algoritması incelenir.
- [ ] Havrano gibi gerçek projelerde manuel köşe işaretlemesi olmadan panel ve aparat seçimi yapılabilmeli.
- [ ] 50/100/150/200 düz duvar referans testleri.
- [ ] İç köşe testleri.
- [ ] Inline modül birleşim testleri.

## 5.9 — Referans Kabul: 4 × 200 cm Duvar

- [ ] `4 × 200 cm = 800 cm` duvar zinciri dört ayrı scene instance olarak bilinmeli.
- [ ] Üç ara birleşim connection graph üzerinden analiz edilmeli.
- [ ] Her instance bağımsız Raw BOM üretmeli.
- [ ] Shared parça kuralları gerçek üretim reçetesine göre normalize edilmeli.
- [ ] Final BOM gerçek toplam panel, dikme, yatay profil ve aparat miktarını vermeli.
- [ ] Bir bağlantı kaldırıldığında Final BOM deterministik değişmeli.

## FAZ 5 kapanış kriteri

- [ ] Sahne → Raw BOM → connection normalization → Final BOM zinciri deterministik.
- [ ] Gerçek Excel ile seçilmiş referans projeler doğrulanmış.
- [ ] BOM satırları stabil part/catalog referansları taşıyor.
- [ ] Raw/Final traceability mevcut.
- [ ] `npm test` ve `npm run build` temiz.
- [ ] Fiyat/maliyet hesabı henüz yapılmıyor.

---

# FAZ 6 — MALİYET / FAIR CRM ENTEGRASYONU

## Amaç

FAZ 5'in doğrulanmış fiziksel miktarlarını Fair CRM'deki katalog, maliyet ve ticari kurallarla eşleştirerek proje maliyetini güvenilir şekilde hesaplamak.

Fair CRM fiyat/maliyet source-of-truth'udur. Fair Stand üretim fiyatı kopyalayıp ikinci bir ana veri sistemi oluşturmaz.

## 6.1 — Fair CRM / Kyrox Core Platform Entegrasyonu

- [ ] Fair Stand içinde ikinci login/kullanıcı sistemi yapılmaz.
- [ ] Authentication/session kaynağı Kyrox Core / mevcut platform olur.
- [ ] `CustomModuleRepository` backend adapter'ı local adapter contract'ıyla aynı davranışı sağlar.
- [ ] Custom modül ownership backend tarafında `ownerUserId` / eşdeğer kimlikle doğrulanır.
- [ ] Private / organization/shared visibility ileride aynı model üzerinden genişletilebilir.
- [ ] Authorization yalnız frontend filtresine bırakılmaz.
- [ ] Project/revision kimliği Fair CRM aktarımında korunur.

## 6.2 — Catalog / Malzeme Ana Veri Entegrasyonu

- [ ] Her maliyetlenebilir `partId` stabil Fair CRM catalog/external ID'ye eşlenir.
- [ ] Desteklenen birimler `adet`, `m`, `m²`, `kg`, `set` vb. ortak contract ile eşleşir.
- [ ] Fair CRM alış/maliyet fiyatı, satış/markup gerekirse, para birimi ve geçerlilik tarihinin sahibidir.
- [ ] Eksik catalog eşleşmesi sessizce geçilmez; açık `unmapped` durumudur.
- [ ] Eksik fiyat sessizce `0` kabul edilmez; açık `unpriced` durumudur.
- [ ] Hesap hangi catalog/version/fiyat snapshot'ıyla yapıldığını saklar.

## 6.3 — Hazır Sahne Objeleri

- [ ] Masa, sandalye, takım, bar taburesi, TV, depo içeriği, aydınlatma vb. hazır objeler catalog ID'ye bağlanabilir.
- [ ] Scene instance sayıları aggregate edilir.
- [ ] Aynı catalog ID tek ticari satırda toplanabilir.
- [ ] Custom varyasyon base catalog kimliğini miras alabilir veya açık override edebilir.
- [ ] Gizli/silinmiş/aktif olmayan instance miktar kuralları açık tanımlanır.

## 6.4 — Fire, İşçilik ve Ek Maliyet

- [ ] Malzeme bazlı fire oranı maliyet kuralından/Fair CRM'den gelebilir.
- [ ] Minimum sipariş ve yukarı yuvarlama kuralları.
- [ ] İşçilik `adet`, `m`, `m²`, saat veya recipe bazlı ayrı maliyet satırı olabilir.
- [ ] Nakliye, kurulum, elektrik vb. proje seviyesinde ayrı tutulur.
- [ ] Otomatik maliyet ile manuel ek maliyet kaynakları karıştırılmaz.

## 6.5 — Costing Engine

- [ ] Final BOM ve hazır obje/yüzey miktarlarından `quantity breakdown` oluşturulur.
- [ ] Her satır kaynak, miktar, birim, catalog ID ve fiyat snapshot'ı taşır.
- [ ] Fair CRM fiyatlarıyla toplam maliyet hesaplanır.
- [ ] Markup/satış fiyatı gerekiyorsa ayrı katmanda uygulanır.
- [ ] Aynı project state + aynı BOM + aynı fiyat snapshot'ı aynı sonucu üretir.
- [ ] Eksik fiyat/catalog/validation sorunları ayrı raporlanır.

## 6.6 — Revision / Audit

- [ ] Tasarım revizyonu ile BOM/maliyet revizyonu ilişkilidir.
- [ ] Yeni tasarım eski maliyeti sessizce overwrite etmez.
- [ ] Hangi revizyonun hangi fiyat snapshot'ıyla hesaplandığı izlenebilir.
- [ ] Fair CRM'e aktarım revision ID taşır.

## 6.7 — Test ve Kapanış

- [ ] Catalog eşleme testleri.
- [ ] Eksik catalog / eksik fiyat testleri.
- [ ] Birim dönüşümü ve m² hassasiyet testleri.
- [ ] Fire/minimum sipariş testleri.
- [ ] İşçilik ve proje ek maliyet testleri.
- [ ] Aynı snapshot için deterministik costing testi.
- [ ] Ownership/authorization contract testleri.
- [ ] Revision/audit testleri.

## FAZ 6 kapanış kriteri

- [ ] FAZ 5 Final BOM doğrulanmış miktar kaynağı olarak kullanılıyor.
- [ ] Fair CRM catalog/fiyat verisi source-of-truth.
- [ ] Eksik eşleşme ve fiyatlar görünür.
- [ ] Proje maliyeti deterministik ve revision-aware.
- [ ] Fair Stand içinde paralel fiyat/malzeme ana veri sistemi yok.
- [ ] `npm test` ve `npm run build` temiz.

---

# Toplam geliştirme sırası

1. **FAZ 4:** Parametrik Core / Rule Engine.
2. **FAZ 4:** Wizard + Raflı Duvar.
3. **FAZ 4:** Anchor / Connection Graph.
4. **FAZ 4:** İki noktalı profil aracı.
5. **FAZ 4:** Custom Library + Save/Load + Versioning.
6. **FAZ 4:** Regresyon ve BOM-readiness kapanışı.
7. **FAZ 5:** Part catalog contract + BOM Recipes.
8. **FAZ 5:** Raw BOM + connection-based parça seçimi.
9. **FAZ 5:** Shared-part normalization + Final BOM.
10. **FAZ 5:** Gerçek Excel/proje doğrulaması.
11. **FAZ 6:** Fair CRM/Kyrox Core platform + catalog entegrasyonu.
12. **FAZ 6:** Costing, fire, işçilik, revision/audit.
