# A08 F-020 kapanışı

Bulgu: **F-020 — Bekleyen otomatik kayıt proje değiştir/aç sırasında iptal/kayıp olabilir**

Durum: **CLOSED / POST-MERGE VERIFIED**

## Kök neden

Otomatik kayıt 5 saniyelik bir debounce kullanıyordu. Bir proje geçişi/açma bu zamanlayıcı ateşlenmeden önce başladığında, geri yükleme akışı otomatik kaydı kapatıyor ve bekleyen zamanlayıcıyı temizliyordu. Aktif projenin en son düzenlemeleri bu yüzden kayıp-güncelleme penceresine sahipti: kullanıcı düzenlemeyi mevcut oturumda yapmış olsa bile kalıcı depolamadan kaybolabilirdi.

## Düzeltme

Uygulama PR **#70 — Fix F-020 save-before-project-actions durability** proje-değiştiren eylemlerin önce aktif projeyi kalıcılaştırmasını sağlayarak o pencereyi kaldırdı.

Düzeltme:

- mevcut Kaydet eylemiyle aynı kayıt yaşam döngüsünü izleyen anlık bir otomatik-kayıt-denetleyici `flush()` yolu ekledi,
- proje Aç/geçiş, Dışa Aktar, İçe Aktar ve Sahne Oluştur tarafından kullanılan tek bir eylem-öncesi-kayıt koruması ekledi,
- istenen eyleme devam etmeden önce aktif-proje kaydının başarılı olmasını bekler,
- kayıt başarısız olduğunda istenen eylemi iptal eder,
- kayıt-tetikli proje-listesi yenilemesi boyunca istenen hedef projeyi korur,
- tıklama yolundan kaydı başlatıp arşiv işlemeden önce o kaydı bekleyerek İçe Aktar için tarayıcı kullanıcı etkinleştirmesini korur,
- normal arka plan otomatik kayıt davranışı için mevcut 5 saniyelik otomatik kayıt debounce'unu tutar.

Hiçbir kalıcı şema, Item/BOM, yerleşim, renderer veya katalog davranışı değiştirilmedi.

## Doğrulama

Son uygulama PR head: `5e428f2aa372be3cc9eda43d2dff970ff489241b`.

PR CI çalıştırması **#298 / run `33996235671`** başarıyla tamamlandı:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

Hedefli kapsam otomatik kayıt flush davranışını, proje-eylem sıralama/hata davranışını, açılır menü geçiş/içe aktarma entegrasyonunu ve otomatik kayıt debounce penceresi içindeki bir düzenlemenin proje geçişinden önce kalıcılaştığını kanıtlayan bir Chromium regresyonunu içerir.

PR #70, `2d8da33e1e0a2ccd709cfd2165822dc5e6bca6e5` olarak `ROG`'a birleştirildi.

Birleştirme sonrası `ROG` CI çalıştırması **#299 / run `33996363950`** başarıyla tamamlandı:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

## Sonuç

Proje durumunu geçirebilen, değiştirebilen, içe/dışa aktarabilen veya yeniden oluşturabilen proje eylemleri artık bekleyen bir otomatik kaydı atmaz. Önce mevcut proje kalıcılaştırılır ve istenen eylem yalnızca o kayıt başarılı olduktan sonra devam eder.

A08, F-021, F-022 ve F-023 ayrı açık kalıcılık bulguları olduğu için daha geniş bir `GAP` bölümü olarak kalır.

**F-020 is CLOSED.**
