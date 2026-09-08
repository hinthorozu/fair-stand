# panel_197 — Item Contract Migration

Bu belge `docs/items/current-system/panel_197.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanan runtime cutover durumunu kaydeder.

Bu migration yeni panel davranışı, yeni ölçü veya yeni BOM miktarı icat etmez. Mevcut ad, `type`, `unit`, production ölçüleri, `panelRole`, `nominalModuleWidthCm` ve 7 parent recipe içindeki doğrulanmış miktarlar aynen korunur.

## 1. Canonical kimlik

| Alan | Değer |
|---|---|
| `itemKey` | `panel_197` |
| Ad | `Panel 197 × 47 cm` |
| `type` | `panel` |
| Yapı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| `dimensions.widthCm` | `197` |
| `dimensions.heightCm` | `47` |
| `dimensions.thicknessCm` | `0.8` |
| `panelRole` | `straight` |
| `nominalModuleWidthCm` | `200` |

Migration öncesi production kimliği `partId = panel_197`; migration sonrası tek canonical ürün kimliği `itemKey = panel_197` olur. Paralel ikinci runtime ürün kimliği oluşturulmaz.

## 2. Composition / parent recipe kullanımı

`panel_197` başka Item'lardan oluşmaz; kendisi **Tekil Item**dır.

Mevcut sistemde 7 parent recipe içinde kullanılır:

- `wall-straight-200` → `panel_197 × 7`,
- `shelf-wall-200-2` → `panel_197 × 7`,
- `shelf-wall-200-3` → `panel_197 × 7`,
- `counter-l-200` → `panel_197 × 4`,
- `counter-200` → `panel_197 × 2`,
- `base-wall-200` → `panel_197 × 7`,
- `base-200` → `panel_197 × 2`.

Migration bu miktarların hiçbirini değiştirmez. Miktarın sahibi parent recipe/composition'dır.

## 3. BOM / production mapping

Bu Item parent recipe içinde nihai fiziksel BOM kalemidir.

Canonical çıktı:

```text
itemKey = panel_197
quantity = parent recipe'den
unit = adet
```

Recipe expansion mevcut canonical compatibility yolunu kullanır:

```text
recipe item
  ↓
getRecipeItemKey(item)
  ↓
getProductionItem(itemKey)
```

Yeni bir quantity resolver, fiyatlandırma kuralı veya renderer-türevi BOM eklenmez.

## 4. State / behavior / persistence

Mevcut sistemde bağımsız `panel_197` project instance'ı yoktur. Parent module state generic editable strip/face state'i taşır; production `panel_197` identity'si project state'e ayrı entity olarak yazılmaz.

Bu migration:

- project `id` üretmez,
- ayrı state/factory eklemez,
- persistence schema değiştirmez,
- placement/move/rotation/collision davranışı icat etmez.

## 5. Renderer ayrımı

Mevcut renderer `panel_197` production kimliğini veya production metadata'sını doğrudan tüketmez. Düz duvar, shelf, counter, L-counter, base-wall ve base yüzeyleri procedural geometriyle üretilir.

Current-system incelemesinde renderer yüzey ölçüleri ile production `197 × 47 × 0.8 cm` ölçülerinin birebir canonical mapping'i doğrulanmamıştır.

Bu nedenle:

```text
identity/BOM cutover = yapılır
renderer geometry cutover = yapılmaz
```

Renderer BOM'un canonical kaynağı yapılmaz ve mevcut görünüm değiştirilmez.

## 6. Variant / corner panel ayrımı

200 cm straight/base-wall recipe metadata'sında `innerCornerPanelPartId = panel_corner_192` bulunur. Mevcut runtime'da placement ilişkisini okuyup `panel_197` miktarını otomatik `panel_corner_192`a dönüştüren doğrulanmış canonical BOM resolver yoktur.

Bu migration `panel_197` ile `panel_corner_192` arasında yeni ilişki/quantity kuralı icat etmez. Corner panel migrationı ayrı Item çalışmasıdır.

## 7. Uygulanan cutover

- `src/productionParts.js`: `partId` kaldırıldı, canonical `itemKey = panel_197` oldu.
- `src/moduleRecipes.js`: 7 occurrence `partId` yerine `itemKey` kullanıyor.
- 7 parent recipe içindeki quantity değerleri aynen korundu.
- Diğer straight/corner/separator panel Item'ları bu migrationda değiştirilmedi.
- Renderer/state/persistence behavior değiştirilmedi.

## 8. Regression sözleşmesi

Testler şunları doğrular:

- canonical production tanımında `itemKey = panel_197` vardır ve `partId` yoktur,
- `type`, `unit`, dimensions, `panelRole` ve `nominalModuleWidthCm` korunur,
- tam 7 recipe occurrence canonical `itemKey` kullanır,
- miktarlar `7,7,7,4,2,7,2` olarak korunur,
- expanded recipe metadata'yı canonical `itemKey` üzerinden çözer,
- diğer panel Item'ları yanlışlıkla migrate edilmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = panel_197
type = panel
unit = adet
production dimensions = 197 × 47 × 0.8 cm
panelRole = straight
nominalModuleWidthCm = 200
active parent recipes = 7
renderer cutover = yok
corner-panel relationship rule = bu migrationda icat edilmez
```
