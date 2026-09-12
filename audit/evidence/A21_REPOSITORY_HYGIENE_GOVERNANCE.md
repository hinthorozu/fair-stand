# A21 — Depo hijyeni / yönetişim denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Güncel depo durumu

- GitHub görünürlüğü: **public**.
- Varsayılan dal: ROG.
- Denetim anında açık pull request: **0**.
- Denetim anında açık issue: **0**.
- Birçok tarihsel özellik/düzeltme/yeniden düzenleme/belge/denetim dalı, işleri birleştirildikten veya geçersiz kılındıktan sonra kalır.
- incelenen ağaçta depo kökünde `LICENSE`/`COPYING` dosyası yoktur.

## Bulgular

### F-043 — P2 — public deponun açık depo-düzeyi lisans kararı/dosyası yoktur

Depo herkese açıktır ancak denetlenmiş ağaçta kök yazılım lisansı yoktur. Bu telif sahipliğini değiştirmez, ancak yeniden kullanım/dağıtım koşullarını belirsiz bırakır. Varlık atıfının F-034 altında ayrı eksik envanteri vardır.

### F-044 — P2 — dal hijyeni önemli miktarda geçersiz kılınmış geçmiş biriktirmiştir

Dal envanteri hâlâ çok sayıda eski birleştirilmiş/geçersiz kılınmış `fix/`, `refactor/`, `docs/`, `cleanup/` ve geçici denetim dalları içerir; taban ROG SHA'da birden fazla boş denetim-tarama varyantı dahil. Bu çalışma zamanını bozmaz, ancak operasyonel belirsizliği ve insanların/otomasyonun bayat işi güncel seçme şansını artırır.

### F-045 — P2 — tek-seferlik kaynak-yeniden-yazan yama betikleri kanonik araçların yanında kalır

`scripts/` dize değiştirme kullanarak kanonik kaynak dosyaları doğrudan yeniden yazan tarihsel tek-seferlik yama/ekle/düzelt betikleri içerir. Örnek: `patch-video-wall-2x2.cjs` `catalog.js`, `designState.js`, `main.js` ve `scene3d.js` düzenler. Bu betikler paket yaşam döngüsü komutları değildir ve güncel migrasyon olarak bildirilmez. Modern kaynağa karşı elle yeniden çalıştırma normal mimari kararları atlayabilir veya eski kodu yeniden sokabilir.

### F-046 — P2 — kanonik komut zincirinde lint/biçim/statik-kalite kapısı yoktur

`package.json` yalnızca dev, contract verify, test, build ve preview açığa çıkarır. Kanonik CI'da lint, biçimlendirici-kontrol veya tip/statik-analiz komutu yoktur. Mevcut testler birçok mimari/kaynak koruması sağlar, ancak genel statik-kalite sapması otomatik kontrol edilmez.

## Olumlu kontroller

- kanonik CI tek bir iş akışında birleştirilmiştir.
- güncel açık PR/issue kuyrukları boştur.
- tarihsel temizlik/ilerleme belgeleri birçok tamamlanmış temizlik dilimini açıkça kaydeder.
- tek-seferlik yama betikleri `package.json` veya kanonik CI tarafından çağrılmaz.

## Kontrol listesi sonuçları

- A21.01 açık PR/issue envanteri: `AUDITED_OK`.
- A21.02 bayat/geçersiz kılınmış dallar: `GAP` — F-044.
- A21.03 tek-seferlik betikler: `GAP` — F-045.
- A21.04 belgeleme durum sapması: `GAP` — F-001/F-002/F-003/F-004.
- A21.05 depo lisansı/public karar: `GAP` — F-043.
- A21.06 üçüncü-taraf varlık atıfı: `GAP/DECISION_REQUIRED` — F-034.
- A21.07 üretilen/derleme artefaktları işlenmiş: incelenen ağaç için `AUDITED_OK`; `dist/` izlenmez.
- A21.08 statik kalite araçları: `GAP` — F-046.
- A21.09 kanonik CI sayısı/sahipliği: `AUDITED_OK`.
- A21.10 dal yönetişimi: `GAP` — F-041/F-044.

Bölüm denetim durumu: **GAP**.
