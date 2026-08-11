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

- `0° / 180°` modülü X doğrultusunda konumlandırır.
- `90° / 270°` modülü Y doğrultusunda konumlandırır.
- Modüller her durumda dikey kalır; dönüş logical Z ekseni etrafındaki plan dönüşüdür.
- Yerleşim 50 cm grid kuralına uyar.
