# A14 — İçe aktarma / dışa aktarma / arşiv / proje şema denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Güncel arşiv akışı

Dışa aktarma, `project.json` artı `assets/<asset-id><ext>` içeren bir JSZip arşivi kurar. İçe aktarma tam arşivi yükler, temel manifest varlığını/şeklini doğrular, tüm blob'ları hazırlar, varlık ID'lerini yeniden eşler, sonra içe aktarılan projeyi ve varlıkları kalıcılaştırır. Depolama mutasyonundan sonraki başarısızlık varlıklar ve proje için geri alma dener.

## Bulgular

### F-035 — P2 — arşiv sürümü/şemasının kanonik sahibi yoktur

`archiveVersion: 1` dışa aktarma işleyicisinde sabit olarak yazılır ve içe aktarma işleyicisinde bağımsız olarak sabit `1` olarak kontrol edilir. Paylaşılan arşiv şema/sürüm modülü veya migrasyon kaydı yoktur. Bu arşive özgüdür ve proje-şema F-021'i tamamlar.

### F-036 — P1 — içe aktarılan proje durumu yapısal alan doğrulaması olmadan kalıcılaştırılır

İçe aktarma `manifest.project`'in bir nesne olduğunu ve boş-olmayan bir dize id'si olduğunu doğrular, ancak sonra sağlanan proje nesnesini yayar ve kalıcılaştırır. Depolama/geri yüklemeden önce şunları doğrulamaz:

- `stand` desteklenen bir stand şema/aralığıyla eşleşir,
- `modules` bir dizidir,
- modül tipleri/katalog kimlikleri desteklenir,
- yerleştirme alanları geçerlidir,
- ölçüler/döndürmeler sonludur ve hedeflenen kısıtlar içindedir,
- kalıcı özel alanlar modül/durum sözleşmelerine uyar,
- proje sürümü desteklenir/taşınabilir.

Bozuk veya gelecek/yabancı bir arşiv bu nedenle renderer/çalışma zamanı kodu ona rastlamadan önce kalıcı depolamaya girebilir.

### F-037 — P1 — ZIP/görüntü içe aktarma yollarının açık kaynak sınırları veya içerik politikası yoktur

Güncel içe aktarma yolunun arşiv boyutu, varlık sayısı, tekil sıkıştırılmamış varlık boyutu veya toplam sıkıştırılmamış bayt için yapılandırılmış sınırı yoktur. Her manifest varlığı `entry.async('blob')` ile genişletilir ve kalıcılıktan önce `preparedAssets` içinde tutulur. Normal görüntü yükleme benzer biçimde `accept="image/*"`e dayanır ve sağlanan Blob'u depo-düzeyi boyut/içerik izin listesi olmadan saklar.

Bu öncelikle bir kullanılabilirlik/depolama-sertleştirme boşluğudur, uzak kod çalıştırma kanıtı değildir.

## Olumlu kontroller

- Zorunlu `project.json` depolama mutasyonundan önce kontrol edilir.
- `archiveVersion` kontrol edilir.
- varlık listesi varsa dizi olmalıdır.
- yinelenen manifest varlık ID'leri reddedilir.
- listelenen her varlık yolu bir ZIP dosya girişine çözülmelidir.
- içe aktarılan varlıklar taze ID alır ve tüm `imageAssetId` referansları özyinelemeli yeniden eşlenir.
- arşiv proje kaydından önce tam hazırlanır.
- kayıt-sonrası başarısızlıklar içe aktarılan varlıklar + proje için temizlik dener.
- güncel JSZip 3.10.1, 3.8.0 yol-dolaşma düzeltme çizgisinden daha yenidir.

## Kontrol listesi sonuçları

- A14.01 kanonik arşiv şema/sürüm sahibi: `GAP` — F-035.
- A14.02 hedeflenen proje/varlıkları dışa aktar: güncel anlık görüntü + sahip olunan varlıklar için `AUDITED_OK`.
- A14.03 mutasyon-öncesi arşiv/dosya hazırlığı: güncel temel kontroller için `AUDITED_OK`.
- A14.04 proje şema/ID'ler/yollar: `GAP` — F-036.
- A14.05 başarısız içe aktarma temizliği: işleyici sözleşme düzeyinde `AUDITED_OK`; temizliğin kendisi ayrı çok-depo işlemleridir.
- A14.06 yinelenen proje ID: `AUDITED_OK` — taze proje ID atanır.
- A14.07 gidiş-dönüş sadakati: `GAP` — F-022; her modül/varlık ailesi için gerçek tarayıcı gidiş-dönüş sözleşmesi yok.
- A14.08 arşiv/varlık sınırları: `GAP` — F-037.
- A14.09 yol dolaşma/tuhaf dosya adları: kitaplık sürümünün yol sanitizasyon tabanı için `AUDITED_OK`; uygulama hâlâ bellek-içi ZIP içinde manifest yol-giriş eşlemesine güvenir.
- A14.10 geriye uyumluluk/migrasyon: `GAP` — F-021/F-035.

Bölüm denetim durumu: **GAP**.
