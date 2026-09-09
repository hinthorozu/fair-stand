# panel_corner_92 — Item Contract Definition

Bu belge `panel_corner_92` Item'ının canonical Item Contract tanımını ve doğrulanmış inner-corner BOM replacement kuralını kaydeder. Pre-migration kod haritası `docs/items/current-system/panel_corner_92.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `panel_corner_92` | VAR |
| `type` | `panel` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `panelRole` | `inner-corner` | VAR |
| `nominalModuleWidthCm` | `100` | VAR |
| dimensions | `92 × 47 × 0.8 cm` | VAR |

Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.panel_corner_92` kaydıdır. Legacy `partId` kaldırılmıştır; ikinci/paralel ürün kimliği oluşturulmamıştır.

## 2. Factory / catalog

- Project-instance factory: **UYGULANMIYOR**. `panel_corner_92` bağımsız scene/project instance değildir.
- Doğrudan catalog kaydı: **UYGULANMIYOR**. Parent module recipe'lerinde production Item olarak kullanılır.

## 3. State / persistence

- Ayrı mutable Item state: **UYGULANMIYOR**.
- Default/configurable Item state: **UYGULANMIYOR**.
- Ayrı project `id`: **UYGULANMIYOR**.
- Ayrı persistence entity/schema veya save/load migration: **UYGULANMIYOR**.

Migration state veya persistence alanı icat etmez.

## 4. Behavior / interaction / renderer

- Placement/move/rotation/collision/snap behavior: **UYGULANMIYOR**.
- Selection/drag/context-menu/keyboard interaction: **UYGULANMIYOR**.
- Item-identity tabanlı renderer/asset/mesh: **UYGULANMIYOR**.

Renderer, UI veya transient placement sonucu BOM source-of-truth yapılmaz.

## 5. Item ilişkileri

`panel_corner_92`, `panel_98` Item'ının child Item'ı değildir. İkisi ayrı Tekil Item'dır:

```text
panel_98             -> panelRole = straight
panel_corner_92      -> panelRole = inner-corner
```

Doğrulanmış relationship-derived BOM kuralı, parent recipe'nin eşleşen straight panel satırında **1:1 replacement** yapılmasıdır. Relationship'in sahneden nasıl canonical olarak üretileceği project-level Final BOM/relationship resolver sorumluluğudur; bu Item migrationı placement state'ine yeni alan eklemez.

## 6. Recipe referansları

Canonical `innerCornerPanelItemKey = panel_corner_92` referansı tam **7** doğrulanmış 100 cm recipe'de bulunur:

| Recipe | Straight panel | Quantity | Inner-corner sonucu |
|---|---|---:|---|
| `wall-straight-100` | `panel_98` | 7 | `panel_corner_92 × 7` |
| `door-100` | `panel_98` | 3 | `panel_corner_92 × 3` |
| `shelf-wall-100-2` | `panel_98` | 7 | `panel_corner_92 × 7` |
| `shelf-wall-100-3` | `panel_98` | 7 | `panel_corner_92 × 7` |
| `showcase-2-100` | `panel_98` | 5 | `panel_corner_92 × 5` |
| `showcase-3-100` | `panel_98` | 4 | `panel_corner_92 × 4` |
| `base-wall-100` | `panel_98` | 7 | `panel_corner_92 × 7` |

Legacy `innerCornerPanelPartId` referansı bu recipe'lerde kaldırılmıştır.

## 7. BOM resolver ve quantity ownership

Canonical recipe/BOM resolver `src/moduleRecipes.js` içindedir. Normal konfigürasyonda mevcut `panel_98` satırı korunur. Caller doğrulanmış relationship/configuration bilgisini:

```js
{ panelVariant: 'inner-corner' }
```

olarak verdiğinde canonical `innerCornerPanelItemKey` taşıyan recipe'de eşleşen straight panel satırı değiştirilir:

```text
panel_98 × N
    ↓ 1:1 replacement
panel_corner_92 × N
```

Quantity **aynen parent recipe'den** gelir. Resolver sabit quantity varsaymaz, miktarı arttırmaz ve straight + corner paneli birlikte BOM'a eklemez. Nihai BOM birimi `adet`tir.

## 8. Pricing / recursive BOM

- Pricing: **UYGULANMIYOR**. BOM yalnız gereken Item, quantity ve unit üretir; maliyet/fiyat ayrı sorumluluktur.
- Recursive BOM: **UYGULANMIYOR**. `panel_corner_92` Tekil Item'dır ve alt Item listesi yoktur.

## 9. Regression sözleşmesi

`test/cornerPanelsItemContract.test.js` ve ilgili recipe testleri şunları kilitler:

1. canonical `itemKey = panel_corner_92` vardır ve legacy `partId` yoktur,
2. production metadata `92 × 47 × 0.8`, `panel`, `adet`, `inner-corner`, `100` olarak korunur,
3. tam `7` doğrulanmış parent recipe canonical `innerCornerPanelItemKey` kullanır,
4. inner-corner çözümünde `panel_98 × N` tamamen kaldırılır ve `panel_corner_92 × N` **aynı miktarla** gelir,
5. diğer recipe kalemlerinin quantity değerleri değişmez,
6. straight panel + corner panel duplicate quantity oluşmaz.

## 10. Açık sistem konusu

Project placement/relationship state'inden `panelVariant = inner-corner` kararını otomatik üretip tüm proje için Final BOM oluşturan project-level canonical resolver bu Item migrationının dışında kalır. Item-level replacement kuralı doğrulanmış ve callable durumdadır; scene geometry'den otomatik Final BOM çıkarımı ayrı sistem işidir ve bu Item'ın kimlik/BOM migrationını bloke etmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = panel_corner_92
type = panel
unit = adet
dimensions = 92 × 47 × 0.8 cm
panelRole = inner-corner
nominalModuleWidthCm = 100
canonical parent variant refs = 7
replacement rule = panel_98 × N -> panel_corner_92 × N (1:1)
state/persistence/renderer = uygulanmıyor
project-level relationship -> Final BOM = açık sistem işi
```
