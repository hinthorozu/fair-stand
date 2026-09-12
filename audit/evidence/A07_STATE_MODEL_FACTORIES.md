# A07 — Durum modeli + fabrikalar denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Proje düzeyi kalıcı durum envanteri

`buildProjectSnapshot()` kalıcılaştırır:

- `id`
- `name`
- `version` (şu anda sabit `1`)
- `createdAt`
- `stand`
- `modules`

Stand durumu şu anda şu alanları taşır:

- stand tipi ve ölçüleri
- kurulumun döndürdüğü türetilmiş sahne ölçüleri
- zemin tipi / isteğe bağlı zemin rengi
- otomatik depo yapılandırması

Modül durumu çalışma zamanı tipine göre çok biçimlidir. Ortak alanlar arasında modül `id`, `type`, ölçüler, isteğe bağlı `catalogKey`, isteğe bağlı `placement` vardır; özelleşmiş aileler düzenlenebilir yüzeyler/şeritler/yüzler, model meta verisi, aydınlatma, medya geometrisi, illuminated-foam varlık/hale verisi vb. ekler.

## Bulgular

### F-017 — P2 — renderer kalıcı düzenlenebilir durumun doğrudan mutasyonlarını sahiplenir

**Alanlar:** state, renderer, architecture, persistence

Mimari kurallar, durumun kalıcı/düzenlenebilir ürün durumunu taşıdığını ve renderer'ın kalıcı-kural sahibi olmak yerine onu görselleştirdiğini söyler.

Güncel sahne yüzeyleri durum nesnelerine (`surfaceState`) referans tutar ve `scene3d` metodları renk, görüntü atama/kaldırma, cam/kumaş/mesh durumu ve ilgili görüntü dönüşümleri dahil işlemler için kalıcı alanları doğrudan değiştirir. Main genellikle bir durum-alanı mutasyon API'si yerine bu renderer metodlarını çağırır.

Bu çalışır çünkü renderer nesneleri, sonra `buildProjectSnapshot()` tarafından serileştirilen aynı durum nesnelerine referans verir, ancak mutasyon sahipliği `main.js`, `designState.js` yardımcıları ve `scene3d.js` arasında bölünmüştür. Bir renderer yeniden düzenlemesi bu nedenle kalıcılık semantiğini sessizce değiştirebilir.

Bu bulgu yapısal/sahipliktir; güncel kaydedilen değerlerin kaybolduğunun kanıtı değildir.

### F-018 — P2 — yapısal panel sayısı katalog geometrisi ile durum fabrikası arasında çoğaltılmıştır

`catalog.js:STAND_DIMENSIONS.stripCount` şu anda 7'dir. `designState.js` bağımsız olarak `STRIP_COUNT = 7` bildirir ve durum fabrikaları bunu düz paneller, raflar, vitrinler ve base-wall şeritleri için kullanır; kapı durumu üç üst panelini ayrı olarak sabit 4..6 dizinlerinden türetir.

Renderer `STAND_DIMENSIONS.stripCount/stripHeight` okurken durum fabrikaları kendi 7'sini okur. Değerler bugün uyuşur, ancak gelecekte tek taraflı bir geometri değişikliği, render edilen panellere göre eksik veya fazla kalıcı panel durumu yaratabilir.

### F-019 — P1 — katalog ölçüleri birden fazla durum fabrikasında çoğaltılmış/sabit kodlanmıştır

Birkaç durum fabrikası tanımlayıcı ölçülerinin bir kısmını/tümünü yok sayar ve aynı ürün sayılarını bağımsız yeniden oluşturur; örneğin mobilya, mini-fridge, kettle, coat-rack, base/base-wall derinlik/yükseklikleri ve LED floodlight. `createCatalogModuleState()` sonra bu sabit fabrikaları çağırır.

Sonuç olarak yetkili bir katalog tanımlayıcısını değiştirmek, kalıcı yerleştirme/render durumunu eski fabrika ölçülerinde bırakabilir. Bazı aileler (TV, uzun saksı, ayırıcı) zaten tanımlayıcı verisi geçirir ve daha güvenli kalıbı gösterir, ancak kapsam tutarsızdır.

Bu, kasıtlı nominal-vs-fiziksel-vs-BOM ayrımından farklıdır: bu çoğaltılmış değerler çalışma zamanı modül durum ölçüleri olarak kullanılır ve ayrı bir fiziksel geometri kaynağı olarak açıkça etiketlenmez.

## Kontrol listesi sonuçları

- **A07.01 proje alanları:** `AUDITED_OK` — yukarıdaki envanter.
- **A07.02 modül alanları:** `AUDITED_OK` — tüm güncel durum aileleri/fabrikaları incelendi; aile başına şekiller `designState.js` içinde açıktır.
- **A07.03 tek sahip/varsayılan:** `GAP` — F-017, F-018, F-019.
- **A07.04 tam varsayılanlar:** içerde oluşturulan güncel modüller için `AUDITED_OK`; fabrikalar desteklenmeyen raf/banko/kapı boyutlarını reddeder ve gerekli düzenlenebilir yüzey durumunu oluşturur.
- **A07.05 çalışma-zamanı-türetilmiş kalıcılık:** `GAP/P2 gözlem` — kurulum anlık görüntüsü X/Y ve çevreden türetilebilir `sceneWidthM/sceneDepthM` tutar. Bu fazladır ancak henüz ayrı bulgu verilmedi; A08/A14 şema denetimi normalizasyon/sürümlendirmenin tehlikeli olup olmadığını belirler.
- **A07.06 JSON'da renderer referansları:** `AUDITED_OK` — proje anlık görüntüsü düz stand/modülleri derin kopyalar; Three.js nesneleri, seçili yüzeyler, object URL'ler ve renderer referansları serileştirilmez.
- **A07.07 eski/eksik alanlar:** `GAP` — geri yükleme yalnızca `catalogKey` onarımı yapar; merkezi durum normalleştirici/şema taşıyıcı yoktur. Kök sınıflandırma, proje sürümü/şemasının denetlendiği A08/A14'e bırakılır.
- **A07.08 ID'ler:** iç oluşturma/çoğaltma için `AUDITED_OK` — varsa UUID; çoğaltma modül ve düzenlenebilir-yüzey ID'lerini yeniden üretir. İçe aktarma ID'leri A14'te denetlenir.
- **A07.09 durum olarak UI metni:** `AUDITED_OK` — etiketler/durum dizeleri sunumdur; birincil durum tipli alanlar/ID'ler kullanır.
- **A07.10 öngörülebilir mutasyon sahipliği:** `GAP` — F-017.

## Çapraz-alan referansları

- Fabrikalar dışında katalog kimliği ekleme: F-010/F-013.
- Gizli yerleştirme politikası: F-011.
- Proje şema/sürüm normalizasyonu: A08/A14, burada çoğaltma.

Bölüm denetim durumu: **GAP**.
Sonraki denetim bölümü: **A08 — Kalıcılık / otomatik kayıt / proje yalıtımı**.
