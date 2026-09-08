# connector_corner — Item Contract Migration

Bu belge `docs/items/current-system/connector_corner.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanmış canonical cutover durumunu kaydeder.

## 1. Canonical kimlik

| Alan | Değer |
|---|---|
| `itemKey` | `connector_corner` |
| Ad | `Köşe Aparatı` |
| `type` | `connector` |
| Item yapısı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| Metadata | `connectorType = corner` |
| Project instance | Uygulanmıyor |
| Renderer identity | Uygulanmıyor |

Migration öncesi stabil kimlik `partId = connector_corner` idi. Cutover ile aynı ürün kimliği canonical `itemKey = connector_corner` alanına taşındı.

## 2. Fixed parent recipe kullanımı

Mevcut çalışan sistemde `connector_corner` hiçbir sabit `moduleRecipes` parent reçetesinde yer almıyor. Bu durum migration eksiği değildir; bu Item için fixed parent recipe kullanımı bugün **uygulanmıyor**.

Migration mevcut reçetelere tahmini corner quantity eklemez.

## 3. Canonical BOM çözümü

`connector_corner` canonical Tekil production Item'dır. `src/productionParts.js` içindeki mevcut `resolveConnectorBom()` resolver'ı açıkça verilen `corner + quantity` girdisini canonical Item satırına çözer:

```text
connectorType = corner + quantity
→ itemKey = connector_corner
→ quantity
→ unit = adet
```

Resolver quantity veya placement mapping'i tahmin etmez; quantity çağıran tarafından açıkça verilmek zorundadır.

Mevcut placement motorundaki transient `snapKind = corner` geometrik kavramı ayrı bir şeydir. Çalışan kodda bu değer otomatik olarak `connector_corner` quantity'sine çevrilmediği için migration böyle bir kural icat etmez.

Bu Item'ın migration completion'ı sahnede ayrı mesh olarak görünmesine veya mevcut bir parent reçetede zorunlu olarak kullanılmasına bağlı değildir.

## 4. State / persistence / behavior / renderer

Mevcut sistemde bağımsız `connector_corner` project instance/state/persistence/behavior/mesh identity bulunmadığı için bu alanlar **uygulanmıyor**. Migration bunları icat etmez.

## 5. Uygulanan cutover

- `src/productionParts.js`: canonical `itemKey = connector_corner`.
- `connectorType = corner` canonical Item kimliğine çözülür.
- `resolveConnectorBom()` explicit quantity ile `itemKey + quantity + unit` BOM satırı üretir.
- Fixed parent recipe kullanımı yoktur; bu alan mevcut sistem için uygulanmıyor.
- Mevcut reçetelere tahmini corner quantity eklenmez.

## 6. Regression sözleşmesi

Testler şunları doğrular:

- canonical kimlik `itemKey`dir; `partId` yoktur.
- `connectorType = corner` doğru Item'a çözülür.
- resolver explicit quantity ile gerçek `connector_corner` BOM satırı üretir.
- quantity eksik/0 ise fail eder.
- mevcut fixed module recipes içine yanlışlıkla `connector_corner` eklenmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = connector_corner
unit = adet
canonical BOM resolver = VAR
fixed parent recipe kullanımı = UYGULANMIYOR
state/persistence/behavior/renderer = UYGULANMIYOR
migration status = TAMAM
```
