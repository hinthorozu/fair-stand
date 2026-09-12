# A06 — Yerleştirme / taşıma / döndürme / çarpışma / reflow denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## İncelenen çekirdek kaynaklar

- `src/modulePlacement.js`
- `src/moduleMove.js`
- `src/wallReflow.js`
- `src/cornerPlacement.js`
- yerleştirme/taşıma/reflow testleri
- sahne sürükle/bırak entegrasyon yolları

## Kontrol listesi sonuçları

### A06.01 — koordinat kuralı

Yerleştirme durumu tutarlı olarak `xCm`, `yCm`, `zCm`, `rotationZDeg`, `wallId` saklar. X/Y plan-zemin koordinatlarıdır ve Z dikey ofsettir. Renderer, plan Y'yi Three.js dünya Z'sine dönüştürürken dikey yüksekliği Three.js Y'de tutar; bu, kalıcı-koordinat ihlali değil bir uygulama dönüşümüdür.

**Durum:** `AUDITED_OK`.

### A06.02 — yeni yerleştirme altyapısı

Katalog sürükle/bırak ve bağlam ekleme `snapPlacementToStand`, `validatePlacementAgainstModules`, sürekli duvar ekleme veya serbest-yan ekleme üzerinden geçer. Otomatik duvar/depo programatik yolları kendi planlayıcılarıyla yerleştirme üretir ancak aynı kalıcı yerleştirme şemasını korur.

Özel algoritmaların gizli modüle özel seçimi kök bulgu F-011 olarak kalır.

**Durum:** F-011 ile `GAP`.

### A06.03 — sürükleme vs programatik kısıtlar

Sürükleme önizlemesi son bırakmadan önce doğrular; son bırakma önizleme sonucunu yeniden kullanır. Bağlam/katalog ekleme, `currentModules` değiştirmeden önce yerleştirme planlayıcılarını kullanır. Programatik otomatik bileşim ayrı planlayıcı sözleşmelerine sahiptir ve A11'de denetlenir.

Önizlemenin reddettiği bir yerleştirmeyi işleyen güncel bir sürükleme yolunun doğrudan kanıtı bulunmadı.

**Durum:** güncel sürükleme/son eşdeğerlik için `AUDITED_OK`; A11 bileşim denkliğini sahiplenir.

### A06.04 — taşıma değişmezleri

`planContinuousModuleMove()` taşınan modülü kaldırır, istenen yerleştirmeyi doğrular ve ya doğrudan yerleştirmeyi işler ya da `planContinuousWallInsertion` üzerinden reflow eder. Serbest hareket doğrulaması sahne etkileşiminde yerleştirme çekirdeği tarafından yapılır.

**Durum:** güncel çekirdek için `AUDITED_OK`; özel-tip politika parçalanması F-011 altında.

### A06.05 — döndürme değişmezleri

Döndürme yardımcıları 45° artışlara normalize eder ve modül merkezini korur. Davranış istenen döndürme adımını sağlar. Yerleştirme testleri 45° düz bankoları, kardinal duvarları, merkez-koruyan döndürmeyi ve sağ-duvar bakışını kapsar.

**Durum:** aktif yol için `AUDITED_OK`.

### A06.06 — çarpışma önizleme/son

Sürükleme sonucu, bırakmanın kullandığı doğrulanmış plan/yerleştirmeleri içerir; sürekli ekleme/taşıma ve serbest doğrulama `validatePlacementAgainstModules` paylaşır.

**Durum:** `AUDITED_OK`; özel çarpışma/uç nokta kuralları F-011 olarak kalır.

### A06.07 — duvar kapasitesi

Sürekli duvar kapasitesi `getContinuousWallSegments/Capacity` gelir; sahne bileşiminin özellik-özel bir kapasite yardımcısı vardır. Bu aşamada çelişen aktif çalışma zamanı kapasite sonucu bulunmadı; A11/A23 özellik bileşimini yerleştirme kapasitesine karşı çapraz kontrol eder.

**Durum:** geçici `AUDITED_OK`, çapraz-alan yeniden test A23.

### A06.08 / A06.09 — silme boşlukları ve reflow kapsamı

Main'de silme yalnızca seçili modülü kaldırır ve sahneyi yeniden kurar; compact/reflow çağırmaz. Reflow planlayıcıları yalnızca bir ekleme/taşıma için gereken çarpışma zincirini kaydırır ve etkilenmeyen modülleri yerinde tutar. Mevcut duvar-reflow testleri ileri/geri/yerel zincir davranışını kapsar.

**Durum:** `AUDITED_OK`.

### A06.10 — köşe yerleştirme

### F-016 — P2 — `cornerPlacement.js` içinde bayat/çelişen sağ-duvar yönelimi

Aktif kanonik yerleştirme snap testi, sağ duvarın **270°** içe baktığını belirtir ve `wallReflow.js:createPlacement()` de sağ-duvar yerleştirmelerini 270°'de oluşturur.

`cornerPlacement.js:createWallPlacement()` hem sol hem sağ yan-duvar yerleştirmelerini **90°**'de oluşturur. Kendi regresyon testi açıkça sağ-duvar köşe sarmasını 90° bekler.

Bu nedenle depo, aynı sağ-duvar yönelim kuralı için iki çelişen uygulama/test içerir. Güncel ana akış bu yardımcı yerine duvar reflow kullanıyor görünür; A22 `cornerPlacement.js`'nin yetim/ölü olup olmadığını belirleyecektir. Yine de gelecekteki geliştirmeyi yanıltabilecek çelişen bir uygulamadır.

**Durum:** `GAP` — F-016.

### A06.11 — serbest nesne sınırları

Anlamlı derinliği olan serbest modüller için yerleştirme döndürülmüş yarı-uzanımlar kullanır; yapısal ince segmentler için segment sınırlarını doğrular. Güncel testler serbest-ızgara yerleştirme, katı mobilya sınırları, manyetik bağlantılar ve döndürmeleri kapsar.

**Durum:** güncel kurallar için `AUDITED_OK`.

### A06.12 — wall-overlay ilişkisi

TV/illuminated-foam yerleştirmeleri `wallId`, plan koordinatları, döndürme ve `zCm` kalıcılaştırır; yükleme yeniden kurulum bu değerleri okur. Özel wall-overlay/free-support davranışı tam bildirimsel değildir ve F-011 ile yakalanır. Kalıcılık gidiş-dönüş ayrıntıları A08/A09'da denetlenir.

**Durum:** kalıcılık çapraz kontrolü bekleyen F-011 ile `GAP`.

### A06.13 — sayısal geçersiz dönüşümler

Çekirdek yerleştirme sonlu-olmayan/geçersiz genişlik ve stand boyutlarını reddeder. Durum fabrikaları güncel katalog ölçülerini kısıtlar. `createModulePlacement()` sayısal-olmayan yerleştirme alanlarını sıfıra normalize eder; bu hoşgörülüdür ancak kendi başına NaN dönüşümler yaratmaz. İçe aktarma güven-sınırı doğrulaması sonra A14/A15'te denetlenir.

**Durum:** içerde oluşturulan durum için `AUDITED_OK`; dış/içe aktarma verisi ertelendi.

### A06.14 — belirleyici başarısızlık nedenleri

Yerleştirme, taşıma ve reflow planlayıcıları açık başarısızlık nedenleriyle `{ok:false,message}` döner; UI bu mesajları gösterir.

**Durum:** `AUDITED_OK`.

## Bölüm sonucu

- Yeni bulgu: F-016 P2.
- Yeniden kullanılan kök bulgu: F-011 P1.
- Düzeltme yapılmadı.

Bölüm denetim durumu: **GAP**.
Sonraki denetim bölümü: **A07 — Durum modeli + fabrikalar**.
