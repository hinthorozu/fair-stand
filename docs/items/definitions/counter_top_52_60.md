# counter_top_52_60 — Item Contract Definition

Bu belge `counter_top_52_60` Item'ının canonical Item Contract tanımını kaydeder. Migration öncesi mevcut kod zinciri `docs/items/current-system/counter_top_52_60.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `counter_top_52_60` | VAR |
| `type` | `counter-top` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `dimensions.widthCm` | `52` | VAR |
| `dimensions.depthCm` | `60` | VAR |
| `dimensions.thicknessCm` | `1.8` | VAR — ürün kararıyla doğrulandı |
| `nominalModuleWidthCm` | `100` | VAR |

Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.counter_top_52_60` kaydıdır. Legacy `partId` kaldırılır; paralel ikinci ürün kimliği oluşturulmaz.

Üretim kalınlığı **1.8 cm** olarak doğrulanmıştır. Bu değer renderer geometrisinden türetilmez; canonical production metadata'dır.

## 2. Factory / catalog / state / persistence

- Project-instance factory: **UYGULANMIYOR**; bu production leaf Item bağımsız scene/project instance değildir.
- Doğrudan catalog kaydı: **UYGULANMIYOR**; parent catalog Item banko modülüdür.
- Ayrı mutable Item state veya project `id`: **UYGULANMIYOR**.
- Ayrı persistence entity/schema/save-load migration: **UYGULANMIYOR**.

Parent counter state generic module state akışında persist edilir; `counter_top_52_60` ayrı production instance olarak saklanmaz.

## 3. Behavior / interaction / renderer / UI sınırı

Placement, move, rotation, collision, snap, selection, drag, context-menu ve keyboard davranışları bu production leaf Item için bağımsız runtime davranış değildir: **UYGULANMIYOR**.

Renderer banko geometrisini procedural üretir ve production metadata'yı mesh source-of-truth olarak tüketmez. `1.8 cm` üretim kalınlığı BOM/production metadata'dır; renderer business rule'u olarak ikinci kez tanımlanmaz.

L100 mevcut Raw BOM parser akışında resolve edilebilir.

## 4. Parent recipe kullanımı ve quantity ownership

`counter_top_52_60` tam **1** aktif parent recipe'de kullanılır:

| Recipe | Quantity |
|---|---:|
| `counter-l-100` | 1 |

Quantity sahibi parent recipe'dir. Migration miktarı değiştirmez; ilgili satırlar canonical `{ itemKey: 'counter_top_52_60', quantity: 1 }` kimliğine taşınır.

## 5. BOM / composition / pricing

`counter_top_52_60` başka Item'lardan oluşmaz; **Tekil Item**dır. Recipe expansion mevcut `getRecipeItemKey()` → `getProductionItem()` yolunu kullanır.

- Recursive BOM: **UYGULANMIYOR**.
- Pricing/costing: **UYGULANMIYOR**; Item/BOM gereken Item, miktar ve `adet` birimini üretir.
- Spatial relationship-derived BOM: **UYGULANMIYOR**.

## 6. Regression sözleşmesi

`test/counterTopsItemContract.test.js` ve mevcut counter/L-counter recipe testleri şunları kilitler:

1. canonical `itemKey = counter_top_52_60`; legacy `partId` yoktur,
2. `type = counter-top`, `unit = adet`, `52 × 60 × 1.8 cm` metadata korunur,
3. `nominalModuleWidthCm = 100` korunur,
4. tam 1 parent recipe canonical kimlik kullanır,
5. her recipe'de quantity `×1` korunur,
6. expanded recipe canonical Item metadata'sını çözer,
7. renderer/state/persistence için yeni bağımsız production-instance davranışı icat edilmez.

## Checklist sonucu

```text
canonical itemKey                       VAR
production metadata                     VAR
type/unit/dimensions                    VAR
verified thicknessCm = 1.8              VAR
single Item structure                   VAR
parent recipe BOM usage                 VAR (1)
canonical recipe identity               VAR
quantity ownership                      VAR (parent recipe)
factory/catalog instance                UYGULANMIYOR
mutable state / project id              UYGULANMIYOR
persistence                             UYGULANMIYOR
behavior / interaction                  UYGULANMIYOR
renderer identity mapping               UYGULANMIYOR
item-owned Raw BOM UI                    UYGULANMIYOR
spatial relationship                    UYGULANMIYOR
recursive BOM                           UYGULANMIYOR
pricing                                 UYGULANMIYOR
regression                              VAR
```
