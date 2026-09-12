# A17 — Performans / paket / render yaşam döngüsü denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Taban

- `scene3d.js` yaklaşık 259 KB kaynaktır ve en büyük uygulama kaynak birimi olarak kalır.
- `main.js` yaklaşık 77 KB kaynaktır.
- `public/` tabanda yaklaşık 64.91 MiB'dir.
- o public ayak izinin en az yaklaşık 30.64 MiB'i F-033 altında park edilmiş/referanssız dağıtım yüküdür.
- Three.js kasıtlı olarak kararlı bir `three-vendor` derleme parçasına ayrılır ve Vite parça uyarı sınırı 650 KB olarak yapılandırılmıştır.
- düzenleyici piksel oranı sınırlıdır (1.0 kaba işaretçiler, aksi halde 1.5); yönlü gölge haritası 2048²'dir.

## Yaşam döngüsü gözlemleri

- sahne uygulama başlatmada bir kez oluşturulur; proje değiştirmeleri başka bir üst-düzey renderer oluşturmak yerine sahne/duvar durumunu yeniden kurar.
- fuar-salonu yeniden kurulumu değiştirilen geometriyi açıkça imha eder.
- zemin yardımcı imhası geometri/malzemeleri kaldırır.
- kumaş görüntü değiştirme, incelenen yollarda önceki doku haritalarını/kaynak dokuları imha eder.
- model yükleyici promise'leri, tekrarlanan GLB getirme/ayrıştırmayı önlemek için kasıtlı olarak model/dosya başına şablon önbellekler.
- incelenen mimaride somut bir proje-değiştirme yinelenen-dinleyici birikimi saptanmadı.

Bu denetim ekleme/silme/yeniden kurulum yollarında yeniden üretilebilir bir Three.js sızıntısı kurmadı, bu yüzden spekülatif sızıntı bulgusu açılmaz. Tarayıcı bellek profilleme hâlâ eksik E2E/performans enstrümantasyon boşluğunun parçasıdır.

## Kontrol listesi sonuçları

- A17.01 derleme/public ayak izi tabanı: `GAP` — public ayak izi kaydedildi, ancak CI üretim derleme-boyutu bütçesi/raporu yayımlamaz/saklamaz.
- A17.02 en büyük JS modülleri: envanter olarak `AUDITED_OK`; mimari yoğunlaşma F-010/F-011/F-017.
- A17.03 en büyük public varlıklar: `GAP` — F-033.
- A17.04 tekrarlanan ekleme/silme kaynak sızıntıları: `DECISION_REQUIRED` — kaynak imha yolları içerir; tarayıcı bellek regresyon kanıtı yoktur.
- A17.05 proje değiştirme işleyici/nesne birikimi: kaynak mimari düzeyinde `AUDITED_OK`; bir sahne örneği.
- A17.06 otomatik kayıt yazma hızı: denetleyici debounce/izleme tasarımı için `AUDITED_OK`; dayanıklılık sorunu F-020.
- A17.07 büyük görüntü/model işleme: `GAP` — F-033/F-037.
- A17.08 render/güncelleme döngüleri sınırlı: incelenen sürekli döngü/yapılandırma seçimleri için `AUDITED_OK`; ek proje-başına renderer döngüsü bulunmadı.
- A17.09 ölçülebilir performans regresyon koruması: `GAP` — otomatik tarayıcı perf/bellek bütçesi yok.

Bölüm denetim durumu: **GAP**.
