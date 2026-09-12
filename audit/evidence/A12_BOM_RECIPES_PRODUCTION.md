# A12 — BOM / reçeteler / üretim parçaları denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Üretim-parça envanteri

`src/productionParts.js` kanonik parça kataloğudur. Güncel aileler şunları içerir:

- dikmeler: 346.5 / 99 / 49.5 cm
- profiller: 41.5 / 91 / 140.5 / 190 cm
- düz paneller: 48.5 / 98 / 147.5 / 197 cm
- iç-köşe panelleri: 42.5 / 92 / 142.5 / 192 cm
- ayırıcı paneller
- connector_start / connector_single / connector_double / connector_corner
- kapı 100
- raf parçaları + raf ayağı
- vitrin parçaları + cam raf
- banko üstleri
- baza üstleri

Üretim ölçüleri, `nominalModuleWidthCm` gibi alanlar üzerinden nominal modül genişliklerinden açıkça ayrılmıştır.

## Reçete envanteri

`moduleRecipes.js`, reçete-destekli katalog kümesi M001–M029 için kanonik reçete verisi içerir; şunlar dahil:

- düz duvarlar
- kapı
- raf 2/3 varyantları
- vitrin 2/3
- ayırıcılar
- düz/L bankolar
- base-wall
- baza

`systemDevelopmentContract.test.js` `bom.mode=recipe` diyen her sözleşmenin bir reçete çözdüğünü kanıtlar. Aile testleri birçok tam miktar/ölçü ve genişletilmiş parça meta verisini doğrular.

## Bulgular

### F-030 — P1 — kanonik proje-düzeyi Final BOM üreticisi yoktur

Depoda modül başına reçete bakma/genişletme ve üretim-yüklü `rawBomDebug` paneli vardır, ancak kanonik bir proje-durumundan-nihai-BOM toplama katmanı saptanmadı.

Bu nedenle sistem şu anda tüm kaydedilmiş projeyi alıp şunları belirleyici üretebilecek tek bir sahibe sahip değildir:

- toplanmış üretim parçaları,
- modül ticari kalemleri/dışlamaları,
- ilişki/köşe bağlayıcı ayarlamaları,
- çözülmemiş-politika tanıları.

`rawBomDebug.js` yerine geçmez: UI metnini ayrıştırarak bir seçili modül reçetesini gösterir.

Bu bir ürün/BOM tamamlama boşluğudur; doğrulanmış tekil reçetelerin yanlış olduğu iddiası değildir.

### F-031 — P1 — ilişki/köşe bağlayıcı parçaları modül ilişkilerinden türetilmez

Üretim kataloğu `connector_double` ve `connector_corner` tanımlar; bunlar doğası gereği ilişkileri/birleşimleri tanımlar. Güncel modül reçeteleri bunun yerine modül başına `connector_start` / `connector_single` miktarlarını gömer. Komşu modülleri/köşeleri inceleyip bağlayıcı donanımı uygun biçimde dönüştüren/paylaşılan-sayan bir proje ilişki geçişi saptanmadı.

Modül başına reçetelerin naif toplamının gerçek montajlı stand bağlayıcı BOM'una eşit olduğu varsayılamaz. Bu tam olarak A12.08'in keyfi yalıtılmış modül reçeteleri yerine ilişki mantığıyla üretilmesini istediği parça sınıfıdır.

Kanonik bir ilişki-BOM algoritması var olana kadar, Final BOM toplama üretim-tam sayılamaz.

## Kontrol listesi sonuçları

- **A12.01 parça ID'leri:** `AUDITED_OK` — kanonik envanter eşlendi.
- **A12.02 reçeteler:** mevcut reçete-destekli modüller için `AUDITED_OK`.
- **A12.03 reçete sözleşmeleri çözülür:** `AUDITED_OK` — sistem geliştirme sözleşme testi tarafından zorlanır.
- **A12.04 reçete-dışı açık politika:** görünürlük anlamında `AUDITED_OK`; 17 aktif modül açıkça `decision-required`, kök F-014.
- **A12.05 üretime-hazır decision-required kalamaz:** `GAP` — güncel eski aktif modüller F-014 altında çözülmemiş kalır; sınıflandırma uydurulmaz.
- **A12.06 reçete kaynağı:** `AUDITED_OK` — kanonik reçete bakma, UI dizeleri değil modül tipi/nominal genişlik/seçenekler kullanır. Yalnızca hata ayıklama gösterimi UI dizelerini ayrıştırır (F-025).
- **A12.07 nominal vs üretim:** productionParts/moduleRecipes veri modelinde `AUDITED_OK`; belgeleme çoğaltması F-001/F-003 olarak kalır.
- **A12.08 ilişki parçaları:** `GAP` — F-031.
- **A12.09 belirleyici proje BOM:** `GAP` — kanonik proje üreticisi yok, F-030.
- **A12.10 hata ayıklama yalıtımı:** `GAP` — F-025.
- **A12.11 testler:** mevcut reçete testleri tam doğrulanmış reçeteleri ve genişletilmiş meta veriyi kapsar; F-030/F-031 uygulanana kadar tüm-proje BOM/ilişki testi imkânsızdır. A18, kök bulguları çoğaltmadan eksik sistem-düzeyi regresyon kapsamını kaydeder.

Bölüm denetim durumu: **GAP / DECISION_REQUIRED**.
Sonraki denetim bölümü: **A13 — Depolama / varlıklar / referanslar**.
