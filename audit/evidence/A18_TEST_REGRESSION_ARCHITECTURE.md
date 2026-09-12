# A18 — Testler / regresyon mimarisi denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Gözlenen test mimarisi

- kanonik betik `node --test`.
- büyük bir `test/` paketi katalog, sözleşmeler, durum fabrikaları, reçeteler, yerleştirme, reflow, UI/denetleyici yardımcıları, sahne kaynak sözleşmeleri ve birçok modüle özel regresyonu kapsar.
- `tests/` altında iki eski test kalır (`autoDepot.test.js`, `moduleBehavior.test.js`).
- sistem geliştirme/change sözleşme testleri katalog sözleşmesini ve CI kablolamasını zorlar.
- son kanonik ROG CI `npm test` başarısını bildirir.

## Bulgu

### F-040 — P1 — gerçek tarayıcı E2E koşum takımı kritik kullanıcı iş akışlarını kapsamaz

Depoda `package.json` içinde Playwright/Cypress/Puppeteer/tarayıcı otomasyon bağımlılığı veya E2E çalıştırıcı yoktur ve depo ağacında tarayıcı-E2E paketi yoktur. `*Integration.test.js` adlı birkaç dosya, kaynak metni okuyup işleyicileri/içe aktarmaları regex-eşleyerek kablolamayı doğrular. Bunlar yararlı regresyon korumalarıdır, ancak DOM/tarayıcı/IndexedDB/WebGL davranışını uçtan uca kanıtlamaz.

Bu kök bulgu A19'u sahiplenir. Ayrıca tarayıcı API'lerinin önemli olduğu kalıcılık/içe aktarma/render/odak/performans iş akışlarında güveni sınırlar.

## Çapraz bağlı kapsam boşlukları

- F-022: her özel modül ailesi için tablo-güdümlü kaydet/yükle gidiş-dönüşü yok.
- F-020: proje-değiştirmeden-önce-bekleyen-otomatik-kayıt dayanıklılık durumu test edilmemiş.
- F-023: çok-depo silme atomikliği güncel birim testleriyle kanıtlanamaz.
- F-024: model yükleme başarısızlığı/kullanıcı yedeği tarayıcı-testli değil.
- F-036/F-037: bozuk/büyük içe aktarma sertleştirmesinin tarayıcı/entegrasyon kanıtı yok.

## Kontrol listesi sonuçları

- A18.01 test envanteri: `AUDITED_OK`.
- A18.02 katalog/modül sözleşme kapsamı: `AUDITED_OK`.
- A18.03 davranış/yerleştirme regresyon kapsamı: geniş olarak `AUDITED_OK`; gizli politika envanteri F-011 kalır.
- A18.04 durum fabrikası kapsamı: fabrikalar için `AUDITED_OK`; katmanlar-arası gidiş-dönüş F-022.
- A18.05 kalıcılık gidiş-dönüşü: `GAP` — F-022/F-040.
- A18.06 içe/dışa aktarma regresyonu: `GAP` — güncel testler kaynak-akış iddialarıdır, tarayıcı arşiv gidiş-dönüşü değil.
- A18.07 BOM sapması/bilinmeyen parçalar: reçete-destekli modüller için `AUDITED_OK`; nihai/ilişki BOM eksik F-030/F-031.
- A18.08 UI/denetleyici yardımcı testleri: birim/kaynak düzeyinde `AUDITED_OK`.
- A18.09 renderer davranışı: `GAP` — birçok kaynak-sözleşme testi, gerçek WebGL/tarayıcı render regresyonu yok.
- A18.10 tarayıcı duman/E2E: `GAP` — F-040.
- A18.11 tam paket CI'da belirleyici: güncel taban çalıştırmasında `AUDITED_OK`.
- A18.12 test organizasyonu: `GAP/P2` — `test/` artı eski `tests/`; change-gate test-yolu sorunu zaten F-007, yinelenen bulgu açılmadı.

Bölüm denetim durumu: **GAP**.
