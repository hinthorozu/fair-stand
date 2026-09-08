# panel_corner_42_5 — Item Contract Definition

Bu belge `panel_corner_42_5` Item'ının canonical Item Contract tanımını ve doğrulanmış inner-corner BOM replacement kuralını kaydeder. Pre-migration kod haritası `docs/items/current-system/panel_corner_42_5.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `panel_corner_42_5` | VAR |
| `type` | `panel` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `panelRole` | `inner-corner` | VAR |
| `nominalModuleWidthCm` | `50` | VAR |
| dimensions | `42,5 × 47 × 0.8 cm` | VAR |

Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.panel_corner_42_5` kaydıdır. Legacy `partId` kaldırılmıştır; ikinci/paralel ürün kimliği oluşturulmamıştır.

## 2. Factory / catalog

- Project-instance factory: **UYGULANMIYOR**. `panel_corner_42_5` bağımsız scene/project instance değildir.
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

`panel_corner_42_5`, `panel_48_5` Item'ının child Item'ı değildir. İkisi ayrı Tekil Item'dır:

```text
panel_48_5           -> panelRole = straight
panel_corner_42_5    -> panelRole = inner-corner
```

Doğrulanmış relationship-derived BOM kuralı, parent recipe'nin eşleşen straight panel satırında **1:1 replacement** yapılmasıdır. Relationship'in sahneden nasıl canonical olarak üretileceği project-level Final BOM/relationship resolver sorumluluğudur; bu Item migrationı placement state'ine yeni alan eklemez.

## 6. Recipe referansları

Canonical `innerCornerPanelItemKey = panel_corner_42_5` referansı tam **1** doğrulanmış 50 cm recipe'de bulunur:

| Recipe | Straight panel | Quantity | Inner-corner sonucu |
|---|---|---:|---|
| `wall-straight-50` | `panel_48_5` | 7 | `panel_corner_42_5 × 7` |

Legacy `innerCornerPanelPartId` referansı bu recipe'lerde kaldırılmıştır.

## 7. BOM resolver ve quantity ownership

Canonical recipe/BOM resolver `src/moduleRecipes.js` içindedir. Normal konfigürasyonda mevcut `panel_48_5` satırı korunur. Caller doğrulanmış relationship/configuration bilgisini:

```js
{ panelVariant: 'inner-corner' }
```

olarak verdiğinde canonical `innerCornerPanelItemKey` taşıyan recipe'de eşleşen straight panel satırı değiştirilir:

```text
panel_48_5 × N
    ↓ 1:1 replacement
panel_corner_42_5 × N
```

Quantity **aynen parent recipe'den** gelir. Resolver sabit quantity varsaymaz, miktarı arttırmaz ve straight + corner paneli birlikte BOM'a eklemez. Nihai BOM birimi `adet`tir.

## 8. Pricing / recursive BOM

- Pricing: **UYGULANMIYOR**. BOM yalnız gereken Item, quantity ve unit üretir; maliyet/fiyat ayrı sorumluluktur.
- Recursive BOM: **UYGULANMIYOR**. `panel_corner_42_5` Tekil Item'dır ve alt Item listesi yoktur.

## 9. Regression sözleşmesi

`test/cornerPanelsItemContract.test.js` ve ilgili recipe testleri şunları kilitler:

1. canonical `itemKey = panel_corner_42_5` vardır ve legacy `partId` yoktur,
2. production metadata `42,5 × 47 × 0.8`, `panel`, `adet`, `inner-corner`, `50` olarak korunur,
3. tam `1` doğrulanmış parent recipe canonical `innerCornerPanelItemKey` kullanır,
4. inner-corner çözümünde `panel_48_5 × N` tamamen kaldırılır ve `panel_corner_42_5 × N` **aynı miktarla** gelir,
5. diğer recipe kalemlerinin quantity değerleri değişmez,
6. straight panel + corner panel duplicate quantity oluşmaz.

## 10. Açık sistem konusu

Project placement/relationship state'inden `panelVariant = inner-corner` kararını otomatik üretip tüm proje için Final BOM oluşturan project-level canonical resolver bu Item migrationının dışında kalır. Item-level replacement kuralı doğrulanmış ve callable durumdadır; scene geometry'den otomatik Final BOM çıkarımı ayrı sistem işidir ve bu Item'ın kimlik/BOM migrationını bloke etmez.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = panel_corner_42_5
type = panel
unit = adet
dimensions = 42,5 × 47 × 0.8 cm
panelRole = inner-corner
nominalModuleWidthCm = 50
canonical parent variant refs = 1
replacement rule = panel_48_5 × N -> panel_corner_42_5 × N (1:1)
state/persistence/renderer = uygulanmıyor
project-level relationship -> Final BOM = açık sistem işi
```
