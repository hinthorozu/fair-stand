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

`connector_double` canonical production Item tanımıdır. `resolveConnectorBom()` yardımcı resolver'ı, bir caller açıkça `double` gereksinimi ve doğrulanmış quantity verdiğinde şu capability'yi sağlar:

```text
connectorType = double + quantity
→ connector_double
→ quantity + unit=adet
```

olarak üretebilir. Mevcut çalışan `src/` runtime içinde bu resolver'ı çağıran gerçek consumer yoktur; bu nedenle bu capability aktif BOM consumer cutover'ı olarak sayılmaz.

## 3. Quantity ownership

`src/productionParts.js` quantity üretmez veya tahmin etmez. Resolver kullanılacaksa quantity, gerçek ürün ihtiyacını bilen doğrulanmış bir caller tarafından sağlanmak zorundadır. Mevcut çalışan runtime'da böyle bir caller/quantity source henüz yoktur.

Özellikle transient placement `snapKind` değerleri otomatik olarak `connector_double` miktarına çevrilmez. Mevcut kodda bu ürün kararını doğrulayan kalıcı relationship/quantity kaynağı bulunmadığı için migration böyle bir mapping icat etmez.

Bu nedenle canonical Item identity ve resolver capability hazırdır; fakat gerçek runtime BOM consumer cutover'ı tamam değildir. Consumer/quantity source doğrulanmadan Item `Tamam` sayılmaz.

## 4. State / persistence / renderer

Mevcut sistemde bağımsız `connector_double` project instance/state/persistence/mesh identity bulunmadığı için migration bunları icat etmez.

## 5. Uygulanan cutover

- `src/productionParts.js`: canonical `itemKey = connector_double`.
- `resolveConnectorBom()` explicit `connectorType = double + quantity` girdisini `itemKey + quantity + unit` capability'siyle çözebilir.
- Mevcut çalışan `src/` runtime içinde `resolveConnectorBom()` consumer'ı yoktur.
- Sabit module recipe'lere tahmini `connector_double` miktarı eklenmez.
- Gerçek consumer/quantity source doğrulanana kadar migration completion açık kalır.

## 6. Regression sözleşmesi

Testler şunları doğrular:

- canonical kimlik `itemKey`dir; `partId` yoktur.
- `connectorType = double` doğru Item'a çözülür.
- resolver capability doğrudan çağrıldığında `connector_double` satırı üretir.
- quantity eksik/0 ise resolver fail eder; miktar uydurmaz.
- mevcut fixed module recipes içine yanlışlıkla double eklenmez.
- çalışan `src/` runtime'da resolver consumer'ı olmadığı ayrıca regression ile doğrulanır; test içinden doğrudan resolver çağrısı aktif consumer kanıtı sayılmaz.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = connector_double
unit = adet
BOM resolver capability = var
active runtime BOM consumer = yok
quantity source = mevcut çalışan runtime'da yok; tahmin edilmez
fixed module recipe quantity = yok; tahmin edilmez
migration status = Bekliyor — gerçek consumer cutover doğrulanana kadar
```
