# Fair Stand — Kural Tabanlı 3D Stand Konfigüratörü

## 1. Projenin amacı

Bu projenin amacı, müşterinin teknik çizim yapmasına gerek kalmadan standart stand modüllerini seçerek bir fuar standı oluşturabilmesini sağlamaktır.

Kullanıcı:

- Stand genişliğini ve derinliğini girer.
- Stand tipini seçer: düz sırt duvar, L stand, U stand vb.
- Raf, kasa, depo, kapı, görsel alanı ve renk seçeneklerini belirler.
- Sistem tarafından oluşturulan standı gerçek zamanlı olarak 3 boyutlu görüntüler.

Sistem:

- Geçerli modül kombinasyonlarını otomatik oluşturur.
- Geçersiz veya montaj açısından sakıncalı kombinasyonları engeller.
- Kullanılan gerçek modülleri ve aksesuarları sayar.
- Parça listesi ve ilerleyen aşamalarda fiyat/teklif çıktısı üretir.

Bu nedenle ürün bir serbest çizim programı değil, **kural tabanlı modüler stand konfigüratörü** olacaktır.

---

## 2. İlk aşamada kullanılacak fiziksel sistem

İlk sürümde özel ahşap panel sistemi geliştirilmeyecektir. Mevcut **Maxima stand modülleri** esas alınacaktır.

Konuşmalarda belirlenen standart panel/modül genişlikleri:

- 50 cm
- 100 cm
- 150 cm
- 200 cm

Örneğin 300 cm uzunluğundaki bir duvar şu kombinasyonlarla oluşturulabilir:

- 150 + 150
- 200 + 100
- 100 + 100 + 100

Sistem, uygun kombinasyonları kurallara göre önerebilir. Gerektiğinde müşteri veya yetkili kullanıcı farklı geçerli kombinasyonlar arasından seçim yapabilir.

---

## 3. Temel ürün mantığı

Her gerçek stand parçasının yazılımda bir dijital karşılığı bulunacaktır.

Örnek modüller:

- 50 cm boş panel
- 100 cm boş panel
- 150 cm boş panel
- 200 cm boş panel
- Raflı panel
- Kasalı panel
- Köşe modülü
- Kapı modülü
- Depo modülü
- Baza
- Görsel paneli
- Destek ayağı/dikmesi
- Üst bağlantı elemanı

Her modül için aşağıdaki bilgiler tutulmalıdır:

- Modül adı
- Stok/ürün kodu
- Genişlik
- Yükseklik
- Derinlik
- Ağırlık
- 3D model dosyası
- Bağlantı noktaları
- Uyumlu aksesuarlar
- Uyumlu ve yasak modül kombinasyonları
- Renk veya görsel uygulanabilen yüzeyler
- Taşıyabileceği maksimum raf sayısı
- Gerekli montaj parçaları
- Maliyet ve satış fiyatı
- Stok bilgisi

---

## 4. Örnek kullanıcı akışı

1. Kullanıcı stand alanını girer. Örnek: `3 × 4 metre`.
2. Stand tipini seçer. Örnek: `L stand`.
3. Sistem ölçüye uygun panel kombinasyonunu otomatik oluşturur.
4. Kullanıcı oluşturulan duvarlardan birini seçer.
5. Seçilen duvara raf, kasa veya görsel alanı ekler.
6. Raf sayısını seçer. Örnek: `3 sıra raf`.
7. Sistem rafları izin verilen sabit yüksekliklere otomatik yerleştirir.
8. Kullanıcı panel veya panel bölümlerinin renklerini değiştirir.
9. 3D görünüm yapılan değişiklikleri anında gösterir.
10. Sistem kullanılan tüm modülleri ve aksesuarları listeler.

Temel yaklaşım: Kullanıcı teknik panel yerleşimi çizmez; ölçü, stand tipi ve ihtiyacını seçer. Sistem gerçek modüllerden geçerli bir stand oluşturur.

---

## 5. 3D görünüm ve gerçek zamanlı değişiklik

3D görüntüleme için **Three.js** kullanılabilir.

Three.js:

- Açık kaynaklı ve ücretsizdir.
- Web tarayıcısında çalışır.
- GLB/GLTF formatındaki modelleri görüntüler.
- Parça ekleme, silme, taşıma ve döndürme işlemlerini destekler.
- Model yüzeylerinin rengini ve dokusunu anında değiştirebilir.
- Telefon, tablet ve bilgisayarda kullanılabilir.

İlk sürümde fotogerçekçi render şart değildir. Amaç müşterinin standın biçimini, renklerini, raflarını ve temel yerleşimini doğru anlayabilmesidir.

### Renk ve görsel örneği

Bir duvar 7 yatay panel/bölümden oluşuyorsa:

- En alt bölüm mavi,
- En üst bölüm sarı,
- Ortadaki bir bölüm turuncu,
- Diğer bölümler beyaz

yapılabilir.

Her bölüm ayrı 3D parça veya ayrı malzeme yüzeyi olarak tanımlanır. Kullanıcı bir renk seçtiğinde Three.js sahnesi anında güncellenir.

Aynı yöntemle şu yüzeyler uygulanabilir:

- Düz renk
- Ahşap dokusu
- Kumaş dokusu
- Logo
- Ürün görseli
- Tam yüzey baskısı

---

## 6. Kural motoru

Projenin en önemli bölümü 3D görüntü değil, **kural motorudur**.

Kural motoru aşağıdaki sorulara cevap vermelidir:

- İstenen uzunluk hangi gerçek modüllerle oluşturulabilir?
- Hangi modül hangi modüle bağlanabilir?
- Hangi duvara raf veya kasa eklenebilir?
- Bir panel en fazla kaç raf taşıyabilir?
- Raflar hangi sabit yüksekliklere yerleştirilebilir?
- Kaç metre düz duvardan sonra destek veya dönüş gerekir?
- Köşe modülü hangi yönde kullanılabilir?
- Kapı ve depo için minimum alan nedir?
- Hangi düzenler montaj veya güvenlik açısından yasaktır?

Three.js yalnızca sonucu gösterir. Standın üretilebilir ve kurulabilir olmasını bu kurallar sağlar.

---

## 7. Şu ana kadar konuşulan kurallar

### Kesinleşen yaklaşım

- Yalnızca fiziksel olarak mevcut olan modüller kullanılacak.
- Stand ölçüleri 50, 100, 150 ve 200 cm genişliğindeki modüllerle çözülecek.
- Kullanıcı geçersiz bir yapı kuramayacak.
- Sistem uygun panel kombinasyonlarını otomatik oluşturacak.
- 3D görünüm değişiklikleri anında gösterecek.
- Raf, kasa ve diğer aksesuarlar yalnızca uyumlu modüllere eklenebilecek.
- Kullanılan panel ve aksesuar adetleri otomatik hesaplanacak.

### Doğrulanması gereken taslak kurallar

Aşağıdaki maddeler henüz üretim/montaj ekibi tarafından doğrulanmalıdır:

- Bir panelde en fazla 3 sıra raf olabilir.
- Belirli bir uzunluktan sonra düz duvara izin verilmemelidir.
- Yaklaşık 4 metreden sonra destek, dönüş veya ilave dikme gerekebilir.
- 5–6 metrelik kesintisiz duvarlarda baza, destek veya kırılım zorunlu olabilir.
- Raflar yalnızca belirli sabit yükseklik noktalarına takılabilir.
- Bazı panel kombinasyonları statik veya estetik nedenlerle yasaklanabilir.

Bu değerler kesinleşmeden yazılıma sabit kural olarak eklenmemelidir.

---

## 8. İlk sürümün kapsamı (MVP)

İlk sürüm mümkün olduğunca küçük ve test edilebilir tutulmalıdır.

### Stand tipleri

- Düz sırt duvar
- L stand
- U stand

### Modüller

- 50 cm panel
- 100 cm panel
- 150 cm panel
- 200 cm panel
- Tek standart yükseklik
- Boş panel
- Raflı panel
- Kasalı panel

### Fonksiyonlar

- Alan ölçüsü girme
- Stand tipi seçme
- Otomatik panel dizilimi
- Alternatif geçerli panel kombinasyonlarını gösterme
- Panel seçme
- Raf ekleme ve raf sayısını belirleme
- Basit renk değiştirme
- Gerçek zamanlı 3D görünüm
- Otomatik modül ve aksesuar listesi
- Tasarımı kaydetme

İlk sürüm çalışmadan depo, lightbox, gelişmiş baskı, CNC veya kapsamlı fiyatlandırmaya geçilmemelidir.

---

## 9. İlerleyen sürümlerde eklenecek çıktılar

- Yaklaşık fiyat hesabı
- Detaylı satış teklifi
- PDF teklif çıktısı
- Montaj sırası
- Bağlantı elemanı listesi
- Depodan ürün toplama listesi
- Paketleme listesi
- Stok kontrolü
- Müşteri logosu ve baskı dosyaları
- Numaralandırılmış montaj şeması
- Kullanıcı ve proje yönetimi
- Proje paylaşma/onaylama akışı

---

## 10. Toplanması gereken teknik veriler

Yazılım geliştirmeye paralel olarak eksiksiz bir **Maxima modül kataloğu** hazırlanmalıdır.

Her modül için:

- Ad ve ürün kodu
- Gerçek ölçüler
- Ağırlık
- Fotoğraf
- 3D model
- Bağlantı noktaları
- Uyumlu aksesuarlar
- Gerekli montaj parçaları
- Maksimum taşıma kapasitesi
- Maliyet ve satış fiyatı
- Stok bilgisi

Kesinleştirilmesi gereken saha kuralları:

- Maksimum düz duvar uzunluğu
- Destek gereken aralık
- Maksimum raf sayısı
- Rafların sabit yükseklikleri
- Raf taşıma kapasitesi
- Kasa eklenebilen panel tipleri
- Köşe birleşim kuralları
- Kapı ve depo ölçüleri
- Stand yüksekliği
- Baza ve zemin seçenekleri

---

## 11. Önerilen yazılım yapısı

```text
fair-stand/
├── app/                 # Uygulama sayfaları ve ana kullanıcı akışı
├── components/          # Arayüz bileşenleri
├── configurator/        # Stand oluşturma ve yerleşim motoru
├── rules/               # Ölçü, bağlantı ve güvenlik kuralları
├── catalog/             # Panel ve aksesuar kataloğu
├── models/              # GLB/GLTF 3D modeller
├── materials/           # Renk, doku ve baskı tanımları
├── pricing/             # Fiyat ve maliyet hesaplama
├── projects/            # Kaydedilen müşteri tasarımları
└── docs/                # Teknik ve işlevsel belgeler
```

Asıl ürün değeri `rules` ve `catalog` bölümlerinde oluşacaktır. 3D görüntüleme katmanı bu verileri görselleştirecektir.

---

## 12. Uygulama sırası

1. Maxima modül envanterini çıkar.
2. Modüllerin gerçek ölçülerini ve kodlarını kaydet.
3. Bağlantı, raf ve duvar kurallarını yazılı hale getir.
4. Modüllerin basit GLB/GLTF modellerini hazırla.
5. Tek bir düz duvar oluşturma prototipi geliştir.
6. 50–200 cm modüllerle otomatik uzunluk çözümünü geliştir.
7. Alternatif panel kombinasyonlarını göster.
8. Panel ve panel bölümü renk değiştirmeyi çalıştır.
9. Raf ekleme ve raf sayısı kurallarını uygula.
10. L stand oluşturmayı ekle.
11. U stand oluşturmayı ekle.
12. Geçersiz yapı kontrollerini ekle.
13. Otomatik parça listesini oluştur.
14. Fiyat ve teklif altyapısını ekle.
15. Proje kaydetme ve paylaşma akışını ekle.
16. Son aşamada arayüzü ve görsel kaliteyi geliştir.

---

## 13. İlk somut görev

İlk geliştirme görevi:

> 50, 100, 150 ve 200 cm Maxima modüllerinin listesini, gerçek ölçülerini, bağlantı noktalarını ve hangi aksesuarlarla kullanılabildiğini çıkarmak.

Bu veri olmadan 3D bir demo hazırlanabilir; ancak üretime ve gerçek montaja güvenilir çıktı veren bir sistem kurulamaz.

---

## 14. Başarı ölçütü

İlk prototip başarılı sayılacaktır, eğer kullanıcı:

1. Bir duvar uzunluğu girebiliyor,
2. Sistem bu uzunluğu gerçek Maxima modülleriyle çözebiliyor,
3. Alternatif geçerli kombinasyonları gösterebiliyor,
4. Modülleri 3D olarak görüntüleyebiliyor,
5. Seçili bir panele renk ve raf ekleyebiliyor,
6. Kullanılan gerçek parçaların listesini görebiliyorsa.

Bu aşama tamamlandıktan sonra sistem düz duvardan L ve U standlara genişletilecektir.

---

## Faz 2 notları

### Özel renk editörü / gelişmiş renk popup'ı

- Tarayıcının native renk picker penceresinin içeriği özelleştirilemediği için HEX / RGB / CMYK alanlarını native picker içine eklemek mümkün değildir.
- Faz 2'de native picker yerine uygulamaya ait özel bir renk editörü / popup geliştirilebilir.
- Bu editörde renk alanı, hue kontrolü, HEX, RGB ve CMYK değerleri birlikte gösterilebilir ve düzenlenebilir olmalıdır.
- Ancak mevcut en önemli UX avantajı korunmalıdır: kullanıcı seçili panel veya panel bloğunun rengini değiştirirken sonucu **3D sahnede canlı olarak görebilmelidir**.
- Bu nedenle popup sahneyi kapatan büyük bir modal gibi davranmamalıdır. 3D stand görünümü ve özellikle düzenlenen panel görünür kalmalıdır.
- Renk değişiklikleri editör açıkken anlık olarak sahneye uygulanmalıdır.
- İleride özel renk editörü yapılırken mevcut canlı renk önizleme davranışı geriye gitmemesi gereken temel kabul kriteridir.

---

## 15. Proje faz durumu

**FAZ 1, 10 Ağustos 2026 itibarıyla kapatılmıştır.**

FAZ 1; düz/sırt duvar motoru, gerçek ölçülü X/Y stand alanı, 50 cm ölçü adımı, maksimum 50 × 50 m alan, 1 m pasif çevre, modül kataloğu, panel seçimi, renk/görsel/cam işlemleri, vitrin/separatör modülleri, kapasite kontrolleri, ViewCube/kamera ve CI altyapısını referans taban olarak sabitler.

`L Stand Sol`, `L Stand Sağ`, `U Stand` ve `Ada Stand` seçim altyapısı FAZ 1'de hazırlanmıştır; gerçek çok kenarlı yerleşim davranışı FAZ 2 kapsamındadır.

FAZ 2'nin ana konusu **kontrollü drag & drop + magnetic snap + çakışma/sınır kontrolü ile L/U yerleşim motorudur**. Teknik eksen standardı X/Y = zemin düzlemi, Z = yükseklik olarak sabitlenmiştir.

Detaylı faz kapsamı ve sonraki adımlar için [ROADMAP.md](./ROADMAP.md) belgesine bakın.
