# profile_41_5 — Item Contract Definition

Bu belge `profile_41_5` Item'ının canonical Item Contract tanımını kaydeder. Migration öncesi mevcut kod zinciri `docs/items/current-system/profile_41_5.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `profile_41_5` | VAR |
| `type` | `profile` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `dimensions.lengthCm` | `41.5` | VAR |
| `dimensions.thicknessCm` | `8` | VAR |

Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.profile_41_5` kaydıdır. Legacy `partId` kaldırılmıştır; paralel ikinci ürün kimliği oluşturulmamıştır. `thicknessCm = 8` gerçek ürün ölçüsü olarak bu migration turunda doğrulanmıştır.

## 2. Factory / catalog / state / persistence

- Project-instance factory: **UYGULANMIYOR**; bu Item bağımsız scene/project instance değildir.
- Doğrudan catalog kaydı: **UYGULANMIYOR**; parent modüller catalog'dadır.
- Ayrı mutable Item state veya project `id`: **UYGULANMIYOR**.
- Ayrı persistence entity/schema/save-load migration: **UYGULANMIYOR**.

## 3. Behavior / interaction / renderer

Placement, move, rotation, collision, snap, selection, drag, context-menu ve keyboard davranışları bu production leaf Item'a ait bağımsız runtime davranışlar değildir: **UYGULANMIYOR**.

Procedural renderer `profile_41_5` production identity'sini tüketmez. Current-system doğrulamasında benzer rail geometrileri bağlama göre yaklaşık 39 / 40.8 / 42 cm hesaplanır; bu nedenle renderer geometrisi production `41.5 cm` metadata'sına zorla bağlanmaz.

## 4. Parent recipe kullanımı ve quantity ownership

`profile_41_5` tam **14** doğrulanmış parent recipe'de kullanılır. Quantity sahibi parent recipe'dir:

| Recipe | Quantity |
|---|---:|
| `wall-straight-50` | 2 |
| `separator-50` | 2 |
| `counter-l-100` | 5 |
| `counter-l-150` | 4 |
| `counter-l-200` | 4 |
| `counter-100` | 4 |
| `counter-150` | 4 |
| `counter-200` | 4 |
| `base-wall-100` | 4 |
| `base-wall-150` | 4 |
| `base-wall-200` | 4 |
| `base-100` | 4 |
| `base-150` | 4 |
| `base-200` | 4 |

Migration bu miktarların hiçbirini değiştirmez. Recipe satırları canonical `{ itemKey: 'profile_41_5', quantity: N }` kimliğine taşınır.

## 5. BOM / composition / pricing

`profile_41_5` başka Item'lardan oluşmaz; **Tekil Item**dır. Canonical recipe expansion mevcut `getRecipeItemKey()` → `getProductionItem()` yolunu kullanır.

- Recursive BOM: **UYGULANMIYOR**.
- Pricing/costing: **UYGULANMIYOR**; Item/BOM gereken Item, miktar ve `adet` birimini üretir.
- Spatial relationship-derived BOM: **UYGULANMIYOR**.

## 6. Regression sözleşmesi

`test/profilesItemContract.test.js` ve ilgili recipe testleri şunları kilitler:

1. canonical `itemKey = profile_41_5`; legacy `partId` yoktur,
2. `type = profile`, `unit = adet`, `lengthCm = 41.5`, `thicknessCm = 8` korunur,
3. tam 14 parent recipe canonical `itemKey` kullanır,
4. quantity parity `2, 2, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4` olarak korunur,
5. expanded recipe metadata canonical Item identity ile çözülür,
6. `thicknessCm = 8` canonical metadata ve expanded recipe çözümünde korunur; renderer mapping'i icat edilmez.

## Checklist sonucu

```text
canonical itemKey                       VAR
production metadata                     VAR
type/unit/length/thickness              VAR
single Item structure                   VAR
parent recipe BOM usage                 VAR (14)
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
