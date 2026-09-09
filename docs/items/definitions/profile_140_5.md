# profile_140_5 — Item Contract Definition

Bu belge `profile_140_5` Item'ının canonical Item Contract tanımını kaydeder. Migration öncesi mevcut kod zinciri `docs/items/current-system/profile_140_5.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `profile_140_5` | VAR |
| `type` | `profile` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `dimensions.lengthCm` | `140.5` | VAR |
| `dimensions.thicknessCm` | `8` | VAR |

Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.profile_140_5` kaydıdır. Legacy `partId` kaldırılmıştır; paralel ikinci ürün kimliği oluşturulmamıştır. `thicknessCm = 8` gerçek ürün ölçüsü olarak bu migration turunda doğrulanmıştır.

## 2. Factory / catalog / state / persistence

- Project-instance factory: **UYGULANMIYOR**.
- Doğrudan catalog kaydı: **UYGULANMIYOR**; parent modüller catalog'dadır.
- Ayrı mutable Item state veya project `id`: **UYGULANMIYOR**.
- Ayrı persistence entity/schema/save-load migration: **UYGULANMIYOR**.

## 3. Behavior / interaction / renderer

Placement, move, rotation, collision, snap, selection, drag, context-menu ve keyboard davranışları bu production leaf Item için **UYGULANMIYOR**.

Procedural renderer production identity'yi tüketmez. Current-system doğrulamasında 150 cm modüllerin benzer rail geometrileri yaklaşık 140.8 / 142 cm gibi değerlerle üretilebilir; production `140.5 cm` metadata'sı renderer source-of-truth'u değildir.

## 4. Parent recipe kullanımı ve quantity ownership

`profile_140_5` tam **8** doğrulanmış parent recipe'de kullanılır:

| Recipe | Quantity |
|---|---:|
| `wall-straight-150` | 2 |
| `shelf-wall-150-2` | 2 |
| `shelf-wall-150-3` | 2 |
| `counter-l-150` | 5 |
| `counter-l-200` | 1 |
| `counter-150` | 3 |
| `base-wall-150` | 4 |
| `base-150` | 4 |

Quantity sahibi parent recipe'dir; migration miktarları değiştirmez. Recipe satırları canonical `{ itemKey: 'profile_140_5', quantity: N }` olur.

## 5. BOM / composition / pricing

`profile_140_5` **Tekil Item**dır; alt Item composition'ı yoktur. Recipe expansion mevcut `getRecipeItemKey()` → `getProductionItem()` yolunu kullanır.

- Recursive BOM: **UYGULANMIYOR**.
- Pricing/costing: **UYGULANMIYOR**.
- Spatial relationship-derived BOM: **UYGULANMIYOR**.

## 6. Regression sözleşmesi

1. canonical `itemKey = profile_140_5`; legacy `partId` yoktur,
2. `profile / adet / 140.5 cm / 8 cm thickness` metadata korunur,
3. tam 8 parent recipe canonical kimlik kullanır,
4. quantity parity `2, 2, 2, 5, 1, 3, 4, 4` korunur,
5. expanded recipe metadata canonical Item üzerinden çözülür,
6. L200 içindeki `×1` dahil tüm çapraz-width kullanımlar korunur,
7. `thicknessCm = 8` canonical metadata ve expanded recipe çözümünde korunur; renderer için yeni business rule eklenmez.

## Checklist sonucu

```text
canonical itemKey                       VAR
production metadata                     VAR
type/unit/length/thickness              VAR
single Item structure                   VAR
parent recipe BOM usage                 VAR (8)
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
