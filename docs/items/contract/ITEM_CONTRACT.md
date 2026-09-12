# Fair Stand — Item Contract

Bu belge, Fair Stand içinde **BOM, üretim veya maliyet hesabına girebilen her fiziksel öğenin canonical kök sözleşmesidir**.

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

## 2. Item kendi canonical ürün/default özelliklerinin sahibidir

Bir Item'ı ürün olarak tanımlayan ve mevcut sistemde gerçek bir değeri bulunan intrinsic/default özellikler canonical Item tanımında tutulur.

Bunlar Item'a göre değişebilir. Örnekler:

- `name`, `type`, `unit`,
- `dimensions.widthCm`, `heightCm`, `depthCm`, `lengthCm`, `thicknessCm`,
- `defaultColor`,
- `material`,
- ağırlık, yüzey, ürün ailesine özel sınıflandırma ve diğer intrinsic metadata,
- canonical default state/parametreler,
- Item/type behavior ve capability bağlantıları,
- gerekiyorsa asset/model/reference metadata'sı.

Bu alanların tamamı bütün Item'lar için zorunlu değildir. Örneğin `defaultColor` bir Item'da olabilir, başka bir Item'da olmayabilir. Ancak mevcut sistemde Item'ın ürün/default özelliği olarak doğrulanmış bir değer varsa migration sırasında sessizce dışarıda bırakılamaz.

### Canonical source-of-truth ve tüketim

Item'a ait canonical intrinsic/default bir özellik başka bir runtime dosyasında bağımsız ikinci business/product source-of-truth olarak tutulmaz. Bu özelliğe ihtiyaç duyan BOM, state factory, UI, behavior, resolver veya başka business/runtime tüketicisi canonical Item kaynağından tüketmelidir.

Renderer veya specialized render kodu görsel/teknik nedenle farklı bir değer kullanabilir. Project instance da kullanıcı/konfigürasyon/decision mechanism nedeniyle canonical default'u override edebilir. Override geçerlidir; fakat canonical default değerin Item'daki sahipliğini kaldırmaz.

Canonical çözüm sırası gerektiğinde şöyledir:

```text
canonical Item default
→ varsa project/runtime override
→ effective business value
```

Specialized renderer ayrıca kendi render override'ını uygulayabilir; bu render değeri canonical product/business source-of-truth değildir.

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

Tek canonical ürün kimliği `itemKey`dır. `catalogKey` ürün kimliği değildir; runtime onu okumaz ve yazmaz.

---

## 6. Canonical Item tanımı ile proje Item instance'ı ayrıdır

Canonical tanım varsayılan ürünü/reçeteyi tanımlar. Projedeki instance kendi `id`, ölçü, adet ve konfigürasyonunu taşıyabilir.

Örneğin standart masa-sandalye seti `1 masa + 4 sandalye` olabilir; belirli projede `1 masa + 2 sandalye` olarak kullanılabilir. Bu proje konfigürasyonu canonical ürün tanımını değiştirmez.

Override edilebilir alanlar açıkça tanımlanır. Override canonical Item property'sini silmez veya ikinci source-of-truth yaratmaz.

---

## 7. Item davranışı `type` seviyesinde tanımlanır

Placement, move, rotation, side insert, collision, ghost, context-menu capability ve benzeri Item'a özgü editor/runtime davranışları canonical olarak davranış ailesi (`type`) seviyesinde tanımlanır.

Aynı davranış ailesindeki Item'lar aynı contract'ı kullanır.

Davranış gerçekten farklıysa yeni bir davranış ailesi/type tanımlanır. Item bazlı dağınık `if (itemKey === ...)` veya sürekli override normal mimari yöntem değildir.

Item tanımı hangi `type` / behavior family / capability contract'ını kullandığını açıkça taşır veya tek canonical resolver üzerinden çözer. UI, context menu ve runtime aynı canonical behavior/capability kaynağını tüketir.

Mevcut module behavior altyapısında bu sorumluluğun canonical runtime sahibi `src/moduleBehavior.js`, sözleşme belgesi `MODULE_BEHAVIOR_STANDARD.md` dosyasıdır; Item mimarisine geçiş bu tek-kaynak ilkesini bozmaz.

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

---

## 10. Bileşik Item'lar recursive BOM çözümünü destekler

Bir Item başka Item'lardan oluşabilir; alt Item'lar da kendi BOM reçetelerine sahip olabilir.

BOM resolver gerektiğinde başka Item bileşimi olmayan Item'lara kadar recursive çözüm yapabilmelidir; bu Item'lar nihai BOM kalemlerini oluşturur.

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
5. Item için geçerli bütün gerçek ölçüler (`width/height/depth/length/thickness` ve aileye özgü diğerleri) eksiksiz mi?
6. Mevcutsa `defaultColor`, `material` ve diğer product/default metadata Item'a taşındı mı?
7. Her canonical property'nin gerçek business/runtime tüketicisi Item'dan mı okuyor?
8. Hangi property/state alanları override edilebilir; canonical default ile override nasıl ayrılır?
9. Hangi behavior/capability contract'ını kullanır?
10. BOM reçetesi/resolver'ı nedir?
11. Nihai BOM kalemlerinin birimleri nelerdir?
12. Render/asset temsili nedir; renderer override'ı canonical Item property ownership'ından nasıl ayrılır?
13. BOM, property consumption, behavior, state, persistence ve browser akışı için hangi regression testleri gerekir?
14. Duplicate product/default source-of-truth kalmış mı?

Bu sorular cevaplanmadan yeni Item işi tamamlanmış sayılamaz.

# Tamamlanma hard gate

Bir Item aşağıdaki durumlardan biri varsa tamamlanmış sayılamaz:

- doğrulanmış intrinsic/default property canonical Item'da yoksa,
- geçerli gerçek bir ölçü (`thickness` dahil) Item metadata'sında eksikse,
- doğrulanmış `defaultColor`, `material` veya aileye özgü property Item'a taşınmamışsa,
- Item'da property bulunmasına rağmen gerçek business/runtime consumer bağımsız ikinci product/default source-of-truth kullanıyorsa,
- behavior/context-menu/capability mevcut olduğu halde analizde sessizce atlanmışsa,
- duplicate source-of-truth gerçek override mekanizması olmadan `override` diye kabul edilmişse.

Specialized renderer'ın yalnız görsel/teknik override'ı tek başına hard-fail değildir.

# Mimari ilişki

```text
Project
  -> Items
      -> canonical itemKey
      -> canonical product/default properties
      -> type / behavior family / capabilities
      -> project instance state + overrides
      -> BOM resolver
          -> child Items / composition
              -> nihai BOM kalemleri (itemKey + quantity + unit)
              -> pricing / costing
```

Bu belge Item semantiğinin, canonical property sahipliğinin ve BOM sahipliğinin canonical sözleşmesidir. Sayısal runtime davranışlarının ikinci kopyası değildir; ayrıntılı runtime değerleri ilgili canonical kod kaynaklarından okunur.
