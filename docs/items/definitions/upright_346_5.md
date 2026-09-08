# upright_346_5 — Item Contract Migration

Bu belge `docs/items/current-system/upright_346_5.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanan runtime cutover durumunu kaydeder.

Bu migration yeni dikme davranışı veya yeni ölçü icat etmez. Mevcut ad, `type`, `unit`, production ölçüleri ve 18 recipe içindeki doğrulanmış miktarlar aynen korunur.

## 1. Canonical kimlik

| Alan | Değer |
|---|---|
| `itemKey` | `upright_346_5` |
| Ad | `Dikme 346,5 cm` |
| `type` | `upright` |
| Yapı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| `dimensions.lengthCm` | `346.5` |
| `dimensions.thicknessCm` | `8` |

Migration öncesi production kimliği:

```text
partId = upright_346_5
```

Migration sonrası tek canonical ürün kimliği:

```text
itemKey = upright_346_5
```

Aynı ürün için paralel ikinci bir runtime ürün kimliği oluşturulmaz.

## 2. Composition / parent recipe kullanımı

`upright_346_5` başka Item'lardan oluşmaz; kendisi **Tekil Item**dır.

Mevcut sistemde 18 parent recipe içinde kullanılır ve tamamında doğrulanmış miktar:

```text
upright_346_5 × 2 adet
```

Recipe aileleri:

- düz duvar: 4 recipe,
- kapı: 1 recipe,
- raflı duvar: 6 recipe,
- vitrin: 2 recipe,
- separatör: 2 recipe,
- panel bazalı: 3 recipe.

Migration bu 18 miktarın hiçbirini değiştirmez. Parent recipe/composition miktarın sahibidir.

## 3. BOM / üretim mapping'i

Bu Item parent recipe içinde nihai fiziksel BOM kalemidir.

Canonical çıktı bilgileri:

```text
itemKey = upright_346_5
quantity = parent recipe'den
unit = adet
```

`src/moduleRecipes.js` içindeki `expandRecipe()` recipe identity'sini `getRecipeItemKey()` ile çözüp metadata'yı `getProductionItem()` üzerinden alır.

Bu Item için ayrı fiyatlandırma, renderer-türevi BOM veya yeni bir quantity resolver oluşturulmaz.

## 4. State / behavior / persistence

Mevcut sistemde bağımsız bir `upright_346_5` project instance'ı yoktur.

Dolayısıyla bu migration:

- project `id` üretmez,
- ayrı state/factory eklemez,
- persistence schema değiştirmez,
- placement/move/rotation/collision davranışı icat etmez.

`upright` burada production/BOM Item ailesidir; mevcut editor module davranışları parent Item/module seviyesinde kalır.

## 5. Renderer ayrımı

Mevcut renderer `upright_346_5` kimliğini veya production metadata'sını tüketmez. Dikey profiller procedural mesh olarak parent renderer'lar içinde oluşturulur.

Mevcut iki sayısal kaynak birebir aynı değildir:

```text
production length = 346.5 cm
renderer module height = 350 cm

production thicknessCm = 8
renderer vertical profile width = 4 cm
```

Bu nedenle migration sırasında renderer ölçülerini production metadata'sına zorla bağlamak mevcut görünümü değiştirebilir ve doğrulanmış bir mapping değildir.

Karar:

```text
identity/BOM cutover = bu migrationda yapılır
renderer identity/geometry unification = yapılmaz; ayrı doğrulama gerektirir
```

Renderer BOM'un canonical kaynağı yapılmaz.

## 6. Consumer cutover

Mevcut recipe expansion altyapısı daha önce Item migrationları için compatibility kazanmıştır:

```text
recipe item
    ↓
getRecipeItemKey(item)
    ↓
getProductionItem(itemKey)
```

`rawBomDebug.js` de isim fallback'inde `itemKey` desteklediği için `upright_346_5` için yeni consumer hack'i gerekmez.

## 7. Uygulanan cutover

- `src/productionParts.js`: `partId` kaldırıldı, canonical `itemKey = upright_346_5` oldu.
- `src/moduleRecipes.js`: 18 occurrence `partId` yerine `itemKey` kullanıyor.
- Tüm 18 recipe'de quantity `2` olarak aynen korundu.
- `upright_99` ve `upright_49_5` bağımsız migrationlarında canonical `itemKey` kimliğine geçirilmiştir; bu Item'ın quantity/behavior sözleşmesini değiştirmez.
- Renderer/state/persistence tarafında yeni davranış eklenmedi.

## 8. Regression sözleşmesi

Testler şunları doğrular:

- canonical production tanımında `itemKey = upright_346_5` vardır ve `partId` yoktur,
- `type = upright`, `unit = adet`, `lengthCm = 346.5`, `thicknessCm = 8` korunur,
- 18 recipe occurrence'ın tamamı `itemKey` kullanır,
- 18 occurrence'ın tamamında quantity `2` korunur,
- daha önce migrate edilen connector Item'lar canonical `itemKey` olarak kalır,
- `upright_99` ve `upright_49_5` canonical `itemKey` olarak kalır; diğer migrate edilmemiş recipe kalemleri yanlışlıkla taşınmaz,
- expanded recipe metadata'yı canonical `itemKey` üzerinden çözer.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = upright_346_5
type = upright
unit = adet
production dimensions = 346.5 cm / 8 cm
active parent recipes = 18
quantity = her recipe'de 2
renderer cutover = bu migrationın dışında; doğrulanmamış ölçü eşitlemesi yapılmadı
```
