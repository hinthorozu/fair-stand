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

## 6. Item davranışı `type` seviyesinde tanımlanır

Placement, move, rotation, side insert, collision, ghost, context-menu capability ve benzeri Item'a özgü editor/runtime davranışları canonical olarak davranış ailesi (`type`) seviyesinde tanımlanır.

Aynı davranış ailesindeki Item'lar aynı contract'ı kullanır.

Davranış gerçekten farklıysa yeni bir davranış ailesi/type tanımlanır. Item bazlı dağınık `if (itemKey === ...)` veya sürekli override normal mimari yöntem değildir.

UI, context menu ve runtime aynı canonical behavior/capability kaynağını tüketir.

Mevcut module behavior altyapısında bu sorumluluğun canonical runtime sahibi `src/moduleBehavior.js`, sözleşme belgesi `MODULE_BEHAVIOR_STANDARD.md` dosyasıdır; Item mimarisine geçiş bu tek-kaynak ilkesini bozmaz.

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

Bu sorular cevaplanmadan yeni Item işi tamamlanmış sayılamaz.

# Mimari ilişki

```text
Project
  -> Items
      -> canonical itemKey
      -> type / behavior family
      -> project instance state + params
      -> BOM resolver
          -> terminal BOM items (quantity + unit)
              -> pricing / costing
```

Bu belge Item semantiğinin ve BOM sahipliğinin canonical sözleşmesidir. Sayısal runtime davranışlarının ikinci kopyası değildir; ayrıntılı runtime değerleri ilgili canonical kod kaynaklarından okunur.
