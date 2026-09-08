# profile_190 — Item Contract Definition

Bu belge `profile_190` Item'ının canonical Item Contract tanımını kaydeder. Migration öncesi mevcut kod zinciri `docs/items/current-system/profile_190.md` içindedir.

## 1. Kimlik ve sınıflandırma

| Alan | Canonical değer | Durum |
|---|---|---|
| `itemKey` | `profile_190` | VAR |
| `type` | `profile` | VAR |
| Yapı | Tekil Item | VAR |
| Parametrik | hayır | UYGULANMIYOR |
| `unit` | `adet` | VAR |
| `dimensions.lengthCm` | `190` | VAR |
| `dimensions.thicknessCm` | `8` | VAR |

`thicknessCm = 8` gerçek ürün ölçüsü olarak migration sırasında doğrulanmıştır. Canonical production kaydı `src/productionParts.js` içindeki `PRODUCTION_PARTS.profile_190` kaydıdır. Legacy `partId` kaldırılmış, paralel ikinci ürün kimliği oluşturulmamıştır.

## 2. Composition / parent recipe kullanımı

`profile_190` başka Item'lardan oluşmaz; kendisi **Tekil Item**dır. Quantity sahibi parent recipe'dir. Tam yedi doğrulanmış parent recipe kullanımı vardır:

| Recipe | Quantity |
|---|---:|
| `wall-straight-200` | 2 |
| `shelf-wall-200-2` | 2 |
| `shelf-wall-200-3` | 2 |
| `counter-l-200` | 5 |
| `counter-200` | 3 |
| `base-wall-200` | 4 |
| `base-200` | 4 |

Migration bu miktarların hiçbirini değiştirmez.

## 3. BOM / üretim mapping'i

Canonical production/BOM bilgisi:

```text
itemKey = profile_190
quantity = parent recipe'den
unit = adet
dimensions = 190 × 8 cm
```

Recipe expansion mevcut `getRecipeItemKey()` → `getProductionItem()` yolunu kullanır. Ayrı quantity resolver veya pricing mantığı eklenmez.

## 4. Factory / catalog / state / persistence

- Project-instance factory: **UYGULANMIYOR**.
- Doğrudan catalog Item kaydı: **UYGULANMIYOR**; parent modüller catalog'dadır.
- Ayrı mutable instance state / project `id`: **UYGULANMIYOR**.
- Ayrı persistence entity/schema veya save/load migration: **UYGULANMIYOR**.

## 5. Behavior / interaction

Placement, move, snap, rotation, collision, selection, drag, context-menu, duplicate ve delete davranışları `profile_190` production Item'ına ait bağımsız runtime davranışlar değildir. Bu alanların tamamı bu Item için **UYGULANMIYOR**; parent module davranışları korunur.

## 6. Renderer ayrımı

Mevcut procedural renderer `profile_190` production identity'sini tüketmez ve render mesh'leri `profile_190` ile etiketlenmez. Production recipe miktarları ile procedural rail/profile mesh'leri arasında doğrulanmış canonical birebir mapping yoktur.

Bu nedenle migration yalnız identity/BOM cutover yapar; renderer geometrisi production metadata'sına zorla bağlanmaz.

## 7. Pricing

Pricing bu Item zincirinde **UYGULANMIYOR**. Item/BOM gereken Item, quantity ve unit bilgisini taşır; maliyet/fiyatlandırma ayrı sorumluluktur.

## 8. Migration izolasyonu

Yalnız `profile_190` migrate edilmiştir. Komşu profile Item'ları bu migration kapsamı dışında kalır:

```text
profile_41_5  -> legacy partId
profile_91    -> legacy partId
profile_140_5 -> legacy partId
profile_190   -> canonical itemKey
```

## 9. Regression sözleşmesi

`test/profile190ItemContract.test.js` ve ilgili recipe testleri şunları kilitler:

1. canonical `itemKey = profile_190`; legacy `partId` yoktur,
2. `type = profile`, `unit = adet`, dimensions `190 × 8` korunur,
3. tam 7 parent recipe canonical `itemKey` kullanır,
4. quantity parity `2, 2, 2, 5, 3, 4, 4` olarak korunur,
5. expanded recipe production metadata'yı canonical kimlikle çözer,
6. `profile_41_5`, `profile_91`, `profile_140_5` yanlışlıkla migrate edilmez.

## 10. Açık sistem konuları

Project-level canonical Final BOM eksikliği ve production Item ile procedural renderer geometrisi arasındaki genel mapping konusu bu Tekil Item identity migrationının dışında kalır. Bu migration bu sistem problemlerini gizlice çözmeye çalışmaz.

## Sonuç

```text
structure = Tekil Item
parametric = hayır
itemKey = profile_190
type = profile
unit = adet
dimensions = 190 × 8 cm
active parent recipes = 7
quantities = 2 / 2 / 2 / 5 / 3 / 4 / 4
state/persistence/behavior/interaction = uygulanmıyor
renderer cutover = yok
```
