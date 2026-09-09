# separator_panel_98 — Item Contract Migration

Bu belge `docs/items/current-system/separator_panel_98.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanan runtime cutover durumunu kaydeder.

Bu migration yeni separator davranışı, yeni ölçü veya yeni BOM miktarı icat etmez. Mevcut ad, `type`, `unit`, production ölçüleri, `nominalModuleWidthCm` ve iki parent recipe içindeki doğrulanmış miktarlar aynen korunur.

## 1. Canonical kimlik

| Alan | Değer |
|---|---|
| `itemKey` | `separator_panel_98` |
| Ad | `Separatör Paneli 98 × 47 cm` |
| `type` | `separator-panel` |
| Yapı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| `dimensions.widthCm` | `98` |
| `dimensions.heightCm` | `47` |
| `dimensions.thicknessCm` | `0.8` |
| `nominalModuleWidthCm` | `100` |

Migration öncesi production kimliği `partId = separator_panel_98`; migration sonrası tek canonical ürün kimliği `itemKey = separator_panel_98` olur. Paralel ikinci runtime ürün kimliği oluşturulmaz.

## 2. Composition / parent recipe kullanımı

`separator_panel_98` başka Item'lardan oluşmaz; kendisi **Tekil Item**dır.

Mevcut sistemde iki parent recipe içinde kullanılır:

- `separator-50` → `separator_panel_98 × 3`,
- `separator-100` → `separator_panel_98 × 7`.

Migration bu miktarların hiçbirini değiştirmez. Miktarın sahibi parent recipe/composition'dır.

## 3. BOM / production mapping

Bu Item parent recipe içinde nihai fiziksel BOM kalemidir.

```text
itemKey = separator_panel_98
quantity = parent recipe'den
unit = adet
```

Recipe expansion mevcut canonical compatibility yolunu kullanır: `getRecipeItemKey(item)` → `getProductionItem(itemKey)`. Yeni quantity resolver veya renderer-türevi BOM eklenmez.

## 4. State / behavior / persistence

Mevcut sistemde bağımsız `separator_panel_98` project instance'ı yoktur. Parent separator module state generic `surface` ve module metadata taşır; production Item identity'si project state'e ayrı entity olarak yazılmaz.

Bu migration ayrı state/factory, project `id`, persistence schema, placement/move/rotation/collision davranışı eklemez.

## 5. Renderer ayrımı

Mevcut separator renderer procedural geometri üretir ve `separator_panel_98` production metadata'sını mesh source-of-truth olarak tüketmez. Bu migration yalnız production/BOM identity cutover'ıdır; renderer görünümü veya geometry ownership değiştirilmez.

## 6. Uygulanan cutover

- `src/productionParts.js`: `partId` kaldırıldı, canonical `itemKey = separator_panel_98` oldu.
- `src/moduleRecipes.js`: iki occurrence canonical `itemKey` kullanıyor.
- Quantities `×3` ve `×7`, `98 × 47 × 0.8 cm`, `unit = adet` ve nominal width `100` korunur.
- Renderer/state/persistence behavior değiştirilmez.

## 7. Regression sözleşmesi

Testler canonical identity'yi, `partId` yokluğunu, exact metadata'yı, tam iki recipe occurrence'ını `×3` ve `×7` olarak, expanded metadata çözümünü ve migration izolasyonunu doğrular.
