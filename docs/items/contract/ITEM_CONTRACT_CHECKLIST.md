# Fair Stand — Item Contract & Validation Checklist

Bu belge Fair Stand içindeki **canonical Item sözleşmesini** ve her Item için uygulanacak **zorunlu doğrulama checklist'ini** tek dosyada toplar.

Amaç:

1. `ITEM_CONTRACT.md` içindeki Item kurallarını eksiksiz korumak.
2. `ITEM_ANALYSIS_CHECKLIST.md` içindeki kontrol alanlarını aynı sözleşmenin altında açıklamalı hale getirmek.
3. Her Item incelenirken cevabı tahmin etmek yerine mevcut canonical kod, state, contract, recipe, production-part ve test kaynaklarından çıkarmak.
4. Item'ı ilgilendiren mevcut ürün/default özelliklerinin canonical Item tanımına taşındığını ve gerçek tüketicilerin bu canonical kaynağı kullandığını zorunlu olarak doğrulamak.

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

## 2. Item kendisini ilgilendiren canonical ürün/default özelliklerinin sahibidir

Bir Item'ı ürün olarak tanımlayan ve mevcut sistemde gerçek bir değeri bulunan intrinsic/default özellikler canonical Item tanımında tutulur.

Bu kapsam yalnızca zorunlu bir sabit alan listesi değildir. Item için gerçekten mevcut olan özellikler sistemden çıkarılır ve ilgili Item'a taşınır. Örnekler:

- `name`, `type`, `unit`,
- `dimensions.widthCm`, `heightCm`, `depthCm`, `lengthCm`, `thicknessCm`,
- `defaultColor`,
- `material`,
- ağırlık, yüzey, ürün ailesine özgü sınıflandırma veya başka intrinsic metadata,
- Item'ın canonical default state/parametreleri,
- Item/type behavior ve capability bağlantıları,
- gerekiyorsa asset/model/reference metadata'sı.

Bir özellik bütün Item'lar için zorunlu olmak zorunda değildir. Örneğin `defaultColor` bir Item'da olabilir, başka bir Item'da olmayabilir. Ancak mevcut sistemde Item'ın ürün/default özelliği olarak bir değer varsa migration sırasında sessizce dışarıda bırakılamaz.

### Canonical source-of-truth ve tüketim kuralı

Item'a ait canonical intrinsic/default bir özellik başka bir runtime dosyasında bağımsız ikinci business/product source-of-truth olarak tutulmaz. Bu özelliğe ihtiyaç duyan BOM, state factory, UI, behavior, resolver veya başka business tüketicisi canonical Item kaynağından tüketmelidir.

Renderer veya specialized render kodu görsel/teknik nedenle farklı bir değer kullanabilir. Project instance da kullanıcı/konfigürasyon nedeniyle canonical default'u override edebilir. Override geçerlidir; fakat canonical default değerin Item'daki sahipliğini kaldırmaz ve Item tanımını değiştirmez.

Örnek:

```text
canonical Item:
  thicknessCm = 1.8
  defaultColor = 0xf8fafc

project/runtime override:
  thicknessCm = 3     // belirli instance/karar mekanizması izin veriyorsa
  color = başka renk  // kullanıcı veya runtime override

specialized renderer:
  renderThickness = 4 // yalnız görsel/teknik temsil olabilir
```

Bu durumda canonical ürün gerçeği Item'da kalır. Override'ın kaynağı, kapsamı ve persistence davranışı ayrıca tanımlanır.

---

## 3. Her Item kendi BOM çıktısının canonical sahibidir

Her `Item`, BOM'a nasıl dönüştüğünü tek bir canonical reçete/resolver üzerinden tanımlar.

Bir Item:

- doğrudan tek BOM kalemi üretebilir,
- birden fazla BOM kalemine ayrılabilir,
- başka Item'lardan oluşabilir,
- ölçü veya konfigürasyona göre parametrik BOM üretebilir.

Aynı BOM kuralı controller, renderer, UI veya başka yardımcı dosyalarda ikinci kez tanımlanmaz.

---

## 4. Item tekil veya bileşiktir; ayrıca parametrik olabilir

- **Tekil Item:** sistem açısından başka Item'lardan oluşmayan Item'dır. Örn. kettle, `connector_start`, panel, TV. Başka bir Item'ın reçetesinde kullanılması onu farklı bir sınıfa dönüştürmez; o bağlamda yalnızca parent Item'ın alt Item'ıdır.
- **Bileşik Item:** başka Item'lardan oluşan Item'dır. Canonical composition/reçetesi hangi alt Item'lardan ve hangi miktarlardan oluştuğunu tanımlar. Örn. `wall_200`; vitrinli bir sistem aynı temel Item'lara ek olarak cam, raf ve vitrine özel başka Item'lar içerebilir.
- **Parametrik:** ayrı bir üçüncü Item sınıfı değildir. Tekil veya bileşik bir Item'ın ölçü, state veya konfigürasyona göre miktarının/bileşiminin değişebildiğini belirtir.

Bir Item yapısal olarak ya tekil ya bileşiktir; her iki yapı da parametrik olabilir.

---

## 5. Her Item'ın stabil canonical kimliği vardır

Her Item tanımı tek ve stabil bir canonical `itemKey` taşır.

`itemKey` ürünün tam kimliğidir; `type` davranış ailesidir; proje içindeki `id` ise instance kimliğidir.

Örnek:

```text
itemKey = TV_42
type    = tv
id      = item-<project-instance>
```

Mevcut `catalogKey` alanı ürün kimliği değildir; runtime onu okumaz ve yazmaz.

---

## 6. Canonical Item tanımı ile proje Item instance'ı ayrıdır

Canonical tanım varsayılan ürünü/reçeteyi tanımlar. Projedeki instance kendi `id`, ölçü, adet ve konfigürasyonunu taşıyabilir.

Örneğin standart masa-sandalye seti `1 masa + 4 sandalye` olabilir; belirli projede `1 masa + 2 sandalye` olarak kullanılabilir. Bu proje konfigürasyonu canonical ürün tanımını değiştirmez.

Override edilebilir alanlar açıkça tanımlanır. Override uygulanması canonical Item property'sini silmez, kopya source-of-truth yaratmaz; effective value resolver/default→override mantığıyla çözülür.

---

## 6A. Her Item'ın canonical oluşturulma mekanizması tanımlıdır

Bir Item'ın proje instance'ına nasıl dönüştürüldüğü tek ve izlenebilir bir oluşturulma yolu üzerinden tanımlanmalıdır.

Bu oluşturulma mekanizması factory, resolver, builder veya eşdeğer bir canonical üretim noktası olabilir; isimden bağımsız olarak aynı Item için paralel ve çelişen instance oluşturma kuralları bulunmaz.

Oluşturulma mekanizması en az şu sorumlulukları açıkça çözmelidir:

- canonical `itemKey` ve `type` bilgisinden doğru Item instance'ını üretmek,
- gerekli default state/ölçü/parametreleri canonical Item'dan uygulamak,
- izin verilen project/runtime override'larını default değerlerden ayrı çözmek,
- yeni proje instance `id` değerini üretmek veya bağlamak,
- Item'a özgü alt state/child state gerekiyorsa bunları canonical kurala göre oluşturmak,
- catalog veya başka giriş noktalarından gelen tanımı tek canonical Item kimliğine çözmek.

Factory/oluşturma mantığı UI, renderer veya farklı controller akışlarında ikinci kez kopyalanmaz.

---

## 6B. Her Item'ın persistence sözleşmesi tanımlıdır

Bir Item'ın hangi proje verilerinin kalıcı olduğu ve save/load sonrasında nasıl geri kurulduğu açıkça tanımlanmalıdır.

Persistence sözleşmesi en az şunları belirtmelidir:

- hangi Item state/override alanlarının proje state'ine kaydedildiği,
- canonical default ile project override'ın nasıl ayrıldığı,
- hangi alanların runtime/geçici olduğu ve kaydedilmediği,
- proje yeniden açıldığında canonical Item kimliği ile instance state'in nasıl tekrar eşleştirildiği,
- alt Item/alt state/relationship referanslarının nasıl korunduğu,
- eski veya geçersiz state için validation/migration kuralının nerede olduğu.

Renderer, mesh veya geçici UI state'i persistent business state'in yerine geçmez.

---

## 7. Item davranışı `type` seviyesinde tanımlanır

Placement, move, rotation, side insert, collision, ghost, context-menu capability ve benzeri Item'a özgü editor/runtime davranışları canonical olarak davranış ailesi (`type`) seviyesinde tanımlanır.

Aynı davranış ailesindeki Item'lar aynı contract'ı kullanır.

Davranış gerçekten farklıysa yeni bir davranış ailesi/type tanımlanır. Item bazlı dağınık `if (itemKey === ...)` veya sürekli override normal mimari yöntem değildir.

Item tanımı hangi `type` / behavior family / capability contract'ını kullandığını açıkça taşır veya tek canonical resolver üzerinden çözer. UI, context menu ve runtime aynı canonical behavior/capability kaynağını tüketir.

Mevcut module behavior altyapısında bu sorumluluğun canonical runtime sahibi `src/moduleBehavior.js`, sözleşme belgesi `MODULE_BEHAVIOR_STANDARD.md` dosyasıdır; Item mimarisine geçiş bu tek-kaynak ilkesini bozmaz.

---

## 7A. Item-to-Item spatial relationship canonical olarak tanımlanır

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

## 8. BOM gerçek Item state/ölçü/parametrelerinden hesaplanır

BOM ve üretim hesabının source of truth'u Item'ın canonical özellikleri ile gerçek instance state/override/parametreleri ve konfigürasyonudur.

Render, mesh, GLB, texture, piksel çözünürlüğü veya ekrandaki görünüm BOM'un canonical kaynağı değildir.

Örneğin altı panelde baskı varsa baskı m²'si panelin gerçek baskı alanından hesaplanır; texture çözünürlüğünden hesaplanmaz.

---

## 9. Her BOM kalemi açık miktar ve birim taşır

Her nihai BOM kalemi en az şunları taşır:

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

## 10. Bileşik Item'lar recursive BOM çözümünü destekler

Bir Item başka Item'lardan oluşabilir; alt Item'lar da kendi BOM reçetelerine sahip olabilir.

BOM resolver gerektiğinde başka Item bileşimi olmayan Item'lara kadar recursive çözüm yapabilmelidir; bunlar nihai BOM kalemlerini oluşturur.

Döngüsel bağımlılık yasaktır:

```text
A -> B -> A   // geçersiz
```

---

## 11. BOM ile maliyet/fiyatlandırma ayrıdır

Item/BOM sistemi **ne gerektiğini, ne kadar gerektiğini ve birimini** üretir.

Maliyet/fiyatlandırma sistemi bu canonical BOM çıktısına fiyat uygular.

Birim fiyat değiştiğinde Item'ın BOM reçetesi değişmez.

---

# Yeni Item ekleme zorunlu kontrolü

Yeni bir fiziksel ürün, zemin, malzeme, kombinasyon veya üretilebilir öğe eklenmeden önce şu sorular cevaplanmalıdır:

1. `itemKey` nedir?
2. `type` / davranış ailesi nedir?
3. Yapısal olarak tekil mi bileşik mi; ayrıca parametrik mi?
4. Mevcut sistemde Item'ı tanımlayan bütün intrinsic/default özellikler nelerdir ve canonical Item içinde nerede tutulur?
5. Ölçülerin bütün gerçek eksenleri ve ürün boyutları (`width/height/depth/length/thickness` ve Item'a özgü diğerleri) eksiksiz mi?
6. Mevcutsa `defaultColor`, `material` ve diğer ürün/default metadata'sı Item'a taşındı mı?
7. Her canonical property'nin gerçek business/runtime tüketicisi Item'dan mı okuyor?
8. Hangi property/state alanları override edilebilir; canonical default ile override nasıl ayrılır?
9. Hangi behavior/capability contract'ını kullanır?
10. BOM reçetesi/resolver'ı nedir?
11. Nihai BOM kalemlerinin birimleri nelerdir?
12. Render/asset temsili nedir; specialized renderer override'ı canonical Item property ownership'ından nasıl ayrılır?
13. BOM, behavior, state, persistence ve browser akışı için hangi regression testleri gerekir?
14. Item'ın canonical factory/oluşturulma mekanizması nedir ve hangi girişleri çözer?
15. Hangi state/override alanları persistent, hangileri runtime/geçicidir; save/load ve migration nasıl çalışır?
16. Item'ın parent/child, neighbor, connection, host, corner veya diğer spatial relationship kuralları var mı ve canonical resolver'ı nedir?
17. Relationship değiştiğinde reflow veya başka relationship-derived davranış oluşuyor mu; tetiklenme ve etki kuralları nelerdir?
18. Canonical property veya davranış başka bir yerde bağımsız ikinci source-of-truth olarak kopyalanmış mı?

Bu sorular cevaplanmadan yeni Item işi tamamlanmış sayılamaz.

# Mimari ilişki

```text
Project
  -> Items
      -> canonical itemKey
      -> canonical product/default properties
          -> dimensions / defaultColor / material / family-specific metadata
          -> default state / params
      -> creation / factory
          -> canonical defaults
          -> project/runtime overrides
      -> type / behavior family / capabilities
      -> project instance state + params
      -> persistence
      -> relationships
          -> relationship-derived behavior / reflow
      -> BOM resolver
          -> child Items / composition
              -> nihai BOM kalemleri (itemKey + quantity + unit)
              -> pricing / costing
```

Canonical property tüketimi kuralı:

```text
Item canonical property
    -> business/runtime consumer
    -> optional project/runtime override

specialized renderer override
    -> yalnız görünüm/teknik temsil olabilir
    -> canonical Item default'unu sahiplenmez
```

Bu belge Item semantiğinin, canonical property sahipliğinin ve BOM sahipliğinin canonical sözleşmesidir. Sayısal runtime davranışlarının ikinci kopyası değildir; ayrıntılı runtime değerleri ilgili canonical kod kaynaklarından okunur.

---

# BÖLÜM II — ITEM ANALYSIS / VALIDATION CHECKLIST

Bu checklist her Item incelenirken kullanılacaktır.

Amaç: Mevcut sistemde Item'ın ne olduğunu, hangi özelliklere sahip olduğunu, nasıl davrandığını, nasıl üretildiğini ve yeni Item mimarisine nasıl taşınacağını sistemden çıkararak kayıt altına almak.

Her kontrol için cevap mevcut sistemden çıkarılır. Bir alan Item için geçerli değilse bu da açıkça belirtilir; alan sessizce atlanmaz.

**Hard gate:** Item'ı ilgilendiren mevcut intrinsic/default bir property bulunmuş fakat canonical Item tanımında yoksa veya gerçek business tüketicisi halen bağımsız bir ikinci product/default değerini source-of-truth olarak kullanıyorsa Item migration'ı **TAMAM değildir**. Renderer/specialized görünüm override'ı bu kurala istisna olabilir; istisna açıkça renderer override olarak kaydedilir.

---

# 1. Kimlik ve sınıflandırma

Bu bölüm Item'ın canonical olarak **hangi ürün olduğunu** ve hangi davranış ailesine bağlandığını doğrular.

### ☐ `itemKey`
Canonical ürün kimliği nedir?

### ☐ `type`
Davranış ailesi nedir?

### ☐ Item yapısı
- ☐ Tekil Item
- ☐ Bileşik Item

Tekil Item sistem açısından başka Item bileşimi içermez. Bileşik Item canonical alt Item listesi/reçetesi taşır. Bir Item'ın başka bir Item içinde kullanılması onu ayrı bir sınıfa dönüştürmez; o kullanımda parent'ın alt Item'ıdır.

### ☐ Parametrik mi?
- ☐ Evet
- ☐ Hayır

Parametrik olmak ayrı bir Item sınıfı değildir; tekil veya bileşik Item'ın ölçü/state/konfigürasyona göre değişebilmesini belirtir.

### ☐ Factory / oluşturulma noktası
Item instance'ını hangi mevcut factory/resolver/builder oluşturuyor? Default state ve instance kimliği hangi kaynaktan geliyor?

### ☐ Catalog bağlantısı
Mevcut catalog tanımı varsa canonical ürün kimliğiyle nasıl eşleşiyor?

---

# 2. Canonical Item properties / ürün-default metadata

Bu bölüm **Item'ın kendisini ürün olarak tanımlayan bütün mevcut intrinsic/default özellikleri** zorunlu olarak çıkarır. Sabit bir global şema varsayılmaz; ilgili Item için sistemde bulunan bütün gerçek property'ler taranır.

### ☐ Canonical property envanteri
Mevcut sistemde bu Item'ı tanımlayan bütün intrinsic/default property'ler nelerdir? Her biri isim + değer + mevcut kaynak dosya ile listelenir.

### ☐ Dimensions eksiksizliği
Item için geçerli olan gerçek fiziksel boyutların her biri tek tek kontrol edilir:

- ☐ `widthCm`
- ☐ `heightCm`
- ☐ `depthCm`
- ☐ `lengthCm`
- ☐ `thicknessCm`
- ☐ Item ailesine özgü başka ölçü

Geçerli olmayan eksen **UYGULANMIYOR** olarak yazılır; mevcut bir ölçü toplu `dimensions var` denilerek geçilemez.

### ☐ `defaultColor`
Mevcut sistemde ürünün/default görünümün tanımlı bir rengi var mı? Varsa canonical Item metadata'sında mı? Yoksa `YOK/UYGULANMIYOR` açıkça yazılır. Bu alan bütün Item'lar için zorunlu değildir.

### ☐ `material`
Mevcut sistemde ürün malzemesi tanımlı mı? Varsa canonical Item metadata'sında mı? Yoksa tahmin edilmez.

### ☐ Diğer intrinsic metadata
Ağırlık, yüzey, panel rolü, connector türü, nominal ürün ölçüsü, göz sayısı veya Item ailesine özgü başka ürün özelliği var mı? Varsa canonical Item içinde veya canonical Item'a bağlı tek source-of-truth'ta temsil ediliyor mu?

### ☐ Canonical owner
Her intrinsic/default property'nin canonical sahibi gerçekten Item tanımı mı? Item'a ait product/default değeri renderer, UI, controller veya başka yardımcı dosyada bağımsız ikinci canonical değer olarak mı tutuluyor?

### ☐ Gerçek consumer cutover
Bu property'ye business/runtime olarak ihtiyaç duyan gerçek tüketiciler canonical Item property/resolver yolunu kullanıyor mu? `Item'da da var ama gerçek consumer başka sabiti kullanıyor` durumu varsa migration tamam değildir.

Renderer/specialized rendering yalnız görsel/teknik override yapıyorsa bu **renderer override** olarak kaydedilir ve consumer-cutover gap'i sayılmaz; renderer business/product source-of-truth haline gelmemelidir.

### ☐ Override capability
Hangi property'ler project instance, kullanıcı tercihi, decision mechanism veya runtime tarafından override edilebilir?

### ☐ Effective value çözümü
Override varsa effective değer nasıl çözülüyor? En azından mantık açık olmalıdır:

```text
canonical Item default
→ varsa project/runtime override
→ effective business value
```

Specialized renderer ayrıca kendi render override'ını uygulayabilir; bu business effective value ile aynı kavram olmak zorunda değildir.

### ☐ Override persistence
Override edilen değer kalıcı mı? Save/load sonrasında korunuyor mu, yoksa runtime/geçici mi?

### ☐ Property regression
Canonical intrinsic/default property'lerin Item içinde bulunduğunu, doğru değerleri taşıdığını ve gerekli gerçek tüketicilerin canonical yolu kullandığını koruyan regression var mı?

---

# 3. State ve veri modeli

Bu bölüm Item'ın proje içinde **gerçekte hangi verileri taşıdığını** doğrular.

### ☐ Instance state yapısı
Instance üzerinde hangi alanlar var?

### ☐ Default değerler
Yeni instance oluşturulduğunda sistem hangi varsayılanları veriyor? Bu default'ların Item'a ait olanları canonical Item property/default kaynağından mı geliyor?

### ☐ Ölçüler / geometry bilgileri
Instance'ta effective olarak kullanılan gerçek genişlik, yükseklik, derinlik veya Item'a özgü diğer ölçüler nelerdir? Canonical Item default ile override ayrımı nedir?

### ☐ Configurable / override alanlar
Hangi state/parametreler proje içinde değiştirilebiliyor? Bunlardan hangileri canonical Item default'unu override ediyor?

### ☐ Persistence
Hangi alanlar proje state'ine kaydediliyor? Hangi alanlar runtime/geçici?

### ☐ Save / load ve migration
Project yeniden açıldığında Item nasıl geri kuruluyor; canonical defaults + persisted overrides nasıl birleştiriliyor; eski/geçersiz state için validation veya migration nerede?

### ☐ ID üretimi ve instance mantığı
Project instance `id` nasıl üretiliyor ve canonical `itemKey`'den nasıl ayrılıyor?

### ☐ Alt state / child state
Item'ın kendi içinde ayrıca state taşıyan alt yüzeyleri, alt parçaları veya child Item'ları var mı?

---

# 4. Davranış (Behavior)

Bu bölüm Item'ın mevcut runtime/editor davranışını doğrular. Mevcut sistemde behavior ailesinin canonical kaynağı `src/moduleBehavior.js`'dir; Item mimarisine geçişte aynı tek-kaynak ilkesi korunur.

### ☐ Behavior kaynağı
Hangi `type` / behavior family kullanılıyor? Item tanımı bu behavior/capability kaynağına canonical olarak nasıl bağlanıyor? Item'a özel mevcut override varsa ayrıca kaydedilir.

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

### ☐ Behavior consumer cutover
UI, context menu, move/placement ve ilgili runtime tüketicileri aynı canonical behavior/capability kaynağını mı kullanıyor? Paralel ikinci behavior rule varsa açık gap olarak işaretlenir.

---

# 5. Kullanıcı etkileşimleri (Interaction)

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
Item/type/capability için mevcut sistemde görünen gerçek komutlar nelerdir? Bu capability'ler canonical Item/type davranış kaynağından mı çözülüyor?

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
Varsa hangi state/override korunuyor, hangi instance/alt-state ID'leri yeniden üretiliyor?

### ☐ Delete davranışı
Silme yalnız hedef Item'ı mı etkiliyor; relationship/reflow/child-state sonucu var mı?

---

# 6. Görsel / Renderer

Bu bölüm Item'ın görünümünün hangi mevcut state, canonical Item default ve renderer kaynağından geldiğini doğrular.

### ☐ Renderer tipi
- ☐ Procedural
- ☐ Model
- ☐ Specialized

Mevcut contract başka bir mode kullanıyorsa gerçek değer aynen kaydedilir.

### ☐ Asset bağlantısı
Model/GLB/image/texture veya başka asset varsa hangi kaynaktan geliyor? Item'a ait canonical asset/reference metadata'sı varsa Item tanımında mı?

### ☐ Renk davranışı
Canonical `defaultColor` varsa Item'dan mı geliyor? Instance/user color override varsa nerede tutuluyor? Renderer-specific color override varsa ayrıca ve açıkça belirtilir.

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

### ☐ Renderer override sınırı
Renderer canonical Item property'den farklı bir render değeri kullanıyor mu? Kullanıyorsa bu değer yalnız görsel/teknik override mı, yoksa yanlışlıkla product/business source-of-truth haline mi gelmiş?

### ☐ Renderer / business-state ayrımı
Renderer veya mesh business state/BOM kaynağı haline gelmiş mi? Contract gereği canonical business/default property Item'da; effective project state/override ise canonical state katmanında tutulmalıdır.

---

# 7. Item ilişkileri

Bu bölüm Item'ın başka Item'larla kurduğu mevcut canonical veya fiili ilişkiyi doğrular.

### ☐ İçindeki Item'lar
Bileşik Item ise hangi canonical alt Item'lardan oluşuyor?

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

# 8. BOM / Üretim

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
Bileşik ise hangi canonical Item'ları içeriyor?

### ☐ Quantity
Her nihai BOM kaleminin miktarı nedir?

### ☐ Unit
Her nihai BOM kaleminin canonical birimi nedir?

### ☐ Recursive BOM
Alt Item'ların kendi bileşimi/BOM'u varsa başka Item bileşimi olmayan Item'lara kadar recursive çözüm kuralı var mı?

### ☐ Circular dependency
Recursive Item zincirinde döngü engelleniyor mu?

### ☐ Varyant BOM'ları
- ☐ Normal
- ☐ Köşe
- ☐ Bağlantı
- ☐ Özel durum

Mevcut sistemde başka gerçek varyant varsa ayrıca kaydedilir.

### ☐ State/ölçü/parametre kaynaklı BOM
BOM canonical Item property/default + gerçek Item instance state/override/konfigürasyonundan mı hesaplanıyor?

### ☐ Relationship-derived BOM
Komşuluk, corner, connection veya başka relationship BOM sonucunu değiştiriyorsa mevcut canonical çözüm durumu nedir?

### ☐ Final BOM bağlantısı
Item'ın raw/recipe çıktısı ile project-level Final BOM arasındaki mevcut durum nedir? Eksikse açık problem olarak kaydedilir.

### ☐ Gerçek BOM consumer cutover'ı
Yeni Item/recipe/resolver yolu yalnız tanımlanmış olmakla tamamlanmış sayılmaz. Raw BOM, Final BOM, debug veya ilgili gerçek tüketici hangi kaynağı kullanıyorsa yeni canonical kimlik/bileşim/property yolunu gerçekten tükettiği doğrulanır. Kullanılmayan resolver veya paralel ikinci BOM yolu tamamlanmış migration sayılmaz.

---

# 9. Maliyet / fiyatlandırma ayrımı

Bu bölüm Item/BOM ile pricing sorumluluğunun contract'a uygun biçimde ayrıldığını doğrular.

### ☐ BOM yalnız ihtiyaç, miktar ve birim üretiyor mu?

### ☐ Fiyatlandırma ayrı bir katmanda mı?

### ☐ Birim fiyat değişikliği BOM reçetesini değiştirmeden yapılabiliyor mu?

---

# 10. Test ve kalite

Bu bölüm mevcut davranışın hangi testlerle korunduğunu doğrular.

### ☐ Mevcut testler
Item veya behavior family için hangi testler var?

### ☐ Canonical property testleri
Intrinsic/default Item property'leri (`dimensions`, `thickness`, varsa `defaultColor`, `material` ve aileye özgü metadata) doğru Item üzerinde ve doğru değerlerle kilitli mi?

### ☐ Property consumer testleri
Business/runtime tüketicisinin canonical Item property yolunu kullandığını, eski duplicate/default sabite geri dönemeyeceğini koruyan regression var mı?

### ☐ Override testleri
Override desteklenen property/state için canonical default'un değişmeden kaldığı ve effective override davranışının doğru çalıştığı test ediliyor mu?

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

### ☐ Item-by-Item migration izolasyonu
Yalnız hedef Item'ın yeni canonical kimlik/yola geçtiği; henüz migrate edilmeyen Item'ların mevcut kimlik/yolunda kaldığı test ile doğrulanıyor mu? Bir Item migration'ı komşu Item'ları sessizce toplu migrate etmemelidir.

### ☐ Persistence / migration testleri
Save/load ve migration davranışı test ediliyor mu?

### ☐ Browser akışı
Item'ın kritik kullanıcı akışı browser seviyesinde test ediliyor mu?

### ☐ Build durumu
İlgili branch/commit için build/test sonucu nedir?

---

# 11. Açık problemler

Bu bölüm mevcut sistemde Item contract'a göre eksik veya kararsız noktaları kaydeder.

### ☐ Audit finding bağlantıları
Item'ı etkileyen açık finding'ler hangileri?

### ☐ Eksik canonical properties
Mevcut sistemde Item'a ait olduğu doğrulanan fakat canonical Item tanımına taşınmamış property var mı?

### ☐ Eksik consumer cutover
Item property canonical tanımda bulunmasına rağmen gerçek business/runtime consumer hâlâ başka bir product/default sabitinden mi besleniyor?

### ☐ Eksik davranışlar
Mevcut sistemde tamamlanmamış veya contract'a göre eksik behavior var mı?

### ☐ Karar bekleyen noktalar
Ürün/mimari kararı gereken alan var mı? Doğrulanmamış `material`, renk veya ölçü tahmin edilmez; karar bekleyen alan olarak yazılır.

### ☐ Yeni Item sistemine taşınacak işler
Legacy module/floor/başka yapıdan canonical Item modeline taşınması gereken noktalar nelerdir?

### ☐ Duplicate source-of-truth
Kimlik, intrinsic/default property, ölçü, state, behavior, relationship veya BOM kuralı birden fazla yerde canonical/business source-of-truth olarak kopyalanmış mı?

### ☐ Override mı duplicate mı?
Başka yerde farklı bir değer bulunuyorsa gerçekten izin verilmiş project/runtime/renderer override mı, yoksa yanlışlıkla ikinci canonical product/default değeri mi? Açıkça sınıflandırılır.

---

# BÖLÜM III — ITEM TAMAMLANMA KRİTERİ

Bir Item ancak aşağıdaki konular sistemden doğrulanıp kayıt altına alındığında tamamlanmış kabul edilir:

1. Canonical `itemKey`, `type`, Item yapısı (tekil/bileşik) ve parametrik durumu.
2. Mevcut sistemde Item'ı tanımlayan bütün intrinsic/default property'lerin eksiksiz envanteri.
3. Item için geçerli bütün fiziksel ölçülerin (`width/height/depth/length/thickness` ve aileye özgü diğerleri) canonical Item içinde bulunması.
4. Mevcutsa `defaultColor`, `material` ve diğer ürün/default metadata'sının canonical Item içinde bulunması; mevcut değilse tahmin edilmeden açıkça `YOK/UYGULANMIYOR` denmesi.
5. Canonical property'lerin gerçek business/runtime tüketicilerinin Item/resolver kaynağından beslenmesi; bağımsız ikinci product/default source-of-truth kalmaması.
6. Override edilebilir property/state alanlarının açık olması; canonical default → override → effective value ayrımının tanımlanması.
7. Override persistence/runtime sınırının doğrulanması.
8. Factory/oluşturulma noktası ve catalog bağlantısı.
9. Instance state, default değerler, effective ölçüler ve configurable/override alanlar.
10. Persistence, save/load, migration ve instance-ID mantığı.
11. Behavior kaynağı ve Item/type capability bağlantısı.
12. Placement ve hareket davranışı.
13. Rotation desteği, rotation step, default rotation ve gerçek dönüş interaction'ları.
14. Collision, snap, boundary, connection, overlap ve ilgili behavior capability'leri.
15. Sol click, selection, drag, sağ click, context menu, keyboard ve diğer gerçek kullanıcı interaction'ları.
16. Renderer, asset, renk, image ve varsa özel görsel modlar; renderer override ile canonical Item property ayrımı.
17. Parent/child, neighbor, connection, host, corner veya continuous-chain ilişkileri.
18. Relationship-derived behavior/reflow sonucu.
19. BOM policy, recipe/resolver, alt Item'lar, quantity ve unit.
20. Bileşik Item ise recursive BOM çözümü.
21. Varyant veya relationship-derived BOM durumu.
22. BOM ile pricing ayrımı.
23. Canonical property, consumer cutover, override, state, behavior, interaction, BOM ve persistence için gerekli regression koruması.
24. Build/browser kritik akış sonucu.
25. Açık audit/migration problemleri.

## Tamamlanmayı engelleyen hard-fail durumları

Aşağıdakilerden biri varsa Item **Tamam** olarak işaretlenemez:

- mevcut sistemde doğrulanmış intrinsic/default bir property canonical Item tanımında yoksa,
- Item için geçerli gerçek bir ölçü (`thickness` dahil) bilindiği halde canonical Item metadata'sında eksikse,
- mevcut ürün/default renk veya material bilgisi doğrulanmış olduğu halde Item'a taşınmamışsa,
- canonical Item'da property var fakat gerçek business/runtime tüketici halen bağımsız ikinci product/default değerini source-of-truth olarak kullanıyorsa,
- duplicate source-of-truth override diye etiketlenmiş fakat gerçek bir override mekanizması/resolver sınırı yoksa,
- behavior/context-menu/capability mevcut olduğu halde `UYGULANMIYOR` denilerek atlanmışsa,
- gerekli BOM/consumer/state/persistence/relationship veya regression kontrolü sessizce atlanmışsa.

Specialized renderer'ın görsel/teknik override'ı tek başına hard-fail değildir; ancak renderer değeri business/product source-of-truth olarak kullanılıyorsa hard-fail'dir.

Bir alan bu Item için geçerli değilse sonuç **UYGULANMIYOR** olarak açıkça kaydedilir ve neden uygulanmadığı yazılır; kontrol sessizce atlanmaz.

Bir bilgi mevcut sistemde yoksa **YOK** olarak yazılır. Ürün kararı gereken `material`, renk, ölçü veya başka property tahmin edilmez.

Tahmin edilen davranış veya BOM değeri kabul edilmez. Item'a özgü değerler ilgili canonical kod/state/recipe/test kaynağından doğrulanır.

---

# current-system/<ITEM>.md minimum kapsamı

Her `docs/items/current-system/<ITEM>.md` dosyası en az aşağıdaki başlıkların tamamını sistemden çıkararak kayıt altına almalıdır. Başlık geçerli değilse yine açık sonuç yazılır:

1. identity / type / unit / classification
2. intrinsic/default property envanteri
3. dimensions: width / height / depth / length / thickness / aileye özgü ölçüler
4. defaultColor / material / diğer product metadata
5. factory / creation / catalog bağlantısı
6. instance state / defaults / configurable-overrides
7. placement / move / snap
8. rotation / collision / connection / overlap / ghost
9. selection / drag / sağ click / context menu / keyboard
10. delete / duplicate / diğer capabilities
11. persistence / save-load / migration / instance ID
12. relationships / parent-child / host / neighbor / reflow
13. BOM / recipe / quantity / unit / consumer
14. renderer / asset / image / specialized override sınırı
15. canonical property ve behavior tüketicileri / runtime owners
16. duplicate source-of-truth ve override ayrımı
17. mevcut regression/test kapsamı
18. açık gap / karar bekleyen alanlar

`current-system/<ITEM>.md` yalnız “kod zinciri özeti” değildir; migration öncesi Item'ın mevcut sistemdeki **tam envanteridir**.

# definitions/<ITEM>.md minimum kapsamı

Her migrated Item'ın `docs/items/definitions/<ITEM>.md` dosyası current-system envanterini canonical modele map etmeli ve en az şunları açıkça kaydetmelidir:

1. canonical identity/type/unit,
2. canonical intrinsic/default properties,
3. canonical dimensions ve varsa defaultColor/material,
4. hangi property'lerin override edilebilir olduğu,
5. behavior/capability contract bağlantısı,
6. state/factory/persistence sınırı,
7. relationships/composition/BOM sahipliği,
8. renderer/asset override sınırı,
9. gerçek consumer cutover durumu,
10. regression ve açık gap'ler.

`definitions/<ITEM>.md` içinde `UYGULANMIYOR` yalnız current-system analiziyle gerçekten geçerli olmadığı doğrulanmış alanlar için kullanılabilir.

---

# Mevcut sistemde doğrulama için ana kaynaklar

Bugünkü module tabanlı sistem incelenirken başlıca canonical/aktif kaynaklar şunlardır:

- Kimlik, label, type ve nominal catalog verileri: `src/catalog.js`
- Contract profile, state owner/persistence, appearance/renderer ve BOM policy: `src/moduleContracts.js`
- State factory/default/instance verileri: `src/designState.js`
- Placement/move/rotation/collision/snap/ghost ve diğer behavior: `src/moduleBehavior.js` ve ilgili placement akışı
- Recipe BOM: `src/moduleRecipes.js`
- Tekil üretim kalemleri/production Item metadata'sı, dimensions ve intrinsic/default properties: `src/productionParts.js`
- Context menu: `src/moduleContextMenu.js`
- Scene/selection/render interaction'ları: `src/scene3d.js` ve ilgili interaction dosyaları
- Theme/default appearance gibi Item'a ait olabilecek mevcut property adayları: `src/theme.js`, state/default kaynakları ve ilgili renderer girişleri
- Regression doğrulaması: `test/` altındaki ilgili testler

Bu kaynak listesi yeni Item mimarisinin nihai dosya yerleşimini zorunlu kılmaz; mevcut sistemi tahmin etmeden analiz etmek için kullanılan bugünkü kaynak haritasıdır.
