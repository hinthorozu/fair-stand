# panel_corner_192 — Item Contract Definition

Bu belge `panel_corner_192` Item'ının canonical Item Contract tanımını ve doğrulanmış inner-corner BOM replacement kuralını kaydeder. Pre-migration kod haritası `docs/items/current-system/panel_corner_192.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `panel_corner_192` | VAR |
| `type` | `panel` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `panelRole` | `inner-corner` | VAR |
| `nominalModuleWidthCm` | `200` | VAR |
| dimensions | `192 × 47 × 0.8 cm` | VAR |

Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.panel_corner_192` kaydıdır. Legacy `partId` kaldırılmıştır; ikinci/paralel ürün kimliği oluşturulmamıştır.

## 2. Factory / catalog

- Project-instance factory: **UYGULANMIYOR**. `panel_corner_192` bağımsız scene/project instance değildir.
- Doğrudan catalog kaydı: **UYGULANMIYOR**. Parent module recipe'lerinde production Item olarak kullanılır.

## 3. State / persistence

- Ayrı mutable Item state: **UYGULANMIYOR**.
- Ayrı project `id`: **UYGULANMIYOR**.
- Ayrı persistence entity/schema: **UYGULANMIYOR**.

Migration state veya persistence alanı icat etmez.

## 4. Behavior / interaction / renderer

- Placement/move/rotation/collision/snap behavior: **UYGULANMIYOR**.
- Selection/drag/context-menu interaction: **UYGULANMIYOR**.
- Item-identity tabanlı renderer/mesh: **UYGULANMIYOR**.

Renderer, UI veya transient placement sonucu BOM source-of-truth yapılmaz.

## 5. Item ilişkileri

`panel_corner_192`, `panel_197`nin child Item'ı değildir. İkisi ayrı Tekil Item'dır:

```text
panel_197        -> panelRole = straight
panel_corner_192 -> panelRole = inner-corner
```

Doğrulanmış relationship-derived BOM kuralı, parent recipe'nin panel satırında **1:1 replacement** yapılmasıdır. Relationship'in sahneden nasıl canonical olarak üretileceği project-level Final BOM/relationship resolver sorumluluğudur; bu Item migrationı placement state'ine yeni alan eklemez.

## 6. Recipe referansları

Canonical `innerCornerPanelItemKey = panel_corner_192` referansı tam dört doğrulanmış 200 cm recipe'de bulunur:

| Recipe | Straight panel | Quantity | Inner-corner sonucu |
|---|---|---:|---|
| `wall-straight-200` | `panel_197` | 7 | `panel_corner_192 × 7` |
| `shelf-wall-200-2` | `panel_197` | 7 | `panel_corner_192 × 7` |
| `shelf-wall-200-3` | `panel_197` | 7 | `panel_corner_192 × 7` |
| `base-wall-200` | `panel_197` | 7 | `panel_corner_192 × 7` |

50/100/150 cm sibling corner panel Item'ları da artık canonical `innerCornerPanelItemKey` yolundadır; corner-panel ailesinde legacy `innerCornerPanelPartId` recipe metadata'sı kalmamıştır.

## 7. BOM resolver ve quantity ownership

Canonical recipe/BOM resolver `src/moduleRecipes.js` içindedir. Normal konfigürasyonda mevcut `panel_197` satırı korunur. Caller doğrulanmış relationship/configuration bilgisini:

```js
{ panelVariant: 'inner-corner' }
```

olarak verdiğinde yalnız canonical `innerCornerPanelItemKey` taşıyan recipe'lerde eşleşen straight panel satırı değiştirilir:

```text
panel_197 × N
    ↓ 1:1 replacement
panel_corner_192 × N
```

Quantity **aynen parent recipe'den** gelir. Resolver quantity tahmin etmez, arttırmaz veya iki paneli birlikte BOM'a eklemez.

Örnek:

```text
normal:       panel_197 × 7
inner-corner: panel_corner_192 × 7
```

Nihai BOM birimi `adet`tir.

## 8. Pricing

Pricing bu Item/BOM zincirinde **UYGULANMIYOR**. Item/BOM yalnız gereken Item, quantity ve unit üretir; maliyet/fiyat ayrı sorumluluktur.

## 9. Regression sözleşmesi

`test/panelCorner192ItemContract.test.js` ve ilgili recipe testleri şunları kilitler:

1. canonical `itemKey = panel_corner_192` ve legacy `partId` yoktur,
2. production metadata `192 × 47 × 0.8`, `panel`, `adet`, `inner-corner`, `200` olarak korunur,
3. tam dört 200 cm recipe canonical `innerCornerPanelItemKey` kullanır,
4. inner-corner çözümünde `panel_197 × N` tamamen kaldırılır ve `panel_corner_192 × N` aynı miktarla gelir,
5. diğer recipe kalemlerinin quantity değerleri değişmez,
6. sibling 50/100/150 cm corner panel Item'ları da kendi doğrulanmış straight-panel quantity değerlerini 1:1 replacement ile korur.

## 10. Açık sistem konusu

Project placement/relationship state'inden `panelVariant = inner-corner` kararını otomatik üretip tüm proje için Final BOM oluşturan project-level canonical resolver bu Item migrationının dışında kalır. Bu nedenle Item-level replacement kuralı hazır olsa da sahnedeki geometriden otomatik Final BOM çıkarımı ayrı iş olarak açıktır.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = panel_corner_192
type = panel
unit = adet
dimensions = 192 × 47 × 0.8 cm
panelRole = inner-corner
nominalModuleWidthCm = 200
canonical parent variant refs = 4
replacement rule = panel_197 × N -> panel_corner_192 × N (1:1)
state/persistence/renderer = uygulanmıyor
project-level relationship -> Final BOM = açık sistem işi
```
