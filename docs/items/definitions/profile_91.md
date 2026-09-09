# profile_91 — Item Contract Definition

Bu belge `profile_91` Item'ının canonical Item Contract tanımını kaydeder. Migration öncesi mevcut kod zinciri `docs/items/current-system/profile_91.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `profile_91` | VAR |
| `type` | `profile` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `dimensions.lengthCm` | `91` | VAR |
| `dimensions.thicknessCm` | `8` | VAR |

Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.profile_91` kaydıdır. Legacy `partId` kaldırılmıştır; paralel ikinci ürün kimliği oluşturulmamıştır. `thicknessCm = 8` gerçek ürün ölçüsü olarak bu migration turunda doğrulanmıştır.

## 2. Factory / catalog / state / persistence

- Project-instance factory: **UYGULANMIYOR**.
- Doğrudan catalog kaydı: **UYGULANMIYOR**; parent modüller catalog'dadır.
- Ayrı mutable Item state veya project `id`: **UYGULANMIYOR**.
- Ayrı persistence entity/schema/save-load migration: **UYGULANMIYOR**.

## 3. Behavior / interaction / renderer

Placement, move, rotation, collision, snap, selection, drag, context-menu ve keyboard davranışları bu production leaf Item için **UYGULANMIYOR**.

Procedural renderer production identity'yi tüketmez. Current-system doğrulamasında benzer rail'ler bağlama göre yaklaşık 89 / 90.8 / 92 cm hesaplanır; production `91 cm` değeri renderer source-of-truth'u değildir.

## 4. Parent recipe kullanımı ve quantity ownership

`profile_91` tam **12** doğrulanmış parent recipe'de kullanılır:

| Recipe | Quantity |
|---|---:|
| `wall-straight-100` | 2 |
| `door-100` | 1 |
| `shelf-wall-100-2` | 2 |
| `shelf-wall-100-3` | 2 |
| `showcase-2-100` | 4 |
| `showcase-3-100` | 4 |
| `separator-100` | 2 |
| `counter-l-100` | 5 |
| `counter-l-150` | 1 |
| `counter-100` | 3 |
| `base-wall-100` | 4 |
| `base-100` | 4 |

Quantity sahibi parent recipe'dir; migration miktarları değiştirmez. Recipe satırları canonical `{ itemKey: 'profile_91', quantity: N }` olur.

## 5. BOM / composition / pricing

`profile_91` **Tekil Item**dır; alt Item composition'ı yoktur. Recipe expansion mevcut `getRecipeItemKey()` → `getProductionItem()` yolunu kullanır.

- Recursive BOM: **UYGULANMIYOR**.
- Pricing/costing: **UYGULANMIYOR**.
- Spatial relationship-derived BOM: **UYGULANMIYOR**.

## 6. Regression sözleşmesi

1. canonical `itemKey = profile_91`; legacy `partId` yoktur,
2. `profile / adet / 91 cm / 8 cm thickness` metadata korunur,
3. tam 12 parent recipe canonical kimlik kullanır,
4. quantity parity `2, 1, 2, 2, 4, 4, 2, 5, 1, 3, 4, 4` korunur,
5. expanded recipe metadata canonical Item üzerinden çözülür,
6. `thicknessCm = 8` canonical metadata ve expanded recipe çözümünde korunur; renderer için yeni business rule eklenmez.

## Checklist sonucu

```text
canonical itemKey                       VAR
production metadata                     VAR
type/unit/length/thickness              VAR
single Item structure                   VAR
parent recipe BOM usage                 VAR (12)
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
verified thickness                      VAR (8 cm)
regression                              VAR
```
