# connector_start — Item Contract Migration

Bu belge `docs/items/current-system/connector_start.md` içindeki migration öncesi kod haritasını `docs/items/contract/ITEM_CONTRACT.md` ve `ITEM_CONTRACT_CHECKLIST.md` ile eşler ve uygulanmış canonical cutover durumunu kaydeder.

Bu belge yeni behavior, relationship, quantity veya renderer kuralı icat etmez. Yalnız doğrulanmış mevcut runtime ile uygulanmış Item Contract migrationını kayıt altına alır.

## 1. Kimlik ve sınıflandırma

| Alan | Durum / değer |
|---|---|
| `itemKey` | `connector_start` |
| Ad | `Başlangıç Aparatı` |
| `type` | `connector` |
| Item yapısı | Tekil Item |
| Parametrik | Hayır |
| `unit` | `adet` |
| Item metadata | `connectorType = start` |
| Project instance `id` | Uygulanmıyor |
| Factory / oluşturulma noktası | Uygulanmıyor; bağımsız project instance oluşturulmuyor |
| Catalog bağlantısı | Doğrudan catalog Item değildir; parent module recipe içinde production Item olarak kullanılır |

Migration öncesi gerçek production kimliği `partId = connector_start` idi. Migration ile aynı ürün canonical `itemKey = connector_start` kimliğine taşındı; paralel ikinci ürün kimliği oluşturulmadı.

Canonical runtime tanımı `src/productionParts.js` içindedir:

```js
connector_start: Object.freeze({
  itemKey: 'connector_start',
  name: 'Başlangıç Aparatı',
  type: 'connector',
  unit: 'adet',
  connectorType: 'start'
})
```

## 2. State ve veri modeli

`connector_start` bağımsız proje Item instance'ı değildir.

Bu nedenle checklist karşılıkları:

- Instance state: **uygulanmıyor**.
- Default project state: **uygulanmıyor**.
- Configurable project alanları: **uygulanmıyor**.
- Project instance `id`: **uygulanmıyor**.
- Child/alt state: **uygulanmıyor**.
- Persistent state: **uygulanmıyor**.
- Save/load migration: **uygulanmıyor**; connector ayrı state olarak kaydedilmez.

Production metadata `src/productionParts.js`; miktar state'i ise parent recipe içinde `src/moduleRecipes.js` tarafından tutulur.

## 3. Behavior

`connector_start` için bağımsız editor behavior instance'ı bulunmaz.

Aşağıdaki behavior alanları mevcut sistemde connector production Item seviyesinde **uygulanmıyor**:

- placement,
- move/drag,
- rotation / rotation step / default rotation,
- collision,
- magnetic veya boundary snap,
- side insert,
- overlap,
- host capacity,
- ghost / preview.

`type = connector` production sınıflandırmasıdır; mevcut runtime'da bu Item için bağımsız scene behavior contract'ı oluşturmaz. Migration bu davranışları icat etmez.

## 4. Interaction

`connector_start` sahnede seçilebilir/taşınabilir bağımsız bir project instance değildir.

Bu nedenle aşağıdakiler **uygulanmıyor**:

- sol click selection,
- drag,
- sağ click/context menu,
- keyboard interaction,
- duplicate,
- delete.

Raw BOM debug UI bu Item'ı recipe çıktısında metin olarak gösterebilir; bu durum Item interaction kimliği anlamına gelmez.

## 5. Renderer

Mevcut sistemde `connector_start` için bağımsız renderer/mesh/asset identity yoktur.

Checklist karşılıkları:

- Renderer tipi: **uygulanmıyor**.
- Asset bağlantısı: **uygulanmıyor**.
- Renk/image/özel görsel modu: **uygulanmıyor**.
- Ghost renderer: **uygulanmıyor**.

Renderer production BOM source-of-truth değildir. Migration connector miktarını renderer geometrisinden türetmez.

## 6. Item ilişkileri

`connector_start` başka Item'lardan oluşmaz; kendisi Tekil Item'dır.

Mevcut doğrulanmış sistemde:

- child Item listesi: **yok**,
- parent-child project relationship: **yok**,
- persistent neighbor/connection relationship: **yok**,
- host/overlay relationship: **yok**,
- continuous chain/reflow: **yok**,
- relationship resolver: **yok / uygulanmıyor**,
- relationship-derived behavior: **yok**,
- relationship-derived BOM: **yok**.

`src/modulePlacement.js` içindeki geometrik `snapKind` değerleri ile `connector_start` production quantity arasında canonical mapping yoktur. Migration böyle bir mapping uydurmaz.

## 7. BOM / production

`connector_start` aktif production/BOM Item'ıdır.

Canonical metadata sahibi:

```text
src/productionParts.js
```

Canonical parent quantity sahibi:

```text
src/moduleRecipes.js
```

Aktif recipe yolu:

```text
parent module recipe
→ { itemKey: 'connector_start', quantity: N }
→ expandRecipe()
→ getProductionItem('connector_start')
→ quantity + unit=adet + production metadata
```

Migration sonrası `connector_start` **27/27 verified recipe** içinde canonical `itemKey` ile kullanılır; `partId` recipe occurrence kalmamıştır.

Doğrulanmış miktar dağılımı:

| Recipe ailesi | Recipe sayısı | Quantity |
|---|---:|---:|
| straight wall 50/100/150/200 | 4 | 2 |
| door 100 | 1 | 2 |
| shelf 100/150/200 × 2/3 raf | 6 | 2 |
| showcase 2/3 göz | 2 | 4 |
| separator 50/100 | 2 | 2 |
| L counter 100/150/200 | 3 | 8 |
| straight counter 100/150/200 | 3 | 6 |
| base-wall 100/150/200 | 3 | 6 |
| base 100/150/200 | 3 | 8 |

Toplam: **27 recipe**.

BOM checklist karşılıkları:

- BOM var mı?: **Evet**.
- BOM policy: parent module tarafında `mode = recipe`.
- Recipe kaynağı: `src/moduleRecipes.js`.
- Production lookup: `getProductionItem()` / `src/productionParts.js`.
- Child Item listesi: **yok**; Tekil Item.
- Quantity: parent recipe tarafından açıkça verilir.
- Unit: `adet`.
- Recursive BOM: connector'ın kendisi için **uygulanmıyor**; nihai BOM kalemidir.
- Circular dependency: **uygulanmıyor**.
- Variant BOM: **yok**.
- State/ölçü/parametre kaynaklı BOM: **yok**.
- Relationship-derived BOM: **yok**.
- Final project BOM bağlantısı: project-level canonical Final BOM resolver ayrı sistem işi olarak değerlendirilir; bu Item migrationı onu icat etmez.

## 8. Maliyet / fiyatlandırma ayrımı

`connector_start` tanımı ihtiyaç/miktar/birim bilgisini üretim tarafında taşır; birim fiyat veya satış fiyatı Item recipe içine gömülmez.

- BOM yalnız Item + quantity + unit üretir: **Evet**.
- Pricing canonical production recipe'nin parçası mı?: **Hayır**.
- Birim fiyat değişikliği recipe quantity'yi değiştirmeli mi?: **Hayır**.

Bu migration pricing sistemi eklemez.

## 9. Uygulanan cutover

- `src/productionParts.js`: `partId` kaldırıldı; canonical `itemKey = connector_start` oldu.
- `src/moduleRecipes.js`: 27/27 recipe kullanımı `{ itemKey: 'connector_start', quantity: N }` oldu.
- `getProductionItem()` canonical lookup olarak kullanılır.
- `getProductionPart()` incremental migration süresince legacy compatibility wrapper olarak korunur.
- Existing recipe quantity'leri değiştirilmedi.
- State, persistence, behavior, interaction ve renderer'a yeni connector instance mantığı eklenmedi.
- Placement geometry'den connector quantity tahmin edilmedi.

## 10. Test ve kalite

Mevcut regression sözleşmesi şunları doğrular:

- `connector_start.itemKey === 'connector_start'`.
- `partId` canonical production tanımında yoktur.
- `type === 'connector'`.
- `connectorType === 'start'`.
- `unit === 'adet'`.
- 27 recipe'nin tamamında identity `itemKey`dir.
- Migration sonrası recipe quantity parity korunur.
- Expanded recipe metadata'yı canonical `itemKey` üzerinden çözer.
- Connector family mapping `start → connector_start` olarak çözülür.

State/behavior/interaction/persistence testleri connector project instance'ı olmadığı için **uygulanmıyor**.

Browser tarafında Raw BOM mevcut expanded recipe yolunu tüketmeye devam eder; migration renderer veya UI quantity kuralı oluşturmaz.

## 11. Açık problemler / sınırlar

- `connector_start` miktarı mevcut sistemde parent recipe içinde sabittir; gerçek scene adjacency'den türetilmez.
- Placement snap ilişkisi ile production connector quantity arasında canonical relationship mapping yoktur.
- Project-level canonical Final BOM sistemi bu Item definition'ın kapsamı değildir.
- `getProductionPart()` compatibility yolu, diğer production Item migrationları tamamlanana kadar bilinçli olarak korunmaktadır; zero legacy usage doğrulanmadan silinmez.

Bunlar migration sırasında tahminle kapatılmaz.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = connector_start
type = connector
connectorType = start
unit = adet
recipe identity cutover = 27/27
legacy recipe partId occurrence = 0
quantity ownership = src/moduleRecipes.js
production metadata ownership = src/productionParts.js
project instance/state/persistence = uygulanmıyor
behavior/interaction/renderer identity = uygulanmıyor
relationship-derived quantity = yok; tahmin edilmez
```
