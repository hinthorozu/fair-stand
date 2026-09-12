# A13 — Depolama / varlıklar / referanslar denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Depolama haritası

- `src/projectStore.js`: IndexedDB proje kayıtları.
- `src/assetStore.js`: IndexedDB görüntü blob'ları.
- Veritabanı: `fair-stand-configurator`, DB sürüm 2.
- Depolar: `projects`, `image-assets`; varlık dizini: `projectId`.
- Normal varlık ID'leri üretilir; içe aktarılan varlıklar taze ID alır ve proje durumu referansları yeniden eşlenir.

## Bulgular

### F-032 — P2 — IndexedDB şema/migrasyon sahipliği çoğaltılmıştır

`projectStore.js` ve `assetStore.js` her biri aynı DB adı/sürüm/depo adlarını tanımlar ve her biri bağımsız bir `openDb()` / `onupgradeneeded` uygulamasını sahiplenir. Şu anda uyuşurlar, ancak gelecekteki bir şema değişikliği bir modülü diğeri olmadan güncelleyebilir ve sıraya-bağımlı migrasyon davranışı üretebilir.

### F-033 — P2 — yaklaşık 30.64 MiB park edilmiş/referanssız public varlık üretimle birlikte gider

Taban ağacında depo `public/` ayak izi yaklaşık **64.91 MiB**. Üç büyük varlık bu tabanda aktif çalışma zamanı girdisi değildir:

- `public/models/indoor_plants2.glb` — 22,018,072 bayt; testler açıkça olası gelecek kullanım için park edilmiş olarak sınıflandırır.
- `public/models/bar_chair2.glb` — 2,451,300 bayt; aktif kaynak referansı bulunmadı.
- `public/textures/exhibition-floor.jpg` — 7,662,003 bayt; aktif kaynak referansı bulunmadı.

Toplam: 32,131,375 bayt ≈ **30.64 MiB**. Vite `public/` içeriğini üretim çıktısına kopyaladığı için, park edilmiş dosyalar tembel/referanssız olsa bile dağıtım yüküdür. `exhibition-floor-optimized.jpg` bu bulguya **dahil değildir**: `scene3d.js` onu aktif yükler.

### F-034 — P2 — public varlık köken/lisans envanteri eksiktir

Depo meta verisi Bar Stool, Coat Rack, Eames Chair ve Kettle için atıf dosyaları içerir. Diğer birkaç aktif model ailesinin depo ağacında bitişik atıf/köken kaydı yoktur (örneğin mini fridge, sofa, iç mekan bitkisi/uzun-saksı ve sarmaşık ayırıcı varlıkları). Bu denetim lisans ihlali iddia etmez; depo-düzeyi kökenin şu anda tekdüze kanıtlanamadığını kaydeder.

## Kontrol listesi sonuçları

- A13.01 DB depoları/dizin/sürüm: güncel şekil için `AUDITED_OK`; sahiplik çoğaltması F-032.
- A13.02 proje/varlık sahipliği: incelenen CRUD yollarında `AUDITED_OK`; varlık okuma/silme projectId sahipliği kullanır.
- A13.03 içe aktarmalar arası çarpışma: güncel içe aktarma yolu için `AUDITED_OK`; varlıklar taze ID'lere yeniden eşlenir.
- A13.04 eksik varlık davranışı: renderer/model başarısızlık geri bildirimi F-024 ve küresel yüzeylenmeyen görüntü-referans yokluğu üzerinden `GAP`.
- A13.05 yetim temizleme: `DECISION_REQUIRED`; tüm-proje temizleme vardır, küresel yetim uzlaştırma yoktur.
- A13.06 public envanter: `AUDITED_OK` — tam ağaç incelendi.
- A13.07 public varlık sınıflandırması: `GAP` — F-033.
- A13.08 büyük/küçük harf duyarlı çalışma zamanı yolları: incelenen aktif referanslar için `AUDITED_OK`.
- A13.09 büyük-varlık dağıtım politikası: `GAP` — F-033.
- A13.10 atıf/lisans meta verisi: `GAP/DECISION_REQUIRED` — F-034.

Bölüm denetim durumu: **GAP**.
