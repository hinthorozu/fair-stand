# connector_double — Item Contract Migration

Bu belge `docs/items/current-system/connector_double.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanan cutover durumunu kaydeder.

## 1. Canonical kimlik

| Alan | Değer |
|---|---|
| `itemKey` | `connector_double` |
| Ad | `Çiftli Aparat` |
| `type` | `connector` |
| Item yapısı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| Metadata | `connectorType = double` |
| Project instance | Uygulanmıyor |
| Renderer identity | Uygulanmıyor |

Migration öncesi stabil kimlik `partId = connector_double` idi. Cutover ile aynı ürün kimliği `itemKey` alanına taşındı.

## 2. Recipe ile relationship ayrımı

Migration öncesi doğrulanan mevcut sistemde `connector_double` hiçbir sabit module recipe içinde yer almıyordu. Bu gerçek korunur; sırf Item'ı BOM'a sokmak için mevcut recipe'lere tahmini miktar eklenmez.

`connector_double` buna rağmen aktif production/BOM Item'ıdır. Canonical connector BOM resolver açıkça verilen `double` gereksinimini:

```text
connectorType = double + quantity
→ connector_double
→ quantity + unit=adet
```

olarak üretir.

## 3. Quantity ownership

`src/productionParts.js` quantity üretmez veya tahmin etmez. Quantity, gerçek bağlantı/relationship'i bilen canonical caller tarafından sağlanmak zorundadır.

Özellikle transient placement `snapKind` değerleri otomatik olarak `connector_double` miktarına çevrilmez. Mevcut kodda bu ürün kararını doğrulayan kalıcı relationship/quantity kaynağı bulunmadığı için migration böyle bir mapping icat etmez.

Bu ayrım `connector_double`ı pasif yapmaz: Item canonical BOM resolver'ın gerçek çıktı tipidir; yalnız miktar ownership'i doğru katmanda tutulur.

## 4. State / persistence / renderer

Mevcut sistemde bağımsız `connector_double` project instance/state/persistence/mesh identity bulunmadığı için migration bunları icat etmez.

## 5. Uygulanan cutover

- `src/productionParts.js`: canonical `itemKey = connector_double`.
- `src/productionParts.js`: `connectorType = double` gereksinimini canonical BOM satırına çözer.
- BOM çıktısı `itemKey + quantity + unit` taşır.
- Sabit module recipe'lere tahmini `connector_double` miktarı eklenmez.

## 6. Regression sözleşmesi

Testler şunları doğrular:

- canonical kimlik `itemKey`dir; `partId` yoktur.
- `connectorType = double` doğru Item'a çözülür.
- BOM resolver gerçek `connector_double` satırı üretir.
- quantity eksik/0 ise resolver fail eder; miktar uydurmaz.
- mevcut fixed module recipes içine yanlışlıkla double eklenmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = connector_double
unit = adet
BOM status = aktif canonical connector BOM çıktısı
quantity owner = canonical caller / relationship layer
fixed module recipe quantity = yok; tahmin edilmez
```
