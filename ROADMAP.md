# Fair Stand Roadmap

Bu belge, Fair Stand / Maxima Stand Konfigüratörü geliştirme fazlarını ve faz sınırlarını netleştirir.

## Proje durumu

- **FAZ 1: KAPANDI — 10 Ağustos 2026**
- **FAZ 2: YERLEŞİM MOTORU KAPANIŞ / POLISH AŞAMASI — 11 Ağustos 2026**
- **FAZ 2.1: temel tamamlandı; 4 yön rotasyon, magnetic snap, serbest yerleşim ve feedback aktif**
- FAZ 1 bundan sonra yeni özellik eklenmeden referans taban olarak korunacaktır. Kritik bug düzeltmeleri yapılabilir; yeni yerleşim ve stand davranışları FAZ 2 kapsamında geliştirilecektir.

---

# FAZ 1 — KAPANDI

FAZ 1'in amacı; düz/sırt duvar üzerinde çalışan, gerçek ölçülü sahneye sahip, Maxima modüllerini seçip düzenleyebilen ve temel tasarım özelliklerini uygulayabilen sağlam bir 3D konfigüratör tabanı oluşturmaktı.

## 1. Sahne ve stand alanı

- Kullanıcı sahne oluşturulmadan önce stand tipini seçer.
- Kullanıcı stand alanını **X ve Y** olarak santimetre cinsinden girer.
- Stand ölçüleri minimum **50 cm** ve yalnızca **50 cm katları** olabilir.
- Örnek geçerli ölçüler: `800 × 450`, `350 × 500`, `600 × 600` cm.
- Örnek geçersiz ölçüler: `25 × 75`, `825 × 450`, `800 × 475` cm.
- Her eksende maksimum stand ölçüsü **5000 cm / 50 m** olarak sınırlandırılmıştır.
- Girilen `X × Y` alanı şirketin kiraladığı / aktif kullanabildiği gerçek stand alanıdır.
- Aktif alanın dört tarafında **100 cm pasif gri çevre** bulunur.
- Toplam sahne ölçüsü `(X + 200 cm) × (Y + 200 cm)` olarak oluşturulur.
- Zemin grid'i gerçek ölçekte **100 × 100 cm** hücrelerden oluşur.
- Stand tipi + X + Y tamamlanmadan sahne oluşturulmaz.

## 2. Eksen standardı

Projede bundan sonra kullanılan teknik eksen standardı:

- **X = zemin yatay ekseni / genişlik**
- **Y = zemin derinlik ekseni**
- **Z = yükseklik**

Three.js iç sahnesindeki eski geometri düzeni korunurken FAZ 2 yerleşim state'i bu proje standardını kullanır. Logical Y değeri renderer tarafında Three.js world-Z'ye, logical Z değeri world-Y'ye çevrilir.

## 3. Stand tipi seçim altyapısı

FAZ 1 sonunda kullanıcı arayüzünde beş ayrı stand tipi seçeneği vardır:

- `Sırt Duvar` — `back-wall`
- `L Stand Sol` — `l-left`
- `L Stand Sağ` — `l-right`
- `U Stand` — `u-stand`
- `Ada Stand` — `island`

**Önemli:** FAZ 1'de gerçek çalışan yerleşim motoru sırt/düz duvar içindir. `L Stand Sol`, `L Stand Sağ`, `U Stand` ve `Ada Stand` seçim/state altyapısı hazırlanmıştır; gerçek çok kenarlı yerleşim motoru FAZ 2 kapsamındadır.

## 4. Düz / sırt duvar motoru

- 50 / 100 / 150 / 200 cm Maxima panel genişlikleri desteklenir.
- Verilen toplam uzunluk uygun modül kombinasyonlarına bölünebilir.
- Modüller sırt duvar üzerinde sıralı olarak yerleştirilir.
- Modül ekleme, silme ve çoğaltma desteklenir.
- Sağ ve sol tarafa modül ekleme akışı vardır.
- Modül yeniden oluşturulduğunda tasarım state'i korunur.

## 5. Modül kataloğu

FAZ 1 katalog altyapısında:

- Düz Panel 50
- Düz Panel 100
- Düz Panel 150
- Düz Panel 200
- Separatör 50
- Separatör 100
- 2 Gözlü Vitrin 100
- 3 Gözlü Vitrin 100

modülleri kullanılabilir.

Katalogda birden fazla modül seçilebilir, seçim sırası değiştirilebilir ve modüller paket halinde eklenebilir.

## 6. Aktif alan / kapasite kuralı

- Modüller aktif stand alanının dışına taşamaz.
- Kapasite doğrulama altyapısı X ve Y eksenleri için ortak olacak şekilde hazırlanmıştır.
- Mevcut sırt duvar akışında X kapasitesi aktif olarak uygulanır.
- Paket eklemede **mevcut toplam + eklenecek paketin tamamı** işlem öncesinde hesaplanır.
- Sınır aşılırsa paket kısmen eklenmez; **işlemin tamamı reddedilir**.
- Aynı kontrol modül çoğaltmada ve otomatik düz duvar oluşturmada uygulanır.
- Hata durumunda kullanıcıya görünür popup gösterilir.
- Popup'ta eksen sınırı, mevcut toplam, eklenecek miktar ve oluşacak toplam açıkça yazılır.
- Modül kataloğu kapasite hatasında kapanmaz; kullanıcı seçimini düzeltebilir.

## 7. Panel seçimi ve tasarım

- Tek panel seçimi desteklenir.
- Ctrl/Cmd + tık ile dikdörtgen panel blokları seçilebilir.
- `1 × N`, `N × 1` ve `N × M` seçimleri desteklenir.
- Eksik, boşluklu veya L biçimli panel seçimleri reddedilir.
- Panel veya panel bloklarına renk uygulanabilir.
- HEX / RGB / CMYK renk alanları senkron çalışır.
- Son kullanılan aktif renk korunur.

## 8. Görsel / baskı sistemi

- Görseller tarayıcı arşivine kaydedilip tekrar kullanılabilir.
- Tek panel veya dikdörtgen panel bloğuna görsel uygulanabilir.
- `Doldur` gerçek `cover`, `Sığdır` gerçek `contain` mantığıyla çalışır.
- Görsel paneller arasında birleşik baskı alanı olarak devam edebilir.
- Panel renk override işlemleri diğer panellerin görsel state'ini bozmaz.
- Rebuild sonrasında görsel ve texture state'i korunur.

## 9. Cam panel ve toplu sıfırlama

- Panel sağ tık menüsünden `Cam panele çevir` / `Normal panele çevir` işlemi yapılabilir.
- Cam özelliği çoklu dikdörtgen panel seçiminde toplu uygulanabilir.
- Cam state'i rebuild ve çoğaltmada korunur.
- Normal panele dönüldüğünde kayıtlı renk/görsel geri gelir.
- `Tüm Özellikleri Kaldır` işlemi renk, görsel, cam ve diğer panel özelleştirmelerini sıfırlar.
- Modül türleri, ölçüleri ve sıraları korunur.
- Görsel arşivindeki dosyalar toplu sıfırlama sırasında silinmez.

## 10. Kamera ve sahne navigasyonu

- Three.js gerçek zamanlı 3D sahne kullanılır.
- Sol mouse sürükleme: rotate.
- Orta mouse / tekerlek basılı sürükleme: pan.
- Mouse wheel: zoom.
- ViewCube üzerinden FRONT / BACK / LEFT / RIGHT / TOP / BOTTOM ve diyagonal görünümler desteklenir.
- Home görünümü bulunur.
- Duvar düzenleme işlemleri sırasında mevcut kamera açısının korunması sağlanmıştır.

## 11. Kalite altyapısı

- Node testleri bulunmaktadır.
- GitHub Actions üzerinde otomatik `npm test` ve `npm run build` çalışır.
- Ana geliştirmeler CI başarıyla geçmeden tamamlanmış kabul edilmez.

---

# FAZ 2 — YERLEŞİM MOTORU — BAŞLADI

FAZ 2'nin ana hedefi, sıralı düz duvar mantığını gerçek stand alanında **kontrollü drag & drop + magnetic snap** sistemine dönüştürmektir.

## FAZ 2.1 — tamamlanan temel

- `modulePlacement.js` yerleşim motoru eklendi.
- Her modül için `xCm`, `yCm`, `zCm`, `rotationZDeg` ve `wallId` yerleşim state'i tanımlandı.
- Yerleşim koordinatları proje standardına göre **X/Y zemin, Z yükseklik** olarak tutulur.
- Stand tipine göre izin verilen kenarlar tanımlandı:
  - Sırt Duvar: `back`
  - L Stand Sol: `back + left`
  - L Stand Sağ: `back + right`
  - U Stand: `back + left + right`
- Modül konumu **50 cm snap** ile sınırlandırıldı.
- Modüller yalnızca 0° / 90° / 180° / 270° plan rotasyonlarında çalışır; `R` +90°, `Shift+R` -90° döndürür.
- Sahnede mevcut bir modül sol mouse ile tutulup sürüklenebilir hale getirildi.
- Sürükleme sırasında yarı şeffaf **ghost preview** gösterilir.
- Geçerli yerleşim ghost'u yeşil, geçersiz yerleşim ghost'u kırmızı gösterilir.
- Aktif stand sınırı dışındaki drop engellenir.
- Aynı kenardaki modüllerin üst üste binmesi engellenir.
- Birbirine dik iki kenarın köşede birleşmesine izin verilir.
- L Sol / L Sağ / U standlarda sürüklenen modül en yakın izin verilen stand kenarına otomatik yönlenir.
- Rebuild artık modülün placement state'ini okuyarak modülü doğru kenar ve yönde yeniden çizer.
- Sağ tık çoğaltma ve sağ/sol ekleme akışları modülün bulunduğu kenarı dikkate alacak şekilde placement-aware hale getirildi.
- `Tüm Özellikleri Kaldır` işlemi renk/görsel/cam özelliklerini sıfırlarken FAZ 2 yerleşim state'ini korur.
- FAZ 2.1 snap, izin verilen kenar, sınır ve collision davranışları otomatik testlerle güvenceye alındı.

## FAZ 2.1 kullanım davranışı

- **Modül üzerinde sol tuş + sürükle:** modülü yerleştir.
- **Boş alanda sol sürükle:** kamerayı döndür.
- **Ctrl/Cmd + tık:** mevcut dikdörtgen panel seçimini kullan.
- **Orta mouse basılı sürükle:** pan.
- **Tekerlek:** zoom.

## FAZ 2 — güncel durum (11 Ağustos 2026)

Tamamlanan yerleşim özellikleri:

- Katalog kartından doğrudan 3D sahneye drag & drop.
- Sırt, L Sol, L Sağ, U ve Ada standlarda ortak 50 cm grid yerleşim motoru.
- Tüm modüllerde 0° / 90° / 180° / 270° gerçek ön-yüz rotasyonu.
- Sürüklerken ve seçiliyken R / Shift+R ile dönüş.
- Modül merkezinden dönüş ve 50 cm grid'e yeniden oturma.
- Modül-modül magnetic snap: uç-uca, L ve T bağlantıları.
- Serbest alan yerleşimi ile perimeter duvar yerleşiminin aynı modül sistemi içinde çalışması.
- Geçersiz sürükleme/dönüşte kırmızı ghost ve kısa kullanıcı feedback'i.
- Çoklu panel seçimi köşe boyunca devam edebilir; bağlı duvarlarda renk/görsel sürekliliği korunur.
- Collision kontrolünün merkez çizgisine ek olarak gerçek modül kasa derinliğini hesaba katması.
- Kullanıcıya gösterilen yerleşim hata mesajlarının sadeleştirilmesi.

FAZ 2 kapanış öncesi kalan:

- ✅ **Issue #1:** serbest alandaki modül sıralarında Ekle/Çoğalt Sağ/Sol artık duvar kapasitesi yerine komşu konum + X/Y sınırı + collision ile doğrulanır.
- Final regresyon ve FAZ 2 kapanış kararı.

## FAZ 2 ana hedefleri

1. **L Stand Sol ve L Stand Sağ gerçek yerleşimi**
   - X yönündeki arka duvar.
   - Sol veya sağ Y kenarındaki yan duvar.
   - İki yönün ayrı stand tipi olarak korunması.

2. **U Stand gerçek yerleşimi**
   - Bir X arka duvarı.
   - İki bağımsız Y yan duvarı.
   - Her kenarın kapasitesinin ayrı takip edilmesi.

3. **Kontrollü drag & drop**
   - Mevcut modüllerin sahne içinde kontrollü sürüklenmesi FAZ 2.1'de başladı.
   - Modül katalog kartından doğrudan sahneye sürüklenebilir.
   - Sürükleme sırasında yarı şeffaf ghost preview gösterilir.
   - Modül yalnızca geçerli yerleşime bırakılabilir.

4. **Magnetic snapping**
   - Modül X veya Y doğrultusuna otomatik oturur.
   - Mevcut modülün kenarına yaklaşınca kenetlenir.
   - Stand köşesine yaklaşınca 90° yön değiştirerek uygun kenara snap olabilir.
   - Serbest 17°, 23° gibi rastgele rotasyonlara izin verilmez.

5. **Sınır ve çakışma motoru**
   - Modül aktif X/Y alanının dışına taşamaz.
   - Modüller birbirinin içine giremez.
   - Geçersiz konum ghost preview ile açıkça gösterilir.
   - Geçersiz konuma drop engellenir.

6. **Yerleşim state'i**
   - Her modülün ait olduğu duvar/kenar kimliği tutulur.
   - X/Y konumu ve Z ekseni etrafındaki 0°/90°/180°/270° yönü state'te saklanır.
   - L/U standlarda her duvarın modül kapasitesi bağımsız yönetilir.

7. **Ada Stand**
   - Ada Stand serbest yerleşimi aynı kontrollü 50 cm grid + snap altyapısı üzerinden aktif olarak çalışır.

## FAZ 2 UX ilkesi

Sistem serbest bir CAD programına dönüşmeyecektir. Kullanıcı modülleri sürükleyebilecek ancak yalnızca Maxima sisteminin izin verdiği konum, yön, snap ve bağlantı kuralları içinde hareket edebilecektir.

## FAZ 2 ek not

Özel renk editörü ileride ele alınabilir. Native browser renk picker yerine uygulama içi bir popup geliştirildiğinde 3D sahnedeki canlı renk önizleme davranışı kesinlikle korunmalıdır.

---

# Faz sınırı kararı

**FAZ 1, 10 Ağustos 2026 itibarıyla kapatılmıştır. FAZ 2 aynı tarih itibarıyla yerleşim motoru geliştirmeleriyle başlamıştır.**

FAZ 1 tabanı; düz/sırt duvar, sahne ölçüsü, katalog, tasarım araçları, kapasite kontrolü, kamera ve CI altyapısı açısından referans sürüm olarak korunacaktır.


## Planlanan yeni modül geliştirme sırası

1. Baza — tamamlandı
2. Raf — tamamlandı
3. Koltuk
4. Masa Sandalye Takımı
5. Bar Taburesi

---

# FAZ 3 — PROJELEME, SUNUM VE ÖZELLEŞTİRME

FAZ 3'ün amacı, stand tasarımını yalnızca sahnede düzenlemekten çıkarıp proje olarak saklanabilir, yeniden açılıp düzenlenebilir, görsel olarak sunulabilir ve kullanıcı tarafından genişletilebilir hale getirmektir.

## FAZ 3 yapılacaklar

- [x] 1. Zemin ayarlanması
- [ ] 2. Projenin kaydedilmesi ve tekrar düzenlenebilmesi
- [ ] 3. En üste lamba eklenmesi
  - LED projektör tipi: siyah ince floodlight gövde + üst profil braketi + panel yüzüne gerçek SpotLight aydınlatması.
  - Üst aksesuar duvar kapasitesini ve zemin collision hesabını tüketmez; 350 cm üst kotta izin verilen duvar kenarlarına 50 cm snap ile yerleşir.
- [ ] 4. Render alınması
- [ ] 5. Kendi modülünü oluşturma
- [ ] 6. UI/UX düzenlemesi ve final polish



## FAZ 3 — Zemin teknik kararları

- Aktif stand platformu **daima 5 cm yüksekliğinde** kalacaktır; zemin tipi, renk ve texture değişiklikleri bu kotu değiştirmeyecektir.
- **Karolaj:** gerçek ölçekte 100 × 100 cm; aktif alan sonunda kalan ölçü otomatik kırpılır (ör. 450 cm = 100 + 100 + 100 + 100 + 50). Karolaj color picker ile boyanabilir, derz/grid çizgileri renk değişiminde görünür kalır.
- **Parke:** serbest boyama yerine üç hazır doku seçeneği kullanılacaktır: Açık/Kirli Beyaz, Açık Naturel-Sarı ve Grimsi. Referans görsellerdeki yazı, ölçü, ok, logo veya watermark kullanılmayacaktır; yalnızca renk ve yüzey karakteri referans alınacaktır.
- **Halı / Halıfleks:** rip halı/halıfleks karakterinde ince dokulu texture kullanılacaktır. Texture sabit kalırken color picker üzerinden renk değiştirilebilecek; renk değişimi doku detayını yok etmeyecektir.
