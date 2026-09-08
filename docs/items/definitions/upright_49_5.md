# upright_49_5 — Item Contract Migration

Bu belge `docs/items/current-system/upright_49_5.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanan runtime cutover durumunu kaydeder.

Bu migration yeni dikme davranışı veya yeni ölçü icat etmez. Mevcut ad, `type`, `unit`, production ölçüleri ve 6 recipe içindeki doğrulanmış miktarlar aynen korunur.

## 1. Canonical kimlik

| Alan | Değer |
|---|---|
| `itemKey` | `upright_49_5` |
| Ad | `Dikme 49,5 cm` |
| `type` | `upright` |
| Yapı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| `dimensions.lengthCm` | `49.5` |
| `dimensions.thicknessCm` | `8` |

Migration öncesi production kimliği `partId = upright_49_5`; migration sonrası tek canonical ürün kimliği `itemKey = upright_49_5` olur. Paralel ikinci ürün kimliği oluşturulmaz.

## 2. Composition / parent recipe kullanımı

`upright_49_5` başka Item'lardan oluşmaz; kendisi **Tekil Item**'dır.

Mevcut sistemde 6 recipe'de kullanılır:

- `base-wall:100/150/200` → `upright_49_5 × 2`,
- `base:100/150/200` → `upright_49_5 × 4`.

Migration bu miktarları değiştirmez. Miktarın sahibi parent recipe/composition'dır.

## 3. BOM / üretim mapping'i

Canonical nihai BOM bilgisi:

```text
itemKey = upright_49_5
quantity = parent recipe'den
unit = adet
```

Recipe expansion mevcut `getRecipeItemKey()` → `getProductionItem()` yolunu kullanır. Ayrı fiyatlandırma veya yeni quantity resolver eklenmez.

## 4. State / behavior / persistence

Mevcut sistemde bağımsız `upright_49_5` project instance'ı yoktur. Bu migration project `id`, ayrı state/factory, persistence schema veya placement/move/rotation/collision davranışı eklemez.

## 5. Renderer ayrımı

Mevcut renderer `upright_49_5` production kimliğini/metadata'sını doğrudan tüketmez; base/base-wall tarafındaki post geometrileri procedural üretilir. Doğrulanmış production identity → renderer geometry bağı olmadığı için bu migration yalnız identity/BOM cutover yapar.

## 6. Uygulanan cutover

- `src/productionParts.js`: `partId` kaldırıldı, canonical `itemKey = upright_49_5` oldu.
- `src/moduleRecipes.js`: 6 occurrence `partId` yerine `itemKey` kullanıyor.
- 3 base-wall recipe'de quantity `2`, 3 base recipe'de quantity `4` aynen korundu.
- State/renderer/persistence davranışı değiştirilmedi.

## 7. Regression sözleşmesi

Testler canonical kimliği, `49.5 / 8` production ölçülerini, 6 recipe occurrence'ı ve quantity parity'yi doğrular. Diğer Item aileleri yanlışlıkla migrate edilmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = upright_49_5
type = upright
unit = adet
production dimensions = 49.5 cm / 8 cm
active parent recipes = 6
quantity = base-wall ×2, base ×4
renderer cutover = yok
```
