# Fair Stand — Item Contract & Validation Checklist

Bu belge Fair Stand içindeki **canonical Item sözleşmesini** ve her Item için uygulanacak **zorunlu doğrulama checklist'ini** tek dosyada toplar.

Amaç:

1. `ITEM_CONTRACT.md` içindeki Item kurallarını eksiksiz korumak.
2. `ITEM_ANALYSIS_CHECKLIST.md` içindeki kontrol alanlarını aynı sözleşmenin altında açıklamalı hale getirmek.
3. Her Item incelenirken cevabı tahmin etmek yerine mevcut canonical kod, state, contract, recipe, production-part ve test kaynaklarından çıkarmak.

Bu belge özel bir Item'a ait sayısal runtime değerlerinin ikinci kopyası değildir. Örneğin dönüş açısı, snap değeri, collision tipi, context-menu komutları veya BOM miktarları ilgili mevcut sistem kaynağından okunur.

---

# BÖLÜM I — CANONICAL ITEM CONTRACT

## Zorunlu kapsam

Aksine açık bir ürün kararı yoksa aşağıdakilerin tamamı `Item` kabul edilir:

- panel, banko, raf, kapı, baza ve diğer stand yapısal ürünleri,
- TV, mobilya, çiçek, buzdolabı, çöp kutusu ve diğer ticari ürünler,
- ışıklı strafor, baskı ve benzeri üretilebilir yüzey/ürünler,
- halı, parke, karolaj ve gelecekte eklenecek diğer zemin çözümleri,
- profil, dikme, sunta, bant, LED, bağlantı elemanı ve diğer BOM/üretim kalemleri,
- tekil, bileşik, parametrik ve projeye özel kombinasyonlar.

Varsayılan olarak `Item` olmayanlar yalnızca sahnenin görsel/yardımcı sunumu ile stand alanını gösteren dış sınır/çizgilerdir. Ürün kararıyla BOM veya maliyete dahil edilen yeni bir fiziksel unsur bu sözleşmeye girmeden sisteme eklenemez.

---

## 1. Kök sistem `Item`dır

Stand projesinde BOM, üretim veya maliyet hesabına girebilen her fiziksel öğe bir `Item`dır.

`module`, `floor`, `furniture`, `print`, `material` gibi kavramlar kök kavram değildir; `Item`ın türü/ailesi veya kullanım rolüdür.

---

## 2. Her Item kendi BOM çıktısının canonical sahibidir

Her `Item`, BOM'a nasıl dönüştüğünü tek bir canonical reçete/resolver üzerinden tanımlar.

Bir Item:

- doğrudan tek BOM kalemi üretebilir,
- birden fazla BOM kalemine ayrılabilir,
- başka Item'lardan oluşabilir,
- ölçü veya konfigürasyona göre parametrik BOM üretebilir.

Aynı BOM kuralı controller, renderer, UI veya başka yardımcı dosyalarda ikinci kez tanımlanmaz.

---

## 3. Item tekil, bileşik veya parametrik olabilir

- **Tekil Item:** ör. çiçek, TV, bar taburesi.
- **Bileşik Item:** ör. 1 masa + 4 sandalye, banko, karolaj sistemi.
- **Parametrik Item:** ör. halı, parke, baskı; ölçüye göre miktar değişir.

Bir Item aynı anda hem bileşik hem parametrik olabilir.

---

## 4. Her Item'ın stabil canonical kimliği vardır

Her Item tanımı tek ve stabil bir canonical `itemKey` taşır.

`itemKey` ürünün tam kimliğidir; `type` davranış ailesidir; proje içindeki `id` ise instance kimliğidir.

Örnek:

```text
itemKey = TV_42
type    = tv
id      = item-<project-instance>
```

Mevcut `catalogKey` kimliği yeni `itemKey` modeline taşınırken paralel ikinci bir ürün kimliği yaratılmaz; tek canonical ürün kimliği korunur.

---

## 5. Canonical Item tanımı ile proje Item instance'ı ayrıdır

Canonical tanım varsayılan ürünü/reçeteyi tanımlar. Projedeki instance kendi `id`, ölçü, adet ve konfigürasyonunu taşıyabilir.

Örneğin standart masa-sandalye seti `1 masa + 4 sandalye` olabilir; belirli projede `1 masa + 2 sandalye` olarak kullanılabilir. Bu proje konfigürasyonu canonical ürün tanımını değiştirmez.

---

## 5A. Her Item'ın canonical oluşturulma mekanizması tanımlıdır

Bir Item'ın proje instance'ına nasıl dönüştürüldüğü tek ve izlenebilir bir oluşturulma yolu üzerinden tanımlanmalıdır.

Bu oluşturulma mekanizması factory, resolver, builder veya eşdeğer bir canonical üretim noktası olabilir; isimden bağımsız olarak aynı Item için paralel ve çelişen instance oluşturma kuralları bulunmaz.

Oluşturulma mekanizması en az şu sorumlulukları açıkça çözmelidir:

- canonical `itemKey` ve `type` bilgisinden doğru Item instance'ını üretmek,
- gerekli default state/ölçü/parametreleri uygulamak,
- yeni proje instance `id` değerini üretmek veya bağlamak,
- Item'a özgü alt state/child state gerekiyorsa bunları canonical kurala göre oluşturmak,
- catalog veya başka giriş noktalarından gelen tanımı tek canonical Item kimliğine çözmek.

Factory/oluşturma mantığı UI, renderer veya farklı controller akışlarında ikinci kez kopyalanmaz.

---

## 5B. Her Item'ın persistence sözleşmesi tanımlıdır

Bir Item'ın hangi proje verilerinin kalıcı olduğu ve save/load sonrasında nasıl geri kurulduğu açıkça tanımlanmalıdır.

Persistence sözleşmesi en az şunları belirtmelidir:

- hangi Item state alanlarının proje state'ine kaydedildiği,
- hangi alanların runtime/geçici olduğu ve kaydedilmediği,
- proje yeniden açıldığında canonical Item kimliği ile instance state'in nasıl tekrar eşleştirildiği,
- alt Item/alt state/relationship referanslarının nasıl korunduğu,
- eski veya geçersiz state için validation/migration kuralının nerede olduğu.

Renderer, mesh veya geçici UI state'i persistent business state'in yerine geçmez.

---

## 6. Item davranışı `type` seviyesinde tanımlanır

Placement, move, rotation, side insert, collision, ghost, context-menu capability ve benzeri Item'a özgü editor/runtime davranışları canonical olarak davranış ailesi (`type`) seviyesinde tanımlanır.

Aynı davranış ailesindeki Item'lar aynı contract'ı kullanır.

Davranış gerçekten farklıysa yeni bir davranış ailesi/type tanımlanır. Item bazlı dağınık `if (itemKey === ...)` veya sürekli override normal mimari yöntem değildir.

UI, context menu ve runtime aynı canonical behavior/capability kaynağını tüketir.

Mevcut module behavior altyapısında bu sorumluluğun canonical runtime sahibi `src/moduleBehavior.js`, sözleşme belgesi `MODULE_BEHAVIOR_STANDARD.md` dosyasıdır; Item mimarisine geçiş bu tek-kaynak ilkesini bozmaz.

---

## 6A. Item-to-Item spatial relationship canonical olarak tanımlanır

Bir Item'ın başka Item'larla sahnedeki fiziksel/uzamsal ilişkisi business rule veya BOM sonucunu etkiliyorsa bu ilişki açık bir canonical relationship modeliyle temsil edilmelidir.

Bu ilişki modeli ihtiyaç oldukça şu tür ilişkileri taşıyabilir:

- parent / child,
- komşuluk / neighbor,
- bağlı / connected,
- üzerinde / bağlı olduğu host,
- köşe / corner,
- aynı continuous chain içinde olma,
- başka bir Item'a göre yön veya konum bağımlılığı.

Relationship bilgisi yalnızca renderer mesh'inden, ekrandaki yakınlıktan veya UI tahmininden türetilen geçici bir bilgi olarak bırakılmaz. Proje state'i ve business kuralları için gerekli olan ilişki canonical veri/resolver üzerinden çözülebilmelidir.

Bir relationship Item'ın davranışını, konfigürasyonunu veya BOM'unu değiştiriyorsa bu dönüşüm relationship resolver tarafından belirlenir; aynı kural farklı controller veya UI katmanlarında yeniden tanımlanmaz.

### Relationship-derived reflow / davranış

Bir Item'ın eklenmesi, taşınması, döndürülmesi, silinmesi veya başka Item'la ilişki kurması komşu Item'ların konumunu veya durumunu etkiliyorsa bu etki canonical relationship/behavior kuralları üzerinden çözülmelidir.

Reflow veya benzeri zincir etkileri:

- hangi ilişkide tetiklendiğini,
- hangi Item'ların etkilenebileceğini,
- hangi placement/collision/boundary kurallarına uyacağını,
- ilişki kalktığında veya Item silindiğinde ne olacağını

açıkça tanımlamalıdır.

Relationship-derived davranış ile relationship-derived BOM aynı ilişki bilgisini tüketebilir; ancak behavior sonucu ile BOM sonucu ayrı sorumluluklar olarak kalır.

---

## 7. BOM gerçek Item state/ölçü/parametrelerinden hesaplanır

BOM ve üretim hesabının source of truth'u Item'ın gerçek state'i, ölçüsü, parametreleri ve konfigürasyonudur.

Render, mesh, GLB, texture, piksel çözünürlüğü veya ekrandaki görünüm BOM'un canonical kaynağı değildir.

Örneğin altı panelde baskı varsa baskı m²'si panelin gerçek baskı alanından hesaplanır; texture çözünürlüğünden hesaplanmaz.

---

## 8. Her BOM kalemi açık miktar ve birim taşır

Her terminal BOM çıktısı en az şunları taşır:

- canonical BOM item kimliği,
- `quantity`,
- canonical `unit`.

Örnek birimler: `adet`, `m2`, `mt`, `paket`.

Miktar çıplak sayı olarak yorumlanmaz; birim tahmin edilmez.

Örnekler:

- TV: `2 adet`
- Baskı: `12.4 m2`
- Profil: `37.5 mt`
- Halı: alan + rulo enine göre gereken lineer metre
- Parke: alan + ürün geometrisine göre adet/paket
- Karolaj: köşe + kenar + orta eleman + sunta adetleri

---

## 9. Bileşik Item'lar recursive BOM çözümünü destekler

Bir Item başka Item'lardan oluşabilir; alt Item'lar da kendi BOM reçetelerine sahip olabilir.

BOM resolver gerektiğinde terminal BOM kalemlerine kadar recursive çözüm yapabilmelidir.

Döngüsel bağımlılık yasaktır:

```text
A -> B -> A   // geçersiz
```

---

## 10. BOM ile maliyet/fiyatlandırma ayrıdır

Item/BOM sistemi **ne gerektiğini, ne kadar gerektiğini ve birimini** üretir.

Maliyet/fiyatlandırma sistemi bu canonical BOM çıktısına fiyat uygular.

Birim fiyat değiştiğinde Item'ın BOM reçetesi değişmez.

---

# Yeni Item ekleme zorunlu kontrolü

Yeni bir fiziksel ürün, zemin, malzeme, kombinasyon veya üretilebilir öğe eklenmeden önce şu sorular cevaplanmalıdır:

1. `itemKey` nedir?
2. `type` / davranış ailesi nedir?
3. Tekil, bileşik ve/veya parametrik mi?
4. Canonical state/ölçü/parametreleri nerede tutulur?
5. Hangi behavior/capability contract'ını kullanır?
6. BOM reçetesi/resolver'ı nedir?
7. Terminal BOM birimleri nelerdir?
8. Proje instance override/konfigürasyonu gerekiyorsa canonical tanımdan nasıl ayrılır?
9. Render/asset temsili nedir ve business rule'dan nasıl ayrılır?
10. BOM, behavior, state, persistence ve browser akışı için hangi regression testleri gerekir?
11. Item'ın canonical factory/oluşturulma mekanizması nedir ve hangi girişleri çözer?
12. Hangi state alanları persistent, hangileri runtime/geçicidir; save/load ve migration nasıl çalışır?
13. Item'ın parent/child, neighbor, connection, host, corner veya diğer spatial relationship kuralları var mı ve canonical resolver'ı nedir?
14. Relationship değiştiğinde reflow veya başka relationship-derived davranış oluşuyor mu; tetiklenme ve etki kuralları nelerdir?

Bu sorular cevaplanmadan yeni Item işi tamamlanmış sayılamaz.

# Mimari ilişki

```text
Project
  -> Items
      -> canonical itemKey
      -> creation / factory
      -> type / behavior family
      -> project instance state + params
      -> persistence
      -> relationships
          -> relationship-derived behavior / reflow
      -> BOM resolver
          -> terminal BOM items (quantity + unit)
              -> pricing / costing
```

Bu belge Item semantiğinin ve BOM sahipliğinin canonical sözleşmesidir. Sayısal runtime davranışlarının ikinci kopyası değildir; ayrıntılı runtime değerleri ilgili canonical kod kaynaklarından okunur.

---

# BÖLÜM II — ITEM ANALYSIS / VALIDATION CHECKLIST

Bu checklist her Item incelenirken kullanılacaktır.

Amaç: Mevcut sistemde Item'ın ne olduğunu, nasıl davrandığını, nasıl üretildiğini ve yeni Item mimarisine nasıl taşınacağını sistemden çıkararak kayıt altına almak.

Her kontrol için cevap mevcut sistemden çıkarılır. Bir alan Item için geçerli değilse bu da açıkça belirtilir; alan sessizce atlanmaz.

---

# 1. Kimlik ve sınıflandırma

Bu bölüm Item'ın canonical olarak **hangi ürün olduğunu** ve hangi davranış ailesine bağlandığını doğrular.

### ☐ `itemKey`
Canonical ürün kimliği nedir?

### ☐ `type`
Davranış ailesi nedir?

### ☐ Item sınıfı
- ☐ Terminal Item
- ☐ Composite Item
- ☐ Parametric Item

Gerekirse bir Item aynı anda bileşik ve parametrik olabilir; sınıf mevcut gerçek yapıya göre belirlenir.

### ☐ Factory / oluşturulma noktası
Item instance'ını hangi mevcut factory/resolver/builder oluşturuyor? Default state ve instance kimliği hangi kaynaktan geliyor?

### ☐ Catalog bağlantısı
Mevcut catalog tanımı varsa canonical ürün kimliğiyle nasıl eşleşiyor?

---

# 2. State ve veri modeli

Bu bölüm Item'ın proje içinde **gerçekte hangi verileri taşıdığını** doğrular.

### ☐ Instance state yapısı
Instance üzerinde hangi alanlar var?

### ☐ Default değerler
Yeni instance oluşturulduğunda sistem hangi varsayılanları veriyor?

### ☐ Ölçüler / geometry bilgileri
Gerçek genişlik, yükseklik, derinlik veya Item'a özgü diğer ölçüler nerede tanımlı?

### ☐ Configurable alanlar
Hangi state/parametreler proje içinde değiştirilebiliyor?

### ☐ Persistence
Hangi alanlar proje state'ine kaydediliyor? Hangi alanlar runtime/geçici?

### ☐ Save / load ve migration
Project yeniden açıldığında Item nasıl geri kuruluyor; eski/geçersiz state için validation veya migration nerede?

### ☐ ID üretimi ve instance mantığı
Project instance `id` nasıl üretiliyor ve canonical `itemKey`'den nasıl ayrılıyor?

### ☐ Alt state / child state
Item'ın kendi içinde ayrıca state taşıyan alt yüzeyleri, alt parçaları veya child Item'ları var mı?

---

# 3. Davranış (Behavior)

Bu bölüm Item'ın mevcut runtime/editor davranışını doğrular. Mevcut sistemde behavior ailesinin canonical kaynağı `src/moduleBehavior.js`'dir; Item mimarisine geçişte aynı tek-kaynak ilkesi korunur.

### ☐ Behavior kaynağı
Hangi `type` / behavior family kullanılıyor? Item'a özel mevcut override varsa ayrıca kaydedilir.

### ☐ Placement tipi
Mevcut sistemde gerçek placement değeri nedir? Örneğin mevcut runtime'da `wall`, `free`, `wall-overlay`, `top` gibi değerler kullanılır; ilgili Item için gerçek değer kaynaktan okunur.

### ☐ Hareket davranışı
Item taşınabiliyor mu; hareket serbest mi yoksa wall/host/başka constraint'e bağlı mı?

### ☐ Snap değeri
Mevcut move snap değeri/kuralı nedir?

### ☐ Rotation desteği
Item dönebiliyor mu?

### ☐ Rotation step
Dönüş adımı nedir?

### ☐ Default rotation
Başlangıç yönü nedir?

### ☐ Sağ / sol dönüş mantığı
Saat yönü ve ters yön dönüşü mevcut resolver/interaction içinde nasıl çözülüyor?

### ☐ Collision
Collision stratejisi nedir?

### ☐ Collision depth / endpoint contact
Mevcut behavior contract'ında bu alanlar kullanılıyorsa Item için değerleri nedir?

### ☐ Magnetic snap
Var mı; değeri nedir?

### ☐ Boundary snap
Var mı; değeri nedir?

### ☐ Connection endpoint
Bağlantı endpoint modeli nedir?

### ☐ Side insert
Yanına Item ekleme capability'si var mı?

### ☐ Side insert rotation
Yan eklemede orientation kuralı nedir?

### ☐ Overlap kuralları
Hangi type'larla overlap izinli/yasak?

### ☐ Wall capacity / host capability
Mevcut behavior'da uygulanıyorsa wall capacity ve wall-overlay host capability değerleri nedir?

### ☐ Ghost / preview
Preview davranışı, renderer'ı ve mevcut değerleri nedir?

---

# 4. Kullanıcı etkileşimleri (Interaction)

Bu bölüm Item üzerinde **kullanıcının gerçekten hangi işlemleri yapabildiğini** mevcut UI/scene/controller akışından doğrular.

### ☐ Sol click davranışı
Sol click Item veya alt yüzey üzerinde ne yapıyor?

### ☐ Seçim tipi
- ☐ Tek seçim
- ☐ Multi seçim
- ☐ Panel / alt parça seçimi

Geçerli olmayan seçim tipleri açıkça belirtilir.

### ☐ Drag davranışı
Drag akışında Item'a ait hangi işlem gerçekleşiyor?

### ☐ Sağ click davranışı
Sağ click hangi interaction/context akışını açıyor?

### ☐ Context menu içeriği
Item/type/capability için mevcut sistemde görünen gerçek komutlar nelerdir?

### ☐ Yapılabilir işlemler
Aşağıdaki işlemler tek tek kontrol edilir; mevcut olmayanlar da açıkça kaydedilir:

- ☐ Sil
- ☐ Çoğalt
- ☐ Taşı
- ☐ Döndür
- ☐ Renk değiştir
- ☐ Görsel değiştir
- ☐ Alt Item ekle

### ☐ Keyboard interaction
Item'ı etkileyen mevcut keyboard shortcut veya interaction var mı?

### ☐ Duplicate davranışı
Varsa hangi state korunuyor, hangi instance/alt-state ID'leri yeniden üretiliyor?

### ☐ Delete davranışı
Silme yalnız hedef Item'ı mı etkiliyor; relationship/reflow/child-state sonucu var mı?

---

# 5. Görsel / Renderer

Bu bölüm Item'ın görünümünün hangi mevcut state ve renderer kaynağından geldiğini doğrular.

### ☐ Renderer tipi
- ☐ Procedural
- ☐ Model
- ☐ Specialized

Mevcut contract başka bir mode kullanıyorsa gerçek değer aynen kaydedilir.

### ☐ Asset bağlantısı
Model/GLB/image/texture veya başka asset varsa hangi kaynaktan geliyor?

### ☐ Renk davranışı
Renk fixed/editable/state-backed veya başka bir mevcut mode mu?

### ☐ Görsel/image davranışı
Image capability var mı; state ve renderer bağlantısı nedir?

### ☐ Özel görsel modları
Item için mevcut sistemden tek tek kontrol edilir:

- ☐ Cam
- ☐ Lightbox
- ☐ Mesh
- ☐ LED

### ☐ Özel modların birlikte kullanım kuralı
Birbirini dışlayan veya birlikte çalışan mode'lar varsa gerçek kural nedir?

### ☐ Ghost / preview davranışı
Behavior bölümündeki preview görsel olarak nasıl uygulanıyor?

### ☐ Renderer / business-state ayrımı
Renderer veya mesh business state/BOM kaynağı haline gelmiş mi? Contract gereği canonical business state ayrı tutulmalıdır.

---

# 6. Item ilişkileri

Bu bölüm Item'ın başka Item'larla kurduğu mevcut canonical veya fiili ilişkiyi doğrular.

### ☐ İçindeki Item'lar
Composite Item ise hangi canonical alt Item'lardan oluşuyor?

### ☐ Bağlandığı Item'lar
Connection/mount/host ilişkileri var mı?

### ☐ Parent-child ilişkisi
Parent ve child rolleri mevcut mu?

### ☐ Komşuluk ilişkileri
Neighbor ilişkisi placement, davranış veya BOM'u etkiliyor mu?

### ☐ Köşe / bağlantı kuralları
Corner veya başka connection durumu var mı?

### ☐ Host / overlay ilişkisi
Başka Item'a mount olma veya başka Item'a host olma durumu var mı?

### ☐ Continuous chain / reflow
Item mevcut sistemde bir zincir/reflow davranışına katılıyor mu?

### ☐ Relationship resolver ihtiyacı / kaynağı
İlişki bugün hangi kaynakta çözülüyor? Canonical resolver eksikse bu açık problem olarak işaretlenir.

### ☐ Relationship değişim sonuçları
Ekleme, taşıma, döndürme veya silme komşu Item'ların konumunu/state'ini etkiliyor mu?

### ☐ Relationship-derived BOM
İlişki BOM'u değiştiriyor mu? Değiştiriyorsa mevcut resolver var mı, yoksa açık mı?

---

# 7. BOM / Üretim

Bu bölüm Item'ın canonical üretim çıktısını doğrular.

### ☐ BOM var mı?
Mevcut Item/module contract'ında BOM policy tanımlı mı?

### ☐ BOM policy
Mevcut sistemde kullanılan gerçek policy kaydedilir. Mevcut module contract altyapısında örneğin `recipe` ve `decision-required` durumları vardır; Item için gerçek durum kaynaktan okunur.

### ☐ Recipe kaynağı
Recipe kullanılıyorsa canonical sahibi nerede?

### ☐ BOM resolver kaynağı
BOM hangi resolver üzerinden çözülüyor?

### ☐ Alt Item listesi
Composite ise hangi canonical Item'ları içeriyor?

### ☐ Quantity
Her terminal BOM kaleminin miktarı nedir?

### ☐ Unit
Her terminal BOM kaleminin canonical birimi nedir?

### ☐ Recursive BOM
Child Item'ların kendi BOM'u varsa terminal Item'lara kadar çözüm kuralı var mı?

### ☐ Circular dependency
Recursive Item zincirinde döngü engelleniyor mu?

### ☐ Varyant BOM'ları
- ☐ Normal
- ☐ Köşe
- ☐ Bağlantı
- ☐ Özel durum

Mevcut sistemde başka gerçek varyant varsa ayrıca kaydedilir.

### ☐ State/ölçü/parametre kaynaklı BOM
BOM gerçek Item state/ölçü/konfigürasyonundan mı hesaplanıyor?

### ☐ Relationship-derived BOM
Komşuluk, corner, connection veya başka relationship BOM sonucunu değiştiriyorsa mevcut canonical çözüm durumu nedir?

### ☐ Final BOM bağlantısı
Item'ın raw/recipe çıktısı ile project-level Final BOM arasındaki mevcut durum nedir? Eksikse açık problem olarak kaydedilir.

---

# 8. Maliyet / fiyatlandırma ayrımı

Bu bölüm Item/BOM ile pricing sorumluluğunun contract'a uygun biçimde ayrıldığını doğrular.

### ☐ BOM yalnız ihtiyaç, miktar ve birim üretiyor mu?

### ☐ Fiyatlandırma ayrı bir katmanda mı?

### ☐ Birim fiyat değişikliği BOM reçetesini değiştirmeden yapılabiliyor mu?

---

# 9. Test ve kalite

Bu bölüm mevcut davranışın hangi testlerle korunduğunu doğrular.

### ☐ Mevcut testler
Item veya behavior family için hangi testler var?

### ☐ State testleri
Factory/default/state mutation/persistence davranışı test ediliyor mu?

### ☐ Behavior testleri
Placement, move, snap, rotation, collision, connection vb. testleri var mı?

### ☐ Interaction testleri
Selection, drag, context menu, keyboard veya ilgili browser etkileşimleri test ediliyor mu?

### ☐ Relationship / reflow testleri
Relationship-derived davranış varsa test ediliyor mu?

### ☐ BOM testleri
Recipe/resolver/varyant/recursive BOM testleri var mı?

### ☐ Regression testleri
Mevcut davranış değişikliğini yakalayacak regression koruması var mı?

### ☐ Persistence / migration testleri
Save/load ve migration davranışı test ediliyor mu?

### ☐ Browser akışı
Item'ın kritik kullanıcı akışı browser seviyesinde test ediliyor mu?

### ☐ Build durumu
İlgili branch/commit için build/test sonucu nedir?

---

# 10. Açık problemler

Bu bölüm mevcut sistemde Item contract'a göre eksik veya kararsız noktaları kaydeder.

### ☐ Audit finding bağlantıları
Item'ı etkileyen açık finding'ler hangileri?

### ☐ Eksik davranışlar
Mevcut sistemde tamamlanmamış veya contract'a göre eksik behavior var mı?

### ☐ Karar bekleyen noktalar
Ürün/mimari kararı gereken alan var mı?

### ☐ Yeni Item sistemine taşınacak işler
Legacy module/floor/başka yapıdan canonical Item modeline taşınması gereken noktalar nelerdir?

### ☐ Duplicate source-of-truth
Kimlik, ölçü, state, behavior, relationship veya BOM kuralı birden fazla yerde kopyalanmış mı?

---

# BÖLÜM III — ITEM TAMAMLANMA KRİTERİ

Bir Item ancak aşağıdaki konular sistemden doğrulanıp kayıt altına alındığında tamamlanmış kabul edilir:

1. Canonical `itemKey`, `type` ve Item sınıfı.
2. Factory/oluşturulma noktası ve catalog bağlantısı.
3. Instance state, default değerler, gerçek ölçüler ve configurable alanlar.
4. Persistence, save/load, migration ve instance-ID mantığı.
5. Behavior kaynağı.
6. Placement ve hareket davranışı.
7. Rotation desteği, rotation step, default rotation ve gerçek dönüş interaction'ları.
8. Collision, snap, boundary, connection, overlap ve ilgili behavior capability'leri.
9. Sol click, selection, drag, sağ click, context menu, keyboard ve diğer gerçek kullanıcı interaction'ları.
10. Renderer, asset, renk, image ve varsa özel görsel modlar.
11. Parent/child, neighbor, connection, host, corner veya continuous-chain ilişkileri.
12. Relationship-derived behavior/reflow sonucu.
13. BOM policy, recipe/resolver, alt Item'lar, quantity ve unit.
14. Composite Item ise recursive BOM çözümü.
15. Varyant veya relationship-derived BOM durumu.
16. BOM ile pricing ayrımı.
17. Mevcut testler, regression koruması ve build durumu.
18. Açık audit/migration problemleri.

Bir alan bu Item için geçerli değilse sonuç **uygulanmıyor** olarak açıkça kaydedilir; kontrol sessizce atlanmaz.

Tahmin edilen davranış veya BOM değeri kabul edilmez. Item'a özgü değerler ilgili canonical kod/state/recipe/test kaynağından doğrulanır.

---

# Mevcut sistemde doğrulama için ana kaynaklar

Bugünkü module tabanlı sistem incelenirken başlıca canonical/aktif kaynaklar şunlardır:

- Kimlik, label, type ve nominal catalog verileri: `src/catalog.js`
- Contract profile, state owner/persistence, appearance/renderer ve BOM policy: `src/moduleContracts.js`
- State factory/default/instance verileri: `src/designState.js`
- Placement/move/rotation/collision/snap/ghost ve diğer behavior: `src/moduleBehavior.js` ve ilgili placement akışı
- Recipe BOM: `src/moduleRecipes.js`
- Terminal üretim parçaları ve ölçüleri: `src/productionParts.js`
- Context menu: `src/moduleContextMenu.js`
- Scene/selection/render interaction'ları: `src/scene3d.js` ve ilgili interaction dosyaları
- Regression doğrulaması: `test/` altındaki ilgili testler

Bu kaynak listesi yeni Item mimarisinin nihai dosya yerleşimini zorunlu kılmaz; mevcut sistemi tahmin etmeden analiz etmek için kullanılan bugünkü kaynak haritasıdır.
