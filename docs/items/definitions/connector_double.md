# connector_double — Item Contract Migration

Bu belge `docs/items/current-system/connector_double.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanmış kanonik geçiş durumunu kaydeder.

## 1. Kanonik kimlik

| Alan | Değer |
|---|---|
| `itemKey` | `connector_double` |
| Ad | `Çiftli Aparat` |
| `type` | `connector` |
| Item yapısı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| Metadata | `connectorType = double` |
| Proje örneği | Uygulanmıyor |
| Renderer identity | Uygulanmıyor |

Migration öncesi stabil kimlik `partId = connector_double` idi. Cutover ile aynı ürün kimliği kanonik `itemKey = connector_double` alanına taşındı.

## 2. Fixed parent recipe kullanımı

Mevcut çalışan sistemde `connector_double` hiçbir sabit `moduleRecipes` parent reçetesinde yer almıyor. Bu durum migration eksiği değildir; bu Item için fixed parent recipe kullanımı bugün **uygulanmıyor**.

Migration mevcut reçetelere tahmini `connector_double` miktarı eklemez.

## 3. Kanonik BOM çözümü

`connector_double` kanonik Tekil production Item'dır. `src/productionParts.js` içindeki mevcut `resolveConnectorBom()` resolver'ı açıkça verilen `double + quantity` girdisini kanonik Item satırına çözer:

```text
connectorType = double + quantity
→ itemKey = connector_double
→ quantity
→ unit = adet
```

Bu resolver quantity üretmez veya tahmin etmez; quantity çağıran tarafından açıkça verilmek zorundadır. Eksik, sıfır veya bilinmeyen connector girdisi fail eder.

Bu Item'ın migration completion'ı sahnede ayrı mesh olarak görünmesine veya mevcut bir parent reçetede zorunlu olarak kullanılmasına bağlı değildir. Mevcut çalışan kodda olmayan kullanım/quantity kuralı migration sırasında icat edilmez.

## 4. State / kalıcılık / davranış / renderer

Mevcut sistemde bağımsız `connector_double` proje örneği/state/kalıcılık/behavior/mesh identity bulunmadığı için bu alanlar **uygulanmıyor**. Migration bunları icat etmez.

## 5. Uygulanan geçiş

- `src/productionParts.js`: kanonik `itemKey = connector_double`.
- `connectorType = double` kanonik Item kimliğine çözülür.
- `resolveConnectorBom()` explicit quantity ile `itemKey + quantity + unit` BOM satırı üretir.
- Fixed parent recipe kullanımı yoktur; bu alan mevcut sistem için uygulanmıyor.
- Mevcut reçetelere tahmini quantity eklenmez.

## 6. Regresyon sözleşmesi

Testler şunları doğrular:

- kanonik kimlik `itemKey`dir; `partId` yoktur.
- `connectorType = double` doğru Item'a çözülür.
- resolver explicit quantity ile gerçek `connector_double` BOM satırı üretir.
- quantity eksik/0 ise fail eder; miktar uydurmaz.
- mevcut fixed module recipes içine yanlışlıkla `connector_double` eklenmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = connector_double
unit = adet
canonical BOM resolver = VAR
fixed parent recipe kullanımı = UYGULANMIYOR
state/persistence/behavior/renderer = UYGULANMIYOR
migration status = TAMAM
```
