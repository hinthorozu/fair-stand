# A10 — UI kontrolleri / girdiler / menüler / kısayollar / geri bildirim denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Statik UI envanteri

### Küresel/kenar çubuğu
- kenar çubuğu aç/kapa
- daraltılabilir `<details>` bölümleri

### Proje
- yeniden adlandır
- kaydedilmiş proje seç
- kaydet
- aç
- ZIP dışa aktar
- ZIP içe aktar + gizli dosya girdisi
- projeyi sil
- proje durumu/yükleme katmanı

### Stand kurulumu
- 5 stand tipi düğmesi
- X / Y sayı girdileri
- zemin seçimi
- otomatik-depo etkin onay kutusu
- depo boyutu seçimi
- depo içerikleri onay kutusu
- sahne oluştur

### Modül/düzenleyici
- modül kataloğunu aç
- duvarı temizle
- renk seçici
- rengi uygula
- HEX/RGB/CMYK girdileri
- illuminated-foam hale rengi
- görüntü yükleme
- varlık kitaplığı döşemeleri
- görüntü cover/contain/kaldır
- tüm modül özelliklerini sıfırla
- güncel görünümü render et

## Dinamik UI envanteri

- modül bağlam menüsü: sil, sola/sağa çoğalt, köpüğü yeniden boyutlandır, cam, lightbox kumaş, mesh, kumaş ışık, raf ışık, sola/sağa ekle
- modül katalog seçici + seçim kuyruğu/yeniden sıralama
- sürükleme-kenar-çubuğu/katalog önizleme
- varlık bağlam menüsü: illuminated foam / sil
- proje adlandırma iletişim kutusu
- illuminated-foam ölçü iletişim kutusu
- yardım kılavuzu
- görünüm küpü / sahne etkileşim kontrolleri
- seçim/durum geri bildirim gözlemcileri
- **ham BOM hata ayıklama paneli** şu anda çalışma zamanında enjekte edilir

## Bulgular

### F-025 — P1 — üretim giriş noktası görünür ham BOM hata ayıklama UI yükler

`index.html` koşulsuz `/src/rawBomDebug.js` içe aktarır. O modül hemen **“Üretim Listesi · Debug”** adlı açık bir kenar çubuğu kartı enjekte eder ve BOM'u insan-yüzlü `selection-info` metnini ayrıştırarak türetir.

Sonuçlar:

- hata ayıklama UI normal üretim paketi/çalışma zamanının parçasıdır,
- kullanıcı-yüzlü UI iç/eksik bir BOM yüzeyi açığa çıkarır,
- davranış kanonik seçili-modül kimliği yerine sunum dizelerini ayrıştırmaya bağlıdır,
- hata ayıklama kodu gerçek modül seçimi/sözleşmelerinden bağımsız sapabilir.

Bu yalnızca ölü kod değildir; her normal uygulama yüklemesinde çalışır.

### F-026 — P2 — kullanıcıya görünür standartlar/özellik olguları statik HTML metni olarak çoğaltılmıştır

`Standartlar` paneli, kanonik çalışma zamanı kaynaklarının zaten sahiplendiği ürün değerlerini sabit kodlar (yükseklik, derinlik, şerit sayısı/yüksekliği, genişlikler, ızgara, stand çevre, azami ölçüler). Otomatik-depo yardımcı metni de üretilen içerik listesini sabit kodlar.

Bu değerler güncel çalışma zamanıyla uyuşur, ancak UI bağımsız bir kopyadır. Kanonik bir değişiklik, çalışma zamanı farklı davranırken kullanıcının bayat kurallar okumasını bırakabilir.

Bu F-003'ten (yol haritası/belge çoğaltması) farklıdır: F-026 aktif ürün UI sapmasıdır.

### F-027 — P1 — “Duvarı temizle” eylemi yalnızca duvarı değil tüm sahne modüllerini siler

UI etiketi: `Duvarı temizle`.
Onay, güncel duvar/panel renklerini/görüntülerini silmeyi tanımlar.
Uygulama şunu yapar:

`currentModules = []`

sonra duvar sahnesini temizler. `currentModules` ayrıca serbest mobilya, depo ekipmanı, TV/overlay'ler ve üst fikstürler içerdiği için kontrol, etiketinin/onayının kullanıcıya söylediğinden önemli ölçüde daha fazlasını kaldırabilir.

Bu yıkıcı-eylem kapsam uyumsuzluğudur.

### F-028 — P1 — “Tüm Özellikleri Kaldır” illuminated-foam varken çalışamaz

Sıfırlama her güncel modülü `createCatalogModuleState(module,{preservePlacement:true})` üzerinden eşler ve herhangi bir sonuç null ise iptal eder.

`createCatalogModuleState()` katalog çalışma zamanı tiplerini işler, katalog-dışı `illuminated-foam` tipini değil. Bu nedenle bir illuminated-foam modülünün varlığı tüm sıfırlama işleminin “Bazı modül türleri ... döndürülemedi.” ile başarısız olmasına yol açar.

Bu, paralel fabrika dağıtıcı kök boşluğu F-010'un doğrudan sonucudur, ancak bağımsız kullanıcı-görünür bir hatadır ve kendi bulgusunu alır.

## Diğer kontrol listesi sonuçları

- **İşleyicisiz DOM kontrolü:** güncel index seçicileri arasında yetim statik kontrol saptanmadı.
- **Kontrolsüz işleyici:** eksik statik hedef saptanmadı; dinamik kontroller kendi sahip modüllerinde bağlamadan önce oluşturulur.
- **gizli/devre dışı durum:** sahne-bağımlı kontroller açıkça etkinleştirilir/devre dışı bırakılır; otomatik-depo bağımlı alanlar onay kutusu/durumdan senkronize olur.
- **yıkıcı onaylar:** proje silme, modül silme, duvarı temizle, sıfırlama ve yeni-proje değiştirme onay kullanır; F-027 yanlış bildirilmiş kapsamı belirler.
- **proje eylemleri:** kaydet/aç/içe aktar/dışa aktar için meşgul/yükleme durumu vardır; silmede catch/durum vardır.
- **modül bağlam yetenekleri:** cam/kumaş/mesh/raf/köpük kontrolleri bağlama göre koşullu gösterilir; yan ekleme F-015 altında davranış zorlamasını kaçırır.
- **UI yollarında katalog kimliği:** bağlam-seçici vs sürükleme-kenar-çubuğu kimlik uyumsuzluğu F-013'tür.
- **klavye etkileşimi:** kaynak-düzeyi eşleme vardır ve düzenlenebilir hedefler görünüm kısayolları için dışlanır; tam çatışma/odak/erişilebilirlik denetimi A16'dır.
- **dinamik UI testleri:** birkaç denetleyicinin birim/kaynak entegrasyon testleri vardır, ancak tam son-kullanıcı kapsamı A18/A19'dur.

Bölüm denetim durumu: **GAP**.
Sonraki denetim bölümü: **A11 — Özellik + sahne bileşimi / otomasyon**.
