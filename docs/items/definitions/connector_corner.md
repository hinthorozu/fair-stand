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

`connector_corner` aktif production/BOM Item'ıdır. Canonical connector BOM resolver açıkça verilen `corner` gereksinimini:

```text
connectorType = corner + quantity
→ connector_corner
→ quantity + unit=adet
```

olarak üretir.

## 3. Placement `corner` ile ürün `connector_corner` ayrımı

Mevcut placement motorunda `snapKind = corner` adlı geometrik/transient bir kavram vardır. Migration bu isim benzerliğini tek başına production quantity kuralına çevirmemektedir.

`src/productionParts.js` quantity veya placement mapping'i tahmin etmez; gerçek relationship'i bilen canonical caller `connectorType = corner` ve doğrulanmış quantity sağlamalıdır.

Böylece Köşe Aparatı BOM'da aktif kalırken renderer/placement geometrisi production source of truth yapılmaz.

## 4. State / persistence / renderer

Mevcut sistemde bağımsız `connector_corner` project instance/state/persistence/mesh identity bulunmadığı için migration bunları icat etmez.

## 5. Uygulanan cutover

- `src/productionParts.js`: canonical `itemKey = connector_corner`.
- `src/productionParts.js`: `connectorType = corner` gereksinimini canonical BOM satırına çözer.
- BOM çıktısı `itemKey + quantity + unit` taşır.
- Sabit module recipe'lere tahmini corner quantity eklenmez.

## 6. Regression sözleşmesi

Testler şunları doğrular:

- canonical kimlik `itemKey`dir; `partId` yoktur.
- `connectorType = corner` doğru Item'a çözülür.
- BOM resolver gerçek `connector_corner` satırı üretir.
- quantity eksik/0 ise resolver fail eder.
- mevcut fixed module recipes içine corner miktarı uydurulmaz.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = connector_corner
unit = adet
BOM status = aktif canonical connector BOM çıktısı
quantity owner = canonical caller / relationship layer
fixed module recipe quantity = yok; tahmin edilmez
```
