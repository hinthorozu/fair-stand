# A15 — Güvenlik / doğrulama / güven-sınırı denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## İncelenen girdiler/güven sınırları

- stand X/Y ve modül ölçü girdileri,
- proje adları,
- görüntü yüklemeleri,
- ZIP proje içe aktarma,
- IndexedDB kalıcı proje/modül durumu,
- public model/doku yolları,
- güncel doğrudan npm bağımlılıkları.

## Bulgular

### F-038 — P2 — bağımlılık/güvenlik taraması CI tarafından zorlanmaz

Kanonik CI change-contract doğrulaması, `npm ci`, birim/entegrasyon testleri ve üretim derlemesi çalıştırır. `npm audit` veya başka bir bağımlılık-danışma/SCA adımı çalıştırmaz ve incelenen iş akışında depo-yönetimli gizli/statik güvenlik taraması yoktur.

Güncel doğrudan bağımlılık nokta-kontrolü, sabitlenmiş doğrudan sürümlerde bilinen yamasız bir sorun göstermez: Vite 8.0.16, Haziran 2026 `server.fs.deny` sorunu için yamalı çizgidir ve JSZip 3.10.1 tarihsel 3.8.0 yol-dolaşma düzeltmesinden daha yenidir. Bu bulgu eksik tekrarlanabilir kapı hakkındadır; güncel kilit dosyasının savunmasız olduğu iddiası değildir.

## Çapraz bağlı boşluklar

- F-036: içe aktarılan proje/modül durumunun yapısal alan doğrulaması yoktur.
- F-037: ZIP/görüntü kaynak sınırları ve yükleme içerik politikası yoktur.
- F-032/F-023: depolama/çok-depo sahiplik/atomiklik riskleri.
- F-025: hata ayıklama yüzeyi normal ürün UI'da yüklenir.

## Olumlu kontroller

- proje adlandırma, proje adını çalıştırılabilir HTML'e yerleştirmek yerine DOM API'leri/textContent/value kullanır.
- proje-adı girdisi uzunluk-sınırlıdır.
- stand kurulum doğrulaması hedeflenen sayısal kurulum değerlerini kısıtlar.
- güncel public çalışma zamanı model yolları keyfi uzak URL'ler değil yerel uygulama varlıklarıdır.
- A00-A15 sırasında incelenen kaynak/yapılandırma dosyalarında işlenmiş gizli/kimlik bilgisi saptanmadı. Yükleyicideki alan/varsayılan yönetici e-postası kimlik bilgisi değil yapılandırma varsayılanlarıdır.

## Kontrol listesi sonuçları

- A15.01 kullanıcı-denetimli girdi envanteri: `AUDITED_OK`.
- A15.02 sayısal doğrulama: içe-aktarılan-durum güven sınırında `GAP` — F-036; normal stand kurulumunun açık doğrulaması vardır.
- A15.03 dosya yükleme tipi/içerik/boyut politikası: `GAP` — F-037.
- A15.04 arşiv ad alanı/yol kaçışı: JSZip sürüm tabanında `AUDITED_OK`; uygulama kodu tarafından dosya sistemi çıkarma yapılmaz.
- A15.05 kullanıcı dizeleri için güvenli olmayan HTML yutakları: incelenen proje/varlık adlandırma akışları için `AUDITED_OK`; statik şablon `innerHTML` vardır ancak o kullanıcı dizelerinden doldurulmaz.
- A15.06 dış URL/varlıklar: incelenen çalışma zamanı varlıkları için `AUDITED_OK`; yalnızca yerel paketlenmiş yollar.
- A15.07 çapraz-proje sınırları: kalıcılık/atomiklik bulguları F-020/F-023/F-032 için `GAP`; doğrudan çapraz-proje varlık okuması bulunmadı.
- A15.08 hata ayıklama açığa çıkarma: `GAP` — F-025.
- A15.09 bağımlılık danışma denetimi: `GAP` — F-038.
- A15.10 gömülü gizliler/özel uç noktalar: incelenen depo kaynağı için `AUDITED_OK`; gizli-tarama kapısı yoktur, F-038 ile kapsanır.

Bölüm denetim durumu: **GAP**.
