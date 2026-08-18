# Fair Stand — FAZ 5–6 Roadmap

Bu belge, Fair Stand'in parametrik tasarım çıktısını Fair CRM maliyet altyapısına ve gerçek üretim BOM'una bağlayan sonraki iki fazı tanımlar.

## Mimari sınır ve çakışma kararı

- **FAZ 4** geometri, parametrik modül, anchor/connection graph, custom module definition ve project instance bilgisinin sahibidir.
- **FAZ 5** bu bilgiyi ticari/maliyet miktarlarına dönüştürür ve Fair CRM maliyet altyapısına bağlar.
- **FAZ 6** aynı sahne/connection graph üzerinden gerçek üretim BOM'unu üretir.
- Fair Stand içinde ikinci bir ürün/maliyet ana veri sistemi kurulmayacaktır. Ürün, malzeme, fiyat ve maliyet ana verisinin production sahibi **Fair CRM** olacaktır.
- Fair Stand geometriyi ve miktarı bilir; Fair CRM fiyatı/maliyeti bilir. Entegrasyon bu sınırı koruyacaktır.
- BOM yalnız `modül reçetesi × adet` olmayacaktır. Bağlantı grafiği okunarak ortak kullanılan dikme, profil, aparat vb. parçalar tekilleştirilecektir.
- Faz 4 anchor sistemi bu nedenle yalnız snap özelliği değildir; Faz 6 assembly-aware BOM için üretim ilişkilerinin kaynak verisidir.

---

# FAZ 5 — OTOMATİK MİKTAR VE MALİYET ÇIKARMA

## Amaç

Fair Stand projesinde kullanılan hazır ürünleri, parametrik elemanları ve yüzey uygulamalarını ölçülebilir ticari kalemlere dönüştürmek; Fair CRM'deki maliyet altyapısı üzerinden proje maliyetini otomatik hesaplayabilmek.

## 5.1 — Fair CRM maliyet ana verisi entegrasyonu

- [ ] Fair CRM tarafındaki maliyet sistemi tamamlandıktan sonra entegrasyon contract'ı tanımlanacak.
- [ ] Her maliyet kaleminin stabil bir external/catalog ID'si olacak; Fair Stand fiyatı kopyalamak yerine bu ID'yi referanslayacak.
- [ ] Desteklenen birimler en az `adet`, `m`, `m²`, `kg`, `set` olacak.
- [ ] Fair CRM; alış/maliyet fiyatı, gerekiyorsa satış fiyatı/markup, para birimi ve geçerlilik tarihinin sahibi olacak.
- [ ] Fair Stand proje snapshot'ı hesaplamanın hangi catalog/version/fiyat tarihiyle yapıldığını saklayabilecek.
- [ ] Fiyat bulunamayan kalemler sessizce `0` kabul edilmeyecek; `unpriced` olarak raporlanacak.

## 5.2 — Hazır sahne objelerinin otomatik miktarı

- [ ] Masa, sandalye, masa-sandalye takımı, bar taburesi, TV, depo içeriği, aydınlatma ve benzeri katalog objeleri maliyet kalemine bağlanabilecek.
- [ ] Sahnedeki instance sayıları otomatik aggregate edilecek.
- [ ] Aynı catalog ID'ye bağlı objeler tek maliyet satırında toplanabilecek.
- [ ] Custom varyasyonun maliyet kimliği base objeden miras alabilir veya açıkça override edilebilir.
- [ ] Silinen/gizlenen/projede aktif olmayan objelerin miktara dahil edilme kuralları net olacak.

## 5.3 — Yüzey ve m² hesabı

- [ ] Panel ve desteklenen yüzeyler gerçek fiziksel genişlik/yükseklik metadata'sı taşıyacak.
- [ ] Görsel/baskı uygulanan yüzeyler ayrı `printAreaM2` miktarı üretecek.
- [ ] Boya/renk uygulanan yüzeyler gerekiyorsa `paintAreaM2` miktarı üretecek.
- [ ] Cam, standart panel, özel kaplama vb. yüzey türleri ayrı miktar kategorilerine ayrılabilecek.
- [ ] Hesap yalnız bounding-box alanına güvenmeyecek; hangi panel yüzünün gerçekten uygulama aldığı bilinecek.
- [ ] Tek yüz / çift yüz uygulama ayrımı desteklenebilecek.
- [ ] Kesilmiş/parametrik panel ölçüsü değiştiğinde m² otomatik yeniden hesaplanacak.
- [ ] m² değerlerinde UI yuvarlaması ile hesap motorunun hassas değeri ayrılacak; maliyet ham hassas değer üzerinden hesaplanacak.

## 5.4 — Fire, işçilik ve ek maliyet kuralları

- [ ] Malzeme bazlı fire oranı Fair CRM'den veya maliyet kuralından alınabilecek.
- [ ] Baskı/folyo/panel gibi kalemlerde minimum sipariş veya yukarı yuvarlama kuralı desteklenebilecek.
- [ ] İşçilik `adet`, `m`, `m²`, saat veya reçete bazlı ayrı maliyet kalemi olarak eklenebilecek.
- [ ] Nakliye, kurulum, elektrik vb. proje seviyesi ek maliyetler BOM malzemesinden ayrı tutulacak.
- [ ] Otomatik hesap ile manuel ek maliyet aynı satır türü gibi karıştırılmayacak; kaynağı raporda görülecek.

## 5.5 — Costing output

- [ ] Proje için `quantity breakdown` üretilecek.
- [ ] Her satırda kaynak (`scene object`, `surface`, `BOM`, `manual`), miktar, birim ve Fair CRM catalog ID bulunacak.
- [ ] Fair CRM fiyatlarıyla toplam maliyet hesaplanacak.
- [ ] Fiyatı eksik kalemler ve validation sorunları ayrıca gösterilecek.
- [ ] Hesap tekrar çalıştırıldığında aynı proje state + aynı fiyat snapshot'ı deterministik sonuç vermeli.

---

# FAZ 6 — ASSEMBLY-AWARE BOM / ÜRETİM LİSTESİ

## Amaç

Sahnedeki modülleri yalnız görsel objeler olarak değil, gerçek üretim assembly'leri olarak okuyup; dikme, yatay kayıt, panel, profil, bağlantı aparatı ve diğer fiziksel parçaların doğru toplam listesini üretmek.

## 6.1 — BOM Recipe modeli

- [ ] Üretilebilir base/parametrik modüller bir `BOM Recipe` / eşdeğer üretim reçetesi tanımlayabilecek.
- [ ] Reçete sabit adetlerin yanında parametrik formüller destekleyecek.
- [ ] Reçete çıktısı en az `partId`, `quantity`, `unit`, `dimensions`, `material/catalogRef` ve paylaşılabilirlik/connection semantics bilgisini taşıyacak.
- [ ] Profil gibi lineer parçalar adet yanında gerçek kesim uzunluğu üretebilecek.
- [ ] Panel gibi parçalar ölçü ve gerekirse m² üretebilecek.
- [ ] Custom modül BOM'u base recipe + parametrik config üzerinden deterministik üretilecek.
- [ ] Görsel Three.js mesh isimleri BOM anahtarı olarak kullanılmayacak; üretim parçası kimliği geometri implementation'ından bağımsız olacak.

## 6.2 — Raw BOM

- [ ] Her sahne instance'ı önce kendi bağımsız `Raw BOM` çıktısını üretecek.
- [ ] Örnek: dört adet 200 cm duvarın her biri kendi dikme/panel/kayıt/aparat ihtiyacını üretir.
- [ ] Raw BOM debug edilebilir olacak; final BOM'daki bir satırın hangi instance/reçetelerden geldiği izlenebilecek.

## 6.3 — Connection graph ve ortak parça analizi

- [ ] Faz 4 anchor/connection graph BOM motorunun girdisi olacak.
- [ ] Yan yana bağlı iki modülün fiziksel olarak aynı dikme/profil/aparatı paylaşıp paylaşmadığı connection semantics üzerinden belirlenecek.
- [ ] Yalnız koordinatların yakın olması ortak parça düşmek için yeterli sayılmayacak.
- [ ] Bağlantı türleri `shared-upright`, `shared-connector`, `butt-joint`, `corner-joint`, `independent` vb. üretim anlamları taşıyabilecek.
- [ ] Köşe birleşimi, T birleşimi ve düz devam birleşimi farklı normalization kuralı tanımlayabilecek.
- [ ] Bir parça birden fazla assembly tarafından paylaşılırsa tek fiziksel parça olarak sayılabilecek.
- [ ] Paylaşım kuralı olmayan parçalar güvenli varsayımla ayrı sayılacak; motor tahmin ederek eksiltme yapmayacak.

## 6.4 — Assembly normalization

Final üretim listesi şu pipeline ile üretilecektir:

`Scene Instances -> Raw BOM -> Connection Analysis -> Shared-Part Deduction/Merge -> Cut/Dimension Normalization -> Final BOM`

- [ ] Ortak dikme/aparatlar deduplicate edilecek.
- [ ] Birleşebilen lineer profil parçaları için üretim kuralı izin veriyorsa merge/cut optimizasyonuna hazırlık metadata'sı üretilecek.
- [ ] Aynı part ID fakat farklı ölçüdeki parçalar yanlışlıkla tek satıra toplanmayacak.
- [ ] Aynı part ID + aynı üretim ölçüsü uygun olduğunda aggregate edilecek.
- [ ] Final miktar hiçbir zaman negatif olamayacak; normalization invariant testleri olacak.
- [ ] Raw ve Final BOM farkı kullanıcı/debug raporunda açıklanabilecek: örn. `8 raw dikme - 3 shared = 5 final dikme`.

## 6.5 — 8 metre duvar kabul testi

- [ ] Referans senaryo: `4 × 200 cm duvar = 800 cm toplam duvar`.
- [ ] Dört modülün Raw BOM'u ayrı ayrı hesaplanacak.
- [ ] Üç ara birleşim connection graph üzerinden analiz edilecek.
- [ ] Gerçek sistemde ortak kullanılan dikme/aparat varsa yalnız bir kez sayılacak.
- [ ] Final BOM; gerçek montaj düzenindeki toplam dikme, panel, yatay kayıt/profil ve aparat adetlerini vermeli.
- [ ] Modüllerden biri ayrılır veya bağlantı tipi değiştirilirse Final BOM otomatik değişmeli.

## 6.6 — Yüzey/BOM ilişkisi

- [ ] Final BOM'daki panel parçaları sahnedeki yüzey uygulamalarıyla ilişkilendirilebilecek.
- [ ] Hangi fiziksel panelin baskı/renk/cam/kaplama gerektirdiği üretim listesinde gösterilebilecek.
- [ ] Baskı alanı Faz 5 miktar motoruna m² olarak aktarılacak.
- [ ] Aynı panelin iki yüzüne farklı uygulama yapılmışsa üretim/maliyet çıktısı bunu kaybetmeyecek.

## 6.7 — Fair CRM'e BOM aktarımı

- [ ] Final BOM satırları Fair CRM malzeme/catalog ID'leriyle eşleştirilecek.
- [ ] Fair CRM BOM miktarlarını fiyatlandırabilecek; Fair Stand maliyet fiyatının source-of-truth'u olmayacak.
- [ ] Fair CRM tarafına aktarımda proje/revision ID bulunacak; hangi tasarım revizyonundan BOM üretildiği izlenebilecek.
- [ ] Tasarım değişince eski BOM sessizce overwrite edilmek yerine revision/audit yaklaşımıyla yönetilebilecek.
- [ ] Eksik catalog eşleşmeleri aktarım öncesi raporlanacak.

## 6.8 — Test ve doğrulama

- [ ] Tek modül recipe testleri.
- [ ] Parametrik ölçü değişiminde BOM testleri.
- [ ] Düz duvar zinciri shared-part testleri.
- [ ] Köşe ve T bağlantı normalization testleri.
- [ ] Profil uzunluğu/kesim ölçüsü testleri.
- [ ] Panel m² ve tek/çift yüz uygulama testleri.
- [ ] Connection kaldırma/ekleme sonrası BOM yeniden hesaplama testleri.
- [ ] Raw BOM -> Final BOM traceability testleri.
- [ ] Fair CRM catalog eşlemesi ve eksik fiyat/malzeme testleri.

---

# FAZ 4 için ileriye dönük zorunlu metadata

Faz 5–6'da Faz 4'ü yeniden yazmamak için aşağıdaki bilgiler Faz 4 implementasyonunda korunmalıdır:

- Her base/custom modül ve sahne instance'ı stabil kimlik taşımalı.
- Anchor'lar yalnız koordinat değil **connection semantics** taşımalı.
- Fiziksel panel/yüzeyler gerçek ölçü ve yüz kimliği taşımalı.
- Parametrik config, BOM recipe'nin tekrar hesaplanabileceği şekilde saklanmalı.
- Modül definition ile scene instance ayrımı korunmalı.
- Sahne bağlantıları save/load sonrasında aynı graph olarak geri kurulabilmeli.
- Üretim parçası/catalog referansları Three.js mesh adlarından bağımsız olmalı.

Bu maddeler Faz 4'te BOM hesaplamasını implement etmek anlamına gelmez; yalnız ileride BOM/maliyet entegrasyonunu engelleyecek veri kaybını önler.

---

# Önerilen toplam geliştirme sırası

1. **FAZ 4:** Parametrik çekirdek + Rule Engine.
2. **FAZ 4:** Wizard + Raflı Duvar pilotu.
3. **FAZ 4:** Anchor/connection graph.
4. **FAZ 4:** İki noktalı kayıt/profil aracı.
5. **FAZ 4:** Custom library + project snapshot/versioning.
6. **FAZ 4:** Fair CRM/Kyrox Core kullanıcı sahipliği entegrasyonu.
7. **Fair CRM:** maliyet/malzeme ana veri altyapısının tamamlanması.
8. **FAZ 6 çekirdeği:** BOM Recipe + Raw BOM + assembly normalization. Doğru miktar bilinmeden doğru maliyet hesaplanmayacağı için BOM çekirdeği costing'den önce tamamlanır.
9. **FAZ 5:** hazır obje miktarı + yüzey m² + BOM miktarlarını Fair CRM fiyatlarıyla maliyetlendirme.
10. **FAZ 6:** gelişmiş üretim listesi, traceability, revision ve Fair CRM BOM aktarımı.
11. **Kapanış:** uçtan uca `tasarım -> miktar -> Final BOM -> maliyet -> teklif/üretim` doğrulaması.

## Neden FAZ 6'nın çekirdeği FAZ 5 maliyetinden önce?

İşlevsel ürün sırası kullanıcı açısından maliyet sonra BOM gibi görünebilir; fakat teknik bağımlılık tersidir. Maliyet motoru doğru miktara ihtiyaç duyar. Masa/TV gibi hazır objelerde miktar doğrudan sayılabilir; ancak duvar, profil, panel ve aparatta doğru miktar assembly-aware BOM'dan gelir. Bu nedenle BOM'un **recipe + normalization çekirdeği** önce kurulur, ardından Fair CRM maliyet motoru bu miktarları fiyatlandırır.
