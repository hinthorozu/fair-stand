# panel_98 — Item Contract Definition

Bu belge `panel_98` Item'ının canonical Item Contract tanımını kaydeder. Migration öncesi mevcut kod zinciri `docs/items/current-system/panel_98.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `panel_98` | VAR |
| Ad | `Panel 98 × 47 cm` | VAR |
| `type` | `panel` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `dimensions.widthCm` | `98` | VAR |
| `dimensions.heightCm` | `47` | VAR |
| `dimensions.thicknessCm` | `0.8` | VAR |
| `panelRole` | `straight` | VAR |
| `nominalModuleWidthCm` | `100` | VAR |

Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.panel_98` kaydıdır. Legacy `partId` kaldırılmış, paralel ikinci ürün kimliği oluşturulmamıştır.

## 2. Composition / parent recipe kullanımı

`panel_98` başka Item'lardan oluşmaz; kendisi **Tekil Item**dır. Quantity sahibi parent recipe'dir. Doğrulanmış parent recipe kullanımları:

| Recipe | Quantity |
|---|---:|
| `wall-straight-100` | 7 |
| `door-100` | 3 |
| `shelf-wall-100-2` | 7 |
| `shelf-wall-100-3` | 7 |
| `showcase-2-100` | 5 |
| `showcase-3-100` | 4 |
| `counter-l-100` | 4 |
| `counter-100` | 2 |
| `base-wall-100` | 7 |
| `base-100` | 2 |

Toplam `10` occurrence vardır. Migration bu miktarların hiçbirini değiştirmez.

## 3. BOM / production mapping

Canonical çıktı:

```text
itemKey = panel_98
quantity = parent recipe'den
unit = adet
dimensions = 98 × 47 × 0.8 cm
```

Recipe expansion `getRecipeItemKey()` → `getProductionItem()` canonical compatibility yolunu kullanır. Ayrı pricing, state veya renderer-türevi BOM kuralı eklenmez.

## 4. State / behavior / persistence

Bu production leaf Item için bağımsız project instance, factory, mutable state veya persistence entity'si yoktur. Placement, move, rotation, collision ve interaction davranışları parent module seviyesindedir; bu alanlar bu Item için **UYGULANMIYOR**.

## 5. Renderer ayrımı

Mevcut renderer production Item identity'sini doğrudan tüketmez; procedural module geometrisi ayrı kalır. Bu migration yalnız identity/BOM cutover yapar ve renderer geometrisini değiştirmez.

## 6. Corner/separator izolasyonu

Bu migration yalnız straight paneli kapsar. İlgili corner/separator Item'ları bağımsız migration konusudur ve legacy `partId` üzerinde kalır. Legacy `innerCornerPanelPartId` metadata'sı bu migrationda canonical corner replacement davranışını aktive etmez.

## 7. Regression sözleşmesi

Testler şunları kilitler:

1. `itemKey = panel_98` vardır ve own `partId` yoktur,
2. `type`, `unit`, `dimensions`, `panelRole`, `nominalModuleWidthCm` korunur,
3. tam `10` parent recipe canonical `itemKey` kullanır,
4. quantity parity `7 / 3 / 7 / 7 / 5 / 4 / 4 / 2 / 7 / 2` olarak korunur,
5. expanded recipe production metadata'yı canonical identity üzerinden çözer,
6. corner/separator komşuları yanlışlıkla migrate edilmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = panel_98
type = panel
unit = adet
dimensions = 98 × 47 × 0.8 cm
panelRole = straight
nominalModuleWidthCm = 100
active parent recipes = 10
renderer cutover = yok
```
