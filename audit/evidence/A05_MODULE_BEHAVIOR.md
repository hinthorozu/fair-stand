# A05 — Modül davranışı denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Davranış kaydı envanteri

Kanonik sahip: `src/moduleBehavior.js`.

Güncel açık çalışma zamanı tipleri:

- flat-panel
- showcase-3
- showcase-2
- shelf
- door
- base-wall
- separator
- counter
- base
- sofa-set-classic
- table-chair-set-eames
- bar-stool
- mini-fridge
- kettle
- coat-rack
- indoor-plant-1
- illuminated-foam
- tv
- led-floodlight

Güncel davranış boyutları:

- `placement`
- `moveSnapCm`
- `rotationStepDeg`
- `defaultRotationDeg`
- `allowSideInsert`
- `collision`
- `ghost`

Tanımlayıcı-farkında override'lar:

- L banko varsayılan döndürme = 270°
- düz 100/150/200 banko döndürme adımı = 45°

## Kontrol listesi sonuçları

### A05.01 / A05.02 / A05.03 — profiller/tipler/yedek

Güncel 19 çalışma zamanı tipinin tümü `TYPE_BEHAVIORS` içinde açıktır; `illuminated-foam` dahil. `test/moduleBehaviorContract.test.js` benzersiz katalog çalışma zamanı tiplerini türetir ve herhangi bir katalog tipi açık değilse başarısız olur. Bilinmeyen katalog-dışı tipler `hasExplicitModuleBehavior()` ile ayırt edilebilir kalır.

**Durum:** `AUDITED_OK`.

### A05.04 — hareket snap

Snap değerleri merkezi bildirilir ve yerleştirme/taşıma etkileşim yollarında `getModuleMoveSnapCm()` üzerinden tüketilir. İkinci bir modül-tip snap tablosu saptanmadı.

**Durum:** kanonik değerler için `AUDITED_OK`. Gizli özel yerleştirme algoritmaları F-011 altında kalır.

### A05.05 — döndürme adımı/varsayılan/sınırlar

Döndürme adımı/varsayılan, tanımlayıcı-farkında banko override'ları dahil davranış kaydında merkezileştirilmiştir. Mevcut döndürme regresyon testleri özel banko/bar-stool davranışını korur.

Güncel davranış şemasında sınırlı min/max/yön politikası yoktur; denetlenen 45+1 kümede hiçbir güncel modül sözleşmesi böyle bir sınır gerektirmez, bu yüzden bu mevcut bir hata değildir.

**Durum:** güncel modül kümesi için `AUDITED_OK`.

### A05.06 — çarpışma

Çarpışma stratejisi merkezi bildirilir (`segment`, `footprint`, `none`) ve yerleştirme çekirdeği onu okur. Ancak modüle özel geometri/uç nokta/yığma kuralları bildirimsel sözleşmenin dışında dağılmış kalır; kök bulgu F-011 o sahiplik boşluğunu zaten kapsar.

**Durum:** F-011 ile `GAP`, yinelenen bulgu yok.

### A05.07 — ghost

Tüm davranışlar bir ghost çözer (açık veya merkezi varsayılan). `scene3d` yerleştirme ghost oluşturmayı `getModuleGhostBehavior()` üzerinden yönlendirir ve yedek kutu ile gerçek modül silüeti kurar.

**Durum:** `AUDITED_OK`.

### A05.08 — yan ekleme

### F-015 — P1 — `allowSideInsert` bildirilir ancak zorlanmaz

`MODULE_BEHAVIOR_STANDARD.md` açıkça tanımlar:

> `allowSideInsert`: bağlam sol/sağ eklemenin izinli olup olmadığı.

Güncel davranış `illuminated-foam` ve `tv` için `allowSideInsert:false` bildirir.

Ancak bağlam menüsü her zaman şunları çizer ve işler:

- `add-right`
- `add-left`
- `duplicate-right`
- `duplicate-left`

modül davranışını veya `allowSideInsert` okumadan. Ana ekleme planlayıcıları da işlemi bu davranış alanına göre reddetmez.

Bu nedenle davranış sözleşmesi yan eklemenin yasak olduğunu iddia ederken UI/çalışma zamanı yine de sunar ve dener. Bu, yalnızca eksik belgeleme değil, sözleşmeden-çalışma-zamanına zorlama boşluğudur.

**Durum:** `GAP` — F-015.

### A05.09 — seçilebilirlik/silinebilirlik

Seç/sil şu anda modül başına davranış alanları değil, küresel düzenleyici yetenekleridir. Hiçbir güncel modül çelişen modüle özel politika bildirmez. Bu mevcut sözleşme altında kabul edilebilirdir; A10/A16 etkileşim/erişilebilirlik ayrıntılarını denetleyecektir.

**Durum:** güncel bildirilmiş sözleşme için `AUDITED_OK`.

### A05.10 — gizli davranış override'ları

Tipe özel yerleştirme/etkileşim kararları `modulePlacement.js`, `scene3d.js` ve `main.js` içindeki bir LED çoğaltma yolunda vardır. Bunlar zaten F-011 altında gruplanmıştır. Belirli algoritmalar A06/A09'da yalnızca aynı kök bulguya karşı kanıt olarak yeniden numaralandırılacaktır.

**Durum:** `GAP` — F-011.

## Bölüm sonucu

A05 incelemesi tamamlandı.

- Yeni bulgu: F-015 P1.
- Yeniden kullanılan kök bulgu: F-011 P1.
- Düzeltme yapılmadı.

Bölüm denetim durumu: **GAP**.
Sonraki denetim bölümü: **A06 — Yerleştirme / taşıma / döndürme / çarpışma / reflow**.
