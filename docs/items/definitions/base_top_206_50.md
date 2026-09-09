# base_top_206_50 — Item Contract Definition

Bu belge `base_top_206_50` Item'ının canonical Item Contract tanımını kaydeder. Migration öncesi mevcut kod zinciri `docs/items/current-system/base_top_206_50.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `base_top_206_50` | VAR |
| `type` | `base-top` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `dimensions.widthCm` | `206` | VAR |
| `dimensions.depthCm` | `50` | VAR |
| `dimensions.thicknessCm` | `1.8` | VAR — ürün kararıyla doğrulandı |
| `nominalModuleWidthCm` | `200` | VAR |

Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.base_top_206_50` kaydıdır. Legacy `partId` kaldırılır; paralel ikinci ürün kimliği oluşturulmaz.

Malzeme kararı: baza üstü suntadır ve üretim kalınlığı **1.8 cm** olarak doğrulanmıştır. Bu değer renderer geometrisinden türetilmez; canonical production metadata'dır.

## 2. Factory / catalog / state / persistence

- Project-instance factory: **UYGULANMIYOR**; bu production leaf Item bağımsız scene/project instance değildir.
- Doğrudan catalog kaydı: **UYGULANMIYOR**; parent catalog Item'ları `BASE_200` ve `wall_base_200`'dır.
- Ayrı mutable Item state veya project `id`: **UYGULANMIYOR**.
- Ayrı persistence entity/schema/save-load migration: **UYGULANMIYOR**.

Parent base/base-wall state mevcut generic module state akışında persist edilir; `base_top_206_50` ayrı production instance olarak saklanmaz.

## 3. Behavior / interaction / renderer

Placement, move, rotation, collision, snap, selection, drag, context-menu ve keyboard davranışları bu production leaf Item için bağımsız runtime davranış değildir: **UYGULANMIYOR**.

Renderer base/base-wall geometrisini procedural üretir ve production metadata'yı mesh source-of-truth olarak tüketmez. `1.8 cm` üretim kalınlığı BOM/production metadata'dır; renderer business rule'u olarak ikinci kez tanımlanmaz.

## 4. Parent recipe kullanımı ve quantity ownership

`base_top_206_50` tam **2** aktif parent recipe'de kullanılır:

| Recipe | Quantity |
|---|---:|
| `base-200` | 1 |
| `base-wall-200` | 1 |

Quantity sahibi parent recipe'dir. Migration miktarı değiştirmez; iki satır da canonical `{ itemKey: 'base_top_206_50', quantity: 1 }` kimliğine taşınır.

## 5. BOM / composition / pricing

`base_top_206_50` başka Item'lardan oluşmaz; **Tekil Item**dır. Recipe expansion mevcut `getRecipeItemKey()` → `getProductionItem()` yolunu kullanır.

- Recursive BOM: **UYGULANMIYOR**.
- Pricing/costing: **UYGULANMIYOR**; Item/BOM gereken Item, miktar ve `adet` birimini üretir.
- Spatial relationship-derived BOM: **UYGULANMIYOR**.

## 6. Regression sözleşmesi

`test/baseTopsItemContract.test.js` ve mevcut base/base-wall recipe testleri şunları kilitler:

1. canonical `itemKey = base_top_206_50`; legacy `partId` yoktur,
2. `type = base-top`, `unit = adet`, `206 × 50 × 1.8 cm` metadata korunur,
3. `nominalModuleWidthCm = 200` korunur,
4. tam iki parent recipe canonical kimlik kullanır,
5. her iki recipe'de quantity `×1` korunur,
6. expanded recipe canonical Item metadata'sını çözer,
7. renderer/state/persistence için yeni bağımsız production-instance davranışı icat edilmez.

## Checklist sonucu

```text
canonical itemKey                       VAR
production metadata                     VAR
type/unit/dimensions                    VAR
verified thicknessCm = 1.8              VAR
single Item structure                   VAR
parent recipe BOM usage                 VAR (2)
canonical recipe identity               VAR
quantity ownership                      VAR (parent recipe)
factory/catalog instance                UYGULANMIYOR
mutable state / project id              UYGULANMIYOR
persistence                             UYGULANMIYOR
behavior / interaction                  UYGULANMIYOR
renderer identity mapping               UYGULANMIYOR
spatial relationship                    UYGULANMIYOR
recursive BOM                           UYGULANMIYOR
pricing                                 UYGULANMIYOR
regression                              VAR
```
