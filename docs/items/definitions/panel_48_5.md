# panel_48_5 — Item Contract Definition

Bu belge `panel_48_5` Item'ının canonical Item Contract tanımını kaydeder. Migration öncesi mevcut kod zinciri `docs/items/current-system/panel_48_5.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `panel_48_5` | VAR |
| Ad | `Panel 48,5 × 47 cm` | VAR |
| `type` | `panel` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `dimensions.widthCm` | `48.5` | VAR |
| `dimensions.heightCm` | `47` | VAR |
| `dimensions.thicknessCm` | `0.8` | VAR |
| `panelRole` | `straight` | VAR |
| `nominalModuleWidthCm` | `50` | VAR |

Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.panel_48_5` kaydıdır. Legacy `partId` kaldırılmış, paralel ikinci ürün kimliği oluşturulmamıştır.

## 2. Composition / parent recipe kullanımı

`panel_48_5` başka Item'lardan oluşmaz; kendisi **Tekil Item**dır. Quantity sahibi parent recipe'dir. Doğrulanmış parent recipe kullanımları:

| Recipe | Quantity |
|---|---:|
| `wall-straight-50` | 7 |
| `counter-l-100` | 4 |
| `counter-l-150` | 4 |
| `counter-l-200` | 4 |
| `counter-100` | 4 |
| `counter-150` | 4 |
| `counter-200` | 4 |
| `base-wall-100` | 2 |
| `base-wall-150` | 2 |
| `base-wall-200` | 2 |
| `base-100` | 2 |
| `base-150` | 2 |
| `base-200` | 2 |

Toplam `13` occurrence vardır. Migration bu miktarların hiçbirini değiştirmez.

## 3. BOM / production mapping

Canonical çıktı:

```text
itemKey = panel_48_5
quantity = parent recipe'den
unit = adet
dimensions = 48.5 × 47 × 0.8 cm
```

Recipe expansion `getRecipeItemKey()` → `getProductionItem()` canonical compatibility yolunu kullanır. Ayrı pricing, state veya renderer-türevi BOM kuralı eklenmez.

## 4. State / behavior / persistence

Bu production leaf Item için bağımsız project instance, factory, mutable state veya persistence entity'si yoktur. Placement, move, rotation, collision ve interaction davranışları parent module seviyesindedir; bu alanlar bu Item için **UYGULANMIYOR**.

## 5. Renderer ayrımı

Mevcut renderer production Item identity'sini doğrudan tüketmez; procedural module geometrisi ayrı kalır. Bu migration yalnız identity/BOM cutover yapar ve renderer geometrisini değiştirmez.

## 6. Corner/separator izolasyonu

Bu Item'ın kendi migrationı yalnız straight paneli kapsar. Güncel sistemde inner-corner panel ailesi de canonical `itemKey` / `innerCornerPanelItemKey` yoluna taşınmıştır ve caller `panelVariant = inner-corner` verdiğinde doğrulanmış 1:1 replacement çalışır. Separator Item'ları bağımsız migration konusudur ve legacy `partId` üzerinde kalır.

## 7. Regression sözleşmesi

Testler şunları kilitler:

1. `itemKey = panel_48_5` vardır ve own `partId` yoktur,
2. `type`, `unit`, `dimensions`, `panelRole`, `nominalModuleWidthCm` korunur,
3. tam `13` parent recipe canonical `itemKey` kullanır,
4. quantity parity `7 / 4 / 4 / 4 / 4 / 4 / 4 / 2 / 2 / 2 / 2 / 2 / 2` olarak korunur,
5. expanded recipe production metadata'yı canonical identity üzerinden çözer,
6. corner/separator komşuları yanlışlıkla migrate edilmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = panel_48_5
type = panel
unit = adet
dimensions = 48.5 × 47 × 0.8 cm
panelRole = straight
nominalModuleWidthCm = 50
active parent recipes = 13
renderer cutover = yok
```
