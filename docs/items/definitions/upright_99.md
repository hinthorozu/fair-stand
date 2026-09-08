# upright_99 — Item Contract Migration

Bu belge `docs/items/current-system/upright_99.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanan runtime cutover durumunu kaydeder.

Bu migration yeni dikme davranışı veya yeni ölçü icat etmez. Mevcut ad, `type`, `unit`, production ölçüleri ve 6 recipe içindeki doğrulanmış miktarlar aynen korunur.

## 1. Canonical kimlik

| Alan | Değer |
|---|---|
| `itemKey` | `upright_99` |
| Ad | `Dikme 99 cm` |
| `type` | `upright` |
| Yapı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| `dimensions.lengthCm` | `99` |
| `dimensions.thicknessCm` | `8` |

Migration öncesi production kimliği `partId = upright_99`; migration sonrası tek canonical ürün kimliği `itemKey = upright_99` olur. Paralel ikinci ürün kimliği oluşturulmaz.

## 2. Composition / parent recipe kullanımı

`upright_99` başka Item'lardan oluşmaz; kendisi **Tekil Item**dır.

Mevcut sistemde 6 banko recipe'sinde kullanılır:

- `counter:100/150/200` → `upright_99 × 4`,
- `counter-l:100/150/200` → `upright_99 × 5`.

Migration bu miktarları değiştirmez. Miktarın sahibi parent recipe/composition'dır.

## 3. BOM / üretim mapping'i

Canonical nihai BOM bilgisi:

```text
itemKey = upright_99
quantity = parent recipe'den
unit = adet
```

Recipe expansion mevcut `getRecipeItemKey()` → `getProductionItem()` yolunu kullanır. Ayrı fiyatlandırma veya yeni quantity resolver eklenmez.

## 4. State / behavior / persistence

Mevcut sistemde bağımsız `upright_99` project instance'ı yoktur. Bu migration project `id`, ayrı state/factory, persistence schema veya placement/move/rotation/collision davranışı eklemez.

## 5. Renderer ayrımı

Mevcut renderer `upright_99` production kimliğini/metadata'sını tüketmez; banko postları procedural üretilir. Current-system incelemesinde production `99 cm / 8 cm` ile procedural renderer ölçülerinin birebir canonical mapping'i doğrulanmamıştır.

Bu nedenle bu migration yalnız identity/BOM cutover yapar; renderer geometrisini production metadata'sına zorla bağlamaz.

## 6. Uygulanan cutover

- `src/productionParts.js`: `partId` kaldırıldı, canonical `itemKey = upright_99` oldu.
- `src/moduleRecipes.js`: 6 occurrence `partId` yerine `itemKey` kullanıyor.
- 3 düz bankoda quantity `4`, 3 L bankoda quantity `5` aynen korundu.
- State/renderer/persistence davranışı değiştirilmedi.

## 7. Regression sözleşmesi

Testler canonical kimliği, `99 / 8` production ölçülerini, 6 recipe occurrence'ı ve quantity parity'yi doğrular. Diğer Item aileleri yanlışlıkla migrate edilmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = upright_99
type = upright
unit = adet
production dimensions = 99 cm / 8 cm
active parent recipes = 6
quantity = straight counter ×4, L counter ×5
renderer cutover = yok
```
