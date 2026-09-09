# shelf_leg — Item Contract Definition

## Canonical Item

- `itemKey`: `shelf_leg`
- `name`: `Raf Ayağı`
- `type`: `shelf-accessory`
- `unit`: `adet`

Şu anda doğrulanmış `dimensions`, ağırlık, `material`, `defaultColor` veya başka fiziksel product metadata yoktur. Bu alanlar tahmin edilmez; ürün gerçeği doğrulandığında canonical Item'a eklenecektir.

## Ownership

Canonical kimlik ve mevcut metadata source-of-truth'u `PRODUCTION_PARTS.shelf_leg` kaydıdır. `shelf_leg` ayrı project entity değildir; placement, move, rotation, snap/collision/connection, selection/drag, context menu, delete/duplicate/keyboard, persistence ve reflow parent `shelf` module/type tarafından uygulanır.

## BOM / composition

- `shelf:100:2` → `shelf_leg ×4`
- `shelf:150:2` → `shelf_leg ×4`
- `shelf:200:2` → `shelf_leg ×6`
- `shelf:100:3` → `shelf_leg ×6`
- `shelf:150:3` → `shelf_leg ×6`
- `shelf:200:3` → `shelf_leg ×9`

Bu migration yalnız legacy `partId` kimliğini canonical `itemKey` kimliğine taşır; adet kuralları değişmez.

## Renderer / persistence

Ayrı `shelf_leg` render mesh'i veya persisted instance'ı yoktur. Renderer BOM source-of-truth değildir; parent shelf runtime davranışı değişmez.
