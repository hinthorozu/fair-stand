# A11 — Özellik + sahne bileşimi / otomasyon denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Belirlenen aktif bileşim/özellikler

1. **otomatik depo** — `src/autoDepot.js`
2. **otomatik stand duvarı** — `src/automaticWall.js` + `src/wall.js` + `src/wallReflow.js`
3. **depo çevresinde otomatik arka-duvar değiştirme** — depo/sahne entegrasyonu olarak `composeAutomaticBackWallWithDepot()`

## Otomatik depo

`FEATURE_CONTRACTS.automaticDepot` açıkça bildirir:

- özellik id/kind/owner
- tetikleyici ve girdi listesi
- yapısal çıktılar: duvar + kapı
- isteğe bağlı içerik: mini-fridge + kettle + coat-rack
- yerleştirme sahibi/kuralı
- kalıcılık kipi
- regresyon kaynağı / test/derleme gereksinimleri

Sistem sözleşme testi gerçek planlayıcı içerik türlerini sözleşmeye karşı karşılaştırır. Eski `tests/autoDepot.test.js` artı güncel `test/` yönelim/depo ön/arka testleri başlıca şekil/yönelim durumlarını kapsar.

**Durum:** bileşim-sözleşme düzeyinde `AUDITED_OK`; çalışma zamanı fabrika yönlendirme bağımlılığı F-010 ve üretilen ekipman için BOM kararları F-014 ile.

## Bulgu

### F-029 — P1 — otomatik stand-duvar bileşiminin açık özellik sözleşmesi yoktur

Sahne oluşturma, `composeAutomaticStandWall()` üzerinden birden fazla duvar modülünü otomatik bileştirir ve yerleştirir. Bu, özellik/bileşim sözleşmesi gerektiren aynı geliştirme-sözleşmesi tanımı altında çok-modüllü sahne bileşimi/otomasyondur.

`featureContracts.js` şu anda yalnızca `automatic-depot` içerir; şunları bildiren açık bir `automatic-wall` / `automatic-stand-wall` sözleşmesi yoktur:

- tetikleyici
- girdiler
- çıktı modül ailesi
- yerleştirme sahibi
- kalıcılık semantiği
- stand tipi/kapasitesine bağımlılıklar
- regresyon kaynakları

Uygulamanın kendisi yapılandırılmıştır ve kanonik duvar/reflow yardımcılarını kullanır, ancak yönetişim sözleşme katmanı bu aktif otomasyonu tanımlamaz. Gelecekteki bir değişiklik bu nedenle otomatik deponun aldığı alan-özel özellik-sözleşme testi olmadan otomatik sahne duvar üretimini değiştirebilir.

## Kontrol listesi sonuçları

- **A11.01 özellik envanteri:** `AUDITED_OK` — aktif çok-modüllü bileşim yolları yukarıda belirlendi.
- **A11.02 sözleşme varlığı:** `GAP` — otomatik duvar için F-029.
- **A11.03 bildirilmiş girdiler:** otomatik depo `AUDITED_OK`; otomatik duvar `GAP` F-029.
- **A11.04 üretilen modüller/durum yolu:** otomatik depo ve otomatik duvar normal modül durumu oluşturur ve `currentModules`'e girer; ancak fabrika yönlendirmesi `main.js`'te çoğaltılmıştır — F-010.
- **A11.05 yerleştirme çekirdeği:** otomatik duvar wallReflow yerleştirmesine devreder. Otomatik-depo kasıtlı serbest-yerleşim geometrisini sahiplenir; gizli tipe özel fikstür davranışı F-011'e bağlanır.
- **A11.06 kalıcılık:** üretilen modüller kullanıcı-eklenen modüller gibi serileştirilir; `currentStand.depot` yapılandırmayı saklar. `AUDITED_OK`, genel şema F-021/F-022 ile.
- **A11.07 BOM:** üretilen yapısal modüller reçete politikaları kullanır; üretilen depo ekipmanı F-014 altında `decision-required` kalır.
- **A11.08 regresyon:** otomatik deponun sözleşme + birkaç planlayıcı testi vardır; otomatik duvarın uygulama testleri vardır (`automaticWall.test.js` vb.) ancak özellik sözleşmesi yoktur — F-029.
- **A11.09 başarısızlık geri alma:** geçersiz depo planı güncel proje sıfırlamasından önce reddedilir. Otomatik duvar/özel depo-arka başarısızlıkları sahne oluşturmada daha sonra olur, ancak doğrulanmış 50cm-adım kurulumu ve desteklenen depo boyutlarıyla güncel planlayıcıların gerekli bölünebilirliği sağlanır. Burada bağımsız yeniden üretilebilir kısmi-durum hatası kurulmadı.

Bölüm denetim durumu: **GAP**.
Sonraki denetim bölümü: **A12 — BOM / reçeteler / üretim parçaları**.
