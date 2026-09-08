# connector_single — Item Contract Migration

Bu belge `docs/items/current-system/connector_single.md` içindeki migration öncesi kod haritasını Item Contract'a map eder ve uygulanan cutover durumunu kaydeder.

## 1. Canonical kimlik

| Alan | Değer |
|---|---|
| `itemKey` | `connector_single` |
| Ad | `Tekli Aparat` |
| `type` | `connector` |
| Item yapısı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| Metadata | `connectorType = single` |
| Project instance | Uygulanmıyor |
| Renderer / placement identity | Uygulanmıyor |

Migration öncesi stabil kimlik `partId = connector_single` idi. Cutover ile aynı ürün kimliği `itemKey` alanına taşındı; paralel ikinci ürün kimliği üretilmedi.

## 2. Mevcut recipe sahipliği

`connector_single` mevcut çalışan sistemde 27 recipe'nin tamamında sabit miktarlı production kalemidir. Miktarların canonical sahibi `src/moduleRecipes.js` olarak korunmuştur.

Migration miktarları değiştirmez; yalnız recipe kimlik alanını `partId` → `itemKey` olarak taşır.

## 3. BOM

Aktif recipe yolu:

```text
module recipe
→ { itemKey: 'connector_single', quantity: N }
→ expandRecipe()
→ getProductionItem('connector_single')
→ quantity + unit=adet + production metadata
```

`connector_single` için yeni ilişki veya renderer kaynaklı miktar hesabı eklenmez. Mevcut recipe miktarları source of truth olarak korunur.

## 4. State / persistence / renderer

Mevcut sistemde bağımsız `connector_single` project instance/state/persistence/mesh identity bulunmadığı için migration bunları icat etmez.

## 5. Uygulanan cutover

- `src/productionParts.js`: canonical `itemKey = connector_single`.
- `src/moduleRecipes.js`: 27/27 recipe kullanımı `itemKey` oldu.
- `getProductionPart()` legacy lookup compatibility olarak `getProductionItem()` yolunu kullanmaya devam eder.
- Diğer production Item'lar bu migration nedeniyle topluca `itemKey`e geçirilmez.
- Recipe quantity parity korunur.

## 6. Regression sözleşmesi

Testler şunları doğrular:

- 27 recipe'nin tamamında `connector_single` yalnız `itemKey` ile bulunur.
- `partId` taşımaz.
- Miktarlar migration öncesi değerlerle aynıdır.
- Expanded recipe production metadata'yı çözmeye devam eder.
- Komşu, henüz migrate edilmemiş recipe Item'ları yanlışlıkla `itemKey`e geçmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = connector_single
unit = adet
recipe identity cutover = 27/27
quantity ownership = moduleRecipes.js
state/persistence/renderer identity = yok
```
