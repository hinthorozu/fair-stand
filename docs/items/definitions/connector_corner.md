# connector_corner — Item Contract Migration

Bu belge `docs/items/current-system/connector_corner.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanan cutover durumunu kaydeder.

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

Migration öncesi stabil kimlik `partId = connector_corner` idi. Cutover ile aynı ürün kimliği `itemKey` alanına taşındı.

## 2. Recipe ile relationship ayrımı

Migration öncesi doğrulanan mevcut sistemde `connector_corner` sabit module recipe içinde yer almıyordu. Bu nedenle migration mevcut recipe'lere tahmini corner miktarı yazmaz.

`connector_corner` canonical production Item tanımıdır. `resolveConnectorBom()` yardımcı resolver'ı, bir caller açıkça `corner` gereksinimi ve doğrulanmış quantity verdiğinde şu capability'yi sağlar:

```text
connectorType = corner + quantity
→ connector_corner
→ quantity + unit=adet
```

olarak üretebilir. Mevcut çalışan `src/` runtime içinde bu resolver'ı çağıran gerçek consumer yoktur; bu nedenle bu capability aktif BOM consumer cutover'ı olarak sayılmaz.

## 3. Placement `corner` ile ürün `connector_corner` ayrımı

Mevcut placement motorunda `snapKind = corner` adlı geometrik/transient bir kavram vardır. Migration bu isim benzerliğini tek başına production quantity kuralına çevirmemektedir.

`src/productionParts.js` quantity veya placement mapping'i tahmin etmez. Resolver kullanılacaksa gerçek ürün ihtiyacını bilen doğrulanmış caller `connectorType = corner` ve quantity sağlamalıdır. Mevcut çalışan runtime'da böyle bir caller/quantity source henüz yoktur.

Bu nedenle renderer/placement geometrisi production source of truth yapılmaz ve gerçek consumer doğrulanmadan Köşe Aparatı aktif runtime BOM çıktısı sayılmaz.

## 4. State / persistence / renderer

Mevcut sistemde bağımsız `connector_corner` project instance/state/persistence/mesh identity bulunmadığı için migration bunları icat etmez.

## 5. Uygulanan cutover

- `src/productionParts.js`: canonical `itemKey = connector_corner`.
- `resolveConnectorBom()` explicit `connectorType = corner + quantity` girdisini `itemKey + quantity + unit` capability'siyle çözebilir.
- Mevcut çalışan `src/` runtime içinde `resolveConnectorBom()` consumer'ı yoktur.
- Sabit module recipe'lere tahmini corner quantity eklenmez.
- Gerçek consumer/quantity source doğrulanana kadar migration completion açık kalır.

## 6. Regression sözleşmesi

Testler şunları doğrular:

- canonical kimlik `itemKey`dir; `partId` yoktur.
- `connectorType = corner` doğru Item'a çözülür.
- resolver capability doğrudan çağrıldığında `connector_corner` satırı üretir.
- quantity eksik/0 ise resolver fail eder.
- mevcut fixed module recipes içine corner miktarı uydurulmaz.
- çalışan `src/` runtime'da resolver consumer'ı olmadığı ayrıca regression ile doğrulanır; test içinden doğrudan resolver çağrısı aktif consumer kanıtı sayılmaz.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = connector_corner
unit = adet
BOM resolver capability = var
active runtime BOM consumer = yok
quantity source = mevcut çalışan runtime'da yok; tahmin edilmez
fixed module recipe quantity = yok; tahmin edilmez
migration status = Bekliyor — gerçek consumer cutover doğrulanana kadar
```
