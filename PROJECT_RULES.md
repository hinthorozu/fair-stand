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

## Modül arka yüz standardı

- Aksi açıkça belirtilmedikçe düz panel, vitrin, kapı ve gelecekte eklenecek kapalı yüzeyli modüllerin **opak arka yüzleri koyu gri** görünür.
- Arka yüz tek parça kapakla örtülmez; panel/vitrin/kapı yapısı korunur.
- Cam panele çevrilen yüzeylerin arkası da cam/şeffaf kalır; koyu gri arka yüz camı kapatmaz.
- Ön taraftaki renk ve görsel arka yüz renginden etkilenmez.
- **Separatör bu kuralın istisnasıdır**; açık çıtalı yapısı ön/arka olarak korunur.
- Amaç 0° / 90° / 180° / 270° dönüşlerde modülün ön ve arka yönünün görsel olarak hemen ayırt edilmesidir.

## Banko modülü standardı

- Banko genişlikleri X = 100 / 150 / 200 cm; derinlik Y = 50 cm; yükseklik H = 100 cm.
- Ön X cephesi ile sol ve sağ Y cepheleri birbirinden bağımsız seçilebilir; her cepheye ayrı renk veya görsel atanabilir.
- Bankolar serbest yerleşim modülüdür; aktif duvar zincirine otomatik katılmaz. 0/90/180/270 dönüş, R / Shift+R ve stand sınırı/collision kontrolleri geçerlidir.


## Baza modülü standardı

- Baza genişlikleri X = 100 / 150 / 200 cm; derinlik Y = 50 cm; ilk referans model yüksekliği H = 50 cm.
- Üst tabla sabit beyaz ahşap/levha görünümündedir ve panel yüzeyi değildir.
- Ön X paneli ile sol ve sağ Y panelleri birbirinden bağımsız seçilebilir; her panele ayrı renk veya görsel atanabilir.
- Arka yüz panel ile kapatılmaz; yapı ön/sol/sağ panel ve görünür Maxima köşe profilleriyle oluşturulur.
- Baza banko gibi serbest yerleşim modülüdür; aktif duvar zincirine otomatik katılmaz. 0/90/180/270 dönüş, R / Shift+R, 50 cm fiziksel derinlik, stand sınırı, collision ve magnetic snap kuralları geçerlidir.
- İnce Maxima modüllerine uçtan bağlantıda bankoda kullanılan mantıksal merkez/bağlantı çizgisi davranışı uygulanır; nominal 100/150/200 cm ölçüler korunur.


## Raf modülü standardı

- Raf modülü hazır duvar modülüdür; genişlikler 100 / 150 / 200 cm, varyantlar 2 raflı ve 3 raflıdır.
- Raf tablaları panel birleşim çizgilerine bağlanır: 2 raflı = Z 100 / 150 cm; 3 raflı = Z 100 / 150 / 200 cm.
- Raf tablası 30 cm öne çıkar, 3 cm kalınlığında sabit beyazdır ve ön kenarında Maxima profil görünümü bulunur.
- Raf modülünün yedi paneli normal panel davranışını korur; renk, görsel ve cam özellikleri uygulanabilir. Raf tablaları panel yüzeyi değildir ve sabit beyaz kalır.
- Raf modülü düz panel/vitrin gibi normal duvar yerleşim sistemini kullanır; banko/baza tipi serbest zemin fixture olarak ele alınmaz.


## Koltuk Takımı standardı

- Tek modül olarak 1 adet yaklaşık 160 cm ikili koltuk, 2 adet yaklaşık 65 cm tekli koltuk ve ortada sabit cam sehpa içerir.
- Koltuk döşemeleri tek ortak renk state'iyle değişir; cam sehpa sabittir ve renk/görsel almaz.
- Modül serbest yerleşir; 160 x 160 cm collision footprint kullanır ve 0/90/180/270 dönüşleri destekler.
