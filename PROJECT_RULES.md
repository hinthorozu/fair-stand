# Fair Stand — Kesin Proje Kuralları

Bu dosyadaki maddeler, kullanıcı açıkça aksi bir davranış istemedikçe tüm yeni geliştirmeler için varsayılan ve bağlayıcı kabul edilir.

## Modül dönüş standardı

- Aksi açıkça belirtilmedikçe **eklenen tüm modüller 360° yönlenebilir**.
- Dönüş yalnızca **90° adımlarla** yapılır: `0°`, `90°`, `180°`, `270°`.
- Serbest açı yoktur; `17°`, `45°` gibi ara açılar desteklenmez.
- `R` tuşuna her basışta modül **+90°** döner: `0 → 90 → 180 → 270 → 0`.
- `Shift + R` tuşuna her basışta modül **-90°** döner: `0 → 270 → 180 → 90 → 0`.
- Bu davranış hem **modül sürüklenirken** hem de **modül bırakıldıktan sonra seçiliyken** çalışır.
- Modül bırakıldıktan sonra döndürülürken başlangıç köşesine çivilenmez; **kendi merkezi etrafında döner** ve yeni eksende en yakın 50 cm grid konumuna oturur.
- Dönüş yalnızca yerleşim eksenini değiştirmez; modülün **gerçek ön yüzü de yön değiştirir**.
- Bu kural düz panel, separatör, vitrin, kapı ve sonradan eklenecek tüm modül tipleri için geçerlidir.
- Yeni bir modül tipi eklenirken dönüş desteği ayrıca istenmesini beklemeden bu standarda uymalıdır.

## Yerleşim ekseni standardı

- Proje mantığında **X/Y zemin düzlemi, Z yükseklik** olarak kabul edilir.
- `0° / 180°` modülü X doğrultusunda konumlandırır.
- `90° / 270°` modülü Y doğrultusunda konumlandırır.
- Modüller her durumda dikey kalır; dönüş logical Z ekseni etrafındaki plan dönüşüdür.
- Yerleşim 50 cm grid kuralına uyar.

## Tek modül yerleşim sistemi

- Perimeter / iç alan / depo / bölücü / L / T / U gibi kullanımlar için ayrı modül sınıfları veya ayrı yerleşim motorları oluşturulmaz.
- Düz panel, separatör, vitrin, kapı ve gelecekte eklenecek modüller **aynı placement sistemi** içinde çalışır.
- `wallId` yerleşim metadata'sıdır; ürün seviyesinde “iç modül / dış modül” ayrımı yaratmaz.
- Stand tipi yalnızca başlangıç duvar düzenini, aktif kenarları ve kılavuzları belirler; aynı modül daha sonra serbest alanda da kullanılabilir.
- Yeni modül tipleri aksi açıkça belirtilmedikçe drag/drop, 50 cm grid, 4 yön dönüş, collision ve magnetic snap davranışlarını otomatik olarak desteklemelidir.

## Silme davranışı

- Bir modül silindiğinde oluşan boşluk **korunur**.
- Silme sonrasında komşu modüller otomatik olarak sıkıştırılmaz veya yeniden dizilmez.
- Kullanıcı açıkça istemedikçe auto-compaction yapılmaz.

## Serbest yerleşim doğrulaması

- `wallId: free` modüllerinde sağ/sol Ekle veya Çoğalt işlemleri perimeter duvar toplam kapasitesini kullanmaz.
- Serbest yerleşim; hedef komşu konum, 50 cm grid, aktif X/Y stand sınırı ve collision kurallarıyla doğrulanır.
- Gerçek `back / left / right` perimeter duvar zincirlerinde mevcut sürekli duvar davranışı korunur.
