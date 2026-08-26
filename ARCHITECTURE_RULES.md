# Fair Stand — Mimari ve Yerleşim Kuralları

Bu dosya, **ROG branch'inde şu anda kod tarafından gerçekten uygulanan** yerleşim, snap, bağlantı ve modül davranışı kurallarını tek yerde toplar.

Amaç tahmin üretmek değil; mevcut sistem davranışını açık bir sözleşme haline getirmektir. Bu nedenle aşağıdaki maddeler doğrudan mevcut kaynak koddan türetilmiştir.

## Kaynak dosyalar

Ana kaynaklar:

- `src/modulePlacement.js` — grid, dönüş, duvar ekseni, snap, collision ve bağlantı kuralları
- `src/catalog.js` — standart ölçüler ve katalog modül tanımları
- `src/designState.js` — modül state yapıları ve fiziksel ölçüler
- `test/modulePlacement.test.js` — yerleşim ve bağlantı davranışlarının regresyon testleri
- ilgili modül testleri — katalog/state/BOM davranışlarının regresyon testleri

---

# 1. Temel koordinat ve grid kuralları

## 1.1 Grid

Ana yerleşim grid'i:

- **50 cm**

Kod sabiti:

```js
MODULE_PLACEMENT_SNAP_CM = 50
```

## 1.2 Dönüşler

Modüller yalnızca dört yön kullanır:

- `0°`
- `90°`
- `180°`
- `270°`

Dönüşler 90° adımlarla normalize edilir.

## 1.3 Yatay / dik eksen

- `0°` ve `180°` → X ekseni boyunca yatay modül
- `90°` ve `270°` → Y ekseni boyunca dik modül

---

# 2. Stand tipine göre izin verilen bölgeler

Kodun mevcut izin tablosu:

| Stand tipi | İzin verilen yerleşimler |
|---|---|
| `back-wall` | `back`, `free` |
| `l-left` | `back`, `left`, `free` |
| `l-right` | `back`, `right`, `free` |
| `u-stand` | `back`, `left`, `right`, `free` |
| `island` | `free` |

Bir modül, aktif stand tipinde izin verilmeyen `wallId` üzerine yerleştirilemez.

---

# 3. Sabit duvar yerleşim kuralları

## 3.1 Arka duvar (`back`)

Arka duvar modülü:

- yatay olmak zorundadır,
- `yCm = 0` olmak zorundadır,
- X sınırını aşamaz.

## 3.2 Sol duvar (`left`)

Sol duvar modülü:

- dik olmak zorundadır,
- `xCm = 0` olmak zorundadır,
- Y sınırını aşamaz.

## 3.3 Sağ duvar (`right`)

Sağ duvar modülü:

- dik olmak zorundadır,
- `xCm = standXCm` olmak zorundadır,
- Y sınırını aşamaz.

## 3.4 Serbest yerleşim (`free`)

Serbest modüller stand alanı içinde kalmak zorundadır.

Gerçek derinliği olan modüllerde sınır hesabı yalnız çizgisel genişlikle değil fiziksel derinlikle de yapılır.

---

# 4. Maxima duvar hattının mantıksal kalınlığı

`src/catalog.js` içindeki standart duvar derinliği:

```js
STAND_DIMENSIONS.depth = 0.1 // metre
```

Bunun yerleşim motorundaki karşılığı:

- **10 cm mantıksal collision / bağlantı derinliği**

Kod bunu `MODULE_COLLISION_DEPTH_CM` olarak kullanır.

Bu değer normal duvar tipi modüllerin bağlantı omurgasını temsil eder.

---

# 5. Modül bağlantı modeli

Normal duvar tipi modüller yerleşim motorunda bir **zemin segmenti** olarak değerlendirilir.

Segment bilgisi temel olarak şunlardan oluşur:

- modül genişliği (`widthCm`)
- başlangıç koordinatı
- yön / dönüş
- sabit eksen koordinatı

## 5.1 Aynı doğrultudaki modüller

İki modül aynı eksendeyse sistem yalnız gerçek uç-uca bağlantı üretir.

Bağlantı tipi:

```text
end-to-end
```

Yani normal duvar zincirinde modüller yan yana eklenir.

## 5.2 Dik gelen modül — köşe bağlantısı

Dik gelen modül, hedef modülün başlangıç veya bitiş noktasına bağlanıyorsa:

```text
corner
```

Bu gerçek L köşe bağlantısıdır.

## 5.3 Dik gelen modül — T bağlantısı

Dik gelen modül hedef modülün gövdesindeki bir bağlantı noktasına bağlanıyorsa:

```text
tee
```

Hedef segment üzerindeki aday bağlantı koordinatları **50 cm adımlarla** üretilir.

---

# 6. Snap mesafeleri

Mevcut sabitler:

```js
MODULE_WALL_SNAP_DISTANCE_CM = 50
MODULE_NEIGHBOR_SNAP_DISTANCE_CM = 30
```

Yani:

- stand duvarına snap aralığı: **50 cm**
- komşu modüle manyetik snap aralığı: **30 cm**

---

# 7. Collision kuralları

## 7.1 Normal duvar modülleri

Normal duvar tipi modüllerde collision hesabı Maxima'nın mantıksal **10 cm** duvar hattı üzerinden yapılır.

Kasıtlı L/T uç birleşimleri collision sayılmaz.

Gerçek artı (`+`) kesişme veya gövdelerin birbirinin içinden geçmesi collision olarak reddedilir.

## 7.2 Fiziksel derinliği olan modüller

Bir modülün geçerli `depthCm` değeri 10 cm duvar hattından büyükse sistem serbest yerleşimde fiziksel footprint hesabına geçer.

Bu tip modüllerde gövde derinliği stand sınırı ve collision kontrolüne katılır.

---

# 8. Banko ve Baza özel davranışı

Yerleşim motorunda şu tipler özel logical fixture endpoint davranışına sahiptir:

```js
counter
base
```

Bu modüller fiziksel derinlik taşır ve normal ince panelden farklı face / footprint davranışına sahiptir.

Mevcut state ölçüleri:

- Banko: `depthCm = 50`, `heightCm = 100`
- Baza: `depthCm = 50`, `heightCm = 50`

Bu iki tip **normal Düz Panel collision modeliyle aynı kabul edilmez**.

---

# 9. Panel Bazalı (`base-wall`) kuralı

Bu modül için mevcut kodda açık bir istisna vardır.

## 9.1 Fiziksel state

`createBaseWallModuleState()` şu fiziksel bilgileri taşır:

- `type = 'base-wall'`
- genişlik: `100 / 150 / 200 cm`
- `depthCm = 50`
- `heightCm = 350`
- 7 adet duvar panel state'i (`strips`)
- baza için `front`, `left`, `right` yüzey state'leri

Yani modül fiziksel olarak baza çıkıntısını taşımaya devam eder.

## 9.2 Connect / snap omurgası

Buna rağmen **Panel Bazalı'nın bağlantı omurgası Düz Panel ile aynıdır**.

Yerleşim motoru `base-wall` için fiziksel 50 cm baza derinliğini corner/T/snap collision hattı olarak kullanmaz.

Kod açık şekilde şunu yapar:

```js
if (module?.type === 'base-wall') return MODULE_COLLISION_DEPTH_CM;
```

ve hareket eden modül snap hesabında:

```js
const effectiveMovingDepthCm = moduleType === 'base-wall'
  ? MODULE_COLLISION_DEPTH_CM
  : depthCm;
```

Sonuç:

- Panel Bazalı normal panel gibi uç uca bağlanır.
- Panel Bazalı normal panel gibi köşeye oturur.
- Panel Bazalı normal panel gibi T bağlantısı oluşturabilir.
- Önündeki 50 cm baza çıkıntısı, ana duvar bağlantı koordinatını kaydırmaz.
- Fiziksel state'teki `depthCm = 50` korunur.

Bu ayrım kritiktir:

> **Fiziksel geometri ölçüsü ile connect/snap omurgası aynı şey olmak zorunda değildir.**

Panel Bazalı bunun mevcut sistemdeki açık örneğidir.

---

# 10. Üst aksesuar davranışı

`led-floodlight` üst aksesuar olarak değerlendirilir.

Mevcut yerleşim motorunda:

- normal duvar kapasitesi hesabına katılmaz,
- modül collision kontrolünde normal zemin modülü gibi davranmaz.

---

# 11. Modül state kuralları

## 11.1 Düz Panel

`flat-panel`:

- verilen `widthCm` değerini taşır,
- **7 panel strip** state'i oluşturur.

## 11.2 Raflı Duvar

`shelf`:

- yalnız `100 / 150 / 200 cm` genişlikleri kabul eder,
- yalnız `2 / 3` raf varyantlarını kabul eder,
- 7 panel strip state'i taşır.

## 11.3 Vitrin

`showcase-2` ve `showcase-3`:

- panel bazlı duvar state yapısını kullanır,
- 7 editable strip taşır.

## 11.4 Depo Kapısı

`door`:

- yalnız `100 cm` genişlik kabul eder,
- üst bölümde 3 panel strip taşır,
- kapı kanadı bağımsız editable surface'tir.

## 11.5 Banko

`counter`:

- `100 / 150 / 200 cm`
- `depthCm = 50`
- `heightCm = 100`
- alt/üst olmak üzere bağımsız ön, sol ve sağ yüz state'leri taşır.

## 11.6 Baza

`base`:

- `100 / 150 / 200 cm`
- `depthCm = 50`
- `heightCm = 50`
- bağımsız ön, sol ve sağ yüz state'leri taşır.

---

# 12. Katalog nominal ölçüsü ile üretim ölçüsü ayrıdır

Katalogdaki `widthCm`, modülün **nominal yerleşim genişliğidir**.

Örneğin katalogda `100 cm` olan bir modülün gerçek panel veya profil kesim ölçüleri birebir 100 cm olmak zorunda değildir.

Üretim ölçüleri ve adetleri BOM / recipe tarafının sorumluluğundadır.

Bu nedenle:

- placement genişliği,
- 3D geometri,
- production/BOM ölçüsü

aynı kavram değildir ve birbirine karıştırılmamalıdır.

---

# 13. Regresyon güvenliği

Bu kuralların önemli bölümü testlerle korunmaktadır.

Özellikle mevcut testler şunları doğrular:

- 50 cm grid snap
- dört yönlü 90° dönüş
- end-to-end bağlantı
- L / corner bağlantısı
- T bağlantısı
- artı kesişmenin reddedilmesi
- fiziksel derinlik collision davranışı
- Banko/Baza footprint davranışı
- Panel Bazalı katalog/state/BOM davranışı
- Panel Bazalı'nın normal panel connect hattına oturması

---

# 14. Değişiklik politikası

Bu dosyanın oluşturulduğu noktadan itibaren core yerleşim/bağlantı davranışında yapılacak değişikliklerde şu sıra izlenmelidir:

1. Önce mevcut kuralın gerçekten değiştirilmek istendiği netleştirilir.
2. `modulePlacement.js` veya ilgili core dosya değiştirilir.
3. İlgili regresyon testi eklenir veya güncellenir.
4. Bu dokümandaki ilgili madde güncellenir.
5. `npm test` ve `npm run build` başarılı olmadan değişiklik tamamlanmış sayılmaz.

Yeni bir modül eklemek, mevcut connect/snap kuralını otomatik olarak değiştirme gerekçesi değildir.

---

# 15. Şu anda bu dosyada yazılmayan şeyler

Bu doküman yalnız **mevcut kod tarafından doğrulanmış core davranışları** kapsar.

Henüz kodda olmayan gelecekteki anchor sistemi, parametrik modül altyapısı veya yeni bağlantı aparatı kuralları bu dosyaya "mevcut sistem kuralı" olarak eklenmemelidir. Bunlar uygulandıkları anda ayrıca belgelenmelidir.
