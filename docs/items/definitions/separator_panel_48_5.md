# separator_panel_48_5 — Item Contract Migration

Bu belge `docs/items/current-system/separator_panel_48_5.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanan runtime cutover durumunu kaydeder.

Bu migration yeni separator davranışı, yeni ölçü veya yeni BOM miktarı icat etmez. Mevcut ad, `type`, `unit`, production ölçüleri, `nominalModuleWidthCm` ve parent recipe miktarı aynen korunur.

## 1. Canonical kimlik

| Alan | Değer |
|---|---|
| `itemKey` | `separator_panel_48_5` |
| Ad | `Separatör Paneli 48,5 × 47 cm` |
| `type` | `separator-panel` |
| Yapı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| `dimensions.widthCm` | `48.5` |
| `dimensions.heightCm` | `47` |
| `dimensions.thicknessCm` | `0.8` |
| `nominalModuleWidthCm` | `50` |

Migration öncesi production kimliği `partId = separator_panel_48_5`; migration sonrası tek canonical ürün kimliği `itemKey = separator_panel_48_5` olur. Paralel ikinci runtime ürün kimliği oluşturulmaz.

## 2. Composition / parent recipe kullanımı

`separator_panel_48_5` başka Item'lardan oluşmaz; kendisi **Tekil Item**dır.

Mevcut sistemde yalnız bir parent recipe içinde kullanılır:

- `separator-50` → `separator_panel_48_5 × 1`.

Migration bu miktarı değiştirmez. Miktarın sahibi parent recipe/composition'dır.

## 3. BOM / production mapping

Bu Item parent recipe içinde nihai fiziksel BOM kalemidir.

```text
itemKey = separator_panel_48_5
quantity = parent recipe'den
unit = adet
```

Recipe expansion mevcut canonical compatibility yolunu kullanır: `getRecipeItemKey(item)` → `getProductionItem(itemKey)`. Yeni quantity resolver veya renderer-türevi BOM eklenmez.

## 4. State / behavior / persistence

Mevcut sistemde bağımsız `separator_panel_48_5` project instance'ı yoktur. Parent separator module state generic `surface` ve module metadata taşır; production Item identity'si project state'e ayrı entity olarak yazılmaz.

Bu migration ayrı state/factory, project `id`, persistence schema, placement/move/rotation/collision davranışı eklemez.

## 5. Renderer ayrımı

Mevcut separator renderer procedural geometri üretir ve `separator_panel_48_5` production metadata'sını mesh source-of-truth olarak tüketmez. Bu migration yalnız production/BOM identity cutover'ıdır; renderer görünümü veya geometry ownership değiştirilmez.

## 6. Uygulanan cutover

- `src/productionParts.js`: `partId` kaldırıldı, canonical `itemKey = separator_panel_48_5` oldu.
- `src/moduleRecipes.js`: `separator-50` içindeki tek occurrence `itemKey` kullanıyor.
- Quantity `×1`, `48.5 × 47 × 0.8 cm`, `unit = adet` ve nominal width `50` korunur.
- Renderer/state/persistence behavior değiştirilmez.

## 7. Regression sözleşmesi

Testler canonical identity'yi, `partId` yokluğunu, exact metadata'yı, tek recipe occurrence'ı `×1` olarak, expanded metadata çözümünü ve migration izolasyonunu doğrular.
